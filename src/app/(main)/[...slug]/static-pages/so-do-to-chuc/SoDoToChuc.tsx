"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import ListCategory from "@/components/base/list-category";
import { Spinner } from "@/components/ui";
import { useGetApiV10OrgChart } from "@/api/vcci-news/endpoints/org-chart";
import { buildDynamicCategoryMenu } from "../../templates/data";
import type { DynamicCategoryRouteItem } from "../../templates/types";

// React Flow cần đo DOM → canvas load ở client (ssr:false).
const OrgChartViewerCanvas = dynamic(
	() => import("./_components/org-chart-viewer-canvas").then((m) => m.OrgChartViewerCanvas),
	{
		ssr: false,
		loading: () => (
			<div className="flex min-h-[480px] items-center justify-center">
				<Spinner />
			</div>
		),
	},
);

const CHART_SLUG = "so-do-to-chuc";

type SoDoToChucProps = {
	category: DynamicCategoryRouteItem | null;
	allCategories: DynamicCategoryRouteItem[];
};

/**
 * Trang xem sơ đồ tổ chức (/so-do-to-chuc).
 * Dữ liệu là document v2 ({ version, nodes, edges }) lưu trong bảng org_charts
 * (bản đã xuất bản), được vẽ/sửa ở /admin/so-do-to-chuc. Viewer chỉ đọc:
 * pan/zoom tự do, không chỉnh sửa được nội dung.
 */
export default function SoDoToChuc({ category, allCategories }: SoDoToChucProps) {
	const categoryMenu = category ? buildDynamicCategoryMenu(category, allCategories) : [];

	const { data, isLoading, isError } = useGetApiV10OrgChart({ slug: CHART_SLUG });

	const document = useMemo(() => {
		const chart = data?.responseData;
		return (chart?.published_snapshot ?? null) as
			| { version: number; nodes: unknown[]; edges: unknown[] }
			| null;
	}, [data]);

	return (
		<div className="min-h-screen bg-white">
			{categoryMenu.length ? <ListCategory categories={categoryMenu} /> : null}

			<div className="container mx-auto px-4 py-6 sm:px-6 lg:px-10 lg:pb-10">
				<section>
					<div className="overflow-hidden rounded-sm border border-[#e1e7ed] bg-[#f7f9fb]">
						{isLoading ? (
							<div className="flex min-h-[480px] items-center justify-center">
								<Spinner />
							</div>
						) : isError || !document ? (
							<div className="flex min-h-[480px] items-center justify-center px-6 text-center text-sm text-slate-500">
								Sơ đồ tổ chức đang được cập nhật. Vui lòng quay lại sau.
							</div>
						) : (
							<div className="h-[calc(100vh-220px)] min-h-[480px] w-full" aria-label="Sơ đồ tổ chức VCCI-HCM">
								<OrgChartViewerCanvas document={document} />
							</div>
						)}
					</div>
				</section>
			</div>
		</div>
	);
}
