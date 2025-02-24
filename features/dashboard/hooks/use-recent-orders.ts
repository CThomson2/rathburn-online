import { useQuery } from "@tanstack/react-query";
import { getRecentOrders } from "../api/get-recent-orders";
import { RecentOrdersResponse } from "../types/api";

export function useRecentOrders(searchTerm?: string) {
  return useQuery<RecentOrdersResponse>({
    queryKey: ["recentOrders", searchTerm],
    queryFn: () => getRecentOrders(searchTerm),
  });
}
