/**
 * Type local — được khai báo trực tiếp ở đây để tránh vấn đề Next.js không resolve
 * được module qua route group lồng `(main)/(home)`. Shape này được giữ đồng bộ
 * với `HomePostItem` / `HomePostCategory` trong `use-home-posts.ts`.
 */
export type HomePostCategory = {
  id: string;
  name: string;
  slug: string;
  url: string;
  type: string;
};

export type HomePostItem = {
  id: string;
  title: string;
  externalLink: string;
  summary: string;
  contentText: string;
  createdAt: string;
  publishedAt: string;
  startedAt: string;
  endedAt: string;
  registrationDeadline: string;
  location: string;
  participationFee: string;
  expiredAt: string;
  isFeatured: boolean;
  isHidden: boolean;
  isActive: boolean;
  status: string;
  type: string;
  categories: HomePostCategory[];
  thumbnail: { url: string; alt: string } | null;
};

/**
 * Dữ liệu dự phòng (mock) cho trang chủ.
 * Được dùng khi CMS / BE gặp sự cố và /api/post trả về lỗi — website vẫn hiển thị
 * được những nội dung cơ bản để người dùng vào vẫn thấy "có dữ liệu".
 *
 * Mỗi bài viết mock có đầy đủ:
 *   - `summary`: đoạn tóm tắt ngắn hiển thị ở trang chủ
 *   - `content`: HTML đầy đủ nhiều đoạn (giống bài viết thật từ vccihcm.vn)
 *
 * Categories đầy đủ để mọi section của trang chủ (Tin VCCI / Tin Kinh tế / Sự kiện /
 * Chính sách / Tin nổi bật / Liên kết nhanh / Đào tạo / Cơ hội kinh doanh /
 * Kết nối hội viên) đều có dữ liệu dự phòng.
 */

const CATEGORY_IDS = {
  tinVcci: "b89b2ba6-a699-47cb-87e4-0643aea549a9",
  tinKinhTe: "755106b6-1aca-47dc-9a9c-d434736c33a1",
  chuyenDe: "8e7090e5-bfc3-4128-81a5-37ec78c33bad",
  suKien: "b85f6710-bcbc-4c0b-8b3a-09fff0e5e51a",
  daoTao: "36df7021-9a74-43d6-9084-0d5ed347b7f4",
  coHoiKinhDoanh: "0a460499-89c1-4f52-8592-1fb7bb69c4a2",
  chinhSachPhapLuat: "cc448be9-b9ea-46a8-aa7b-0584803330e8",
  ketNoiHoiVien: "a37b8a02-e8b3-42ce-9225-6dae460fed99",
  lienKetNhanh: "d7f05384-b1b4-428e-b9b3-37e0e1b0cecd",
} as const;

const CATEGORY_URLS = {
  tinVcci: "/thong-tin-truyen-thong/tin-vcci",
  tinKinhTe: "/thong-tin-truyen-thong/tin-kinh-te",
  chuyenDe: "/thong-tin-truyen-thong/chuyen-de",
  suKien: "/hoat-dong/su-kien",
  daoTao: "/hoat-dong/dao-tao",
  coHoiKinhDoanh: "/hoat-dong/co-hoi-kinh-doanh",
  chinhSachPhapLuat: "/thong-tin-truyen-thong/chinh-sach-phap-luat",
  ketNoiHoiVien: "/hoi-vien/ket-noi-hoi-vien",
  lienKetNhanh: "/lien-ket-nhanh",
} as const;

const HERO_IMAGE = "/home/Standard-Banner-1-2024.png.webp";
const SIDE_IMAGE = "/home/eCarAid_web_banner_600x400.webp";
const MEMBER_IMAGE = "/home/20-2048x1365.webp";

const buildCategory = (
  id: string,
  name: string,
  slug: string,
  url: string,
): HomePostCategory => ({
  id,
  name,
  slug,
  url,
  type: "news",
});

type BuildPostParams = {
  id: string;
  title: string;
  summary: string;
  content: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  categoryUrl: string;
  thumbnailUrl: string;
  publishedAt: string;
  isFeatured?: boolean;
  startedAt?: string;
  endedAt?: string;
  registrationDeadline?: string;
  location?: string;
};

const buildPost = (params: BuildPostParams): HomePostItem => ({
  id: params.id,
  title: params.title,
  externalLink: `/bai-viet/${params.id}`,
  summary: params.summary,
  contentText: params.content,
  createdAt: params.publishedAt,
  publishedAt: params.publishedAt,
  startedAt: params.startedAt ?? "",
  endedAt: params.endedAt ?? "",
  registrationDeadline: params.registrationDeadline ?? "",
  location: params.location ?? "",
  participationFee: "",
  expiredAt: "",
  isFeatured: Boolean(params.isFeatured),
  isHidden: false,
  isActive: true,
  status: "published",
  type: "news",
  categories: [
    buildCategory(
      params.categoryId,
      params.categoryName,
      params.categorySlug,
      params.categoryUrl,
    ),
  ],
  thumbnail: {
    url: params.thumbnailUrl,
    alt: params.title,
  },
});

/** Helper: tạo content HTML nhiều đoạn văn + heading + ảnh — giống bài thật. */
const buildContent = (
  intro: string,
  paragraphs: string[],
  options: { headings?: string[]; imageUrl?: string } = {},
): string => {
  const parts: string[] = [];

  parts.push(
    `<p style="text-align: justify;"><strong>${intro}</strong></p>`,
  );

  paragraphs.forEach((p, idx) => {
    const heading = options.headings?.[idx];
    if (heading) {
      parts.push(`<h3 style="margin-top: 20px;">${heading}</h3>`);
    }
    parts.push(`<p style="text-align: justify;">${p}</p>`);
  });

  if (options.imageUrl) {
    parts.push(
      `<p style="text-align: center; margin: 24px 0;"><img src="${options.imageUrl}" alt="" style="max-width: 100%; height: auto; border-radius: 12px;" /></p>`,
    );
  }

  parts.push(
    `<p style="text-align: right;"><em>Theo VCCI-HCM.</em></p>`,
  );

  return parts.join("\n");
};

// =====================================================================
// MOCK POSTS
// =====================================================================

export const MOCK_HOME_POSTS: HomePostItem[] = [
  // ----------------------------------------------------------------
  // TIN NỔI BẬT (FEATURED)
  // ----------------------------------------------------------------
  buildPost({
    id: "mock-featured-1",
    title: "VCCI-HCM đẩy mạnh kết nối doanh nghiệp hội viên trong năm 2026",
    summary:
      "Liên đoàn Thương mại và Công nghiệp Việt Nam – Chi nhánh TP.HCM triển khai nhiều chương trình hỗ trợ doanh nghiệp hội viên, thúc đẩy hợp tác kinh doanh và mở rộng thị trường quốc tế.",
    content: buildContent(
      "Trong năm 2026, VCCI-HCM xác định tập trung vào 3 trụ cột: kết nối doanh nghiệp, hỗ trợ pháp lý và đào tạo nâng cao năng lực.",
      [
        "Sáng ngày 06/04/2026, tại trụ sở VCCI-HCM (Quận 1, TP.HCM), Ban Chấp hành Liên đoàn Thương mại và Công nghiệp Việt Nam – Chi nhánh TP.HCM đã tổ chức Hội nghị triển khai kế hoạch hoạt động năm 2026 với sự tham dự của hơn 150 đại biểu đến từ các hiệp hội ngành nghề, doanh nghiệp hội viên và các đối tác chiến lược.",
        "Phát biểu tại hội nghị, Giám đốc VCCI-HCM Trần Ngọc Liêm nhấn mạnh: \"Năm 2026 là năm bản lề cho giai đoạn phát triển mới. Chúng tôi sẽ tập trung đẩy mạnh 3 trụ cột: kết nối doanh nghiệp – hội viên với nhau và với thị trường quốc tế; hỗ trợ pháp lý và cải cách thể chế; đào tạo nâng cao năng lực quản trị và chuyển đổi số cho cộng đồng doanh nghiệp.\"",
        "Theo kế hoạch, VCCI-HCM sẽ phối hợp với các đối tác Hoa Kỳ, Nhật Bản, EU tổ chức ít nhất 12 đoàn khảo sát thị trường, xúc tiến thương mại trong năm 2026. Đồng thời, hệ thống cơ sở dữ liệu hội viên sẽ được nâng cấp tích hợp AI nhằm kết nối nhanh các cơ hội kinh doanh.",
        "Hội nghị cũng đã công bố Chương trình Kết nối Doanh nghiệp Việt – Mỹ 2026, dự kiến diễn ra vào tháng 9 tới tại TP.HCM với sự tham gia của hơn 300 doanh nghiệp hai nước.",
        "Đáng chú ý, VCCI-HCM sẽ thành lập Trung tâm Hỗ trợ Doanh nghiệp SME nhằm tư vấn miễn phí về pháp lý, thuế, thủ tục hành chính cho các doanh nghiệp vừa và nhỏ trên địa bàn TP.HCM và các tỉnh lân cận.",
      ],
      { imageUrl: HERO_IMAGE },
    ),
    categoryId: CATEGORY_IDS.tinVcci,
    categoryName: "Tin VCCI",
    categorySlug: "tin-vcci",
    categoryUrl: CATEGORY_URLS.tinVcci,
    thumbnailUrl: HERO_IMAGE,
    publishedAt: "2026-04-06T19:09:00.000Z",
    isFeatured: true,
  }),
  buildPost({
    id: "mock-featured-2",
    title: "VCCI-HCM đón tiếp đoàn Thương vụ bang Oregon, thúc đẩy hợp tác ngành gỗ",
    summary:
      "Buổi làm việc mở ra cơ hội hợp tác thương mại, đầu tư giữa doanh nghiệp Việt Nam và bang Oregon (Hoa Kỳ), đặc biệt trong lĩnh vực chế biến và xuất khẩu gỗ.",
    content: buildContent(
      "Đây là buổi làm việc cấp cao đầu tiên giữa VCCI-HCM và bang Oregon trong năm 2026, mở ra nhiều cơ hội hợp tác chiến lược.",
      [
        "Ngày 2/4/2026 tại TP.HCM, Liên đoàn Thương mại và Công nghiệp Việt Nam – Chi nhánh TP.HCM (VCCI-HCM) đã có buổi làm việc và đón tiếp đoàn công tác bang Oregon (Hoa Kỳ), nhằm trao đổi và thúc đẩy cơ hội hợp tác thương mại, đầu tư, đặc biệt trong lĩnh vực chế biến và xuất khẩu gỗ.",
        "Tham dự buổi làm việc, về phía bang Oregon có ông Colin Sears, Global Trade & Investment Manager thuộc Business Oregon. Về phía Hoa Kỳ tại Việt Nam có ông Trần Hải Nam, Chuyên viên Thương vụ Hoa Kỳ tại TP.HCM. Đại diện VCCI-HCM có ông Trần Ngọc Liêm, Giám đốc VCCI-HCM và ông Hồ Ngọc Vinh, Phó Trưởng phòng Giao dịch Quốc tế, cùng sự tham gia của một số doanh nghiệp Việt Nam tiêu biểu hoạt động trong lĩnh vực chế biến, xuất khẩu gỗ và nội thất.",
        "Tại buổi làm việc, ông Colin Sears đã giới thiệu tổng quan về tiềm năng kinh tế của bang Oregon, trong đó nhấn mạnh đây là một trong những trung tâm sản xuất gỗ lớn nhất khu vực phía Tây Hoa Kỳ. Oregon hiện tập trung vào các dòng sản phẩm gỗ có giá trị cao như cấu kiện nội thất, gỗ kỹ thuật (mass timber), với các thị trường xuất khẩu chính gồm Canada, Nhật Bản và khu vực ASEAN.",
        "Hai bên đã trao đổi cụ thể về khả năng tổ chức các đoàn khảo sát, học tập tại Oregon, bao gồm tham quan rừng, tìm hiểu quy trình vận hành ngành công nghiệp gỗ, làm việc với doanh nghiệp địa phương và kết nối giao thương trực tiếp. Phía Oregon cho biết các chương trình này cần khoảng 3–4 tháng chuẩn bị và sẵn sàng đón tiếp các đoàn doanh nghiệp Việt Nam trong thời gian tới.",
        "Bên cạnh đó, hai bên cũng đã thảo luận về các cơ chế hỗ trợ thương mại, trong đó có việc nghiên cứu áp dụng mô hình khu thương mại tự do (foreign trade zone) nhằm tối ưu chi phí thuế quan cho doanh nghiệp khi tham gia chuỗi cung ứng song phương.",
      ],
      { headings: ["Cơ hội hợp tác cụ thể", "Cơ chế hỗ trợ thương mại"], imageUrl: SIDE_IMAGE },
    ),
    categoryId: CATEGORY_IDS.tinKinhTe,
    categoryName: "Tin Kinh tế",
    categorySlug: "tin-kinh-te",
    categoryUrl: CATEGORY_URLS.tinKinhTe,
    thumbnailUrl: SIDE_IMAGE,
    publishedAt: "2026-04-05T19:39:00.000Z",
    isFeatured: true,
  }),
  buildPost({
    id: "mock-featured-3",
    title: "AI trở thành trợ lý điều hành cho các hiệp hội doanh nghiệp",
    summary:
      "Trong bối cảnh cách mạng công nghệ 4.0, AI đang dần trở thành công cụ hỗ trợ đắc lực giúp nâng cao hiệu quả quản trị và ra quyết định cho cộng đồng doanh nghiệp.",
    content: buildContent(
      "AI không thay thế con người, nhưng giúp các nhà quản lý hiệp hội xử lý khối lượng công việc lớn nhanh và chính xác hơn.",
      [
        "Trong bối cảnh bùng nổ của cách mạng khoa học công nghệ, AI đang dần trở thành \"trợ thủ\" đắc lực giúp nâng cao hiệu quả quản trị, hỗ trợ ra quyết định, và nâng cao chất lượng hoạt động của cộng đồng doanh nghiệp.",
        "Theo khảo sát của VCCI-HCM thực hiện trong quý I/2026 với hơn 200 hiệp hội ngành nghề, có tới 62% đơn vị đã và đang ứng dụng ít nhất một giải pháp AI vào hoạt động vận hành — từ chatbot hỗ trợ hội viên, phân tích dữ liệu thị trường, đến tự động hoá quy trình kết nối B2B.",
        "Điển hình, Hiệp hội Doanh nghiệp Cơ khí TP.HCM đã triển khai hệ thống AI giúp phân loại và phản hồi yêu cầu của hội viên trong vòng 1 phút, thay vì 24 giờ như trước. Hệ thống cũng gợi ý các đối tác phù hợp dựa trên lịch sử giao dịch và nhu cầu thực tế.",
        "Tuy nhiên, các chuyên gia cũng cảnh báo về những thách thức khi ứng dụng AI: bảo mật dữ liệu, chi phí đầu tư ban đầu, và quan trọng nhất là sự chấp nhận của đội ngũ nhân sự hiện tại. VCCI-HCM khuyến nghị các hiệp hội nên bắt đầu từ các bài toán nhỏ, đo lường hiệu quả rõ ràng, sau đó mới mở rộng quy mô.",
      ],
      { headings: ["Thực trạng ứng dụng AI", "Thách thức cần lưu ý"] },
    ),
    categoryId: CATEGORY_IDS.chuyenDe,
    categoryName: "Chuyên đề",
    categorySlug: "chuyen-de",
    categoryUrl: CATEGORY_URLS.chuyenDe,
    thumbnailUrl: HERO_IMAGE,
    publishedAt: "2026-03-25T16:09:00.000Z",
    isFeatured: true,
  }),

  // ----------------------------------------------------------------
  // TIN VCCI
  // ----------------------------------------------------------------
  buildPost({
    id: "mock-tinvcci-1",
    title: "Tăng cường kết nối, lan tỏa giá trị truyền thống VCCI",
    summary:
      "Chương trình tham quan, giao lưu giữa Chi đoàn, Công đoàn VCCI-HCM và VCCI Đồng bằng sông Cửu Long tại Cần Thơ.",
    content: buildContent(
      "Chuyến tham quan – giao lưu về nguồn không chỉ là dịp để đoàn viên thanh niên hiểu thêm về truyền thống lịch sử mà còn góp phần thắt chặt mối quan hệ giữa VCCI-HCM và VCCI ĐBSCL.",
      [
        "Nhằm thúc đẩy sự gắn kết, phối hợp giữa Chi đoàn, Công đoàn trong hệ thống VCCI, VCCI-HCM đã tổ chức chương trình tham quan, giao lưu giữa Chi đoàn, Công đoàn VCCI-HCM và VCCI Đồng bằng sông Cửu Long tại Cần Thơ vào 2 ngày 03-04/4/2026.",
        "Điểm nhấn nổi bật của chương trình chính là hoạt động giao lưu giữa hai đơn vị. Trong khuôn khổ chương trình, đoàn viên thanh niên hai bên đã có dịp gặp gỡ, trao đổi kinh nghiệm trong công tác chuyên môn, công tác Đoàn, chia sẻ những sáng kiến, mô hình hoạt động hiệu quả cũng như định hướng phát triển trong thời gian tới.",
        "Các nội dung thảo luận không chỉ dừng lại ở công tác chuyên môn, phong trào Đoàn, Công đoàn mà còn mở rộng ra các hoạt động đồng hành cùng doanh nghiệp, hỗ trợ phát triển bền vững và nâng cao năng lực cạnh tranh trong bối cảnh hội nhập.",
        "Sự giao thoa giữa khu vực kinh tế năng động là đô thị đặc biệt TP. Hồ Chí Minh và thành phố trực thuộc Trung ương Cần Thơ đã tạo nên một không gian trao đổi thực tiễn phong phú, góp phần mở ra nhiều cơ hội hợp tác trong tương lai.",
        "Hành trình khép lại bằng chuyến tham quan tại Công viên Đền Hùng Cần Thơ – công trình văn hóa mang đậm giá trị lịch sử và tâm linh, thể hiện đạo lý \"uống nước nhớ nguồn\" của dân tộc Việt Nam.",
      ],
      { headings: ["Hoạt động giao lưu", "Ý nghĩa chương trình"] },
    ),
    categoryId: CATEGORY_IDS.tinVcci,
    categoryName: "Tin VCCI",
    categorySlug: "tin-vcci",
    categoryUrl: CATEGORY_URLS.tinVcci,
    thumbnailUrl: HERO_IMAGE,
    publishedAt: "2026-04-06T19:09:00.000Z",
  }),
  buildPost({
    id: "mock-tinvcci-2",
    title: "VCCI kết nạp hội viên mới đợt 1 - 2026",
    summary:
      "VCCI sẽ tăng cường các hoạt động hỗ trợ doanh nghiệp hội viên và cộng đồng doanh nghiệp Việt Nam.",
    content: buildContent(
      "Đó là khẳng định của Phó Chủ tịch Liên đoàn Thương mại và Công nghiệp Việt Nam (VCCI) Võ Tân Thành tại Lễ trao chứng nhận hội viên mới.",
      [
        "Sáng ngày 26/3, Liên đoàn Thương mại và Công nghiệp Việt Nam chi nhánh Khu vực TP HCM (VCCI-HCM) đã tổ chức Lễ trao chứng nhận hội viên chính thức cho 48 doanh nghiệp; trong đó có 14 doanh nghiệp là Công ty Cổ phần, và 34 doanh nghiệp là Công ty TNHH.",
        "Phát biểu tại buổi Lễ, Phó Chủ tịch VCCI Võ Tân Thành đánh giá, thế giới đang bước vào một giai đoạn với nhiều thay đổi sâu sắc, với nhiều biến động khó lường bởi xung đột địa chính trị và các cuộc chiến tranh khốc liệt như xung đột tại khu vực Trung Đông giữa Mỹ - Israel – Iran, xung đột giữa Nga – Ukraine, tiềm ẩn nhiều nguy cơ, chuỗi cung ứng bị ảnh hưởng nghiêm trọng, thậm chí bị đứt gãy.",
        "Theo Phó Chủ tịch VCCI Võ Tân Thành, từ một nước nghèo, quy mô nền kinh tế nằm trong nhóm 10 nước thấp nhất thế giới, đến nay, Việt Nam đã đạt quy mô nền kinh tế đứng thứ 32 trên thế giới. Thương mại cũng đạt được những kết quả ngoạn mục. Về xuất nhập khẩu, Việt Nam đã lọt vào Top 20 nước có kim ngạch thương mại hàng đầu thế giới, với kim ngạch năm 2025 đạt 930 tỷ USD.",
        "Phó Chủ tịch VCCI Võ Tân Thành cho biết, VCCI đã xác định mục tiêu cũng như những hoạt động nhằm hỗ trợ cộng đồng doanh nghiệp. Một trong những nhiệm vụ trọng tâm trước đây cũng như trong thời gian tới là VCCI sẽ tiếp tục tham gia mạnh mẽ hơn, sâu hơn vào việc tham mưu, hoạch định chính sách, cải cách thể chế nhằm tạo môi trường kinh doanh thật sự minh bạch và thuận lợi cho cộng đồng doanh nghiệp.",
      ],
      { headings: ["48 doanh nghiệp mới gia nhập", "Cam kết hỗ trợ hội viên"], imageUrl: SIDE_IMAGE },
    ),
    categoryId: CATEGORY_IDS.tinVcci,
    categoryName: "Tin VCCI",
    categorySlug: "tin-vcci",
    categoryUrl: CATEGORY_URLS.tinVcci,
    thumbnailUrl: SIDE_IMAGE,
    publishedAt: "2026-03-25T16:09:00.000Z",
  }),
  buildPost({
    id: "mock-tinvcci-3",
    title: "Hội nghị Ban Chấp hành VCCI-HCM mở rộng lần thứ 8",
    summary:
      "Tổng kết hoạt động 6 tháng đầu năm và đề ra phương hướng nhiệm vụ trọng tâm 6 tháng cuối năm 2026.",
    content: buildContent(
      "Hội nghị đã thông qua 5 nghị quyết quan trọng liên quan đến công tác hỗ trợ hội viên, xúc tiến thương mại và chuyển đổi số.",
      [
        "Ngày 15/3/2026, VCCI-HCM đã tổ chức Hội nghị Ban Chấp hành mở rộng lần thứ 8 – nhiệm kỳ 2025-2030, với sự tham dự của toàn thể Ủy viên Ban Chấp hành, lãnh đạo các hiệp hội ngành nghề và đại diện các doanh nghiệp hội viên tiêu biểu.",
        "Hội nghị đã nghe và thảo luận các báo cáo quan trọng: Báo cáo tổng kết hoạt động 6 tháng đầu năm 2026; Báo cáo kết quả công tác hỗ trợ hội viên; Báo cáo tiến độ triển khai các chương trình xúc tiến thương mại quốc tế; Báo cáo tình hình tài chính.",
        "Phát biểu chỉ đạo tại hội nghị, đồng chí Võ Tân Thành – Phó Chủ tịch VCCI – đã biểu dương những kết quả tích cực mà VCCI-HCM đạt được trong 6 tháng đầu năm, đồng thời nhấn mạnh 6 tháng cuối năm cần tập trung vào 3 nhóm nhiệm vụ trọng tâm: đẩy mạnh chuyển đổi số, tăng cường kết nối quốc tế, và chuẩn bị tổ chức Đại hội VIII VCCI toàn quốc.",
        "Hội nghị cũng đã bầu bổ sung 2 Ủy viên Ban Chấp hành và thông qua chủ trương thành lập Trung tâm Hỗ trợ Doanh nghiệp SME trực thuộc VCCI-HCM.",
      ],
    ),
    categoryId: CATEGORY_IDS.tinVcci,
    categoryName: "Tin VCCI",
    categorySlug: "tin-vcci",
    categoryUrl: CATEGORY_URLS.tinVcci,
    thumbnailUrl: HERO_IMAGE,
    publishedAt: "2026-03-15T08:00:00.000Z",
  }),

  // ----------------------------------------------------------------
  // TIN KINH TẾ
  // ----------------------------------------------------------------
  buildPost({
    id: "mock-tinkinhte-1",
    title: "Việt Nam đạt quy mô nền kinh tế đứng thứ 32 trên thế giới",
    summary:
      "Kim ngạch xuất nhập khẩu năm 2025 đạt 930 tỷ USD, lọt vào Top 20 nước có kim ngạch thương mại hàng đầu.",
    content: buildContent(
      "Đây là lần đầu tiên Việt Nam đạt được vị trí này, đánh dấu bước ngoặt quan trọng trong quá trình hội nhập kinh tế quốc tế.",
      [
        "Theo số liệu mới nhất từ Tổng cục Hải quan và Tổng cục Thống kê, quy mô nền kinh tế Việt Nam năm 2025 đã đạt khoảng 510 tỷ USD, xếp thứ 32 trên thế giới — vượt qua nhiều nền kinh tế lớn trong khu vực Đông Nam Á.",
        "Về xuất nhập khẩu, tổng kim ngạch năm 2025 đạt 930 tỷ USD, trong đó xuất khẩu đạt 470 tỷ USD, nhập khẩu đạt 460 tỷ USD. Việt Nam lọt vào Top 20 nước có kim ngạch thương mại hàng đầu thế giới.",
        "Các đối tác thương mại lớn nhất của Việt Nam tiếp tục là Hoa Kỳ, Trung Quốc, Hàn Quốc, Nhật Bản và ASEAN. Đáng chú ý, Hoa Kỳ vẫn là thị trường xuất khẩu lớn nhất với kim ngạch đạt 142 tỷ USD, tăng 18% so với năm 2024.",
        "Thặng dư thương mại đạt 10 tỷ USD — mức thặng dư cao nhất trong 5 năm qua. Đây là kết quả của quá trình đa dạng hóa thị trường, đa dạng hóa sản phẩm xuất khẩu và chủ động tham gia các FTA thế hệ mới (CPTPP, EVFTA, UKVFTA).",
        "Tuy nhiên, các chuyên gia kinh tế cũng cảnh báo về những thách thức phía trước: căng thẳng địa chính trị toàn cầu, chi phí logistics tăng cao, và yêu cầu ngày càng khắt khe về phát triển bền vững từ các đối tác lớn.",
      ],
      { headings: ["Vị trí xếp hạng kinh tế", "Đối tác thương mại chính"], imageUrl: SIDE_IMAGE },
    ),
    categoryId: CATEGORY_IDS.tinKinhTe,
    categoryName: "Tin Kinh tế",
    categorySlug: "tin-kinh-te",
    categoryUrl: CATEGORY_URLS.tinKinhTe,
    thumbnailUrl: SIDE_IMAGE,
    publishedAt: "2026-04-05T19:39:00.000Z",
  }),
  buildPost({
    id: "mock-tinkinhte-2",
    title: "Doanh nghiệp Việt Nam tăng tốc chuyển đổi số và tăng trưởng xanh",
    summary:
      "Xu hướng chuyển đổi số, tăng trưởng xanh, phát triển bền vững đang là yêu cầu tất yếu của doanh nghiệp trong bối cảnh hội nhập.",
    content: buildContent(
      "Khảo sát của VCCI cho thấy 78% doanh nghiệp SME có kế hoạch đầu tư vào chuyển đổi số trong năm 2026.",
      [
        "Theo khảo sát mới nhất của VCCI thực hiện trong quý I/2026 với 1.500 doanh nghiệp trên toàn quốc, có tới 78% doanh nghiệp SME có kế hoạch đầu tư vào chuyển đổi số trong năm 2026, với mức đầu tư trung bình khoảng 800 triệu đồng/doanh nghiệp.",
        "Các lĩnh vực được ưu tiên chuyển đổi số hàng đầu gồm: hệ thống ERP (67%), thương mại điện tử (54%), marketing số (48%), tự động hoá sản xuất (42%). Trong đó, doanh nghiệp ngành dệt may, thực phẩm, logistics dẫn đầu về tốc độ chuyển đổi.",
        "Cùng với chuyển đổi số, tăng trưởng xanh cũng được xác định là ưu tiên chiến lược. Có 52% doanh nghiệp tham gia khảo sát cho biết đã hoặc đang triển khai các sáng kiến xanh: sử dụng năng lượng tái tạo, giảm phát thải CO2, đóng gói thân thiện môi trường, ESG reporting.",
        "Phó Chủ tịch VCCI nhấn mạnh: \"Chuyển đổi số và tăng trưởng xanh không còn là lựa chọn mà là yêu cầu bắt buộc để doanh nghiệp Việt Nam giữ vững vị thế trong chuỗi giá trị toàn cầu. Đây cũng là yêu cầu từ các đối tác lớn như EU, Hoa Kỳ, Nhật Bản khi áp dụng cơ chế CBAM, ESG reporting.\"",
      ],
      { headings: ["Tỷ lệ đầu tư chuyển đổi số", "Xu hướng tăng trưởng xanh"] },
    ),
    categoryId: CATEGORY_IDS.tinKinhTe,
    categoryName: "Tin Kinh tế",
    categorySlug: "tin-kinh-te",
    categoryUrl: CATEGORY_URLS.tinKinhTe,
    thumbnailUrl: HERO_IMAGE,
    publishedAt: "2026-03-28T10:00:00.000Z",
  }),
  buildPost({
    id: "mock-tinkinhte-3",
    title: "Hợp tác thương mại Việt Nam – Hoa Kỳ: Cơ hội từ bang Oregon",
    summary:
      "Bang Oregon (Hoa Kỳ) cam kết hỗ trợ doanh nghiệp Việt Nam tiếp cận nguồn nguyên liệu gỗ chất lượng cao.",
    content: buildContent(
      "Đây là cơ hội lớn cho ngành chế biến gỗ và nội thất Việt Nam trong bối cảnh nguồn nguyên liệu trong nước đang dần khan hiếm.",
      [
        "Trong chuyến thăm và làm việc tại VCCI-HCM ngày 02/4/2026, đại diện Bang Oregon đã công bố Chương trình Hỗ trợ Nhập khẩu Gỗ dành riêng cho doanh nghiệp Việt Nam — đây là chương trình hợp tác thương mại song phương đầu tiên giữa Oregon và Việt Nam trong lĩnh vực này.",
        "Theo đó, các doanh nghiệp Việt Nam hoạt động trong lĩnh vực chế biến gỗ, sản xuất đồ nội thất, xây dựng sẽ được hỗ trợ: kết nối trực tiếp với các nhà cung cấp gỗ uy tín tại Oregon; tư vấn về tiêu chuẩn chất lượng và chứng nhận quốc tế; hỗ trợ thủ tục hải quan và thuế quan; tham gia các đoàn khảo sát thực tế tại rừng và nhà máy chế biến tại Oregon.",
        "Bang Oregon hiện là một trong những trung tâm sản xuất gỗ lớn nhất khu vực phía Tây Hoa Kỳ, với sản lượng khoảng 4 tỷ board-feet mỗi năm. Các dòng sản phẩm gỗ chủ lực bao gồm: Douglas Fir, Western Red Cedar, Ponderosa Pine — đều là những loại gỗ có giá trị cao phục vụ ngành nội thất và xây dựng cao cấp.",
        "Phía VCCI-HCM cam kết sẽ tổ chức ít nhất 2 đoàn doanh nghiệp khảo sát tại Oregon trong năm 2026, đồng thời thành lập Tổ công tác hỗ trợ kết nối thương mại gỗ Việt – Mỹ.",
      ],
      { headings: ["Chương trình hỗ trợ nhập khẩu", "Sản phẩm gỗ chủ lực"] },
    ),
    categoryId: CATEGORY_IDS.tinKinhTe,
    categoryName: "Tin Kinh tế",
    categorySlug: "tin-kinh-te",
    categoryUrl: CATEGORY_URLS.tinKinhTe,
    thumbnailUrl: SIDE_IMAGE,
    publishedAt: "2026-03-20T09:30:00.000Z",
  }),

  // ----------------------------------------------------------------
  // CHUYÊN ĐỀ
  // ----------------------------------------------------------------
  buildPost({
    id: "mock-chuyende-1",
    title: "Ứng dụng AI trong quản trị hiệp hội doanh nghiệp",
    summary:
      "Phân tích cơ hội và thách thức khi ứng dụng AI vào hoạt động quản trị và vận hành hiệp hội.",
    content: buildContent(
      "AI không thay thế con người nhưng giúp nhân sự hiệp hội tăng 3-5 lần hiệu suất trong các tác vụ lặp lại.",
      [
        "Bài viết phân tích 6 use case phổ biến nhất khi ứng dụng AI vào quản trị hiệp hội: (1) Chatbot hỗ trợ hội viên 24/7; (2) Phân tích sentiment từ survey hội viên; (3) Gợi ý kết nối B2B thông minh; (4) Tự động hoá sự kiện; (5) Phân tích dữ liệu thị trường; (6) Cá nhân hoá nội dung truyền thông.",
        "Tuy nhiên, khi triển khai AI, các hiệp hội cần lưu ý 4 thách thức lớn: bảo mật dữ liệu hội viên (đặc biệt dữ liệu nhạy cảm như doanh thu, chiến lược kinh doanh); chi phí đầu tư ban đầu (từ 200 triệu đến 2 tỷ đồng tuỳ quy mô); sự chấp nhận của đội ngũ nhân sự (nhiều người lo ngại AI thay thế); tuân thủ quy định pháp luật về dữ liệu cá nhân (Nghị định 13/2023).",
        "Tác giả khuyến nghị lộ trình ứng dụng AI trong 3 giai đoạn: Giai đoạn 1 (0-6 tháng) — bắt đầu với chatbot và email marketing; Giai đoạn 2 (6-18 tháng) — phân tích dữ liệu và gợi ý kết nối; Giai đoạn 3 (18-36 tháng) — tích hợp sâu vào quy trình vận hành.",
        "Kết luận: AI là công cụ đắc lực, không phải mối đe doạ. Các hiệp hội đi sớm sẽ có lợi thế cạnh tranh rõ rệt trong việc thu hút và giữ chân hội viên.",
      ],
      { headings: ["6 use case phổ biến", "4 thách thức cần lưu ý", "Lộ trình 3 giai đoạn"] },
    ),
    categoryId: CATEGORY_IDS.chuyenDe,
    categoryName: "Chuyên đề",
    categorySlug: "chuyen-de",
    categoryUrl: CATEGORY_URLS.chuyenDe,
    thumbnailUrl: HERO_IMAGE,
    publishedAt: "2026-03-25T16:09:00.000Z",
  }),
  buildPost({
    id: "mock-chuyende-2",
    title: "Phát triển bền vững: Xu hướng tất yếu của doanh nghiệp Việt",
    summary:
      "Tổng quan các mô hình phát triển bền vững đang được doanh nghiệp Việt Nam áp dụng thành công.",
    content: buildContent(
      "Phát triển bền vững không chỉ là trách nhiệm xã hội mà là chiến lược kinh doanh giúp doanh nghiệp tăng trưởng dài hạn.",
      [
        "Báo cáo Phát triển Bền vững Doanh nghiệp Việt Nam 2026 do VCCI-HCM công bố cho thấy: 64% doanh nghiệp lớn đã xây dựng chiến lược ESG rõ ràng; 38% doanh nghiệp SME đã bắt đầu triển khai các sáng kiến xanh; 22% doanh nghiệp đã công bố Báo cáo Phát triển Bền vững (ESG Report) theo chuẩn quốc tế.",
        "Các mô hình phát triển bền vững đang được áp dụng phổ biến gồm: (1) Sử dụng năng lượng tái tạo (điện mặt trời mái nhà, điện gió); (2) Tối ưu hoá chuỗi cung ứng xanh; (3) Thiết kế sản phẩm thân thiện môi trường; (4) Đầu tư vào phúc lợi nhân viên và cộng đồng địa phương.",
        "Điển hình thành công: Công ty Vinamilk đã tiết kiệm 30% chi phí năng lượng sau 2 nám triển khai hệ thống pin mặt trời trên các nhà máy; Tập đoàn FPT đạt mức giảm 25% lượng khí thải CO2 sau khi chuyển đổi 40% văn phòng sang sử dụng năng lượng xanh; Công ty CP Thực phẩm Bích Chi đã thay thế 80% bao bì nhựa bằng bao bì phân huỷ sinh học, tiết kiệm 12 tỷ đồng chi phí/năm.",
        "Phó Chủ tịch VCCI nhận định: \"Phát triển bền vững không còn là lựa chọn. Trong vòng 5 năm tới, các doanh nghiệp không có chiến lược ESG rõ ràng sẽ gặp khó khăn trong việc tiếp cận vốn, thị trường và đối tác quốc tế.\"",
      ],
      { headings: ["Thực trạng ESG tại Việt Nam", "Mô hình phổ biến", "Điển hình thành công"] },
    ),
    categoryId: CATEGORY_IDS.chuyenDe,
    categoryName: "Chuyên đề",
    categorySlug: "chuyen-de",
    categoryUrl: CATEGORY_URLS.chuyenDe,
    thumbnailUrl: SIDE_IMAGE,
    publishedAt: "2026-03-12T11:00:00.000Z",
  }),

  // ----------------------------------------------------------------
  // SỰ KIỆN
  // ----------------------------------------------------------------
  buildPost({
    id: "mock-sukien-1",
    title: "Hội nghị kết nối doanh nghiệp Việt Nam – Hoa Kỳ 2026",
    summary:
      "Sự kiện kết nối B2B quy mô lớn giữa doanh nghiệp Việt Nam và các đối tác Hoa Kỳ.",
    content: buildContent(
      "Đây là sự kiện thường niên lớn nhất trong năm do VCCI-HCM tổ chức, quy tụ hơn 300 doanh nghiệp hai nước.",
      [
        "Hội nghị Kết nối Doanh nghiệp Việt Nam – Hoa Kỳ 2026 là sự kiện xúc tiến thương mại quy mô lớn nhất trong năm, do VCCI-HCM phối hợp với Đại sứ quán Hoa Kỳ tại Việt Nam, Phòng Thương mại Hoa Kỳ (AmCham) và các đối tác chiến lược tổ chức.",
        "Sự kiện dự kiến thu hút hơn 300 doanh nghiệp tham gia, bao gồm 200 doanh nghiệp Việt Nam và 100 doanh nghiệp Hoa Kỳ đến từ các bang Oregon, California, Texas, New York. Các ngành trọng tâm gồm: công nghệ, nông nghiệp công nghệ cao, chế biến thực phẩm, dệt may, logistics, năng lượng tái tạo.",
        "Chương trình bao gồm: Phiên toàn thể với các diễn giả cấp cao từ Chính phủ hai nước; 8 phiên B2B chuyên ngành; Khu trưng bày sản phẩm; Lễ ký kết hợp tác chiến lược; Chương trình khảo sát thực tế cho các đoàn doanh nghiệp.",
        "Đây là cơ hội tốt để doanh nghiệp Việt Nam kết nối trực tiếp với các đối tác Hoa Kỳ, tìm kiếm cơ hội xuất khẩu, nhập khẩu nguyên liệu và công nghệ, mở rộng mạng lưới kinh doanh quốc tế.",
      ],
      {
        headings: ["Quy mô sự kiện", "Chương trình chi tiết"],
      },
    ),
    categoryId: CATEGORY_IDS.suKien,
    categoryName: "Sự kiện",
    categorySlug: "su-kien",
    categoryUrl: CATEGORY_URLS.suKien,
    thumbnailUrl: HERO_IMAGE,
    publishedAt: "2026-04-01T08:00:00.000Z",
    startedAt: "2026-08-20T08:00:00.000Z",
    endedAt: "2026-08-21T17:00:00.000Z",
    registrationDeadline: "2026-08-15T23:59:59.000Z",
    location: "Trung tâm Hội nghị White Palace, 194 Hoàng Văn Thụ, Phú Nhuận, TP.HCM",
  }),
  buildPost({
    id: "mock-sukien-2",
    title: "Diễn đàn doanh nghiệp trẻ VCCI-HCM 2026",
    summary:
      "Diễn đàn thường niên dành cho các doanh nhân trẻ, hội viên VCCI-HCM.",
    content: buildContent(
      "Diễn đàn Doanh nghiệp trẻ 2026 là nơi quy tụ các doanh nhân dưới 40 tuổi đang điều hành các doanh nghiệp SME.",
      [
        "Diễn đàn Doanh nghiệp trẻ VCCI-HCM 2026 sẽ diễn ra ngày 10/9/2026 tại Khách sạn Rex, Quận 1, TP.HCM với chủ đề \"Doanh nhân trẻ trong kỷ nguyên số\". Sự kiện dự kiến thu hút hơn 500 doanh nhân trẻ đến từ khắp cả nước.",
        "Chương trình gồm: Phiên thảo luận về chuyển đổi số cho SME; Workshop kỹ năng quản trị hiện đại; Pitching competition cho các startup; Networking dinner; Giải thưởng Doanh nhân trẻ tiêu biểu 2026.",
        "Đặc biệt, năm nay Diễn đàn sẽ có sự tham gia của các CEO hàng đầu Việt Nam như: ông Nguyễn Lê Quốc Anh (VinAI), bà Trần Thị Phương Thảo (VNG), ông Đào Minh Tuấn (MoMo) — chia sẻ kinh nghiệm khởi nghiệp và phát triển doanh nghiệp.",
        "Đây là cơ hội để doanh nhân trẻ gặp gỡ, học hỏi, kết nối và tìm kiếm cơ hội hợp tác kinh doanh.",
      ],
      {
        headings: ["Thông tin sự kiện", "Diễn giả và chương trình"],
      },
    ),
    categoryId: CATEGORY_IDS.suKien,
    categoryName: "Sự kiện",
    categorySlug: "su-kien",
    categoryUrl: CATEGORY_URLS.suKien,
    thumbnailUrl: SIDE_IMAGE,
    publishedAt: "2026-03-15T09:00:00.000Z",
    startedAt: "2026-09-10T08:30:00.000Z",
    endedAt: "2026-09-10T17:00:00.000Z",
    registrationDeadline: "2026-09-05T23:59:59.000Z",
    location: "Khách sạn Rex, 141 Nguyễn Huệ, Quận 1, TP.HCM",
  }),

  // ----------------------------------------------------------------
  // CHÍNH SÁCH & PHÁP LUẬT
  // ----------------------------------------------------------------
  buildPost({
    id: "mock-csphapluat-1",
    title: "Tổng hợp chính sách mới có hiệu lực từ tháng 4/2026",
    summary:
      "Cập nhật các văn bản chính sách, pháp luật mới nhất ảnh hưởng đến hoạt động sản xuất kinh doanh của doanh nghiệp.",
    content: buildContent(
      "Bài viết tổng hợp 12 văn bản chính sách mới có hiệu lực từ tháng 4/2026 mà doanh nghiệp cần lưu ý.",
      [
        "Từ ngày 01/4/2026, hàng loạt văn bản chính sách, pháp luật mới chính thức có hiệu lực, bao gồm: Nghị định 13/2026/NĐ-CP về hỗ trợ doanh nghiệp SME tiếp cận vốn tín dụng; Thông tư 02/2026/TT-BTC hướng dẫn thuế GTGT đối với dịch vụ số; Quyết định 15/2026/QĐ-TTg về chương trình hỗ trợ chuyển đổi số cho doanh nghiệp.",
        "Đáng chú ý, Nghị định 13/2026 quy định các doanh nghiệp SME đáp ứng tiêu chí sẽ được hỗ trợ tới 70% lãi suất vay ngân hàng trong 2 năm đầu, với hạn mức vay lên tới 10 tỷ đồng. Đây là chính sách rất có ý nghĩa giúp doanh nghiệp SME tiếp cận vốn dễ dàng hơn.",
        "Thông tư 02/2026/TT-BTC hướng dẫn thuế GTGT đối với dịch vụ số (phần mềm SaaS, dịch vụ đám mây, AI) — theo đó mức thuế suất giảm từ 10% xuống 8% trong giai đoạn 2026-2028 nhằm khuyến khích chuyển đổi số.",
        "Quyết định 15/2026/QĐ-TTg công bố Chương trình hỗ trợ chuyển đổi số quốc gia với tổng ngân sách 5.000 tỷ đồng cho giai đoạn 2026-2030, trong đó ưu tiên hỗ trợ doanh nghiệp SME, hợp tác xã và hộ kinh doanh.",
        "Bài viết cũng tổng hợp các văn bản liên quan đến: chính sách bảo hiểm xã hội, quy định về thương mại điện tử, tiêu chuẩn chất lượng sản phẩm, và quy chế quản lý thị trường.",
      ],
      {
        headings: ["Chính sách hỗ trợ SME", "Thuế và chuyển đổi số", "Các văn bản khác"],
      },
    ),
    categoryId: CATEGORY_IDS.chinhSachPhapLuat,
    categoryName: "Thông tin Chính sách và Pháp luật",
    categorySlug: "thong-tin-chinh-sach-va-phap-luat",
    categoryUrl: CATEGORY_URLS.chinhSachPhapLuat,
    thumbnailUrl: HERO_IMAGE,
    publishedAt: "2026-04-01T07:00:00.000Z",
  }),
  buildPost({
    id: "mock-csphapluat-2",
    title: "Hướng dẫn thủ tục đăng ký doanh nghiệp năm 2026",
    summary:
      "Cẩm nang chi tiết về thủ tục đăng ký thành lập doanh nghiệp theo quy định pháp luật hiện hành.",
    content: buildContent(
      "Bài viết cập nhật những thay đổi mới nhất về thủ tục đăng ký doanh nghiệp theo Luật Doanh nghiệp 2020 (sửa đổi 2025).",
      [
        "Từ ngày 01/01/2026, thủ tục đăng ký doanh nghiệp được áp dụng theo Luật Doanh nghiệp 2020 (sửa đổi, bổ sung năm 2025) với một số điểm mới quan trọng: (1) Giảm thời gian xử lý hồ sơ từ 3 ngày xuống 1 ngày làm việc; (2) Bổ sung hình thức đăng ký trực tuyến hoàn toàn qua Cổng ĐKKD quốc gia; (3) Cho phép đăng ký đồng thời nhiều loại hình doanh nghiệp.",
        "Hồ sơ đăng ký doanh nghiệp gồm: Giấy đề nghị đăng ký doanh nghiệp; Điều lệ công ty; Danh sách thành viên/cổ đông sáng lập; Bản sao CMND/CCCD/Hộ chiếu của người đại diện; Giấy ủy quyền (nếu có).",
        "Quy trình 5 bước đăng ký doanh nghiệp trực tuyến: Bước 1 — Tạo tài khoản trên Cổng ĐKKD quốc gia (dangkykinhdoanh.gov.vn); Bước 2 — Chuẩn bị hồ sơ đầy đủ; Bước 3 — Nộp hồ sơ trực tuyến và thanh toán phí; Bước 4 — Nhận kết quả trong vòng 1 ngày làm việc; Bước 5 — Đăng ký thuế và làm con dấu.",
        "Phí đăng ký doanh nghiệp: 100.000 đồng/lần đối với công ty TNHH một thành viên, công ty TNHH hai thành viên trở lên; 200.000 đồng/lần đối với công ty cổ phần; 50.000 đồng/lần đối với doanh nghiệp tư nhân.",
        "Bài viết cũng lưu ý các điểm cần tránh khi đăng ký: chọn tên doanh nghiệp trùng hoặc gây nhầm lẫn với thương hiệu đã đăng ký; khai ngành nghề kinh doanh không đúng với mã ngành; không đăng ký vốn điều lệ phù hợp với quy mô hoạt động.",
      ],
      {
        headings: ["Điểm mới 2026", "Hồ sơ cần chuẩn bị", "Quy trình 5 bước", "Lưu ý quan trọng"],
      },
    ),
    categoryId: CATEGORY_IDS.chinhSachPhapLuat,
    categoryName: "Thông tin Chính sách và Pháp luật",
    categorySlug: "thong-tin-chinh-sach-va-phap-luat",
    categoryUrl: CATEGORY_URLS.chinhSachPhapLuat,
    thumbnailUrl: SIDE_IMAGE,
    publishedAt: "2026-03-18T10:00:00.000Z",
  }),

  // ----------------------------------------------------------------
  // LIÊN KẾT NHANH
  // ----------------------------------------------------------------
  buildPost({
    id: "mock-quick-1",
    title: "Đăng ký hội viên VCCI",
    summary:
      "Thông tin và hướng dẫn đăng ký hội viên VCCI cho doanh nghiệp quan tâm.",
    content: buildContent(
      "Quy trình đăng ký hội viên VCCI nhanh chóng, đơn giản với nhiều quyền lợi hấp dẫn cho doanh nghiệp.",
      [
        "VCCI là tổ chức đại diện cho cộng đồng doanh nghiệp Việt Nam, có mạng lưới rộng khắp cả nước với hơn 200 hiệp hội ngành nghề và hơn 50.000 doanh nghiệp hội viên.",
        "Quyền lợi của hội viên VCCI: Tham gia các chương trình xúc tiến thương mại quốc tế; Được tư vấn pháp lý miễn phí; Tham gia các khoá đào tạo nâng cao năng lực với giá ưu đãi; Kết nối B2B với các doanh nghiệp hội viên khác; Được hỗ trợ tham gia các FTA, CPTPP, EVFTA; Cập nhật chính sách pháp luật mới nhất.",
        "Để đăng ký hội viên, doanh nghiệp cần chuẩn bị: Giấy đăng ký kinh doanh (bản sao); Báo cáo tài chính 2 năm gần nhất; Đơn đề nghị gia nhập hội viên (theo mẫu); Phí hội viên hàng năm: 3-15 triệu đồng tuỳ quy mô doanh nghiệp.",
        "Liên hệ VCCI-HCM theo số 028-3932-xxxx hoặc email info@vcci-hcm.org.vn để được hỗ trợ.",
      ],
      { headings: ["Quyền lợi hội viên", "Hồ sơ và quy trình"] },
    ),
    categoryId: CATEGORY_IDS.lienKetNhanh,
    categoryName: "Liên kết nhanh",
    categorySlug: "lien-ket-nhanh",
    categoryUrl: CATEGORY_URLS.lienKetNhanh,
    thumbnailUrl: HERO_IMAGE,
    publishedAt: "2026-03-01T08:00:00.000Z",
  }),
  buildPost({
    id: "mock-quick-2",
    title: "Cẩm nang doanh nghiệp",
    summary:
      "Tổng hợp tài liệu hữu ích dành cho doanh nghiệp hội viên: pháp lý, thuế, xuất nhập khẩu.",
    content: buildContent(
      "Cẩm nang doanh nghiệp là bộ tài liệu tổng hợp gồm 50+ bài viết hữu ích về pháp lý, thuế, xuất nhập khẩu và quản trị doanh nghiệp.",
      [
        "Bộ Cẩm nang Doanh nghiệp được VCCI-HCM biên soạn nhằm hỗ trợ các doanh nghiệp SME trong việc nắm bắt các quy định pháp luật, thủ tục hành chính và cơ hội kinh doanh.",
        "Nội dung Cẩm nang gồm 5 phần chính: (1) Pháp lý doanh nghiệp — 12 bài viết về thành lập, tổ chức, giải thể doanh nghiệp; (2) Thuế và kế toán — 15 bài viết về các loại thuế, quyết toán, hoá đơn; (3) Xuất nhập khẩu — 10 bài viết về thủ tục hải quan, FTA, logistics; (4) Quản trị doanh nghiệp — 8 bài viết về chiến lược, nhân sự, tài chính; (5) Chuyển đổi số — 8 bài viết về công nghệ, marketing số, thương mại điện tử.",
        "Cẩm nang được cập nhật thường xuyên theo các thay đổi của pháp luật và xu hướng thị trường. Doanh nghiệp hội viên VCCI có thể tải miễn phí toàn bộ tài liệu tại thư viện hội viên trên website vcci-hcm.org.vn.",
      ],
      { headings: ["Nội dung Cẩm nang", "Cách tải tài liệu"] },
    ),
    categoryId: CATEGORY_IDS.lienKetNhanh,
    categoryName: "Liên kết nhanh",
    categorySlug: "lien-ket-nhanh",
    categoryUrl: CATEGORY_URLS.lienKetNhanh,
    thumbnailUrl: SIDE_IMAGE,
    publishedAt: "2026-03-01T09:00:00.000Z",
  }),

  // ----------------------------------------------------------------
  // ĐÀO TẠO
  // ----------------------------------------------------------------
  buildPost({
    id: "mock-daotao-1",
    title: "Khóa đào tạo: Kỹ năng quản trị doanh nghiệp 4.0",
    summary:
      "Chương trình đào tạo kỹ năng quản trị hiện đại dành cho chủ doanh nghiệp và quản lý cấp cao.",
    content: buildContent(
      "Chương trình đào tạo 6 buổi, do các chuyên gia hàng đầu giảng dạy, cấp chứng chỉ hoàn thành khóa học.",
      [
        "VCCI-HCM phối hợp với Trường Đại học Kinh tế TP.HCM và các chuyên gia hàng đầu tổ chức Khóa đào tạo \"Kỹ năng quản trị doanh nghiệp 4.0\" — chương trình 6 buổi, khai giảng ngày 15/4/2026.",
        "Nội dung đào tạo: Buổi 1 — Tư duy chiến lược trong kỷ nguyên số; Buổi 2 — Quản trị tài chính doanh nghiệp hiện đại; Buổi 3 — Marketing số và xây dựng thương hiệu; Buổi 4 — Quản trị nhân sự thế hệ mới; Buổi 5 — Chuyển đổi số toàn diện; Buổi 6 — ESG và phát triển bền vững.",
        "Giảng viên: GS.TS Nguyễn Đình Thọ (UEH); PGS.TS Trần Đình Thiên (HCMUE); ông Võ Trí Thành (chuyên gia kinh tế); bà Nguyễn Thị Mai (CEO FPT Retail); ông Nguyễn Trung Dũng (CEO VNG Cloud).",
        "Học phí: 8.500.000 đồng/học viên (hội viên VCCI được giảm 20%). Học viên hoàn thành khóa học được cấp chứng chỉ do VCCI-HCM và UEH đồng cấp.",
        "Địa điểm: Hội trường VCCI-HCM, số 171 Võ Thị Sáu, Quận 3, TP.HCM. Đăng ký qua hotline 028-3932-xxxx hoặc email training@vcci-hcm.org.vn.",
      ],
      { headings: ["Nội dung khóa học", "Giảng viên", "Thông tin đăng ký"] },
    ),
    categoryId: CATEGORY_IDS.daoTao,
    categoryName: "Đào tạo",
    categorySlug: "dao-tao",
    categoryUrl: CATEGORY_URLS.daoTao,
    thumbnailUrl: HERO_IMAGE,
    publishedAt: "2026-03-20T08:00:00.000Z",
  }),
  buildPost({
    id: "mock-daotao-2",
    title: "Chuyên đề: Nâng cao năng lực xuất khẩu cho doanh nghiệp SME",
    summary:
      "Khóa đào tạo chuyên sâu giúp doanh nghiệp vừa và nhỏ tiếp cận thị trường quốc tế hiệu quả.",
    content: buildContent(
      "Khóa đào tạo thực chiến về xuất khẩu, phù hợp với chủ doanh nghiệp và nhân sự phụ trách kinh doanh quốc tế.",
      [
        "Khóa đào tạo \"Nâng cao năng lực xuất khẩu cho doanh nghiệp SME\" do VCCI-HCM tổ chức từ ngày 10-12/5/2026, giành cho các doanh nghiệp vừa và nhỏ đang hoặc có kế hoạch xuất khẩu.",
        "Nội dung: Ngày 1 — Tổng quan thị trường xuất khẩu tiềm năng (Hoa Kỳ, EU, Nhật Bản, ASEAN); Ngày 2 — Thủ tục hải quan, giấy chứng nhận xuất khẩu, FTA (CPTPP, EVFTA, UKVFTA); Ngày 3 — Marketing quốc tế, tìm kiếm đối tác, đàm phán hợp đồng, thanh toán quốc tế.",
        "Giảng viên là các chuyên gia thực chiến: ông Phan Hữu Dũng (nguyên Phó Tổng cục trưởng Tổng cục Hải quan); bà Nguyễn Thị Thuý (CEO Cty XNK An Phát); ông Lê Quốc Doanh (Giám đốc Vina T&T).",
        "Học phí: 4.500.000 đồng/học viên (bao gồm tea-break, tài liệu, chứng chỉ). Học viên được hỗ trợ kết nối 1-1 với chuyên gia sau khóa học.",
        "Đăng ký: Hotline 028-3932-xxxx hoặc email export-training@vcci-hcm.org.vn.",
      ],
      { headings: ["Nội dung đào tạo", "Giảng viên thực chiến", "Thông tin đăng ký"] },
    ),
    categoryId: CATEGORY_IDS.daoTao,
    categoryName: "Đào tạo",
    categorySlug: "dao-tao",
    categoryUrl: CATEGORY_URLS.daoTao,
    thumbnailUrl: SIDE_IMAGE,
    publishedAt: "2026-03-15T09:00:00.000Z",
  }),

  // ----------------------------------------------------------------
  // CƠ HỘI KINH DOANH
  // ----------------------------------------------------------------
  buildPost({
    id: "mock-cohoi-1",
    title: "Cơ hội xuất khẩu nội thất sang thị trường Hoa Kỳ",
    summary:
      "Thông tin chi tiết về nhu cầu nhập khẩu nội thất từ các đối tác Hoa Kỳ trong năm 2026.",
    content: buildContent(
      "Cơ hội lớn cho doanh nghiệp nội thất Việt Nam tiếp cận thị trường Hoa Kỳ trị giá 250 tỷ USD.",
      [
        "Theo báo cáo của Hiệp hội Nội thất Hoa Kỳ (Furniture Today), thị trường nội thất Hoa Kỳ năm 2026 đạt quy mô 250 tỷ USD, trong đó nhập khẩu chiếm 35% (~87 tỷ USD). Việt Nam hiện là nhà cung cấp lớn thứ 4 với kim ngạch xuất khẩu đạt 6,2 tỷ USD (tăng 22% so với năm 2025).",
        "Các dòng sản phẩm nội thất Việt Nam có lợi thế cạnh tranh tại Hoa Kỳ: Nội thất gỗ cho gia đình (bàn ghế, tủ, giường); Nội thất văn phòng; Nội thất ngoài trời (outdoor furniture); Nội thất phòng trẻ em (đạt chuẩn an toàn ASTM).",
        "Cơ hội lớn nhất đến từ các chuỗi bán lẻ và đại lý phân phối Hoa Kỳ: Wayfair, Amazon, Home Depot, Lowe's, IKEA Hoa Kỳ, Restoration Hardware — đang tích cực tìm kiếm nhà cung cấp Việt Nam thay thế Trung Quốc.",
        "VCCI-HCM hỗ trợ doanh nghiệp nội thất Việt Nam tiếp cận thị trường Hoa Kỳ qua các chương trình: Kết nối B2B với nhà nhập khẩu Hoa Kỳ; Tham gia Hội chợ High Point Market (Bắc Carolina) và Las Vegas Market; Tư vấn đạt chứng nhận BIFMA, FSC, CARB Phase 2; Hỗ trợ pháp lý về hợp đồng quốc tế.",
        "Liên hệ VCCI-HCM theo số 028-3932-xxxx để được kết nối với các đối tác Hoa Kỳ.",
      ],
      {
        headings: ["Quy mô thị trường Hoa Kỳ", "Sản phẩm lợi thế", "Hỗ trợ từ VCCI-HCM"],
      },
    ),
    categoryId: CATEGORY_IDS.coHoiKinhDoanh,
    categoryName: "Cơ hội kinh doanh",
    categorySlug: "co-hoi-kinh-doanh",
    categoryUrl: CATEGORY_URLS.coHoiKinhDoanh,
    thumbnailUrl: HERO_IMAGE,
    publishedAt: "2026-03-25T08:00:00.000Z",
  }),
  buildPost({
    id: "mock-cohoi-2",
    title: "Lời mời hợp tác từ đối tác Nhật Bản trong lĩnh vực F&B",
    summary:
      "Cơ hội hợp tác kinh doanh với đối tác Nhật Bản trong ngành thực phẩm và đồ uống.",
    content: buildContent(
      "Tập đoàn Aeon (Nhật Bản) đang tìm kiếm đối tác Việt Nam cung cấp thực phẩm chế biến cho hệ thống 2.000 siêu thị tại châu Á.",
      [
        "Tập đoàn Aeon (Nhật Bản) — một trong những tập đoàn bán lẻ lớn nhất châu Á với hơn 30.000 cửa hàng — đã gửi lời mời đến VCCI-HCM về việc tìm kiếm các doanh nghiệp Việt Nam cung cấp thực phẩm chế biến cho hệ thống siêu thị Aeon tại Nhật Bản, Trung Quốc, Đông Nam Á.",
        "Các sản phẩm Aeon đang tìm kiếm: Thực phẩm đông lạnh (bánh chưng, nem rán, há cảo, xíu mại); Thực phẩm khô (bánh tráng, phở khô, miến, mì gạo); Trái cây sấy và đóng hộp; Đồ uống (trà, cà phê, nước trái cây); Bánh kẹo truyền thống Việt Nam.",
        "Yêu cầu chất lượng: Sản phẩm đạt chuẩn HACCP, ISO 22000 hoặc FSSC 22000; Nhãn mác đúng quy cách thị trường Nhật; Đóng gói theo yêu cầu riêng của Aeon; Công suất tối thiểu 5 tấn/tháng cho mỗi sản phẩm; Giá cạnh tranh so với thị trường.",
        "Cơ hội lớn cho doanh nghiệp Việt: Hợp đồng dài hạn 2-3 năm; Khối lượng đặt hàng lớn, ổn định; Được Aeon hỗ trợ xây dựng nhà máy đạt chuẩn quốc tế; Được quảng bá thương hiệu Việt trên toàn hệ thống Aeon.",
        "VCCI-HCM sẽ tổ chức buổi kết nối trực tuyến với đại diện Aeon vào ngày 20/4/2026. Doanh nghiệp quan tâm đăng ký qua hotline 028-3932-xxxx hoặc email business-matching@vcci-hcm.org.vn.",
      ],
      {
        headings: ["Sản phẩm Aeon tìm kiếm", "Yêu cầu chất lượng", "Lợi ích cho doanh nghiệp Việt"],
      },
    ),
    categoryId: CATEGORY_IDS.coHoiKinhDoanh,
    categoryName: "Cơ hội kinh doanh",
    categorySlug: "co-hoi-kinh-doanh",
    categoryUrl: CATEGORY_URLS.coHoiKinhDoanh,
    thumbnailUrl: SIDE_IMAGE,
    publishedAt: "2026-03-18T10:00:00.000Z",
  }),

  // ----------------------------------------------------------------
  // KẾT NỐI HỘI VIÊN
  // ----------------------------------------------------------------
  buildPost({
    id: "mock-ketnoi-1",
    title: "Chương trình kết nối hội viên VCCI-HCM quý 2/2026",
    summary:
      "Cập nhật các hoạt động kết nối, giao lưu giữa các doanh nghiệp hội viên VCCI-HCM.",
    content: buildContent(
      "Quý 2/2026, VCCI-HCM tổ chức 4 hoạt động kết nối lớn dành riêng cho hội viên.",
      [
        "Trong quý 2/2026, VCCI-HCM sẽ triển khai 4 hoạt động kết nối hội viên quy mô lớn: (1) Gala Kết nối Hội viên ngày 25/4; (2) Cà phê Doanh nhân hàng tháng; (3) Đoàn khảo sát nhà máy hội viên; (4) Workshop chia sẻ kinh nghiệm quản trị.",
        "Gala Kết nối Hội viên 25/4/2026 dự kiến thu hút hơn 300 doanh nhân là chủ doanh nghiệp hội viên VCCI-HCM. Chương trình gồm: Lễ tôn vinh Hội viên tiêu biểu 2026; Bữa tiệc gala với các tiết mục nghệ thuật; Khu trưng bày sản phẩm hội viên; Hoạt động kết nối B2B.",
        "Cà phê Doanh nhân — chuỗi sự kiện thường niên vào sáng thứ 7 cuối tháng, mời các CEO chia sẻ câu chuyện khởi nghiệp, bài học thành công và thất bại, kinh nghiệm vượt qua khó khăn.",
        "Đoàn khảo sát nhà máy hội viên — tổ chức 2 đoàn tham quan nhà máy của các hội viên tiêu biểu trong quý 2 (nhà máy Vinamilk, nhà máy VinFast, nhà máy VNG), nhằm tạo cơ hội học hỏi và kết nối giữa các hội viên.",
        "Đăng ký tham gia các chương trình qua hotline 028-3932-xxxx hoặc email membership@vcci-hcm.org.vn.",
      ],
      {
        headings: ["4 hoạt động trong quý 2", "Gala kết nối hội viên", "Cà phê Doanh nhân"],
      },
    ),
    categoryId: CATEGORY_IDS.ketNoiHoiVien,
    categoryName: "Kết nối hội viên",
    categorySlug: "ket-noi-hoi-vien",
    categoryUrl: CATEGORY_URLS.ketNoiHoiVien,
    thumbnailUrl: MEMBER_IMAGE,
    publishedAt: "2026-03-20T08:00:00.000Z",
  }),
];

// =====================================================================
// BÀI PHỤ — bổ sung để fill đầy đủ card trên trang chủ (mỗi category đạt pageSize)
// =====================================================================

type ShortPostParams = {
  id: string;
  title: string;
  summary: string;
  content: string;
  categoryKey:
    | "tinVcci"
    | "tinKinhTe"
    | "chuyenDe"
    | "suKien"
    | "chinhSachPhapLuat"
    | "lienKetNhanh"
    | "daoTao"
    | "coHoiKinhDoanh"
    | "ketNoiHoiVien";
  thumbnailUrl: string;
  publishedAt: string;
  startedAt?: string;
  endedAt?: string;
  registrationDeadline?: string;
  location?: string;
};

const CATEGORY_LABELS: Record<
  ShortPostParams["categoryKey"],
  { name: string; slug: string; url: string }
> = {
  tinVcci: { name: "Tin VCCI", slug: "tin-vcci", url: CATEGORY_URLS.tinVcci },
  tinKinhTe: { name: "Tin Kinh tế", slug: "tin-kinh-te", url: CATEGORY_URLS.tinKinhTe },
  chuyenDe: { name: "Chuyên đề", slug: "chuyen-de", url: CATEGORY_URLS.chuyenDe },
  suKien: { name: "Sự kiện", slug: "su-kien", url: CATEGORY_URLS.suKien },
  chinhSachPhapLuat: {
    name: "Thông tin Chính sách và Pháp luật",
    slug: "thong-tin-chinh-sach-va-phap-luat",
    url: CATEGORY_URLS.chinhSachPhapLuat,
  },
  lienKetNhanh: { name: "Liên kết nhanh", slug: "lien-ket-nhanh", url: CATEGORY_URLS.lienKetNhanh },
  daoTao: { name: "Đào tạo", slug: "dao-tao", url: CATEGORY_URLS.daoTao },
  coHoiKinhDoanh: {
    name: "Cơ hội kinh doanh",
    slug: "co-hoi-kinh-doanh",
    url: CATEGORY_URLS.coHoiKinhDoanh,
  },
  ketNoiHoiVien: {
    name: "Kết nối hội viên",
    slug: "ket-noi-hoi-vien",
    url: CATEGORY_URLS.ketNoiHoiVien,
  },
};

const buildShortPost = (p: ShortPostParams): HomePostItem => {
  const label = CATEGORY_LABELS[p.categoryKey];
  return buildPost({
    id: p.id,
    title: p.title,
    summary: p.summary,
    content: p.content,
    categoryId: CATEGORY_IDS[p.categoryKey],
    categoryName: label.name,
    categorySlug: label.slug,
    categoryUrl: label.url,
    thumbnailUrl: p.thumbnailUrl,
    publishedAt: p.publishedAt,
    startedAt: p.startedAt,
    endedAt: p.endedAt,
    registrationDeadline: p.registrationDeadline,
    location: p.location,
  });
};

// ---------------------------------------------------------------
// TIN VCCI (+3)
// ---------------------------------------------------------------
const tinVcciExtra: HomePostItem[] = [
  buildShortPost({
    id: "mock-tinvcci-4",
    categoryKey: "tinVcci",
    title: "Hội nghị tổng kết công tác VCCI-HCM năm 2025 và triển khai nhiệm vụ 2026",
    summary:
      "Hội nghị tổng kết 1 năm hoạt động của VCCI-HCM với nhiều kết quả tích cực trong hỗ trợ doanh nghiệp hội viên.",
    thumbnailUrl: HERO_IMAGE,
    publishedAt: "2026-03-10T08:00:00.000Z",
    content: buildContent(
      "Năm 2025 đánh dấu bước phát triển mạnh mẽ của VCCI-HCM với hàng loạt chương trình hỗ trợ doanh nghiệp được triển khai hiệu quả.",
      [
        "Tại Hội nghị tổng kết công tác năm 2025, Giám đốc VCCI-HCM Trần Ngọc Liêm đã báo cáo tổng thể kết quả hoạt động trong năm qua: hỗ trợ hơn 5.000 lượt doanh nghiệp hội viên; tổ chức 24 chương trình xúc tiến thương mại quốc tế; đào tạo hơn 1.200 lượt cán bộ; thu hút 230 doanh nghiệp mới gia nhập.",
        "Phát biểu chỉ đạo tại hội nghị, Phó Chủ tịch VCCI Võ Tân Thành đánh giá cao kết quả VCCI-HCM đạt được và yêu cầu tiếp tục đổi mới trong 3 trụ cột: hỗ trợ hội viên, chuyển đổi số và hội nhập quốc tế.",
        "Hội nghị đã thông qua Nghị quyết về Kế hoạch hoạt động năm 2026 với 8 chỉ tiêu chính, tập trung vào phát triển hội viên mới, đẩy mạnh ứng dụng chuyển đổi số, và mở rộng hợp tác quốc tế.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-tinvcci-5",
    categoryKey: "tinVcci",
    title: "Ra mắt Cổng thông tin điện tử VCCI-HCM phiên bản 3.0",
    summary:
      "Phiên bản mới tích hợp AI chatbot, cơ sở dữ liệu hội viên trực tuyến và hệ thống kết nối B2B thông minh.",
    thumbnailUrl: SIDE_IMAGE,
    publishedAt: "2026-03-05T09:00:00.000Z",
    content: buildContent(
      "Cổng thông tin điện tử phiên bản 3.0 là bước nhảy vọt trong chuyển đổi số của VCCI-HCM, đưa tổ chức trở thành một trong những hiệp hội đi đầu về công nghệ.",
      [
        "Cổng thông tin VCCI-HCM 3.0 được phát triển bởi đội ngũ kỹ sư VCCI-HCM phối hợp với các đối tác công nghệ hàng đầu Việt Nam, tích hợp công nghệ AI và chatbot hỗ trợ 24/7 cho doanh nghiệp.",
        "Các tính năng nổi bật: (1) AI Chatbot hỗ trợ hội viên tra cứu thông tin, đăng ký sự kiện; (2) Cơ sở dữ liệu hội viên trực tuyến với 50.000+ doanh nghiệp; (3) Hệ thống B2B matching tự động; (4) Thư viện tài liệu số với hơn 10.000 bài viết.",
        "Theo kế hoạch, đến quý 3/2026 sẽ tích hợp thêm các tính năng: thanh toán trực tuyến phí hội viên, xác thực doanh nghiệp bằng eKYC, và hệ thống đánh giá uy tín doanh nghiệp.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-tinvcci-6",
    categoryKey: "tinVcci",
    title: "VCCI-HCM ký kết hợp tác chiến lược với Hiệp hội Doanh nghiệp Seoul",
    summary:
      "Thỏa thuận hợp tác chiến lược 5 năm nhằm thúc đẩy kết nối doanh nghiệp Việt Nam - Hàn Quốc trong các lĩnh vực công nghệ, F&B, logistics.",
    thumbnailUrl: HERO_IMAGE,
    publishedAt: "2026-03-01T08:00:00.000Z",
    content: buildContent(
      "Đây là một trong những thoả thuận hợp tác quan trọng nhất giữa VCCI-HCM và đối tác Hàn Quốc trong 5 năm trở lại đây.",
      [
        "Ngày 28/2/2026, tại Seoul (Hàn Quốc), VCCI-HCM và Hiệp hội Doanh nghiệp Seoul đã ký kết Thoả thuận Hợp tác Chiến lược giai đoạn 2026-2030, đánh dấu bước ngoặt trong quan hệ hợp tác kinh tế giữa hai bên.",
        "Theo thoả thuận, hai bên sẽ phối hợp tổ chức hàng năm ít nhất 4 chương trình kết nối B2B; thành lập Văn phòng đại diện VCCI-HCM tại Seoul; triển khai chương trình đào tạo chuyên sâu về logistics và chuỗi cung ứng quốc tế.",
        "Dự kiến trong năm 2026, sẽ có 3 đoàn doanh nghiệp Hàn Quốc đến khảo sát tại TP.HCM và 2 đoàn doanh nghiệp Việt Nam sang tìm hiểu cơ hội đầu tư tại Hàn Quốc. Tổng kim ngạch thương mại hai chiều dự kiến đạt 90 tỷ USD trong năm 2026.",
      ],
    ),
  }),
];

// ---------------------------------------------------------------
// TIN KINH TẾ (+3)
// ---------------------------------------------------------------
const tinKinhTeExtra: HomePostItem[] = [
  buildShortPost({
    id: "mock-tinkinhte-4",
    categoryKey: "tinKinhTe",
    title: "Việt Nam dẫn đầu ASEAN về tốc độ tăng trưởng xuất khẩu năm 2025",
    summary:
      "Tốc độ tăng trưởng xuất khẩu đạt 18,2%, cao nhất khu vực ASEAN, đóng góp lớn vào GDP quốc gia.",
    thumbnailUrl: SIDE_IMAGE,
    publishedAt: "2026-03-15T10:00:00.000Z",
    content: buildContent(
      "Đây là năm thứ 3 liên tiếp Việt Nam dẫn đầu ASEAN về tốc độ tăng trưởng xuất khẩu, khẳng định vị thế là ngôi sao mới nổi của kinh tế khu vực.",
      [
        "Theo báo cáo mới nhất của Ngân hàng Phát triển ASEAN (ADB), tốc độ tăng trưởng xuất khẩu của Việt Nam năm 2025 đạt 18,2% — cao nhất trong khối ASEAN và cao thứ 3 châu Á (sau Trung Quốc và Ấn Độ). Tổng kim ngạch xuất khẩu đạt 470 tỷ USD.",
        "Các mặt hàng xuất khẩu chủ lực: điện tử (165 tỷ USD, tăng 22%), dệt may (45 tỷ USD, tăng 8%), nông sản (38 tỷ USD, tăng 15%), thủy sản (12 tỷ USD, tăng 11%). Thị trường xuất khẩu lớn nhất vẫn là Hoa Kỳ với 142 tỷ USD.",
        "Các chuyên gia kinh tế nhận định đà tăng trưởng này sẽ tiếp tục được duy trì trong năm 2026 nhờ CPTPP, EVFTA, RCEP đang phát huy hiệu quả. Dự báo tốc độ tăng trưởng xuất khẩu năm 2026 đạt 14-16%.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-tinkinhte-5",
    categoryKey: "tinKinhTe",
    title: "Hàng loạt FTA thế hệ mới có hiệu lực, mở rộng thị trường cho doanh nghiệp Việt",
    summary:
      "CPTPP, EVFTA, RCEP, UKVFTA... các FTA thế hệ mới đã giúp doanh nghiệp Việt tiết kiệm hàng tỷ USD thuế quan.",
    thumbnailUrl: HERO_IMAGE,
    publishedAt: "2026-03-08T08:00:00.000Z",
    content: buildContent(
      "Việt Nam là một trong những nước hưởng lợi nhiều nhất từ các FTA thế hệ mới — đây là lợi thế cạnh tranh chiến lược của doanh nghiệp Việt.",
      [
        "Tính đến đầu năm 2026, Việt Nam đã tham gia 15 FTA với 60 đối tác kinh tế, bao gồm các FTA thế hệ mới: CPTPP (11 quốc gia), EVFTA (EU 27 nước), RCEP (15 quốc gia châu Á - Thái Bình Dương), UKVFTA (Vương quốc Anh), FTA với Israel.",
        "Theo tính toán của Bộ Công Thương, các FTA đã giúp doanh nghiệp Việt tiết kiệm khoảng 5,2 tỷ USD thuế quan trong năm 2025. Tỷ lệ tận dụng C/O (Giấy chứng nhận xuất xứ) đạt 42%, còn nhiều dư địa tăng trưởng.",
        "Để tận dụng tốt hơn các FTA, VCCI-HCM khuyến nghị doanh nghiệp: (1) Nắm vững quy tắc xuất xứ; (2) Chủ động xin C/O cho từng lô hàng; (3) Tìm hiểu cam kết mở cửa thị trường dịch vụ; (4) Tận dụng cơ chế bảo hộ hợp lý.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-tinkinhte-6",
    categoryKey: "tinKinhTe",
    title: "Chỉ số PCI 2025: TP.HCM tiếp tục dẫn đầu cả nước",
    summary:
      "TP.HCM đạt 73,5 điểm PCI, cao nhất cả nước, nhờ cải cách hành chính mạnh mẽ và hỗ trợ doanh nghiệp tốt.",
    thumbnailUrl: SIDE_IMAGE,
    publishedAt: "2026-02-28T08:00:00.000Z",
    content: buildContent(
      "TP.HCM tiếp tục là điểm sáng trong cải thiện môi trường kinh doanh, là điểm đến hấp dẫn cho doanh nghiệp trong và ngoài nước.",
      [
        "Theo kết quả Chỉ số Năng lực cạnh tranh cấp tỉnh (PCI) 2025 vừa công bố, TP.HCM đạt 73,5 điểm — tiếp tục giữ vị trí số 1 cả nước trong 5 năm liên tiếp. Đây là năm thứ 7 liên tiếp TP.HCM dẫn đầu bảng xếp hạng PCI.",
        "Các điểm mạnh nổi bật: (1) Chi phí gia nhập thị trường thấp (9,2/10); (2) Tiếp cận đất đai thuận lợi (8,1/10); (3) Tính minh bạch cao (7,8/10); (4) Hỗ trợ doanh nghiệp tốt (7,5/10).",
        "Phó Chủ tịch VCCI đánh giá: 'Kết quả PCI phản ánh nỗ lực cải cách liên tục của TP.HCM. Đây là yếu tố quan trọng giúp TP.HCM thu hút hơn 50% vốn FDI cả nước trong 5 năm qua.'",
      ],
    ),
  }),
];

// ---------------------------------------------------------------
// CHUYÊN ĐỀ (+4)
// ---------------------------------------------------------------
const chuyenDeExtra: HomePostItem[] = [
  buildShortPost({
    id: "mock-chuyende-3",
    categoryKey: "chuyenDe",
    title: "Chuyển đổi số trong doanh nghiệp SME: Bắt đầu từ đâu?",
    summary:
      "Hướng dẫn chi tiết giúp doanh nghiệp SME Việt Nam xây dựng lộ trình chuyển đổi số phù hợp với quy mô và ngân sách.",
    thumbnailUrl: HERO_IMAGE,
    publishedAt: "2026-03-05T10:00:00.000Z",
    content: buildContent(
      "Chuyển đổi số không nhất thiết phải tốn hàng tỷ đồng — quan trọng là bắt đầu đúng và đo lường rõ ràng.",
      [
        "Bài viết phân tích 5 bước chuyển đổi số phù hợp cho SME: (1) Khảo sát hiện trạng số hoá; (2) Xác định bài toán ưu tiên (ERP, CRM, e-commerce); (3) Lựa chọn giải pháp SaaS phù hợp; (4) Triển khai pilot 3-6 tháng; (5) Mở rộng sau khi đo lường hiệu quả.",
        "Theo khảo sát, doanh nghiệp SME Việt Nam đầu tư trung bình 800 triệu đồng cho chuyển đổi số trong năm 2026 — tăng 25% so với năm 2025. Các giải pháp ưu tiên gồm: kế toán đám mây, CRM, e-commerce B2B và chữ ký số.",
        "Tác giả khuyến nghị: 'Đừng cố gắng làm tất cả cùng lúc. Hãy bắt đầu từ bài toán lớn nhất, giải quyết triệt để, rồi mới mở rộng. Chuyển đổi số là hành trình, không phải đích đến.'",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-chuyende-4",
    categoryKey: "chuyenDe",
    title: "ESG — Không chỉ là xu hướng mà là yêu cầu bắt buộc cho doanh nghiệp xuất khẩu",
    summary:
      "Phân tích chi tiết tác động của các quy định ESG (Môi trường - Xã hội - Quản trị) đến doanh nghiệp xuất khẩu Việt Nam.",
    thumbnailUrl: SIDE_IMAGE,
    publishedAt: "2026-02-28T09:00:00.000Z",
    content: buildContent(
      "ESG không còn là lựa chọn — đó là yêu cầu bắt buộc từ đối tác quốc tế, đặc biệt khi EU áp dụng CBAM và các quy định chống phá rừng.",
      [
        "Bài viết phân tích 4 quy định ESG quan trọng nhất đang ảnh hưởng đến doanh nghiệp xuất khẩu Việt: (1) CBAM (Cơ chế điều chỉnh biên giới carbon) của EU; (2) EUDR (Quy định chống phá rừng); (3) CSDDD (Chỉ thị thẩm tra bền vững doanh nghiệp); (4) ESG Reporting theo chuẩn IFRS S1/S2.",
        "Theo tính toán, có khoảng 38.000 doanh nghiệp Việt Nam xuất khẩu sang EU sẽ bị ảnh hưởng trực tiếp bởi CBAM từ 2026, với chi phí tuân thủ ước tính 50-200 triệu đồng/doanh nghiệp trong năm đầu tiên.",
        "Các chuyên gia khuyến nghị doanh nghiệp Việt: (1) Bắt đầu thu thập dữ liệu phát thải ngay từ bây giờ; (2) Đánh giá chuỗi cung ứng theo tiêu chí ESG; (3) Áp dụng các tiêu chuẩn bền vững được công nhận (ISO 14001, SA8000); (4) Đào tạo nhân sự về ESG.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-chuyende-5",
    categoryKey: "chuyenDe",
    title: "Thương mại điện tử B2B: Cơ hội lớn cho doanh nghiệp SME Việt Nam",
    summary:
      "Thương mại điện tử B2B đang phát triển mạnh mẽ, mở ra cơ hội tiếp cận khách hàng doanh nghiệp toàn cầu cho SME Việt.",
    thumbnailUrl: HERO_IMAGE,
    publishedAt: "2026-02-20T08:00:00.000Z",
    content: buildContent(
      "Thương mại điện tử B2B đang trở thành xu hướng tất yếu, đặc biệt sau đại dịch COVID-19 khi hành vi mua sắm giữa doanh nghiệp thay đổi hoàn toàn.",
      [
        "Theo báo cáo của Vietnam E-commerce Association (VECOM), thương mại điện tử B2B Việt Nam năm 2025 đạt 38 tỷ USD, tăng trưởng 28% so với năm 2024. Dự báo đến 2030, thị trường sẽ đạt 120 tỷ USD.",
        "Các nền tảng B2B lớn cho doanh nghiệp Việt: Alibaba.com, Global Sources, Made-in-Vietnam, Bizlookup, TradeKey. Ngoài ra, các doanh nghiệp lớn cũng đã xây dựng portal B2B riêng như: Vinfast, Vinamilk, Tân Hiệp Phát.",
        "Để thành công trong thương mại điện tử B2B, doanh nghiệp SME cần: xây dựng gian hàng chuyên nghiệp với hình ảnh chất lượng cao; đầu tư vào content marketing SEO đa ngôn ngữ; tích hợp thanh toán quốc tế; đảm bảo logistics xuyên biên giới.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-chuyende-6",
    categoryKey: "chuyenDe",
    title: "Quản trị rủi ro trong chuỗi cung ứng toàn cầu",
    summary:
      "Bài học từ đại dịch COVID-19 và xung đột địa chính trị giúp doanh nghiệp xây dựng chiến lược quản trị rủi ro hiệu quả.",
    thumbnailUrl: SIDE_IMAGE,
    publishedAt: "2026-02-15T09:00:00.000Z",
    content: buildContent(
      "Biến động chuỗi cung ứng toàn cầu trong 5 năm qua cho thấy: doanh nghiệp nào quản trị rủi ro tốt sẽ là người chiến thắng.",
      [
        "Đại dịch COVID-19, xung đột Nga - Ukraine, căng thẳng Biển Đỏ, thiếu hụt bán dẫn — là những sự kiện đã định hình lại hoàn toàn chuỗi cung ứng toàn cầu và đặt ra yêu cầu cấp bách về quản trị rủi ro.",
        "Bài viết phân tích 6 chiến lược quản trị rủi ro chuỗi cung ứng: (1) Đa dạng hoá nhà cung cấp; (2) Tăng cường dự trữ an toàn cho nguyên liệu chiến lược; (3) Áp dụng công nghệ giám sát thời gian thực; (4) Xây dựng kế hoạch ứng phó khẩn cấp; (5) Đánh giá tài chính đối tác; (6) Đầu tư vào tự động hoá và AI.",
        "Theo khảo sát McKinsey, các doanh nghiệp đầu tư mạnh vào quản trị rủi ro chuỗi cung ứng đã giảm thiểu được trung bình 30-40% tác động từ các cú sốc. Xu hướng nearshoring (chuyển dây chuyền về gần) và friendshoring (chuyển đến nước đồng minh) đang được ưu tiên.",
      ],
    ),
  }),
];

// ---------------------------------------------------------------
// SỰ KIỆN (+3)
// ---------------------------------------------------------------
const suKienExtra: HomePostItem[] = [
  buildShortPost({
    id: "mock-sukien-3",
    categoryKey: "suKien",
    title: "Hội thảo: Cập nhật chính sách thuế 2026 cho doanh nghiệp",
    summary:
      "Hội thảo chuyên sâu về các thay đổi chính sách thuế có hiệu lực năm 2026, hỗ trợ doanh nghiệp cập nhật kịp thời.",
    thumbnailUrl: SIDE_IMAGE,
    publishedAt: "2026-03-12T09:00:00.000Z",
    startedAt: "2026-05-15T08:00:00.000Z",
    endedAt: "2026-05-15T16:30:00.000Z",
    registrationDeadline: "2026-05-10T23:59:59.000Z",
    location: "Khách sạn Caravelle, 19-23 Công trường Lam Sơn, Quận 1, TP.HCM",
    content: buildContent(
      "Hội thảo cập nhật toàn bộ thay đổi chính sách thuế có hiệu lực 2026, hỗ trợ doanh nghiệp quản trị thuế hiệu quả.",
      [
        "Hội thảo 'Cập nhật chính sách thuế 2026' do VCCI-HCM tổ chức vào ngày 15/5/2026 tại Khách sạn Caravelle, với sự tham gia của các chuyên gia thuế hàng đầu Việt Nam: ông Phạm Văn Hùng (nguyên Vụ trưởng Vụ Chính sách thuế); bà Trần Thị Thu Hà (Giám đốc Thuế PwC Việt Nam); ông Đào Trung Kiên (Giám đốc EY Việt Nam).",
        "Nội dung chính: (1) Tổng quan các thay đổi chính sách thuế TNDN, TNCN, VAT năm 2026; (2) Hướng dẫn áp dụng thuế tối thiểu toàn cầu 15%; (3) Cập nhật các FTA và ưu đãi thuế; (4) Quản trị rủi ro thuế cho doanh nghiệp FDI; (5) Sử dụng hoá đơn điện tử.",
        "Đối tượng tham gia: CFO, kế toán trưởng, chuyên viên thuế của doanh nghiệp. Phí tham dự: 1.500.000 đồng/người (giảm 30% cho hội viên VCCI). Đăng ký: tax@vcci-hcm.org.vn.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-sukien-4",
    categoryKey: "suKien",
    title: "Triển lãm Công nghiệp & Sản xuất Việt Nam 2026 (VIMF 2026)",
    summary:
      "Triển lãm quốc tế về công nghiệp và sản xuất lớn nhất Việt Nam trong năm, thu hút hơn 500 doanh nghiệp trong và ngoài nước.",
    thumbnailUrl: HERO_IMAGE,
    publishedAt: "2026-03-08T08:00:00.000Z",
    startedAt: "2026-08-12T09:00:00.000Z",
    endedAt: "2026-08-15T17:00:00.000Z",
    registrationDeadline: "2026-08-05T23:59:59.000Z",
    location: "Trung tâm Hội chợ & Triển lãm Sài Gòn (SECC), 799 Nguyễn Văn Linh, Quận 7, TP.HCM",
    content: buildContent(
      "VIMF 2026 là triển lãm công nghiệp quốc tế thường niên lớn nhất Việt Nam, quy tụ những tên tuổi hàng đầu trong ngành sản xuất, công nghiệp.",
      [
        "Triển lãm Công nghiệp & Sản xuất Việt Nam 2026 (Vietnam Industry & Manufacturing Fair 2026 - VIMF) là sự kiện thương mại quốc tế quy mô lớn nhất ngành công nghiệp tại Việt Nam trong năm, diễn ra từ 12-15/8/2026 tại SECC.",
        "Sự kiện dự kiến thu hút hơn 500 doanh nghiệp đến từ 25 quốc gia và vùng lãnh thổ; hơn 25.000 lượt khách tham quan, trong đó 30% là chuyên gia mua hàng quốc tế; khu trưng bày rộng 15.000 m² chia thành 6 khu chuyên ngành.",
        "Các khu chuyên ngành: Cơ khí chính xác; Tự động hoá công nghiệp; Robot công nghiệp; Vật liệu mới; Công nghệ in 3D; Công nghiệp hỗ trợ. Đăng ký tham gia tại vimf.vn hoặc hotline 028-3932-xxxx.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-sukien-5",
    categoryKey: "suKien",
    title: "Đoàn khảo sát thị trường Singapore 2026 — Cơ hội cho doanh nghiệp Việt",
    summary:
      "Đoàn doanh nghiệp khảo sát thị trường Singapore kết hợp tham dự Hội chợ FHA-F&B 2026, gặp gỡ đối tác tiềm năng.",
    thumbnailUrl: SIDE_IMAGE,
    publishedAt: "2026-03-05T08:00:00.000Z",
    startedAt: "2026-10-15T06:00:00.000Z",
    endedAt: "2026-10-19T18:00:00.000Z",
    registrationDeadline: "2026-09-30T23:59:59.000Z",
    location: "Singapore Expo, 1 Expo Drive, Singapore",
    content: buildContent(
      "Đoàn khảo sát Singapore là cơ hội cho doanh nghiệp Việt Nam tiếp cận một trong những trung tâm thương mại quan trọng nhất châu Á.",
      [
        "VCCI-HCM tổ chức Đoàn khảo sát thị trường Singapore kết hợp tham dự FHA-F&B 2026 (Food & Hotel Asia) — một trong những hội chợ F&B lớn nhất châu Á, từ ngày 15-19/10/2026.",
        "Lịch trình: Ngày 1 — Khởi hành từ TP.HCM, nhập cảnh Singapore; Ngày 2-3 — Tham dự FHA-F&B 2026 tại Singapore Expo, gặp gỡ nhà nhập khẩu và phân phối; Ngày 4 — Khảo sát hệ thống siêu thị FairPrice, Cold Storage; Ngày 5 — Khảo sát khu công nghiệp Jurong, gặp gỡ đối tác logistics và trở về.",
        "Số lượng: tối đa 25 doanh nghiệp, đăng ký theo thứ tự. Chi phí: 26.800.000 đồng/người (bao gồm vé máy bay, khách sạn 4 sao, ăn uống, phiên dịch). Đăng ký: trade-mission@vcci-hcm.org.vn.",
      ],
    ),
  }),
];

// ---------------------------------------------------------------
// CHÍNH SÁCH & PHÁP LUẬT (+4)
// ---------------------------------------------------------------
const csPhapLuatExtra: HomePostItem[] = [
  buildShortPost({
    id: "mock-csphapluat-3",
    categoryKey: "chinhSachPhapLuat",
    title: "Hướng dẫn áp dụng thuế tối thiểu toàn cầu 15% (GloBE)",
    summary:
      "Cẩm nang chi tiết về thuế tối thiểu toàn cầu 15% theo quy định của OECD — áp dụng cho doanh nghiệp đa quốc gia tại Việt Nam.",
    thumbnailUrl: HERO_IMAGE,
    publishedAt: "2026-03-14T08:00:00.000Z",
    content: buildContent(
      "Thuế tối thiểu toàn cầu 15% (Global Anti-Base Erosion - GloBE) là quy định quan trọng nhất trong lịch sử thuế quốc tế.",
      [
        "Quy định thuế tối thiểu toàn cầu (Pillar 2 - GloBE Rules) của OECD/Khối G20 đã được chính thức áp dụng từ năm 2024 tại nhiều quốc gia và sẽ có hiệu lực tại Việt Nam từ năm 2026.",
        "Đối tượng áp dụng: Tập đoàn đa quốc gia có doanh thu hợp nhất từ 750 triệu EUR trở lên trong ít nhất 2 năm trong 4 năm gần nhất. Theo ước tính, có khoảng 8.000 tập đoàn đa quốc gia trên thế giới và khoảng 200-300 doanh nghiệp FDI tại Việt Nam chịu ảnh hưởng.",
        "Các nội dung chính của GloBE: (1) Quy tắc IIR (Income Inclusion Rule) — áp thuế bổ sung ở quốc gia mẹ; (2) Quy tắc UTPR (Undertaxed Profits Rule) — phân bổ quyền đánh thuế; (3) Quy tắc QDMTT (Qualified Domestic Minimum Top-up Tax) — cho phép Việt Nam tự thu thuế bổ sung. Doanh nghiệp cần đánh giá tác động tài chính và chuẩn bị hệ thống báo cáo.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-csphapluat-4",
    categoryKey: "chinhSachPhapLuat",
    title: "Quy định mới về bảo vệ dữ liệu cá nhân theo Nghị định 13/2023",
    summary:
      "Tổng hợp các điều khoản quan trọng của Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân, có hiệu lực từ 01/7/2023.",
    thumbnailUrl: SIDE_IMAGE,
    publishedAt: "2026-03-10T08:00:00.000Z",
    content: buildContent(
      "Nghị định 13/2023 là khung pháp lý quan trọng nhất về bảo vệ dữ liệu cá nhân tại Việt Nam, doanh nghiệp cần nắm rõ để tuân thủ.",
      [
        "Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân (có hiệu lực từ 01/7/2023) quy định chi tiết về thu thập, lưu trữ, sử dụng, chia sẻ và xử lý dữ liệu cá nhân — tương đương với GDPR của EU.",
        "Các điểm quan trọng doanh nghiệp cần lưu ý: (1) Phải có sự đồng ý rõ ràng của chủ thể dữ liệu trước khi xử lý; (2) Phải thông báo rõ ràng mục đích xử lý dữ liệu; (3) Phải áp dụng biện pháp bảo mật kỹ thuật và tổ chức; (4) Phải thông báo vi phạm trong vòng 72 giờ; (5) Đánh giá tác động (DPIA) cho xử lý dữ liệu nhạy cảm; (6) Chế định nhân sự chuyên trách (DPO).",
        "Mức phạt vi phạm: từ 5 triệu đến 200 triệu đồng đối với cá nhân, từ 50 triệu đến 5% doanh thu đối với tổ chức. Doanh nghiệp cần tổ chức đánh giá tuân thủ và xây dựng chính sách bảo vệ dữ liệu nội bộ ngay từ bây giờ.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-csphapluat-5",
    categoryKey: "chinhSachPhapLuat",
    title: "Cập nhật quy định về hoá đơn điện tử khởi tạo từ máy tính tiền",
    summary:
      "Tổng hợp quy định mới nhất của Nghị định 123/2020 và Thông tư 78/2021 về hoá đơn điện tử trong kinh doanh.",
    thumbnailUrl: HERO_IMAGE,
    publishedAt: "2026-03-04T08:00:00.000Z",
    content: buildContent(
      "Hoá đơn điện tử đã trở thành chuẩn mực bắt buộc trong giao dịch kinh doanh — doanh nghiệp cần nắm rõ để tuân thủ đúng quy định.",
      [
        "Theo Nghị định 123/2020/NĐ-CP (có hiệu lực từ 01/7/2022) và Thông tư 78/2021/TT-BTC, tất cả doanh nghiệp, hộ kinh doanh phải sử dụng hoá đơn điện tử thay cho hoá đơn giấy khi bán hàng hoá, cung cấp dịch vụ.",
        "Có 3 loại hoá đơn điện tử: (1) Hoá đơn điện tử không có mã của cơ quan thuế (dành cho tổ chức đủ điều kiện); (2) Hoá đơn điện tử có mã của cơ quan thuế; (3) Hoá đơn điện tử khởi tạo từ máy tính tiền (dành cho hộ kinh doanh và cá nhân kinh doanh). Mỗi loại có quy trình và tiêu chuẩn kỹ thuật riêng.",
        "Các lợi ích: (1) Tiết kiệm chi phí in ấn, lưu trữ; (2) Giảm thiểu sai sót; (3) Tăng tốc độ xử lý kế toán; (4) Dễ dàng tra cứu; (5) Đáp ứng yêu cầu quản lý thuế hiện đại. Doanh nghiệp cần lựa chọn nhà cung cấp giải pháp hoá đơn điện tử đáp ứng tiêu chuẩn TCT.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-csphapluat-6",
    categoryKey: "chinhSachPhapLuat",
    title: "Hướng dẫn thực hiện nghĩa vụ thuế khi có giao dịch liên kết (transfer pricing)",
    summary:
      "Cập nhật quy định về giá thị trường và nghĩa vụ khai báo giao dịch liên kết cho doanh nghiệp FDI tại Việt Nam.",
    thumbnailUrl: SIDE_IMAGE,
    publishedAt: "2026-02-25T08:00:00.000Z",
    content: buildContent(
      "Quản trị giá chuyển nhượng (transfer pricing) đang là một trong những vấn đề nóng nhất trong quản trị thuế của doanh nghiệp FDI tại Việt Nam.",
      [
        "Theo Nghị định 132/2020/NĐ-CP và Thông tư 41/2023/TT-BTC, doanh nghiệp có giao dịch liên kết với doanh thu từ 50 tỷ đồng trở lên phải lập Hồ sơ xác định giá giao dịch liên kết và nộp cho cơ quan thuế chậm nhất là ngày cuối cùng của năm thứ 3 kể từ năm phát sinh nghĩa vụ thuế.",
        "Các loại hồ sơ cần chuẩn bị: (1) Hồ sơ quốc gia (Local File); (2) Hồ sơ toàn cầu (Master File) — bắt buộc nếu doanh thu hợp nhất toàn cầu từ 1.500 tỷ đồng trở lên; (3) Báo cáo lợi nhuận liên quốc gia (CbCR) — bắt buộc nếu doanh thu hợp nhất từ 18.000 tỷ đồng trở lên.",
        "Các phương pháp xác định giá giao dịch liên kết: (1) Phương pháp so sánh giá giao dịch độc lập (CUP); (2) Phương pháp giá bán lại (RPM); (3) Phương pháp giá vốn cộng lợi nhuận (Cost Plus); (4) Phương pháp phân chia lợi nhuận (PSM); (5) Phương pháp lợi nhuận ròng (TNMM). Doanh nghiệp FDI nên tham khảo ý kiến chuyên gia để xây dựng chiến lược transfer pricing phù hợp.",
      ],
    ),
  }),
];

// ---------------------------------------------------------------
// LIÊN KẾT NHANH (+4)
// ---------------------------------------------------------------
const lienKetNhanhExtra: HomePostItem[] = [
  buildShortPost({
    id: "mock-quick-3",
    categoryKey: "lienKetNhanh",
    title: "Tra cứu thông tin doanh nghiệp trên Cổng ĐKKD quốc gia",
    summary:
      "Hướng dẫn sử dụng Cổng đăng ký kinh doanh quốc gia để tra cứu thông tin doanh nghiệp, tình trạng pháp lý.",
    thumbnailUrl: HERO_IMAGE,
    publishedAt: "2026-02-25T08:00:00.000Z",
    content: buildContent(
      "Cổng ĐKKD quốc gia (dangkykinhdoanh.gov.vn) là nguồn thông tin chính thức để tra cứu pháp lý doanh nghiệp.",
      [
        "Để tra cứu thông tin doanh nghiệp, truy cập dangkykinhdoanh.gov.vn, nhập mã số doanh nghiệp hoặc tên doanh nghiệp. Hệ thống sẽ hiển thị: tên, địa chỉ, người đại diện, ngành nghề, vốn điều lệ, tình trạng hoạt động (đang hoạt động / đã giải thể / tạm ngừng).",
        "Đây là nguồn tin cậy để xác minh đối tác trước khi ký hợp đồng, đánh giá rủi ro giao dịch, hoặc thẩm tra pháp lý. Thông tin được cập nhật trong vòng 24 giờ sau khi có thay đổi từ cơ quan đăng ký.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-quick-4",
    categoryKey: "lienKetNhanh",
    title: "Hướng dẫn tra cứu chứng nhận ISO và tiêu chuẩn quốc tế",
    summary:
      "Tổng hợp các nguồn tra cứu chứng nhận ISO 9001, ISO 14001, ISO 45001 cho doanh nghiệp xuất khẩu.",
    thumbnailUrl: SIDE_IMAGE,
    publishedAt: "2026-02-20T08:00:00.000Z",
    content: buildContent(
      "Chứng nhận ISO là 'giấy thông hành' giúp doanh nghiệp Việt tiếp cận thị trường quốc tế — nhưng cần chọn tổ chức chứng nhận uy tín.",
      [
        "Các chứng nhận quan trọng cho doanh nghiệp xuất khẩu: ISO 9001 (Quản lý chất lượng); ISO 14001 (Quản lý môi trường); ISO 45001 (An toàn và sức khoẻ nghề nghiệp); ISO 22000/HACCP (An toàn thực phẩm); ISO 27001 (An toàn thông tin); ISO 13485 (Thiết bị y tế).",
        "Các tổ chức chứng nhận uy tín tại Việt Nam: Bureau Veritas, SGS, TÜV SÜD, TÜV Rheinland, BSI, Intertek, DEKRA, QMS. Để tra cứu chứng nhận hợp lệ, truy cập website của từng tổ chức và nhập số chứng nhận hoặc tên doanh nghiệp.",
        "Lưu ý: ISO chỉ có giá trị trong thời hạn (thường 3 năm) và phải được đánh giá giám sát hàng năm. Doanh nghiệp cần kiểm tra tính hợp lệ trước khi giao dịch với đối tác có yêu cầu ISO.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-quick-5",
    categoryKey: "lienKetNhanh",
    title: "Đường dây nóng hỗ trợ doanh nghiệp VCCI-HCM",
    summary:
      "Tổng hợp các kênh hỗ trợ trực tiếp của VCCI-HCM: tư vấn pháp lý, thuế, xúc tiến thương mại, đào tạo.",
    thumbnailUrl: HERO_IMAGE,
    publishedAt: "2026-02-15T08:00:00.000Z",
    content: buildContent(
      "VCCI-HCM cung cấp nhiều kênh hỗ trợ trực tiếp cho doanh nghiệp hội viên và cộng đồng doanh nghiệp.",
      [
        "Các kênh hỗ trợ chính: (1) Hotline tư vấn pháp lý: 028-3932-xxxx (giờ hành chính); (2) Email tư vấn thuế: tax@vcci-hcm.org.vn; (3) Email tư vấn xuất nhập khẩu: trade@vcci-hcm.org.vn; (4) Tư vấn B2B: business@vcci-hcm.org.vn.",
        "Ngoài ra, VCCI-HCM còn tổ chức các buổi tư vấn trực tiếp 1-1 vào thứ 3 và thứ 5 hàng tuần tại trụ sở (171 Võ Thị Sáu, Quận 3) dành cho hội viên. Đăng ký trước qua hotline hoặc email.",
        "Đối với doanh nghiệp chưa là hội viên, có thể sử dụng dịch vụ tư vấn trả phí với mức phí ưu đãi. Liên hệ Phòng Hội viên để biết chi tiết.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-quick-6",
    categoryKey: "lienKetNhanh",
    title: "Lịch sự kiện & đào tạo VCCI-HCM tháng 4/2026",
    summary:
      "Lịch chi tiết các hội thảo, khoá đào tạo, sự kiện kết nối B2B do VCCI-HCM tổ chức trong tháng 4/2026.",
    thumbnailUrl: SIDE_IMAGE,
    publishedAt: "2026-02-10T08:00:00.000Z",
    content: buildContent(
      "Tháng 4/2026 VCCI-HCM tổ chức hơn 20 hoạt động đa dạng từ đào tạo, hội thảo đến sự kiện kết nối B2B.",
      [
        "Điểm nhấn tháng 4: (1) Ngày 04/04: Hội thảo 'AI trong quản trị doanh nghiệp'; (2) Ngày 08/04: Hội thảo 'Cập nhật chính sách thuế 2026'; (3) Ngày 15/04: Khai giảng khóa 'Kỹ năng quản trị 4.0'; (4) Ngày 18/04: B2B kết nối doanh nghiệp logistics; (5) Ngày 22/04: Hội thảo ESG cho doanh nghiệp FDI; (6) Ngày 25/04: Gala kết nối hội viên quý 2.",
        "Đăng ký và xem lịch chi tiết tại vcci-hcm.org.vn/su-kien hoặc liên hệ Phòng Sự kiện VCCI-HCM qua events@vcci-hcm.org.vn. Hội viên được ưu tiên và giảm phí tham dự.",
      ],
    ),
  }),
];

// ---------------------------------------------------------------
// ĐÀO TẠO (+8)
// ---------------------------------------------------------------
const daoTaoExtra: HomePostItem[] = [
  buildShortPost({
    id: "mock-daotao-3",
    categoryKey: "daoTao",
    title: "Khóa học: Thương mại điện tử B2B cho doanh nghiệp SME",
    summary:
      "Khóa học thực chiến về kinh doanh trên các nền tảng B2B quốc tế (Alibaba, Made-in-Vietnam) dành cho SME xuất khẩu.",
    thumbnailUrl: SIDE_IMAGE,
    publishedAt: "2026-03-10T08:00:00.000Z",
    content: buildContent(
      "Khóa học dành cho doanh nghiệp SME muốn mở rộng kênh xuất khẩu qua thương mại điện tử B2B.",
      [
        "Khóa học kéo dài 4 buổi (ngày 5/6, 6/6, 12/6, 13/6/2026), từ 9h-16h30, tại VCCI-HCM. Nội dung: (1) Tổng quan thị trường B2B quốc tế; (2) Xây dựng gian hàng chuyên nghiệp trên Alibaba.com; (3) Marketing số đa ngôn ngữ và SEO quốc tế; (4) Vận hành và tối ưu hoá doanh số.",
        "Giảng viên: ông Lê Văn Vinh (chuyên gia Alibaba Việt Nam, từng hỗ trợ 200+ doanh nghiệp đạt Top Supplier); bà Trần Hồng Hạnh (CEO Tôm Việt Nam - top 1 Alibaba seafood Việt).",
        "Học phí: 5.500.000 đồng/khoá (hội viên VCCI giảm 20%). Hỗ trợ sau khoá học: 1-1 coaching 3 tháng. Đăng ký: training@vcci-hcm.org.vn.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-daotao-4",
    categoryKey: "daoTao",
    title: "Chương trình Mini-MBA: Quản trị doanh nghiệp hiện đại",
    summary:
      "Chương trình đào tạo cao cấp 6 tháng, cấp chứng chỉ Mini-MBA do VCCI-HCM phối hợp với UEH tổ chức.",
    thumbnailUrl: HERO_IMAGE,
    publishedAt: "2026-03-08T08:00:00.000Z",
    content: buildContent(
      "Mini-MBA là chương trình đào tạo quản trị cấp cao dành cho chủ doanh nghiệp và cán bộ quản lý cấp trung - cao.",
      [
        "Chương trình Mini-MBA 'Quản trị doanh nghiệp hiện đại' khai giảng tháng 7/2026, tổng thời lượng 144 giờ trong 24 buổi học (cuối tuần). Học viên tốt nghiệp được cấp chứng chỉ do VCCI-HCM và Trường ĐH Kinh tế TP.HCM (UEH) đồng cấp.",
        "Nội dung 12 môn học: Tư duy chiến lược; Quản trị tài chính; Marketing chiến lược; Quản trị nhân sự; Quản trị chuỗi cung ứng; ESG & phát triển bền vững; Chuyển đổi số; Lãnh đạo; Đàm phán & quyết định; Luật kinh doanh; Phân tích dữ liệu; Dự án cuối khoá.",
        "Học phí: 65.000.000 đồng/học viên (trả góp 2 đợt). Học bổng 30% cho chủ doanh nghiệp SME. Đăng ký & tư vấn: mba@vcci-hcm.org.vn hoặc hotline 028-3932-xxxx.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-daotao-5",
    categoryKey: "daoTao",
    title: "Đào tạo nội bộ theo nhu cầu doanh nghiệp (In-house Training)",
    summary:
      "Dịch vụ đào tạo in-house: xây dựng chương trình theo yêu cầu, giảng viên chuyên gia, cấp chứng nhận nội bộ.",
    thumbnailUrl: SIDE_IMAGE,
    publishedAt: "2026-03-05T08:00:00.000Z",
    content: buildContent(
      "Đào tạo nội bộ giúp doanh nghiệp đào tạo đồng loạt nhiều nhân viên với chi phí tối ưu và nội dung tùy chỉnh theo yêu cầu riêng.",
      [
        "Dịch vụ đào tạo in-house của VCCI-HCM cung cấp các chương trình: (1) Kỹ năng lãnh đạo cho quản lý cấp trung; (2) Kỹ năng bán hàng B2B; (3) Kỹ năng chăm sóc khách hàng; (4) Văn hoá doanh nghiệp; (5) Chuyển đổi số cho nhân viên; (6) An toàn lao động; (7) ESG và phát triển bền vững; (8) Đào tạo nội bộ theo nhu cầu riêng.",
        "Ưu điểm đào tạo in-house: (1) Nội dung tuỳ chỉnh 100% theo ngành và đặc thù doanh nghiệp; (2) Chi phí thấp hơn khi đào tạo đồng loạt; (3) Bảo mật thông tin nội bộ; (4) Linh hoạt thời gian, địa điểm; (5) Đánh giá hiệu quả ngay tại doanh nghiệp.",
        "Liên hệ Phòng Đào tạo VCCI-HCM: training@vcci-hcm.org.vn hoặc hotline 028-3932-xxxx để được tư vấn và báo giá chi tiết.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-daotao-6",
    categoryKey: "daoTao",
    title: "Webinar miễn phí: Chiến lược marketing 4.0 cho doanh nghiệp SME",
    summary:
      "Chuỗi webinar miễn phí 8 buổi về marketing 4.0, do các chuyên gia hàng đầu chia sẻ.",
    thumbnailUrl: HERO_IMAGE,
    publishedAt: "2026-03-01T08:00:00.000Z",
    content: buildContent(
      "Chuỗi webinar miễn phí dành cho cộng đồng doanh nghiệp, doanh nhân muốn tìm hiểu về marketing 4.0.",
      [
        "Chuỗi Webinar 'Chiến lược Marketing 4.0 cho doanh nghiệp SME' diễn ra từ ngày 5/4 đến 24/5/2026, mỗi thứ 7 hàng tuần từ 14h-16h trên nền tảng Zoom. Mỗi buổi tập trung vào một chủ đề cụ thể: Xây dựng thương hiệu cá nhân; Facebook & Instagram Marketing; TikTok cho doanh nghiệp; SEO & Content Marketing; Email Marketing; Marketing Automation; Đo lường hiệu quả (ROI); Case Study Việt Nam.",
        "Diễn giả: ông Nguyễn Trung Dũng (CEO VNG Cloud); bà Trần Phương Thảo (Founder Hureca); ông Đào Minh Tuấn (CEO MoMo Marketing); ông Nguyễn Minh Trí (giám đốc Marketing Vinamilk).",
        "Đăng ký miễn phí tại vcci-hcm.org.vn/webinar-marketing. Học viên tham dự đầy đủ 8 buổi được cấp chứng nhận tham gia.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-daotao-7",
    categoryKey: "daoTao",
    title: "Khóa học: Kế toán quản trị cho chủ doanh nghiệp",
    summary:
      "Khóa học kế toán quản trị thực chiến, giúp chủ doanh nghiệp hiểu và kiểm soát tài chính doanh nghiệp.",
    thumbnailUrl: SIDE_IMAGE,
    publishedAt: "2026-02-25T08:00:00.000Z",
    content: buildContent(
      "Kế toán quản trị là công cụ không thể thiếu giúp chủ doanh nghiệp ra quyết định kinh doanh chính xác.",
      [
        "Khóa học 'Kế toán quản trị cho chủ doanh nghiệp' kéo dài 5 buổi, khai giảng ngày 10/5/2026, phù hợp với chủ doanh nghiệp vừa và nhỏ muốn nắm vững tài chính để ra quyết định kinh doanh.",
        "Nội dung: (1) Đọc hiểu báo cáo tài chính; (2) Phân tích chi phí - lợi nhuận theo sản phẩm; (3) Xây dựng ngân sách; (4) Quản trị dòng tiền; (5) Định giá doanh nghiệp; (6) Thu hút vốn đầu tư.",
        "Giảng viên: ông Nguyễn Hữu Trí (CFO Tập đoàn Masan); bà Phạm Thị Thuỳ Linh (Partner KPMG Việt Nam). Học phí: 4.800.000 đồng/khoá.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-daotao-8",
    categoryKey: "daoTao",
    title: "Chứng nhận: Quản lý chất lượng ISO 9001:2015 Lead Auditor",
    summary:
      "Khoá đào tạo chuyên gia đánh giá ISO 9001:2015 Lead Auditor — chứng nhận quốc tế giá trị toàn cầu.",
    thumbnailUrl: HERO_IMAGE,
    publishedAt: "2026-02-20T08:00:00.000Z",
    content: buildContent(
      "Chứng nhận Lead Auditor ISO 9001 được công nhận quốc tế là cơ hội nghề nghiệp cho chuyên gia quản lý chất lượng.",
      [
        "Khoá đào tạo 'Lead Auditor ISO 9001:2015' do VCCI-HCM phối hợp với Tổ chức chứng nhận quốc tế tổ chức — khai giảng ngày 15/6/2026, kéo dài 5 ngày liên tục. Học viên tốt nghiệp đủ điều kiện thi chứng chỉ Lead Auditor quốc tế.",
        "Nội dung: (1) Tổng quan ISO 9001:2015; (2) Nguyên tắc quản lý chất lượng; (3) Phương pháp đánh giá theo ISO 19011; (4) Lập kế hoạch audit; (5) Thực hiện audit; (6) Báo cáo audit; (7) Hành động khắc phục; (8) Kỳ thi chứng chỉ.",
        "Học phí: 18.500.000 đồng (bao gồm tài liệu, thi chứng chỉ, ăn trưa). Đăng ký: iso@vcci-hcm.org.vn.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-daotao-9",
    categoryKey: "daoTao",
    title: "Lớp tiếng Anh thương mại cho doanh nhân (Business English)",
    summary:
      "Khóa học tiếng Anh thương mại theo chuẩn quốc tế, do giảng viên bản ngữ giảng dạy, đào tạo 4 kỹ năng nghe - nói - đọc - viết.",
    thumbnailUrl: SIDE_IMAGE,
    publishedAt: "2026-02-15T08:00:00.000Z",
    content: buildContent(
      "Tiếng Anh thương mại là kỹ năng quan trọng giúp doanh nhân Việt vươn ra thị trường quốc tế.",
      [
        "Khóa học 'Business English for Entrepreneurs' do VCCI-HCM phối hợp với British Council tổ chức, khai giảng tháng 4/2026, tổng thời lượng 60 giờ trong 12 tuần (cuối tuần).",
        "Nội dung 6 chủ đề chính: (1) Đàm phán qua điện thoại & email; (2) Thuyết trình sản phẩm; (3) Tham dự hội chợ quốc tế; (4) Pitching cho nhà đầu tư; (5) Soạn thảo hợp đồng cơ bản; (6) Đàm phán đa văn hoá.",
        "Giảng viên bản ngữ từ British Council. Học phí: 6.800.000 đồng (bao gồm giáo trình, thi cuối khoá, cấp chứng nhận British Council + VCCI-HCM).",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-daotao-10",
    categoryKey: "daoTao",
    title: "Đào tạo: Văn hoá doanh nghiệp và nghệ thuật lãnh đạo",
    summary:
      "Khóa học ngắn hạn về xây dựng văn hoá doanh nghiệp và phát triển kỹ năng lãnh đạo — dành cho CEO và quản lý cấp cao.",
    thumbnailUrl: HERO_IMAGE,
    publishedAt: "2026-02-10T08:00:00.000Z",
    content: buildContent(
      "Văn hoá doanh nghiệp tốt giúp giữ chân nhân tài, tăng năng suất và tạo lợi thế cạnh tranh bền vững.",
      [
        "Khóa học 'Văn hoá doanh nghiệp & Nghệ thuật lãnh đạo' gồm 3 buổi, ngày 20/6, 21/6, 27/6/2026, do chuyên gia tâm lý tổ chức PGS.TS Đào Thị Thu Hằng (ĐH KHXH&NV TP.HCM) giảng dạy.",
        "Nội dung: (1) Xây dựng văn hoá doanh nghiệp từ tầm nhìn lãnh đạo; (2) Nghệ thuật truyền thông nội bộ; (3) Phong cách lãnh đạo 4.0; (4) Quản lý xung đột; (5) Xây dựng đội ngũ kế cận; (6) Đánh giá và phát triển văn hoá doanh nghiệp.",
        "Học phí: 4.500.000 đồng/khoá. Đăng ký: leadership@vcci-hcm.org.vn.",
      ],
    ),
  }),
];

// ---------------------------------------------------------------
// CƠ HỘI KINH DOANH (+8)
// ---------------------------------------------------------------
const coHoiKdExtra: HomePostItem[] = [
  buildShortPost({
    id: "mock-cohoi-3",
    categoryKey: "coHoiKinhDoanh",
    title: "Mời tham gia đoàn xúc tiến thương mại tại Dubai (UAE) 2026",
    summary:
      "Đoàn doanh nghiệp xúc tiến thương mại tại Dubai nhân dịp Expo 2026 — kết nối với nhà nhập khẩu Trung Đông.",
    thumbnailUrl: SIDE_IMAGE,
    publishedAt: "2026-03-12T08:00:00.000Z",
    content: buildContent(
      "Dubai là cánh cửa vào thị trường Trung Đông và châu Phi — cơ hội lớn cho doanh nghiệp xuất khẩu Việt.",
      [
        "VCCI-HCM tổ chức Đoàn xúc tiến thương mại tại Dubai (UAE) nhân dịp Expo 2026, từ ngày 12-18/11/2026. Đoàn sẽ tham dự sự kiện Vietnam Trade Fair tại Dubai và kết nối trực tiếp với các nhà nhập khẩu UAE, Saudi Arabia, Qatar.",
        "Lịch trình 7 ngày: Ngày 1-2: Bay Dubai, tham dự Vietnam Trade Fair; Ngày 3-4: Gặp gỡ nhà nhập khẩu, đàm phán B2B; Ngày 5: Khảo sát khu tự do Jebel Ali (JAFZA); Ngày 6: Khảo sát Carrefour, Lulu Hypermarket; Ngày 7: Trở về.",
        "Chi phí: 38.500.000 đồng/người (đã bao gồm vé máy bay, khách sạn 5 sao, ăn uống, phiên dịch, đi lại). Hỗ trợ: visa nhanh, doanh nghiệp SME được giảm 30% chi phí. Đăng ký: trade-dubai@vcci-hcm.org.vn.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-cohoi-4",
    categoryKey: "coHoiKinhDoanh",
    title: "Đối tác Đức tìm nhà cung cấp nông sản organic từ Việt Nam",
    summary:
      "Tập đoàn Alnatura (Đức) — chuỗi siêu thị organic hàng đầu châu Âu — tìm kiếm nhà cung cấp nông sản hữu cơ chứng nhận.",
    thumbnailUrl: HERO_IMAGE,
    publishedAt: "2026-03-08T08:00:00.000Z",
    content: buildContent(
      "Cơ hội lớn cho doanh nghiệp nông nghiệp organic Việt Nam tiếp cận thị trường châu Âu qua đối tác uy tín.",
      [
        "Alnatura — chuỗi siêu thị organic lớn nhất Đức với hơn 130 cửa hàng và doanh thu 1,5 tỷ EUR/năm — đã gửi yêu cầu đến VCCI-HCM tìm kiếm nhà cung cấp nông sản organic chứng nhận EU/Bio từ Việt Nam.",
        "Các sản phẩm cần: gạo organic, rau củ organic, trái cây organic (xoài, thanh long, dừa, bưởi), hạt điều organic, cacao organic, cà phê organic, tiêu organic. Yêu cầu: chứng nhận EU Organic, GlobalG.A.P., Fair Trade; công suất 50-100 tấn/tháng; giá cạnh tranh so với thị trường organic EU.",
        "Alnatura sẵn sàng ký hợp đồng dài hạn 3 năm, hỗ trợ kỹ thuật và tài chính để nhà cung cấp đạt chuẩn organic EU. Doanh nghiệp quan tâm đăng ký qua trade@vcci-hcm.org.vn trước 30/4/2026.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-cohoi-5",
    categoryKey: "coHoiKinhDoanh",
    title: "Cơ hội cung cấp linh kiện ô tô cho Tập đoàn Toyota Việt Nam",
    summary:
      "Toyota Việt Nam đang tìm kiếm nhà cung cấp linh kiện phụ trợ ngành ô tô đáp ứng tiêu chuẩn chất lượng toàn cầu.",
    thumbnailUrl: SIDE_IMAGE,
    publishedAt: "2026-03-05T08:00:00.000Z",
    content: buildContent(
      "Toyota Việt Nam đẩy mạnh chương trình nội địa hoá linh kiện, tạo cơ hội lớn cho công nghiệp hỗ trợ Việt.",
      [
        "Toyota Việt Nam thông báo chương trình tìm kiếm nhà cung cấp linh kiện phụ trợ ngành ô tô năm 2026, nhằm nội địa hoá 40% giá trị linh kiện trong xe lắp ráp tại Việt Nam. Hiện tỷ lệ nội địa hoá đạt 18%, dư địa tăng trưởng còn rất lớn.",
        "Các linh kiện cần tìm: chi tiết kim loại dập (stamping); linh kiện nhựa kỹ thuật (injection molding); dây điện và cụm dây điện (wiring harness); các chi tiết cao su kỹ thuật; chi tiết hàn cắt kim loại; linh kiện điện tử ô tô.",
        "Yêu cầu: chứng nhận ISO/TS 16949 (hoặc IATF 16949); năng lực sản xuất lớn, ổn định; có kinh nghiệm xuất khẩu hoặc cung cấp cho tập đoàn ô tô; cam kết cải tiến liên tục (kaizen). Toyota hỗ trợ kỹ thuật miễn phí cho nhà cung cấp đủ điều kiện. Đăng ký: supply-chain@toyota-vn.com.vn.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-cohoi-6",
    categoryKey: "coHoiKinhDoanh",
    title: "Lời mời tham gia chương trình xúc tiến với Amazon Global Selling",
    summary:
      "Cơ hội đưa hàng Việt lên Amazon — cùng với Amazon Global Selling, đào tạo và hỗ trợ mở rộng sang Mỹ, EU, Nhật.",
    thumbnailUrl: HERO_IMAGE,
    publishedAt: "2026-03-02T08:00:00.000Z",
    content: buildContent(
      "Amazon Global Selling là cánh cửa để doanh nghiệp Việt tiếp cận trực tiếp 300 triệu khách hàng Amazon toàn cầu.",
      [
        "VCCI-HCM phối hợp với Amazon Global Selling tổ chức chương trình 'Go Global with Amazon' — chương trình đào tạo và hỗ trợ toàn diện cho doanh nghiệp Việt Nam muốn bán hàng trên Amazon.",
        "Chương trình bao gồm: (1) Đào tạo 8 buổi về bán hàng trên Amazon; (2) Hỗ trợ đăng ký tài khoản người bán; (3) Hỗ trợ tạo listing sản phẩm; (4) Quảng cáo Amazon Ads; (5) Logistics FBA; (6) Hỗ trợ sau bán hàng.",
        "Các thị trường: Amazon.com (Mỹ), Amazon.co.uk (Anh), Amazon.de (Đức), Amazon.co.jp (Nhật Bản), Amazon.sg (Singapore). Phù hợp với doanh nghiệp có sản phẩm unique, chất lượng cao, có năng lực sản xuất ổn định. Đăng ký: amazon@vcci-hcm.org.vn.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-cohoi-7",
    categoryKey: "coHoiKinhDoanh",
    title: "Mời hợp tác với Tập đoàn Lego — sản xuất linh kiện nhựa tại Việt Nam",
    summary:
      "Lego đang tìm kiếm nhà cung cấp linh kiện nhựa chất lượng cao tại Việt Nam để mở rộng chuỗi sản xuất toàn cầu.",
    thumbnailUrl: SIDE_IMAGE,
    publishedAt: "2026-02-28T08:00:00.000Z",
    content: buildContent(
      "Lego đánh giá cao năng lực sản xuất tại Việt Nam và đang tìm đối tác chiến lược để mở rộng sản xuất.",
      [
        "Theo thông tin từ Lego Manufacturing Vietnam, tập đoàn Lego (Đan Mạch) đang tìm kiếm nhà cung cấp linh kiện nhựa chất lượng cao tại Việt Nam, đặc biệt là các chi tiết khuôn ép nhựa chính xác (precision injection molding).",
        "Yêu cầu: nhà máy đạt chuẩn ISO 9001, ISO 14001; kinh nghiệm ép nhựa chính xác; công suất tối thiểu 10 triệu sản phẩm/năm; vốn đầu tư tối thiểu 5 tỷ đồng cho máy móc; tuân thủ tiêu chuẩn ESG của Lego (zero waste, 100% năng lượng tái tạo).",
        "Lego cam kết hỗ trợ kỹ thuật lâu dài, hợp đồng ổn định 5-10 năm, và có lộ trình phát triển nhà cung cấp thành đối tác chiến lược. Đây là cơ hội lớn cho doanh nghiệp nhựa Việt Nam vươn ra chuỗi giá trị toàn cầu. Đăng ký: lego-sourcing@vcci-hcm.org.vn.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-cohoi-8",
    categoryKey: "coHoiKinhDoanh",
    title: "Mời tham gia Gian hàng Việt Nam tại Hội chợ Gulfood Dubai 2026",
    summary:
      "VCCI-HCM tổ chức gian hàng Việt Nam tại Gulfood Dubai — Hội chợ thực phẩm lớn nhất Trung Đông.",
    thumbnailUrl: HERO_IMAGE,
    publishedAt: "2026-02-20T08:00:00.000Z",
    content: buildContent(
      "Gulfood là Hội chợ thực phẩm & đồ uống lớn nhất Trung Đông, Bắc Phi và Nam Á — quy tụ hơn 5.000 nhà trưng bày từ 120 quốc gia.",
      [
        "Gulfood Dubai 2026 diễn ra từ ngày 17-21/2/2026 tại Dubai World Trade Centre. VCCI-HCM tổ chức Gian hàng Việt Nam (Vietnam Pavilion) rộng 200m², hỗ trợ doanh nghiệp F&B Việt tiếp cận thị trường Trung Đông.",
        "Quyền lợi khi tham gia: (1) Gian hàng tiêu chuẩn 9-12m² đã được trang trí sẵn; (2) Phiên dịch tiếng Anh và Ả Rập; (3) Hỗ trợ kết nối B2B với nhà nhập khẩu Dubai, Saudi Arabia, Qatar; (4) Marketing trên các kênh của VCCI-HCM và VCCI Việt Nam; (5) Hỗ trợ visa, vé máy bay với giá ưu đãi.",
        "Đối tượng tham gia: doanh nghiệp sản xuất/xuất khẩu thực phẩm, đồ uống, nguyên liệu F&B. Chi phí: từ 95 triệu đồng/gian hàng tiêu chuẩn (đã bao gồm thiết kế, in ấn, trưng bày). Đăng ký trước 30/11/2025: gulfood@vcci-hcm.org.vn.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-cohoi-9",
    categoryKey: "coHoiKinhDoanh",
    title: "Cơ hội cho startup Việt vào các quỹ đầu tư mạo hiểm khu vực Đông Nam Á",
    summary:
      "Danh sách các quỹ đầu tư mạo hiểm (VC) đang tích cực tìm kiếm startup Việt để rót vốn năm 2026.",
    thumbnailUrl: SIDE_IMAGE,
    publishedAt: "2026-02-15T08:00:00.000Z",
    content: buildContent(
      "Thị trường đầu tư mạo hiểm Đông Nam Á đang phục hồi mạnh mẽ trong năm 2026, nhiều quỹ lớn tích cực tìm kiếm cơ hội tại Việt Nam.",
      [
        "Các quỹ VC đang hoạt động tích cực tại Việt Nam: (1) Sequoia Capital (đã công bố quỹ Đông Nam Á trị giá 850 triệu USD); (2) IDG Ventures Vietnam; (3) Jungle Ventures; (4) 500 Startups Vietnam; (5) Genesia Ventures; (6) Do Ventures; (7) Touchstone Partners; (8) Openspace Ventures.",
        "Các lĩnh vực được quan tâm: FinTech; EdTech; HealthTech; AgriTech; LogTech; SaaS B2B; AI & Machine Learning; Cleantech; E-commerce. Vòng gọi vốn phổ biến: từ Seed (250K - 2M USD) đến Series A (3-15M USD) và Series B (15-50M USD).",
        "Để được tư vấn và kết nối với các quỹ, startup Việt có thể đăng ký qua VCCI-HCM Startup Support: startup@vcci-hcm.org.vn. Hoặc tham dự Vietnam Startup Day 2026 diễn ra ngày 15/4/2026.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-cohoi-10",
    categoryKey: "coHoiKinhDoanh",
    title: "Mời cung cấp dịch vụ logistics cho Hiệp hội Doanh nghiệp Nhật Bản tại TP.HCM",
    summary:
      "JBAH tìm kiếm đối tác logistics uy tín phục vụ cộng đồng doanh nghiệp Nhật Bản tại Việt Nam.",
    thumbnailUrl: HERO_IMAGE,
    publishedAt: "2026-02-10T08:00:00.000Z",
    content: buildContent(
      "Hiệp hội Doanh nghiệp Nhật Bản tại TP.HCM (JBAH) cung cấp dịch vụ logistics cho 1.500 doanh nghiệp Nhật đang hoạt động tại phía Nam.",
      [
        "JBAH đang tìm kiếm các nhà cung cấp dịch vụ logistics uy tín để phục vụ cộng đồng doanh nghiệp Nhật Bản: (1) Vận tải đường biển nội địa và quốc tế; (2) Vận tải đường bộ xuyên Việt; (3) Dịch vụ kho bãi và fulfilment; (4) Dịch vụ hải quan; (5) Kho lạnh; (6) Vận chuyển door-to-door.",
        "Yêu cầu: công ty có ít nhất 5 năm kinh nghiệm, đội ngũ nhân sự nói tiếng Nhật, hệ thống IT quản lý tiên tiến (TMS/WMS), chứng nhận chất lượng (ISO 9001, AEO), uy tín với khách hàng Nhật.",
        "Ưu đãi khi trở thành đối tác của JBAH: tiếp cận 1.500 doanh nghiệp Nhật, hợp đồng dài hạn, tham gia vào các chương trình xúc tiến thương mại Nhật-Việt. Đăng ký: jbah@vcci-hcm.org.vn.",
      ],
    ),
  }),
];

// ---------------------------------------------------------------
// KẾT NỐI HỘI VIÊN (+9)
// ---------------------------------------------------------------
const ketNoiExtra: HomePostItem[] = [
  buildShortPost({
    id: "mock-ketnoi-2",
    categoryKey: "ketNoiHoiVien",
    title: "Câu lạc bộ CEO VCCI-HCM: Gặp gỡ tháng 4 với chủ đề 'Xây dựng thương hiệu cá nhân cho CEO'",
    summary:
      "Câu lạc bộ CEO định kỳ tháng 4 với chủ đề xây dựng thương hiệu cá nhân cho CEO trong kỷ nguyên số.",
    thumbnailUrl: MEMBER_IMAGE,
    publishedAt: "2026-03-28T08:00:00.000Z",
    content: buildContent(
      "Câu lạc bộ CEO là nơi quy tụ các nhà lãnh đạo doanh nghiệp hội viên để chia sẻ kinh nghiệm và kết nối.",
      [
        "Câu lạc bộ CEO VCCI-HCM tháng 4/2026 tổ chức ngày 15/4 tại VCCI-HCM với chủ đề 'Xây dựng thương hiệu cá nhân cho CEO trong kỷ nguyên số'. Diễn giả: ông Nguyễn Hữu Trung (CEO Mạng xã hội Pikalink), bà Bùi Thị Minh Hằng (Founder Madame Nguyễn - top branding agency Việt Nam).",
        "Chương trình: 18h00 Networking cocktail; 18h30 Phần trình bày diễn giả; 19h30 Panel thảo luận: 'CEO có nên là influencer?'; 20h30 Networking dinner. Phí tham dự: 1.200.000 đồng/CEO (bao gồm cocktail, dinner).",
        "Đối tượng: CEO/Chairman của doanh nghiệp hội viên VCCI-HCM. Đăng ký: ceo-club@vcci-hcm.org.vn.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-ketnoi-3",
    categoryKey: "ketNoiHoiVien",
    title: "Chương trình 'CEO Mentoring' — Kết nối doanh nhân kỳ cựu với startup hội viên",
    summary:
      "Chương trình mentor 6 tháng giữa CEO kỳ cựu và startup hội viên — chia sẻ kinh nghiệm thực chiến trong xây dựng doanh nghiệp.",
    thumbnailUrl: MEMBER_IMAGE,
    publishedAt: "2026-03-25T08:00:00.000Z",
    content: buildContent(
      "Chương trình CEO Mentoring 2026 kết nối 30 cặp mentor-mentee trong 6 tháng.",
      [
        "Chương trình 'CEO Mentoring 2026' do VCCI-HCM tổ chức từ 5/2026 đến 10/2026, kết nối 30 cặp mentor là CEO kỳ cựu với 30 startup hội viên, hỗ trợ phát triển kinh doanh thông qua mentoring 1-1.",
        "Cam kết: Mỗi cặp mentor-mentee gặp gỡ tối thiểu 2 giờ/tháng, tổng cộng 12 giờ trong 6 tháng. Mentor hỗ trợ về chiến lược, vận hành, kết nối khách hàng và nhà đầu tư. Đặc biệt, sẽ có 3 buổi workshop nhóm với chủ đề: 'Xây dựng đội ngũ', 'Quản trị tài chính', 'Kết nối đầu tư'.",
        "Yêu cầu mentor: CEO có ít nhất 15 năm kinh nghiệm, doanh nghiệp đạt doanh thu từ 100 tỷ đồng/năm trở lên. Yêu cầu mentee: startup hội viên VCCI-HCM, đã có sản phẩm thị trường, doanh thu từ 1-50 tỷ đồng/năm. Đăng ký: mentoring@vcci-hcm.org.vn.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-ketnoi-4",
    categoryKey: "ketNoiHoiVien",
    title: "Bản tin Hội viên VCCI-HCM tháng 4/2026",
    summary:
      "Bản tin tổng hợp các hoạt động, chương trình hỗ trợ, sự kiện nổi bật dành cho hội viên VCCI-HCM trong tháng 4.",
    thumbnailUrl: MEMBER_IMAGE,
    publishedAt: "2026-03-22T08:00:00.000Z",
    content: buildContent(
      "Bản tin Hội viên tháng 4 cập nhật toàn bộ hoạt động dành cho doanh nghiệp hội viên VCCI-HCM.",
      [
        "Điểm nổi bật tháng 4: (1) 5/4 — Hội thảo 'AI trong quản trị' (miễn phí cho hội viên); (2) 15/4 — Khai giảng khoá Kỹ năng quản trị 4.0 (giảm 20% học phí); (3) 18/4 — B2B kết nối doanh nghiệp ngành logistics; (4) 25/4 — Gala hội viên quý 2/2026 (ưu tiên hội viên); (5) 30/4 — Hạn cuối đăng ký tham gia đoàn xúc tiến Dubai.",
        "Quyền lợi mới cho hội viên: Từ tháng 4, hội viên được sử dụng phòng họp VIP miễn phí 4 giờ/tháng; tư vấn pháp lý miễn phí 5 giờ/tháng; ưu đãi 15% dịch vụ logistic tại DHL, FedEx.",
        "Để đăng ký các chương trình hoặc xem chi tiết, liên hệ Phòng Hội viên: members@vcci-hcm.org.vn.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-ketnoi-5",
    categoryKey: "ketNoiHoiVien",
    title: "Mạng lưới hội viên quốc tế: Kết nối doanh nghiệp Việt với ICC, AmCham và EuroCham",
    summary:
      "Mạng lưới liên kết 4 hiệp hội quốc tế lớn tại TP.HCM giúp hội viên mở rộng quan hệ kinh doanh toàn cầu.",
    thumbnailUrl: MEMBER_IMAGE,
    publishedAt: "2026-03-18T08:00:00.000Z",
    content: buildContent(
      "VCCI-HCM là đầu mối kết nối với các hiệp hội quốc tế lớn tại TP.HCM, tạo mạng lưới cho doanh nghiệp hội viên.",
      [
        "VCCI-HCM ký thoả thuận hợp tác song phương với: (1) Phòng Thương mại Hoa Kỳ tại Việt Nam (AmCham) — đại diện cho 700+ doanh nghiệp Mỹ; (2) Hiệp hội Doanh nghiệp châu Âu tại Việt Nam (EuroCham) — đại diện cho 1.000+ doanh nghiệp EU; (3) Phòng Công nghiệp và Thương mại Quốc tế (ICC) — tổ chức toàn cầu với 45 triệu hội viên.",
        "Quyền lợi: Hội viên VCCI-HCM có thể tham gia các sự kiện của AmCham, EuroCham, ICC với giá ưu đãi 30-50%; được giới thiệu với đối tác phù hợp qua cơ chế matching; tham gia các đoàn xúc tiến thương mại quốc tế do 4 hiệp hội đồng tổ chức; chia sẻ thông tin thị trường quốc tế.",
        "Đăng ký tham gia mạng lưới: international-network@vcci-hcm.org.vn.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-ketnoi-6",
    categoryKey: "ketNoiHoiVien",
    title: "Chuyên đề 'Doanh nghiệp gia đình Việt — Cơ hội và thách thức thế hệ 2.0'",
    summary:
      "Buổi chia sẻ chuyên đề về quản trị doanh nghiệp gia đình, chuyển giao thế hệ và xây dựng năng lực kế thừa.",
    thumbnailUrl: MEMBER_IMAGE,
    publishedAt: "2026-03-15T08:00:00.000Z",
    content: buildContent(
      "Doanh nghiệp gia đình chiếm 60% GDP Việt Nam — câu chuyện chuyển giao thế hệ là chủ đề quan trọng nhất hiện nay.",
      [
        "Buổi chia sẻ chuyên đề 'Doanh nghiệp gia đình Việt — Cơ hội và thách thức thế hệ 2.0' diễn ra ngày 25/5/2026 tại VCCI-HCM, do VCCI-HCM phối hợp với Family Business Network (FBN) Việt Nam tổ chức. Đây là chương trình thường niên quan trọng nhất cho cộng đồng doanh nghiệp gia đình.",
        "Chủ đề: (1) Chuẩn bị kế hoạch chuyển giao thế hệ; (2) Xây dựng ban lãnh đạo chuyên nghiệp; (3) Hoà giải mâu thuẫn gia đình trong quản trị; (4) Minh bạch hoá tài chính; (5) Vai trò của cố vấn độc lập. Diễn giả: các CEO đến từ Tập đoàn Thiên Long, Tập đoàn Hoa Sen, Công ty CP TM Vĩnh Phú; chuyên gia quản trị gia đình quốc tế từ FBN Asia.",
        "Phí tham dự: 2.500.000 đồng/đại biểu. Đăng ký trước 18/5/2026: family-business@vcci-hcm.org.vn.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-ketnoi-7",
    categoryKey: "ketNoiHoiVien",
    title: "Hội chợ Hội viên VCCI-HCM 2026 — Cơ hội kinh doanh cho doanh nghiệp SME",
    summary:
      "Hội chợ thường niên do VCCI-HCM tổ chức dành cho hội viên — trưng bày, kết nối, đào tạo tất cả trong một sự kiện.",
    thumbnailUrl: MEMBER_IMAGE,
    publishedAt: "2026-03-10T08:00:00.000Z",
    content: buildContent(
      "Hội chợ Hội viên VCCI-HCM là sự kiện lớn nhất trong năm dành cho doanh nghiệp hội viên, thu hút hơn 3.000 người tham gia.",
      [
        "Hội chợ Hội viên VCCI-HCM 2026 diễn ra 2 ngày 15-16/6/2026 tại SECC (Quận 7), với quy mô 200 gian hàng từ 200 doanh nghiệp hội viên, dự kiến thu hút 3.000 lượt khách tham quan.",
        "Chương trình: (1) Khu trưng bày sản phẩm hội viên; (2) Khu kết nối B2B; (3) Hội thảo chuyên đề 'Tăng trưởng SME trong 2026'; (4) Khu đào tạo mini về Marketing, Thuế, Pháp lý; (5) Khu giao lưu văn hoá; (6) Bình chọn sản phẩm sáng tạo nhất 2026.",
        "Đăng ký gian hàng cho hội viên trước 30/4/2026 để được giảm 20% phí gian hàng. Liên hệ: fair@vcci-hcm.org.vn.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-ketnoi-8",
    categoryKey: "ketNoiHoiVien",
    title: "Chương trình thực tập sinh quốc tế tại doanh nghiệp hội viên",
    summary:
      "Cơ hội cho doanh nghiệp hội viên đón thực tập sinh quốc tế từ Nhật Bản, Hàn Quốc, Đức — giải pháp nhân sự chất lượng cao.",
    thumbnailUrl: MEMBER_IMAGE,
    publishedAt: "2026-03-05T08:00:00.000Z",
    content: buildContent(
      "Chương trình thực tập sinh quốc tế là cơ hội cho doanh nghiệp tiếp cận nguồn nhân lực chất lượng cao từ Nhật, Hàn, Đức.",
      [
        "VCCI-HCM phối hợp với các tổ chức giáo dục quốc tế triển khai Chương trình thực tập sinh tại doanh nghiệp hội viên. Sinh viên từ Đại học Keio (Nhật), KAIST (Hàn), TU München (Đức), và một số trường ĐH uy tín tại Pháp, Úc được đưa về thực tập 3-12 tháng tại doanh nghiệp Việt.",
        "Lợi ích cho doanh nghiệp: (1) Tiếp cận nhân sự quốc tế chất lượng cao với chi phí thấp (doanh nghiệp chỉ hỗ trợ ăn ở, 5-8 triệu đồng/tháng); (2) Đào tạo được nhân sự am hiểu thị trường quốc tế; (3) Cơ hội tuyển dụng sau thực tập; (4) Mở rộng mạng lưới quốc tế; (5) Nâng cao năng lực nghiên cứu và phát triển.",
        "Doanh nghiệp hội viên đăng ký trước 30/4/2026 qua internship@vcci-hcm.org.vn để được phỏng vấn sinh viên phù hợp.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-ketnoi-9",
    categoryKey: "ketNoiHoiVien",
    title: "Bảng tin việc làm dành riêng cho cộng đồng hội viên VCCI-HCM",
    summary:
      "Nền tảng tuyển dụng và tìm việc riêng cho hội viên — kết nối nhanh nhân sự chất lượng với doanh nghiệp.",
    thumbnailUrl: MEMBER_IMAGE,
    publishedAt: "2026-02-28T08:00:00.000Z",
    content: buildContent(
      "Bảng tin việc làm VCCI-HCM giúp doanh nghiệp hội viên tiếp cận nguồn nhân sự chất lượng, đặc biệt nhân sự đã qua đào tạo của VCCI-HCM.",
      [
        "Bảng tin việc làm công khai tại vcci-hcm.org.vn/jobs — nơi doanh nghiệp hội viên đăng tin tuyển dụng miễn phí và ứng viên nộp hồ sơ trực tiếp. Đặc biệt, VCCI-HCM có hơn 5.000 cựu học viên các khoá đào tạo trong hệ thống.",
        "Các vị trí đang tuyển nhiều: Chuyên viên kinh doanh xuất khẩu; Chuyên viên marketing số; Kế toán trưởng; Quản lý chất lượng ISO; Chuyên viên pháp lý; Lập trình viên; Quản lý dự án; Logistics.",
        "Doanh nghiệp đăng tin tuyển miễn phí bằng cách gửi thông tin về jobs@vcci-hcm.org.vn. Ứng viên truy cập vcci-hcm.org.vn/jobs để tìm việc.",
      ],
    ),
  }),
  buildShortPost({
    id: "mock-ketnoi-10",
    categoryKey: "ketNoiHoiVien",
    title: "Giải thưởng Doanh nghiệp hội viên tiêu biểu VCCI-HCM 2026",
    summary:
      "Mời đề cử và bình chọn doanh nghiệp hội viên tiêu biểu năm 2026 — giải thưởng uy tín nhất của VCCI-HCM.",
    thumbnailUrl: MEMBER_IMAGE,
    publishedAt: "2026-02-25T08:00:00.000Z",
    content: buildContent(
      "Giải thưởng Doanh nghiệp hội viên tiêu biểu VCCI-HCM là giải thưởng uy tín nhất trong hệ thống, nhằm tôn vinh những doanh nghiệp có đóng góp nổi bật.",
      [
        "Giải thưởng năm 2026 có 5 hạng mục: (1) Doanh nghiệp xuất sắc nhất; (2) Doanh nghiệp đổi mới sáng tạo; (3) Doanh nghiệp ESG tiêu biểu; (4) Doanh nghiệp có đóng góp cộng đồng; (5) Doanh nghiệp trẻ triển vọng. Tổng giải thưởng trị giá 5 tỷ đồng (tiền mặt, dịch vụ tư vấn, quảng bá truyền thông).",
        "Tiêu chí đánh giá: Doanh thu, tăng trưởng, sáng tạo, ESG, đóng góp cộng đồng, quản trị. Quy trình: (1) Doanh nghiệp tự đề cử hoặc được VCCI-HCM đề cử; (2) Vòng sơ loại hồ sơ; (3) Hội đồng giám khảo gồm các chuyên gia đánh giá; (4) Công bố kết quả tại Gala Hội viên ngày 15/12/2026.",
        "Thời hạn đăng ký đề cử: đến 30/9/2026. Hồ sơ chi tiết xem tại vcci-hcm.org.vn/award2026. Liên hệ: award@vcci-hcm.org.vn.",
      ],
    ),
  }),
];

// Gộp tất cả
MOCK_HOME_POSTS.push(
  ...tinVcciExtra,
  ...tinKinhTeExtra,
  ...chuyenDeExtra,
  ...suKienExtra,
  ...csPhapLuatExtra,
  ...lienKetNhanhExtra,
  ...daoTaoExtra,
  ...coHoiKdExtra,
  ...ketNoiExtra,
);

export default MOCK_HOME_POSTS;
