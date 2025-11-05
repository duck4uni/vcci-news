'use client'
import React from "react";
import ListCategory from "./components/list-category";
import EventCalendar from "@/components/base/event-calendar";

const Page = () => {
  return (
    <div className="min-h-screen container mx-auto pb-4">
      <div className="w-full flex flex-col gap-5">
        <ListCategory />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <main className="lg:col-span-2 bg-white border rounded-md p-7">
            <div>
              <h1 className="text-2xl font-bold text-[#153e8e]">Lợi ích của Hội viên VCCI</h1>
              <hr className="my-5" />
              <p className="text-justify leading-7">
                Hội viên chính thức là các doanh nghiệp, các tổ chức sản xuất, kinh doanh, người sử dụng lao động, các hiệp hội doanh nghiệp có đăng ký và hoạt động hợp pháp ở Việt Nam. Hội viên chính thức được thừa hưởng những quyền lợi và sau đây:
              </p>
              <div>
                <img src="/hoi-vien/thong-tin.webp" alt="Thông tin" className="w-12 py-5" />
                <strong className="block text-2xl text-gray-600 py-3">TIẾNG NÓI</strong>
                <ul className="list-disc pl-10 space-y-1">
                  <li className="text-justify leading-7">Được hỗ trợ giải quyết các vướng mắc, kiến nghị của doanh nghiệp với các cơ quan quản lý trong quá trình kinh doanh và thực thi pháp luật.</li>
                  <li className="text-justify leading-7">Được tham dự miễn phí các hội nghị, hội thảo, đối thoại với các cơ quan ban ngành về pháp luật và chính sách hàng năm.</li>
                  <li className="text-justify leading-7">Được tham dự hội nghị đối thoại thường niên về chính sách thuế, hải quan và thủ tục hành chính.</li>
                </ul>
              </div>
              <div>
                <img src="/hoi-vien/thong-tin.webp" alt="Thông tin" className="w-12 py-5" />
                <strong className="block text-2xl text-gray-600 py-3">ĐỘ NHẬN DIỆN</strong>
                <ul className="list-disc pl-10 space-y-1">
                  <li className="text-justify leading-7">Hồ sơ doanh nghiệp được đăng tải miễn phí trên Danh bạ Hội viên CONNECTIONS.</li>
                  <li className="text-justify leading-7">Thông tin doanh nghiệp được giới thiệu miễn phí trên website và các kênh truyền thông của VCCI-HCM.</li>
                  <li className="text-justify leading-7">Cơ hội trở thành nhà tài trợ cho các sự kiện của VCCI-HCM.</li>
                  <li className="text-justify leading-7">Được ưu đãi đặc biệt khi sử dụng các dịch vụ truyền thông, quảng bá thương hiệu của VCCI-HCM.</li>
                </ul>
              </div>
              <div>
                <img src="/hoi-vien/thong-tin.webp" alt="Thông tin" className="w-12 py-5" />
                <strong className="block text-2xl text-gray-600 py-3">MẠNG LƯỚI LIÊN KẾT</strong>
                <ul className="list-disc pl-10 space-y-1">
                  <li className="text-justify leading-7">Được tham dự miễn phí các sự kiện xúc tiến thương mại và đầu tư hàng năm.</li>
                  <li className="text-justify leading-7">Được ưu đãi khi tham gia các đoàn khảo sát thị trường nước ngoài do VCCI-HCM tổ chức.</li>
                  <li className="text-justify leading-7">Tương tác trong mạng lưới hội viên VCCI- HCM, tiếp cận các đối tác tin cậy và khách hàng tiềm năng.</li>
                </ul>
              </div>
              <div>
                <img src="/hoi-vien/thong-tin.webp" alt="Thông tin" className="w-12 py-5" />
                <strong className="block text-2xl text-gray-600 py-3">PHÁT TRIỂN</strong>
                <ul className="list-disc pl-10 space-y-1">
                  <li className="text-justify leading-7">Được tham gia các khóa đào tạo của VCCI- HCM với chi phí ưu đãi.</li>
                  <li className="text-justify leading-7">Được tiếp cận các dự án hỗ trợ doanh nghiệp phát triển được tài trợ bởi các tổ chức trong nước và quốc tế.</li>
                  <li className="text-justify leading-7">Được tư vấn bởi các chuyên gia về pháp luật, quan hệ lao động, thị trường,… với chi phí ưu đãi.</li>
                </ul>
              </div>
              <div>
                <img src="/hoi-vien/thong-tin.webp" alt="Thông tin" className="w-12 py-5" />
                <strong className="block text-2xl text-gray-600 py-3">ĐỘ TIN CẬY</strong>
                <ul className="list-disc pl-10 space-y-1">
                  <li className="text-justify leading-7">Tăng uy tín và độ tin cậy cho doanh nghiệp khi trở thành hội viên VCCI-HCM.</li>
                  <li className="text-justify leading-7">Tạo thuận lợi cho doanh nghiệp trong các hoạt động hợp tác kinh doanh {`-`} đầu tư.</li>
                </ul>
              </div>
              <div>
                <img src="/hoi-vien/thong-tin.webp" alt="Thông tin" className="w-12 py-5" />
                <strong className="block text-2xl text-gray-600 py-3">THÔNG TIN</strong>
                <ul className="list-disc pl-10 space-y-1">
                  <li className="text-justify leading-7">Được nhận miễn phí Bản tin điện tử phát hành hàng tháng và Tạp chí VCCI-HCM phát hành hàng quý.</li>
                  <li className="text-justify leading-7">Được nhận miễn phí Danh bạ Hội viên VCCI-HCM.</li>
                  <li className="text-justify leading-7">Được nhận các sản phẩm thông tin phục vụ cho doanh nghiệp và các nhà đầu tư.</li>
                </ul>
              </div>
              <div>
                <p className="text-[#063e8e] py-5">
                  Để biết thêm thông tin chi tiết, vui lòng liên hệ:
                </p>
                <p className="text-[#063e8e]">
                  <b>Phòng Hội viên và Đào tạo:</b>
                  <br />
                  <b>C. Thanh Thúy {`-`} DĐ: 0903 909 756</b>
                  <span className="block">
                    Email: luuthanhthuy72@yahoo.com; hoivien@vcci-hcm.org.vn;
                  </span>
                  <span className="block">
                    Điện thoại: 028.3932.0611 {`-`} Fax: 028.3932.5472
                  </span>
                  <span className="block">
                    Địa chỉ: P.306, Lầu 3, Tòa nhà VCCI, 171 Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh
                  </span>
                </p>
              </div>
            </div >
          </main>
          {/* Sidebar */}
          <aside className="space-y-6">
            <EventCalendar />
          </aside>
        </div >
      </div >
    </div >
  );
};

export default Page;