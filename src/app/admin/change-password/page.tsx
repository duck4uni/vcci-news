"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Eye, EyeOff, KeyRound, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePutApiV10UserChangePassword } from "@/api/endpoints/user";
import useAuthStore from "@/store/useAuthStore";
import { logoutAdmin } from "@/lib/auth/admin-auth";

export default function ChangePasswordPage() {
  const router = useRouter();
  const appUser = useAuthStore((state) => state.appUser);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);

  const changePasswordMutation = usePutApiV10UserChangePassword();

  const validate = (): string | null => {
    if (!oldPassword.trim()) return "Vui lòng nhập mật khẩu cũ";
    if (newPassword.length < 6) return "Mật khẩu mới phải có ít nhất 6 ký tự";
    if (newPassword === oldPassword) return "Mật khẩu mới phải khác mật khẩu cũ";
    if (newPassword !== confirmPassword) return "Xác nhận mật khẩu không khớp";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        data: {
          oldPassword,
          newPassword,
        },
      });
      setDone(true);
      toast.success("Đổi mật khẩu thành công!");

      // Update store để bỏ must_change_password
      useAuthStore.getState().setAppUser({
        ...appUser,
        must_change_password: false,
      } as typeof appUser);

      // Sau 2s, logout để user đăng nhập lại bằng mật khẩu mới
      setTimeout(async () => {
        await logoutAdmin({ silent: true, redirectToLogin: true });
      }, 2000);
    } catch (err: unknown) {
      const e = err as { message?: string };
      toast.error(e?.message || "Đổi mật khẩu thất bại");
    }
  };

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#063e8e]/5 to-[#f8fbff] p-4">
        <div className="w-full max-w-md rounded-3xl border border-[#063e8e]/10 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#163b73]">Đổi mật khẩu thành công</h1>
          <p className="mt-2 text-sm text-slate-600">
            Mật khẩu của bạn đã được cập nhật. Bạn sẽ được chuyển về trang đăng nhập
            để đăng nhập lại bằng mật khẩu mới.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Đang chuyển hướng...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#063e8e]/5 to-[#f8fbff] p-4">
      <div className="w-full max-w-md rounded-3xl border border-[#063e8e]/10 bg-white p-8 shadow-xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <KeyRound className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#163b73]">Đổi mật khẩu</h1>
          <p className="mt-2 text-sm text-slate-600">
            Đây là lần đầu bạn đăng nhập. Vui lòng đổi mật khẩu để tiếp tục.
          </p>
        </div>

        {/* Warning */}
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-sm text-amber-800">
            Mật khẩu mặc định không được phép sử dụng. Bạn cần tạo mật khẩu mới
            để bảo vệ tài khoản.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Mật khẩu hiện tại *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type={showOld ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Nhập mật khẩu hiện tại"
                className="h-11 rounded-xl border-[#063e8e]/15 pl-10 pr-10"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Mật khẩu mới *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ít nhất 6 ký tự"
                className="h-11 rounded-xl border-[#063e8e]/15 pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Xác nhận mật khẩu mới *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className="h-11 rounded-xl border-[#063e8e]/15 pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-600">Mật khẩu xác nhận không khớp</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={
              !oldPassword ||
              !newPassword ||
              !confirmPassword ||
              newPassword !== confirmPassword ||
              changePasswordMutation.isPending
            }
            className="h-11 w-full rounded-xl bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
          >
            {changePasswordMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Đổi mật khẩu
          </Button>
        </form>
      </div>
    </div>
  );
}
