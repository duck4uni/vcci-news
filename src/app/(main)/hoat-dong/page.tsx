"use client";
import React, { useEffect } from "react";
import ListCategory from "@app/dai-dien-gioi-chu/components/list-category";
import { PATHS } from "@constants/paths";
import { EVENT_CATEGORIES } from "@constants/categories";
import { useRouter } from "next/navigation";
// ...existing code...
export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const firstHref = `${PATHS.event}/su-kien`;
    router.push(firstHref);
  }, [router]);
  return (
    <div className="min-h-screen container mx-auto p-4">
      <div className="w-full flex flex-col gap-5">
  <ListCategory categories={EVENT_CATEGORIES} />
      </div>
    </div>
  );
}
