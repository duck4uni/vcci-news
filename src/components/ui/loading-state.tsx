import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showMessage?: boolean;
}

export function LoadingState({ 
  message = "Đang tải dữ liệu...", 
  size = "md",
  className,
  showMessage = true 
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "size-4",
    md: "size-6", 
    lg: "size-8"
  };

  const paddingClasses = {
    sm: "py-6",
    md: "py-8",
    lg: "py-12"
  };

  return (
    <div className={cn("flex justify-center items-center", paddingClasses[size], className)}>
      <Spinner className={sizeClasses[size]} />
      {showMessage && (
        <span className="ml-2 text-gray-600">{message}</span>
      )}
    </div>
  );
}

// Các preset thường dùng
export const LoadingPresets = {
  News: () => <LoadingState message="Đang tải tin tức..." />,
  Search: () => <LoadingState message="Đang tìm kiếm..." />,
  Content: () => <LoadingState message="Đang tải nội dung..." />,
  Data: () => <LoadingState message="Đang tải dữ liệu..." />,
  Members: () => <LoadingState message="Đang tải thông tin hội viên..." />,
  Events: () => <LoadingState message="Đang tải sự kiện..." />,
  Small: (message?: string) => <LoadingState size="sm" message={message} />,
  Large: (message?: string) => <LoadingState size="lg" message={message} />,
};