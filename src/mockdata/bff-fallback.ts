/**
 * Mock data dự phòng cho 2 endpoint BFF:
 *   - GET /api/featured-members
 *   - GET /api/partners
 *
 * Khi upstream (vccihcm.vn hoặc BE proxy) bị lỗi / timeout, các route này sẽ
 * trả về payload có shape giống upstream để FE component vẫn render dữ liệu
 * thay vì hiển thị "Chưa có thông tin".
 *
 * Shape khớp với vccihcm.vn: { responseData: { rows: [...] } }
 */

export type MockMember = {
  id: string;
  name: string;
  avatar: string | null;
  org_link?: string | null;
};

export type MockPartner = {
  id: string;
  name: string;
  avatar: string | null;
  website: string | null;
};

export const MOCK_FEATURED_MEMBERS_RESPONSE = {
  message: "Thành công",
  message_en: "Success",
  responseData: {
    count: 12,
    rows: [
      { id: "510874bb-c21e-46bb-a10c-4a6a38e8dfaf", name: "CÔNG TY TNHH TS FOOD", avatar: "/images/file-1758697746552-33046631.png", org_link: "cong-ty-tnhh-ts-food" },
      { id: "287ae371-026b-47de-b66c-234199587bb6", name: "GIÀY SÀI GÒN", avatar: null, org_link: "giay-sai-gon" },
      { id: "751244a4-8fd5-4a42-be5c-78fdd65585dd", name: "ĐIỆN TỬ BÌNH HÒA", avatar: "/images/file-1758698015144-415446655.jpg", org_link: "dien-tu-binh-hoa" },
      { id: "f64a11ee-120a-463a-98a3-cfe3d18cd314", name: "SX & XNK LÂM SẢN SÀI GÒN", avatar: "/images/file-1758698161010-423507076.jpg", org_link: "sx-and-xnk-lam-san-sai-gon" },
      { id: "83f256e7-cd72-484b-a67b-58bfa0d554f9", name: "XNK NHÀ BÈ", avatar: null, org_link: "xnk-nha-be" },
      { id: "5598d12b-51f4-4bdb-9181-35f2d00083d9", name: "MAY BÌNH MINH", avatar: "/images/file-1758726645642-332196442.png", org_link: "may-binh-minh" },
      { id: "4e4b634f-c28c-4399-be79-39aa0fe66690", name: "MAI QUỐC TRƯỞNG", avatar: "/images/file-1758702157261-405990094.png", org_link: "mai-quoc-truong" },
      { id: "67349914-df32-4109-a147-dc58cd14451c", name: "NHỰA - CƠ KHÍ VÀ THƯƠNG MẠI CHẤN THUẬN THÀNH", avatar: "/images/file-1758702821624-606612949.png", org_link: "nhua-co-khi-va-thuong-mai-chan-thuan-thanh" },
      { id: "412b822c-7334-41f8-87c9-5aaf827dfbe0", name: "ĐỘNG CƠ VÀ MÁY NÔNG NGHIỆP MIỀN NAM", avatar: "/images/file-1758702582389-590874740.png", org_link: "dong-co-va-may-nong-nghiep-mien-nam" },
      { id: "419b3850-7ed2-4eb9-bb05-281003b90c71", name: "XNK ĐỒNG NAI", avatar: null, org_link: "xnk-dong-nai" },
      { id: "71a8e5cf-261f-4b00-9885-0cfb9f87ffc4", name: "THÉP VIỆT NAM", avatar: "/images/file-1758702464469-173235870.png", org_link: "thep-viet-nam" },
      { id: "3267d46b-9c96-40f7-ac92-be3e5ff87c7d", name: "DV DU LỊCH BẾN THÀNH", avatar: "/images/file-1758702701486-209564591.png", org_link: "dv-du-lich-ben-thanh" },
    ] satisfies MockMember[],
    totalPages: 162,
    currentPage: 1,
  },
  status: "success",
  timeStamp: "2026-08-13 18:58:05",
  violations: null,
};

export const MOCK_PARTNERS_RESPONSE = {
  message: "Thành công",
  message_en: "Success",
  responseData: {
    count: 1,
    rows: [
      {
        id: "015bda60-bf37-4a5e-89f9-db0f53c4e400",
        name: "MeU Solutions",
        avatar: "/images/file-1744964940742-32154072.jpg",
        website: "https://meu-solutions.com/",
      },
    ] satisfies MockPartner[],
    totalPages: 1,
    currentPage: 1,
  },
  status: "success",
  timeStamp: "2026-08-13 18:57:58",
  violations: null,
};
