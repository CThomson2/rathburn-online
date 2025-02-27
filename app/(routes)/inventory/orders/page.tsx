import { OrdersGrid } from "@/features/orders/components";
import Link from "next/link";
import { getDb } from "@/database";

export const metadata = {
  title: "Orders | Inventory Management",
  description: "View and manage material orders",
};

// Make this an async function to fetch data server-side
async function OrdersPage() {
  // Fetch data server-side
  const db = getDb();
  const orders = await db.orders.findMany({
    take: 30,
    orderBy: {
      order_id: "desc",
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders Management</h1>
        <Link
          href="/inventory/orders/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Create New Order
        </Link>
      </div>
      <OrdersGrid />
    </div>
  );
}

export default OrdersPage;
