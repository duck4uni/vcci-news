import { usePathname } from "next/navigation";
import Link from "next/link";

type MenuItemProps = {
  title: string;
  link?: string;
  items: { title: string; link: string }[];
};

const MenuItem = ({ title, link, items }: MenuItemProps) => {
  const pathname = usePathname();
  const isActive = !!link && (pathname === link || (link !== "/" && pathname.startsWith(link)));

  return (
    <div className="group relative">
      <Link
        href={link ?? "#"}
        className={`px-3 py-5 text-[16px] font-semibold transition block
            ${isActive ? "text-[#E8C518]" : "text-[#124588] hover:text-[#E8C518]"}
      `}
      >
        {title}
      </Link>

      {/* Dropdown */}
      <div className="absolute left-0 top-full hidden group-hover:block bg-[#124588]/98 text-white text-[14px] font-medium min-w-[220px] shadow-lg">
        {items.map((item, i) => {
          const isItemActive = pathname === item.link;
          return (
            <Link
              key={i}
              href={item.link}
              className={`block px-5 py-3 cursor-pointer whitespace-nowrap transition ${isItemActive ? "bg-[#e8c518]/80" : "hover:bg-[#e8c518]/80"
                }`}
            >
              {item.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MenuItem;
