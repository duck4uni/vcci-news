import { AdminMemberForm } from "./_components/member-form";

interface AdminMemberDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminMemberDetailPage({ params }: AdminMemberDetailPageProps) {
  const { id } = await params;

  return <AdminMemberForm memberId={id} />;
}
