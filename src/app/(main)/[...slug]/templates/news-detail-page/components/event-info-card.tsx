import dayjs from "dayjs";
import { Calendar, MapPin, Clock, Users, CreditCard } from "lucide-react";
import type { DynamicPostItem } from "@/api/vcci-news/types/post";

const formatDate = (value: string | null) =>
  value ? dayjs(value).format("DD/MM/YYYY") : "";

const formatDateTime = (value: string | null) =>
  value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "";

const isEventOrTraining = (post: DynamicPostItem) => {
  const eventCategories = ["Sự kiện", "Đào tạo", "su-kien", "dao-tao", "su_kien", "dao_tao"];
  return post.categories.some((cat) =>
    eventCategories.some(
      (key) =>
        cat.name.toLowerCase().includes(key.toLowerCase()) ||
        (cat.slug && cat.slug.toLowerCase().includes(key.toLowerCase()))
    )
  );
};

const hasEventInfo = (post: DynamicPostItem) => {
  return (
    post.started_at ||
    post.ended_at ||
    post.registration_deadline ||
    post.location
  );
};

export default function EventInfoCard({ post }: { post: DynamicPostItem }) {
  if (!isEventOrTraining(post) || !hasEventInfo(post)) return null;

  const startedAt = post.started_at;
  const endedAt = post.ended_at;
  const registrationDeadline = post.registration_deadline;

  return (
    <div className="mt-7 rounded-2xl border border-[#e3ebf8] bg-linear-to-br from-[#f8faff] to-white p-5 shadow-[0_8px_24px_rgba(36,70,156,0.1)]">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#24469c]">
          <Calendar className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#24469c]">Thông tin sự kiện</h3>
          <p className="text-xs text-[#7f8eab]">Event Information</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Row 1: Hạn đăng ký | Chi phí */}
        {registrationDeadline && (
          <div className="rounded-xl bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2 text-[#f5a400]">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Hạn đăng ký</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-[#1f3768]">
              {formatDateTime(registrationDeadline)}
            </p>
          </div>
        )}

        <div className="rounded-xl bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2 text-[#24469c]">
            <CreditCard className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Chi phí</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-[#1f3768]">
            {post.participation_fee || "Miễn phí"}
          </p>
        </div>

        {/* Row 2: Ngày bắt đầu/kết thúc | Địa điểm */}
        <div className="rounded-xl bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2 text-[#24469c]">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Thời gian</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-[#1f3768]">
            {startedAt
              ? endedAt
                ? `${formatDate(startedAt)} - ${formatDate(endedAt)}`
                : formatDate(startedAt)
              : endedAt
                ? formatDate(endedAt)
                : "-"}
          </p>
        </div>

        <div className="rounded-xl bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2 text-[#e22f5a]">
            <MapPin className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Địa điểm</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-[#1f3768] line-clamp-2">
            {post.location || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
