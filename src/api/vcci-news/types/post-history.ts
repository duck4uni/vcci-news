import type { UserSummary } from "./user";

export type PostHistoryUser = UserSummary;

export type PostHistoryAction = "CREATE" | "UPDATE" | "DELETE"

export interface PostHistoryChanges {
  [field: string]: {
    old: unknown
    new: unknown
  }
}

export interface PostHistoryItem {
  id: string
  post_id: string
  action: PostHistoryAction
  actor: PostHistoryUser | null
  changes: PostHistoryChanges | null
  snapshot: Record<string, unknown> | null
  created_at: string
}

export interface PostHistoryResponse {
  data: PostHistoryItem[]
  status: string
  message: string
  message_en: string
  timeStamp: string
  violations: string | null
}
