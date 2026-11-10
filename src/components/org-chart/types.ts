/**
 * Kiểu dữ liệu dùng chung cho sơ đồ tổ chức (editor /admin/so-do-to-chuc và
 * viewer /so-do-to-chuc) — document format v2 trên nền @xyflow/react (MIT).
 *
 * Document lưu trong cột jsonb bảng org_charts có cấu trúc do dự án kiểm soát:
 * { version: 2, nodes: OrgChartNodeDTO[], edges: OrgChartEdgeDTO[] }.
 * Editor và viewer cùng render một format — đổi cấu trúc phải migrate cả hai
 * (xem docs: vietprodev-cms-backend/docs/ORG_CHART_REACTFLOW.md).
 */

import type { Node, Edge } from "@xyflow/react";

export type OrgMember = {
	role: string;
	name: string;
	phone?: string;
	email?: string;
	/** URL ảnh chân dung (vd "/organization-chart/xxx.jpg") hoặc data URL khi admin upload mới */
	photoSrc?: string;
	photoAlt?: string;
};

export type OrgCardShapeVariant = "person" | "department";

// ------------------------------------------------------------------
// Row model — nội dung card là danh sách hàng đánh số, mỗi hàng là text
// hoặc image, căn center/left/right; hàng text đổi được màu.
// ------------------------------------------------------------------
export type OrgCardRowAlign = "center" | "left" | "right";

export type OrgCardTextRow = {
	kind: "text";
	align: OrgCardRowAlign;
	/** Nội dung chữ */
	text: string;
	/** Màu chữ — undefined = theo theme card (trắng khi featured, tối khi thường) */
	color?: string;
	/** Cỡ chữ (px) — undefined = 16 */
	fontSize?: number;
	/** Đậm chữ — mặc định true (giữ giao diện sơ đồ cũ) */
	bold?: boolean;
};

export type OrgCardImageRow = {
	kind: "image";
	align: OrgCardRowAlign;
	/** URL ảnh (public path hoặc data URL) */
	src: string;
	alt?: string;
};

export type OrgCardRow = OrgCardTextRow | OrgCardImageRow;

export const ORG_TEXT_ROW_COLORS = [
	"#174a83",
	"#20364b",
	"#ffffff",
	"#ff0000",
	"#64748b",
	"#16a34a",
	"#f59e0b",
];

/** data của node org-card */
export type OrgCardNodeData = {
	/** Bề rộng khung card (px) — RF tự đo chiều cao theo nội dung */
	w: number;
	variant: OrgCardShapeVariant;
	/** Tiêu đề phòng ban — chỉ dùng cho variant "department", render trên cùng, căn giữa */
	departmentTitle: string;
	/** Nền xanh #174A83 chữ trắng (card Giám đốc) */
	featured: boolean;
	/** Danh sách hàng nội dung (text/image), thứ tự trong mảng = thứ tự hiển thị */
	rows: OrgCardRow[];
};

/** Node type đăng ký vào React Flow */
export type OrgCardNodeType = Node<OrgCardNodeData, "org-card">;

/**
 * data của node org-line: đường kẻ thẳng tự do (annotation) — admin thêm từ
 * nút "Thêm đường kẻ", kéo/giãn/xoay để nối hoặc ghi chú tuỳ ý. Không binding
 * với card (khác edge) nên khi kéo card thì đường kẻ không tự theo.
 */
export type OrgLineNodeData = {
	/** Chiều dài đường kẻ (px, trước khi xoay) */
	length: number;
	/** Góc xoay (độ, 0-360) */
	rotation: number;
	/** Màu đường kẻ */
	color: string;
	/** Độ dày (px) */
	thickness: number;
	/** Kiểu nét đứt */
	dashed: boolean;
};

export type OrgLineNodeType = Node<OrgLineNodeData, "org-line">;

/** Edge nối card cha → card con */
export type OrgChartEdgeDTO = Edge;

/** Node/edge ghi vào DB (bản serialize gọn, không chứa field runtime của RF) */
export type OrgChartNodeDTO = {
	id: string;
	type: "org-card" | "org-line";
	position: { x: number; y: number };
	data: OrgCardNodeData | OrgLineNodeData;
};

export type OrgChartDocument = {
	version: 2;
	nodes: OrgChartNodeDTO[];
	edges: OrgChartEdgeDTO[];
};

/**
 * Convert members (format cũ v2 đầu) → rows: giữ nguyên trật tự và màu sắc
 * của giao diện cũ (role màu brand, còn lại tối/trắng theo featured, ảnh căn giữa).
 */
export function membersToRows(members: OrgMember[], featured = false): OrgCardRow[] {
	const rows: OrgCardRow[] = [];

	for (const member of members) {
		if (member.photoSrc) {
			rows.push({
				kind: "image",
				align: "center",
				src: member.photoSrc,
				alt: member.photoAlt || member.name,
			});
		}

		rows.push({
			kind: "text",
			align: "left",
			text: member.role,
			color: featured ? "#ffffff" : "#174a83",
		});
		rows.push({ kind: "text", align: "left", text: member.name });
		if (member.phone) {
			rows.push({ kind: "text", align: "left", text: `Mobile: ${member.phone}` });
		}
		if (member.email) {
			rows.push({ kind: "text", align: "left", text: member.email });
		}
	}

	return rows;
}

type LegacyOrgCardData = Partial<OrgCardNodeData> & { members?: OrgMember[] };

/**
 * Chuẩn hoá data org-card từ document cũ lưu trong DB (có `members`, chưa có
 * `rows`) sang row model — dùng cho cả editor và viewer khi load. Đồng thời
 * fill default cho các field thêm sau (fontSize/bold của row, w của card) để
 * document cũ thiếu field vẫn render đúng.
 */
export function normalizeOrgCardData(data: LegacyOrgCardData): OrgCardNodeData {
	const width = data.w ?? 260;

	const withDefaults = (rows: OrgCardRow[]): OrgCardRow[] =>
		rows.map((row) =>
			row.kind === "text"
				? {
						...row,
						fontSize: row.fontSize ?? 16,
						bold: row.bold ?? true,
					}
				: row,
		);

	if (!Array.isArray(data.rows) && Array.isArray(data.members)) {
		return {
			w: width,
			variant: data.variant ?? "person",
			departmentTitle: data.departmentTitle ?? "",
			featured: data.featured ?? false,
			rows: withDefaults(membersToRows(data.members, data.featured ?? false)),
		};
	}

	return {
		w: width,
		variant: data.variant ?? "person",
		departmentTitle: data.departmentTitle ?? "",
		featured: data.featured ?? false,
		rows: withDefaults(Array.isArray(data.rows) ? data.rows : []),
	};
}

/**
 * Chuẩn hoá cả document (nodes org-card chạy qua normalizeOrgCardData) —
 * gọi ở đường load của editor và viewer.
 */
export function normalizeOrgChartDocument(document: OrgChartDocument): OrgChartDocument {
	return {
		...document,
		nodes: (document?.nodes ?? []).map((node) =>
			node.type === "org-card"
				? { ...node, data: normalizeOrgCardData(node.data as LegacyOrgCardData) }
				: node,
		),
	};
}

// ------------------------------------------------------------------
// Bảng màu & kích thước brand — giữ nguyên giao diện sơ đồ cũ
// ------------------------------------------------------------------
export const ORG_CARD_COLOR = "#174a83";
export const ORG_CARD_TEXT_COLOR = "#20364b";
export const ORG_CARD_WIDTH = 260;
export const ORG_PHOTO_SIZE = 170;
export const ORG_EDGE_COLOR = "#ff0000";
export const ORG_EDGE_WIDTH = 2;
