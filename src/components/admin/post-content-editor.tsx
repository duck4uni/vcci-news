"use client";

import * as React from "react";
import { Image as ImageIcon, Pencil, Plus, Type, Upload, X } from "lucide-react";
import { AdminImagePicker } from "@/components/admin/image-picker";
import { AdminRichTextEditor } from "@/components/admin/rich-text-editor";
import { SafeNextImage } from "@/components/admin/safe-next-image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type AdminMediaItem,
  type AdminNewsContentSection,
  createAdminNewsSectionId,
} from "@/mockdata/admin-news";

interface AdminPostContentEditorProps {
  sections: AdminNewsContentSection[];
  onChange: (sections: AdminNewsContentSection[]) => void;
}

function CaptionEditor({
  caption,
  onCaptionChange,
}: {
  caption: string;
  onCaptionChange: (caption: string) => void;
}) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [value, setValue] = React.useState(caption);

  React.useEffect(() => {
    setValue(caption);
  }, [caption]);

  const handleSave = () => {
    onCaptionChange(value.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue(caption);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 p-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") handleCancel();
          }}
          placeholder="Nhập chú thích cho ảnh..."
          className="w-full rounded-lg border border-[#063e8e]/15 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-500 focus:border-[#063e8e]/30 focus:outline-none focus:ring-2 focus:ring-[#063e8e]/20"
          autoFocus
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 rounded-lg bg-[#063e8e] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#063e8e]/90"
          >
            Lưu
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 rounded-lg border border-[#063e8e]/15 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-[#063e8e]/5"
          >
            Hủy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group/piece flex min-h-11 items-center justify-between gap-2 border-t border-[#063e8e]/10 px-3 py-2">
      {caption ? (
        <p className="flex-1 text-center text-xs italic text-gray-700">{caption}</p>
      ) : (
        <p className="flex-1 text-center text-xs italic text-gray-500">
          Thêm chú thích...
        </p>
      )}
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-[#063e8e]/10 hover:text-[#063e8e]"
        title="Sửa chú thích"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function AdminPostContentEditor({
  sections,
  onChange,
}: AdminPostContentEditorProps) {
  const [pickerState, setPickerState] = React.useState<{
    open: boolean;
    sectionId: string | null;
    position: number;
    selectedId: string | null;
  }>({
    open: false,
    sectionId: null,
    position: 0,
    selectedId: null,
  });

  const updateSection = React.useCallback(
    (
      sectionId: string,
      updater: (section: AdminNewsContentSection) => AdminNewsContentSection,
    ) => {
      onChange(sections.map((section) => (section.id === sectionId ? updater(section) : section)));
    },
    [onChange, sections],
  );

  const appendSection = (type: "text" | "image") => {
    const nextSection: AdminNewsContentSection = {
      id: createAdminNewsSectionId(),
      type,
      position: sections.length + 1,
      content: "",
      image_columns: 2,
      image_rows: 1,
      images: [],
    };

    onChange([...sections, nextSection]);
  };

  const removeSection = (sectionId: string) => {
    const nextSections = sections
      .filter((section) => section.id !== sectionId)
      .map((section, index) => ({
        ...section,
        position: index + 1,
      }));

    onChange(nextSections);
  };

  const updateGrid = (sectionId: string, columns: number, rows: number) => {
    updateSection(sectionId, (section) => {
      const maxImages = columns * rows;
      return {
        ...section,
        image_columns: columns,
        image_rows: rows,
        images: section.images.slice(0, maxImages).map((image, index) => ({
          ...image,
          position: index + 1,
        })),
      };
    });
  };

  const handleSelectImage = (item: AdminMediaItem) => {
    if (!pickerState.sectionId || pickerState.position <= 0) return;

    updateSection(pickerState.sectionId, (section) => {
      const nextImages = section.images.filter((image) => image.position !== pickerState.position);
      nextImages.push({
        position: pickerState.position,
        caption: "",
        image: {
          id: item.id,
          name: item.name,
          alt: item.alt,
          url: item.url,
        },
      });

      return {
        ...section,
        images: nextImages.sort((left, right) => left.position - right.position),
      };
    });

    setPickerState({
      open: false,
      sectionId: null,
      position: 0,
      selectedId: null,
    });
  };

  const handleRemoveImage = (sectionId: string, position: number) => {
    updateSection(sectionId, (section) => ({
      ...section,
      images: section.images
        .filter((image) => image.position !== position)
        .map((image, index) => ({
          ...image,
          position: index + 1,
        })),
    }));
  };

  return (
    <div className="space-y-5">
      {sections.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#063e8e]/20 bg-white px-6 py-10 text-center">
          <p className="text-base font-medium text-black">Chưa có nội dung bài viết</p>
          <p className="mt-1 text-sm text-gray-700">
            Bắt đầu bằng section văn bản hoặc section hình ảnh.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => appendSection("text")}
              className="border-[#063e8e]/15 text-gray-700 hover:bg-[#063e8e]/[0.04]"
            >
              <Type className="mr-2 h-4 w-4" />
              Thêm section văn bản
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => appendSection("image")}
              className="border-[#063e8e]/15 text-gray-700 hover:bg-[#063e8e]/[0.04]"
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Thêm section hình ảnh
            </Button>
          </div>
        </div>
      ) : null}

      {sections.map((section) => {
        const maxSlots = section.image_columns * section.image_rows;

        return (
          <div
            key={section.id}
            className="rounded-3xl border border-[#063e8e]/15 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between gap-4 border-b border-[#063e8e]/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#063e8e]/10 text-[#063e8e]">
                  {section.type === "text" ? (
                    <Type className="h-4 w-4" />
                  ) : (
                    <ImageIcon className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Section {section.position}</p>
                  <p className="text-base font-semibold text-black">
                    {section.type === "text" ? "Văn bản" : "Hình ảnh"}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeSection(section.id)}
                className="text-gray-700 hover:bg-red-50 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-5 px-5 py-5">
              {section.type === "text" ? (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Nội dung</Label>
                  <AdminRichTextEditor
                    value={section.content}
                    onChange={(value) =>
                      updateSection(section.id, (current) => ({
                        ...current,
                        content: value,
                      }))
                    }
                    placeholder="Nhập nội dung section văn bản..."
                    minHeight={240}
                  />
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Số cột ảnh</Label>
                      <Select
                        value={String(section.image_columns)}
                        onValueChange={(value) =>
                          updateGrid(section.id, Number(value), section.image_rows)
                        }
                      >
                        <SelectTrigger className="border-[#063e8e]/15 text-gray-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 cột</SelectItem>
                          <SelectItem value="2">2 cột</SelectItem>
                          <SelectItem value="3">3 cột</SelectItem>
                          <SelectItem value="4">4 cột</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Số hàng ảnh</Label>
                      <Select
                        value={String(section.image_rows)}
                        onValueChange={(value) =>
                          updateGrid(section.id, section.image_columns, Number(value))
                        }
                      >
                        <SelectTrigger className="border-[#063e8e]/15 text-gray-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 hàng</SelectItem>
                          <SelectItem value="2">2 hàng</SelectItem>
                          <SelectItem value="3">3 hàng</SelectItem>
                          <SelectItem value="4">4 hàng</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <Label className="text-sm font-medium text-gray-700">
                        Hình ảnh ({section.images.length}/{maxSlots})
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPickerState({
                            open: true,
                            sectionId: section.id,
                            position: Math.min(section.images.length + 1, maxSlots),
                            selectedId: null,
                          })
                        }
                        disabled={section.images.length >= maxSlots}
                        className="border-[#063e8e]/15 text-gray-700 hover:bg-[#063e8e]/[0.04]"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm ảnh
                      </Button>
                    </div>

                    <div
                      className="grid gap-3 rounded-2xl border border-[#063e8e]/10 bg-[#063e8e]/[0.03] p-4"
                      style={{
                        gridTemplateColumns: `repeat(${section.image_columns}, minmax(0, 1fr))`,
                      }}
                    >
                      {Array.from({ length: maxSlots }).map((_, index) => {
                        const position = index + 1;
                        const currentImage = section.images.find(
                          (image) => image.position === position,
                        );
                        const currentImageId = currentImage?.image?.id ?? null;

                        return (
                          <div
                            key={`${section.id}-${position}`}
                            className="group flex flex-col overflow-hidden rounded-2xl border border-dashed border-[#063e8e]/20 bg-white transition hover:border-[#063e8e]/40"
                          >
                            {currentImage ? (
                              <>
                                <div
                                  role="button"
                                  tabIndex={0}
                                  onClick={() =>
                                    setPickerState({
                                      open: true,
                                      sectionId: section.id,
                                      position,
                                      selectedId: currentImageId,
                                    })
                                  }
                                  onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                      event.preventDefault();
                                      setPickerState({
                                        open: true,
                                        sectionId: section.id,
                                        position,
                                        selectedId: currentImageId,
                                      });
                                    }
                                  }}
                                  className="relative h-64 w-full cursor-pointer"
                                >
                                  <SafeNextImage
                                    src={currentImage.image.url}
                                    alt={currentImage.image.alt || currentImage.image.name}
                                    fill
                                    className="object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      handleRemoveImage(section.id, position);
                                    }}
                                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-sm transition hover:text-red-600"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                                <div onClick={(e) => e.stopPropagation()}>
                                  <CaptionEditor
                                    caption={currentImage.caption}
                                    onCaptionChange={(caption) => {
                                      updateSection(section.id, (sec) => ({
                                        ...sec,
                                        images: sec.images.map((img) =>
                                          img.position === position ? { ...img, caption } : img
                                        ),
                                      }));
                                    }}
                                  />
                                </div>
                              </>
                            ) : (
                              <div
                                role="button"
                                tabIndex={0}
                                onClick={() =>
                                  setPickerState({
                                    open: true,
                                    sectionId: section.id,
                                    position,
                                    selectedId: currentImageId,
                                  })
                                }
                                onKeyDown={(event) => {
                                  if (event.key === "Enter" || event.key === " ") {
                                    event.preventDefault();
                                    setPickerState({
                                      open: true,
                                      sectionId: section.id,
                                      position,
                                      selectedId: currentImageId,
                                    });
                                  }
                                }}
                                className="flex h-40 w-full shrink-0 cursor-pointer items-center justify-center px-3 text-center"
                              >
                                <div>
                                  <Upload className="mx-auto mb-2 h-5 w-5 text-[#063e8e]" />
                                  <p className="text-xs font-medium text-gray-700">
                                    Chọn ảnh {position}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => appendSection("text")}
          className="border-[#063e8e]/15 text-gray-700 hover:bg-[#063e8e]/[0.04]"
        >
          <Type className="mr-2 h-4 w-4" />
          Thêm section văn bản
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => appendSection("image")}
          className="border-[#063e8e]/15 text-gray-700 hover:bg-[#063e8e]/[0.04]"
        >
          <ImageIcon className="mr-2 h-4 w-4" />
          Thêm section hình ảnh
        </Button>
      </div>

      <AdminImagePicker
        open={pickerState.open}
        selectedId={pickerState.selectedId}
        onOpenChange={(open) =>
          setPickerState((current) => ({
            ...current,
            open,
            ...(open ? {} : { sectionId: null, position: 0, selectedId: null }),
          }))
        }
        onSelect={handleSelectImage}
      />
    </div>
  );
}
