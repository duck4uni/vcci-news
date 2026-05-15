"use client";

import * as React from "react";
import dayjs from "dayjs";
import { ArrowLeft, Check, ChevronsUpDown, Save, Upload, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminImagePicker } from "@/components/admin/image-picker";
import { AdminPostContentEditor } from "@/components/admin/post-content-editor";
import { AdminRichTextEditor } from "@/components/admin/rich-text-editor";
import { SafeNextImage } from "@/components/admin/safe-next-image";
import { Button } from "@/components/ui/button";
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
  if (headerType === "news") return postType !== "baiviettrang";
  if (headerType === "page") return postType === "baiviettrang";
  return true;
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
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoadingInitialData, setIsLoadingInitialData] = React.useState(true);
  const [isMissingPost, setIsMissingPost] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoadingInitialData(true);
      setIsMissingPost(false);
      setForm(isCreate ? cloneAdminNewsFormValues() : null);

      try {
        const [{ items: nextNewsItems }, nextHeaderConfig, nextTags] = await Promise.all([
          fetchCmsNewsItems(),
          fetchHeaderConfigItems(),
          fetchCmsTags(),
        ]);

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
            category_ids: presetHeader?.category_ids ?? [],
            created_at: now,
            updated_at: now,
          });
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

        if (
          presetHeaderCategoryId &&
          currentItem.header_category_id !== presetHeaderCategoryId
        ) {
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
        setForm(cloneAdminNewsFormValues(currentItem));
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
    return flattenHeaderTree(buildHeaderCategoryTree(headerItems)).filter(
      (item) => item.type === "news" || item.type === "page",
    );
  }, [headerItems]);

  const selectedHeaderCategory = React.useMemo(() => {
    return headerItems.find((item) => item.id === form?.header_category_id) ?? null;
  }, [form?.header_category_id, headerItems]);

  const availableSearchTags = React.useMemo(() => {
    if (!selectedHeaderCategory || selectedHeaderCategory.type !== "news") return [];
    return allTags.map((item) => item.name);
  }, [allTags, selectedHeaderCategory]);

  const selectedTagIds = React.useMemo(() => {
    if (!selectedHeaderCategory || selectedHeaderCategory.type !== "news") return [];

    const tagMap = new Map(
      allTags.map((item) => [item.name.trim().toLowerCase(), item.id] as const),
    );

    return form?.tagsearch_values
      .map((name) => tagMap.get(name.trim().toLowerCase()))
      .filter((value): value is string => Boolean(value)) ?? [];
  }, [allTags, form?.tagsearch_values, selectedHeaderCategory]);

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
        header_category_id: compatibleHeader ? current.header_category_id : "",
        category_ids:
          nextType === "baiviettrang"
            ? []
            : compatibleHeader
              ? current.category_ids
              : [],
        tagsearch_values: nextType === "baiviettrang" ? [] : current.tagsearch_values,
        is_featured: nextType === "tintuc" ? current.is_featured : false,
      };
    });
  };

  const handleHeaderCategoryChange = (value: string) => {
    const nextCategory = headerItems.find((item) => item.id === value) ?? null;
    const nextSearchTags =
      nextCategory?.type === "news" ? allTags.map((item) => item.name) : [];

    setForm((current) => {
      if (!current) return current;

      return {
        ...current,
        header_category_id: value,
        category_ids: nextCategory?.category_ids ?? [],
        tagsearch_values: current.tagsearch_values.filter((item) =>
          nextSearchTags.includes(item),
        ),
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

    if (!form.header_category_id) {
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
      header_category_id: form.header_category_id,
      category_ids:
        form.type === "baiviettrang"
          ? form.header_category_id
            ? [form.header_category_id]
            : []
          : selectedHeaderCategory?.category_ids ?? [],
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

                  <div>
                    <Label className="mb-1.5 block text-gray-700">
                      Danh mục hiển thị
                    </Label>
                    <HeaderCategoryCombobox
                      value={form.header_category_id}
                      onChange={handleHeaderCategoryChange}
                      disabled={isHeaderCategoryLocked}
                      options={headerOptions.filter((option) =>
                        isCategoryCompatible(option.type, form.type),
                      )}
                    />
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

            {availableSearchTags.length > 0 ? (
              <div className="rounded-xl border border-[#063e8e]/15 bg-[#063e8e]/[0.02] p-4 xl:col-span-2">
                <Label className="mb-3 block text-gray-700">Tag tìm kiếm</Label>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {availableSearchTags.map((item) => (
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
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </FormSection>

        <FormSection
          title="Thông tin sự kiện (tùy chọn)"
          description="Nhóm các trường dành cho bài viết có tính chất sự kiện hoặc chương trình."
        >
          <div className="rounded-xl border border-[#063e8e]/15 p-4">
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
    </div>
  );
}
