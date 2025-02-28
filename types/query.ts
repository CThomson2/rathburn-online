import { UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import { Drum, Distillation, Order } from "./models";

// Define response types
export interface PaginatedResponse<T> {
  rows: T[];
  total: number;
  page: number;
  limit: number;
}

// Define query parameter types
export interface DrumQueryParams {
  page?: number;
  limit?: number;
  status?: string | string[];
  material?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
}

// Define typed query hooks
export type UseGetDrumsOptions = UseQueryOptions<
  PaginatedResponse<Drum>,
  Error,
  PaginatedResponse<Drum>,
  ["drums", DrumQueryParams]
>;

export type UseGetDistillationOptions = UseQueryOptions<
  Distillation,
  Error,
  Distillation,
  ["distillation", number]
>;

// Define typed mutation hooks
export type UseUpdateOrderOptions = UseMutationOptions<
  Order,
  Error,
  { id: number; data: Partial<Order> }
>;
