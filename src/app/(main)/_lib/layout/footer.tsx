"use client";
import React, { useRef, useState } from "react";
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

function Footer() {
  const emailRef = useRef<HTMLInputElement>(null);
  const checkBoxRef = useRef<HTMLInputElement>(null);
  const [emailError, setEmailError] = useState(false);
  const [chechError, setCheckError] = useState(false);

  const handleSubmit = () => {
    if (!checkBoxRef.current?.checked) setCheckError(true);
    else setCheckError(false);

    if (emailRef.current?.value === "") setEmailError(true);
    else setEmailError(false);
  };

  return (
    <div className="overflow-hidden w-full">
      <div className="py-5 xl:p-5 bg-[#e3e3e3]">
        <div className="container w-full flex flex-col lg:flex-row m-auto lg:flex-nowrap flex-wrap relative gap-10">
          <div className="z-10 w-full lg:w-1/3 flex flex-col gap-5 p-3 sm:p-5">
            <h2 className="text-[#063E8E] text-[20px] font-bold text-left">
              ĐĂNG KÝ NHẬN THÔNG TIN VCCI
            </h2>
            <div className="h-0.5 w-14 bg-[#063e8e] mx-0"></div>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center w-full">
                <input
                  ref={emailRef}
                  className="h-12 flex-1 px-3 outline-hidden bg-white rounded-md text-[14px] w-full"
                  type="email"
                  placeholder="Nhập email của bạn"
                />
                <button
                  onClick={handleSubmit}
                  className="group w-14 h-12 flex items-center justify-center cursor-pointer bg-white rounded-md text-[#063e8e]"
                >
                  <Mail size={20} className="group-hover:hidden" />
                  <MailCheck size={20} className="group-hover:block hidden" />
                </button>
              </div>
              {emailError && (
                <p className="text-[#F56C6C] text-[12px]">
                  Thông tin bắt buộc
                </p>
              )}
              <div className="flex items-center gap-2">
                <input ref={checkBoxRef} type="checkbox" id="check" />
                <label className="text-[14px] text-[#636363]" htmlFor="check">
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

          <div className="w-full lg:w-1/3 flex flex-col gap-5 p-3 sm:p-5">
            <h2 className="text-[#063E8E] text-[20px] font-bold text-left">
              LIÊN HỆ
            </h2>
            <div className="h-0.5 w-14 bg-[#063e8e] mx-0"></div>

            <p className="text-[14px] font-semibold text-justify text-[#363636]">
              LIÊN ĐOÀN THƯƠNG MẠI & CÔNG NGHIỆP VIỆT NAM - CHI NHÁNH KHU VỰC THÀNH PHỐ HỒ CHÍ MINH
            </p>

            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-2 text-[15px] text-[#363636] font-[500]">
                <MapPin size={16} className="text-[#124588]" />
                <span>171 Võ Thị Sáu, Phường Xuân Hoà, TP. HCM</span>
              </div>
              <div className="flex items-center gap-2 text-[15px] text-[#363636] font-[500]">
                <Phone size={16} className="text-[#124588]" />
                <span>+84 28 3932 6598</span>
              </div>
              <div className="flex items-center gap-2 text-[15px] text-[#363636] font-[500]">
                <Printer size={16} className="text-[#124588]" />
                <span>+84 28 3932 5472</span>
              </div>
              <div className="flex items-center gap-2 text-[15px] text-[#363636] font-[500]">
                <Mail size={16} className="text-[#124588]" />
                <a href="mailto:info@vcci-hcm.org.vn">
                  info@vcci-hcm.org.vn
                </a>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/3 flex flex-col gap-5 p-3 sm:p-5">
            <h2 className="text-[#063E8E] text-[20px] font-bold text-left">
              KẾT NỐI
            </h2>
            <div className="h-[2px] w-14 bg-[#063e8e] mx-0"></div>
            <div className="w-full overflow-hidden rounded-md">
              <iframe
                className="w-full sm:h-[140px]"
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FVCCIHCMC%3Fref%3Dembed_page&tabs=&width=340&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false"
                style={{ border: "none", overflow: "hidden" }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              ></iframe>
            </div>

            <div className="flex gap-3 justify-start">
              {[
                { icon: <Facebook size={20} />, link: "https://www.facebook.com/VCCIHCMC/" },
                { icon: <Twitter size={20} />, link: "https://twitter.com/VCCI_HCM" },
                { icon: <Youtube size={20} />, link: "https://www.youtube.com/user/VCCIHCMC" },
                { icon: <Linkedin size={20} />, link: "https://www.linkedin.com/company/vietnam-chamber-of-commerce-and-industry-ho-chi-minh-city-branch-vcci-hcm-?trk=biz-companies-cym" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.link}
                  target="_blank"
                  className="h-[38px] w-[38px] sm:h-[42px] sm:w-[42px] bg-[#124588] text-white rounded-full flex items-center justify-center hover:opacity-90 transition"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
          <div className="z-0 absolute -left-20 -top-20 hidden xl:block">
            <Image className="size-[500px] object-contain" src={vietnamMap} alt="" />
            <div className="footer-bg-pin" style={{ top: "144px", left: "145px" }}></div>
            <div className="footer-bg-pin" style={{ top: "238px", left: "260px" }}></div>
            <div className="footer-bg-pin" style={{ top: "342px", left: "162px" }}></div>
            <div className="footer-bg-pin" style={{ top: "395px", left: "215px" }}></div>
          </div>
        </div>
      </div>

      <div className="bg-[#032248] h-20 flex items-center justify-center">
        <div className="container w-full p-5 text-left">
          <p className="text-[14px] text-white text-center lg:text-left">
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
          position: absolute;
          z-index: 2;
          width: 6px;
          height: 6px;
          background-color: #facc15;
          border-radius: 50%;
        }
        .footer-bg-pin::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          transform-origin: center;
          animation: newpulse 2s infinite ease-in-out;
          z-index: -1;
        }
      `}</style>
    </div>
  );
}

export default Footer;
