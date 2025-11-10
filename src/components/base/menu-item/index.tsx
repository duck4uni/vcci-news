import Link from "next/link";

type MenuItemProps = {
  title: string;
  link?: string;
  items: { title: string; link: string }[];
};

const MenuItem = ({ title, link, items }: MenuItemProps) => {
  return (
    <div className="group relative">
      <Link
        href={`${link || ""}`}
        className="px-3 py-5 text-[16px] font-semibold text-[#124588] hover:text-[#E8C518] transition block"
      >
        {title}
      </Link>

      {/* Dropdown */}
      <div className="absolute left-0 top-full hidden group-hover:block bg-[#124588]/98 text-white text-[14px] font-medium min-w-[220px] shadow-lg">
        {items.map((item, i) => (
          <Link
            key={i}
            href={`${item.link}`}
            className="block px-5 py-3 hover:bg-[#e8c518]/80 cursor-pointer whitespace-nowrap transition"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MenuItem;
