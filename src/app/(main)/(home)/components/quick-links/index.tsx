import ImageNext from "@/components/shared/image-next";
import Link from "next/link";

function QuickLinks() {
  return (
    <aside className="w-full lg:w-[30%]">
      <div className="flex justify-between items-center">
        <h2 className="text-[18px] sm:text-[20px] font-semibold uppercase text-[#063e8e]">
          Liên kết nhanh
        </h2>
      </div>
      <hr className="border-[#063e8e] mb-4" />
      <div className="space-y-2 text-[#063e8e] text-sm md:text-base pb-10">
        <div>
          <Link
            className="text-[#363636]"
            href="https://vcci-hcm.org.vn/lien-ket-nhanh/cam-nang-huong-dan-dau-tu-kinh-doanh-tai-viet-nam-2023/"
          >
            🔗 Cẩm nang hướng dẫn đầu tư kinh doanh tại Việt Nam
          </Link>
        </div>
        <div>
          <Link
            className="text-[#363636]"
            href="https://vcci-hcm.org.vn/lien-ket-nhanh/doanh-nghiep-kien-nghi-ve-chinh-sach-va-phap-luat/"
          >
            🔗 Doanh nghiệp kiến nghị về chính sách và pháp luật
          </Link>
        </div>
      </div>
      <div>
        <Link href="https://hardwaretools.com.vn/">
          <ImageNext
            src="/home/20-2048x1365.webp"
            alt="banner"
            width={2048}
            height={1365}
          />
        </Link>
      </div>
    </aside>
  );
}

export default QuickLinks;
