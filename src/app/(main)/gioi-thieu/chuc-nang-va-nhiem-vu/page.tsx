'use client'
import React from "react";
import ListCategory from "../components/list-category";
import EventCalendar from "../components/event-calendar";
import ImageGallery from "../components/image-gallery";

const Page = () => {

  const images = [
    '/gioi-thieu/chuc-nang-nhiem-vu/qddt_01.jpg',
    '/gioi-thieu/chuc-nang-nhiem-vu/qddt_02.jpg',
    '/gioi-thieu/chuc-nang-nhiem-vu/qddt_03.jpg',
    '/gioi-thieu/chuc-nang-nhiem-vu/qddt_04.jpg',
    '/gioi-thieu/chuc-nang-nhiem-vu/qddt_05.jpg',
    '/gioi-thieu/chuc-nang-nhiem-vu/qddt_06.jpg',
    '/gioi-thieu/chuc-nang-nhiem-vu/qddt_07.jpg',
    '/gioi-thieu/chuc-nang-nhiem-vu/qddt_08.jpg',
    '/gioi-thieu/chuc-nang-nhiem-vu/qddt_09.jpg',
    '/gioi-thieu/chuc-nang-nhiem-vu/qddt_10.jpg',
    '/gioi-thieu/chuc-nang-nhiem-vu/qddt_11.jpg',
    '/gioi-thieu/chuc-nang-nhiem-vu/qddt_12.jpg',
    '/gioi-thieu/chuc-nang-nhiem-vu/qddt_13.jpg',
    '/gioi-thieu/chuc-nang-nhiem-vu/qddt_14.jpg',
    '/gioi-thieu/chuc-nang-nhiem-vu/qddt_15.jpg',
    '/gioi-thieu/chuc-nang-nhiem-vu/qddt_16.jpg',
    '/gioi-thieu/chuc-nang-nhiem-vu/qddt_17.jpg',
    '/gioi-thieu/chuc-nang-nhiem-vu/qddt_18.jpg',
    '/gioi-thieu/chuc-nang-nhiem-vu/qddt_19.jpg',
  ];

  return (
    <div className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-0 pb-4">
      <div className="w-full flex flex-col gap-5">
        <ListCategory />
        {/* Main content */}
        <main className="lg:col-span-2 bg-white border rounded-md py-10 px-5 md:px-10 xl:px-50 text-justify">
          <h1 className="text-2xl font-bold text-[#153e8e]">Chức năng và Nhiệm vụ</h1>
          <hr className="my-5" />
          <div className="flex flex-col justify-center items-center">
            <div className="max-w-5xl mb-5 mx-auto space-y-10">
              {/* chức năng */}
              <section>
                <h2 className="text-xl sm:text-2xl mb-4">Chức năng</h2>
                <p className="mb-4">
                  Liên đoàn Thương mại và Công nghiệp Việt Nam có các chức năng sau:
                </p>
                <ol className="list-decimal list-inside pl-5 sm:pl-6 md:pl-8 space-y-2">
                  <li>Đại diện để thúc đẩy và bảo vệ quyền lợi hợp pháp, chính đáng của cộng đồng doanh nghiệp Việt Nam trong các quan hệ trong nước và quốc tế;</li>
                  <li>Thúc đẩy sự phát triển của cộng đồng doanh nghiệp; xúc tiến và hỗ trợ các hoạt động thương mại, đầu tư, hợp tác khoa học – công nghệ và các hoạt động kinh doanh khác của cộng đồng doanh nghiệp ở Việt Nam và nước ngoài; xúc tiến, thúc đẩy xây dựng mối quan hệ lao động hài hòa trong các doanh nghiệp.</li>
                </ol>
              </section>

              {/* nhiệm vụ */}
              <section>
                <h2 className="text-xl sm:text-2xl mb-4">Nhiệm vụ</h2>
                <p className="mb-4">
                  Liên đoàn Thương mại và Công nghiệp Việt Nam có các nhiệm vụ sau:
                </p>
                <ol className="list-decimal list-inside pl-5 sm:pl-6 md:pl-8 space-y-2">
                  <li>Tập hợp, nghiên cứu thực trạng và kiến nghị với Đảng và Nhà nước các vấn đề về pháp luật, chính sách, chiến lược phát triển kinh tế – xã hội nhằm cải thiện môi trường kinh doanh và xây dựng quan hệ lao động hài hòa; tổ chức các diễn đàn, đối thoại, các cuộc tiếp xúc, làm đầu mối liên kết các doanh nghiệp, làm cầu nối giữa cộng đồng doanh nghiệp với các cơ quan Đảng, Nhà nước và với các tổ chức hữu quan khác ở trong và ngoài nước để trao đổi thông tin, ý kiến và đề xuất các giải pháp xử lý vướng mắc, hoàn thiện chính sách, pháp luật liên quan đến doanh nghiệp, môi trường kinh doanh và quan hệ lao động.</li>
                  <li>Đại diện cho cộng đồng doanh nghiệp tham gia vào quá trình xây dựng ban hành văn bản quy phạm pháp luật có liên quan đến doanh nghiệp, hoạt động kinh doanh và quan hệ lao động dưới các hình thức khác nhau theo quy định hiện hành.</li>
                  <li>Là đầu mối tập hợp thông tin, ý kiến của cộng đồng doanh nghiệp, tổ chức và tham gia quá trình tham vấn với các đoàn đàm phán về kinh tế, thương mại; tham gia với cơ quan Nhà nước có thẩm quyền trong quá trình đàm phán, ký kết, gia nhập, phê chuẩn, thực thi các điều ước quốc tế có liên quan tới kinh tế, thương mại; hỗ trợ cộng đồng doanh nghiệp trong hội nhập kinh tế quốc tế, đặc biệt là các vấn đề liên quan đến thực thi các điều ước quốc tế về kinh tế, thương mại mà Việt Nam là thành viên; tham gia tổ chức các đoàn doanh nghiệp tháp tùng lãnh đạo Đảng, Nhà nước; tổ chức các Diễn đàn doanh nghiệp Việt Nam, Hội đồng doanh nghiệp Việt Nam với doanh nghiệp các nước và các hoạt động xúc tiến khác nhằm mở rộng quan hệ thương mại, đầu tư quốc tế.</li>
                  <li>Thực hiện vai trò của tổ chức đại diện ở Trung ương của người sử dụng lao động Việt Nam tham gia vào các thiết chế ba bên về quan hệ lao động, hướng dẫn, hỗ trợ xây dựng và liên kết tổ chức của người sử dụng lao động ở cấp ngành và địa phương; phối hợp với tổ chức đại diện người lao động và các cơ quan, đơn vị hữu quan để hỗ trợ doanh nghiệp, giới sử dụng lao động xây dựng quan hệ lao động hài hòa, ổn định và tiến bộ theo quy định hiện hành.</li>
                  <li>Tiến hành những hoạt động để bảo vệ quyền lợi hợp pháp của cộng đồng doanh nghiệp trong các quan hệ kinh doanh trong nước và quốc tế; tư vấn và tham gia hỗ trợ giải quyết các vướng mắc, kiến nghị của cộng đồng doanh nghiệp với các cơ quan quản lý trong quá trình kinh doanh và thực thi pháp luật.</li>
                  <li>Tổ chức tuyên truyền, phổ biến, tư vấn thực thi chính sách, pháp luật; phổ biến, cung cấp, hỗ trợ thông tin kinh doanh, khoa học kỹ thuật cho cộng đồng doanh nghiệp.</li>
                  <li>Tổ chức vận động cộng đồng doanh nghiệp nâng cao trách nhiệm xã hội, xây dựng đạo đức và văn hóa kinh doanh, bảo vệ môi trường và tham gia các hoạt động xã hội khác liên quan tới hoạt động của Phòng Thương mại và Công nghiệp Việt Nam phù hợp với quy định của pháp luật.</li>
                  <li>Hỗ trợ việc thành lập, phối hợp nâng cao năng lực hoạt động và liên kết hệ thống các hiệp hội doanh nghiệp trong cả nước.</li>
                  <li>Hợp tác với các tổ chức, đơn vị hữu quan trong nước; hợp tác với các tổ chức của cộng đồng doanh nghiệp ở nước ngoài, ký, thực hiện các thỏa thuận hợp tác quốc tế, tham gia các tổ chức quốc tế phù hợp với quy định của pháp luật.</li>
                  <li>Tổ chức đào tạo để phát triển, bồi dưỡng nguồn nhân lực cho các doanh nghiệp, hiệp hội doanh nghiệp, nâng cao năng lực quản lý, kinh doanh cho các doanh nhân, xây dựng đội ngũ doanh nhân năng động, hiệu quả.</li>
                  <li>Tiến hành các hoạt động nhằm xây dựng, quảng bá thương hiệu và nâng cao uy tín hàng hóa, dịch vụ, cộng đồng doanh nghiệp và môi trường kinh doanh tại Việt Nam.</li>
                  <li>Tổ chức các hoạt động hỗ trợ phát triển kinh doanh; hỗ trợ doanh nghiệp tiếp cận các nguồn lực phát triển; hỗ trợ doanh nghiệp phát triển quan hệ kinh doanh và đầu tư ở trong và ngoài nước thông qua các biện pháp như: kết nối và giới thiệu bạn hàng, cung cấp thông tin, hướng dẫn và tư vấn cho doanh nghiệp, tổ chức nghiên cứu, khảo sát thị trường, hội thảo, hội nghị, hội chợ, triển lãm, quảng cáo và các hoạt động xúc tiến thương mại và đầu tư khác ở trong nước và nước ngoài theo quy định của pháp luật.</li>
                  <li>Tổ chức nghiên cứu, thử nghiệm, triển khai, chuyển giao các mô hình kinh doanh mới hỗ trợ phát triển doanh nghiệp, hiệp hội doanh nghiệp; thực hiện các đề tài, nghiên cứu, điều tra… về năng lực cạnh tranh, lao động và các nội dung khác nhằm nâng cao năng lực cạnh tranh và phát triển doanh nghiệp, hiệp hội doanh nghiệp.</li>
                  <li>Chủ trì hoặc phối hợp tổ chức thực hiện các hoạt động tôn vinh, khen thưởng doanh nghiệp, doanh nhân, các đơn vị, cá nhân có đóng góp lớn vào sự phát triển của cộng đồng doanh nghiệp và nền kinh tế theo quy định của pháp luật.</li>
                  <li>Hỗ trợ đăng ký và bảo hộ quyền sở hữu trí tuệ và chuyển giao công nghệ ở Việt Nam và ở nước ngoài theo quy định.</li>
                  <li>Cấp giấy chứng nhận xuất xứ cho hàng hóa xuất khẩu của Việt Nam theo ủy quyền của cơ quan Nhà nước có thẩm quyền; xác nhận các trường hợp bất khả kháng và chứng nhận, xác nhận các giấy tờ cần thiết khác trong hoạt động thương mại theo yêu cầu tự nguyện của các bên trong giao dịch hoặc theo yêu cầu, ủy quyền của các cơ quan, tổ chức có thẩm quyền ở trong và ngoài nước.</li>
                  <li>Hỗ trợ các doanh nghiệp trong và ngoài nước giải quyết bất đồng, tranh chấp thông qua thương lượng, hòa giải hoặc trọng tài phù hợp với quy định của pháp luật.</li>
                  <li>Thực hiện các nhiệm vụ khác mà cơ quan Nhà nước giao hoặc ủy quyền.</li>
                </ol>
              </section>
            </div>
            <p className="mb-4 font-bold">
              ĐIỀU LỆ VCCI:
            </p>
            <div className="pb-5 w-full">
              <ImageGallery images={images} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
