"use client";
import React, { ReactNode, useRef, useState } from "react";
import {
  Facebook,
  Linkedin,
  Mail,
  MailCheck,
  MapPin,
  Phone,
  Printer,
  Twitter,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import vietnamMap from "@/assets/vietnam-map-white.png.webp";

function footer() {
  const emailRef = useRef<HTMLInputElement>(null);
  const checkBoxRef = useRef<HTMLInputElement>(null);
  const [emailError, setEmailError] = useState(false);
  const [chechError, setCheckError] = useState(false);

  const handleSubmit = () => {
    if (!checkBoxRef.current?.checked) {
      setCheckError(true);
    } else {
      setCheckError(false);
    }
    if (emailRef.current?.value === "") {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };
  return (
    <div className="overflow-hidden">
      <div className="p-5 bg-[#e3e3e3]">
        <div className="container w-full flex m-auto flex-wrap relative">
          <div className="z-10 w-full lg:w-1/3 flex flex-col gap-5 p-5">
            <h2 className="text-[#063E8E] text-[20px] font-[500]">
              ĐĂNG KÝ NHẬN THÔNG TIN VCCI
            </h2>
            <div className="h-[1px] w-15 bg-[#063e8e]"></div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <input
                  ref={emailRef}
                  className="h-13 px-3 outline-hidden bg-white"
                  type="email"
                  placeholder="Nhập email của bạn"
                />
                <div
                  onClick={handleSubmit}
                  className="group w-25 h-13 flex items-center justify-center cursor-pointer bg-white text-[#063e8e]"
                >
                  <Mail size={23} className="group-hover:hidden" />
                  <MailCheck size={23} className="group-hover:block hidden" />
                </div>
              </div>
              {emailError && (
                <p className="text-[#F56C6C] text-[12px]">Thông tin bắt buộc</p>
              )}
              <div className="flex items-center gap-2">
                <input ref={checkBoxRef} type="checkbox" id="check" />
                <label
                  className="text-[14px] font-[400] text-[#636363]"
                  htmlFor="check"
                >
                  Đồng ý với Điều khoản nhận email
                </label>
              </div>
              {chechError && (
                <p className="text-[#F56C6C] text-[12px]">
                  Bạn cần đồng ý với Điều khoản nhận email
                </p>
              )}
            </div>
          </div>
          <div className="w-full lg:w-1/3 flex flex-col gap-5 p-5">
            <h2 className="text-[#063E8E] text-[20px] font-[500]">LIÊN HỆ</h2>
            <div className="h-[1px] w-15 bg-[#063e8e]"></div>
            <div className="flex flex-col gap-2">
              <p className="text-[14px] font-[600] text-[#363636]">
                LIÊN ĐOÀN THƯƠNG MẠI & CÔNG NGHIỆP VIỆT NAM - CHI NHÁNH KHU VỰC
                THÀNH PHỐ HỒ CHÍ MINH
              </p>
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-[16px] text-[#363636] font-[500]">
                  <MapPin size={16} className="text-[#124588]" />
                  <span>171 Võ Thị Sáu, Phường Xuân Hoà, TP. HCM</span>
                </div>
                <div className="flex items-center gap-2 text-[16px] text-[#363636] font-[500]">
                  <Phone size={16} className="text-[#124588]" />
                  <span>+84 28 3932 6598</span>
                </div>
                <div className="flex items-center gap-2 text-[16px] text-[#363636] font-[500]">
                  <Printer size={16} className="text-[#124588]" />
                  <span>+84 28 3932 5472</span>
                </div>
                <div className="flex items-center gap-2 text-[16px] text-[#363636] font-[500]">
                  <Mail size={16} className="text-[#124588]" />
                  <a href="mailto:info@vcci-hcm.org.vn">info@vcci-hcm.org.vn</a>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/3 flex flex-col gap-5 p-5">
            <h2 className="text-[#063E8E] text-[20px] font-[500]">KẾT NỐI</h2>
            <div className="h-[1px] w-15 bg-[#063e8e]"></div>
            <iframe
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FVCCIHCMC%3Fref%3Dembed_page&tabs=&width=340&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false"
              width="340"
              height="130"
              style={{ border: "none", overflow: "hidden" }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            ></iframe>
            <div className="flex gap-3 mt-5">
              <a
                href="https://www.facebook.com/VCCIHCMC/"
                target="_blank"
                className=" h-[42px] w-[42px] bg-[#124588] text-white rounded-full flex items-center justify-center hover:opacity-90 transition"
              >
                <Facebook size={21} />
              </a>
              <a
                href="https://twitter.com/VCCI_HCM"
                target="_blank"
                className=" h-[42px] w-[42px] bg-[#124588] text-white rounded-full flex items-center justify-center hover:opacity-90 transition"
              >
                <Twitter size={21} />
              </a>
              <a
                href="https://www.youtube.com/user/VCCIHCMC"
                target="_blank"
                className=" h-[42px] w-[42px] bg-[#124588] text-white rounded-full flex items-center justify-center hover:opacity-90 transition"
              >
                <Youtube size={21} />
              </a>
              <a
                href="https://www.linkedin.com/company/vietnam-chamber-of-commerce-and-industry-ho-chi-minh-city-branch-vcci-hcm-?trk=biz-companies-cym"
                target="_blank"
                className=" h-[42px] w-[42px] bg-[#124588] text-white rounded-full flex items-center justify-center hover:opacity-90 transition"
              >
                <Linkedin size={21} />
              </a>
            </div>
          </div>
          <div className="z-0 absolute -left-20 -top-30 hidden lg:block">
            <Image
              className="size-[580px] object-contain"
              src={vietnamMap}
              alt=""
            />
          </div>
          {[
            { left: "83px", top: "50px" },
            { left: "230px", top: "175px" },
            { left: "172px", top: "330px" },
            { left: "100px", top: "275px" },
          ].map((pos, i) => (
            <div
              key={i}
              className="hidden lg:block absolute w-1.5 h-1.5 bg-yellow-400 rounded-full footer-bg-pin footer-bg-pin-vis"
              style={{ ...pos }}
            />
          ))}
        </div>
      </div>
      <div className="bg-[#032248] h-[80px] flex items-center justify-center">
        <div className="max-w-[1200px] w-full p-5">
          <p className="text-[14px] text-white">
            © Bản quyền VCCI-HCM | All rights reserved
          </p>
        </div>
      </div>
      <style jsx>{`
        @keyframes newpulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(10);
            opacity: 0;
          }
        }

        .footer-bg-pin {
          position: absolute; /* chỉnh lại absolute để không bị ảnh hưởng flow */
          z-index: 2;
          width: 6px;
          height: 6px;
          background-color: #facc15; /* màu vàng */
          border-radius: 50%;
        }

        .footer-bg-pin::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          transform-origin: center center; /* giữ gợn sóng ở tâm */
          animation: newpulse 2s infinite ease-in-out;
          z-index: -1;
        }
      `}</style>
    </div>
  );
}

export default footer;
