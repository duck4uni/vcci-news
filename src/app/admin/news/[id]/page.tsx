import { AdminNewsForm } from "@/components/admin/news-form";

interface AdminNewsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    returnTo?: string;
  }>;
}

export default async function AdminNewsDetailPage({
  params,
  searchParams,
}: AdminNewsDetailPageProps) {
  const { id } = await params;
  const { returnTo } = await searchParams;

  return <AdminNewsForm newsId={id} returnPath={returnTo || "/admin/news"} />;
}
