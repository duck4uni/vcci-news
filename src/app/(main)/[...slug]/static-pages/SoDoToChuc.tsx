"use client";

import { useEffect, useRef } from "react";
import ListCategory from "@/components/base/list-category";
import { buildDynamicCategoryMenu } from "../templates/data";
import type { DynamicCategoryRouteItem } from "../templates/types";
import { OrgChart } from "d3-org-chart";
import { zoom as d3Zoom } from "d3-zoom";

type OrgNode = {
  id: string;
  parentId: string | null;
  name: string;
  title: string;
  note?: string;
  _expanded?: boolean;
};

type OrgChartHierarchyNode = {
  data: OrgNode;
  children?: OrgChartHierarchyNode[];
  _children?: OrgChartHierarchyNode[];
};

const ORG_DIRECTOR: OrgNode = {
  id: "director",
  parentId: null,
  name: "Trần Ngọc Liêm",
  title: "Giám đốc",
};

const ORG_NODE_WIDTH = 260;
// Estimate rendered height of a node title so cards grow when names + phone numbers wrap.
const estimateTitleHeight = (title: string) => {
  const roleFontSize = 18;
  const personFontSize = 16;
  const availableWidth = ORG_NODE_WIDTH - 36;
  // Rough average glyph width ratio for Arial, tuned conservatively (wider) so wrapped
  // text is over-counted rather than under-counted, preventing clipped cards.
  const charsPerLine = Math.max(8, Math.floor(availableWidth / (personFontSize * 0.62)));

  return title.split("\n").reduce((height, line) => {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) return height + roleFontSize * 1.55;

    const person = line.slice(separatorIndex + 1).trim();
    const personWithPhone = ORG_PHONES[person] ? `${person} - ${ORG_PHONES[person]}` : person;
    const personLines = Math.max(1, Math.ceil(person.length / charsPerLine));
    const personWithPhoneLines = Math.max(1, Math.ceil(personWithPhone.length / charsPerLine));
    return height + 9 + roleFontSize * 1.55 + personWithPhoneLines * personFontSize * 1.5;
  }, 0);
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

const ORG_PHONES: Record<string, string> = {
  "Trần Ngọc Liêm": "0903338350",
  "Nguyễn Hữu Nam": "0907790989",
  "Bùi Thị Ninh": "0938150708",
  "Nguyễn Thị Huệ": "0918904296",
  "Vũ Thị Thanh Huyền": "0907081974",
  "Nguyễn Hữu Trường": "0917688959",
  "Nguyễn Xuân Bích Thoại": "0982459399",
  "Lê Thanh Thúy": "0903789233",
  "Nguyễn Văn Quân": "0983945914",
  "Vũ Xuân Hưng": "0909170171",
  "Nguyễn Văn Đức": "0909497155",
  "Nguyễn Khánh Linh": "0393112520",
  "Nguyễn Đoàn Thông": "0903857520",
  "Bùi Mạnh Hùng": "0877892442",
  "Trần Ngọc Đào": "02839325166",
  "Hồ Ngọc Vinh": "0918866055",
  "Bùi Tường Vi": "0906050580",
  "Nguyễn Hữu Nghĩa": "0982012258",
  "Nguyễn Lê Nhật Thanh": "0903877111",
  "Ma Thị Hương": "0395122922",
  "Đỗ Quang Huy": "0396982299",
  "Nguyễn Huy Hoàng": "0983349447",
  "Nguyễn Thị Quỳnh Như": "0937267286",
  "Nguyễn Thị Như Quỳnh": "0937267286",
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
      return previousDepartmentId ? { ...node, parentId: previousDepartmentId, _expanded: true } : node;
    });
    const chart = new OrgChart<OrgNode>()
      .container(container)
      // Disable all pointer/scroll zoom and pan; fit() is used only for initial centering.
      .createZoom(() => d3Zoom().filter(() => false))
      // Prevent d3-org-chart from auto-centering the clicked node, which shifts the whole board.
      .setActiveNodeCentered(false)
      .data(chartData)
      .initialExpandLevel(3)
      .nodeId((node) => node.id)
      .parentNodeId((node) => node.parentId)
      .nodeWidth(() => 260)
      .nodeHeight(({ data }) => {
        const isDepartment = initiallyCollapsedDepartmentIds.has(data.id);
        const showDetails = !isDepartment || expandedDepartmentDetails.has(data.id);
        if (isDepartment && !showDetails) return 116;

        const titleHeight = estimateTitleHeight(data.title);
        const phoneHeight = ORG_PHONES[data.name] && !data.title.includes(":") ? 26 : 0;
        const departmentExtraHeight = isDepartment ? 56 : 0;
        return Math.max(132, 110 + titleHeight + phoneHeight + (data.note ? 24 : 0) + departmentExtraHeight);
      })
      .childrenMargin(() => 36)
      .siblingsMargin(() => 15)
      .neighbourMargin(() => 40)
      .compact(false)
      .duration(350)
      .scaleExtent([1, 1])
      .onNodeClick((node) => {
        const nodeId = node.data.id;
        if (!initiallyCollapsedDepartmentIds.has(nodeId)) return;
        if (expandedDepartmentDetails.has(nodeId)) {
          expandedDepartmentDetails.delete(nodeId);
        } else {
          expandedDepartmentDetails.add(nodeId);
        }
        syncExpandedFlagsFromHierarchy();
        chart.render();
        adjustSvgHeightToContent();
      })
      // Re-center the whole tree after each expand/collapse so the board stays fixed mid-container.
      .onExpandOrCollapse(() => fitChartToContent(true))
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

        const titleLines = safeTitle.split("\n").map((line) => {
          const separatorIndex = line.indexOf(":");
          if (separatorIndex === -1) return `<div>${line}</div>`;
          const role = line.slice(0, separatorIndex);
          const person = line.slice(separatorIndex + 1).trim();
          const phone = ORG_PHONES[person];
          const personHtml = phone
            ? `${person} - <span style="color:${featured ? "#86efac" : "#16a34a"};font-weight:600">${phone}</span>`
            : person;
          return `<div style="margin-top:9px"><span style="font-weight:600">${role}</span><br/><span style="font-size:16px">${personHtml}</span></div>`;
        }).join("");

        const nodePhone = ORG_PHONES[data.name];

        return `<div style="box-sizing:border-box;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:${showDetails ? "18px" : "12px"};border:1px solid ${featured ? "#174a83" : "#d7e0e9"};background:${featured ? "#174a83" : "#fff"};color:${featured ? "#fff" : "#20364b"};text-align:center;box-shadow:0 5px 16px rgba(23,52,83,.08);font-family:Arial,sans-serif;cursor:${isDepartment ? "pointer" : "default"}">
          <div style="font-size:${featured ? "23px" : "20px"};font-weight:700;line-height:1.4">${safeName}</div>
          ${nodePhone ? `<div style="font-size:16px;font-weight:600;margin-top:2px;color:${featured ? "#86efac" : "#16a34a"}">${nodePhone}</div>` : ""}
          ${showDetails && safeTitle ? `<div style="margin-top:8px;font-size:18px;line-height:1.55;color:${featured ? "#dbeafe" : "#65778a"}">${titleLines}</div>` : ""}
          ${showDetails && safeNote ? `<div style="margin-top:8px;color:#f4c45f;font-size:12px;font-weight:700;letter-spacing:1px">${safeNote}</div>` : ""}
        </div>`;
      })
      .render();

    // Scale the whole diagram into the viewport on every layout change: shrink to fit
    // the widest row, size the svg height to the scaled content so nothing is clipped
    // and no manual height tuning is needed when the data changes.
    const svgElement = container.querySelector("svg");
    const contentBounds = () => {
      const state = chart.getChartState();
      const nodes = state.root?.descendants();
      if (!nodes?.length) return null;
      const bindings = state.layoutBindings[state.layout];
      return {
        svgWidth: state.svgWidth,
        minY: Math.min(...nodes.map((node) => node.y + bindings.nodeTopY(node))),
        maxY: Math.max(...nodes.map((node) => node.y + bindings.nodeBottomY(node))),
        naturalWidth:
          Math.max(...nodes.map((node) => node.x + bindings.nodeRightX(node))) -
          Math.min(...nodes.map((node) => node.x + bindings.nodeLeftX(node))) + 100,
      };
    };
    const applySvgHeight = (height: number) => {
      chart.svgHeight(height);
      svgElement?.setAttribute("height", String(height));
    };
    const fitChartToContent = (animate: boolean) => {
      const bounds = contentBounds();
      if (!bounds) return;
      const naturalHeight = bounds.maxY - bounds.minY + 100;
      const scale = Math.min(1, bounds.svgWidth / bounds.naturalWidth);
      applySvgHeight(Math.ceil(naturalHeight * scale));
      chart.fit({ animate });
    };
    // chart.render() rebuilds visibility from data flags: a node stays visible only while
    // its own _expanded flag is true (expandSomeNodes walks up from flagged nodes), yet the
    // expand button only re-flags the clicked node's children. Re-flag every node to match
    // the currently visible hierarchy before re-rendering so open branches stay open.
    const syncExpandedFlagsFromHierarchy = () => {
      const rootNode = chart.getChartState().root as unknown as OrgChartHierarchyNode | null;
      if (!rootNode) return;
      const walk = (node: OrgChartHierarchyNode, visible: boolean) => {
        node.data._expanded = visible;
        node.children?.forEach((child) => walk(child, visible));
        node._children?.forEach((child) => walk(child, false));
      };
      walk(rootNode, true);
    };

    const adjustSvgHeightToContent = () => fitChartToContent(true);

    fitChartToContent(false);

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
            <div ref={chartContainerRef} className="min-h-[480px] w-full" aria-label="Sơ đồ tổ chức VCCI-HCM" />
          </div>
        </section>
      </div>
    </div>
  );
}
