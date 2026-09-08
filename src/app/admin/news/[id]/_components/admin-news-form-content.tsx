"use client";

import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import dayjs from "dayjs";
import { ArrowLeft, Save, Upload, X, Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AdminImagePicker } from "@/components/admin/image-picker";
import { AdminPostContentEditor } from "@/components/admin/post-content-editor";
import { PostHistoryViewer } from "./post-history-viewer";
import { AdminRichTextEditor } from "@/components/shared/rich-text-editor";
import { SafeImage } from "@/components/shared/safe-image";
import { PermissionGate } from "@/components/shared/permission-gate";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  type AdminNewsItem,
  resolveAdminNewsType,
  slugifyAdminNews,
} from "@/mockdata/admin-news";
import { buildHeaderCategoryTree } from "@/mockdata/header-config";
import {
  fieldClassName,
  readOnlyFieldClassName,
  selectContentClassName,
  selectItemClassName,
  selectTriggerClassName,
  SEARCH_TAG_VISIBLE_LIMIT,
} from "./constants";
import { EventDatesDatePicker } from "./event-dates-date-picker";
import { FormSection } from "./form-section";
import { HeaderCategoryMultiPicker } from "./header-category-multi-picker";
import { HeaderCategorySinglePicker } from "./header-category-single-picker";
import { NewsFormLoadingState } from "./news-form-loading-state";
import {
  flattenHeaderTree,
  isCategoryCompatible,
  isUuid,
  toImageRef,
} from "./utils";

export function AdminNewsFormContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const newsId = String(params.id ?? "");
  const returnPath = searchParams.get("returnTo") || "/admin/news";

  const router = useRouter();
  const isCreate = !newsId || newsId === "new";
  const backPath = returnPath;
  const [items, setItems] = useState<AdminNewsItem[]>([]);
  const [headerItems, setHeaderItems] = useState<CmsHeaderCategoryItem[]>([]);
  const [allTags, setAllTags] = useState<CmsTagItem[]>([]);
  const [form, setForm] = useState<AdminNewsFormValues | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);
  const [isMissingPost, setIsMissingPost] = useState(false);
  const [useEventDates, setUseEventDates] = useState(false);

  useEffect(() => {
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
          setForm({
            ...cloneAdminNewsFormValues(),
            type: "tintuc",
            header_category_id: "",
            category_ids: [],
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

        setIsMissingPost(false);
        const nextForm = cloneAdminNewsFormValues(currentItem);
        setForm(nextForm);
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
  }, [isCreate, newsId]);

  const headerOptions = useMemo(() => {
    return flattenHeaderTree(buildHeaderCategoryTree(headerItems));
  }, [headerItems]);

  const availableSearchTags = useMemo(() => {
    if (form?.type !== "tintuc") return [];
    return allTags.map((item) => item.name);
  }, [allTags, form?.type]);

  const selectedTagIds = useMemo(() => {
    if (form?.type !== "tintuc") return [];

    const tagMap = new Map(
      allTags.map((item) => [item.name.trim().toLowerCase(), item.id] as const),
    );

    return form?.tagsearch_values
      .map((name) => tagMap.get(name.trim().toLowerCase()))
      .filter((value): value is string => Boolean(value)) ?? [];
  }, [allTags, form?.tagsearch_values, form?.type]);

  const visibleSearchTags = useMemo(() => {
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

  const matchedSearchTagTotal = useMemo(() => {
    if (form?.type !== "tintuc") return 0;

    const normalizedKeyword = tagSearch.trim().toLowerCase();
    if (!normalizedKeyword) return availableSearchTags.length;

    return availableSearchTags.filter((item) =>
      item.toLowerCase().includes(normalizedKeyword),
    ).length;
  }, [availableSearchTags, form?.type, tagSearch]);

  const articlePageAlreadyUsed = useMemo(() => {
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
          Bài viết không tồn tại trong dữ liệu hiện tại.
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
                      <SafeImage
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
                  options={headerOptions.filter((option) =>
                    isCategoryCompatible(option.type, form.type),
                  )}
                />
              ) : (
                <HeaderCategorySinglePicker
                  value={form.header_category_id}
                  onChange={handleHeaderCategoryChange}
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
            <div className="flex items-center gap-3 rounded-lg border border-[#063e8e]/10 bg-[#063e8e]/5 p-3">
              <Checkbox
                id="use-event-dates"
                checked={useEventDates}
                onCheckedChange={(checked) => {
                  setUseEventDates(checked === true);
                  if (!checked) {
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
