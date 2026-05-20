"use client";

import { useCustomClient } from "@/api/mutator/custom-client";

export interface LogoItem {
  id: string;
  logo_name: string;
  logo_url: string | null;
  file_id: string;
  created_at: string;
  created_by?: string | null;
  updated_at: string;
  updated_by?: string | null;
}

export interface LogoListResult {
  rows: LogoItem[];
  count: number;
  page: number;
  pageSize: number;
}

interface LogoEnvelope<T> {
  message?: string;
  message_en?: string;
  responseData?: T;
  data?: T;
  error?: string;
  status?: string;
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readMessage = (payload: unknown) => {
  if (!isObject(payload)) return "Yêu cầu thất bại";
  if (typeof payload.message === "string" && payload.message.trim()) return payload.message;
  if (typeof payload.error === "string" && payload.error.trim()) return payload.error;
  return "Yêu cầu thất bại";
};

const authHeaders = (withJson = true) => {
  const headers = new Headers();
  if (withJson) {
    headers.set("Content-Type", "application/json");
  }
  return headers;
};

async function logoRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const payload = await useCustomClient<LogoEnvelope<T> | T>(path, {
    ...init,
    headers: init?.headers ?? authHeaders(init?.body !== undefined),
  });

  if (isObject(payload) && "statusCode" in payload) {
    const statusCode = Number(payload.statusCode);
    if (statusCode >= 400) {
      throw new Error(readMessage(payload));
    }
  }

  if (isObject(payload) && ("responseData" in payload || "data" in payload)) {
    return ((payload.responseData ?? payload.data) as T) ?? ({} as T);
  }

  return (payload ?? {}) as T;
}

export async function fetchCmsLogos() {
  return logoRequest<LogoListResult>("/logo?page=1&pageSize=10");
}

export async function createCmsLogo(input: {
  logo_name: string;
  logo_url?: string | null;
  file_id: string;
}) {
  return logoRequest<LogoItem>("/logo", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateCmsLogo(
  id: string,
  input: {
    logo_name?: string;
    logo_url?: string | null;
    file_id?: string;
  }
) {
  return logoRequest<LogoItem>(`/logo/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function deleteCmsLogo(id: string) {
  await logoRequest(`/logo/${id}`, {
    method: "DELETE",
  });
}
