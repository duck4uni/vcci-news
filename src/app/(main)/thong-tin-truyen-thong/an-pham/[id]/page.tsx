"use client";
import ListCategory from "@/components/base/list-category";
import { MEDIA_INFORMATION_CATEGORIES } from "@/constants/categories";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import Calendar from "../components/calendar";

const publications = [
  {
    id: "huong-dan-dau-tu-2024",
    title: "Cẩm nang Hướng dẫn đầu tư kinh doanh tại Việt Nam",
    date: "18/10/2023",
    link: "https://vcci-hcm.org.vn/wp-content/uploads/2023/10/Doing-Business-in-Vietnam-2023_Upload.pdf",
    title_link: "“DOING BUSINESS IN VIETNAM 2023”",
    img: "/an-pham/A-Guide-2023_Cover-725x1024.webp",
  },
  {
    id: "connections-2022-2023",
    title: "Danh bạ Hội viên CONNECTIONS 2022-2023",
    date: "19/01/2023",
    link: "https://vcci-hcm.org.vn/wp-content/uploads/2022/12/Danh-ba-HV-Connections_2022-2023.pdf",
    title_link: "“DANH BẠ HỘI VIÊN CONNECTIONS 2022-2023”",
    img: "/an-pham/Trang-bia_Connections_2022-2023-725x1024.jpg.webp",
  },
  {
    id: "chuyen-doi-so",
    title: "Chuyển đổi số – Động lực phục hồi và phát triển kinh tế",
    date: "19/01/2023", // ← Sửa: 119 → 19
    link: "https://vcci-hcm.org.vn/wp-content/uploads/2022/12/CHUYEN-DOI-SO-2022_Final_19.12.2022.pdf",
    title_link: "“CHUYỂN ĐỔI SỐ – ĐỘNG LỰC PHỤC HỒI VÀ PHÁT TRIỂN KINH TẾ”",
    img: "/an-pham/Trang-bia_Chuyen-doi-so_2022-750x1024.webp",
  },
  {
    id: "huong-dan-dau-tu-2021",
    title: "Cẩm nang Hướng dẫn đầu tư kinh doanh tại Việt Nam 2021",
    date: "14/03/2022",
    link: "https://vcci-hcm.org.vn/wp-content/uploads/2023/10/Doing-Business-in-Vietnam-2023_Upload.pdf",
    title_link: "“DOING BUSINESS IN VIETNAM 2021”",
    img: "/an-pham/doing-in-business-cover-1-1.webp",
  },
  {
    id: "ban-tin-quy-4-2020",
    title: "Bản tin Quý IV năm 2020",
    date: "04/01/2021",
    link: "https://vcci-hcm.org.vn/wp-content/uploads/2021/01/No3-092020_VCCI-NEWS-FINAL.pdf",
    title_link: "Bản Tin Quý IV năm 2020",
    img: "/an-pham/bia-ban-tin-quy-4-1.webp",
  },
  {
    id: "ban-tin-quy-1-2020",
    title: "Bản tin Quý I năm 2020",
    date: "16/07/2020",
    link: "https://vcci-hcm.org.vn/wp-content/uploads/2020/07/VCCI-NEWS-012020_XUAN.pdf",
    title_link: "Bản tin Quý I năm 2020",
    img: "/an-pham/bantintet-1.webp", // ← Sửa: iimg → img
  },
];

// ĐÚNG: Không async, params là object
export default function PublicationDetail() {
  const params = useParams(); // Dùng hook
  const id = params.id as string; // Ép kiểu an toàn

  const publication = publications.find((p) => p.id === id);

  if (!publication) return notFound();

  return (
    <div className="bg-[#f6f6f6] min-h-screen">
      <div className="container mx-auto flex flex-col gap-5 mb-[50px]">
        <div className="border-[#e5e7f2] border-[1px]">
          <ListCategory categories={MEDIA_INFORMATION_CATEGORIES} />
        </div>

        <div className="w-full flex gap-5 flex-wrap">
          <div className="lg:w-[calc(65%-10px)] w-full border-[#e5e7f2] border-[1px] bg-white p-[30px] flex flex-col gap-[15px]">
            <h1 className="text-[22px] font-semibold text-[#003366]">
              {publication.title}
            </h1>
            <p className="text-[#00AED5] text-sm">{publication.date}</p>
            <hr />

            <p className="text-[16px] text-[#363636]">
              Tải về ấn phẩm:{" "}
              <Link
                href={publication.link}
                target="_blank"
                className="text-[#0073e6] hover:text-[#e8c518]"
              >
                {publication.title_link}
              </Link>
            </p>

            <div className="flex justify-center">
              <Link href={publication.link} target="_blank">
                <Image
                  src={publication.img}
                  alt={publication.title}
                  width={416}
                  height={566}
                  className="rounded-lg transition-all duration-300"
                />
              </Link>
            </div>
          </div>

          <div className="lg:w-[calc(35%-10px)] w-full">
            <Calendar />
            <div className="relative w-full mt-4 h-[300px] aspect-video rounded-lg overflow-hidden">
              <Image
                src="/banner.webp"
                alt="Quảng cáo"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
