export type SiteMapItem = {
	label: string;
	url: string;
	children?: SiteMapItem[];
};

export const MOCK_SITEMAP: SiteMapItem[] = [
	{ label: "Trang chủ", url: "", children: [] },

	{
		label: "Giới thiệu",
		url: "/gioi-thieu",
		children: [
			{ label: "Về VCCI-HCM", url: "/gioi-thieu", children: [] },
			{ label: "Chức năng và nhiệm vụ", url: "/gioi-thieu/chuc-nang-va-nhiem-vu", children: [] },
			{ label: "Sơ đồ tổ chức", url: "/gioi-thieu/so-do-to-chuc", children: [] },
			{ label: "Dịch vụ cung cấp", url: "/gioi-thieu/dich-vu-cung-cap", children: [] },
		],
	},

	{
		label: "Hội viên",
		url: "/hoi-vien",
		children: [
			{ label: "Lợi ích của hội viên VCCI", url: "/hoi-vien", children: [] },
			{ label: "Đăng ký hội viên", url: "/hoi-vien/dang-ky-hoi-vien", children: [] },
			{ label: "Kết nối hội viên", url: "/hoi-vien/ket-noi-hoi-vien", children: [] },
			{ label: "Tin hội viên", url: "/hoi-vien/tin-hoi-vien", children: [] },
		],
	},

	{
		label: "Hoạt động",
		url: "/hoat-dong",
		children: [
			{ label: "Sự kiện", url: "/hoat-dong/su-kien", children: [] },
			{ label: "Đào tạo", url: "/hoat-dong/dao-tao", children: [] },
		],
	},

	{
		label: "Xuất xứ hàng hóa",
		url: "/xuat-xu-hang-hoa",
		children: [
			{ label: "Định nghĩa chung", url: "/xuat-xu-hang-hoa", children: [] },
			{ label: "Mục đích của C/O", url: "/xuat-xu-hang-hoa/muc-dich", children: [] },
			{ label: "Luật áp dụng về C/O", url: "/xuat-xu-hang-hoa/luat-ap-dung", children: [] },
			{ label: "Thủ tục cấp C/O", url: "/xuat-xu-hang-hoa/thu-tuc-cap", children: [] },
			{ label: "Biểu mẫu C/O và cách khai", url: "/xuat-xu-hang-hoa/bieu-mau-c-o-va-cach-khai", children: [] },
			{ label: "Phí và lệ phí cấp C/O", url: "/xuat-xu-hang-hoa/phi-le-phi-cap", children: [] },
			{ label: "Điểm cấp và thời gian cấp C/O", url: "/xuat-xu-hang-hoa/diem-cap-va-thoi-gian-cap", children: [] },
			{ label: "Thông tin liên hệ", url: "/xuat-xu-hang-hoa/thong-tin-lien-he", children: [] },
		],
	},

	{
		label: "Đại diện giới chủ",
		url: "/dai-dien-gioi-chu",
		children: [
			{ label: "Chức năng đại diện người sử dụng lao động", url: "/dai-dien-gioi-chu/chuc-nang-dai-dien-nguoi-su-dung-lao-dong", children: [] },
			{ label: "Sự kiện - tập huấn NSDLĐ", url: "/dai-dien-gioi-chu/tap-huan-nsdld", children: [] },
			{ label: "Tin liên quan", url: "/dai-dien-gioi-chu/tin-lien-quan", children: [] },
			{ label: "Chủ đề", url: "/dai-dien-gioi-chu/chu-de", children: [] },
		],
	},

	{
		label: "Xúc tiến thương mại",
		url: "/xuc-tien-thuong-mai",
		children: [
			{ label: "Hồ sơ thị trường", url: "/xuc-tien-thuong-mai/ho-so-thi-truong", children: [] },
			{ label: "Môi trường kinh doanh", url: "/xuc-tien-thuong-mai/moi-truong-kinh-doanh", children: [] },
			{ label: "Cơ hội kinh doanh", url: "/xuc-tien-thuong-mai/co-hoi-kinh-doanh", children: [] },
			{ label: "Hỗ trợ kinh doanh", url: "/xuc-tien-thuong-mai/ho-tro-kinh-doanh", children: [] },
		],
	},

	{
		label: "Thông tin truyền thông",
		url: "/thong-tin-truyen-thong",
		children: [
			{ label: "Tin VCCI", url: "/thong-tin-truyen-thong/tin-vcci", children: [] },
			{ label: "Tin kinh tế", url: "/thong-tin-truyen-thong/tin-kinh-te", children: [] },
			{ label: "Tin doanh nghiệp", url: "/thong-tin-truyen-thong/tin-doanh-nghiep", children: [] },
			{ label: "Chuyên đề", url: "/thong-tin-truyen-thong/chuyen-de", children: [] },
			{ label: "Thông tin chính sách và pháp luật", url: "/thong-tin-truyen-thong/thong-tin-chinh-sach-va-phap-luat", children: [] },
			{ label: "Ấn phẩm", url: "/thong-tin-truyen-thong/an-pham", children: [] },
			{ label: "Thư viện tài liệu", url: "/thong-tin-truyen-thong/thu-vien-tai-lieu", children: [] },
		],
	},
];

export default MOCK_SITEMAP;

