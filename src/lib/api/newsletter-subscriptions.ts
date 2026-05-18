"use client";

import {
  deleteNewsletterSubscriptionId,
  getNewsletterSubscription,
  patchNewsletterSubscriptionId,
  postNewsletterSubscription,
} from "@/api/endpoints/newsletter-subscription";
import type { NewsletterSubscription } from "@/api/models/newsletterSubscription";

export type ClientNewsletterSubscriptionListResult = {
  rows: NewsletterSubscription[];
  count: number;
  page: number;
  pageSize: number;
};

const readNewsletterPageData = (payload: unknown) => {
  const root = payload as {
    responseData?: { rows?: unknown[]; count?: number; page?: number; pageSize?: number };
    data?: { responseData?: { rows?: unknown[]; count?: number; page?: number; pageSize?: number } };
  };

  return root.responseData ?? root.data?.responseData ?? {};
};

export async function fetchNewsletterSubscriptions(params?: {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  filters?: string;
}) {
  const response = await getNewsletterSubscription({
    page: params?.page ?? 1,
    pageSize: params?.pageSize ?? 10,
    sortField: params?.sortField ?? "created_at",
    sortOrder: params?.sortOrder ?? "desc",
    filters: params?.filters,
  });
  const pageData = readNewsletterPageData(response);

  return {
    rows: (pageData.rows ?? []) as NewsletterSubscription[],
    count: pageData.count ?? 0,
    page: pageData.page ?? params?.page ?? 1,
    pageSize: pageData.pageSize ?? params?.pageSize ?? 10,
  } satisfies ClientNewsletterSubscriptionListResult;
}

export async function subscribeNewsletterEmail(email: string) {
  return postNewsletterSubscription({ email: email.trim() });
}

export async function deleteNewsletterSubscription(id: string) {
  return deleteNewsletterSubscriptionId(id);
}

export async function markNewsletterSubscriptionSeen(id: string) {
  return patchNewsletterSubscriptionId(id, { is_seen: true });
}
