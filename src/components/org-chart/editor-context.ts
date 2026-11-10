"use client";

import { createContext, useContext } from "react";

/**
 * Context nối custom node (org-line) với editor: node cần báo "document đã
 * đổi" (khi resize NodeResizer) để editor đánh dấu dirty + push undo history.
 * Viewer không cung cấp provider → các thao tác notify là no-op.
 */
export type OrgChartEditorContextValue = {
	notifyDocumentChange: () => void;
};

export const OrgChartEditorContext = createContext<OrgChartEditorContextValue | null>(null);

export const useOrgChartEditor = () => useContext(OrgChartEditorContext);
