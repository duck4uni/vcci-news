"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BranchCard } from "./_components/BranchCard";
import { fieldClassName } from "../types";
import {
  mapApiBranchToConfig,
  mapConfigBranchToApi,
} from "./_components/utils";
import {
  EMPTY_BASE_CONFIG_BRANCH,
  createBaseConfigItemId,
  sortBaseConfigBranches,
  type BaseConfigBranchItem,
} from "@/mockdata/base-config";
import type { SiteInformationBranch } from "@/api/vcci-news/models";
import {
  useDeleteApiV10SiteInformationBranchesId,
  useGetApiV10SiteInformationBranches,
  usePatchApiV10SiteInformationBranchesId,
  usePostApiV10SiteInformationBranches,
} from "@/api/vcci-news/endpoints/site-information";

export function ContactTab() {
  const {
    data: branchesData,
    isLoading: isBranchesLoading,
    refetch: refetchBranches,
  } = useGetApiV10SiteInformationBranches();
  const { mutateAsync: createBranch } = usePostApiV10SiteInformationBranches();
  const { mutateAsync: updateBranch } =
    usePatchApiV10SiteInformationBranchesId();
  const { mutateAsync: deleteBranch } =
    useDeleteApiV10SiteInformationBranchesId();
  const branchesResponse = branchesData as
    | {
      responseData?: SiteInformationBranch[];
      data?: { responseData?: SiteInformationBranch[] };
    }
    | undefined;
  const apiBranches =
    branchesResponse?.responseData ??
    branchesResponse?.data?.responseData ??
    [];
  const [branches, setBranches] = useState<BaseConfigBranchItem[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const current = useMemo(
    () =>
      branches.find((branch) => branch.id === currentId) ?? branches[0] ?? null,
    [branches, currentId],
  );

  useEffect(() => {
    const next = apiBranches.map(mapApiBranchToConfig);
    setBranches(next);
    setCurrentId((previous) =>
      previous && next.some((branch) => branch.id === previous)
        ? previous
        : (next[0]?.id ?? null),
    );
  }, [apiBranches]);

  const change = <K extends keyof BaseConfigBranchItem>(
    key: K,
    value: BaseConfigBranchItem[K],
  ) => {
    if (!current) return;
    setBranches((previous) =>
      previous.map((branch) =>
        branch.id === current.id ? { ...branch, [key]: value } : branch,
      ),
    );
  };
  const add = async () => {
    setSaving(true);
    try {
      const response = await createBranch({
        data: {
          branch_name: `Chi nhánh ${branches.length + 1}`,
          sort_order: branches.length + 1,
          is_active: true,
        },
      });
      const createdResponse = response as
        | {
          responseData?: SiteInformationBranch;
          data?: { responseData?: SiteInformationBranch };
        }
        | undefined;
      const created =
        createdResponse?.responseData ?? createdResponse?.data?.responseData;
      const next = created
        ? mapApiBranchToConfig(created)
        : {
          ...EMPTY_BASE_CONFIG_BRANCH,
          id: createBaseConfigItemId("branch"),
          branchName: `Chi nhánh ${branches.length + 1}`,
          sortOrder: branches.length + 1,
        };
      setBranches((previous) => [...previous, next]);
      setCurrentId(next.id);
      toast.success("Đã thêm chi nhánh mới");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể thêm chi nhánh",
      );
    } finally {
      setSaving(false);
    }
  };
  const remove = async (id: string) => {
    setSaving(true);
    try {
      await deleteBranch({ id });
      const next = branches.filter((branch) => branch.id !== id);
      setBranches(next);
      setCurrentId(next[0]?.id ?? null);
      toast.success("Đã xóa chi nhánh");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể xóa chi nhánh",
      );
    } finally {
      setSaving(false);
    }
  };
  const save = async () => {
    setSaving(true);
    try {
      await Promise.all(
        sortBaseConfigBranches(branches).map((branch, index) =>
          updateBranch({
            id: branch.id,
            data: mapConfigBranchToApi(branch, index),
          }),
        ),
      );
      toast.success("Đã lưu danh sách chi nhánh");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể lưu danh sách chi nhánh",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <TabsContent value="contact" className="mt-0" aria-busy={isBranchesLoading}>
      <Card className="rounded-[30px] border-[#063e8e]/10 shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-2xl text-[#163b73]">
                Thông tin liên hệ website
              </CardTitle>
              <CardDescription className="mt-2 text-sm text-slate-600">
                Quản lý nhiều địa chỉ chi nhánh.
              </CardDescription>
            </div>
            <div className="flex gap-3">
              <Button type="button" onClick={add}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm chi nhánh
              </Button>
              <Button type="button" onClick={save} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Đang lưu..." : "Lưu danh sách chi nhánh"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 px-4 sm:px-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div className="space-y-4 rounded-[28px] border border-[#063e8e]/10 bg-[#f8fbff] p-5">
            <div className="text-sm font-semibold uppercase text-[#4b74b8]">
              Danh sách chi nhánh
            </div>
            {branches.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                Không có data chi nhánh
              </div>
            ) : (
              branches.map((branch) => (
                <BranchCard
                  key={branch.id}
                  branch={branch}
                  current={current?.id === branch.id}
                  onSelect={() => setCurrentId(branch.id)}
                  onDelete={() => remove(branch.id)}
                />
              ))
            )}
          </div>
          <div className="space-y-5 rounded-[28px] border border-[#063e8e]/10 bg-[#f8fbff] p-5">
            {current ? (
              <>
                <div className="space-y-2">
                  <Label>Tên chi nhánh</Label>
                  <Input
                    value={current.branchName}
                    onChange={(event) =>
                      change("branchName", event.target.value)
                    }
                    className={fieldClassName}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Địa chỉ</Label>
                  <Input
                    value={current.address}
                    onChange={(event) => change("address", event.target.value)}
                    className={fieldClassName}
                  />
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <Label>Hotline</Label>
                    <Input
                      value={current.hotline}
                      onChange={(event) =>
                        change("hotline", event.target.value)
                      }
                      className={fieldClassName}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      value={current.email}
                      onChange={(event) => change("email", event.target.value)}
                      className={fieldClassName}
                    />
                  </div>
                  <div>
                    <Label>Fax</Label>
                    <Input
                      value={current.fax}
                      onChange={(event) => change("fax", event.target.value)}
                      className={fieldClassName}
                    />
                  </div>
                  <div>
                    <Label>Google Maps</Label>
                    <Input
                      value={current.mapsEmbedUrl}
                      onChange={(event) =>
                        change("mapsEmbedUrl", event.target.value)
                      }
                      className={fieldClassName}
                    />
                  </div>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <Label>Thứ tự hiển thị</Label>
                    <Input
                      type="number"
                      value={current.sortOrder}
                      onChange={(event) =>
                        change("sortOrder", Number(event.target.value || 1))
                      }
                      className={fieldClassName}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border bg-white px-4 py-3">
                    <div>
                      <div className="font-medium">Trạng thái hiển thị</div>
                      <div className="text-xs text-gray-500">
                        {current.isVisible ? "Đang hiển thị" : "Đang ẩn"}
                      </div>
                    </div>
                    <Switch
                      checked={current.isVisible}
                      onCheckedChange={(value) => change("isVisible", value)}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="py-10 text-center text-sm text-gray-500">
                Chưa có chi nhánh nào.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
