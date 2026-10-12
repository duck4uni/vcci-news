declare module "d3-zoom" {
  // Minimal surface matching d3-zoom@3; the package ships no bundled types.
  export interface ZoomBehavior {
    filter(predicate: (event: unknown) => boolean): this;
    clickDistance(distance: number): this;
    scaleExtent(extent: [number, number]): this;
    on(type: string, handler: (...args: unknown[]) => void): this;
    (selection: unknown, ...args: unknown[]): void;
    transform(selection: unknown, transform: unknown, point?: unknown, event?: unknown): void;
    scaleBy(selection: unknown, k: number, event?: unknown): void;
  }
  export function zoom(): ZoomBehavior;
}

declare module "d3-org-chart" {
  interface OrgChartLayoutNode {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  interface OrgChartLayoutBindings {
    nodeLeftX(node: OrgChartLayoutNode): number;
    nodeRightX(node: OrgChartLayoutNode): number;
    nodeTopY(node: OrgChartLayoutNode): number;
    nodeBottomY(node: OrgChartLayoutNode): number;
  }

  export class OrgChart<T> {
    container(container: HTMLElement): this;
    data(data: T[]): this;
    nodeId(accessor: (node: T) => string): this;
    parentNodeId(accessor: (node: T) => string | null): this;
    nodeWidth(accessor: (node: { depth: number; data: T }) => number): this;
    nodeHeight(accessor: (node: { depth: number; data: T }) => number): this;
    childrenMargin(accessor: (node: unknown) => number): this;
    siblingsMargin(accessor: (node: unknown) => number): this;
    neighbourMargin(accessor: (nodeA: unknown, nodeB: unknown) => number): this;
    compact(compact: boolean): this;
    duration(duration: number): this;
    nodeContent(content: (node: { data: T }) => string): this;
    onNodeClick(callback: (node: { data: T }) => void): this;
    onExpandOrCollapse(callback: (node: { data: T }) => void): this;
    setActiveNodeCentered(value: boolean): this;
    setExpanded(id: string, expanded?: boolean): this;
    scaleExtent(extent: [number, number]): this;
    createZoom(factory: () => { clickDistance: (distance: number) => unknown; on: (event: string, handler: (...args: unknown[]) => void) => unknown; scaleExtent: (extent: [number, number]) => unknown }): this;
    initialExpandLevel(level: number): this;
    render(): this;
    svgWidth(width: number): this;
    svgHeight(height: number): this;
    fit(options?: { animate?: boolean; scale?: boolean }): this;
    getChartState(): {
      root: { descendants(): OrgChartLayoutNode[] } | null;
      layout: string;
      layoutBindings: Record<string, OrgChartLayoutBindings>;
      svgWidth: number;
      svgHeight: number;
    };
    clear(): this;
  }
}
