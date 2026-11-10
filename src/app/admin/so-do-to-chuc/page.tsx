"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
	ExternalLink,
	FilePlus2,
	Minus,
	Redo2,
	Save,
	Undo2,
	UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui";
import { NoPermissionMessage } from "@/components/shared/permission-gate";
import { usePermission } from "@/hooks/usePermission";
import {
	postApiV10OrgChartPublish,
	putApiV10OrgChartDraft,
	useGetApiV10OrgChartDraft,
} from "@/api/vcci-news/endpoints/org-chart";
import type { OrgChartDocument as OrgChartDocumentModel } from "@/api/vcci-news/models";
import type { OrgChartDocument } from "@/components/org-chart/types";
import type { OrgCardNodeType, OrgLineNodeType } from "@/components/org-chart/types";
import type { OrgChartEditorController } from "./_components/org-chart-editor";
import { OrgCardInspector } from "./_components/org-card-inspector";

// React Flow cần đo DOM → canvas load ở client (next/dynamic ssr:false).
const OrgChartEditor = dynamic(
	() => import("./_components/org-chart-editor").then((m) => m.OrgChartEditor),
	{
		ssr: false,
		loading: () => (
			<div className="flex h-full items-center justify-center">
				<Spinner />
			</div>
		),
	},
);

const CHART_SLUG = "so-do-to-chuc";
const CHART_NAME = "Sơ đồ tổ chức VCCI-HCM";
const HISTORY_LIMIT = 50;
const HISTORY_DEBOUNCE_MS = 400;

const formatDateTime = (value?: string | null) => {
	if (!value) return "";
	try {
		return new Date(value).toLocaleString("vi-VN", { hour12: false });
	} catch {
		return value;
	}
};

export default function AdminOrgChartPage() {
	const canRead = usePermission("settings", "read");
	const canWrite = usePermission("settings", "write");

	const controllerRef = useRef<OrgChartEditorController | null>(null);
	const [editorReady, setEditorReady] = useState(false);
	const [selectedNode, setSelectedNode] = useState<OrgCardNodeType | OrgLineNodeType | null>(null);
	const [dirty, setDirty] = useState(false);
	const [saving, setSaving] = useState(false);
	const [publishing, setPublishing] = useState(false);

	// Undo/redo: history các snapshot document (JSON string)
	const historyRef = useRef({
		past: [] as string[],
		future: [] as string[],
		lastSnapshot: "",
		debounceTimer: null as ReturnType<typeof setTimeout> | null,
		applying: false,
	});
	const [historyState, setHistoryState] = useState({ canUndo: false, canRedo: false });

	// Ưu tiên bản nháp; nếu chưa có bản nháp nhưng đã xuất bản thì mở bản public để sửa tiếp.
	const { data, isLoading, isError } = useGetApiV10OrgChartDraft({ slug: CHART_SLUG });
	const chart = data?.responseData ?? null;
	const initialDocument = (chart?.draft_snapshot ?? chart?.published_snapshot ?? null) as
		| OrgChartDocument
		| null;

	const handleReady = useCallback((controller: OrgChartEditorController) => {
		controllerRef.current = controller;

		controller.subscribeSelection((node) => setSelectedNode(node));

		controller.subscribeDocumentChange(() => {
			setDirty(true);
			// Debounce push snapshot vào undo history (tránh push mỗi frame khi drag)
			const history = historyRef.current;
			if (history.debounceTimer) clearTimeout(history.debounceTimer);
			history.debounceTimer = setTimeout(() => {
				if (history.applying) {
					history.applying = false;
					return;
				}
				const snapshot = JSON.stringify(controller.getDocument());
				if (!history.lastSnapshot) {
					history.lastSnapshot = snapshot;
					return;
				}
				if (snapshot !== history.lastSnapshot) {
					history.past.push(history.lastSnapshot);
					if (history.past.length > HISTORY_LIMIT) history.past.shift();
					history.future = [];
					history.lastSnapshot = snapshot;
					setHistoryState({ canUndo: true, canRedo: false });
				}
			}, HISTORY_DEBOUNCE_MS);
		});

		setEditorReady(true);
	}, []);

	const applyHistorySnapshot = useCallback((snapshot: string) => {
		const controller = controllerRef.current;
		if (!controller) return;
		historyRef.current.lastSnapshot = snapshot;
		historyRef.current.applying = true;
		controller.applyDocument(JSON.parse(snapshot) as OrgChartDocument);
		setHistoryState({
			canUndo: historyRef.current.past.length > 0,
			canRedo: historyRef.current.future.length > 0,
		});
		setDirty(true);
	}, []);

	const handleUndo = useCallback(() => {
		const history = historyRef.current;
		const previous = history.past.pop();
		if (!previous) return;
		history.future.push(history.lastSnapshot);
		applyHistorySnapshot(previous);
	}, [applyHistorySnapshot]);

	const handleRedo = useCallback(() => {
		const history = historyRef.current;
		const next = history.future.pop();
		if (!next) return;
		history.past.push(history.lastSnapshot);
		applyHistorySnapshot(next);
	}, [applyHistorySnapshot]);

	// Keyboard shortcut: Ctrl+Z / Ctrl+Y (Ctrl+Shift+Z). Bỏ qua khi đang gõ trong input.
	useEffect(() => {
		if (!canWrite || !editorReady) return;

		const handler = (event: KeyboardEvent) => {
			if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "z" && event.key.toLowerCase() !== "y") {
				return;
			}
			const target = event.target as HTMLElement | null;
			if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
				return;
			}
			event.preventDefault();
			if (event.key.toLowerCase() === "z" && !event.shiftKey) {
				handleUndo();
			} else {
				handleRedo();
			}
		};

		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [canWrite, editorReady, handleUndo, handleRedo]);

	// Cảnh báo khi rời trang còn thay đổi chưa lưu (external API → effect)
	useBeforeUnloadGuard(
		useCallback(
			(event: BeforeUnloadEvent) => {
				if (dirty) event.preventDefault();
			},
			[dirty],
		),
		dirty,
	);

	const saveDraft = useCallback(async () => {
		const controller = controllerRef.current;
		if (!controller) throw new Error("Canvas chưa sẵn sàng");

		const document = controller.getDocument();
		const response = await putApiV10OrgChartDraft({
			slug: CHART_SLUG,
			name: CHART_NAME,
			document: document as unknown as OrgChartDocumentModel,
		});
		return response;
	}, []);

	const handleSaveDraft = useCallback(async () => {
		setSaving(true);
		try {
			await saveDraft();
			setDirty(false);
			toast.success("Đã lưu bản nháp sơ đồ tổ chức");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Không thể lưu bản nháp");
		} finally {
			setSaving(false);
		}
	}, [saveDraft]);

	const handlePublish = useCallback(async () => {
		setPublishing(true);
		try {
			// Xuất bản luôn lưu nháp trước để chắc chắn published = canvas hiện tại
			await saveDraft();
			const response = await postApiV10OrgChartPublish({ slug: CHART_SLUG });
			setDirty(false);
			toast.success(
				`Đã xuất bản sơ đồ tổ chức${response?.responseData?.published_at ? ` lúc ${formatDateTime(response.responseData.published_at)}` : ""}`,
			);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Không thể xuất bản");
		} finally {
			setPublishing(false);
		}
	}, [saveDraft]);

	const handleAddCard = useCallback(() => {
		controllerRef.current?.addCard();
	}, []);

	const handleAddLine = useCallback(() => {
		controllerRef.current?.addLine();
	}, []);

	if (!canRead) {
		return <NoPermissionMessage />;
	}

	return (
		<div className="flex min-h-[calc(100vh-120px)] flex-col gap-3">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h1 className="text-xl font-semibold text-slate-900">Sơ đồ tổ chức</h1>
					<p className="text-xs text-slate-500">
						{chart?.is_published
							? `Đã xuất bản: ${formatDateTime(chart?.published_at)}`
							: "Chưa xuất bản"}
						{chart?.updated_at ? ` · Nháp cập nhật: ${formatDateTime(chart?.updated_at)}` : ""}
						{dirty ? " · Có thay đổi chưa lưu" : ""}
					</p>
				</div>

				{canWrite ? (
					<div className="flex flex-wrap items-center gap-2">
						<Button variant="outline" onClick={handleAddCard} disabled={!editorReady}>
							<FilePlus2 className="h-4 w-4" />
							Thêm card
						</Button>
						<Button variant="outline" onClick={handleAddLine} disabled={!editorReady}>
							<Minus className="h-4 w-4" />
							Thêm đường kẻ
						</Button>
						<Button
							variant="outline"
							size="icon"
							onClick={handleUndo}
							disabled={!historyState.canUndo}
							aria-label="Hoàn tác (Ctrl+Z)"
							title="Hoàn tác (Ctrl+Z)"
						>
							<Undo2 className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							onClick={handleRedo}
							disabled={!historyState.canRedo}
							aria-label="Làm lại (Ctrl+Y)"
							title="Làm lại (Ctrl+Y)"
						>
							<Redo2 className="h-4 w-4" />
						</Button>
						<Button variant="outline" onClick={handleSaveDraft} disabled={saving || !editorReady}>
							{saving ? <Spinner className="h-4 w-4" /> : <Save className="h-4 w-4" />}
							Lưu nháp
						</Button>
						<Button onClick={handlePublish} disabled={publishing || !editorReady}>
							{publishing ? <Spinner className="h-4 w-4" /> : <UploadCloud className="h-4 w-4" />}
							Xuất bản
						</Button>
						<Link
							href="/so-do-to-chuc"
							target="_blank"
							className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
						>
							<ExternalLink className="h-3.5 w-3.5" />
							Xem trang public
						</Link>
					</div>
				) : null}
			</div>

			{!isLoading && isError ? (
				<div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
					Không thể tải dữ liệu sơ đồ hiện có. Bạn vẫn có thể vẽ sơ đồ mới và lưu nháp.
				</div>
			) : null}

			<div className="flex min-h-[640px] flex-1 overflow-hidden rounded-lg border border-slate-200 bg-white">
				<div className="relative flex-1">
					{isLoading ? (
						<div className="flex h-full items-center justify-center">
							<Spinner />
						</div>
					) : (
						<OrgChartEditor document={initialDocument} onReady={handleReady} />
					)}
				</div>
				{editorReady ? (
					<OrgCardInspector
						node={selectedNode}
						onChange={(partial) => controllerRef.current?.updateSelectedData(partial)}
						onDelete={() => controllerRef.current?.deleteSelected()}
					/>
				) : null}
			</div>
		</div>
	);
}

function useBeforeUnloadGuard(handler: (event: BeforeUnloadEvent) => void, enabled: boolean) {
	useEffect(() => {
		if (!enabled) return;
		window.addEventListener("beforeunload", handler);
		return () => window.removeEventListener("beforeunload", handler);
	}, [handler, enabled]);
}
