import React from "react";
import Image from "next/image";
import ListCategory from "../components/list-category";
import EventCalendar from "@/components/base/event-calendar";

export default function page() {
  return (
    <div className="bg-[#f6f6f6]">
      <div className="max-w-[1200px] m-auto flex flex-col gap-5 mb-[50px]">
        <div className="border-[#e5e7f2] border-[1px]">
          <ListCategory />
        </div>
        <div className="w-full flex gap-5 flex-wrap">
          <div className="lg:w-[calc(65%-10px)] w-full border-[#e5e7f2] border-[1px] bg-white p-[30px] flex flex-col gap-[15px]">
            <h1 className="text-[#063e8e] text-[25px] font-semibold">
              Thủ tục cấp C/O
            </h1>
            <div className="w-full h-[1px] bg-[#eeeeee]"></div>
            <div className="text-[#363636]">
              <section className="mb-10">
                <ol className="list-decimal pl-6 space-y-6 text-[16px]">
                  {/* 1. Các bước cần thiết trước khi đề nghị cấp C/O */}
                  <li className="leading-relaxed">
                    <strong>
                      Các bước cần thiết thực hiện trước khi đề nghị cấp C/O:
                    </strong>
                    <ol className="list-decimal pl-6 mt-3 space-y-2">
                      <li>
                        <strong>Bước 1:</strong> Kiểm tra xem sản phẩm có{" "}
                        <strong>xuất xứ thuần túy (xuất xứ toàn bộ)</strong>{" "}
                        theo quy định phù hợp hay không. Nếu không, chuyển sang
                        bước 2;
                      </li>
                      <li>
                        <strong>Bước 2:</strong> Xác định chính xác{" "}
                        <strong>mã số HS của sản phẩm xuất khẩu</strong> (
                        <strong>4 hoặc 6 số H.S đầu</strong> là cơ sở để xác
                        định xuất xứ hàng hóa theo quy định)
                        <sup className="text-[10px] align-super ml-0.5">1</sup>;
                      </li>
                      <li>
                        <strong>Bước 3:</strong> Xác định nước nhập khẩu hàng
                        hóa mà quốc gia đó đã ký{" "}
                        <strong>Hiệp định thương mại tự do (FTA)</strong> với
                        Việt Nam/ASEAN và/hoặc cho Việt Nam hưởng{" "}
                        <strong>ưu đãi thuế quan GSP</strong> hay không. Nếu có,
                        chuyển sang bước 4;
                      </li>
                      <li>
                        <strong>Bước 4:</strong> Kiểm tra xem sản phẩm xuất khẩu
                        có thuộc{" "}
                        <strong>
                          danh mục các công đoạn chế biến đơn giản (không đầy
                          đủ)
                        </strong>{" "}
                        theo quy định phù hợp hay không. Nếu có, sản phẩm đó{" "}
                        <strong>sẽ không có xuất xứ</strong> theo quy định. Nếu
                        không, chuyển tiếp sang bước 5.
                      </li>
                      <li>
                        <strong>Bước 5:</strong> So sánh{" "}
                        <strong>thuế suất</strong> để chọn{" "}
                        <strong>mẫu C/O (nếu có)</strong> để đề nghị cấp nhằm
                        đảm bảo hàng hóa xuất khẩu được hưởng{" "}
                        <strong>mức ưu đãi thuế nhập khẩu thấp nhất</strong>;
                      </li>
                      <li>
                        <strong>Bước 6:</strong> Kiểm tra xem sản phẩm xuất khẩu{" "}
                        <strong>đáp ứng quy định xuất xứ phù hợp</strong> hay
                        không.
                        <br />
                        <em>VD:</em> C/O mẫu A XK sang EU –{" "}
                        <strong>Annex 22-03</strong>, Thụy Sỹ –{" "}
                        <strong>Annex 4</strong>, Japan –{" "}
                        <strong>Annex 5</strong>, … hoặc C/O mẫu B –{" "}
                        <strong>Phụ lục I – Thông tư 05/2018/TT-BCT</strong>
                      </li>
                      <li>
                        <strong>Bước 7:</strong> Nếu sản phẩm{" "}
                        <strong>
                          chưa đáp ứng quy định phù hợp tại bước 6
                        </strong>
                        , vận dụng các{" "}
                        <strong>điều khoản ngoại lệ/đặc biệt</strong> sau:
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          <li>
                            <strong>
                              Quy định vi phạm cho phép (Derogation/Tolerance/De
                              Minimis)
                            </strong>{" "}
                            đối với các nguyên vật liệu hoặc bộ phận không có
                            xuất xứ áp dụng theo tiêu chí “
                            <strong>Chuyển đổi mã số hàng hóa</strong>”;
                          </li>
                          <li>
                            <strong>Quy định cộng gộp song phương</strong>;
                          </li>
                          <li>
                            <strong>Quy định cộng gộp khu vực</strong>;
                          </li>
                          <li>
                            <strong>Quy định cộng gộp khác</strong> và/hoặc các
                            quy định mở rộng liên quan khác.
                          </li>
                        </ul>
                      </li>
                    </ol>
                  </li>

                  {/* 2. Đăng ký hồ sơ thương nhân */}
                  <li className="leading-relaxed">
                    <strong>
                      Đăng ký hồ sơ thương nhân (Điều 13 của NĐ 31/2018/NĐ-CP)
                    </strong>
                    <sup className="text-[10px] align-super ml-0.5">2</sup>:
                    <br />
                    Lập, nộp <strong>1 bộ hồ sơ thương nhân</strong> cho{" "}
                    <strong>Tổ chức cấp C/O</strong> đối với thương nhân đề nghị
                    cấp C/O lần đầu. Hồ sơ thương nhân bao gồm:
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>
                        <strong>Thông tin của thương nhân</strong> (
                        <em>Mẫu VCCI HCM</em>);
                      </li>
                      <li>
                        <strong>
                          Đăng ký mẫu chữ ký của người được ủy quyền ký đơn đề
                          nghị cấp C/O và mẫu dấu
                        </strong>{" "}
                        (<em>Mẫu số 01 của NĐ 31/2018/NĐ-CP</em>);
                      </li>
                      <li>
                        <strong>
                          Danh mục các cơ sở sản xuất của thương nhân
                        </strong>{" "}
                        (<em>Mẫu số 02 của NĐ 31/2018/NĐ-CP</em>);
                      </li>
                      <li>
                        <strong>
                          Bản sao Giấy chứng nhận đăng ký doanh nghiệp
                        </strong>{" "}
                        (<em>Ký, đóng dấu sao y bản chính của thương nhân</em>);
                      </li>
                      <li>
                        <strong>
                          Giấy chứng nhận đã đăng ký mẫu dấu với cơ quan công an
                        </strong>{" "}
                        (<em>nếu có</em>).
                      </li>
                    </ul>
                  </li>

                  {/* 3. Hồ sơ đề nghị cấp C/O mới */}
                  <li className="leading-relaxed">
                    <strong>
                      Hồ sơ đề nghị cấp C/O mới (Điều 15, NĐ 31/2018/NĐ-CP):
                    </strong>
                    <div className="mt-2">
                      <strong>Chứng từ xuất khẩu:</strong>
                      <ul className="list-disc pl-6 mt-1 space-y-1">
                        <li>
                          <strong>Đơn đề nghị cấp C/O</strong> (
                          <em>Mẫu số 4 của NĐ 31/2018/NĐ-CP</em>);
                        </li>
                        <li>
                          <strong>Phiếu ghi chép</strong> (<em>Mẫu VCCI HCM</em>
                          );
                        </li>
                        <li>
                          <strong>
                            Mẫu C/O tương ứng đã được khai hoàn chỉnh
                          </strong>{" "}
                          (<em>thông thường là 1 bản chính và 3 bản copy</em>);
                        </li>
                        <li>
                          <strong>Bản in tờ khai hải quan xuất khẩu</strong> (
                          <em>Có xác nhận của thương nhân</em>);
                        </li>
                        <li>
                          <strong>Bản sao hóa đơn thương mại</strong> (
                          <em>Ký, đóng dấu sao y bản chính của thương nhân</em>
                          );
                        </li>
                        <li>
                          <strong>
                            Bản sao B/L hoặc AWB hoặc chứng từ vận tải tương
                            đương
                          </strong>{" "}
                          (<em>Ký, đóng dấu sao y bản chính của thương nhân</em>
                          ).
                        </li>
                      </ul>
                    </div>
                    <div className="mt-3">
                      <strong>Chứng từ chứng minh nguồn gốc:</strong>
                      <ul className="list-disc pl-6 mt-1 space-y-1">
                        <li>
                          <strong>
                            Bảng kê khai chi tiết hàng hóa xuất khẩu đạt tiêu
                            chí xuất xứ ưu đãi hoặc xuất xứ không ưu đãi
                          </strong>{" "}
                          (
                          <em>
                            Chọn mẫu Bảng kê khai NVL phù hợp: 8 mẫu khác nhau
                          </em>
                          );
                        </li>
                        <li>
                          <strong>
                            Bản khai báo xuất xứ của nhà sản xuất hoặc nhà cung
                            cấp nguyên liệu có xuất xứ hoặc hàng hóa có xuất xứ
                          </strong>{" "}
                          (<em>Phụ lục X của TT 05/2018/TT-BCT</em>);
                        </li>
                        <li>
                          <strong>
                            Tờ khai hải quan nhập khẩu nguyên liệu, phụ liệu
                            dùng để sản xuất ra hàng hóa xuất khẩu
                          </strong>{" "}
                          (
                          <em>
                            trong trường hợp có sử dụng nguyên liệu, phụ liệu
                            nhập khẩu trong quá trình sản xuất
                          </em>
                          ); hợp đồng mua bán hoặc hóa đơn giá trị gia tăng mua
                          bán nguyên liệu, phụ liệu trong nước (
                          <em>
                            trong trường hợp có sử dụng nguyên liệu, phụ liệu
                            mua trong nước trong quá trình sản xuất
                          </em>
                          ); giấy phép xuất khẩu (<em>nếu có</em>); chứng từ,
                          tài liệu cần thiết khác.
                        </li>
                      </ul>
                    </div>
                  </li>

                  {/* 4. Hồ sơ đề nghị cấp lại C/O */}
                  <li className="leading-relaxed">
                    <strong>
                      Hồ sơ đề nghị cấp lại C/O (Điều 18, NĐ 31/2018/NĐ-CP):
                    </strong>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>
                        <strong>Đơn đề nghị cấp C/O</strong> (
                        <em>Mẫu số 4 của NĐ 31/2018/NĐ-CP</em>);
                      </li>
                      <li>
                        <strong>Phiếu ghi chép</strong> (<em>Mẫu VCCI HCM</em>);
                      </li>
                      <li>
                        <strong>
                          Mẫu C/O tương ứng đã được khai hoàn chỉnh
                        </strong>{" "}
                        (<em>thông thường là 1 bản chính và 3 bản copy</em>);
                      </li>
                    </ul>
                    <p className="mt-2">
                      Các trường hợp cấp lại C/O căn cứ vào{" "}
                      <strong>Điều 18 của NĐ 31/2018/NĐ-CP</strong>.
                    </p>
                  </li>

                  {/* 5. Khai C/O qua mạng */}
                  <li className="leading-relaxed">
                    <strong>Khai C/O qua mạng:</strong>
                    <br />
                    Doanh nghiệp khai C/O trên website:{" "}
                    <a
                      href="http://comis.covcci.com.vn"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      http://comis.covcci.com.vn
                    </a>{" "}
                    và thực hiện theo từng bước theo yêu cầu/hướng dẫn tại
                    website.
                    <br />
                    <strong>Lưu ý:</strong> Trước khi khai C/O qua mạng, doanh
                    nghiệp cần{" "}
                    <strong>
                      đăng ký hồ sơ thương nhân với chữ ký số được kích hoạt
                    </strong>{" "}
                    trên trang web:{" "}
                    <a
                      href="http://comis.covcci.com.vn"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      http://comis.covcci.com.vn
                    </a>
                  </li>
                </ol>

                {/* Chú thích cuối trang */}
                <div className="mt-6 pt-4 text-sm text-gray-700">
                  <div className="h-[1px] w-[170px] bg-black mb-3"></div>
                  <p className="text-[16px] italic">
                    <sup className="text-[10px] align-super">1</sup> Việc khai
                    báo thiếu chính xác mã HS của sản phẩm sẽ dẫn đến khả năng
                    từ chối cấp C/O tại Việt Nam hoặc bị từ chối tiếp nhận C/O
                    của hải quan nước nhập khẩu.
                  </p>
                  <p className="text-[16px] italic">
                    <sup className="text-[10px] align-super">2</sup> Doanh
                    nghiệp đề nghị cấp C/O lần đầu hoặc thông tin của doanh
                    nghiệp được thay đổi hoặc cập nhật 2 năm/lần theo quy định.
                  </p>
                </div>
              </section>
            </div>
          </div>
          <div className="lg:w-[calc(35%-10px)] w-full ">
            <EventCalendar />
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
