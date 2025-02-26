import { PrismaNewDrums } from "../base";
import { DrumStatus } from "./constant";

// Base type from Prisma schema - this will update when schema changes
export type DrumBase = PrismaNewDrums;

// Extended type that includes related data from the orders table
export interface DrumBatch extends Omit<DrumBase, "order_id"> {
  order_id?: number;
  supplier?: string;
  date_ordered?: Date | null;
}

// Type for the query parameters
export interface DrumQueryParams {
  page: number;
  limit: number;
  sortField?: keyof DrumBatch;
  sortOrder?: "asc" | "desc";
  status: DrumStatus.Type[];
}

// Type for the API response
export interface DrumsResponse {
  drums: DrumBatch[];
  total: number;
}

// Formatted type for client display
export interface FormattedDrum
  extends Omit<
    DrumBatch,
    "created_at" | "updated_at" | "date_processed" | "date_ordered"
  > {
  created_at: string | null;
  updated_at: string | null;
  date_processed: string | null;
  date_ordered: string | null;
}
