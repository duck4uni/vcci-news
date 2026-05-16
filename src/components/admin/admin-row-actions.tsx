"use client";

import type { ReactNode } from "react";

import Link from "next/link";
import {
  Eye,
  EyeOff,
  FileText,
  FolderPlus,
  PencilLine,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AdminRowActionKind =
  | "edit"
  | "view"
  | "hidden"
  | "visible"
  | "delete"
  | "manage"
  | "create-child";

type AdminRowActionBase = {
  label: string;
  disabled?: boolean;
};

type AdminRowAction =
  | (AdminRowActionBase & {
      kind: "edit";
      onClick: () => void;
    })
  | (AdminRowActionBase & {
      kind: "view";
      onClick: () => void;
    })
  | (AdminRowActionBase & {
      kind: "visible";
      onClick?: () => void;
    })
  | (AdminRowActionBase & {
      kind: "hidden";
      onClick?: () => void;
    })
  | (AdminRowActionBase & {
      kind: "delete";
      onClick: () => void;
    })
  | (AdminRowActionBase & {
      kind: "manage";
      href: string;
    })
  | (AdminRowActionBase & {
      kind: "create-child";
      onClick: () => void;
    });

interface AdminRowActionsProps {
  actions: AdminRowAction[];
  className?: string;
}

const actionStyles: Record<
  AdminRowActionKind,
  {
    button: string;
    icon: ReactNode;
  }
> = {
  edit: {
    button:
      "border-[#063e8e]/15 bg-white text-[#063e8e] hover:border-[#063e8e]/25 hover:bg-[#063e8e]/10 hover:text-[#063e8e]",
    icon: <PencilLine className="h-4 w-4" />,
  },
  view: {
    button:
      "border-emerald-100 bg-white text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700",
    icon: <Eye className="h-4 w-4" />,
  },
  visible: {
    button:
      "border-emerald-100 bg-white text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700",
    icon: <Eye className="h-4 w-4" />,
  },
  hidden: {
    button:
      "border-red-100 bg-white text-red-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700",
    icon: <EyeOff className="h-4 w-4" />,
  },
  delete: {
    button:
      "border-red-100 bg-white text-red-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700",
    icon: <Trash2 className="h-4 w-4" />,
  },
  manage: {
    button:
      "border-[#063e8e]/15 bg-white text-[#063e8e] hover:border-[#063e8e]/25 hover:bg-[#063e8e]/10 hover:text-[#063e8e]",
    icon: <FileText className="h-4 w-4" />,
  },
  "create-child": {
    button:
      "border-sky-100 bg-white text-sky-600 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700",
    icon: <FolderPlus className="h-4 w-4" />,
  },
};

function AdminRowActionButton({ action }: { action: AdminRowAction }) {
  const style = actionStyles[action.kind];

  const sharedClassName = cn("h-8 w-8 rounded-lg shadow-sm", style.button);

  if (action.kind === "manage") {
    return (
      <Button
        asChild
        type="button"
        variant="outline"
        size="icon"
        title={action.label}
        aria-label={action.label}
        disabled={action.disabled}
        className={sharedClassName}
      >
        <Link href={action.href}>{style.icon}</Link>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      title={action.label}
      aria-label={action.label}
      disabled={action.disabled}
      onClick={action.onClick}
      className={sharedClassName}
    >
      {style.icon}
    </Button>
  );
}

export function AdminRowActions({ actions, className }: AdminRowActionsProps) {
  if (actions.length === 0) return null;

  return (
    <div className={cn("flex items-center justify-center gap-1.5", className)}>
      {actions.map((action) => (
        <AdminRowActionButton key={`${action.kind}-${action.label}`} action={action} />
      ))}
    </div>
  );
}
