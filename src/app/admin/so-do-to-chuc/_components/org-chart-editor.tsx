"use client";

import "@xyflow/react/dist/style.css";

import {
	addEdge,
	Background,
	BackgroundVariant,
	Controls,
	ReactFlow,
	ReactFlowProvider,
	useEdgesState,
	useNodesState,
	useOnSelectionChange,
	useReactFlow,
	useUpdateNodeInternals,
	type Connection,
	type Edge,
	type NodeChange,
	type NodeTypes,
} from "@xyflow/react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { OrgCardNode } from "@/components/org-chart/OrgCardNode";
import { OrgLineNode } from "@/components/org-chart/OrgLineNode";
import { OrgChartEditorContext } from "@/components/org-chart/editor-context";
import {
	normalizeOrgChartDocument,
	ORG_CARD_WIDTH,
	ORG_EDGE_COLOR,
	ORG_EDGE_WIDTH,
	type OrgCardNodeData,
	type OrgCardNodeType,
	type OrgLineNodeData,
	type OrgLineNodeType,
	type OrgChartDocument,
	type OrgChartNodeDTO,
} from "@/components/org-chart/types";

/**
 * Canvas React Flow cho trang admin /admin/so-do-to-chuc.
 *
 * - Nạp document (đã fetch từ API) vào nodes/edges state.
 * - Controller (onReady) cho page điều khiển từ thanh hành động: thêm card,
 *   lấy document để lưu, sửa/xoá card đang chọn, nạp lại document (undo/redo),
 *   fit view, đăng ký selection/document-change.
 * - Admin tương tác trực tiếp trên canvas: kéo card, kéo Handle dưới card này
 *   tới Handle trên card khác để nối, phím Delete/Backspace để xoá.
 *
 * Component phải được load bằng next/dynamic với ssr: false.
 */

const nodeTypes: NodeTypes = { "org-card": OrgCardNode, "org-line": OrgLineNode };

const defaultEdgeStyle = { stroke: ORG_EDGE_COLOR, strokeWidth: ORG_EDGE_WIDTH };

export type OrgChartEditorController = {
	/** Thêm card mới tại giữa viewport */
	addCard: () => void;

	/** Thêm đường kẻ tự do tại giữa viewport */
	addLine: () => void;
	/** Document hiện tại (serialize gọn để lưu DB) */
	getDocument: () => OrgChartDocument;
	/** Nạp lại document (dùng cho undo/redo) */
	applyDocument: (document: OrgChartDocument) => void;
	/** Sửa data của node đang chọn (card hoặc đường kẻ) */
	updateSelectedData: (partial: Partial<OrgCardNodeData> | Partial<OrgLineNodeData>) => void;
	/** Xoá các card đang chọn */
	deleteSelected: () => void;
	/** Đưa sơ đồ về vừa khung */
	fitView: () => void;
	/** Đăng ký nhận card đang chọn thay đổi */
	subscribeSelection: (cb: (node: OrgCardNodeType | OrgLineNodeType | null) => void) => void;
	/** Đăng ký nhận sự kiện document thay đổi (dirty + undo history) */
	subscribeDocumentChange: (cb: () => void) => void;
};

const toNodeDTO = (node: OrgCardNodeType | OrgLineNodeType): OrgChartNodeDTO => ({
	id: node.id,
	type: node.type as "org-card" | "org-line",
	position: { x: node.position.x, y: node.position.y },
	data: node.data,
});

const toEdgeDTO = (edge: Edge): Edge => ({
	id: edge.id,
	source: edge.source,
	target: edge.target,
	type: "smoothstep",
	style: { ...defaultEdgeStyle },
});

const makeNodeId = () =>
	`card-${(typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}${Math.random()}`).slice(0, 8)}`;

function EditorInner({
	initialDocument,
	onReady,
}: {
	initialDocument: OrgChartDocument | null;
	onReady?: (controller: OrgChartEditorController) => void;
}) {
	const { screenToFlowPosition, fitView, deleteElements } = useReactFlow();
	const updateNodeInternals = useUpdateNodeInternals();

	// Normalize document cũ (members → rows) trước khi nạp vào canvas
	const normalizedDocument = useMemo(
		() => (initialDocument ? normalizeOrgChartDocument(initialDocument) : null),
		[initialDocument],
	);
	const initialNodes = useMemo(
		() => (normalizedDocument?.nodes ?? []) as (OrgCardNodeType | OrgLineNodeType)[],
		[normalizedDocument],
	);
	const initialEdges = useMemo(
		() => (initialDocument?.edges ?? []).map(toEdgeDTO),
		[initialDocument],
	);

	const [nodes, setNodes, onNodesChangeBase] = useNodesState<OrgCardNodeType | OrgLineNodeType>(initialNodes);
	const [edges, setEdges, onEdgesChangeBase] = useEdgesState<Edge>(initialEdges);

	// Refs luôn đọc được state mới nhất trong controller (expose một lần duy nhất)
	const nodesRef = useRef(nodes);
	const edgesRef = useRef(edges);
	const selectionCb = useRef<((node: OrgCardNodeType | OrgLineNodeType | null) => void) | null>(null);
	const documentChangeCb = useRef<(() => void) | null>(null);

	useLayoutEffect(() => {
		nodesRef.current = nodes;
		edgesRef.current = edges;
	});

	// iOS Safari fix (như viewer): ảnh + font load chậm hơn lần đo đầu của RF →
	// edge neo sai vị trí "đáy card cũ". Đợi assets load xong → đo lại node
	// internals để edge vẽ lại theo vị trí handle thật.
	useEffect(() => {
		let cancelled = false;

		const remeasure = () => {
			if (cancelled) return;
			nodesRef.current
				.filter((n) => n.type === "org-card")
				.forEach((n) => updateNodeInternals(n.id));
		};

		const fontsReady =
			typeof window !== "undefined" && window.document.fonts
				? window.document.fonts.ready.then(() => undefined)
				: Promise.resolve();

		const imagesReady = Promise.allSettled(
			Array.from(window.document.querySelectorAll<HTMLElement>(".react-flow__node img")).map(
				(img) =>
					img instanceof HTMLImageElement && !img.complete
						? new Promise<void>((resolve) => {
								img.addEventListener("load", () => resolve(), { once: true });
								img.addEventListener("error", () => resolve(), { once: true });
							})
						: Promise.resolve(),
			),
		);

		Promise.all([fontsReady, imagesReady])
			.then(() => new Promise((resolve) => requestAnimationFrame(() => resolve(null))))
			.then(() => new Promise((resolve) => setTimeout(resolve, 50)))
			.then(remeasure);

		return () => {
			cancelled = true;
		};
	}, [updateNodeInternals]);

	const notifyDocumentChange = useCallback(() => {
		documentChangeCb.current?.();
	}, []);

	const onNodesChange = useCallback(
		(changes: NodeChange<OrgCardNodeType | OrgLineNodeType>[]) => {
			onNodesChangeBase(changes);
			notifyDocumentChange();
		},
		[onNodesChangeBase, notifyDocumentChange],
	);

	const onConnect = useCallback(
		(connection: Connection) => {
			setEdges((current) =>
				addEdge(
					{
						...connection,
						id: `edge-${connection.source}--${connection.target}`,
						type: "smoothstep",
						style: { ...defaultEdgeStyle },
					},
					current,
				),
			);
			notifyDocumentChange();
		},
		[setEdges, notifyDocumentChange],
	);

	// ID node đang chọn + phát node MỚI NHẤT mỗi khi nodes thay đổi. Quan trọng:
	// Inspector phải nhận object node mới sau mỗi lần updateSelectedData, nếu giữ
	// snapshot cũ thì controlled input sẽ revert ký tự vừa gõ (bug "input không hiện gì").
	const selectedIdRef = useRef<string | null>(null);

	const emitSelection = useCallback(() => {
		const id = selectedIdRef.current;
		const node = id ? nodesRef.current.find((n) => n.id === id) : null;
		selectionCb.current?.((node as OrgCardNodeType | OrgLineNodeType) ?? null);
	}, []);

	useOnSelectionChange({
		onChange: ({ nodes: selected }) => {
			const selectedNode = selected.find(
				(node) => node.type === "org-card" || node.type === "org-line",
			);
			selectedIdRef.current = selectedNode?.id ?? null;
			emitSelection();
		},
	});

	// nodes đổi (sửa data, drag, undo/redo...) → phát lại node mới nhất cho Inspector
	useEffect(() => {
		emitSelection();
	}, [nodes, emitSelection]);

	// Expose controller một lần sau mount — mọi method đọc state qua refs
	useEffect(() => {
		const controller: OrgChartEditorController = {
			addCard: () => {
				const center = screenToFlowPosition({
					x: window.innerWidth / 2,
					y: window.innerHeight / 2,
				});
				const newNode: OrgCardNodeType = {
					id: makeNodeId(),
					type: "org-card",
					position: { x: center.x - ORG_CARD_WIDTH / 2, y: center.y - 70 },
					data: {
						w: ORG_CARD_WIDTH,
						variant: "person",
						departmentTitle: "",
						featured: false,
						rows: [{ kind: "text", align: "left", text: "Thành viên mới", fontSize: 16, bold: true }],
					},
				};
				setNodes((current) => [...current, newNode]);
				notifyDocumentChange();
			},
			addLine: () => {
				const center = screenToFlowPosition({
					x: window.innerWidth / 2,
					y: window.innerHeight / 2,
				});
				const newNode: OrgLineNodeType = {
					id: `line-${Date.now().toString(36)}`,
					type: "org-line",
					position: { x: center.x - 100, y: center.y },
					data: {
						length: 200,
						rotation: 0,
						color: "#20364b",
						thickness: 2,
						dashed: false,
					},
				};
				setNodes((current) => [...current, newNode]);
				notifyDocumentChange();
			},
			getDocument: () => ({
				version: 2,
				nodes: nodesRef.current.map(toNodeDTO),
				edges: edgesRef.current.map(toEdgeDTO),
			}),
			applyDocument: (document) => {
				setNodes((normalizeOrgChartDocument(document)?.nodes ?? []) as (OrgCardNodeType | OrgLineNodeType)[]);
				setEdges((document?.edges ?? []).map(toEdgeDTO));
				notifyDocumentChange();
			},
			updateSelectedData: (partial) => {
				setNodes((current) =>
					current.map((node) =>
						node.selected
							? ({ ...node, data: { ...node.data, ...partial } } as OrgCardNodeType | OrgLineNodeType)
							: node,
					),
				);
				notifyDocumentChange();
			},
			deleteSelected: () => {
				const selectedNodes = nodesRef.current.filter((node) => node.selected);
				if (!selectedNodes.length) return;
				deleteElements({ nodes: selectedNodes });
				notifyDocumentChange();
			},
			fitView: () => {
				void fitView({ duration: 200 });
			},
			subscribeSelection: (cb) => {
				selectionCb.current = cb;
			},
			subscribeDocumentChange: (cb) => {
				documentChangeCb.current = cb;
			},
		};

		onReady?.(controller);
		// Controller ổn định (đọc state qua refs) — chỉ expose một lần
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<OrgChartEditorContext.Provider value={{ notifyDocumentChange }}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				onNodesChange={onNodesChange}
				onEdgesChange={(changes) => {
					onEdgesChangeBase(changes);
					notifyDocumentChange();
				}}
				onConnect={onConnect}
				deleteKeyCode={["Backspace", "Delete"]}
				defaultEdgeOptions={{ type: "smoothstep", style: { ...defaultEdgeStyle } }}
				fitView
				fitViewOptions={{ padding: 0.15 }}
				minZoom={0.1}
			>
				<Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#cbd5e1" />
				<Controls showInteractive={false} position="bottom-right" />
			</ReactFlow>
		</OrgChartEditorContext.Provider>
	);
}

export function OrgChartEditor({
	document,
	onReady,
}: {
	document: OrgChartDocument | null;
	onReady?: (controller: OrgChartEditorController) => void;
}) {
	return (
		<ReactFlowProvider>
			<EditorInner initialDocument={document} onReady={onReady} />
		</ReactFlowProvider>
	);
}

export default OrgChartEditor;
