import type { StaticImageData } from "next/image";
import doQuangHuyPhoto from "@/assets/organization-chart/do-quang-huy.jpg";
import maThiHuongPhoto from "@/assets/organization-chart/ma-thi-huong.jpg";
import nguyenDucHuongPhoto from "@/assets/organization-chart/nguyen-duc-huong.jpg";
import nguyenHuuTruongPhoto from "@/assets/organization-chart/nguyen-huu-truong.jpg";
import nguyenHuyHoangPhoto from "@/assets/organization-chart/nguyen-huy-hoang.jpg";
import nguyenThiHuePhoto from "@/assets/organization-chart/nguyen-thi-hue.jpg";
import nguyenThiNhuQuynhPhoto from "@/assets/organization-chart/nguyen-thi-nhu-quynh.jpg";
import nguyenXuanBichThoaiPhoto from "@/assets/organization-chart/nguyen-xuan-bich-thoai.jpg";
import vuThiHienPhoto from "@/assets/organization-chart/vu-thi-hien.jpg";
import vuThiThanhHuyenPhoto from "@/assets/organization-chart/vu-thi-thanh-huyen.jpg";

// Tất cả ảnh dùng chung một khung vuông; ảnh hiển thị trọn vẹn theo chiều cao
// (object-fit: contain) nên không bị cắt hay kéo dãn, bất kể kích thước gốc.
export const ORG_PHOTO_SIZE = 170;
// Bề rộng khung card — dùng chung cho nodeWidth của d3-org-chart và container đo
// chiều cao offscreen (phải khớp nhau để số đo phản ánh đúng việc xuống dòng thật).
// Card lấp đầy khung này (width:100%) nên pitch cột đúng bằng nodeWidth + margin,
// không sinh khoảng trống vô hình 2 bên làm fit() phải thu nhỏ sơ đồ.
export const ORG_CARD_WIDTH = 260;
// 4 trường (role/name/phone/email) đồng nhất font 16px, line-height 1.5 => 24px/dòng.
const FIELD_LINE_HEIGHT = 24;
// Số ký tự tối đa 1 dòng ở vùng chữ của card (conservative để không bị cắt chữ).
// Font 16px đậm trên vùng chữ ~222px rộng: 24 ký tự/dòng là mép an toàn.
const CHARS_PER_LINE = 24;
const COLLAPSED_CARD_HEIGHT = 116;
// Toàn bộ khoảng cách xử lý bằng flex gap (không dùng margin):
// MEMBER_GAP giữa title và các khối thành viên, FIELD_GAP giữa các dòng của 1 thành viên,
// PHOTO_GAP giữa ảnh và khối chữ.
const MEMBER_GAP = 14;
const FIELD_GAP = 0;
const PHOTO_GAP = 10;

export type OrgMember = {
  role: string;
  name: string;
  phone?: string;
  email?: string;
  photo?: StaticImageData;
};

export type OrgCard = {
  id: string;
  parentId: string | null;
  // Title phòng ban: mỗi card tối đa 1, cho phép null (card cá nhân).
  departmentTitle?: string | null;
  // Một card cho phép nhiều người; render bằng .map() với key = `${card.id}:${index}`.
  members: OrgMember[];
  _expanded?: boolean;
};

// ---------------------------------------------------------------------
// Dữ liệu sơ đồ. Thứ tự phần tử trong mảng chính là thứ tự hiển thị:
// [Giám đốc, 3 Phó GD đầu, các phòng trực thuộc Giám đốc, 3 Phó GD sau, các phòng thuộc Phó GD].
// Mỗi card nối với card cha qua id/parentId, không nối bằng tên người.
// ---------------------------------------------------------------------
export const ORG_CARDS: OrgCard[] = [
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
      { role: "Phó Giám đốc", name: "Nguyễn Thị Huệ", phone: "0918904296", email: "hue.nguyen@vcci-hcm.org.vn", photo: nguyenThiHuePhoto },
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
      { role: "Phó Giám đốc", name: "Nguyễn Hữu Trường", phone: "0917688959", email: "truong.nguyen@vcci-hcm.org.vn", photo: nguyenHuuTruongPhoto },
    ],
  },
  {
    id: "deputy-huyen",
    parentId: "director",
    members: [
      { role: "Phó Giám đốc", name: "Vũ Thị Thanh Huyền", phone: "0907081974", email: "huyen.vu@vcci-hcm.org.vn", photo: vuThiThanhHuyenPhoto },
    ],
  },
  {
    id: "deputy-thoai",
    parentId: "director",
    members: [
      { role: "Phó Giám đốc", name: "Nguyễn Xuân Bích Thoại", phone: "0982459399", email: "thoai.nguyen@vcci-hcm.org.vn", photo: nguyenXuanBichThoaiPhoto },
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
      { role: "Trưởng phòng", name: "Nguyễn Huy Hoàng", phone: "0983349447", email: "nguyenhuyhoang090807@gmail.com", photo: nguyenHuyHoangPhoto },
      { role: "Phó trưởng phòng", name: "Vũ Thị Hiền", phone: "0949549480", email: "hienvu0714@gmail.com", photo: vuThiHienPhoto },
    ],
  },
  {
    id: "dept-giao-dich-co-so-2",
    parentId: "deputy-truong",
    departmentTitle: "Phòng Giao dịch Quốc tế - Cơ sở 2",
    members: [
      { role: "Trưởng phòng", name: "Nguyễn Thị Quỳnh Như", phone: "0937267286", email: "Boeynguyen@gmail.com", photo: nguyenThiNhuQuynhPhoto },
    ],
  },
  {
    id: "dept-hoi-vien-co-so-2",
    parentId: "deputy-huyen",
    departmentTitle: "Phòng Hội viên Đào tạo và Truyền thông - Cơ sở 2",
    members: [
      { role: "Trưởng phòng", name: "Đỗ Quang Huy", phone: "0396982299", email: "doquanghuy1988hp@gmail.com", photo: doQuangHuyPhoto },
      { role: "Phó trưởng phòng", name: "Nguyễn Đức Hường", phone: "0909557219", email: "duchuongvt72@gmail.com", photo: nguyenDucHuongPhoto },
    ],
  },
  {
    id: "dept-phap-che-chung-tu-co-so-2",
    parentId: "deputy-thoai",
    departmentTitle: "Phòng Pháp chế và Xác nhận chứng từ thương mại - Cơ sở 2",
    members: [
      { role: "Trưởng phòng", name: "Ma Thị Hương", phone: "0395122922", email: "huongmtvcci@gmail.com", photo: maThiHuongPhoto },
    ],
  },
];

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&",
      "<": "<",
      ">": ">",
      '"': "&#34;",
      "'": "'",
    };
    return entities[character] ?? character;
  });

const fieldStyle = (featured: boolean) =>
  `font-size:16px;font-weight:700;line-height:1.5;color:${featured ? "#fff" : "#20364b"}`;
// Role nổi bật bằng màu nhận diện #174A83; riêng card featured (nền #174A83) giữ trắng
// để chữ còn đọc được trên nền cùng màu.
const roleStyle = (featured: boolean) =>
  `font-size:16px;font-weight:700;line-height:1.5;color:${featured ? "#fff" : "#174a83"}`;

const renderPhoto = (photo: StaticImageData, alt: string) =>
  `<img src="${photo.src}" alt="${escapeHtml(alt)}" loading="lazy" style="display:block;width:${ORG_PHOTO_SIZE}px;height:${ORG_PHOTO_SIZE}px;object-fit:contain;background:#fff"/>`;

const renderOrgMember = (member: OrgMember, key: string, featured: boolean) => {
  const style = fieldStyle(featured);
  // width:100% để mọi khối member cùng trải rộng bằng bề rộng card — lề trái của ảnh
  // và các dòng text thẳng hàng tuyệt đối giữa các member, dù text dài ngắn khác nhau.
  return `<div data-member-key="${key}" style="width:100%;display:flex;flex-direction:column;align-items:flex-start;gap:${FIELD_GAP}px;text-align:left">
    ${member.photo ? `<div style="width:100%;display:flex;justify-content:center;padding-bottom:${PHOTO_GAP - FIELD_GAP}px">${renderPhoto(member.photo, member.name)}</div>` : ""}
    <div style="${roleStyle(featured)}">${escapeHtml(member.role)}</div>
    <div style="${style}">${escapeHtml(member.name)}</div>
    ${member.phone ? `<div style="${style}">Mobile: ${escapeHtml(member.phone)}</div>` : ""}
    ${member.email ? `<div style="${style};word-break:break-all">${escapeHtml(member.email)}</div>` : ""}
  </div>`;
};

const CARD_SHELL_STYLE = `box-sizing:border-box;width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${MEMBER_GAP}px;text-align:center;box-shadow:0 5px 16px rgba(23,52,83,.08);font-family:Arial,sans-serif`;
// data-node-id giúp page đo chiều cao thật của card (offscreen) và ánh xạ về node qua id.
const cardShell = (innerStyle: string, content: string, nodeId: string) =>
  `<div style="box-sizing:border-box;width:100%;height:100%;display:flex;align-items:center;justify-content:center">
    <div data-node-id="${nodeId}" style="${CARD_SHELL_STYLE};${innerStyle}">${content}</div>
  </div>`;

// Title phòng ban dùng chung 1 style để trạng thái thu gọn và trạng thái mở đều nhau.
const DEPARTMENT_TITLE_STYLE = "font-size:18px;font-weight:700;line-height:1.4";

// Component trạng thái thu gọn của card phòng ban: chỉ hiển thị title phòng ban.
const renderDepartmentTitleOnly = (card: OrgCard) =>
  cardShell(
    "padding:12px 16px;border:1px solid #174a83;background:#fff;color:#20364b;cursor:pointer",
    `<div style="${DEPARTMENT_TITLE_STYLE}">${escapeHtml(card.departmentTitle ?? "")}</div>`,
    card.id,
  );

export const renderOrgCardContent = (card: OrgCard, expanded: boolean) => {
  if (card.departmentTitle && !expanded) return renderDepartmentTitleOnly(card);

  const featured = card.parentId === null;
  const departmentTitleHtml = card.departmentTitle
    ? `<div style="${DEPARTMENT_TITLE_STYLE}">${escapeHtml(card.departmentTitle)}</div>`
    : "";
  const membersHtml = card.members
    .map((member, index) => renderOrgMember(member, `${card.id}:${index}`, featured))
    .join("");

  return cardShell(
    `padding:12px 16px;border:1px solid #174a83;background:${featured ? "#174a83" : "#fff"};color:${featured ? "#fff" : "#20364b"};cursor:${card.departmentTitle ? "pointer" : "default"}`,
    `${departmentTitleHtml}
    ${membersHtml}`,
    card.id,
  );
};

// Key của bảng chiều cao đã đo: page đo offscreen cả 2 trạng thái (mở/thu) của từng card.
export const orgCardHeightKey = (id: string, expanded: boolean) => `${id}|${expanded ? "open" : "closed"}`;

const countLines = (text: string, charsPerLine = CHARS_PER_LINE) =>
  Math.max(1, Math.ceil(text.length / charsPerLine));

const estimateMemberHeight = (member: OrgMember) =>
  (member.photo ? ORG_PHOTO_SIZE + PHOTO_GAP : 0) +
  countLines(member.role) * FIELD_LINE_HEIGHT +
  countLines(member.name) * FIELD_LINE_HEIGHT +
  (member.phone ? FIELD_LINE_HEIGHT + FIELD_GAP : 0) +
  (member.email ? countLines(member.email) * FIELD_LINE_HEIGHT + FIELD_GAP : 0);

// Ước lượng nhanh, chỉ dùng làm fallback khi chưa có số đo thật (số đo chính xác được
// page lấy từ container ẩn offscreen trước khi render — xem measuredHeights trong page).
export const estimateOrgCardHeight = (card: OrgCard, expanded: boolean) => {
  if (card.departmentTitle && !expanded) return COLLAPSED_CARD_HEIGHT;
  const departmentTitleHeight = card.departmentTitle
    ? countLines(card.departmentTitle, 24) * 25
    : 0;
  const membersHeight = card.members.reduce((total, member) => total + estimateMemberHeight(member), 0);
  // Gap của shell: giữa title và member đầu tiên + giữa các member liền kề
  const shellGaps = Math.max(0, (card.departmentTitle ? 1 : 0) + card.members.length - 1) * MEMBER_GAP;
  return Math.max(60, departmentTitleHeight + membersHeight + shellGaps);
};
