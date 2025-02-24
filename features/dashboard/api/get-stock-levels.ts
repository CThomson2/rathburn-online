import { api } from "@/lib/api-client";
import { DailyChange, StockLevels } from "../types/api";

interface WeeklyStockChangesResponse {
  weeklyStockChanges: DailyChange[];
}

interface StockLevelsResponse extends StockLevels {}

export const getStockLevels = async ({
  lowCount,
  highCount,
}: {
  lowCount: number;
  highCount: number;
}): Promise<StockLevels> => {
  try {
    const response = await api.get<StockLevelsResponse>(
      "/dashboard/current-stock",
      {
        params: {
          lowCount,
          highCount,
        },
      }
    );
    console.log("[API Client] Stock levels response:", response);
    return response;
  } catch (error) {
    console.error("[API Client] Error fetching stock levels:", error);
    throw error;
  }
};

export const getWeeklyStockChanges = async (): Promise<DailyChange[]> => {
  try {
    const response = await api.get<WeeklyStockChangesResponse>(
      "/dashboard/stock-changes"
    );
    console.log("[API Client] Weekly changes raw response:", response);

    if (!response?.weeklyStockChanges) {
      console.error("[API Client] Invalid response format:", response);
      throw new Error("Invalid response format - missing weeklyStockChanges");
    }

    return response.weeklyStockChanges;
  } catch (error) {
    console.error("[API Client] Error fetching weekly changes:", error);
    throw error;
  }
};
