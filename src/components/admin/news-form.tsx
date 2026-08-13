"use client";

import * as React from "react";
import dayjs from "dayjs";
import { ArrowLeft, Check, ChevronsUpDown, Save, Upload, X, Calendar as CalendarIcon, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminImagePicker } from "@/components/admin/image-picker";
import { AdminPostContentEditor } from "@/components/admin/post-content-editor";
import { PostHistoryViewer } from "@/components/admin/post-history-viewer";
import { AdminRichTextEditor } from "@/components/admin/rich-text-editor";
import { SafeNextImage } from "@/components/admin/safe-next-image";
import { PermissionGate } from "@/components/shared/permission-gate";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  type CmsHeaderCategoryItem,
  type CmsTagItem,
  createCmsNewsItem,
  fetchCmsNewsItem,
  fetchCmsNewsItems,
  fetchCmsTags,
  fetchHeaderConfigItems,
  updateCmsNewsItem,
} from "@/lib/api/cms-admin";
import {
  ADMIN_NEWS_TYPE_OPTIONS,
  cloneAdminNewsFormValues,
  type AdminMediaItem,
  type AdminNewsFormValues,
  type AdminNewsImageRef,
  type AdminNewsItem,
  type AdminNewsType,
  resolveAdminNewsType,
  slugifyAdminNews,
} from "@/mockdata/admin-news";
import {
  type HeaderCategoryItem,
  type HeaderCategoryTreeItem,
  buildHeaderCategoryTree,
} from "@/mockdata/header-config";
import { cn } from "@/lib/utils";

interface AdminNewsFormProps {
  newsId?: string;
  presetHeaderCategoryId?: string;
  lockedType?: AdminNewsType;
  returnPath?: string;
}

const fieldClassName =
  "rounded-xl border-[#063e8e]/15 bg-white text-gray-700 placeholder:text-gray-700 focus-visible:ring-[#063e8e]/30";

const readOnlyFieldClassName =
  "rounded-xl border-[#063e8e]/10 bg-[#063e8e]/[0.03] text-gray-700 placeholder:text-gray-700";

const selectTriggerClassName =
  "rounded-xl border-[#063e8e]/15 bg-white text-gray-700 data-[placeholder]:text-gray-700 focus:ring-[#063e8e]/30";

const selectContentClassName = "border-[#063e8e]/15 bg-white text-gray-700";

const selectItemClassName =
  "text-gray-700 focus:bg-[#063e8e]/10 focus:text-[#063e8e]";

const SEARCH_TAG_VISIBLE_LIMIT = 20;

function flattenHeaderTree(
  items: HeaderCategoryTreeItem[],
  depth = 0,
): Array<{
  id: string;
  name: string;
  type: HeaderCategoryItem["type"];
  depth: number;
}> {
  return items.flatMap((item) => [
    { id: item.id, name: item.name, type: item.type, depth },
    ...flattenHeaderTree(item.children, depth + 1),
  ]);
}

function isCategoryCompatible(
  headerType: HeaderCategoryItem["type"],
  postType: AdminNewsType | "",
) {
  if (!postType) return true;
  if (postType === "tintuc") return headerType === "news";
  if (postType === "baiviettrang") return headerType === "page";
  return false;
}

function toImageRef(item: AdminMediaItem): AdminNewsImageRef {
  return {
    id: item.id,
    name: item.name,
    alt: item.alt,
    url: item.url,
  };
}

function formatHeaderCategoryOptionLabel(option: {
  name: string;
  depth: number;
}) {
  return `${"-- ".repeat(option.depth)}${option.name}`;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#063e8e]/15 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-[#063e8e]">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-gray-700">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function NewsFormLoadingState() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-xl bg-[#063e8e]/10" />
      </div>

      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-[#063e8e]/15 bg-white p-5 shadow-sm"
        >
          <div className="mb-4 space-y-2">
            <div className="h-5 w-48 animate-pulse rounded bg-[#063e8e]/10" />
            <div className="h-4 w-72 animate-pulse rounded bg-[#063e8e]/[0.05]" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="h-11 animate-pulse rounded-xl bg-[#063e8e]/[0.05]" />
            <div className="h-11 animate-pulse rounded-xl bg-[#063e8e]/[0.05]" />
            <div className="h-11 animate-pulse rounded-xl bg-[#063e8e]/[0.05] md:col-span-2" />
            <div className="h-40 animate-pulse rounded-2xl bg-[#063e8e]/[0.05] md:col-span-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function HeaderCategoryCombobox({
  value,
  options,
  disabled,
  onChange,
}: {
  value: string;
  options: Array<{
    id: string;
    name: string;
    type: HeaderCategoryItem["type"];
    depth: number;
  }>;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const selectedOption = options.find((option) => option.id === value) ?? null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "h-11 w-full justify-between rounded-xl border-[#063e8e]/15 bg-white px-4 font-normal text-gray-700 hover:bg-white hover:text-gray-700 focus-visible:ring-[#063e8e]/30",
            !selectedOption && "text-gray-700",
          )}
        >
          <span className="truncate text-left">
            {selectedOption
              ? formatHeaderCategoryOptionLabel(selectedOption)
              : "Chọn danh mục hiển thị"}
          </span>
          <ChevronsUpDown className="ml-3 h-4 w-4 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] min-w-[var(--radix-popover-trigger-width)] border-[#063e8e]/15 bg-white p-0 text-gray-700"
      >
        <Command className="bg-white text-gray-700">
          <CommandInput
            placeholder="Tìm danh mục hiển thị"
            className="text-gray-700 placeholder:text-gray-500"
          />
          <CommandList className="max-h-72">
            <CommandEmpty className="text-gray-700">
              Không tìm thấy danh mục phù hợp
            </CommandEmpty>
            {options.map((option) => (
              <CommandItem
                key={option.id}
                value={`${option.id} ${option.name} ${option.type}`}
                onSelect={() => {
                  onChange(option.id);
                  setOpen(false);
                }}
                className="gap-3 px-3 py-2 text-gray-700 data-[selected=true]:bg-[#063e8e]/10 data-[selected=true]:text-[#063e8e]"
              >
                <Check
                  className={cn(
                    "h-4 w-4 text-[#063e8e]",
                    value === option.id ? "opacity-100" : "opacity-0",
                  )}
                />
                <span className="truncate">
                  {formatHeaderCategoryOptionLabel(option)}
                </span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function HeaderCategoryMultiPicker({
  values,
  options,
  disabled,
  onChange,
}: {
  values: string[];
  options: Array<{
    id: string;
    name: string;
    type: HeaderCategoryItem["type"];
    depth: number;
  }>;
  disabled?: boolean;
  onChange: (values: string[]) => void;
}) {
  const [search, setSearch] = React.useState("");
  const selectedIds = React.useMemo(() => new Set(values), [values]);
  const selectedOptions = React.useMemo(
    () => options.filter((option) => selectedIds.has(option.id)),
    [options, selectedIds],
  );
  const filteredOptions = React.useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const availableOptions = options.filter((option) => !selectedIds.has(option.id));
    const matchedOptions = keyword
      ? availableOptions.filter((option) =>
          option.name.toLowerCase().includes(keyword),
        )
      : availableOptions;

    return [...selectedOptions, ...matchedOptions.slice(0, 20)];
  }, [options, search, selectedIds, selectedOptions]);

  const toggleValue = (id: string, checked: boolean) => {
    onChange(checked ? [...values, id] : values.filter((item) => item !== id));
  };

  return (
    <div className="space-y-2">
      <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 flex-1">
          <Label className="mb-1.5 block text-gray-700">
            Danh mục hiển thị <span className="text-red-600">*</span>
          </Label>
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm danh mục theo tên"
            disabled={disabled}
            className={fieldClassName}
          />
        </div>
        <div className="rounded-lg border border-[#063e8e]/10 bg-white px-3 py-2 text-sm text-gray-700">
          Đã chọn {values.length} danh mục
        </div>
      </div>
      <div className="max-h-64 overflow-y-auto rounded-xl border border-[#063e8e]/10 bg-white p-2">
        {filteredOptions.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {filteredOptions.map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-3 rounded-lg border border-[#063e8e]/10 bg-white px-3 py-2"
              >
                <Checkbox
                  checked={selectedIds.has(option.id)}
                  disabled={disabled}
                  onCheckedChange={(checked) => toggleValue(option.id, checked === true)}
                  className="border-[#063e8e]/30 data-[state=checked]:border-[#063e8e] data-[state=checked]:bg-[#063e8e]"
                />
                <span className="min-w-0 truncate text-sm text-gray-700">
                  {formatHeaderCategoryOptionLabel(option)}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <p className="px-3 py-2 text-sm text-gray-700">
            {"Kh\u00f4ng t\u00ecm th\u1ea5y danh m\u1ee5c ph\u00f9 h\u1ee3p."}
          </p>
        )}
      </div>
    </div>
  );
}

function HeaderCategorySinglePicker({
  value,
  options,
  disabled,
  onChange,
}: {
  value: string;
  options: Array<{
    id: string;
    name: string;
    type: HeaderCategoryItem["type"];
    depth: number;
  }>;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="mb-1.5 block text-gray-700">
        Danh mục hiển thị <span className="text-red-600">*</span>
      </Label>
      <HeaderCategoryCombobox
        value={value}
        onChange={onChange}
        disabled={disabled}
        options={options}
      />
    </div>
  );
}

export function AdminNewsForm({
  newsId,
  presetHeaderCategoryId,
  lockedType,
  returnPath,
}: AdminNewsFormProps) {
  const router = useRouter();
  const isCreate = !newsId || newsId === "new";
  const backPath = returnPath || "/admin/news";
  const isHeaderCategoryLocked = Boolean(presetHeaderCategoryId);
  const isTypeLocked = Boolean(lockedType);
  const [items, setItems] = React.useState<AdminNewsItem[]>([]);
  const [headerItems, setHeaderItems] = React.useState<CmsHeaderCategoryItem[]>([]);
  const [allTags, setAllTags] = React.useState<CmsTagItem[]>([]);
  const [form, setForm] = React.useState<AdminNewsFormValues | null>(null);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [tagSearch, setTagSearch] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoadingInitialData, setIsLoadingInitialData] = React.useState(true);
  const [isMissingPost, setIsMissingPost] = React.useState(false);
  // Toggle state for "Hiển thị các ngày cụ thể trên lịch" — independent of
  // whether event_dates array is empty, so the date picker section stays
  // visible after enabling (even before any dates are added).
  const [useEventDates, setUseEventDates] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoadingInitialData(true);
      setIsMissingPost(false);
      setForm(isCreate ? cloneAdminNewsFormValues() : null);

      try {
        const [nextHeaderConfig, nextTags] = await Promise.all([
          fetchHeaderConfigItems(),
          fetchCmsTags(),
        ]);
        const nextNewsItems = isCreate
          ? []
          : (await fetchCmsNewsItems({
              page: 1,
              pageSize: 10,
              filters: newsId ? `id==${newsId}` : undefined,
            })).items;

        if (cancelled) return;

        setItems(nextNewsItems);
        setHeaderItems(nextHeaderConfig.items);
        setAllTags(nextTags);

        if (isCreate) {
          const now = new Date().toISOString();
          const presetHeader =
            nextHeaderConfig.items.find((item) => item.id === presetHeaderCategoryId) ?? null;

          setForm({
            ...cloneAdminNewsFormValues(),
            type: lockedType ?? (presetHeader?.type === "page" ? "baiviettrang" : "tintuc"),
            header_category_id: presetHeaderCategoryId ?? "",
            category_ids: presetHeaderCategoryId ? [presetHeaderCategoryId] : [],
            created_at: now,
            updated_at: now,
          });
          setUseEventDates(false);
          return;
        }

        const currentItem =
          nextNewsItems.find((item) => item.id === newsId) ??
          (newsId ? await fetchCmsNewsItem(newsId) : null);

        if (cancelled) return;

        if (!currentItem) {
          setIsMissingPost(true);
          setForm(null);
          return;
        }

        const belongsToPresetHeaderCategory =
          !presetHeaderCategoryId ||
          currentItem.header_category_id === presetHeaderCategoryId ||
          currentItem.category_ids.includes(presetHeaderCategoryId);

        if (!belongsToPresetHeaderCategory) {
          setIsMissingPost(true);
          setForm(null);
          return;
        }

        if (lockedType && currentItem.type !== lockedType) {
          setIsMissingPost(true);
          setForm(null);
          return;
        }

        setIsMissingPost(false);
        const nextForm = cloneAdminNewsFormValues(currentItem);
        if (
          presetHeaderCategoryId &&
          currentItem.type === "tintuc" &&
          !nextForm.category_ids.includes(presetHeaderCategoryId)
        ) {
          nextForm.category_ids = [presetHeaderCategoryId, ...nextForm.category_ids];
          nextForm.header_category_id = nextForm.category_ids[0] ?? "";
        }
        setForm(nextForm);
        // Enable the "specific dates" toggle if the post already has event_dates
        setUseEventDates((nextForm.event_dates ?? []).length > 0);
      } catch (error) {
        if (cancelled) return;
        toast.error(error instanceof Error ? error.message : "Không thể tải bài viết");
        setIsMissingPost(!isCreate);
        setForm(isCreate ? cloneAdminNewsFormValues() : null);
      } finally {
        if (!cancelled) {
          setIsLoadingInitialData(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [isCreate, lockedType, newsId, presetHeaderCategoryId]);

  const headerOptions = React.useMemo(() => {
    return flattenHeaderTree(buildHeaderCategoryTree(headerItems));
  }, [headerItems]);

  const selectedHeaderCategory = React.useMemo(() => {
    return headerItems.find((item) => item.id === form?.header_category_id) ?? null;
  }, [form?.header_category_id, headerItems]);

  const availableSearchTags = React.useMemo(() => {
    if (form?.type !== "tintuc") return [];
    return allTags.map((item) => item.name);
  }, [allTags, form?.type]);

  const selectedTagIds = React.useMemo(() => {
    if (form?.type !== "tintuc") return [];

    const tagMap = new Map(
      allTags.map((item) => [item.name.trim().toLowerCase(), item.id] as const),
    );

    return form?.tagsearch_values
      .map((name) => tagMap.get(name.trim().toLowerCase()))
      .filter((value): value is string => Boolean(value)) ?? [];
  }, [allTags, form?.tagsearch_values, form?.type]);

  const visibleSearchTags = React.useMemo(() => {
    if (form?.type !== "tintuc") return [];

    const normalizedKeyword = tagSearch.trim().toLowerCase();
    const selectedNames = new Set(form.tagsearch_values);
    const selectedTags = availableSearchTags.filter((item) => selectedNames.has(item));
    const availableTags = availableSearchTags.filter((item) => !selectedNames.has(item));
    const matchedTags = normalizedKeyword
      ? availableTags.filter((item) => item.toLowerCase().includes(normalizedKeyword))
      : availableTags;

    return [
      ...selectedTags,
      ...matchedTags.slice(
        0,
        Math.max(SEARCH_TAG_VISIBLE_LIMIT - selectedTags.length, 0),
      ),
    ];
  }, [availableSearchTags, form?.tagsearch_values, form?.type, tagSearch]);

  const matchedSearchTagTotal = React.useMemo(() => {
    if (form?.type !== "tintuc") return 0;

    const normalizedKeyword = tagSearch.trim().toLowerCase();
    if (!normalizedKeyword) return availableSearchTags.length;

    return availableSearchTags.filter((item) =>
      item.toLowerCase().includes(normalizedKeyword),
    ).length;
  }, [availableSearchTags, form?.type, tagSearch]);

  const articlePageAlreadyUsed = React.useMemo(() => {
    if (!form?.header_category_id || form.type !== "baiviettrang") return false;

    return items.some(
      (item) =>
        item.header_category_id === form.header_category_id &&
        item.type === "baiviettrang" &&
        item.id !== newsId,
    );
  }, [form?.header_category_id, form?.type, items, newsId]);

  const handleField = <K extends keyof AdminNewsFormValues>(
    key: K,
    value: AdminNewsFormValues[K],
  ) => {
    setForm((current) => {
      if (!current) return current;
      return { ...current, [key]: value };
    });
  };

  const handleTitleChange = (value: string) => {
    setForm((current) => {
      if (!current) return current;

      return {
        ...current,
        title: value,
        slug: slugifyAdminNews(value),
      };
    });
  };

  const handleTypeChange = (value: string) => {
    const nextType = resolveAdminNewsType(value) ?? "tintuc";

    setForm((current) => {
      if (!current) return current;

      const compatibleHeader = headerOptions.find(
        (option) =>
          option.id === current.header_category_id &&
          isCategoryCompatible(option.type, nextType),
      );

      return {
        ...current,
        type: nextType,
        header_category_id:
          nextType === "baiviettrang"
            ? compatibleHeader
              ? current.header_category_id
              : ""
            : current.category_ids.find((id) =>
                headerOptions.some(
                  (option) => option.id === id && isCategoryCompatible(option.type, nextType),
                ),
              ) ?? "",
        category_ids:
          nextType === "baiviettrang"
            ? []
            : current.category_ids.filter((id) =>
                headerOptions.some(
                  (option) => option.id === id && isCategoryCompatible(option.type, nextType),
                ),
              ),
        tagsearch_values: nextType === "baiviettrang" ? [] : current.tagsearch_values,
        is_featured: nextType === "tintuc" ? current.is_featured : false,
      };
    });
  };

  const handleHeaderCategoryChange = (value: string) => {
    const nextCategory = headerItems.find((item) => item.id === value) ?? null;

    setForm((current) => {
      if (!current) return current;
      const nextSearchTags =
        current.type === "tintuc" ? allTags.map((item) => item.name) : [];

      return {
        ...current,
        header_category_id: value,
        category_ids: nextCategory?.id ? [nextCategory.id] : [],
        tagsearch_values: current.tagsearch_values.filter((item) =>
          nextSearchTags.includes(item),
        ),
      };
    });
  };

  const handleHeaderCategoriesChange = (values: string[]) => {
    setForm((current) => {
      if (!current) return current;

      return {
        ...current,
        header_category_id: values[0] ?? "",
        category_ids: values,
      };
    });
  };

  const handleToggleSearchTag = (value: string, checked: boolean) => {
    setForm((current) => {
      if (!current) return current;

      return {
        ...current,
        tagsearch_values: checked
          ? [...current.tagsearch_values, value]
          : current.tagsearch_values.filter((item) => item !== value),
      };
    });
  };

  const handleThumbnailSelect = (item: AdminMediaItem) => {
    handleField("thumbnail", toImageRef(item));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form || isSubmitting) return;

    if (!form.title.trim()) {
      toast.error("Tiêu đề bài viết là bắt buộc");
      return;
    }

    if (!form.slug.trim()) {
      toast.error("Slug bài viết là bắt buộc");
      return;
    }

    if (!form.type) {
      toast.error("Vui lòng chọn thể loại bài viết");
      return;
    }

    if (form.type === "baiviettrang" && !form.header_category_id) {
      toast.error("Vui lòng chọn danh mục hiển thị");
      return;
    }

    if (form.type === "tintuc" && form.category_ids.length === 0) {
      toast.error("Vui lòng chọn danh mục hiển thị");
      return;
    }

    if (articlePageAlreadyUsed) {
      toast.error("Danh mục bài viết trang chỉ được tạo 1 bài viết");
      return;
    }

    const payload = {
      title: form.title.trim(),
      slug: slugifyAdminNews(form.slug.trim()),
      summary: form.summary,
      type: form.type,
      header_category_id: form.type === "tintuc" ? form.category_ids[0] ?? "" : form.header_category_id,
      category_ids:
        form.type === "baiviettrang"
          ? form.header_category_id
            ? [form.header_category_id]
            : []
          : form.category_ids,
      tag_ids: form.type === "baiviettrang" ? [] : selectedTagIds,
      is_featured: form.type === "tintuc" ? form.is_featured : false,
      thumbnail_id: form.thumbnail && isUuid(form.thumbnail.id) ? form.thumbnail.id : null,
      is_hidden: form.is_hidden,
      published_at: form.published_at || null,
      expired_at: form.expired_at || null,
      started_at: form.started_at || null,
      ended_at: form.ended_at || null,
      registration_deadline: form.registration_deadline || null,
      location: form.location.trim(),
      participation_fee: form.participation_fee.trim(),
      event_dates: (form.event_dates ?? []).length > 0 ? form.event_dates : null,
      post_content: form.post_content.map((section, index) => ({
        ...section,
        position: index + 1,
      })),
    };

    setIsSubmitting(true);

    try {
      if (isCreate) {
        await createCmsNewsItem(payload);
      } else if (newsId) {
        await updateCmsNewsItem(newsId, payload);
      }

      toast.success(isCreate ? "Đã tạo bài viết" : "Đã cập nhật bài viết");
      router.push(backPath);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể lưu bài viết");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingInitialData) {
    return <NewsFormLoadingState />;
  }

  if (isMissingPost && !isCreate) {
    return (
      <div className="rounded-2xl border border-[#063e8e]/15 bg-white px-6 py-12 text-center">
        <p className="text-lg font-semibold text-black">Không tìm thấy bài viết</p>
        <p className="mt-2 text-sm text-gray-700">
          {presetHeaderCategoryId
            ? "Bài viết không tồn tại hoặc không thuộc danh mục hiện tại."
            : "Bài viết không tồn tại trong dữ liệu hiện tại."}
        </p>
        <Button
          asChild
          className="mt-5 bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
        >
          <Link href={backPath}>Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="rounded-2xl border border-[#063e8e]/15 bg-white px-6 py-12 text-center text-sm text-gray-700">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          asChild
          className="border-[#063e8e]/15 bg-white text-gray-700 hover:bg-[#063e8e]/10 hover:text-[#063e8e]"
        >
          <Link href={backPath}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormSection title={isCreate ? "Tạo bài viết" : "Chỉnh sửa bài viết"}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label className="mb-1.5 block text-gray-700">Ngày tạo</Label>
              <Input
                value={
                  form.created_at
                    ? dayjs(form.created_at).format("DD/MM/YYYY HH:mm")
                    : ""
                }
                readOnly
                className={readOnlyFieldClassName}
              />
            </div>

            <div>
              <Label className="mb-1.5 block text-gray-700">Ngày cập nhật</Label>
              <Input
                value={
                  form.updated_at
                    ? dayjs(form.updated_at).format("DD/MM/YYYY HH:mm")
                    : ""
                }
                readOnly
                className={readOnlyFieldClassName}
              />
            </div>

            <div className="md:col-span-2">
              <Label className="mb-1.5 block text-gray-700">
                Tiêu đề <span className="text-red-600">*</span>
              </Label>
              <Input
                value={form.title}
                onChange={(event) => handleTitleChange(event.target.value)}
                placeholder="Nhập tiêu đề bài viết"
                className={fieldClassName}
              />
            </div>

            <div className="md:col-span-2">
              <Label className="mb-1.5 block text-gray-700">
                Slug <span className="text-red-600">*</span>
              </Label>
              <Input
                value={form.slug}
                onChange={(event) => handleField("slug", event.target.value)}
                placeholder="slug-bai-viet"
                className={fieldClassName}
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Thể loại, hình ảnh và hiển thị">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
            <div className="rounded-xl border border-[#063e8e]/15 bg-[#063e8e]/[0.02] p-4">
              <div className="space-y-3">
                <div>
                  <Label className="block text-gray-700">Hình ảnh đại diện</Label>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-[#063e8e]/15 bg-white">
                  <div className="relative aspect-[16/11]">
                    {form.thumbnail ? (
                      <SafeNextImage
                        src={form.thumbnail.url}
                        alt={form.thumbnail.alt || form.thumbnail.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-6 text-center text-sm text-gray-700">
                        Chưa chọn ảnh đại diện
                      </div>
                    )}
                  </div>

                  {form.thumbnail ? (
                    <button
                      type="button"
                      onClick={() => handleField("thumbnail", null)}
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-sm transition hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPickerOpen(true)}
                  className="w-full border-[#063e8e]/15 bg-white text-gray-700 hover:bg-[#063e8e]/10 hover:text-[#063e8e]"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {form.thumbnail ? "Đổi hình đại diện" : "Chọn hình đại diện"}
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-[#063e8e]/15 bg-white p-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label className="mb-1.5 block text-gray-700">
                      Loại bài viết <span className="text-red-600">*</span>
                    </Label>
                    <Select
                      value={form.type}
                      onValueChange={handleTypeChange}
                      disabled={isTypeLocked}
                    >
                      <SelectTrigger className={selectTriggerClassName}>
                        <SelectValue placeholder="Chọn loại bài viết" />
                      </SelectTrigger>
                      <SelectContent className={selectContentClassName}>
                        {ADMIN_NEWS_TYPE_OPTIONS.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className={selectItemClassName}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label className="mb-1.5 block text-gray-700">Ngày xuất bản</Label>
                    <Input
                      type="datetime-local"
                      value={form.published_at}
                      onChange={(event) =>
                        handleField("published_at", event.target.value)
                      }
                      className={fieldClassName}
                    />
                  </div>

                  <div>
                    <Label className="mb-1.5 block text-gray-700">Ngày hết hạn</Label>
                    <Input
                      type="datetime-local"
                      value={form.expired_at}
                      onChange={(event) =>
                        handleField("expired_at", event.target.value)
                      }
                      className={fieldClassName}
                    />
                  </div>
                </div>

                <div className="rounded-xl bg-[#063e8e]/[0.04] px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Trạng thái hiển thị
                      </p>
                      <p className="mt-1 text-sm font-medium text-[#063e8e]">
                        {form.is_hidden ? "Đang ẩn" : "Đang hiển thị"}
                      </p>
                    </div>
                    <Switch
                      checked={!form.is_hidden}
                      onCheckedChange={(checked) => handleField("is_hidden", !checked)}
                    />
                  </div>
                </div>

                {form.type === "tintuc" ? (
                  <div className="rounded-xl border border-[#063e8e]/15 bg-[#063e8e]/[0.02] px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Tin nổi bật</p>
                        <p className="mt-1 text-sm text-gray-700">
                          Đánh dấu để ưu tiên hiển thị như một tin nổi bật.
                        </p>
                      </div>
                      <Switch
                        checked={form.is_featured}
                        onCheckedChange={(checked) => handleField("is_featured", checked)}
                      />
                    </div>
                  </div>
                ) : null}

              </div>
            </div>

            <div className="rounded-xl border border-[#063e8e]/15 bg-[#063e8e]/[0.02] p-4 xl:col-span-2">
              {form.type === "tintuc" ? (
                <HeaderCategoryMultiPicker
                  values={form.category_ids}
                  onChange={handleHeaderCategoriesChange}
                  disabled={isHeaderCategoryLocked}
                  options={headerOptions.filter((option) =>
                    isCategoryCompatible(option.type, form.type),
                  )}
                />
              ) : (
                <HeaderCategorySinglePicker
                  value={form.header_category_id}
                  onChange={handleHeaderCategoryChange}
                  disabled={isHeaderCategoryLocked}
                  options={headerOptions.filter((option) =>
                    isCategoryCompatible(option.type, form.type),
                  )}
                />
              )}
            </div>

            {form.type === "tintuc" ? (
              <div className="rounded-xl border border-[#063e8e]/15 bg-[#063e8e]/[0.02] p-4 xl:col-span-2">
                <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div className="min-w-0 flex-1">
                    <Label className="mb-1.5 block text-gray-700">Tag tìm kiếm</Label>
                    <Input
                      value={tagSearch}
                      onChange={(event) => setTagSearch(event.target.value)}
                      placeholder="Tìm tag theo tên"
                      className={fieldClassName}
                    />
                  </div>
                  <div className="rounded-lg border border-[#063e8e]/10 bg-white px-3 py-2 text-sm text-gray-700">
                    Đã chọn {form.tagsearch_values.length} tag
                  </div>
                </div>
                {availableSearchTags.length > 0 ? (
                  <>
                    {visibleSearchTags.length > 0 ? (
                      <div className="max-h-64 overflow-y-auto rounded-xl border border-[#063e8e]/10 bg-white p-2">
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                          {visibleSearchTags.map((item) => (
                            <label
                              key={item}
                              className="flex items-center gap-3 rounded-lg border border-[#063e8e]/10 bg-white px-3 py-2"
                            >
                              <Checkbox
                                checked={form.tagsearch_values.includes(item)}
                                onCheckedChange={(checked) =>
                                  handleToggleSearchTag(item, checked === true)
                                }
                                className="border-[#063e8e]/30 data-[state=checked]:border-[#063e8e] data-[state=checked]:bg-[#063e8e]"
                              />
                              <span className="min-w-0 truncate text-sm text-gray-700">
                                {item}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="rounded-lg border border-dashed border-[#063e8e]/20 bg-white px-3 py-2 text-sm text-gray-700">
                        Không tìm thấy tag phù hợp.
                      </p>
                    )}
                    {matchedSearchTagTotal > visibleSearchTags.length ? (
                      <p className="mt-2 text-sm text-gray-700">
                        Đang hiển thị {visibleSearchTags.length} trong{" "}
                        {matchedSearchTagTotal} tag phù hợp. Nhập thêm từ khóa để lọc nhanh hơn.
                      </p>
                    ) : null}
                  </>
                ) : (
                  <p className="rounded-lg border border-dashed border-[#063e8e]/20 bg-white px-3 py-2 text-sm text-gray-700">
                    {"Ch\u01b0a c\u00f3 tag t\u00ecm ki\u1ebfm n\u00e0o. Vui l\u00f2ng t\u1ea1o tag trong m\u1ee5c qu\u1ea3n l\u00fd tag tr\u01b0\u1edbc khi g\u00e1n cho b\u00e0i vi\u1ebft."}
                  </p>
                )}
              </div>
            ) : null}
          </div>
        </FormSection>

        <FormSection
          title="Thông tin sự kiện (tùy chọn)"
          description="Nhóm các trường dành cho bài viết có tính chất sự kiện hoặc chương trình."
        >
          <div className="rounded-xl border border-[#063e8e]/15 p-4 space-y-4">
            {/* Toggle: Sử dụng ngày cụ thể */}
            <div className="flex items-center gap-3 rounded-lg border border-[#063e8e]/10 bg-[#063e8e]/5 p-3">
              <Checkbox
                id="use-event-dates"
                checked={useEventDates}
                onCheckedChange={(checked) => {
                  setUseEventDates(checked === true);
                  if (!checked) {
                    // Tắt: xóa hết event_dates
                    handleField("event_dates", []);
                  }
                }}
                className="border-[#063e8e]/30 data-[state=checked]:border-[#063e8e] data-[state=checked]:bg-[#063e8e]"
              />
              <div className="flex-1">
                <Label htmlFor="use-event-dates" className="cursor-pointer text-sm font-medium text-gray-700">
                  Hiển thị các ngày cụ thể trên lịch
                </Label>
                <p className="text-xs text-gray-500">
                  Thay vì hiển thị tất cả ngày từ bắt đầu đến kết thúc, chỉ hiển thị những ngày bạn chọn bên dưới
                </p>
              </div>
            </div>

            {/* Ngày cụ thể - chỉ hiển thị khi được bật */}
            {useEventDates && (
              <div className="space-y-2">
                <Label className="block text-sm font-medium text-gray-700">
                  Các ngày cụ thể ({(form.event_dates ?? []).length} ngày)
                </Label>
                <div className="flex flex-wrap gap-2">
                  {(form.event_dates ?? []).map((date, index) => (
                    <div
                      key={date}
                      className="flex items-center gap-1 rounded-lg bg-[#063e8e]/10 px-3 py-1.5 text-sm text-[#063e8e]"
                    >
                      <CalendarIcon className="h-3.5 w-3.5" />
                      <span>{dayjs(date).format("DD/MM/YYYY")}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newDates = (form.event_dates ?? []).filter((_, i) => i !== index);
                          handleField("event_dates", newDates);
                        }}
                        className="ml-1 rounded-full p-0.5 hover:bg-[#063e8e]/20"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <EventDatesDatePicker
                  value={form.event_dates ?? []}
                  onChange={(dates) => handleField("event_dates", dates)}
                />
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div>
                <Label className="mb-1.5 block text-gray-700">Ngày bắt đầu</Label>
                <Input
                  type="datetime-local"
                  value={form.started_at}
                  onChange={(event) => handleField("started_at", event.target.value)}
                  className={fieldClassName}
                />
              </div>

              <div>
                <Label className="mb-1.5 block text-gray-700">Ngày kết thúc</Label>
                <Input
                  type="datetime-local"
                  value={form.ended_at}
                  onChange={(event) => handleField("ended_at", event.target.value)}
                  className={fieldClassName}
                />
              </div>

              <div>
                <Label className="mb-1.5 block text-gray-700">
                  Hạn đăng ký
                </Label>
                <Input
                  type="datetime-local"
                  value={form.registration_deadline}
                  onChange={(event) =>
                    handleField("registration_deadline", event.target.value)
                  }
                  className={fieldClassName}
                />
              </div>

              <div>
                <Label className="mb-1.5 block text-gray-700">Địa điểm</Label>
                <Input
                  value={form.location}
                  onChange={(event) => handleField("location", event.target.value)}
                  placeholder="Nhập địa điểm"
                  className={fieldClassName}
                />
              </div>

              <div>
                <Label className="mb-1.5 block text-gray-700">Phí tham dự</Label>
                <Input
                  value={form.participation_fee}
                  onChange={(event) =>
                    handleField("participation_fee", event.target.value)
                  }
                  placeholder="Ví dụ: Miễn phí hoặc 500.000 VNĐ"
                  className={fieldClassName}
                />
              </div>
            </div>
          </div>
        </FormSection>

        <FormSection title="Tóm tắt">
          <AdminRichTextEditor
            value={form.summary}
            onChange={(value) => handleField("summary", value)}
            placeholder="Nhập tóm tắt bài viết"
            minHeight={180}
          />
        </FormSection>

        <FormSection
          title="Nội dung bài viết"
          description="Thêm section văn bản và hình ảnh theo đúng cấu trúc nội dung mong muốn."
        >
          <AdminPostContentEditor
            sections={form.post_content}
            onChange={(sections) => handleField("post_content", sections)}
          />
        </FormSection>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            asChild
            className="border-[#063e8e]/15 bg-white text-gray-700 hover:bg-[#063e8e]/10 hover:text-[#063e8e]"
          >
            <Link href={backPath}>Hủy</Link>
          </Button>
          <Button
            className="bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
            type="submit"
            disabled={isSubmitting}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting
              ? "Đang lưu..."
              : isCreate
                ? "Lưu bài viết"
                : "Cập nhật bài viết"}
          </Button>
        </div>
      </form>

      <AdminImagePicker
        open={pickerOpen}
        selectedId={form.thumbnail?.id}
        onOpenChange={setPickerOpen}
        onSelect={handleThumbnailSelect}
      />

      {!isCreate && newsId && (
        <PermissionGate required="posts:read">
          <PostHistoryViewer postId={newsId} />
        </PermissionGate>
      )}
    </div>
  );
}

function EventDatesDatePicker({
  value,
  onChange,
}: {
  value: string[];
  onChange: (dates: string[]) => void;
}) {
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  // Convert stored "YYYY-MM-DD" strings to Date objects for react-day-picker
  const selectedDates = React.useMemo(
    () => value.map((d) => dayjs(d).toDate()).filter((d) => !Number.isNaN(d.getTime())),
    [value],
  );

  const handleMultipleSelect = (dates: Date[] | undefined) => {
    if (!dates) {
      onChange([]);
      return;
    }
    const newDates = Array.from(
      new Set(dates.map((d) => dayjs(d).format("YYYY-MM-DD"))),
    ).sort();
    onChange(newDates);
  };

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="border-[#063e8e]/15 bg-white text-gray-700 hover:bg-[#063e8e]/10 hover:text-[#063e8e]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm ngày{value.length > 0 ? ` (${value.length})` : ""}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0" align="start">
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <span className="text-base font-semibold text-[#063e8e]">
              {value.length > 0
                ? `Đã chọn ${value.length} ngày`
                : "Chọn các ngày cụ thể"}
            </span>
            {value.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => onChange([])}
              >
                Xóa tất cả
              </Button>
            )}
          </div>
          <Calendar
            mode="multiple"
            selected={selectedDates}
            onSelect={handleMultipleSelect}
            className="w-full [--cell-size:3.5rem]"
            classNames={{
              root: "w-full",
              month: "flex w-full flex-col gap-4",
              month_caption: "flex h-12 w-full items-center justify-center px-2 text-xl font-bold text-[#063e8e]",
              nav: "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
              button_previous: "h-12 w-12 select-none p-0 text-[#063e8e] hover:bg-[#063e8e]/10 aria-disabled:opacity-50 [&>svg]:size-6",
              button_next: "h-12 w-12 select-none p-0 text-[#063e8e] hover:bg-[#063e8e]/10 aria-disabled:opacity-50 [&>svg]:size-6",
              weekday: "flex-1 select-none rounded-md text-sm font-semibold uppercase text-gray-400",
              day: "group/day relative aspect-square h-full w-full select-none p-0 text-center text-lg",
              today: "ring-2 ring-[#063e8e]/40 rounded-full bg-[#063e8e]/5 text-[#063e8e] font-semibold",
              outside: "text-gray-300",
            }}
          />
          <div className="mt-3 flex items-center justify-between gap-4 border-t border-gray-100 pt-3">
            <span className="text-sm text-gray-400">
              Click ngày để chọn / bỏ chọn
            </span>
            <Button
              type="button"
              variant="default"
              size="default"
              className="bg-[#063e8e] hover:bg-[#063e8e]/90"
              onClick={() => setPopoverOpen(false)}
            >
              Xong
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
