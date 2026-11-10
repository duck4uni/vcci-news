"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	AlignCenter,
	AlignLeft,
	AlignRight,
	GripVertical,
	ImagePlus,
	Plus,
	Trash2,
	Type,
} from "lucide-react";
import { useCallback, useState } from "react";
import type {
	OrgCardNodeData,
	OrgCardNodeType,
	OrgCardRow,
	OrgCardRowAlign,
	OrgLineNodeData,
	OrgLineNodeType,
} from "@/components/org-chart/types";
import { ORG_TEXT_ROW_COLORS } from "@/components/org-chart/types";

/**
 * Inspector panel cho trang editor /admin/so-do-to-chuc: form sửa nội dung node
 * đang chọn trên canvas.
 * - org-card: tiêu đề phòng ban + danh sách HÀNG nội dung (row) — user thêm
 *   hàng theo thứ tự (row 1, 2, 3...), chọn kiểu text/image, căn
 *   center/left/right; hàng text đổi được màu.
 * - org-line: góc xoay, màu, độ dày, nét đứt của đường kẻ tự do.
 * Panel chỉ hiện khi đang chọn 1 node (ẩn để canvas chiếm trọn chiều rộng).
 */

type SelectedNode = OrgCardNodeType | OrgLineNodeType;

const LINE_COLORS = ["#ff0000", "#20364b", "#174a83", "#64748b", "#16a34a", "#f59e0b"];

const ALIGN_OPTIONS: Array<{ value: OrgCardRowAlign; icon: typeof AlignLeft; label: string }> = [
	{ value: "left", icon: AlignLeft, label: "Trái" },
	{ value: "center", icon: AlignCenter, label: "Giữa" },
	{ value: "right", icon: AlignRight, label: "Phải" },
];

export function OrgCardInspector({
	node,
	onChange,
	onDelete,
}: {
	node: SelectedNode | null;
	onChange: (partial: Partial<OrgCardNodeData> | Partial<OrgLineNodeData>) => void;
	onDelete: () => void;
}) {
	if (!node) {
		return null;
	}

	if (node.type === "org-line") {
		return (
			<OrgLineInspector
				data={node.data as OrgLineNodeData}
				onChange={onChange as (partial: Partial<OrgLineNodeData>) => void}
				onDelete={onDelete}
			/>
		);
	}

	return (
		<OrgCardRowsInspector
			data={node.data as OrgCardNodeData}
			onChange={onChange as (partial: Partial<OrgCardNodeData>) => void}
			onDelete={onDelete}
		/>
	);
}

// ---------------------------------------------------------------------
// Panel sửa đường kẻ
// ---------------------------------------------------------------------
function OrgLineInspector({
	data,
	onChange,
	onDelete,
}: {
	data: OrgLineNodeData;
	onChange: (partial: Partial<OrgLineNodeData>) => void;
	onDelete: () => void;
}) {
	const { rotation, color, thickness, dashed } = data;

	return (
		<aside className="flex w-80 shrink-0 flex-col gap-3 overflow-y-auto border-l border-slate-200 bg-slate-50 p-4">
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-semibold text-slate-800">Sửa đường kẻ</h3>
				<Button
					variant="ghost"
					size="sm"
					className="text-red-600 hover:text-red-700"
					onClick={onDelete}
				>
					<Trash2 className="h-4 w-4" />
					Xoá
				</Button>
			</div>

			<div className="space-y-1">
				<Label className="text-xs text-slate-600">Góc xoay ({rotation}°)</Label>
				<input
					type="range"
					min={0}
					max={359}
					step={1}
					value={rotation}
					onChange={(event) => onChange({ rotation: Number(event.target.value) })}
					className="w-full accent-[#174a83]"
				/>
			</div>

			<div className="space-y-1">
				<Label className="text-xs text-slate-600">Màu</Label>
				<div className="flex items-center gap-2">
					{LINE_COLORS.map((lineColor) => (
						<button
							key={lineColor}
							type="button"
							aria-label={`Màu ${lineColor}`}
							onClick={() => onChange({ color: lineColor })}
							className={`h-6 w-6 rounded-full border-2 ${color === lineColor ? "border-slate-900" : "border-transparent"}`}
							style={{ background: lineColor }}
						/>
					))}
				</div>
			</div>

			<div className="space-y-1">
				<Label className="text-xs text-slate-600">Độ dày</Label>
				<div className="flex items-center gap-2">
					{[1, 2, 4, 6].map((t) => (
						<Button
							key={t}
							variant={thickness === t ? "default" : "outline"}
							size="sm"
							onClick={() => onChange({ thickness: t })}
						>
							{t}px
						</Button>
					))}
				</div>
			</div>

			<div className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2">
				<Label htmlFor="org-line-dashed" className="text-xs text-slate-600">
					Nét đứt
				</Label>
				<Switch
					id="org-line-dashed"
					checked={dashed}
					onCheckedChange={(checked) => onChange({ dashed: checked })}
				/>
			</div>

			<p className="text-xs text-slate-400">
				Kéo cạnh đường kẻ trên canvas để giãn chiều dài; dùng slider để xoay.
			</p>
		</aside>
	);
}

// ---------------------------------------------------------------------
// Panel sửa card — danh sách hàng (row) nội dung
// ---------------------------------------------------------------------
function OrgCardRowsInspector({
	data,
	onChange,
	onDelete,
}: {
	data: OrgCardNodeData;
	onChange: (partial: Partial<OrgCardNodeData>) => void;
	onDelete: () => void;
}) {
	const { variant, departmentTitle, featured, rows } = data;

	const setRows = useCallback(
		(next: OrgCardRow[]) => onChange({ rows: next }),
		[onChange],
	);

	const updateRow = useCallback(
		(index: number, changes: Partial<OrgCardRow>) => {
			setRows(
				rows.map((row, i) =>
					i === index ? ({ ...row, ...changes } as OrgCardRow) : row,
				),
			);
		},
		[rows, setRows],
	);

	const removeRow = useCallback(
		(index: number) => setRows(rows.filter((_, i) => i !== index)),
		[rows, setRows],
	);

	const addTextRow = useCallback(
		() => setRows([...rows, { kind: "text", align: "left", text: "", fontSize: 16, bold: true }]),
		[rows, setRows],
	);

	const addImageRow = useCallback(
		() => setRows([...rows, { kind: "image", align: "center", src: "" }]),
		[rows, setRows],
	);

	// Kéo-thả đổi thứ tự hàng: giữ vào grip (⠿) rồi thả xuống hàng khác
	const [dragIndex, setDragIndex] = useState<number | null>(null);
	const [overIndex, setOverIndex] = useState<number | null>(null);

	const clearDragState = useCallback(() => {
		setDragIndex(null);
		setOverIndex(null);
	}, []);

	const handleRowDrop = useCallback(
		(targetIndex: number) => {
			if (dragIndex === null || dragIndex === targetIndex) {
				clearDragState();
				return;
			}
			const next = [...rows];
			const [moved] = next.splice(dragIndex, 1);
			next.splice(targetIndex, 0, moved);
			setRows(next);
			clearDragState();
		},
		[dragIndex, rows, setRows, clearDragState],
	);

	return (
		<aside className="flex w-80 shrink-0 flex-col gap-3 overflow-y-auto border-l border-slate-200 bg-slate-50 p-4">
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-semibold text-slate-800">Sửa card</h3>
				<Button
					variant="ghost"
					size="sm"
					className="text-red-600 hover:text-red-700"
					onClick={onDelete}
				>
					<Trash2 className="h-4 w-4" />
					Xoá card
				</Button>
			</div>

			<div className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2">
				<Label htmlFor="org-card-variant" className="text-xs text-slate-600">
					Card phòng ban
				</Label>
				<Switch
					id="org-card-variant"
					checked={variant === "department"}
					onCheckedChange={(checked) =>
						onChange({ variant: checked ? "department" : "person" })
					}
				/>
			</div>

			{/* Bề rộng card: slider + input nhập trực tiếp (cũng kéo được resize handle trên canvas) */}
			<div className="space-y-1 rounded-md border border-slate-200 bg-white px-3 py-2">
				<div className="flex items-center justify-between gap-2">
					<Label htmlFor="org-card-width" className="text-xs text-slate-600">
						Bề rộng card
					</Label>
					<input
						type="number"
						min={160}
						max={520}
						step={10}
						value={data.w}
						onChange={(event) => {
							const value = Number(event.target.value);
							if (!Number.isNaN(value) && value >= 160 && value <= 520) {
								onChange({ w: value });
							}
						}}
						className="h-7 w-20 rounded-md border border-slate-200 px-2 text-right text-xs"
						aria-label="Nhập bề rộng card"
					/>
				</div>
				<input
					id="org-card-width"
					type="range"
					min={160}
					max={520}
					step={10}
					value={data.w}
					onChange={(event) => onChange({ w: Number(event.target.value) })}
					className="w-full accent-[#174a83]"
				/>
			</div>

			<div className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2">
				<Label htmlFor="org-card-featured" className="text-xs text-slate-600">
					Card nổi bật (nền xanh)
				</Label>
				<Switch
					id="org-card-featured"
					checked={featured}
					onCheckedChange={(checked) => onChange({ featured: checked })}
				/>
			</div>

			{variant === "department" ? (
				<div className="space-y-1">
					<Label className="text-xs text-slate-600">Tên phòng ban</Label>
					<Input
						value={departmentTitle}
						onChange={(event) => onChange({ departmentTitle: event.target.value })}
					/>
				</div>
			) : null}

			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<Label className="text-xs text-slate-600">Các hàng nội dung ({rows.length})</Label>
				</div>

				{rows.map((row, index) => (
					<div
						key={index}
						onDragOver={(event) => {
							if (dragIndex === null) return;
							event.preventDefault();
							setOverIndex(index);
						}}
						onDrop={() => handleRowDrop(index)}
						className={`space-y-2 rounded-md border bg-white p-3 ${
							dragIndex !== null && overIndex === index && dragIndex !== index
								? "border-dashed border-[#174a83]"
								: "border-slate-200"
						}`}
					>
						{/* Tiêu đề hàng: grip kéo-thả + kiểu hàng + xoá */}
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-1.5">
								<span
									draggable
									onDragStart={(event) => {
										setDragIndex(index);
										event.dataTransfer.setData("text/plain", String(index));
										event.dataTransfer.effectAllowed = "move";
									}}
									onDragEnd={clearDragState}
									className="cursor-grab rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 active:cursor-grabbing"
									aria-label="Kéo để đổi thứ tự hàng"
									title="Kéo để đổi thứ tự"
								>
									<GripVertical className="h-4 w-4" />
								</span>
								<span className="text-xs font-semibold text-slate-700">
									{row.kind === "text" ? "Chữ" : "Ảnh"}
								</span>
							</div>
							<Button
								variant="ghost"
								size="sm"
								className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
								onClick={() => removeRow(index)}
								aria-label="Xoá hàng"
							>
								<Trash2 className="h-3.5 w-3.5" />
							</Button>
						</div>

						{/* Đổi kiểu hàng: Chữ / Ảnh */}
						<div className="flex items-center gap-1.5">
							<Button
								variant={row.kind === "text" ? "default" : "outline"}
								size="sm"
								className="h-7 flex-1"
								onClick={() => updateRow(index, { kind: "text", text: row.kind === "text" ? row.text : "" })}
							>
								<Type className="h-3.5 w-3.5" />
								Chữ
							</Button>
							<Button
								variant={row.kind === "image" ? "default" : "outline"}
								size="sm"
								className="h-7 flex-1"
								onClick={() =>
									updateRow(index, {
										kind: "image",
										src: row.kind === "image" ? row.src : "",
									})
								}
							>
								<ImagePlus className="h-3.5 w-3.5" />
								Ảnh
							</Button>
						</div>

						{/* Căn lề: trái / giữa / phải */}
						<div className="flex items-center gap-1.5">
							{ALIGN_OPTIONS.map(({ value, icon: Icon, label }) => (
								<Button
									key={value}
									variant={row.align === value ? "default" : "outline"}
									size="sm"
									className="h-7 flex-1"
									onClick={() => updateRow(index, { align: value })}
									aria-label={`Căn ${label}`}
								>
									<Icon className="h-3.5 w-3.5" />
									{label}
								</Button>
							))}
						</div>

						{row.kind === "text" ? (
							<>
								<Input
									placeholder="Nội dung hàng chữ"
									value={row.text}
									onChange={(event) => updateRow(index, { text: event.target.value })}
								/>
								{/* Cỡ chữ + độ đậm của hàng này */}
								<div className="flex items-center gap-2">
									<div className="flex flex-1 items-center gap-2">
										<input
											type="range"
											min={10}
											max={40}
											step={1}
											value={row.fontSize ?? 16}
											onChange={(event) => updateRow(index, { fontSize: Number(event.target.value) })}
											className="w-full accent-[#174a83]"
											aria-label="Cỡ chữ"
										/>
										<input
											type="number"
											min={10}
											max={40}
											step={1}
											value={row.fontSize ?? 16}
											onChange={(event) => {
												const value = Number(event.target.value);
												if (!Number.isNaN(value) && value >= 10 && value <= 40) {
													updateRow(index, { fontSize: value });
												}
											}}
											className="h-7 w-16 shrink-0 rounded-md border border-slate-200 px-2 text-right text-xs"
											aria-label="Nhập cỡ chữ"
										/>
									</div>
									<Button
										variant={row.bold === false ? "outline" : "default"}
										size="sm"
										className="h-7 w-9 p-0 font-bold"
										onClick={() => updateRow(index, { bold: row.bold === false ? true : false })}
										aria-label="Chuyển độ đậm chữ"
										title="Đậm / thường"
									>
										B
									</Button>
								</div>
								{/* Màu chữ: "Tự động" (theo theme card) + bảng màu brand */}
								<div className="flex items-center gap-1.5 flex-wrap">
									<Button
										variant={!row.color ? "default" : "outline"}
										size="sm"
										className="h-7"
										onClick={() => updateRow(index, { color: undefined })}
									>
										Tự động
									</Button>
									{ORG_TEXT_ROW_COLORS.map((textColor) => (
										<button
											key={textColor}
											type="button"
											aria-label={`Màu chữ ${textColor}`}
											onClick={() => updateRow(index, { color: textColor })}
											className={`h-6 w-6 rounded-full border-2 ${row.color === textColor ? "border-slate-900" : "border-slate-200"}`}
											style={{ background: textColor }}
										/>
									))}
								</div>
							</>
						) : (
							<div className="flex items-center gap-2">
								<input
									type="file"
									accept="image/*"
									className="text-xs text-slate-500 file:mr-2 file:rounded-md file:border-0 file:bg-slate-100 file:px-2 file:py-1 file:text-xs"
									onChange={(event) => {
										const file = event.target.files?.[0];
										if (!file) return;
										const reader = new FileReader();
										reader.onload = () => {
											updateRow(index, { src: String(reader.result), alt: file.name });
										};
										reader.readAsDataURL(file);
									}}
								/>
								{row.src ? (
									<Button
										variant="ghost"
										size="sm"
										className="h-6 px-2 text-xs text-red-600"
										onClick={() => updateRow(index, { src: "" })}
									>
										Gỡ ảnh
									</Button>
								) : null}
							</div>
						)}
					</div>
				))}

				<div className="flex items-center gap-2">
					<Button variant="outline" size="sm" className="flex-1" onClick={addTextRow}>
						<Plus className="h-3.5 w-3.5" />
						Hàng chữ
					</Button>
					<Button variant="outline" size="sm" className="flex-1" onClick={addImageRow}>
						<ImagePlus className="h-3.5 w-3.5" />
						Hàng ảnh
					</Button>
				</div>
			</div>
		</aside>
	);
}
