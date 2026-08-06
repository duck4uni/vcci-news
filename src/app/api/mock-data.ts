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
};

export type MockPartner = {
  id: string;
  name: string;
  avatar: string | null;
  website: string | null;
};

export const MOCK_FEATURED_MEMBERS_RESPONSE = {
  responseData: {
    rows: [
      { id: "mock-member-1", name: "Công ty Cổ phần Vinamilk", avatar: "/home/hoi-vien-tieu-bieu/1.webp" },
      { id: "mock-member-2", name: "Tập đoàn Bất động sản Novaland", avatar: "/home/hoi-vien-tieu-bieu/2.webp" },
      { id: "mock-member-3", name: "Công ty TNHH Samsung Electronics Việt Nam", avatar: "/home/hoi-vien-tieu-bieu/3.webp" },
      { id: "mock-member-4", name: "Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)", avatar: "/home/hoi-vien-tieu-bieu/4.webp" },
      { id: "mock-member-5", name: "Công ty Cổ phần FPT", avatar: "/home/hoi-vien-tieu-bieu/5.webp" },
      { id: "mock-member-6", name: "Tập đoàn Vingroup", avatar: "/home/hoi-vien-tieu-bieu/6.webp" },
      { id: "mock-member-7", name: "Công ty Cổ phần Thủy sản Minh Phú", avatar: "/home/hoi-vien-tieu-bieu/7.webp" },
      { id: "mock-member-8", name: "Tập đoàn Dệt may Việt Nam (Vinatex)", avatar: "/home/hoi-vien-tieu-bieu/8.webp" },
      { id: "mock-member-9", name: "Công ty Cổ phần Hàng không VietJet", avatar: "/home/hoi-vien-tieu-bieu/9.webp" },
    ] satisfies MockMember[],
  },
};

export const MOCK_PARTNERS_RESPONSE = {
  responseData: {
    rows: [
      { id: "mock-partner-1", name: "Đối tác 1", avatar: "/home/doi-tac/1.webp", website: "https://example.com" },
      { id: "mock-partner-2", name: "Đối tác 2", avatar: "/home/doi-tac/2.webp", website: "https://example.com" },
      { id: "mock-partner-3", name: "Đối tác 3", avatar: "/home/doi-tac/3.webp", website: null },
      { id: "mock-partner-4", name: "Đối tác 4", avatar: "/home/doi-tac/4.webp", website: null },
      { id: "mock-partner-5", name: "Đối tác 5", avatar: "/home/doi-tac/5.webp", website: null },
      { id: "mock-partner-6", name: "Đối tác 6", avatar: "/home/doi-tac/6.webp", website: null },
    ] satisfies MockPartner[],
  },
};
