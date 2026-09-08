"use client";

import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type MemberField } from "@/mockdata/members";

const fieldClassName =
  "border-[#063e8e]/15 bg-white text-gray-700 placeholder:text-gray-700 focus-visible:ring-[#063e8e]/30";

interface FieldFormDialogProps {
  open: boolean;
  initial: MemberField | null;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { id?: string; name: string }) => void;
}

export function FieldFormDialog({ open, initial, onOpenChange, onSave }: FieldFormDialogProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (open) setName(initial?.name ?? "");
  }, [open, initial]);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Vui lòng nhập tên lĩnh vực");
      return;
    }
    onSave({ id: initial?.id, name: trimmed });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-[#063e8e]/15 bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#063e8e]">
            {initial ? "Chỉnh sửa lĩnh vực" : "Thêm lĩnh vực mới"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-gray-700">
              Tên lĩnh vực <span className="text-red-500">*</span>
            </Label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nhập tên lĩnh vực..."
              className={fieldClassName}
              onKeyDown={(event) => event.key === "Enter" && handleSave()}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="border-[#063e8e]/15 text-gray-700"
              onClick={() => onOpenChange(false)}
            >
              <X className="mr-2 h-4 w-4" />
              Hủy
            </Button>
            <Button
              type="button"
              className="bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
              onClick={handleSave}
            >
              <Save className="mr-2 h-4 w-4" />
              Lưu
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
