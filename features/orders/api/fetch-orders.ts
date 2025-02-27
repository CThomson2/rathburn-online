import { OrdersResponse } from "@/types/models";

export async function fetchOrders(
  page: number,
  pageSize: number
): Promise<OrdersResponse> {
  // Use absolute URL with window.location.origin
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const url = `${baseUrl}/api/orders?page=${page}&limit=${pageSize}`;

  console.log(`[Client] Fetching orders from: ${url}`);

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[Client] Error response: ${response.status} ${errorText}`);
    throw new Error(`Failed to fetch orders: ${response.status}`);
  }

  return response.json();
}
