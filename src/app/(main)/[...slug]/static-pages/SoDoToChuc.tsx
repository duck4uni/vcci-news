"use client";

import { useEffect, useRef } from "react";
import ListCategory from "@/components/base/list-category";
import { buildDynamicCategoryMenu } from "../templates/data";
import type { DynamicCategoryRouteItem } from "../templates/types";
import { OrgChart } from "d3-org-chart";

type OrgNode = {
  id: string;
  parentId: string | null;
  name: string;
  title: string;
  note?: string;
};

const ORG_DIRECTOR: OrgNode = {
  id: "director",
  parentId: null,
  name: "Trần Ngọc Liêm",
  title: "Giám đốc",
};

const ORG_DEPUTIES: OrgNode[] = [
  { id: "deputy-nam", parentId: ORG_DIRECTOR.id, name: "Nguyễn Hữu Nam", title: "Phó Giám đốc" },
  { id: "deputy-ninh", parentId: ORG_DIRECTOR.id, name: "Bùi Thị Ninh", title: "Phó Giám đốc" },
  { id: "deputy-hue", parentId: ORG_DIRECTOR.id, name: "Nguyễn Thị Huệ", title: "Phó Giám đốc" },
  { id: "deputy-truong", parentId: ORG_DIRECTOR.id, name: "Nguyễn Hữu Trường", title: "Phó Giám đốc" },
  { id: "deputy-huyen", parentId: ORG_DIRECTOR.id, name: "Vũ Thị Thanh Huyền", title: "Phó Giám đốc" },
  { id: "deputy-thoai", parentId: ORG_DIRECTOR.id, name: "Nguyễn Xuân Bích Thoại", title: "Phó Giám đốc" },
];

const ORG_DEPARTMENTS: OrgNode[] = [
  { id: "dept-hoi-vien", parentId: ORG_DIRECTOR.id, name: "Phòng Hội viên Đào tạo và Truyền thông", title: "Trưởng phòng: Nguyễn Đoàn Thông\nPhó trưởng phòng: Bùi Mạnh Hùng" },
  { id: "dept-hanh-chinh", parentId: ORG_DIRECTOR.id, name: "Phòng Hành chính Quản trị", title: "Trưởng phòng: Nguyễn Văn Quân" },
  { id: "dept-tai-chinh-ke-toan", parentId: ORG_DIRECTOR.id, name: "Phòng Tài chính Kế toán", title: "Phó trưởng phòng phụ trách: Bùi Tường Vi\nPhó trưởng phòng: Nguyễn Hữu Nghĩa" },
  { id: "dept-to-chuc-can-bo", parentId: ORG_DIRECTOR.id, name: "Phòng Tổ chức Cán bộ", title: "Trưởng phòng: Lê Thanh Thúy\nPhó trưởng phòng: Trương Thanh Tần" },

  { id: "dept-phap-che-va-chung-tu", parentId: "deputy-nam", name: "Phòng Pháp chế và Xác nhận chứng từ thương mại", title: "Trưởng phòng: Vũ Xuân Hưng\nPhó trưởng phòng: Nguyễn Văn Đức\nPhó trưởng phòng: Nguyễn Khánh Linh" },
  { id: "dept-trung-tam-sme", parentId: "deputy-nam", name: "Trung tâm Hỗ trợ Doanh nghiệp Nhỏ và Vừa", title: "Phó Giám đốc phụ trách: Nguyễn Hữu Nam" },

  { id: "dept-giao-dich", parentId: "deputy-ninh", name: "Phòng Giao dịch Quốc tế", title: "Trưởng phòng: Trần Ngọc Đào\nPhó trưởng phòng: Hồ Ngọc Vinh" },
  { id: "dept-van-phong-gioi", parentId: "deputy-ninh", name: "Văn phòng Giới sử dụng lao động và Doanh nhân nữ", title: "Phó trưởng phòng: Nguyễn Lê Nhật Thanh" },

  { id: "dept-hanh-chinh-co-so-2", parentId: "deputy-hue", name: "Phòng Hành chính Quản trị - Cơ sở 2", title: "Trưởng phòng: Nguyễn Huy Hoàng\nPhó trưởng phòng: Vũ Thị Hiền" },
  { id: "dept-giao-dich-co-so-2", parentId: "deputy-truong", name: "Phòng Giao dịch Quốc tế - Cơ sở 2", title: "Trưởng phòng: Nguyễn Thị Như Quỳnh" },
  { id: "dept-hoi-vien-co-so-2", parentId: "deputy-huyen", name: "Phòng Hội viên Đào tạo và Truyền thông - Cơ sở 2", title: "Trưởng phòng: Đỗ Quang Huy\nPhó trưởng phòng: Nguyễn Đức Hường" },
  { id: "dept-phap-che-chung-tu-co-so-2", parentId: "deputy-thoai", name: "Phòng Pháp chế và Xác nhận chứng từ thương mại - Cơ sở 2", title: "Trưởng phòng: Ma Thị Hương" },
];

type SoDoToChucProps = {
  category: DynamicCategoryRouteItem | null;
  allCategories: DynamicCategoryRouteItem[];
};

export default function SoDoToChuc({ category, allCategories }: SoDoToChucProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const categoryMenu = category ? buildDynamicCategoryMenu(category, allCategories) : [];

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const initiallyCollapsedDepartmentIds = new Set(ORG_DEPARTMENTS.map((department) => department.id));
    const expandedDepartmentDetails = new Set<string>();
    const previousDepartmentByManager = new Map<string, string>();
    const chartData = [ORG_DIRECTOR, ...ORG_DEPUTIES, ...ORG_DEPARTMENTS].map((node) => {
      const managerId = node.parentId;
      if (!initiallyCollapsedDepartmentIds.has(node.id) || !managerId) return node;
      if (managerId !== ORG_DIRECTOR.id && !managerId.startsWith("deputy-")) return node;

      const previousDepartmentId = previousDepartmentByManager.get(managerId);
      previousDepartmentByManager.set(managerId, node.id);
      return previousDepartmentId ? { ...node, parentId: previousDepartmentId, _expanded: true } as OrgNode : node;
    });
    const chart = new OrgChart<OrgNode>()
      .container(container)
      .data(chartData)
      .initialExpandLevel(2)
      .nodeId((node) => node.id)
      .parentNodeId((node) => node.parentId)
      .nodeWidth(() => 260)
      .nodeHeight(({ data }) => {
        const isDepartment = initiallyCollapsedDepartmentIds.has(data.id);
        const showDetails = !isDepartment || expandedDepartmentDetails.has(data.id);
        if (isDepartment && !showDetails) return 82;

        const titleLineCount = data.title.split("\n").reduce((count, line) => count + (line.includes(":") ? 2 : 1), 0);
        return Math.max(118, 82 + titleLineCount * 23 + (data.note ? 20 : 0));
      })
      .childrenMargin(() => 36)
      .siblingsMargin((node) => initiallyCollapsedDepartmentIds.has((node as { data?: OrgNode }).data?.id ?? "") ? 0 : 30)
      .compact(false)
      .duration(350)
      .scaleExtent([0.35, 2.5])
      .onNodeClick((node) => {
        const nodeId = node.data.id;
        if (!initiallyCollapsedDepartmentIds.has(nodeId)) return;
        if (expandedDepartmentDetails.has(nodeId)) {
          expandedDepartmentDetails.delete(nodeId);
        } else {
          expandedDepartmentDetails.add(nodeId);
        }
        chart.render();
      })
      .nodeContent(({ data }) => {
        const featured = data.id === ORG_DIRECTOR.id;
        const escapeHtml = (value: string) =>
          value.replace(/[&<>"']/g, (character) => {
            const entities: Record<string, string> = {
              "&": "&",
              "<": "<",
              ">": ">",
              '"': "&#34;",
              "'": "'",
            };
            return entities[character] ?? character;
          });
        const safeName = escapeHtml(data.name);
        const safeTitle = escapeHtml(data.title);
        const safeNote = data.note ? escapeHtml(data.note) : undefined;
        const isDepartment = initiallyCollapsedDepartmentIds.has(data.id);
        const showDetails = !isDepartment || expandedDepartmentDetails.has(data.id);

        const titleLines = showDetails ? safeTitle.split("\n").map((line) => {
          const separatorIndex = line.indexOf(":");
          if (separatorIndex === -1) return `<div>${line}</div>`;
          const role = line.slice(0, separatorIndex);
          const person = line.slice(separatorIndex + 1).trim();
          return `<div style="margin-top:4px"><span style="font-weight:600">${role}</span><br/><span>${person}</span></div>`;
        }).join("") : "";

        return `<div style="box-sizing:border-box;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:${showDetails ? "18px" : "12px"};border:1px solid ${featured ? "#174a83" : "#d7e0e9"};background:${featured ? "#174a83" : "#fff"};color:${featured ? "#fff" : "#20364b"};text-align:center;box-shadow:0 5px 16px rgba(23,52,83,.08);font-family:Arial,sans-serif;cursor:${isDepartment ? "pointer" : "default"}">
          <div style="font-size:${featured ? "19px" : "16px"};font-weight:700;line-height:1.4">${safeName}</div>
          ${showDetails && safeTitle ? `<div style="margin-top:8px;font-size:14px;line-height:1.55;color:${featured ? "#dbeafe" : "#65778a"}">${titleLines}</div>` : ""}
          ${showDetails && safeNote ? `<div style="margin-top:8px;color:#f4c45f;font-size:10px;font-weight:700;letter-spacing:1px">${safeNote}</div>` : ""}
        </div>`;
      })
      .render()
      .fit({ animate: false, scale: false });

    return () => {
      container.replaceChildren();
      chart.clear();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {categoryMenu.length ? <ListCategory categories={categoryMenu} /> : null}

      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-10 lg:pb-10">
        <section>
          <div className="overflow-auto rounded-sm border border-[#e1e7ed] bg-[#f7f9fb] p-2 sm:p-4">
            <div ref={chartContainerRef} className="min-h-[680px] w-full" aria-label="Sơ đồ tổ chức VCCI-HCM" />
          </div>
        </section>
      </div>
    </div>
  );
}
