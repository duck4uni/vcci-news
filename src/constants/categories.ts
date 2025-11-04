import { PATHS } from "@constants/paths";

export const TRADE_PROMOTION_CATEGORIES = [
  {
    title: "Hồ sơ thị trường",
    href: `${PATHS.marketProfile}`,
  },
  {
    title: "Môi trường kinh doanh",
    href: `${PATHS.tradePromotion}/moi-truong-kinh-doanh`,
  },
  {
    title: "Cơ hội kinh doanh",
    href: `${PATHS.tradePromotion}/co-hoi-kinh-doanh`,
  },
  {
    title: "Hỗ trợ kinh doanh",
    href: `${PATHS.tradePromotion}/ho-tro-kinh-doanh`,
  },
];

export const OWNER_REPRESENTATIVES_CATEGORIES = [
  {
    title: "Chức năng Đại diện Người sử dụng lao động",
    href: `${PATHS.ownerRepresentatives}/chuc-nang-dai-dien-nguoi-su-dung-lao-dong`,
  },
  {
    title: "Sự kiện – Tập huấn NSDLĐ",
    href: `${PATHS.ownerRepresentatives}/tap-huan-nsdld`,
  },
  {
    title: "Tin liên quan",
    href: `${PATHS.ownerRepresentatives}/tin-lien-quan`,
  },
  {
    title: "Chủ đề",
    href: `${PATHS.ownerRepresentatives}/chu-de`,
  },
];

export const EVENT_CATEGORIES = [
  {
    title: "Sự kiện",
    href: `${PATHS.event}/su-kien`,
  },
  {
    title: "Đào tạo",
    href: `${PATHS.event}/dao-tao`,
  },
];

export const MEDIA_INFORMATION_CATEGORIES = [
  {
    title: "Tin VCCI",
    href: `${PATHS.mediaInformation}/tin-vcci`,
  },
  {
    title: "Tin kinh tế",
    href: `${PATHS.mediaInformation}/tin-kinh-te`,
  },
  {
    title: "Tin doanh nghiệp",
    href: `${PATHS.mediaInformation}/tin-doanh-nghiep`,
  },
  {
    title: "Chuyên đề",
    href: `${PATHS.mediaInformation}/chuyen-de`,
  },
  {
    title: "Thông tin chính sách và pháp luật",
    href: `${PATHS.mediaInformation}/thong-tin-chinh-sach-va-phap-luat`,
  },
  {
    title: "Ấn phẩm",
    href: `${PATHS.mediaInformation}/an-pham`,
  },
  {
    title: "Thư viện tài liệu",
    href: `${PATHS.mediaInformation}/thu-vien-tai-lieu`,
  },
];

export type CategoryItem = {
  title: string;
  href: string;
};
