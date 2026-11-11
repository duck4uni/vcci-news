"use client";

import "@xyflow/react/dist/style.css";

import {
	ReactFlow,
	ReactFlowProvider,
	useReactFlow,
	useUpdateNodeInternals,
	type Edge,
	type NodeTypes,
} from "@xyflow/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Maximize2 } from "lucide-react";
import { OrgCardNode } from "@/components/org-chart/OrgCardNode";
import { OrgLineNode } from "@/components/org-chart/OrgLineNode";
import {
	normalizeOrgChartDocument,
	ORG_EDGE_COLOR,
	ORG_EDGE_WIDTH,
	type OrgCardNodeType,
	type OrgChartDocument,
	type OrgLineNodeType,
} from "@/components/org-chart/types";

/**
 * Canvas React Flow chỉ đọc cho trang public /so-do-to-chuc.
 * - nodesDraggable/nodesConnectable/elementsSelectable = false → chỉ pan/zoom.
 * - fitView căn sơ đồ vừa khung khi mở trang + nút "Vừa khung" để quay lại.
 * - Cùng format document v2 với editor (xem ORG_CHART_REACTFLOW.md).
 * Component phải được load bằng next/dynamic với ssr: false.
 *
 * iOS Safari fix: ảnh chân dung + font load CHẬM hơn so với lúc React Flow đo
 * chiều cao card lần đầu → edge neo vào vị trí "đáy card cũ" và không tự vẽ
 * lại khi card giãn ra → các đường nối bị chọc lệch lung tung. Giải pháp: đợi
 * TẤT CẢ ảnh trong node load xong (Promise.all decode) rồi mới gọi
 * updateNodeInternals() để RF đo lại handle + vẽ lại edge.
 */

const nodeTypes: NodeTypes = { "org-card": OrgCardNode, "org-line": OrgLineNode };

const toEdge = (edge: Edge): Edge => ({
	...edge,
	type: edge.type ?? "smoothstep",
	style: edge.style ?? { stroke: ORG_EDGE_COLOR, strokeWidth: ORG_EDGE_WIDTH },
});

function ViewerInner({ document }: { document: OrgChartDocument }) {
	const { fitView } = useReactFlow();
	const updateNodeInternals = useUpdateNodeInternals();
	// Normalize document cũ (members → rows) nếu DB còn dữ liệu trước khi chuyển rows
	const normalized = useMemo(() => normalizeOrgChartDocument(document), [document]);
	const [assetsReady, setAssetsReady] = useState(false);

	// Đợi ảnh trong card load + font ready rồi đo lại toàn bộ node internals.
	// Không có ảnh nào / load lỗi cũng phải tiếp tục (Promise.allSettled).
	useEffect(() => {
		let cancelled = false;

		const remeasure = () => {
			if (cancelled) return;
			setAssetsReady(true);
			// RF v12: yêu cầu đo lại handle của TẤT CẢ node → edge vẽ lại theo vị trí mới
			const cardIds = (normalized?.nodes ?? [])
				.filter((n) => n.type === "org-card")
				.map((n) => n.id);
			cardIds.forEach((id) => updateNodeInternals(id));
			// fitView lại sau khi mọi card có kích thước thật
			requestAnimationFrame(() => {
				void fitView({ duration: 0, padding: 0.15 });
			});
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

		// Nới thêm 1 frame cho layout ổn định sau khi ảnh decode
		Promise.all([fontsReady, imagesReady])
			.then(() => new Promise((resolve) => requestAnimationFrame(() => resolve(null))))
			.then(() => new Promise((resolve) => setTimeout(resolve, 50)))
			.then(remeasure);

		return () => {
			cancelled = true;
		};
	}, [normalized, updateNodeInternals, fitView]);

	const handleZoomToFit = useCallback(() => {
		void fitView({ duration: 200 });
	}, [fitView]);

	return (
		<div className="relative h-full w-full">
			<ReactFlow
				nodes={(normalized?.nodes ?? []) as (OrgCardNodeType | OrgLineNodeType)[]}
				edges={(normalized?.edges ?? []).map(toEdge)}
				nodeTypes={nodeTypes}
				nodesDraggable={false}
				nodesConnectable={false}
				nodesFocusable={false}
				edgesFocusable={false}
				elementsSelectable={false}
				deleteKeyCode={null}
				fitView
				fitViewOptions={{ padding: 0.15 }}
				minZoom={0.1}
				// Tránh nhấp nháy sơ đồ trước khi đo lại xong: ẩn canvas đến khi ready
				style={{ visibility: assetsReady ? "visible" : "hidden" }}
				proOptions={{ hideAttribution: false }}
			/>
			{assetsReady ? (
				<button
					type="button"
					onClick={handleZoomToFit}
					className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-md border border-[#e1e7ed] bg-white px-3 py-1.5 text-xs font-medium text-[#20364b] shadow-sm hover:bg-slate-50"
					aria-label="Hiển thị toàn bộ sơ đồ"
				>
					<Maximize2 className="h-3.5 w-3.5" />
					Vừa khung
				</button>
			) : null}
		</div>
	);
}

export function OrgChartViewerCanvas({
	document,
}: {
	document: { version: number; nodes: unknown[]; edges: unknown[] };
}) {
	return (
		<div className="h-full w-full">
			<ReactFlowProvider>
				<ViewerInner document={document as OrgChartDocument} />
			</ReactFlowProvider>
		</div>
	);
}

export default OrgChartViewerCanvas;
