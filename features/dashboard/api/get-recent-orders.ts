import { api } from "@/lib/api-client";
import { RecentOrdersResponse } from "../types/api";

export const getRecentOrders = (
  searchTerm?: string
): Promise<RecentOrdersResponse> => {
  const params = new URLSearchParams();
  if (searchTerm) {
    params.append("q", searchTerm);
  }
  return api.get(`/orders/recent?${params}`);
};
