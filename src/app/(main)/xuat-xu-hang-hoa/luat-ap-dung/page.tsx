import React from "react";
import Image from "next/image";
import ListCategory from "../components/list-category";
import Calendar from "../components/Calendar";

export default function page() {
  return (
    <div className="bg-[#f6f6f6]">
      <div className="container m-auto flex flex-col gap-5 mb-[50px]">
        <div className="border-[#e5e7f2] border-[1px]">
          <ListCategory />
        </div>
        <div className="w-full flex gap-5 flex-wrap">
          <div className="lg:w-[calc(65%-10px)] w-full border-[#e5e7f2] border-[1px] bg-white p-[30px] flex flex-col gap-[15px]">
            <h1 className="text-[#063e8e] text-[25px] font-semibold">
              Luật áp dụng về C/O
            </h1>
            <div className="w-full h-[1px] bg-[#eeeeee]"></div>
            <div className="text-[#363636]">
              <section className="mb-10">
                <p className="mb-6 leading-relaxed text-[16px]">
                  <strong>Xuất xứ hàng hóa</strong> là các quy tắc và yêu cầu
                  liên quan để xác định hàng hóa có nguồn gốc tại một nước hoặc
                  vùng lãnh thổ cụ thể theo từng{" "}
                  <strong>quy tắc xuất xứ cụ thể</strong>. Các quy tắc xuất xứ
                  chỉ áp dụng đối với <strong>hàng hóa hữu hình</strong> được
                  phân loại trong <strong>danh mục mã HS</strong> hàng hóa của{" "}
                  <strong>Tổ chức Hải quan Thế giới (WCO)</strong>,{" "}
                  <strong>không áp dụng</strong> để xác định hàng hóa như{" "}
                  <em>
                    dịch vụ, quyền sở hữu trí tuệ, và nguồn gốc của con người
                  </em>
                  .
                </p>

                <ol className="list-decimal pl-6 space-y-4 text-[16px]">
                  <li className="leading-relaxed">
                    <strong>Quy định chung:</strong>
                    <br />
                    <strong>Nghị định số 31/2018/NĐ-CP</strong> ngày 08 tháng 3
                    năm 2018 quy định chi tiết{" "}
                    <strong>Luật Quản lý ngoại thương</strong> về xuất xứ hàng
                    hóa.
                  </li>

                  <li className="leading-relaxed">
                    <strong>
                      Quy tắc xuất xứ không ưu đãi của Việt Nam (C/O mẫu B, mẫu
                      DA59, mẫu Peru, Turkey, …):
                    </strong>
                    <br />
                    <strong>Thông tư 05/2018/TT-BCT</strong> ngày 03 tháng 4 năm
                    2018 của <strong>Bộ Công Thương</strong> (Quy định về xuất
                    xứ hàng hóa).
                  </li>

                  <li className="leading-relaxed">
                    <strong>
                      Quy tắc xuất xứ ưu đãi thuế quan phổ cập – GSP (C/O mẫu
                      A):
                    </strong>
                    <br />
                    <strong>Hệ thống Ưu đãi Thuế quan Phổ cập</strong> hay gọi
                    tắt là{" "}
                    <strong>GSP (Generalized System of Preferences)</strong> là
                    hệ thống ưu đãi thuế quan được các nước giàu hay còn gọi là{" "}
                    <strong>các nước phát triển</strong> dành cho{" "}
                    <strong>
                      các nước đang phát triển và các nước kém phát triển (nước
                      thụ hưởng)
                    </strong>{" "}
                    hưởng ưu đãi về <strong>miễn hoặc giảm thuế</strong>. Hàng
                    hóa xuất khẩu từ các nước thụ hưởng phải đáp ứng đầy đủ các
                    yêu cầu về <strong>quy tắc xuất xứ ưu đãi</strong> theo quy
                    định của nước cho hưởng (EU, Thụy Sỹ, Canada, Nhật Bản, …).
                    <ul className="list-disc pl-6 mt-2 space-y-1 text-[16px]">
                      <li>
                        <em>
                          Quy tắc xuất xứ ưu đãi thuế quan phổ cập (GSP) của
                          Liên minh châu Âu
                        </em>{" "}
                        (
                        <strong>
                          Handbook on The Scheme of European Union
                        </strong>
                        );
                      </li>
                      <li>
                        <em>
                          Quy tắc xuất xứ ưu đãi thuế quan phổ cập (GSP) của Na
                          Uy
                        </em>{" "}
                        (<strong>Handbook on The Scheme of Norway</strong>);
                      </li>
                      <li>
                        <em>
                          Quy tắc xuất xứ ưu đãi thuế quan phổ cập (GSP) của
                          Thụy Sỹ
                        </em>{" "}
                        (<strong>Handbook on The Scheme of Switzerland</strong>
                        );
                      </li>
                      <li>
                        <em>
                          Quy tắc xuất xứ ưu đãi thuế quan phổ cập (GSP) của
                          Nhật Bản
                        </em>{" "}
                        (<strong>Handbook on The Scheme of Japan</strong>);
                      </li>
                      <li>
                        <em>
                          Quy tắc xuất xứ ưu đãi thuế quan phổ cập (GSP) của
                          Canada
                        </em>{" "}
                        (<strong>Handbook on The Scheme of Canada</strong>);
                      </li>
                      <li>
                        <em>
                          Quy tắc xuất xứ ưu đãi thuế quan phổ cập (GSP) của New
                          Zealand
                        </em>{" "}
                        (<strong>Handbook on The Scheme of New Zealand</strong>
                        );
                      </li>
                      <li>
                        <em>
                          Quy tắc xuất xứ ưu đãi thuế quan phổ cập (GSP) của
                          Australia
                        </em>{" "}
                        (<strong>Handbook on The Scheme of Australia</strong>);
                      </li>
                      <li>
                        <em>
                          Quy tắc xuất xứ ưu đãi thuế quan phổ cập (GSP) của Hoa
                          Kỳ
                        </em>{" "}
                        (<strong>Handbook on The Scheme of US</strong>);
                      </li>
                      <li>
                        <em>
                          Quy tắc xuất xứ ưu đãi thuế quan phổ cập (GSP) của Thổ
                          Nhĩ Kỳ
                        </em>{" "}
                        (<strong>Handbook on The Scheme of Turkey</strong>);
                      </li>
                      <li>
                        <em>
                          Quy tắc xuất xứ ưu đãi thuế quan phổ cập (GSP) của
                          Nga, Belarus, Kazakhstan
                        </em>{" "}
                        (
                        <strong>
                          Handbook on The Scheme of Russia-Belarus-Kazakhstan
                        </strong>
                        ).
                      </li>
                    </ul>
                  </li>

                  <li className="leading-relaxed">
                    <strong>
                      Quy tắc xuất xứ trong các Hiệp định thương mại tự do
                      (FTA):
                    </strong>
                    <br />
                    <a
                      href="https://ecosys.gov.vn/Homepage/DocumentView.aspx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      https://ecosys.gov.vn/Homepage/DocumentView.aspx
                    </a>
                  </li>

                  <li className="leading-relaxed">
                    <strong>Quy định khác liên quan:</strong>
                    <ul className="list-disc pl-6 mt-2 space-y-1 text-[16px]">
                      <li>
                        <em>
                          Danh mục hàng hóa xuất, nhập khẩu có hiệu lực từ ngày
                          01/01/2018 – Phân loại HS
                        </em>{" "}
                        (<strong>Thông tư 65/2017/TT-BTC</strong> ngày 26/6/2017
                        của <strong>Bộ Tài Chính</strong>);
                      </li>
                      <li>
                        <em>
                          Quy định về xử phạt vi phạm hành chính trong hoạt động
                          thương mại
                        </em>{" "}
                        (<strong>Nghị định 98/2020/NĐ-CP</strong> ngày 26/8/2020
                        của <strong>Chính phủ</strong>);
                      </li>
                      <li>
                        <em>Kiểm dịch động vật, sản phẩm động vật trên cạn</em>{" "}
                        (<strong>Thông tư 25/2016/TT-BNNPTNT</strong> ngày 30
                        tháng 6 năm 2016);
                      </li>
                      <li>
                        <em>Quy định về kinh doanh xuất khẩu gạo</em> (
                        <strong>Nghị định số 107/2018/ND-CP</strong> ngày
                        15/8/2018 của <strong>Chính phủ</strong>);
                      </li>
                      <li>
                        <em>
                          Quy định Giấy chứng nhận lưu hành tự do (CFS) đối với
                          sản phẩm, hàng hóa xuất khẩu và nhập khẩu
                        </em>{" "}
                        (<strong>Nghị định số 69/2018/NĐ-CP</strong> ngày
                        15/5/2018 của <strong>Chính phủ</strong>);
                      </li>
                      <li>
                        <em>
                          Sửa đổi, bổ sung Thông tư số 28/2015/TT-BCT ngày 20
                          tháng 8 năm 2015 của Bộ trưởng Bộ Công Thương quy định
                          việc thực hiện thí điểm tự chứng nhận xuất xứ hàng hóa
                          trong Hiệp định thương mại hàng hóa ASEAN
                        </em>{" "}
                        (<strong>Thông tư 19/2020/TT-BCT</strong> ngày 14 tháng
                        8 năm 2020);
                      </li>
                      <li>
                        <em>
                          Hướng dẫn chung (Annex II-B) về khai Giấy chứng nhận
                          xuất xứ ICO
                        </em>{" "}
                        (<strong>Quy định số EB 3775/01</strong> ngày 12/4/2001
                        của <strong>Tổ chức Cà phê Quốc tế ICO</strong>);
                        <br />
                        <em>Mã quốc gia xuất khẩu và nhập khẩu cà phê</em> (
                        <strong>Quy định số ICC 102-9</strong> ngày 27/4/2009
                        của ICO);
                        <br />
                        <em>Mã cảng xuất khẩu cà phê</em> (
                        <strong>Quy định số WP Council 174/08 Rev. 1</strong>{" "}
                        ngày 9/9/2009 của ICO);
                        <br />
                        <em>
                          Quy định liên quan khác đối với mặt hàng cà phê
                        </em>{" "}
                        (<strong>Quy định số ED 1918/04</strong> ngày
                        24/5/2004);
                      </li>
                      <li>
                        <em>
                          Giấy chứng nhận cấp cho hàng hóa không đáp ứng quy
                          định xuất xứ
                        </em>{" "}
                        (
                        <strong>
                          Quy định về nội dung xác nhận trên mẫu Giấy chứng
                          nhận-GCN
                        </strong>
                        ).
                      </li>
                    </ul>
                  </li>
                </ol>

                {/* Lưu ý – chỉ phần này dùng text-sm */}
                <div className="mt-6 pt-4 text-sm text-gray-700 italic">
                  <p className="font-medium text-[#363636]">
                    *Lưu ý: Cập nhật thường xuyên các quy định có thể được thay
                    đổi bởi cơ quan chức năng.
                  </p>
                </div>
              </section>
            </div>
          </div>
          <div className="lg:w-[calc(35%-10px)] w-full ">
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
