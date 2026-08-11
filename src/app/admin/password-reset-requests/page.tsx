"use client";

import React, { useState } from "react";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  KeyRound,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Copy,
  CheckCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { usePermission } from "@/hooks/usePermission";
import { NoPermissionMessage } from "@/components/shared/permission-gate";
import {
  useGetApiV10PasswordResetRequest,
  usePostApiV10PasswordResetRequestIdResolve,
  usePostApiV10PasswordResetRequestIdReject,
  getGetApiV10PasswordResetRequestQueryKey,
} from "@/api/endpoints/password-reset-request";

interface PasswordResetRequest {
  id: string;
  email: string;
  note?: string | null;
  status: "PENDING" | "RESOLVED" | "REJECTED";
  resolved_by?: string | null;
  resolved_at?: string | null;
  resolve_note?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  resolved_by_user?: {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
  } | null;
}

interface ListResponse {
  rows: PasswordResetRequest[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const PAGE_SIZE = 10;
const DEFAULT_NEW_PASSWORD = "vcci@2026";

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}

export default function PasswordResetRequestsPage() {
  const canRead = usePermission("users", "read");
  const canWrite = usePermission("users", "write");

  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<"all" | "PENDING" | "RESOLVED" | "REJECTED">("PENDING");

  // Resolve dialog
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PasswordResetRequest | null>(null);
  const [newPassword, setNewPassword] = useState(DEFAULT_NEW_PASSWORD);
  const [resolveNote, setResolveNote] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Reject dialog
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  const queryClient = useQueryClient();

  // Query list
  const { data: queryData, isLoading } = useGetApiV10PasswordResetRequest(
    {
      page: currentPage,
      pageSize: PAGE_SIZE,
      status: filterStatus === "all" ? undefined : filterStatus,
      sortField: "created_at",
      sortOrder: "desc",
    },
    {
      query: { enabled: canRead },
    },
  );

  const data = (queryData as any)?.responseData as ListResponse | null;
  const rows = data?.rows || [];
  const total = data?.count || 0;
  const totalPages = data?.totalPages || 1;

  // Mutations
  const resolveMutation = usePostApiV10PasswordResetRequestIdResolve({
    mutation: {
      onSuccess: () => {
        toast.success("Đã reset mật khẩu thành công!");
        setIsResolveDialogOpen(false);
        queryClient.invalidateQueries({
          queryKey: getGetApiV10PasswordResetRequestQueryKey(),
        });
      },
      onError: (error: any) => {
        toast.error(error?.message || "Xử lý yêu cầu thất bại");
      },
      onSettled: () => setIsResolving(false),
    },
  });

  const rejectMutation = usePostApiV10PasswordResetRequestIdReject({
    mutation: {
      onSuccess: () => {
        toast.success("Đã từ chối yêu cầu");
        setIsRejectDialogOpen(false);
        queryClient.invalidateQueries({
          queryKey: getGetApiV10PasswordResetRequestQueryKey(),
        });
      },
      onError: (error: any) => {
        toast.error(error?.message || "Xử lý yêu cầu thất bại");
      },
      onSettled: () => setIsRejecting(false),
    },
  });

  const handleOpenResolve = (req: PasswordResetRequest) => {
    setSelectedRequest(req);
    setNewPassword(DEFAULT_NEW_PASSWORD);
    setResolveNote("");
    setShowPassword(false);
    setIsResolveDialogOpen(true);
  };

  const handleOpenReject = (req: PasswordResetRequest) => {
    setSelectedRequest(req);
    setRejectNote("");
    setIsRejectDialogOpen(true);
  };

  const handleConfirmResolve = async () => {
    if (!selectedRequest) return;
    if (!newPassword.trim() || newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
    setIsResolving(true);
    resolveMutation.mutate({
      id: selectedRequest.id,
      data: {
        newPassword: newPassword.trim(),
        resolveNote: resolveNote.trim() || undefined,
      },
    });
  };

  const handleConfirmReject = async () => {
    if (!selectedRequest) return;
    setIsRejecting(true);
    rejectMutation.mutate({
      id: selectedRequest.id,
      data: {
        resolveNote: rejectNote.trim() || undefined,
      },
    });
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(newPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!canRead) {
    return <NoPermissionMessage />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#163b73]">Yêu cầu reset mật khẩu</h1>
        <p className="mt-1 text-sm text-slate-600">
          Danh sách yêu cầu reset mật khẩu từ user quên mật khẩu ({total} yêu cầu)
        </p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Label className="text-sm text-slate-600">Trạng thái:</Label>
        <Select
          value={filterStatus}
          onValueChange={(v) => {
            setFilterStatus(v as typeof filterStatus);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[180px] rounded-xl border-[#063e8e]/15">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">Chờ xử lý</SelectItem>
            <SelectItem value="RESOLVED">Đã xử lý</SelectItem>
            <SelectItem value="REJECTED">Từ chối</SelectItem>
            <SelectItem value="all">Tất cả</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#063e8e]/10 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
              <TableHeader>
                <TableRow className="border-0 bg-[#063e8e] hover:bg-[#063e8e]">
                  <TableHead className="w-10 py-3 text-center text-white text-sm font-semibold whitespace-nowrap">
                    STT
                  </TableHead>
                  <TableHead className="py-3 text-white text-sm font-semibold whitespace-nowrap">
                    Email
                  </TableHead>
                  <TableHead className="py-3 text-white text-sm font-semibold whitespace-nowrap">
                    Ghi chú
                  </TableHead>
                  <TableHead className="py-3 text-center text-white text-sm font-semibold whitespace-nowrap">
                    Trạng thái
                  </TableHead>
                  <TableHead className="py-3 text-white text-sm font-semibold whitespace-nowrap">
                    Thời gian
                  </TableHead>
                  <TableHead className="py-3 text-white text-sm font-semibold whitespace-nowrap">
                    Người xử lý
                  </TableHead>
                  <TableHead className="w-32 py-3 text-center text-white text-sm font-semibold whitespace-nowrap">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                      Không có yêu cầu nào
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((req, index) => (
                    <TableRow
                      key={req.id}
                      className="border-b border-[#063e8e]/5 hover:bg-[#063e8e]/2"
                    >
                      <TableCell className="text-center text-slate-600 whitespace-nowrap">
                        {(currentPage - 1) * PAGE_SIZE + index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                          <span className="text-sm font-medium text-[#163b73]">
                            {req.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-slate-600 truncate max-w-[200px]">
                          {req.note || "-"}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        {req.status === "PENDING" && (
                          <Badge variant="outline" className="text-sm border-amber-200 bg-amber-50 text-amber-700 whitespace-nowrap">
                            <Clock className="mr-1 h-4 w-4" />
                            Chờ xử lý
                          </Badge>
                        )}
                        {req.status === "RESOLVED" && (
                          <Badge variant="outline" className="text-sm border-green-200 bg-green-50 text-green-700 whitespace-nowrap">
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Đã xử lý
                          </Badge>
                        )}
                        {req.status === "REJECTED" && (
                          <Badge variant="outline" className="text-sm border-red-200 bg-red-50 text-red-700 whitespace-nowrap">
                            <XCircle className="mr-1 h-4 w-4" />
                            Từ chối
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-slate-500 whitespace-nowrap">
                          {formatDate(req.created_at)}
                        </p>
                      </TableCell>
                      <TableCell>
                        {req.resolved_by_user ? (
                          <span className="text-sm text-slate-600">
                            {req.resolved_by_user.email}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {req.status === "PENDING" && canWrite ? (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenResolve(req)}
                              className="h-9 rounded-lg text-green-600 hover:bg-green-50"
                              title="Reset mật khẩu"
                            >
                              <KeyRound className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenReject(req)}
                              className="h-9 rounded-lg text-red-600 hover:bg-red-50"
                              title="Từ chối"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

      {/* Pagination */}
      {total > PAGE_SIZE && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Hiển thị {(currentPage - 1) * PAGE_SIZE + 1} -{" "}
            {Math.min(currentPage * PAGE_SIZE, total)} trong {total} yêu cầu
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || isLoading}
              className="rounded-xl border-[#063e8e]/15"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 text-sm font-medium text-[#163b73]">
              Trang {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage >= totalPages}
              className="rounded-xl border-[#063e8e]/15"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Resolve Dialog */}
      <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
        <DialogContent className="max-w-lg rounded-3xl border-[#063e8e]/15">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#163b73]">Reset mật khẩu</DialogTitle>
            <DialogDescription>
              Reset mật khẩu cho email{" "}
              <strong className="text-[#063e8e]">{selectedRequest?.email}</strong>.
              User sẽ phải đổi mật khẩu khi đăng nhập lần tiếp theo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Mật khẩu mới</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Ít nhất 6 ký tự"
                    className="h-10 rounded-xl border-[#063e8e]/15 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopyPassword}
                  className="h-10 rounded-xl border-[#063e8e]/15"
                  title="Copy mật khẩu"
                >
                  {copied ? <CheckCheck className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-slate-500">
                Mật khẩu mặc định: <code className="rounded bg-slate-100 px-1">{DEFAULT_NEW_PASSWORD}</code>.
                Bạn có thể đổi sang mật khẩu tùy chỉnh.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Ghi chú (tùy chọn)</Label>
              <Textarea
                value={resolveNote}
                onChange={(e) => setResolveNote(e.target.value)}
                placeholder="VD: Đã gọi điện xác nhận, đã gửi mật khẩu qua Zalo..."
                rows={3}
                className="rounded-xl border-[#063e8e]/15 resize-none"
              />
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Lưu ý: Sau khi reset, bạn cần gửi mật khẩu mới cho user qua kênh khác
              (điện thoại, Zalo, email cá nhân, etc.).
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsResolveDialogOpen(false)}
              className="h-10 rounded-xl border-[#063e8e]/15"
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmResolve}
              disabled={isResolving || newPassword.length < 6}
              className="h-10 rounded-xl bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
            >
              {isResolving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reset mật khẩu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="max-w-md rounded-3xl border-[#063e8e]/15">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#163b73]">Từ chối yêu cầu</DialogTitle>
            <DialogDescription>
              Từ chối yêu cầu reset mật khẩu cho email{" "}
              <strong className="text-[#063e8e]">{selectedRequest?.email}</strong>?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Lý do từ chối (tùy chọn)</Label>
            <Textarea
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="VD: Email không tồn tại trong hệ thống, không thể xác minh danh tính..."
              rows={3}
              className="rounded-xl border-[#063e8e]/15 resize-none"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsRejectDialogOpen(false)}
              className="h-10 rounded-xl border-[#063e8e]/15"
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmReject}
              disabled={isRejecting}
              className="h-10 rounded-xl bg-red-600 text-white hover:bg-red-700"
            >
              {isRejecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Từ chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
