"use client";

import { useState, useEffect } from "react";
import { ChevronsUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed z-50 bottom-17 right-8 bg-[#e8c518] hover:text-[#063e8e] text-white p-3 rounded-lg shadow-lg transition-all duration-500 cursor-pointer ${visible
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-3 pointer-events-none"
        }`}
    >
      <ChevronsUp size={24} />
    </button>
  );
}
