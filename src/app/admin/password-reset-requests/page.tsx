"use client";

import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  KeyRound,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
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
import { usePermission } from "@/hooks/usePermission";
import { NoPermissionMessage } from "@/components/shared/permission-gate";
import {
  useGetApiV10PasswordResetRequest,
  usePostApiV10PasswordResetRequestIdResolve,
  usePostApiV10PasswordResetRequestIdReject,
  getGetApiV10PasswordResetRequestQueryKey,
} from "@/api/vcci-news/endpoints/password-reset-request";
import {
  type PasswordResetRequest,
  PAGE_SIZE,
  formatDate,
} from "./_components/types";
import { ResolveDialog } from "./_components/resolve-dialog";
import { RejectDialog } from "./_components/reject-dialog";

export default function PasswordResetRequestsPage() {
  const canRead = usePermission("users", "read");
  const canWrite = usePermission("users", "write");

  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<"all" | "PENDING" | "RESOLVED" | "REJECTED">("PENDING");

  // Resolve dialog
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PasswordResetRequest | null>(null);
  const [isResolving, setIsResolving] = useState(false);

  // Reject dialog
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
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

  const data = (queryData as any)?.responseData as
    | { rows: PasswordResetRequest[]; count: number; totalPages: number }
    | null;
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
    setIsResolveDialogOpen(true);
  };

  const handleOpenReject = (req: PasswordResetRequest) => {
    setSelectedRequest(req);
    setIsRejectDialogOpen(true);
  };

  const handleConfirmResolve = (newPassword: string, resolveNote: string) => {
    if (!selectedRequest) return;
    if (!newPassword || newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
    setIsResolving(true);
    resolveMutation.mutate({
      id: selectedRequest.id,
      data: {
        newPassword,
        resolveNote: resolveNote || undefined,
      },
    });
  };

  const handleConfirmReject = (rejectNote: string) => {
    if (!selectedRequest) return;
    setIsRejecting(true);
    rejectMutation.mutate({
      id: selectedRequest.id,
      data: {
        resolveNote: rejectNote || undefined,
      },
    });
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

      <ResolveDialog
        open={isResolveDialogOpen}
        onOpenChange={setIsResolveDialogOpen}
        request={selectedRequest}
        onConfirm={handleConfirmResolve}
        isResolving={isResolving}
      />

      <RejectDialog
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
        request={selectedRequest}
        onConfirm={handleConfirmReject}
        isRejecting={isRejecting}
      />
    </div>
  );
}
