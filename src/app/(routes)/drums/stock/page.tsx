import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Drums Stock | Dashboard",
  description: "Inventory management for drums stock",
};

export default function DrumsStockPage() {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Drums Stock
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage and track inventory for all drums
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-600">
          Drums stock data will be displayed here.
        </p>
      </div>
    </div>
  );
}
