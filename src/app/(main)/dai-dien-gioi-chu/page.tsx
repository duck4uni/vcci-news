// Core

import Image from "next/image";
import ListCategory from "./components/list-category";
import ListFilter from "./components/list-filter";
import parse from "html-react-parser";
import { SAMPLE_HTML } from "./lib/sampleHtml";
import { PATHS } from "@constants/paths";
const Page: React.FC = () => {
  return (
    <div className="min-h-screen w-full container mx-auto p-4">
      <div className="w-full flex flex-col gap-5">
        <ListCategory
          categories={[
            {
              title: "Chức năng Đại diện Người sử dụng lao động",
              href: `${PATHS.ownerRepresentatives}`,
            },
            {
              title: "Sự kiện – Tập huấn NSDLĐ",
              href: `${PATHS.ownerRepresentatives}/tap-huan-nsdld`,
            },
            {
              title: "Tin liên quan",
              href: `${PATHS.ownerRepresentatives}/tin-lien-quan`,
            },
            { title: "Chủ đề", href: `${PATHS.ownerRepresentatives}/chu-de` },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <main className="lg:col-span-2 bg-white border rounded-md p-6">
            <div className="p-7.5 prose tiptap">{parse(SAMPLE_HTML)}</div>
          </main>

          {/* Sidebar */}
          <aside className="space-y-6">
            <ListFilter />

            <div className="bg-white border rounded-md overflow-hidden">
              <div className="w-full h-56 relative bg-gray-100">
                <Image
                  src="/banner.webp"
                  alt="Quảng cáo"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Page;
