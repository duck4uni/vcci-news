"use client";
import React, { useState } from "react";
import ListCategory from "./../components/list-category";
import ListFilter from "./../components/list-filter";
import CardNews from "./../components/card-news";
import { Pagination } from '@components/base/pagination'
import Image from "next/image";
import { useGetNews } from '@api/endpoints/news'
import { GetNewsResponseType } from '@api/types/NewsPage.type'

export default function Page() {
	const [submitSearch] = useState('')
	const [page, setPage] = useState(1)

	const pageSize = 5
	const { data: allData, isLoading } = useGetNews<GetNewsResponseType>({
		pageSize: String(pageSize),
		currentPage: String(page),
		filters: submitSearch ? `title @=${submitSearch}` : undefined,
	})
	return (
		<div className="min-h-screen container mx-auto pb-4">
			<div className="w-full flex flex-col gap-5">
				<ListCategory />
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Main content */}
					<main className="lg:col-span-2 bg-background">
						<div className='pb-5 overflow-hidden'>
							{allData?.responseData.rows.map((news) => (
								<CardNews key={news.id} news={news} />
							))}

							<div className='w-full flex justify-center mt-4'>
								<Pagination
									current={allData?.responseData.currentPage ?? page}
									total={allData?.responseData.totalPages ?? 1}
									onChange={(p) => setPage(p)}
								/>
							</div>
						</div>
					</main>

					{/* Sidebar */}
					<aside className="space-y-6">
						<ListFilter />
					</aside>
				</div>
			</div>
		</div>
	);
}