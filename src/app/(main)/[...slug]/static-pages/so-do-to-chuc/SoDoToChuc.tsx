"use client";

import { useEffect, useRef } from "react";
import ListCategory from "@/components/base/list-category";
import { buildDynamicCategoryMenu } from "../../templates/data";
import type { DynamicCategoryRouteItem } from "../../templates/types";
import { OrgChart } from "d3-org-chart";
import { zoom as d3Zoom } from "d3-zoom";
import {
  ORG_CARDS,
  ORG_CARD_WIDTH,
  estimateOrgCardHeight,
  orgCardHeightKey,
  renderOrgCardContent,
  type OrgCard,
} from "./components/OrgChartCard";

type OrgChartHierarchyNode = {
  data: OrgCard;
  children?: OrgChartHierarchyNode[];
  _children?: OrgChartHierarchyNode[];
};

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

    // Card phòng ban (có departmentTitle): mặc định mở sẵn chi tiết thành viên, click vẫn
    // thu gọn/mở lại được. Các phòng cùng một cấp được nối thành chuỗi qua parentId
    // (previousDepartmentByManager) để đứng cạnh nhau.
    const departmentCardIds = new Set(ORG_CARDS.filter((card) => card.departmentTitle).map((card) => card.id));
    const expandedDepartmentDetails = new Set<string>(
      ORG_CARDS.filter((card) => card.departmentTitle).map((card) => card.id),
    );

    // d3-org-chart bắt buộc biết chiều cao (px) của từng node TRƯỚC khi render để xếp cây
    // và vẽ đường nối — thư viện không tự đo được HTML bên trong foreignObject. Thay vì
    // ước lượng theo số dòng, render thử từng card vào container ẩn offscreen (đúng bề rộng
    // card) rồi lấy offsetHeight chính xác cho cả 2 trạng thái mở/thu. estimateOrgCardHeight
    // chỉ còn là fallback khi chưa có số đo.
    const measuredHeights = new Map<string, number>();
    const probe = document.createElement("div");
    probe.style.cssText = `position:absolute;visibility:hidden;width:${ORG_CARD_WIDTH}px;left:-99999px;top:0`;
    document.body.appendChild(probe);
    try {
      ORG_CARDS.forEach((card) => {
        [true, false].forEach((expanded) => {
          probe.innerHTML = renderOrgCardContent(card, expanded);
          const cardEl = probe.querySelector<HTMLElement>("[data-node-id]");
          if (cardEl?.offsetHeight) measuredHeights.set(orgCardHeightKey(card.id, expanded), cardEl.offsetHeight);
        });
      });
    } finally {
      probe.remove();
    }
    const previousDepartmentByManager = new Map<string, string>();
    const chartData = ORG_CARDS.map((card) => {
      const managerId = card.parentId;
      if (!departmentCardIds.has(card.id) || !managerId) return card;
      if (managerId !== "director" && !managerId.startsWith("deputy-")) return card;

      const previousDepartmentId = previousDepartmentByManager.get(managerId);
      previousDepartmentByManager.set(managerId, card.id);
      return previousDepartmentId ? { ...card, parentId: previousDepartmentId, _expanded: true } : card;
    });
    const chart = new OrgChart<OrgCard>()
      .container(container)
      // Disable all pointer/scroll zoom and pan; fit() is used only for initial centering.
      .createZoom(() => d3Zoom().filter(() => false))
      // Prevent d3-org-chart from auto-centering the clicked node, which shifts the whole board.
      .setActiveNodeCentered(false)
      .data(chartData)
      .initialExpandLevel(3)
      .nodeId((node) => node.id)
      .parentNodeId((node) => node.parentId)
      .nodeWidth(() => ORG_CARD_WIDTH)
      .nodeHeight(({ data }) =>
        measuredHeights.get(orgCardHeightKey(data.id, expandedDepartmentDetails.has(data.id)))
        ?? estimateOrgCardHeight(data, expandedDepartmentDetails.has(data.id)),
      )
      // Gap ngang giữa các cột nhỏ lại để tổng bề rộng sơ đồ gọn, fit() ít phải thu nhỏ,
      // card hiển thị to hơn. childrenMargin (gap dọc giữa 2 tầng) phải đủ rộng để
      // đường nối chéo tách khỏi border các card — chỉ tăng chiều cao, không ảnh hưởng
      // tỉ lệ fit() vì scale tính theo chiều ngang.
      .childrenMargin(() => 56)
      .siblingsMargin(() => 10)
      .neighbourMargin(() => 20)
      .compact(false)
      .duration(350)
      .scaleExtent([1, 1])
      .onNodeClick((node) => {
        const nodeId = node.data.id;
        if (!departmentCardIds.has(nodeId)) return;
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
      .nodeContent(({ data }) => renderOrgCardContent(data, expandedDepartmentDetails.has(data.id)));

    // Đường nối giữa các node: hook linkUpdate của thư viện ("access and modify actual
    // link DOM element in runtime") — mặc định xám #E4E2E9, đổi sang đỏ. Giữ nguyên hành
    // vi highlight (#e27396, nét 5) khi node được highlight lên gốc.
    chart.linkUpdate(function (d) {
      this.setAttribute("stroke", d.data._upToTheRootHighlighted ? "#e27396" : "#ff0000");
      this.setAttribute("stroke-width", d.data._upToTheRootHighlighted ? "5" : "3");
      if (d.data._upToTheRootHighlighted) this.parentElement?.appendChild(this);
    });
    chart.render();

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
