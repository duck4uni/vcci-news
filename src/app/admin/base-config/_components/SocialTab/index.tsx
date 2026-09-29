"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGetApiV10SiteInformationSocials,
  usePatchApiV10SiteInformationSocialsId,
} from "@/api/vcci-news/endpoints/site-information";
import type { SiteInformationSocialLink } from "@/api/vcci-news/models";
import type { BaseConfigSocialItem } from "@/mockdata/base-config";
import {
  mapConfigSocialToApi,
  mapApiSocialToConfig,
} from "./_components/utils";
import { fieldClassName } from "../types";

export function SocialTab() {
  const { data: socialsData, isLoading: isSocialsLoading } =
    useGetApiV10SiteInformationSocials();
  const { mutateAsync: updateSocial, isPending: isUpdatingSocials } =
    usePatchApiV10SiteInformationSocialsId();
  const [socials, setSocials] = useState<BaseConfigSocialItem[]>([]);
  const socialsResponse = socialsData as
    | {
      responseData?: SiteInformationSocialLink[];
      data?: { responseData?: SiteInformationSocialLink[] };
    }
    | undefined;
  const apiSocials =
    socialsResponse?.responseData ?? socialsResponse?.data?.responseData ?? [];

  useEffect(() => {
    if (apiSocials.length) setSocials(apiSocials.map(mapApiSocialToConfig));
  }, [apiSocials]);

  const change = <K extends keyof BaseConfigSocialItem>(
    id: string,
    key: K,
    value: BaseConfigSocialItem[K],
  ) => {
    setSocials((previous) =>
      previous.map((social) =>
        social.id === id ? { ...social, [key]: value } : social,
      ),
    );
  };
  const save = async () => {
    try {
      await Promise.all(
        socials.map((social) =>
          updateSocial({
            id: social.id,
            data: mapConfigSocialToApi(social),
          }),
        ),
      );
      toast.success("Đã lưu cấu hình mạng xã hội");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể lưu cấu hình mạng xã hội",
      );
    }
  };

  return (
    <TabsContent value="social" className="mt-0" aria-busy={isSocialsLoading}>
      <Card className="rounded-[30px] border-[#063e8e]/10 shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-2xl text-[#163b73]">
                Mạng xã hội
              </CardTitle>
              <CardDescription className="mt-2 text-sm text-slate-600">
                Quản lý link mạng xã hội và thứ tự hiển thị.
              </CardDescription>
            </div>
            <Button type="button" onClick={save} disabled={isUpdatingSocials}>
              <Save className="mr-2 h-4 w-4" />
              {isUpdatingSocials ? "Đang lưu..." : "Lưu cấu hình"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          {socials.map((item) => (
            <div
              key={item.id}
              className="rounded-[28px] border border-[#063e8e]/10 bg-[#f8fbff] p-5"
            >
              <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)_180px] lg:items-end">
                <div className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-4">
                  <Checkbox
                    checked={item.isVisible}
                    onCheckedChange={(checked) =>
                      change(item.id, "isVisible", checked === true)
                    }
                  />
                  <div>
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-sm text-slate-500">
                      {item.isVisible ? "Đang hiển thị" : "Đang ẩn"}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Link URL</Label>
                  <Input
                    value={item.url}
                    onChange={(event) =>
                      change(item.id, "url", event.target.value)
                    }
                    placeholder={`Nhập link ${item.label}...`}
                    className={fieldClassName}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Thứ tự hiển thị</Label>
                  <Input
                    type="number"
                    min={1}
                    value={item.sortOrder}
                    onChange={(event) =>
                      change(
                        item.id,
                        "sortOrder",
                        Number(event.target.value || 1),
                      )
                    }
                    className={fieldClassName}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
