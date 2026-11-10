"use client";

import "@xyflow/react/dist/style.css";

import {
	ReactFlow,
	ReactFlowProvider,
	useReactFlow,
	type Edge,
	type NodeTypes,
} from "@xyflow/react";
import { useCallback, useMemo } from "react";
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
 */

const nodeTypes: NodeTypes = { "org-card": OrgCardNode, "org-line": OrgLineNode };

const toEdge = (edge: Edge): Edge => ({
	...edge,
	type: edge.type ?? "smoothstep",
	style: edge.style ?? { stroke: ORG_EDGE_COLOR, strokeWidth: ORG_EDGE_WIDTH },
});

function ViewerInner({ document }: { document: OrgChartDocument }) {
	const { fitView } = useReactFlow();
	// Normalize document cũ (members → rows) nếu DB còn dữ liệu trước khi chuyển rows
	const normalized = useMemo(() => normalizeOrgChartDocument(document), [document]);

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
				proOptions={{ hideAttribution: false }}
			/>
			<button
				type="button"
				onClick={handleZoomToFit}
				className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-md border border-[#e1e7ed] bg-white px-3 py-1.5 text-xs font-medium text-[#20364b] shadow-sm hover:bg-slate-50"
				aria-label="Hiển thị toàn bộ sơ đồ"
			>
				<Maximize2 className="h-3.5 w-3.5" />
				Vừa khung
			</button>
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
