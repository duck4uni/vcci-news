'use client';

import React, { useEffect, useState } from 'react';
import {
  useGetConfig,
  usePutConfig,
  getGetConfigQueryKey,
} from '@/api/endpoints/website-config';
import { WebConfig } from '@/api/models/webConfig';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Save, Globe, Phone, Mail, MapPin, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export default function WebsiteConfigPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useGetConfig({});

  const config: WebConfig | undefined =
    (data as any)?.responseData ?? (data as any)?.data ?? undefined;

  const [form, setForm] = useState<WebConfig>({
    name: '',
    name_en: '',
    address: '',
    address_en: '',
    logo: '',
    link: '',
    phone: '',
    email: '',
    social: '',
  });

  useEffect(() => {
    if (config) {
      setForm({
        name: config.name ?? '',
        name_en: config.name_en ?? '',
        address: config.address ?? '',
        address_en: config.address_en ?? '',
        logo: config.logo ?? '',
        link: config.link ?? '',
        phone: config.phone ?? '',
        email: config.email ?? '',
        social: config.social ?? '',
      });
    }
  }, [config]);

  const { mutate: save, isPending } = usePutConfig({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getGetConfigQueryKey() });
        toast.success('Đã lưu thông tin website!');
      },
      onError: () => {
        toast.error('Có lỗi khi lưu thông tin. Vui lòng thử lại.');
      },
    },
  });

  const setField = <K extends keyof WebConfig>(key: K, value: WebConfig[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config?.id) return;
    save({ params: { filters: String(config.id) }, data: form });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Thông tin website</h2>
        <p className="text-sm text-gray-500 mt-1">
          Cập nhật thông tin chung hiển thị trên website VCCI News.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tên website */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-[#063e8e]" /> Tên & Logo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Tên (Tiếng Việt)</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setField('name', e.target.value)}
                    placeholder="VCCI HCM"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="name_en">Tên (Tiếng Anh)</Label>
                  <Input
                    id="name_en"
                    value={form.name_en}
                    onChange={(e) => setField('name_en', e.target.value)}
                    placeholder="VCCI HCM (English)"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="logo">URL Logo</Label>
                <div className="flex gap-3 items-start">
                  <Input
                    id="logo"
                    value={form.logo}
                    onChange={(e) => setField('logo', e.target.value)}
                    placeholder="https://..."
                    className="flex-1"
                  />
                  {form.logo && (
                    <img
                      src={form.logo}
                      alt="logo preview"
                      className="h-10 w-auto border rounded object-contain"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="link">
                  <LinkIcon className="inline h-3.5 w-3.5 mr-1" />
                  Đường dẫn website
                </Label>
                <Input
                  id="link"
                  value={form.link}
                  onChange={(e) => setField('link', e.target.value)}
                  placeholder="https://vccihn.com"
                />
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Liên hệ */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#063e8e]" /> Thông tin liên hệ
              </CardTitle>
              <CardDescription className="text-xs">Hiển thị ở footer và trang liên hệ.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone">
                    <Phone className="inline h-3.5 w-3.5 mr-1" />
                    Điện thoại
                  </Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setField('phone', e.target.value)}
                    placeholder="028 xxxx xxxx"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">
                    <Mail className="inline h-3.5 w-3.5 mr-1" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setField('email', e.target.value)}
                    placeholder="info@vcci.com.vn"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address">
                  <MapPin className="inline h-3.5 w-3.5 mr-1" />
                  Địa chỉ (Tiếng Việt)
                </Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => setField('address', e.target.value)}
                  placeholder="171 Võ Thị Sáu, Quận 3, TP.HCM"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address_en">
                  <MapPin className="inline h-3.5 w-3.5 mr-1" />
                  Địa chỉ (Tiếng Anh)
                </Label>
                <Input
                  id="address_en"
                  value={form.address_en}
                  onChange={(e) => setField('address_en', e.target.value)}
                  placeholder="171 Vo Thi Sau, District 3, HCMC"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="social">Mạng xã hội (URL Facebook / Fanpage)</Label>
                <Input
                  id="social"
                  value={form.social}
                  onChange={(e) => setField('social', e.target.value)}
                  placeholder="https://facebook.com/vccihn"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending || !config?.id} className="bg-[#063e8e] hover:bg-[#063e8e]/90">
              <Save size={15} className="mr-2" />
              {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
