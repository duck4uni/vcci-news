"use client";

import { NodeResizer, useReactFlow, type NodeProps } from "@xyflow/react";
import { useContext } from "react";
import { OrgChartEditorContext } from "./editor-context";
import type { OrgLineNodeType } from "./types";

/**
 * Custom node "org-line": đường kẻ thẳng tự do của sơ đồ tổ chức — dùng để nối
 * hoặc ghi chú giữa các card (kiêm nhiệm, tham chiếu chéo...). Khác với edge,
 * đường kẻ KHÔNG binding với card: kéo card thì đường kẻ đứng nguyên, admin tự
 * đặt lại vị trí.
 *
 * - Vùng bấm cao hơn nét vẽ (HIT_AREA_HEIGHT) — nét 1-2px thì click trúng
 *   cực khó, đây là lý do trước đây "không chọn được đường kẻ".
 * - Editor: chọn node → NodeResizer cho giãn/thu chiều dài (sync ngược vào
 *   data.length để lưu DB); xoay/màu/nét trong Inspector. Node không có Handle
 *   nên không thể kéo nối như card.
 * - Viewer: render line thuần (không interactive).
 */

const HIT_AREA_HEIGHT = 18;

export function OrgLineNode({ id, data, selected }: NodeProps<OrgLineNodeType>) {
	const { length, rotation, color, thickness, dashed } = data;
	const { updateNodeData } = useReactFlow();
	const editorCtx = useContext(OrgChartEditorContext);

	return (
		// Xoay trên WHOLE wrapper với transform-origin tại ĐẦU TRÁI của đường kẻ:
		// position của node trong React Flow chính là đầu trái — kéo resize handle
		// bên trái thì đầu trái đi theo đúng tay kéo, đầu phải trượt dọc theo trục
		// đường kẻ. Trước đây xoay quanh tâm của nét vẽ bên trong nên kéo bên trái
		// làm cả hai đầu dịch lệch khác chiều (bug "bên trái không đúng hướng").
		<div
			style={{
				width: length,
				height: HIT_AREA_HEIGHT,
				display: "flex",
				alignItems: "center",
				transform: `rotate(${rotation}deg)`,
				transformOrigin: "left center",
				userSelect: "none",
				WebkitUserSelect: "none",
			}}
		>
			<NodeResizer
				isVisible={selected}
				minWidth={30}
				minHeight={HIT_AREA_HEIGHT}
				maxHeight={HIT_AREA_HEIGHT}
				lineStyle={{ borderColor: color }}
				handleStyle={{ width: 8, height: 8, background: color }}
				onResize={(_event, params) => {
					// Sync chiều dài wrapper về data để render + lưu DB đúng giá trị
					updateNodeData(id, { length: Math.round(params.width) });
					editorCtx?.notifyDocumentChange();
				}}
			/>
			<div
				style={{
					width: "100%",
					display: "flex",
					justifyContent: "center",
				}}
			>
				<div
					style={{
						width: "100%",
						height: thickness,
						boxSizing: "border-box",
						background: dashed ? "transparent" : color,
						borderTop: dashed ? `${thickness}px dashed ${color}` : undefined,
						borderRadius: dashed ? 0 : thickness / 2,
					}}
				/>
			</div>
		</div>
	);
}

export default OrgLineNode;
