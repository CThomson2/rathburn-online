"use client";
// Import statements
import { useNotifications } from "@/components/ui/notifications";
import { env } from "@/config/env";

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  cookie?: string;
  params?: Record<string, string | number | boolean | undefined | null>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}

/**
 * API Client
 *
 * This file serves as a global API client for the application. It provides a set of utility functions to perform HTTP requests
 * to the backend API.
 *
 * The client is designed to be used across different features in the app, such as discussions and comments,
 * by providing a consistent interface for making API calls. It abstracts the details of building URLs with query parameters,
 * handling server-side cookies, and managing request headers.
 *
 * This allows feature-specific API modules (e.g., use-inventory-stats.ts, use-recent-orders.ts) to focus on their specific logic without worrying about the underlying HTTP request mechanics.
 *
 */
function buildUrlWithParams(
  url: string,
  params?: RequestOptions["params"]
): string {
  if (!params) {
    return url;
  }
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null
    )
  );
  if (Object.keys(filteredParams).length === 0) {
    return url;
  }
  const queryString = new URLSearchParams(
    filteredParams as Record<string, string>
  ).toString();
  return `${url}?${queryString}`;
}

// Function to get server-side cookies
export async function getServerCookies(): Promise<string> {
  if (typeof window !== "undefined") {
    return Promise.resolve("");
  }

  // Dynamic import next/headers only on server-side
  return import("next/headers").then(({ cookies }) => {
    try {
      const cookieStore = cookies();
      return cookieStore
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");
    } catch (error) {
      console.error("Failed to access cookies:", error);
      return "";
    }
  });
}

// Function to fetch API data
async function fetchApi<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = "GET",
    headers = {},
    body,
    cookie,
    params,
    cache = "no-store",
    next,
  } = options;

  // Get cookies from the request when running on server
  let cookieHeader = cookie;
  if (typeof window === "undefined" && !cookie) {
    cookieHeader = await getServerCookies();
  }

  // Use the validated API URL from env config
  const baseUrl =
    typeof window !== "undefined"
      ? "/api/" // Use relative URL in browser
      : env.API_URL || process.env.NEXT_PUBLIC_API_URL; // Use full URL on server
  let fullUrl = buildUrlWithParams(`${baseUrl}${url}`, params);

  // Replace any double slashes with a single slash in the full URL
  fullUrl = fullUrl.replace(/([^:]\/)\/+/g, "$1");

  const response = await fetch(fullUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
    cache,
    next,
  });

  if (!response.ok) {
    const message = (await response.json()).message || response.statusText;
    if (typeof window !== "undefined") {
      useNotifications.getState().addNotification({
        type: "error",
        title: "Error",
        message,
      });
    }
    throw new Error(message);
  }

  return response.json();
}

// API object with methods for different HTTP requests
export const api = {
  get<T>(url: string, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: "GET" });
  },
  post<T>(url: string, body?: any, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: "POST", body });
  },
  put<T>(url: string, body?: any, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: "PUT", body });
  },
  patch<T>(url: string, body?: any, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: "PATCH", body });
  },
  delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: "DELETE" });
  },
};
