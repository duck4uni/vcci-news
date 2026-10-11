declare module "d3-org-chart" {
  export class OrgChart<T> {
    container(container: HTMLElement): this;
    data(data: T[]): this;
    nodeId(accessor: (node: T) => string): this;
    parentNodeId(accessor: (node: T) => string | null): this;
    nodeWidth(accessor: (node: { depth: number; data: T }) => number): this;
    nodeHeight(accessor: (node: { depth: number; data: T }) => number): this;
    childrenMargin(accessor: (node: unknown) => number): this;
    siblingsMargin(accessor: (node: unknown) => number): this;
    compact(compact: boolean): this;
    duration(duration: number): this;
    nodeContent(content: (node: { data: T }) => string): this;
    onNodeClick(callback: (node: { data: T }) => void): this;
    setExpanded(id: string, expanded?: boolean): this;
    scaleExtent(extent: [number, number]): this;
    initialExpandLevel(level: number): this;
    render(): this;
    fit(options?: { animate?: boolean; scale?: boolean }): this;
    clear(): this;
  }
}
