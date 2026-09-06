import type { Video as CmsVideoItem } from "@/api/vcci-news/models/video";

export const PAGE_SIZE = 10;

export const fieldClassName =
  "rounded-xl border-[#063e8e]/15 bg-white text-gray-700 placeholder:text-gray-700 focus-visible:ring-[#063e8e]/30";

export interface VideoFormValues {
  id?: string;
  name: string;
  url: string;
}

export const EMPTY_VIDEO_FORM: VideoFormValues = {
  name: "",
  url: "",
};

export interface VideoFormDialogProps {
  open: boolean;
  initial: CmsVideoItem | null;
  saving: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: VideoFormValues) => Promise<void>;
}
