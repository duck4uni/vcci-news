"use client";

export const ADMIN_NEWS_STORAGE_KEY = "vcci-news.admin-news.data.v3";
export const ADMIN_MEDIA_STORAGE_KEY = "vcci-news.admin-media-library.data.v1";

export const ADMIN_NEWS_TYPE_OPTIONS = [
  { value: "tintuc", label: "Tin tức" },
  { value: "baiviettrang", label: "Bài viết trang" },
] as const;

export type AdminNewsType = (typeof ADMIN_NEWS_TYPE_OPTIONS)[number]["value"];

export const ADMIN_NEWS_TYPE_LABELS: Record<AdminNewsType, string> =
  ADMIN_NEWS_TYPE_OPTIONS.reduce(
    (result, option) => {
      result[option.value] = option.label;
      return result;
    },
    {} as Record<AdminNewsType, string>,
  );

export interface AdminMediaItem {
  id: string;
  name: string;
  alt: string;
  url: string;
  mime: string;
  size: number;
  created_at: string;
  updated_at: string;
  source: "seed" | "upload";
}

export interface AdminNewsImageRef {
  id: string;
  name: string;
  alt: string;
  url: string;
}

export interface AdminNewsContentImage {
  position: number;
  image: AdminNewsImageRef;
}

export interface AdminNewsContentSection {
  id: string;
  type: "text" | "image";
  position: number;
  content: string;
  image_columns: number;
  image_rows: number;
  images: AdminNewsContentImage[];
}

export interface AdminNewsItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  type: AdminNewsType;
  header_category_id: string;
  category_ids: string[];
  tagsearch_values: string[];
  is_featured: boolean;
  thumbnail: AdminNewsImageRef | null;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
  published_at: string;
  expired_at: string;
  started_at: string;
  ended_at: string;
  registration_deadline: string;
  location: string;
  participation_fee: string;
  post_content: AdminNewsContentSection[];
}

export interface AdminNewsFormValues {
  title: string;
  slug: string;
  summary: string;
  type: AdminNewsType | "";
  header_category_id: string;
  category_ids: string[];
  tagsearch_values: string[];
  is_featured: boolean;
  thumbnail: AdminNewsImageRef | null;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
  published_at: string;
  expired_at: string;
  started_at: string;
  ended_at: string;
  registration_deadline: string;
  location: string;
  participation_fee: string;
  post_content: AdminNewsContentSection[];
}

export const EMPTY_ADMIN_NEWS_FORM: AdminNewsFormValues = {
  title: "",
  slug: "",
  summary: "",
  type: "tintuc",
  header_category_id: "",
  category_ids: [],
  tagsearch_values: [],
  is_featured: false,
  thumbnail: null,
  is_hidden: false,
  created_at: "",
  updated_at: "",
  published_at: "",
  expired_at: "",
  started_at: "",
  ended_at: "",
  registration_deadline: "",
  location: "",
  participation_fee: "",
  post_content: [],
};

const mediaSeed: AdminMediaItem[] = [
  {
    id: "media-banner",
    name: "Banner VCCI News",
    alt: "Banner VCCI News",
    url: "/banner.webp",
    mime: "image/webp",
    size: 0,
    created_at: "2026-05-01T08:00:00.000Z",
    updated_at: "2026-05-01T08:00:00.000Z",
    source: "seed",
  },
  {
    id: "media-thumbnail",
    name: "Thumbnail mặc định",
    alt: "Thumbnail mặc định",
    url: "/thumbnail.png",
    mime: "image/png",
    size: 0,
    created_at: "2026-05-01T08:10:00.000Z",
    updated_at: "2026-05-01T08:10:00.000Z",
    source: "seed",
  },
  {
    id: "media-home-01",
    name: "Hoạt động hội viên",
    alt: "Hoạt động hội viên",
    url: "/home/20-2048x1365.webp",
    mime: "image/webp",
    size: 0,
    created_at: "2026-05-02T07:30:00.000Z",
    updated_at: "2026-05-02T07:30:00.000Z",
    source: "seed",
  },
  {
    id: "media-home-02",
    name: "Banner sự kiện",
    alt: "Banner sự kiện",
    url: "/home/eCarAid_web_banner_600x400.webp",
    mime: "image/webp",
    size: 0,
    created_at: "2026-05-03T09:15:00.000Z",
    updated_at: "2026-05-03T09:15:00.000Z",
    source: "seed",
  },
];

function toImageRef(item: AdminMediaItem): AdminNewsImageRef {
  return {
    id: item.id,
    name: item.name,
    alt: item.alt,
    url: item.url,
  };
}

const newsSeed: AdminNewsItem[] = [
  {
    id: "admin-news-01",
    title: "VCCI thúc đẩy kết nối doanh nghiệp hội viên khu vực phía Nam",
    slug: "vcci-thuc-day-ket-noi-doanh-nghiep-hoi-vien-khu-vuc-phia-nam",
    summary:
      "<p>Bản tin tổng hợp các hoạt động kết nối doanh nghiệp, mở rộng thị trường và nâng cao năng lực quản trị cho hội viên VCCI.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-news", "cat-activity"],
    tagsearch_values: ["Tin VCCI", "Doanh nghiệp hội viên", "Chuyển đổi số"],
    is_featured: true,
    thumbnail: toImageRef(mediaSeed[2]),
    is_hidden: false,
    created_at: "2026-05-08T09:00:00.000Z",
    updated_at: "2026-05-10T09:30:00.000Z",
    published_at: "2026-05-08T09:00",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "TP. Hồ Chí Minh",
    participation_fee: "Miễn phí",
    post_content: [
      {
        id: "section-admin-news-01-a",
        type: "text",
        position: 1,
        content:
          "<p>Chương trình tập trung vào các giải pháp mở rộng mạng lưới doanh nghiệp hội viên, đồng thời hỗ trợ các đơn vị tiếp cận cơ hội hợp tác mới trong năm 2026.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
      {
        id: "section-admin-news-01-b",
        type: "image",
        position: 2,
        content: "",
        image_columns: 2,
        image_rows: 1,
        images: [
          { position: 1, image: toImageRef(mediaSeed[2]) },
          { position: 2, image: toImageRef(mediaSeed[3]) },
        ],
      },
    ],
  },
  {
    id: "admin-news-02",
    title: "Lịch hội thảo chuyển đổi số dành cho hội viên tháng 5",
    slug: "lich-hoi-thao-chuyen-doi-so-danh-cho-hoi-vien-thang-5",
    summary:
      "<p>Lịch hội thảo cập nhật những chương trình đào tạo, chia sẻ chuyên đề và kết nối nguồn lực hỗ trợ doanh nghiệp.</p>",
    type: "tintuc",
    header_category_id: "activity-events",
    category_ids: ["cat-event"],
    tagsearch_values: ["Sự kiện", "Đăng ký"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[3]),
    is_hidden: false,
    created_at: "2026-05-09T08:30:00.000Z",
    updated_at: "2026-05-11T11:00:00.000Z",
    published_at: "2026-05-09T08:30",
    expired_at: "2026-05-31T18:00",
    started_at: "2026-05-20T08:00",
    ended_at: "2026-05-20T17:00",
    registration_deadline: "2026-05-18T17:00",
    location: "Trung tâm Hội nghị VCCI",
    participation_fee: "500.000 VNĐ",
    post_content: [
      {
        id: "section-admin-news-02-a",
        type: "text",
        position: 1,
        content:
          "<p>Nội dung chuỗi hội thảo bao gồm chuyển đổi số, quản trị dữ liệu, truyền thông nội bộ và ứng dụng AI trong hoạt động doanh nghiệp.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-03",
    title: "Giới thiệu vai trò của VCCI News trong hệ sinh thái nội dung số",
    slug: "gioi-thieu-vai-tro-cua-vcci-news-trong-he-sinh-thai-noi-dung-so",
    summary:
      "<p>Bài viết trang giới thiệu định hướng phát triển nội dung, cấu trúc quản trị và trải nghiệm người dùng trên website.</p>",
    type: "baiviettrang",
    header_category_id: "intro-about",
    category_ids: [],
    tagsearch_values: [],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[0]),
    is_hidden: false,
    created_at: "2026-05-06T10:00:00.000Z",
    updated_at: "2026-05-10T16:45:00.000Z",
    published_at: "2026-05-06T10:00",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "",
    participation_fee: "",
    post_content: [
      {
        id: "section-admin-news-03-a",
        type: "text",
        position: 1,
        content:
          "<p>VCCI News được định hướng là trung tâm cập nhật thông tin, chuyên đề và hoạt động hội viên trên cùng một nền tảng nội dung thống nhất.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
      {
        id: "section-admin-news-03-b",
        type: "image",
        position: 2,
        content: "",
        image_columns: 1,
        image_rows: 1,
        images: [{ position: 1, image: toImageRef(mediaSeed[0]) }],
      },
    ],
  },
  {
    id: "admin-news-04",
    title: "Diễn đàn xúc tiến thương mại khu vực phía Nam thu hút hơn 300 doanh nghiệp tham dự",
    slug: "dien-dan-xuc-tien-thuong-mai-khu-vuc-phia-nam-thu-hut-hon-300-doanh-nghiep-tham-du",
    summary:
      "<p>Chương trình quy tụ doanh nghiệp sản xuất, logistics và các đơn vị hỗ trợ xuất khẩu nhằm tạo mạng lưới kết nối giao thương thực chất.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-news", "cat-activity"],
    tagsearch_values: ["Tin Kinh Tế", "Xúc tiến thương mại", "Kết nối giao thương"],
    is_featured: true,
    thumbnail: toImageRef(mediaSeed[2]),
    is_hidden: false,
    created_at: "2026-05-12T08:20:00.000Z",
    updated_at: "2026-05-12T10:00:00.000Z",
    published_at: "2026-05-12T08:20",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "Trung tâm Hội chợ và Triển lãm Sài Gòn",
    participation_fee: "Miễn phí",
    post_content: [
      {
        id: "section-admin-news-04-a",
        type: "text",
        position: 1,
        content:
          "<p>Sự kiện nhấn mạnh nhu cầu tạo chuỗi kết nối ngắn, nhanh và có khả năng chuyển hóa thành cơ hội kinh doanh ngay sau chương trình.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-05",
    title: "Bản tin nhanh: doanh nghiệp hội viên tăng tốc chuyển đổi số trong khâu bán hàng và chăm sóc khách hàng",
    slug: "ban-tin-nhanh-doanh-nghiep-hoi-vien-tang-toc-chuyen-doi-so-trong-khau-ban-hang-va-cham-soc-khach-hang",
    summary:
      "<p>Nhiều mô hình ứng dụng CRM, dashboard và tự động hóa quy trình đang được chia sẻ tại chuỗi chuyên đề của VCCI News.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-news"],
    tagsearch_values: ["Chuyên Đề", "Chuyển đổi số"],
    is_featured: true,
    thumbnail: toImageRef(mediaSeed[3]),
    is_hidden: false,
    created_at: "2026-05-11T07:45:00.000Z",
    updated_at: "2026-05-11T13:15:00.000Z",
    published_at: "2026-05-11T07:45",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "Hệ thống trực tuyến",
    participation_fee: "Miễn phí",
    post_content: [
      {
        id: "section-admin-news-05-a",
        type: "text",
        position: 1,
        content:
          "<p>Xu hướng tập trung vào trải nghiệm khách hàng, đo lường hiệu quả vận hành và chuẩn hóa dữ liệu đang trở thành ưu tiên hàng đầu.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-06",
    title: "Khởi động chuỗi đối thoại chính sách với doanh nghiệp và hiệp hội ngành hàng năm 2026",
    slug: "khoi-dong-chuoi-doi-thoai-chinh-sach-voi-doanh-nghiep-va-hiep-hoi-nganh-hang-nam-2026",
    summary:
      "<p>Chuỗi đối thoại sẽ tập trung vào vướng mắc thủ tục, chi phí tuân thủ và các đề xuất cải thiện môi trường kinh doanh.</p>",
    type: "tintuc",
    header_category_id: "activity-events",
    category_ids: ["cat-event", "cat-policy"],
    tagsearch_values: ["Sự kiện", "Chính sách"],
    is_featured: true,
    thumbnail: toImageRef(mediaSeed[0]),
    is_hidden: false,
    created_at: "2026-05-10T09:10:00.000Z",
    updated_at: "2026-05-10T14:40:00.000Z",
    published_at: "2026-05-10T09:10",
    expired_at: "",
    started_at: "2026-05-28T08:30",
    ended_at: "2026-05-28T12:00",
    registration_deadline: "2026-05-25T17:00",
    location: "Hà Nội",
    participation_fee: "Miễn phí",
    post_content: [
      {
        id: "section-admin-news-06-a",
        type: "text",
        position: 1,
        content:
          "<p>Chương trình được thiết kế như một không gian lắng nghe phản hồi thực tiễn và tạo đầu mối điều phối cho các kiến nghị có trọng tâm.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-07",
    title: "Cẩm nang thiết kế gian hàng triển lãm hiệu quả cho doanh nghiệp tham gia hội chợ quốc tế",
    slug: "cam-nang-thiet-ke-gian-hang-trien-lam-hieu-qua-cho-doanh-nghiep-tham-gia-hoi-cho-quoc-te",
    summary:
      "<p>Nội dung tổng hợp những lưu ý về nhận diện thương hiệu, luồng trưng bày và cách tạo trải nghiệm ghi nhớ cho khách tham quan.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-news", "cat-activity"],
    tagsearch_values: ["Chuyên Đề", "Cẩm nang"],
    is_featured: true,
    thumbnail: toImageRef(mediaSeed[2]),
    is_hidden: false,
    created_at: "2026-05-07T14:00:00.000Z",
    updated_at: "2026-05-09T09:00:00.000Z",
    published_at: "2026-05-07T14:00",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "TP. Hồ Chí Minh",
    participation_fee: "Miễn phí",
    post_content: [
      {
        id: "section-admin-news-07-a",
        type: "text",
        position: 1,
        content:
          "<p>Tài liệu hướng dẫn được biên tập để doanh nghiệp có thể ứng dụng ngay khi chuẩn bị tham gia các sự kiện giao thương trong nước và quốc tế.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-08",
    title: "Hoa Kỳ muốn đẩy mạnh hợp tác kinh tế, thương mại bền vững với Việt Nam",
    slug: "hoa-ky-muon-day-manh-hop-tac-kinh-te-thuong-mai-ben-vung-voi-viet-nam",
    summary:
      "<p>Chương trình làm việc tập trung vào hợp tác chuỗi cung ứng, tiêu chuẩn xanh và kết nối doanh nghiệp giữa các địa phương.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-news"],
    tagsearch_values: ["Tin VCCI", "Hợp tác quốc tế"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[3]),
    is_hidden: false,
    created_at: "2026-03-27T09:00:00.000Z",
    updated_at: "2026-03-27T11:00:00.000Z",
    published_at: "2026-03-27T09:00",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "TP. Hồ Chí Minh",
    participation_fee: "Miễn phí",
    post_content: [
      {
        id: "section-admin-news-08-a",
        type: "text",
        position: 1,
        content:
          "<p>Đại diện hai bên nhấn mạnh nhu cầu phát triển bền vững và hỗ trợ cộng đồng doanh nghiệp thích ứng với thay đổi thị trường toàn cầu.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-09",
    title: "Những điểm sáng trong bức tranh kinh tế, số liệu quý II và 6 tháng đầu năm 2026",
    slug: "nhung-diem-sang-trong-buc-tranh-kinh-te-so-lieu-quy-ii-va-6-thang-dau-nam-2026",
    summary:
      "<p>Bản tin tổng hợp các tín hiệu phục hồi, tăng trưởng xuất khẩu và mức độ cải thiện niềm tin thị trường trong nhiều nhóm ngành.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-news"],
    tagsearch_values: ["Tin Kinh Tế", "Vĩ mô"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[2]),
    is_hidden: false,
    created_at: "2026-03-25T08:30:00.000Z",
    updated_at: "2026-03-25T10:00:00.000Z",
    published_at: "2026-03-25T08:30",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "Hà Nội",
    participation_fee: "Miễn phí",
    post_content: [
      {
        id: "section-admin-news-09-a",
        type: "text",
        position: 1,
        content:
          "<p>Dữ liệu cho thấy nhiều nhóm doanh nghiệp đang cải thiện năng lực đơn hàng và thích ứng tốt hơn với biến động chi phí.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-10",
    title: "Tình hình kinh tế - vĩ mô Quý 1 năm 2026",
    slug: "tinh-hinh-kinh-te-vi-mo-quy-1-nam-2026",
    summary:
      "<p>Báo cáo nhanh về tăng trưởng, lạm phát, lãi suất và xu hướng đầu tư trong bối cảnh kinh tế quốc tế còn nhiều thay đổi.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-news"],
    tagsearch_values: ["Tin Kinh Tế", "Vĩ mô"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[0]),
    is_hidden: false,
    created_at: "2026-03-22T08:00:00.000Z",
    updated_at: "2026-03-22T09:30:00.000Z",
    published_at: "2026-03-22T08:00",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "Hà Nội",
    participation_fee: "Miễn phí",
    post_content: [
      {
        id: "section-admin-news-10-a",
        type: "text",
        position: 1,
        content:
          "<p>Bản tin cung cấp góc nhìn cô đọng về những chỉ số ảnh hưởng trực tiếp đến hoạt động sản xuất, thương mại và đầu tư.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-11",
    title: "Cẩm nang hướng dẫn đầu tư kinh doanh tại Việt Nam dành cho doanh nghiệp mới",
    slug: "cam-nang-huong-dan-dau-tu-kinh-doanh-tai-viet-nam-danh-cho-doanh-nghiep-moi",
    summary:
      "<p>Tài liệu tổng hợp các bước chuẩn bị hồ sơ, lựa chọn địa điểm và những lưu ý pháp lý ban đầu cho nhà đầu tư và doanh nghiệp.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-news"],
    tagsearch_values: ["Chuyên Đề", "Cẩm nang"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[2]),
    is_hidden: false,
    created_at: "2026-03-20T07:30:00.000Z",
    updated_at: "2026-03-20T09:00:00.000Z",
    published_at: "2026-03-20T07:30",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "Trực tuyến",
    participation_fee: "Miễn phí",
    post_content: [
      {
        id: "section-admin-news-11-a",
        type: "text",
        position: 1,
        content:
          "<p>Nội dung được biên tập theo hướng dễ áp dụng, giúp doanh nghiệp mới có thể tra cứu nhanh khi bắt đầu triển khai dự án.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-12",
    title: "Khóa đào tạo: Quản trị Thuế và Pháp lý trong giao dịch",
    slug: "khoa-dao-tao-quan-tri-thue-va-phap-ly-trong-giao-dich",
    summary:
      "<p>Chương trình cập nhật các điểm mới về quản trị thuế, hồ sơ giao dịch và kiểm soát rủi ro pháp lý trong doanh nghiệp.</p>",
    type: "tintuc",
    header_category_id: "activity-events",
    category_ids: ["cat-event"],
    tagsearch_values: ["Đào tạo", "Sự kiện"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[3]),
    is_hidden: false,
    created_at: "2026-11-01T08:00:00.000Z",
    updated_at: "2026-11-01T10:00:00.000Z",
    published_at: "2026-11-01T08:00",
    expired_at: "",
    started_at: "2026-11-18T08:30",
    ended_at: "2026-11-18T16:30",
    registration_deadline: "2026-11-15T17:00",
    location: "TP. Hồ Chí Minh",
    participation_fee: "800.000 VNĐ",
    post_content: [
      {
        id: "section-admin-news-12-a",
        type: "text",
        position: 1,
        content:
          "<p>Khóa học dành cho đội ngũ quản lý, kế toán trưởng và chuyên viên pháp chế cần chuẩn hóa quy trình nội bộ.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-13",
    title: "Sự kiện - Tập huấn NSDLĐ",
    slug: "su-kien-tap-huan-nsdld",
    summary:
      "<p>Buổi tập huấn hướng dẫn người sử dụng lao động cập nhật các quy định thực thi và quy trình phối hợp với bộ phận nhân sự.</p>",
    type: "tintuc",
    header_category_id: "activity-events",
    category_ids: ["cat-event"],
    tagsearch_values: ["Đào tạo", "Sự kiện"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[2]),
    is_hidden: false,
    created_at: "2026-11-03T09:00:00.000Z",
    updated_at: "2026-11-03T09:30:00.000Z",
    published_at: "2026-11-03T09:00",
    expired_at: "",
    started_at: "2026-11-20T13:30",
    ended_at: "2026-11-20T17:00",
    registration_deadline: "2026-11-18T17:00",
    location: "Hà Nội",
    participation_fee: "Miễn phí",
    post_content: [
      {
        id: "section-admin-news-13-a",
        type: "text",
        position: 1,
        content:
          "<p>Nội dung tập huấn tập trung vào các tình huống thường gặp trong quá trình vận hành chính sách nhân sự và lao động.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-14",
    title: "Diễn đàn hội viên: Kết nối thị trường và chuỗi cung ứng",
    slug: "dien-dan-hoi-vien-ket-noi-thi-truong-va-chuoi-cung-ung",
    summary:
      "<p>Diễn đàn tạo không gian gặp gỡ giữa doanh nghiệp sản xuất, đơn vị phân phối và nhà cung cấp dịch vụ hỗ trợ thị trường.</p>",
    type: "tintuc",
    header_category_id: "activity-events",
    category_ids: ["cat-event"],
    tagsearch_values: ["Sự kiện", "Hội viên"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[0]),
    is_hidden: false,
    created_at: "2026-11-05T08:30:00.000Z",
    updated_at: "2026-11-05T11:00:00.000Z",
    published_at: "2026-11-05T08:30",
    expired_at: "",
    started_at: "2026-11-24T08:00",
    ended_at: "2026-11-24T12:00",
    registration_deadline: "2026-11-22T17:00",
    location: "Đà Nẵng",
    participation_fee: "Miễn phí",
    post_content: [
      {
        id: "section-admin-news-14-a",
        type: "text",
        position: 1,
        content:
          "<p>Chương trình hướng đến việc mở rộng cơ hội kết nối đối tác, chia sẻ nhu cầu thị trường và xây dựng chuỗi cung ứng linh hoạt hơn.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-15",
    title: "Chương trình kết nối doanh nghiệp hội viên ngành thực phẩm và bán lẻ",
    slug: "chuong-trinh-ket-noi-doanh-nghiep-hoi-vien-nganh-thuc-pham-va-ban-le",
    summary:
      "<p>Buổi kết nối tạo không gian giới thiệu sản phẩm, chia sẻ nhu cầu mua hàng và ghép nối đối tác giữa doanh nghiệp sản xuất với hệ thống phân phối.</p>",
    type: "tintuc",
    header_category_id: "activity-events",
    category_ids: ["cat-event"],
    tagsearch_values: ["Sự kiện", "Hội viên"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[2]),
    is_hidden: false,
    created_at: "2026-05-11T08:15:00.000Z",
    updated_at: "2026-05-11T10:30:00.000Z",
    published_at: "2026-05-11T08:15",
    expired_at: "",
    started_at: "2026-05-22T14:00",
    ended_at: "2026-05-22T17:00",
    registration_deadline: "2026-05-20T17:00",
    location: "TP. Hồ Chí Minh",
    participation_fee: "Miễn phí",
    post_content: [
      {
        id: "section-admin-news-15-a",
        type: "text",
        position: 1,
        content:
          "<p>Chương trình ưu tiên các nhóm doanh nghiệp đang cần mở rộng hệ thống phân phối và tìm đối tác đồng hành tại khu vực phía Nam.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-16",
    title: "Lớp đào tạo ngắn hạn: Kỹ năng xây dựng kế hoạch xúc tiến thương mại",
    slug: "lop-dao-tao-ngan-han-ky-nang-xay-dung-ke-hoach-xuc-tien-thuong-mai",
    summary:
      "<p>Khóa học hướng dẫn doanh nghiệp xác định mục tiêu, ngân sách và cách triển khai hoạt động xúc tiến thương mại theo từng giai đoạn.</p>",
    type: "tintuc",
    header_category_id: "activity-events",
    category_ids: ["cat-event"],
    tagsearch_values: ["Đào tạo", "Sự kiện"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[3]),
    is_hidden: false,
    created_at: "2026-05-12T07:45:00.000Z",
    updated_at: "2026-05-12T09:20:00.000Z",
    published_at: "2026-05-12T07:45",
    expired_at: "",
    started_at: "2026-05-26T08:30",
    ended_at: "2026-05-26T11:30",
    registration_deadline: "2026-05-24T17:00",
    location: "Trực tuyến",
    participation_fee: "350.000 VNĐ",
    post_content: [
      {
        id: "section-admin-news-16-a",
        type: "text",
        position: 1,
        content:
          "<p>Nội dung tập trung vào cấu trúc kế hoạch, xây dựng đầu việc ưu tiên và lựa chọn kênh triển khai phù hợp với nguồn lực của doanh nghiệp.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-17",
    title: "Công ty Western Coast Enterprise LTD cần thuê mua vật liệu xây dựng tại Việt Nam",
    slug: "cong-ty-western-coast-enterprise-ltd-can-thue-mua-vat-lieu-xay-dung-tai-viet-nam",
    summary:
      "<p>Doanh nghiệp tìm kiếm đối tác cung ứng vật liệu xây dựng ổn định tại thị trường Việt Nam để phục vụ kế hoạch mở rộng chuỗi dự án trong khu vực.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-business-opportunity"],
    tagsearch_values: ["Cơ hội kinh doanh", "Kết nối giao thương"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[2]),
    is_hidden: false,
    created_at: "2025-11-12T08:00:00.000Z",
    updated_at: "2025-11-12T09:30:00.000Z",
    published_at: "2025-11-12T08:00",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "TP. Hồ Chí Minh",
    participation_fee: "",
    post_content: [
      {
        id: "section-admin-news-17-a",
        type: "text",
        position: 1,
        content:
          "<p>Nhu cầu tập trung vào nhóm vật liệu hoàn thiện, vật liệu nền móng và các nhà cung ứng có khả năng đáp ứng đơn hàng dài hạn.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-18",
    title: "VCCI-HCM kết nối các nhà đầu tư nước ngoài với doanh nghiệp Việt trong chuỗi cung ứng công nghiệp",
    slug: "vcci-hcm-ket-noi-cac-nha-dau-tu-nuoc-ngoai-voi-doanh-nghiep-viet-trong-chuoi-cung-ung-cong-nghiep",
    summary:
      "<p>Chương trình giới thiệu danh mục nhu cầu hợp tác, tìm nhà cung ứng linh kiện và đối tác gia công cho nhóm doanh nghiệp FDI.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-business-opportunity"],
    tagsearch_values: ["Cơ hội kinh doanh", "Hội viên"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[3]),
    is_hidden: false,
    created_at: "2025-11-12T07:00:00.000Z",
    updated_at: "2025-11-12T08:15:00.000Z",
    published_at: "2025-11-12T07:00",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "Bình Dương",
    participation_fee: "",
    post_content: [
      {
        id: "section-admin-news-18-a",
        type: "text",
        position: 1,
        content:
          "<p>Hoạt động ưu tiên những doanh nghiệp có năng lực sản xuất ổn định, minh bạch hồ sơ chất lượng và sẵn sàng tham gia đánh giá nhà máy.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-19",
    title: "Doanh nghiệp logistics tìm đối tác phân phối và khai thác tuyến vận chuyển liên vùng",
    slug: "doanh-nghiep-logistics-tim-doi-tac-phan-phoi-va-khai-thac-tuyen-van-chuyen-lien-vung",
    summary:
      "<p>Thông tin mời hợp tác dành cho các doanh nghiệp có hệ thống kho bãi, đội xe và năng lực xử lý đơn hàng tại khu vực phía Nam.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-business-opportunity"],
    tagsearch_values: ["Cơ hội kinh doanh", "Logistics"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[0]),
    is_hidden: false,
    created_at: "2025-11-11T10:30:00.000Z",
    updated_at: "2025-11-11T11:00:00.000Z",
    published_at: "2025-11-11T10:30",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "Long An",
    participation_fee: "",
    post_content: [
      {
        id: "section-admin-news-19-a",
        type: "text",
        position: 1,
        content:
          "<p>Nội dung hợp tác bao gồm phân phối nội địa, gom hàng xuất khẩu và phát triển thêm các điểm trung chuyển mới tại khu vực lân cận.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-20",
    title: "Những chính sách mới có hiệu lực từ ngày 01/10/2026",
    slug: "nhung-chinh-sach-moi-co-hieu-luc-tu-ngay-01-10-2026",
    summary:
      "<p>Tổng hợp nhanh các quy định mới liên quan đến thuế, lao động và thủ tục hành chính mà doanh nghiệp cần lưu ý trong kỳ áp dụng mới.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-policy-law"],
    tagsearch_values: ["Chính sách & pháp luật", "Chính sách"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[0]),
    is_hidden: false,
    created_at: "2025-11-12T09:00:00.000Z",
    updated_at: "2025-11-12T09:40:00.000Z",
    published_at: "2025-11-12T09:00",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "Hà Nội",
    participation_fee: "",
    post_content: [
      {
        id: "section-admin-news-20-a",
        type: "text",
        position: 1,
        content:
          "<p>Bài viết hệ thống lại các mốc áp dụng, nhóm đối tượng chịu tác động và một số đầu việc doanh nghiệp nên chuẩn bị sớm.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-21",
    title: "Luật được sửa đổi: nhiều quy định mới có lợi cho doanh nghiệp",
    slug: "luat-duoc-sua-doi-nhieu-quy-dinh-moi-co-loi-cho-doanh-nghiep",
    summary:
      "<p>Nội dung cập nhật tập trung vào các điểm sửa đổi về điều kiện kinh doanh, thủ tục hồ sơ và cơ chế hỗ trợ doanh nghiệp nhỏ và vừa.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-policy-law"],
    tagsearch_values: ["Chính sách & pháp luật", "Pháp luật"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[2]),
    is_hidden: false,
    created_at: "2025-11-12T08:30:00.000Z",
    updated_at: "2025-11-12T09:00:00.000Z",
    published_at: "2025-11-12T08:30",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "Hà Nội",
    participation_fee: "",
    post_content: [
      {
        id: "section-admin-news-21-a",
        type: "text",
        position: 1,
        content:
          "<p>Các thay đổi đáng chú ý giúp rút ngắn thời gian xử lý thủ tục và mở rộng thêm một số cơ chế linh hoạt cho nhà đầu tư.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-22",
    title: "Bảo vệ cổ đông: có được coi là sự kiện bất khả kháng đối với doanh nghiệp",
    slug: "bao-ve-co-dong-co-duoc-coi-la-su-kien-bat-kha-khang-doi-voi-doanh-nghiep",
    summary:
      "<p>Phân tích tình huống pháp lý thường gặp trong quản trị doanh nghiệp, trách nhiệm công bố thông tin và cách xác định rủi ro phát sinh.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-policy-law"],
    tagsearch_values: ["Chính sách & pháp luật", "Pháp luật"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[3]),
    is_hidden: false,
    created_at: "2025-11-12T08:00:00.000Z",
    updated_at: "2025-11-12T08:45:00.000Z",
    published_at: "2025-11-12T08:00",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "TP. Hồ Chí Minh",
    participation_fee: "",
    post_content: [
      {
        id: "section-admin-news-22-a",
        type: "text",
        position: 1,
        content:
          "<p>Bài viết đưa ra góc nhìn thực tiễn và khuyến nghị bước chuẩn bị hồ sơ nội bộ khi phát sinh tranh chấp liên quan đến quyền cổ đông.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-23",
    title: "Kết nối hội viên ngành xây dựng và vật liệu tại khu vực phía Nam",
    slug: "ket-noi-hoi-vien-nganh-xay-dung-va-vat-lieu-tai-khu-vuc-phia-nam",
    summary:
      "<p>Hoạt động kết nối tập trung vào nhóm doanh nghiệp sản xuất vật liệu, thi công công trình và đơn vị tư vấn đang cần mở rộng mạng lưới hợp tác.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-member-connection"],
    tagsearch_values: ["Kết nối hội viên", "Hội viên"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[2]),
    is_hidden: false,
    created_at: "2026-05-13T08:00:00.000Z",
    updated_at: "2026-05-13T08:30:00.000Z",
    published_at: "2026-05-13T08:00",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "TP. Hồ Chí Minh",
    participation_fee: "",
    post_content: [
      {
        id: "section-admin-news-23-a",
        type: "text",
        position: 1,
        content:
          "<p>Chương trình giới thiệu nhu cầu hợp tác, nhu cầu nhà cung ứng và các cơ hội triển khai dự án chung trong giai đoạn tới.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-24",
    title: "Không gian gặp gỡ hội viên mới trong mạng lưới doanh nghiệp dịch vụ",
    slug: "khong-gian-gap-go-hoi-vien-moi-trong-mang-luoi-doanh-nghiep-dich-vu",
    summary:
      "<p>Buổi networking quy tụ đại diện doanh nghiệp dịch vụ, thương mại và đơn vị tư vấn cùng chia sẻ nhu cầu kết nối khách hàng.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-member-connection"],
    tagsearch_values: ["Kết nối hội viên", "Networking"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[0]),
    is_hidden: false,
    created_at: "2026-05-12T15:00:00.000Z",
    updated_at: "2026-05-12T16:15:00.000Z",
    published_at: "2026-05-12T15:00",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "TP. Hồ Chí Minh",
    participation_fee: "",
    post_content: [
      {
        id: "section-admin-news-24-a",
        type: "text",
        position: 1,
        content:
          "<p>Nội dung chú trọng vào việc tạo điểm chạm ban đầu giữa các hội viên mới với cộng đồng doanh nghiệp hiện có của VCCI-HCM.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-25",
    title: "Chương trình chia sẻ cơ hội hợp tác giữa hội viên công nghệ và doanh nghiệp truyền thống",
    slug: "chuong-trinh-chia-se-co-hoi-hop-tac-giua-hoi-vien-cong-nghe-va-doanh-nghiep-truyen-thong",
    summary:
      "<p>Chuỗi hoạt động giúp doanh nghiệp công nghệ giới thiệu giải pháp số và tìm đối tác ứng dụng trong sản xuất, thương mại và dịch vụ.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-member-connection"],
    tagsearch_values: ["Kết nối hội viên", "Chuyển đổi số"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[3]),
    is_hidden: false,
    created_at: "2026-05-11T16:00:00.000Z",
    updated_at: "2026-05-11T17:00:00.000Z",
    published_at: "2026-05-11T16:00",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "Trực tuyến",
    participation_fee: "",
    post_content: [
      {
        id: "section-admin-news-25-a",
        type: "text",
        position: 1,
        content:
          "<p>Chương trình mở ra nhiều phiên giới thiệu nhanh, matching nhu cầu và trao đổi mô hình triển khai phù hợp theo từng nhóm ngành.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-26",
    title: "Phiên kết nối nhà mua hàng quốc tế với doanh nghiệp hội viên ngành gỗ",
    slug: "phien-ket-noi-nha-mua-hang-quoc-te-voi-doanh-nghiep-hoi-vien-nganh-go",
    summary:
      "<p>Chương trình tập trung vào nhu cầu sourcing sản phẩm nội thất, vật liệu hoàn thiện và nhóm doanh nghiệp có năng lực xuất khẩu tại khu vực phía Nam.</p>",
    type: "tintuc",
    header_category_id: "activity-events",
    category_ids: ["cat-event"],
    tagsearch_values: ["Sự kiện", "Hội viên"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[2]),
    is_hidden: false,
    created_at: "2026-05-13T09:00:00.000Z",
    updated_at: "2026-05-13T10:15:00.000Z",
    published_at: "2026-05-13T09:00",
    expired_at: "",
    started_at: "2026-05-29T08:30",
    ended_at: "2026-05-29T11:30",
    registration_deadline: "2026-05-27T17:00",
    location: "TP. Hồ Chí Minh",
    participation_fee: "Miễn phí",
    post_content: [
      {
        id: "section-admin-news-26-a",
        type: "text",
        position: 1,
        content:
          "<p>Hoạt động ưu tiên các doanh nghiệp có bộ hồ sơ năng lực xuất khẩu rõ ràng và sản phẩm phù hợp với nhóm nhà mua hàng đang mở rộng nguồn cung tại Việt Nam.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-27",
    title: "Hội thảo chuyên đề logistics lạnh cho doanh nghiệp thực phẩm và nông sản",
    slug: "hoi-thao-chuyen-de-logistics-lanh-cho-doanh-nghiep-thuc-pham-va-nong-san",
    summary:
      "<p>Chuỗi chia sẻ cập nhật xu hướng bảo quản lạnh, tối ưu chi phí vận chuyển và tiêu chuẩn chất lượng trong chuỗi cung ứng thực phẩm.</p>",
    type: "tintuc",
    header_category_id: "activity-events",
    category_ids: ["cat-event"],
    tagsearch_values: ["Sự kiện", "Chuyên đề"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[0]),
    is_hidden: false,
    created_at: "2026-05-14T07:45:00.000Z",
    updated_at: "2026-05-14T08:20:00.000Z",
    published_at: "2026-05-14T07:45",
    expired_at: "",
    started_at: "2026-05-30T13:30",
    ended_at: "2026-05-30T16:30",
    registration_deadline: "2026-05-28T17:00",
    location: "Cần Thơ",
    participation_fee: "Miễn phí",
    post_content: [
      {
        id: "section-admin-news-27-a",
        type: "text",
        position: 1,
        content:
          "<p>Phiên thảo luận kết nối doanh nghiệp sản xuất với đơn vị kho vận, chuỗi bán lẻ và nhà cung cấp giải pháp kiểm soát nhiệt độ trong bảo quản.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-28",
    title: "Khóa đào tạo thực hành xây dựng hồ sơ năng lực số cho doanh nghiệp hội viên",
    slug: "khoa-dao-tao-thuc-hanh-xay-dung-ho-so-nang-luc-so-cho-doanh-nghiep-hoi-vien",
    summary:
      "<p>Khóa học hướng dẫn doanh nghiệp chuẩn hóa profile giới thiệu, tài liệu bán hàng và công cụ trình bày năng lực trên môi trường số.</p>",
    type: "tintuc",
    header_category_id: "activity-events",
    category_ids: ["cat-event"],
    tagsearch_values: ["Đào tạo", "Hội viên"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[3]),
    is_hidden: false,
    created_at: "2026-05-14T10:10:00.000Z",
    updated_at: "2026-05-14T10:50:00.000Z",
    published_at: "2026-05-14T10:10",
    expired_at: "",
    started_at: "2026-06-03T08:30",
    ended_at: "2026-06-03T11:30",
    registration_deadline: "2026-06-01T17:00",
    location: "Trực tuyến",
    participation_fee: "300.000 VNĐ",
    post_content: [
      {
        id: "section-admin-news-28-a",
        type: "text",
        position: 1,
        content:
          "<p>Nội dung tập trung vào các phần cốt lõi của bộ hồ sơ giới thiệu doanh nghiệp, hình ảnh minh họa và cách trình bày thông tin súc tích để chào đối tác.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-29",
    title: "Diễn đàn kết nối tài chính xanh cho doanh nghiệp sản xuất và xuất khẩu",
    slug: "dien-dan-ket-noi-tai-chinh-xanh-cho-doanh-nghiep-san-xuat-va-xuat-khau",
    summary:
      "<p>Chương trình cập nhật các nguồn vốn xanh, tiêu chí đánh giá dự án và giải pháp chuẩn bị hồ sơ tiếp cận tài chính cho doanh nghiệp.</p>",
    type: "tintuc",
    header_category_id: "activity-events",
    category_ids: ["cat-event"],
    tagsearch_values: ["Sự kiện", "Tài chính xanh"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[2]),
    is_hidden: false,
    created_at: "2026-05-14T11:20:00.000Z",
    updated_at: "2026-05-14T12:00:00.000Z",
    published_at: "2026-05-14T11:20",
    expired_at: "",
    started_at: "2026-06-05T14:00",
    ended_at: "2026-06-05T17:00",
    registration_deadline: "2026-06-03T17:00",
    location: "Hà Nội",
    participation_fee: "Miễn phí",
    post_content: [
      {
        id: "section-admin-news-29-a",
        type: "text",
        position: 1,
        content:
          "<p>Diễn đàn tạo nhịp kết nối giữa doanh nghiệp, ngân hàng và đơn vị tư vấn để trao đổi về điều kiện tiếp cận các chương trình tài chính xanh.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
];

export function slugifyAdminNews(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function resolveAdminNewsType(value?: string | null): AdminNewsType | undefined {
  if (!value) return undefined;

  const normalized = value.trim().toLowerCase();
  const compact = normalized.replace(/[\s_-]+/g, "");

  const direct = ADMIN_NEWS_TYPE_OPTIONS.find(
    (option) => option.value === normalized || option.value === compact,
  );

  if (direct) return direct.value;

  const aliases: Record<string, AdminNewsType> = {
    news: "tintuc",
    "tin tuc": "tintuc",
    "tin tức": "tintuc",
    pagepost: "baiviettrang",
    "bai viet trang": "baiviettrang",
    "bài viết trang": "baiviettrang",
  };

  return aliases[normalized] || aliases[compact];
}

export function createAdminNewsId() {
  return `admin-news-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createAdminMediaId() {
  return `admin-media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createAdminNewsSectionId() {
  return `section-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function cloneAdminNewsFormValues(item?: AdminNewsItem | null): AdminNewsFormValues {
  if (!item) {
    return {
      ...EMPTY_ADMIN_NEWS_FORM,
      category_ids: [],
      tagsearch_values: [],
      post_content: [],
    };
  }

  return {
    title: item.title,
    slug: item.slug,
    summary: item.summary,
    type: item.type,
    header_category_id: item.header_category_id,
    category_ids: [...item.category_ids],
    tagsearch_values: [...(item.tagsearch_values ?? [])],
    is_featured: item.is_featured ?? false,
    thumbnail: item.thumbnail ? { ...item.thumbnail } : null,
    is_hidden: item.is_hidden,
    created_at: item.created_at,
    updated_at: item.updated_at,
    published_at: item.published_at,
    expired_at: item.expired_at,
    started_at: item.started_at,
    ended_at: item.ended_at,
    registration_deadline: item.registration_deadline,
    location: item.location,
    participation_fee: item.participation_fee,
    post_content: item.post_content.map((section) => ({
      ...section,
      images: section.images.map((image) => ({
        ...image,
        image: { ...image.image },
      })),
    })),
  };
}

export function normalizeAdminMediaItems(items: AdminMediaItem[]) {
  return [...items].sort((left, right) => {
    return (
      new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime() ||
      right.name.localeCompare(left.name, "vi")
    );
  });
}

export function normalizeAdminNewsItems(items: AdminNewsItem[]) {
  return [...items]
    .map((item) => ({
      ...item,
      category_ids: Array.isArray(item.category_ids) ? item.category_ids : [],
      tagsearch_values: Array.isArray(item.tagsearch_values)
        ? item.tagsearch_values.filter(Boolean)
        : [],
      is_featured: item.type === "tintuc" ? Boolean(item.is_featured) : false,
    }))
    .sort((left, right) => {
      const leftTime = new Date(left.published_at || left.created_at).getTime();
      const rightTime = new Date(right.published_at || right.created_at).getTime();

      return rightTime - leftTime || right.updated_at.localeCompare(left.updated_at);
    });
}

export function getAdminMediaSeed() {
  return normalizeAdminMediaItems(mediaSeed);
}

export function getAdminNewsSeed() {
  return normalizeAdminNewsItems(newsSeed);
}

export function readAdminMediaItems() {
  if (typeof window === "undefined") return getAdminMediaSeed();

  const raw = window.localStorage.getItem(ADMIN_MEDIA_STORAGE_KEY);
  if (!raw) return getAdminMediaSeed();

  try {
    const parsed = JSON.parse(raw) as AdminMediaItem[];
    if (!Array.isArray(parsed)) {
      return getAdminMediaSeed();
    }

    return normalizeAdminMediaItems(parsed);
  } catch {
    return getAdminMediaSeed();
  }
}

export function readAdminNewsItems() {
  if (typeof window === "undefined") return getAdminNewsSeed();

  const raw = window.localStorage.getItem(ADMIN_NEWS_STORAGE_KEY);
  if (!raw) return getAdminNewsSeed();

  try {
    const parsed = JSON.parse(raw) as AdminNewsItem[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return getAdminNewsSeed();
    }

    return normalizeAdminNewsItems(parsed);
  } catch {
    return getAdminNewsSeed();
  }
}

export function persistAdminMediaItems(items: AdminMediaItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    ADMIN_MEDIA_STORAGE_KEY,
    JSON.stringify(normalizeAdminMediaItems(items)),
  );
}

export function persistAdminNewsItems(items: AdminNewsItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    ADMIN_NEWS_STORAGE_KEY,
    JSON.stringify(normalizeAdminNewsItems(items)),
  );
}
