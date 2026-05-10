'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import {
  HeaderCategoryDeleteDialog,
  HeaderCategoryFlatRow,
  HeaderCategoryFormDialog,
  HeaderCategoryFormValues,
  HeaderCategoryFormMode,
  HeaderCategoryStats,
  HeaderCategoryTable,
} from './components';
import { Button } from '@/components/ui/button';
import {
  buildHeaderCategoryTree,
  createHeaderCategoryId,
  getHeaderCategorySeed,
  HEADER_CONFIG_STORAGE_KEY,
  HeaderCategoryItem,
  HeaderCategoryTreeItem,
  normalizeHeaderCategories,
  toSlug,
} from '@/mockdata/header-config';

const EMPTY_HEADER_CATEGORY_FORM: HeaderCategoryFormValues = {
  name: '',
  slug: '',
  sort_order: '1',
  parent_id: '',
  type: 'page',
  description: '',
  category_ids: [],
};

function toFormValues(item?: HeaderCategoryItem | null): HeaderCategoryFormValues {
  if (!item) return EMPTY_HEADER_CATEGORY_FORM;

  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    sort_order: String(item.sort_order),
    parent_id: item.parent_id ?? '',
    type: item.type,
    description: item.description ?? '',
    category_ids: item.category_ids ?? [],
  };
}

function getInitialHeaderConfig() {
  if (typeof window === 'undefined') {
    return getHeaderCategorySeed();
  }

  const raw = window.localStorage.getItem(HEADER_CONFIG_STORAGE_KEY);
  if (!raw) return getHeaderCategorySeed();

  try {
    const parsed = JSON.parse(raw) as HeaderCategoryItem[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return getHeaderCategorySeed();
    }

    return normalizeHeaderCategories(parsed);
  } catch {
    return getHeaderCategorySeed();
  }
}

function persistHeaderConfig(items: HeaderCategoryItem[]) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(
    HEADER_CONFIG_STORAGE_KEY,
    JSON.stringify(normalizeHeaderCategories(items)),
  );
}

function upsertHeaderCategory(items: HeaderCategoryItem[], item: HeaderCategoryItem) {
  const exists = items.some((entry) => entry.id === item.id);
  const next = exists
    ? items.map((entry) => (entry.id === item.id ? item : entry))
    : [...items, item];

  return normalizeHeaderCategories(next);
}

function deleteHeaderCategory(items: HeaderCategoryItem[], id: string) {
  const childIds = new Set<string>();

  const collect = (targetId: string) => {
    childIds.add(targetId);
    items
      .filter((item) => item.parent_id === targetId)
      .forEach((child) => collect(child.id));
  };

  collect(id);
  return normalizeHeaderCategories(items.filter((item) => !childIds.has(item.id)));
}

function useHeaderConfigModule() {
  const [items, setItems] = React.useState<HeaderCategoryItem[]>([]);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    setItems(getInitialHeaderConfig());
    setIsReady(true);
  }, []);

  React.useEffect(() => {
    if (!isReady) return;
    persistHeaderConfig(items);
  }, [isReady, items]);

  const tree = React.useMemo(() => buildHeaderCategoryTree(items), [items]);

  const createItem = React.useCallback((values: HeaderCategoryFormValues) => {
    const nextItem: HeaderCategoryItem = {
      id: createHeaderCategoryId(),
      name: values.name.trim(),
      slug: values.slug.trim() || toSlug(values.name),
      static_link: '',
      sort_order: Number(values.sort_order) || 1,
      type: values.type,
      is_article: values.type === 'news',
      parent_id: values.parent_id || null,
      level: 1,
      category_ids: values.type === 'news' ? values.category_ids : [],
      description: values.description.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setItems((current) => upsertHeaderCategory(current, nextItem));
  }, []);

  const updateItem = React.useCallback((values: HeaderCategoryFormValues) => {
    if (!values.id) return;

    setItems((current) => {
      const existing = current.find((item) => item.id === values.id);
      if (!existing) return current;

      return upsertHeaderCategory(current, {
        ...existing,
        name: values.name.trim(),
        slug: values.slug.trim() || toSlug(values.name),
        sort_order: Number(values.sort_order) || 1,
        type: values.type,
        is_article: values.type === 'news',
        parent_id: values.parent_id || null,
        category_ids: values.type === 'news' ? values.category_ids : [],
        description: values.description.trim(),
        updated_at: new Date().toISOString(),
      });
    });
  }, []);

  const removeItem = React.useCallback((id: string) => {
    setItems((current) => deleteHeaderCategory(current, id));
  }, []);

  return {
    tree,
    isReady,
    createItem,
    updateItem,
    removeItem,
    toFormValues,
  };
}

export default function HeaderConfigPage() {
  const { tree, isReady, createItem, updateItem, removeItem, toFormValues } =
    useHeaderConfigModule();

  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const [search, setSearch] = React.useState('');
  const [formMode, setFormMode] = React.useState<HeaderCategoryFormMode>('create');
  const [formOpen, setFormOpen] = React.useState(false);
  const [formValues, setFormValues] = React.useState<HeaderCategoryFormValues>(
    EMPTY_HEADER_CATEGORY_FORM,
  );
  const [deleteTarget, setDeleteTarget] = React.useState<HeaderCategoryTreeItem | null>(null);

  React.useEffect(() => {
    if (!isReady) return;

    setExpanded((previous) => {
      const next = { ...previous };

      const walk = (items: HeaderCategoryTreeItem[]) => {
        items.forEach((item) => {
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

    const walk = (items: HeaderCategoryTreeItem[], depth = 0) => {
      items.forEach((item) => {
        rows.push({ ...item, depth, parentId: item.parent_id });
        if (item.children.length > 0) {
          walk(item.children, depth + 1);
        }
      });
    };

    walk(tree);
    return rows;
  }, [tree]);

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
    () => tree.filter((item) => item.type === 'category'),
    [tree],
  );

  const groupedCount = React.useMemo(
    () => flatRows.filter((item) => item.children.length > 0).length,
    [flatRows],
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
    setFormMode('create');
    setFormValues(EMPTY_HEADER_CATEGORY_FORM);
    setFormOpen(true);
  };

  const openCreateChild = (item: HeaderCategoryTreeItem) => {
    if (item.parent_id || item.type !== 'category') return;

    setFormMode('create');
    setFormValues({
      ...EMPTY_HEADER_CATEGORY_FORM,
      parent_id: item.id,
      sort_order: String(item.children.length + 1),
      type: 'page',
    });
    setExpanded((previous) => ({ ...previous, [item.id]: true }));
    setFormOpen(true);
  };

  const openEdit = (item: HeaderCategoryTreeItem) => {
    setFormMode('edit');
    setFormValues(toFormValues(item));
    setFormOpen(true);
  };

  const handleSubmit = () => {
    if (!formValues.name.trim()) {
      toast.error('Tên danh mục là bắt buộc');
      return;
    }

    if (formValues.parent_id) {
      const parent = tree.find((item) => item.id === formValues.parent_id);
      if (!parent || parent.type !== 'category') {
        toast.error('Danh mục cha không hợp lệ');
        return;
      }
    }

    if (formValues.parent_id && formValues.type === 'category') {
      toast.error('Danh mục con không được có thể loại Danh mục');
      return;
    }

    if (editingItem && editingItem.children.length > 0 && formValues.parent_id) {
      toast.error('Danh mục đang có danh mục con nên không thể chuyển thành danh mục con');
      return;
    }

    if (editingItem && editingItem.children.length > 0 && formValues.type !== 'category') {
      toast.error('Danh mục đang có danh mục con phải giữ thể loại Danh mục');
      return;
    }

    if (formMode === 'create') {
      createItem(formValues);
      toast.success('Tạo danh mục thành công');
    } else {
      updateItem(formValues);
      toast.success('Cập nhật danh mục thành công');
    }

    setFormOpen(false);
    setFormValues(EMPTY_HEADER_CATEGORY_FORM);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    removeItem(deleteTarget.id);
    toast.success('Xóa danh mục thành công');
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-8">
      <HeaderCategoryStats
        total={flatRows.length}
        root={flatRows.filter((item) => !item.parentId).length}
        nested={flatRows.filter((item) => item.parentId).length}
        grouped={groupedCount}
      />

      <HeaderCategoryTable
        rows={visibleRows}
        expanded={expanded}
        isLoading={!isReady}
        searchValue={search}
        action={
          <Button
            className="bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
            onClick={openCreateRoot}
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm danh mục
          </Button>
        }
        onSearchChange={setSearch}
        onToggle={(id) =>
          setExpanded((previous) => ({ ...previous, [id]: !(previous[id] ?? true) }))
        }
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
        onSubmit={handleSubmit}
      />

      <HeaderCategoryDeleteDialog
        target={deleteTarget}
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
