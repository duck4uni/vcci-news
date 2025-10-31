const MenuItem = ({ title, items }: { title: string; items: string[] }) => (
  <div className="group relative">
    <a
      className="px-3 py-5 text-[16px] font-[600] text-[#124588] hover:text-[#E8C518] transition block"
      href="#"
    >
      {title}
    </a>
    <div className="absolute left-0 top-full hidden group-hover:block bg-[#124588]/98 text-white text-[14px] font-[500] min-w-[220px] shadow-lg">
      {items.map((item, i) => (
        <div
          key={i}
          className="px-5 py-3 hover:bg-[#e8c518]/80 cursor-pointer whitespace-nowrap"
        >
          {item}
        </div>
      ))}
    </div>
  </div>
);

export default MenuItem;
