import ListCategory from "@/components/base/list-category";
import { buildDynamicCategoryMenu } from "../templates/data";
import type { DynamicCategoryRouteItem } from "../templates/types";

type MemberDirectoryProps = {
  category: DynamicCategoryRouteItem | null;
  allCategories: DynamicCategoryRouteItem[];
};

export default function MemberDirectory({ category, allCategories }: MemberDirectoryProps) {
  const categoryMenu = category ? buildDynamicCategoryMenu(category, allCategories) : [];

  return (
    <>
      {categoryMenu.length ? <ListCategory categories={categoryMenu} /> : null}
      <div className="container flex justify-center items-center h-full py-20">
        Danh bạ hội viên đang được xây dựng
      </div>
    </>
  );
}
