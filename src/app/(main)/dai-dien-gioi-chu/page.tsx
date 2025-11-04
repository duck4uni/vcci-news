"use client"

// Core

import Image from "next/image";
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ListCategory from "./components/list-category";
import ListFilter from "./components/list-filter";
import parse from "html-react-parser";
import { SAMPLE_HTML } from "./lib/sampleHtml";
import { PATHS } from "@constants/paths";
import { OWNER_REPRESENTATIVES_CATEGORIES } from "@constants/categories";

const Page = () => {
  const router = useRouter()

  useEffect(() => {
    const firstHref = `${PATHS.ownerRepresentatives}/chuc-nang-dai-dien-nguoi-su-dung-lao-dong`
    router.push(firstHref)
  }, [router])

  return (
    <div className="min-h-screen w-full container mx-auto p-4">
      <div className="w-full flex flex-col gap-5">
  <ListCategory categories={OWNER_REPRESENTATIVES_CATEGORIES} />
      </div>
    </div>
  );
};

export default Page;
