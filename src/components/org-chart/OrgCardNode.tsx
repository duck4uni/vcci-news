"use client";

import { Handle, NodeResizer, Position, useReactFlow, type NodeProps } from "@xyflow/react";
import {
	ORG_CARD_COLOR,
	ORG_CARD_TEXT_COLOR,
	ORG_PHOTO_SIZE,
	type OrgCardNodeData,
	type OrgCardNodeType,
	type OrgCardRowAlign,
} from "./types";

/**
 * Custom node "org-card" của React Flow: card nhân sự / phòng ban của sơ đồ tổ
 * chức. Dùng chung cho editor (/admin/so-do-to-chuc) và viewer
 * (/so-do-to-chuc) — cùng format document v2 trong DB.
 *
 * Nội dung card có cấu trúc (title + members) → admin sửa qua Inspector panel,
 * không phải text editing. Node auto-height: React Flow tự đo DOM, không cần
 * set height.
 *
 * Handle ẩn top/bottom để edge neo đúng tâm trên/dưới card (như sơ đồ cũ) và
 * cho phép admin kéo nối card với nhau trong editor.
 */

const escapeHtml = (value: string) =>
	value.replace(/[&<>"']/g, (character) => {
		const entities: Record<string, string> = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': "&quot;",
			"'": "&#39;",
		};
		return entities[character] ?? character;
	});

const handleStyle: React.CSSProperties = {
	width: 9,
	height: 9,
	background: ORG_CARD_COLOR,
	border: "1px solid #fff",
	opacity: 0.55,
};

function OrgCardContent({ data }: { data: OrgCardNodeData }) {
	const { variant, departmentTitle, featured, rows } = data;
	const title = variant === "department" ? departmentTitle.trim() : "";
	const defaultTextColor = featured ? "#fff" : ORG_CARD_TEXT_COLOR;

	const alignToJustify = (align: OrgCardRowAlign) =>
		align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center";

	return (
		<div
			style={{
				boxSizing: "border-box",
				width: "100%",
				border: `1px solid ${ORG_CARD_COLOR}`,
				background: featured ? ORG_CARD_COLOR : "#fff",
				color: featured ? "#fff" : ORG_CARD_TEXT_COLOR,
				boxShadow: "0 5px 16px rgba(23,52,83,.08)",
				fontFamily: "Arial, sans-serif",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: "12px 16px",
				borderRadius: 2,
				// Chặn select text trên canvas — nội dung chỉ sửa qua Inspector panel
				// (double-click vào card sẽ không còn highlight text gây hiểu nhầm
				// là vào chế độ edit).
				userSelect: "none",
				WebkitUserSelect: "none",
			}}
		>
			<div
				style={{
					width: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					textAlign: "center",
				}}
			>
				{title ? (
					<div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, textAlign: "center", marginBottom: 10 }}>
						{escapeHtml(title)}
					</div>
				) : null}
				{rows.map((row, index) => {
					// Heuristic ranh giới "nhân viên" trong card: một khối user mới bắt
					// đầu bằng hàng ảnh (photo đầu khối) hoặc hàng chữ CÓ màu riêng
					// (dòng chức danh — converter từ members luôn gán màu cho role).
					// Dòng chữ thường trong khối: margin 2px. Giữa 2 user: 16px.
					// Giữa chữ và ảnh trong khối: 6px.
					const isUserBlockStart =
						row.kind === "image" ||
						(row.kind === "text" && Boolean(row.color));
					const marginTop =
						index === 0
							? 0
							: isUserBlockStart
								? 16
								: 2;

					if (row.kind === "image") {
						return (
							<div
								key={`${index}`}
								style={{
									width: "100%",
									display: "flex",
									justifyContent: alignToJustify(row.align),
									marginTop,
								}}
							>
								{row.src ? (
									// eslint-disable-next-line @next/next/no-img-element -- canvas flow, không dùng được Next Image
									<img
										src={row.src}
										alt={row.alt || ""}
										loading="lazy"
										style={{
											display: "block",
											width: ORG_PHOTO_SIZE,
											height: ORG_PHOTO_SIZE,
											objectFit: "contain",
											background: "#fff",
										}}
									/>
								) : (
									// Placeholder khi admin thêm hàng ảnh nhưng chưa chọn file
									<div
										style={{
											width: ORG_PHOTO_SIZE,
											height: ORG_PHOTO_SIZE,
											border: "2px dashed #cbd5e1",
											borderRadius: 4,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											fontSize: 12,
											color: "#94a3b8",
										}}
									>
										Chưa có ảnh
									</div>
								)}
							</div>
						);
					}

					return (
						<div
							key={`${index}`}
							style={{
								width: "100%",
								textAlign: row.align,
								marginTop,
								fontSize: row.fontSize ?? 16,
								fontWeight: row.bold === false ? 400 : 700,
								lineHeight: 1.5,
								color: row.color ?? defaultTextColor,
								// Xuống dòng theo TỪ (tại dấu cách), không cắt giữa chữ.
								// Riêng từ đơn quá dài (email, URL...) mới được phá ký tự.
								overflowWrap: "anywhere",
							}}
						>
							{escapeHtml(row.text)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

export function OrgCardNode({ id, data, isConnectable, selected }: NodeProps<OrgCardNodeType>) {
	const { updateNodeData } = useReactFlow();
	// Handle chỉ hiện ở editor (nodesConnectable=true) để kéo nối card; ở viewer
	// readonly thì ẩn hoàn toàn — nhưng vẫn giữ phần tử với kích thước 0/opacity 0
	// để edge tính đúng điểm neo đầu/cuối đường nối.
	const handleVisibility = isConnectable ? 0.55 : 0;

	return (
		<div style={{ width: data.w }}>
			<NodeResizer
				isVisible={isConnectable && selected}
				minWidth={160}
				minHeight={40}
				maxHeight={2000}
				lineStyle={{ borderColor: ORG_CARD_COLOR }}
				handleStyle={{ width: 8, height: 8, background: ORG_CARD_COLOR }}
				onResize={(_event, params) => {
					// Sync bề rộng card về data để lưu DB; chiều cao tự đo theo nội dung
					updateNodeData(id, { w: Math.round(params.width) });
				}}
			/>
			<OrgCardContent data={data} />
			{/* Handle đích: tâm trên của card */}
			<Handle
				type="target"
				position={Position.Top}
				style={{ ...handleStyle, opacity: handleVisibility, pointerEvents: isConnectable ? undefined : "none" }}
			/>
			{/* Handle nguồn: tâm dưới của card */}
			<Handle
				type="source"
				position={Position.Bottom}
				style={{ ...handleStyle, opacity: handleVisibility, pointerEvents: isConnectable ? undefined : "none" }}
			/>
		</div>
	);
}

export default OrgCardNode;
