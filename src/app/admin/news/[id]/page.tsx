import { AdminNewsForm } from "@/components/admin/news-form";

interface AdminNewsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminNewsDetailPage({
  params,
}: AdminNewsDetailPageProps) {
  const { id } = await params;

  return <AdminNewsForm newsId={id} />;
}
