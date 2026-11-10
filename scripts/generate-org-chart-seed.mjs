/**
 * generate-org-chart-seed.mjs
 * --------------------------
 * Sinh file SQL seed cho sơ đồ tổ chức (bảng org_charts) từ dữ liệu sơ đồ cũ
 * (mảng ORG_CARDS hardcode trong OrgChartCard.tsx trước khi chuyển sang canvas
 * editor). Document format v2 ({ version, nodes, edges }) cho @xyflow/react.
 *
 * Output: ../vietprodev-cms-backend/sql/org-chart-seed.sql
 *
 * Cách chạy (từ thư mục vcci-news-frontend):
 *   node scripts/generate-org-chart-seed.mjs [--force]
 *
 * Script thuần JS, không phụ thuộc thư viện canvas — format document do dự án
 * kiểm soát (xem vietprodev-cms-backend/docs/ORG_CHART_REACTFLOW.md).
 */

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.resolve(
	__dirname,
	"../../vietprodev-cms-backend/sql/org-chart-seed.sql",
);

// ---------------------------------------------------------------------
// Dữ liệu sơ đồ hiện tại — copy nguyên từ ORG_CARDS trong
// src/app/(main)/[...slug]/static-pages/so-do-to-chuc/components/OrgChartCard.tsx
// (ảnh đã copy sang public/organization-chart/, photoSrc trỏ tới URL public)
// ---------------------------------------------------------------------
const PHOTOS = {
	nguyenThiHue: "/organization-chart/nguyen-thi-hue.jpg",
	nguyenHuuTruong: "/organization-chart/nguyen-huu-truong.jpg",
	vuThiThanhHuyen: "/organization-chart/vu-thi-thanh-huyen.jpg",
	nguyenXuanBichThoai: "/organization-chart/nguyen-xuan-bich-thoai.jpg",
	nguyenHuyHoang: "/organization-chart/nguyen-huy-hoang.jpg",
	vuThiHien: "/organization-chart/vu-thi-hien.jpg",
	nguyenThiNhuQuynh: "/organization-chart/nguyen-thi-nhu-quynh.jpg",
	doQuangHuy: "/organization-chart/do-quang-huy.jpg",
	nguyenDucHuong: "/organization-chart/nguyen-duc-huong.jpg",
	maThiHuong: "/organization-chart/ma-thi-huong.jpg",
};

const CARDS = [
	{
		id: "director",
		parentId: null,
		members: [
			{ role: "Giám đốc", name: "Trần Ngọc Liêm", phone: "0903338350", email: "liem@vcci-hcm.org.vn" },
		],
	},
	{
		id: "deputy-nam",
		parentId: "director",
		members: [
			{ role: "Phó Giám đốc", name: "Nguyễn Hữu Nam", phone: "0907790989", email: "huunam@vcci-hcm.org.vn" },
		],
	},
	{
		id: "deputy-ninh",
		parentId: "director",
		members: [
			{ role: "Phó Giám đốc", name: "Bùi Thị Ninh", phone: "0938150708", email: "buithininh@vcci-hcm.org.vn" },
		],
	},
	{
		id: "deputy-hue",
		parentId: "director",
		members: [
			{ role: "Phó Giám đốc", name: "Nguyễn Thị Huệ", phone: "0918904296", email: "hue.nguyen@vcci-hcm.org.vn", photoSrc: PHOTOS.nguyenThiHue },
		],
	},
	{
		id: "dept-hoi-vien",
		parentId: "director",
		departmentTitle: "Phòng Hội viên Đào tạo và Truyền thông",
		members: [
			{ role: "Trưởng phòng", name: "Nguyễn Đoàn Thông", phone: "0903857520", email: "doanthong@vcci-hcm.org.vn" },
			{ role: "Phó trưởng phòng", name: "Bùi Mạnh Hùng", phone: "0877892442", email: "hungbui@vcci-hcm.org.vn" },
		],
	},
	{
		id: "dept-hanh-chinh",
		parentId: "director",
		departmentTitle: "Phòng Hành chính Quản trị",
		members: [
			{ role: "Trưởng phòng", name: "Nguyễn Văn Quân", phone: "0983945914", email: "quan@vcci-hcm.org.vn" },
		],
	},
	{
		id: "dept-tai-chinh-ke-toan",
		parentId: "director",
		departmentTitle: "Phòng Tài chính Kế toán",
		members: [
			{ role: "Phó trưởng phòng phụ trách", name: "Bùi Tường Vi", phone: "0906050580", email: "tuongvi@vcci-hcm.org.vn" },
			{ role: "Phó trưởng phòng", name: "Nguyễn Hữu Nghĩa", phone: "0982012258", email: "huunghia@vcci-hcm.org.vn" },
		],
	},
	{
		id: "dept-to-chuc-can-bo",
		parentId: "director",
		departmentTitle: "Phòng Tổ chức Cán bộ",
		members: [
			{ role: "Trưởng phòng", name: "Lê Thanh Thúy", phone: "0903789233", email: "thanhthuy@vcci-hcm.org.vn" },
			{ role: "Phó trưởng phòng", name: "Trương Thanh Tần", phone: "0389977097", email: "tantrthanh@gmail.com" },
		],
	},
	{
		id: "deputy-truong",
		parentId: "director",
		members: [
			{ role: "Phó Giám đốc", name: "Nguyễn Hữu Trường", phone: "0917688959", email: "truong.nguyen@vcci-hcm.org.vn", photoSrc: PHOTOS.nguyenHuuTruong },
		],
	},
	{
		id: "deputy-huyen",
		parentId: "director",
		members: [
			{ role: "Phó Giám đốc", name: "Vũ Thị Thanh Huyền", phone: "0907081974", email: "huyen.vu@vcci-hcm.org.vn", photoSrc: PHOTOS.vuThiThanhHuyen },
		],
	},
	{
		id: "deputy-thoai",
		parentId: "director",
		members: [
			{ role: "Phó Giám đốc", name: "Nguyễn Xuân Bích Thoại", phone: "0982459399", email: "thoai.nguyen@vcci-hcm.org.vn", photoSrc: PHOTOS.nguyenXuanBichThoai },
		],
	},
	{
		id: "dept-phap-che-va-chung-tu",
		parentId: "deputy-nam",
		departmentTitle: "Phòng Pháp chế và Xác nhận chứng từ thương mại",
		members: [
			{ role: "Trưởng phòng", name: "Vũ Xuân Hưng", phone: "0909170171", email: "vuxuanhung@vcci-hcm.org.vn" },
			{ role: "Phó trưởng phòng", name: "Nguyễn Văn Đức", phone: "0909497155", email: "ducnguyen@vcci-hcm.org.vn" },
			{ role: "Phó trưởng phòng", name: "Nguyễn Khánh Linh", phone: "0393112520", email: "nguyenlinh@vcci-hcm.org.vn" },
		],
	},
	{
		id: "dept-trung-tam-sme",
		parentId: "deputy-nam",
		departmentTitle: "Trung tâm Hỗ trợ Doanh nghiệp Nhỏ và Vừa",
		members: [
			{ role: "Phó Giám đốc phụ trách", name: "Nguyễn Hữu Nam", phone: "0907790989", email: "huunam@vcci-hcm.org.vn" },
		],
	},
	{
		id: "dept-giao-dich",
		parentId: "deputy-ninh",
		departmentTitle: "Phòng Giao dịch Quốc tế",
		members: [
			{ role: "Trưởng phòng", name: "Trần Ngọc Đào", phone: "02839325166", email: "jadevcci@vcci-hcm.org.vn" },
			{ role: "Phó trưởng phòng", name: "Hồ Ngọc Vinh", phone: "0918866055", email: "hongocvinh@vcci-hcm.org.vn" },
		],
	},
	{
		id: "dept-van-phong-gioi",
		parentId: "deputy-ninh",
		departmentTitle: "Văn phòng Giới sử dụng lao động và Doanh nhân nữ",
		members: [
			{ role: "Phó trưởng phòng", name: "Nguyễn Lê Nhật Thanh", phone: "0903877111", email: "thanh.nguyen@vcci-hcm.org.vn" },
		],
	},
	{
		id: "dept-hanh-chinh-co-so-2",
		parentId: "deputy-hue",
		departmentTitle: "Phòng Hành chính Quản trị - Cơ sở 2",
		members: [
			{ role: "Trưởng phòng", name: "Nguyễn Huy Hoàng", phone: "0983349447", email: "nguyenhuyhoang090807@gmail.com", photoSrc: PHOTOS.nguyenHuyHoang },
			{ role: "Phó trưởng phòng", name: "Vũ Thị Hiền", phone: "0949549480", email: "hienvu0714@gmail.com", photoSrc: PHOTOS.vuThiHien },
		],
	},
	{
		id: "dept-giao-dich-co-so-2",
		parentId: "deputy-truong",
		departmentTitle: "Phòng Giao dịch Quốc tế - Cơ sở 2",
		members: [
			{ role: "Trưởng phòng", name: "Nguyễn Thị Quỳnh Như", phone: "0937267286", email: "Boeynguyen@gmail.com", photoSrc: PHOTOS.nguyenThiNhuQuynh },
		],
	},
	{
		id: "dept-hoi-vien-co-so-2",
		parentId: "deputy-huyen",
		departmentTitle: "Phòng Hội viên Đào tạo và Truyền thông - Cơ sở 2",
		members: [
			{ role: "Trưởng phòng", name: "Đỗ Quang Huy", phone: "0396982299", email: "doquanghuy1988hp@gmail.com", photoSrc: PHOTOS.doQuangHuy },
			{ role: "Phó trưởng phòng", name: "Nguyễn Đức Hường", phone: "0909557219", email: "duchuongvt72@gmail.com", photoSrc: PHOTOS.nguyenDucHuong },
		],
	},
	{
		id: "dept-phap-che-chung-tu-co-so-2",
		parentId: "deputy-thoai",
		departmentTitle: "Phòng Pháp chế và Xác nhận chứng từ thương mại - Cơ sở 2",
		members: [
			{ role: "Trưởng phòng", name: "Ma Thị Hương", phone: "0395122922", email: "huongmtvcci@gmail.com", photoSrc: PHOTOS.maThiHuong },
		],
	},
];

// ---------------------------------------------------------------------
// Ước lượng chiều cao card (copy logic estimateOrgCardHeight của sơ đồ cũ)
// ---------------------------------------------------------------------
const FIELD_LINE_HEIGHT = 24;
const CHARS_PER_LINE = 24;
const CARD_PADDING = 26; // 12px top/bottom + 2px border
const MEMBER_GAP = 14;

const countLines = (text, charsPerLine = CHARS_PER_LINE) =>
	Math.max(1, Math.ceil((text ?? "").length / charsPerLine));

const estimateMemberHeight = (m) =>
	(m.photoSrc ? 170 + 10 : 0) +
	countLines(m.role) * FIELD_LINE_HEIGHT +
	countLines(m.name) * FIELD_LINE_HEIGHT +
	(m.phone ? FIELD_LINE_HEIGHT : 0) +
	(m.email ? countLines(m.email) * FIELD_LINE_HEIGHT : 0);

const estimateCardHeight = (card) => {
	const departmentTitleHeight = card.departmentTitle
		? countLines(card.departmentTitle, 24) * 25
		: 0;
	const membersHeight = card.members.reduce((t, m) => t + estimateMemberHeight(m), 0);
	const shellGaps =
		Math.max(0, (card.departmentTitle ? 1 : 0) + card.members.length - 1) * MEMBER_GAP;
	return Math.max(60, Math.ceil(departmentTitleHeight + membersHeight + shellGaps + CARD_PADDING));
};

// ---------------------------------------------------------------------
// Layout: 3 tầng ngang, card 260px, gap cột 40px
//   Tầng 1: Giám đốc
//   Tầng 2: 4 phòng trực thuộc BGĐ (cột 0-3) + 6 Phó Giám đốc (cột 4-11)
//   Tầng 3: các phòng thuộc Phó Giám đốc, xếp ngay dưới Phó GD của mình
// ---------------------------------------------------------------------
const COL_WIDTH = 300;
const CARD_WIDTH = 260;
const ROW_GAP = 90;

const cardById = new Map(CARDS.map((c) => [c.id, c]));

// Vị trí cột (index cột × COL_WIDTH = tọa độ x của card)
const COLUMN = {
	"dept-hoi-vien": 0,
	"dept-hanh-chinh": 1,
	"dept-tai-chinh-ke-toan": 2,
	"dept-to-chuc-can-bo": 3,
	"deputy-nam": 4,
	"deputy-ninh": 6,
	"deputy-hue": 8,
	"deputy-truong": 9,
	"deputy-huyen": 10,
	"deputy-thoai": 11,
	"dept-phap-che-va-chung-tu": 4,
	"dept-trung-tam-sme": 5,
	"dept-giao-dich": 6,
	"dept-van-phong-gioi": 7,
	"dept-hanh-chinh-co-so-2": 8,
	"dept-giao-dich-co-so-2": 9,
	"dept-hoi-vien-co-so-2": 10,
	"dept-phap-che-chung-tu-co-so-2": 11,
};

const ROWS = [
	["director"],
	[
		"dept-hoi-vien", "dept-hanh-chinh", "dept-tai-chinh-ke-toan", "dept-to-chuc-can-bo",
		"deputy-nam", "deputy-ninh", "deputy-hue", "deputy-truong", "deputy-huyen", "deputy-thoai",
	],
	[
		"dept-phap-che-va-chung-tu", "dept-trung-tam-sme", "dept-giao-dich", "dept-van-phong-gioi",
		"dept-hanh-chinh-co-so-2", "dept-giao-dich-co-so-2", "dept-hoi-vien-co-so-2", "dept-phap-che-chung-tu-co-so-2",
	],
];

// Tính tọa độ y từng tầng theo chiều cao ước lượng lớn nhất của tầng trước
const rowY = [];
{
	let y = 0;
	for (let i = 0; i < ROWS.length; i++) {
		rowY[i] = y;
		y += Math.max(...ROWS[i].map((id) => estimateCardHeight(cardById.get(id)))) + ROW_GAP;
	}
}

const totalColumns = Math.max(...Object.values(COLUMN)) + 1;
const boardWidth = totalColumns * COL_WIDTH - (COL_WIDTH - CARD_WIDTH);

const position = {};
for (let i = 0; i < ROWS.length; i++) {
	for (const id of ROWS[i]) {
		position[id] = {
			x: COLUMN[id] * COL_WIDTH,
			y: rowY[i],
			h: estimateCardHeight(cardById.get(id)),
		};
	}
}
position["director"].x = Math.round((boardWidth - CARD_WIDTH) / 2);

// ---------------------------------------------------------------------
// Document v2: { version, nodes, edges } (React Flow)
// ---------------------------------------------------------------------
// Convert members (dữ liệu nguồn cũ) → rows theo đúng giao diện cũ:
// ảnh căn giữa, role màu brand (trắng khi featured), name/phone/email màu tối.
const toRows = (card) => {
	const featured = card.parentId === null;
	const rows = [];
	for (const m of card.members) {
		if (m.photoSrc) {
			rows.push({ kind: "image", align: "center", src: m.photoSrc, alt: m.name });
		}
		rows.push({ kind: "text", align: "left", text: m.role, color: featured ? "#ffffff" : "#174a83" });
		rows.push({ kind: "text", align: "left", text: m.name });
		if (m.phone) rows.push({ kind: "text", align: "left", text: `Mobile: ${m.phone}` });
		if (m.email) rows.push({ kind: "text", align: "left", text: m.email });
	}
	return rows;
};

const toNodeData = (card) => ({
	w: CARD_WIDTH,
	variant: card.departmentTitle ? "department" : "person",
	departmentTitle: card.departmentTitle ?? "",
	featured: card.parentId === null,
	rows: toRows(card),
});

const nodes = CARDS.map((card) => ({
	id: `card-${card.id}`,
	type: "org-card",
	position: { x: position[card.id].x, y: position[card.id].y },
	data: toNodeData(card),
}));

const EDGES = [
	// Giám đốc → 4 phòng trực thuộc + 6 Phó Giám đốc
	...CARDS.filter((c) => c.parentId === "director").map((c) => ["director", c.id]),
	// Phó Giám đốc → phòng ban
	...CARDS.filter((c) => c.parentId && c.parentId !== "director").map((c) => [c.parentId, c.id]),
];

const edges = EDGES.map(([fromId, toId]) => ({
	id: `edge-${fromId}--${toId}`,
	source: `card-${fromId}`,
	target: `card-${toId}`,
	// smoothstep: connector vuông góc kiểu org chart, màu đỏ như sơ đồ cũ;
	// edge render dưới node (mặc định của React Flow)
	type: "smoothstep",
	style: { stroke: "#ff0000", strokeWidth: 2 },
}));

const document = { version: 2, nodes, edges };

// ---------------------------------------------------------------------
// Sinh SQL
// ---------------------------------------------------------------------
const escapeSql = (value) => String(value).replace(/'/g, "''");
const chartName = "Sơ đồ tổ chức VCCI-HCM";
const chartSlug = "so-do-to-chuc";
const snapshotJson = escapeSql(JSON.stringify(document));

const sql = `-- =========================================
-- ORG CHART SEED DATA (format v2 - React Flow)
-- =========================================
-- Vẽ lại sơ đồ tổ chức hiện tại (dữ liệu ORG_CARDS cũ) trên canvas React Flow.
-- Sinh tự động bởi scripts/generate-org-chart-seed.mjs (vcci-news-frontend).
-- Snapshot gồm ${CARDS.length} org-card + ${EDGES.length} edge (nối Giám đốc → Phó GD/phòng, Phó GD → phòng).
-- Seed sẵn is_published = true để trang public /so-do-to-chuc hiển thị ngay
-- (tương đương trạng thái sơ đồ cũ đang chạy); admin vẫn có bản nháp riêng.

INSERT INTO public.org_charts (name, slug, draft_snapshot, published_snapshot, is_published, published_at)
VALUES ('${chartName}', '${chartSlug}', '${snapshotJson}'::jsonb, '${snapshotJson}'::jsonb, true, now())
ON CONFLICT (slug) DO UPDATE SET
		name = EXCLUDED.name,
		draft_snapshot = EXCLUDED.draft_snapshot,
		published_snapshot = EXCLUDED.published_snapshot,
		is_published = EXCLUDED.is_published,
		published_at = EXCLUDED.published_at;
`;

const force = process.argv.includes("--force");
if (!force) {
	// Kiểm tra trùng lặp để tránh ghi đè vô tình khi chạy lại
	try {
		writeFileSync(OUTPUT_PATH, sql, { flag: "wx" });
	} catch {
		console.error(`File đã tồn tại: ${OUTPUT_PATH}\nChạy lại với --force để ghi đè.`);
		process.exit(1);
	}
} else {
	writeFileSync(OUTPUT_PATH, sql);
}

console.log(`Đã sinh ${OUTPUT_PATH}`);
console.log(`  cards: ${CARDS.length}, edges: ${EDGES.length}, records: ${nodes.length + edges.length}`);
console.log(`  board: ${boardWidth}px × ${rowY[ROWS.length - 1] + Math.max(...ROWS[ROWS.length - 1].map((id) => position[id].h))}px`);
