import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import { ReproStockTable } from "@/features/inventory/repro-stock";
import { parseCSV } from "@/utils/parse-csv";
import { ReproStock } from "@/features/inventory/repro-stock/types";

export const metadata: Metadata = {
  title: "Repro Drums Stock | Dashboard",
  description: "Inventory management for repro drums stock",
};

async function getReproStockData() {
  try {
    // Read the CSV file from the data directory
    const filePath = path.join(process.cwd(), "data", "repro-data.csv");
    const csvData = await fs.readFile(filePath, "utf8");

    // Parse the CSV data into an array of ReproStock objects
    return parseCSV<ReproStock>(csvData);
  } catch (error) {
    console.error("Error loading repro stock data:", error);
    return [];
  }
}

export default async function ReproDrumsPage() {
  const reproStockData = await getReproStockData();

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Repro Drums Stock
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage and track inventory for all repro drums
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-4 sm:px-6 py-4">
          <ReproStockTable data={reproStockData} />
        </div>
      </div>
    </div>
  );
}
