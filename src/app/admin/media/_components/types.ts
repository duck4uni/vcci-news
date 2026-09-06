export const PAGE_SIZE = 10;

export type MediaFormValues = {
  file: File | null;
  name: string;
  previewUrl: string;
};

export const EMPTY_MEDIA_FORM: MediaFormValues = {
  file: null,
  name: "",
  previewUrl: "",
};

export const inputClassName =
  "rounded-2xl border-[#063e8e]/15 bg-white text-gray-700 shadow-sm placeholder:text-gray-400 focus-visible:ring-[#063e8e]/20";
