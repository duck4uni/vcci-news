"use client";

import React from "react";
import { toast } from "sonner";
import {
  HeaderCategoryDeleteDialog,
  HeaderCategoryFlatRow,
  HeaderCategoryFormDialog,
  HeaderCategoryFormValues,
  HeaderCategoryFormMode,
  HeaderCategoryStats,
  HeaderCategoryTable,
} from "./components";
import {
  CmsHeaderCategoryItem,
  createHeaderConfigItem,
  deleteHeaderConfigItem,
  fetchHeaderConfigItems,
  updateHeaderConfigItem,
} from "@/lib/api/cms-admin";
import {
  buildHeaderCategoryTree,
  HeaderCategoryItem,
  HeaderCategoryTreeItem,
  toSlug,
} from "@/mockdata/header-config";

const EMPTY_HEADER_CATEGORY_FORM: HeaderCategoryFormValues = {
  name: "",
  slug: "",
  sort_order: "1",
  parent_id: "",
  type: "page",
  description: "",
};

const PROTECTED_HOME_CATEGORY_ID = "root-home";

function isProtectedHomeCategory(itemId?: string | null) {
  return itemId === PROTECTED_HOME_CATEGORY_ID;
}

function toFormValues(item?: CmsHeaderCategoryItem | null): HeaderCategoryFormValues {
  if (!item) return EMPTY_HEADER_CATEGORY_FORM;

  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    sort_order: String(item.sort_order),
    parent_id: item.parent_id ?? "",
    type: item.type,
    description: item.description ?? "",
  };
}

type ManagedHeaderCategoryItem = HeaderCategoryItem & {
  code: string;
  api_parent_id: string | null;
};

function useHeaderConfigModule() {
  const [items, setItems] = React.useState<ManagedHeaderCategoryItem[]>([]);
  const [rootStaticLink, setRootStaticLink] = React.useState("/");
  const [isReady, setIsReady] = React.useState(false);

  const load = React.useCallback(async () => {
    const headerConfig = await fetchHeaderConfigItems();

    setItems(headerConfig.items as ManagedHeaderCategoryItem[]);
    setRootStaticLink(headerConfig.rootStaticLink);
    setIsReady(true);
  }, []);

  React.useEffect(() => {
    void load().catch((error) => {
      toast.error(error instanceof Error ? error.message : "Không thể tải cấu hình danh mục");
      setIsReady(true);
    });
  }, [load]);

  const tree = React.useMemo(() => buildHeaderCategoryTree(items), [items]);

  return {
    items,
    tree,
    rootStaticLink,
    isReady,
    reload: load,
  };
}

export default function HeaderConfigPage() {
  const { items, tree, rootStaticLink, isReady, reload } = useHeaderConfigModule();

  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const [search, setSearch] = React.useState("");
  const [formMode, setFormMode] = React.useState<HeaderCategoryFormMode>("create");
  const [formOpen, setFormOpen] = React.useState(false);
  const [formValues, setFormValues] = React.useState<HeaderCategoryFormValues>(
    EMPTY_HEADER_CATEGORY_FORM,
  );
  const [deleteTarget, setDeleteTarget] = React.useState<HeaderCategoryTreeItem | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!isReady) return;

    setExpanded((previous) => {
      const next = { ...previous };

      const walk = (nodes: HeaderCategoryTreeItem[]) => {
        nodes.forEach((item) => {
          if (!(item.id in next)) {
            next[item.id] = true;
          }

          if (item.children.length > 0) {
            walk(item.children);
          }
        });
      };

      walk(tree);
      return next;
    });
  }, [isReady, tree]);

  const flatRows = React.useMemo(() => {
    const rows: HeaderCategoryFlatRow[] = [];

    const walk = (nodes: HeaderCategoryTreeItem[], depth = 0) => {
      nodes.forEach((item) => {
        rows.push({ ...item, depth, parentId: item.parent_id });
        if (item.children.length > 0) {
          walk(item.children, depth + 1);
        }
      });
    };

    walk(tree);
    return rows;
  }, [tree]);

  const itemMap = React.useMemo(
    () => new Map(items.map((item) => [item.id, item])),
    [items],
  );

  const visibleRows = React.useMemo(() => {
    return flatRows.filter((row) => {
      const keyword = search.trim().toLowerCase();
      const matchesSearch =
        !keyword ||
        row.name.toLowerCase().includes(keyword) ||
        row.slug.toLowerCase().includes(keyword);

      if (!matchesSearch) return false;
      if (row.depth === 0) return true;

      let parent = row.parentId;
      while (parent) {
        if (!expanded[parent]) return false;
        const parentRow = flatRows.find((entry) => entry.id === parent);
        parent = parentRow?.parentId ?? null;
      }

      return true;
    });
  }, [expanded, flatRows, search]);

  const categoryParentOptions = React.useMemo(
    () => tree.filter((item) => item.type === "category"),
    [tree],
  );

  const editingItem = React.useMemo(
    () => flatRows.find((item) => item.id === formValues.id) ?? null,
    [flatRows, formValues.id],
  );

  const canChangeParent = React.useMemo(() => {
    if (!editingItem) return true;
    return editingItem.children.length === 0 || !formValues.parent_id;
  }, [editingItem, formValues.parent_id]);

  const openCreateRoot = () => {
    setFormMode("create");
    setFormValues(EMPTY_HEADER_CATEGORY_FORM);
    setFormOpen(true);
  };

  const openCreateChild = (item: HeaderCategoryTreeItem) => {
    if (item.parent_id || item.type !== "category") return;

    setFormMode("create");
    setFormValues({
      ...EMPTY_HEADER_CATEGORY_FORM,
      parent_id: item.id,
      sort_order: String(item.children.length + 1),
      type: "page",
    });
    setExpanded((previous) => ({ ...previous, [item.id]: true }));
    setFormOpen(true);
  };

  const openEdit = (item: HeaderCategoryTreeItem) => {
    if (isProtectedHomeCategory(item.id)) return;

    const fullItem = itemMap.get(item.id) ?? null;
    setFormMode("edit");
    setFormValues(toFormValues(fullItem));
    setFormOpen(true);
  };

  const resolveParentContext = (parentId: string) => {
    if (!parentId) {
      return {
        apiParentId: "",
        parentStaticLink: rootStaticLink,
      };
    }

    const parent = itemMap.get(parentId);
    return {
      apiParentId: parent?.id ?? "",
      parentStaticLink: parent?.static_link ?? rootStaticLink,
    };
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (isProtectedHomeCategory(formValues.id)) {
      return;
    }

    if (!formValues.name.trim()) {
      toast.error("Tên danh mục là bắt buộc");
      return;
    }

    if (!formValues.slug.trim()) {
      toast.error("Slug danh mục là bắt buộc");
      return;
    }

    if (formValues.parent_id) {
      const parent = tree.find((item) => item.id === formValues.parent_id);
      if (!parent || parent.type !== "category") {
        toast.error("Danh mục cha không hợp lệ");
        return;
      }
    }

    if (formValues.parent_id && formValues.type === "category") {
      toast.error("Danh mục con không được có thể loại Danh mục");
      return;
    }

    if (editingItem && editingItem.children.length > 0 && formValues.parent_id) {
      toast.error(
        "Danh mục đang có danh mục con nên không thể chuyển thành danh mục con",
      );
      return;
    }

    if (editingItem && editingItem.children.length > 0 && formValues.type !== "category") {
      toast.error("Danh mục đang có danh mục con phải giữ thể loại Danh mục");
      return;
    }

    const parentContext = resolveParentContext(formValues.parent_id);

    setIsSubmitting(true);

    try {
      const payload = {
        name: formValues.name.trim(),
        slug: formValues.slug.trim() || toSlug(formValues.name),
        sort_order: Number(formValues.sort_order) || 1,
        type: formValues.type,
        api_parent_id: parentContext.apiParentId,
        parent_static_link: parentContext.parentStaticLink,
      };

      if (formMode === "create") {
        await createHeaderConfigItem(payload);
        toast.success("Tạo danh mục thành công");
      } else if (formValues.id) {
        await updateHeaderConfigItem(formValues.id, payload);
        toast.success("Cập nhật danh mục thành công");
      }

      await reload();
      setFormOpen(false);
      setFormValues(EMPTY_HEADER_CATEGORY_FORM);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể lưu danh mục");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || isSubmitting) return;

    if (isProtectedHomeCategory(deleteTarget.id)) {
      setDeleteTarget(null);
      return;
    }

    setIsSubmitting(true);

    try {
      await deleteHeaderConfigItem(deleteTarget.id);
      toast.success("Xóa danh mục thành công");
      setDeleteTarget(null);
      await reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể xóa danh mục");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <HeaderCategoryStats
        total={flatRows.length}
        root={flatRows.filter((item) => !item.parentId).length}
        nested={flatRows.filter((item) => item.parentId).length}
      />

      <HeaderCategoryTable
        rows={visibleRows}
        expanded={expanded}
        isLoading={!isReady}
        searchValue={search}
        onSearchChange={setSearch}
        onToggle={(id) =>
          setExpanded((previous) => ({ ...previous, [id]: !(previous[id] ?? true) }))
        }
        onCreateRoot={openCreateRoot}
        onCreateChild={openCreateChild}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />

      <HeaderCategoryFormDialog
        mode={formMode}
        open={formOpen}
        values={formValues}
        parentOptions={categoryParentOptions}
        canChangeParent={canChangeParent}
        onOpenChange={setFormOpen}
        onValuesChange={setFormValues}
        onSubmit={() => void handleSubmit()}
      />

      <HeaderCategoryDeleteDialog
        target={deleteTarget}
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}
