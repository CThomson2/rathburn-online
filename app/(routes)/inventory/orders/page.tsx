import { OrdersGrid } from "@/features/orders/components";
import Link from "next/link";

const OrdersPage = () => {
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col justify-center gap-4 h-screen font-semibold text-center uppercase italic">
      <Link href="/inventory/orders/create">Create Order</Link>
      <OrdersGrid />
    </div>
  );
};

export default OrdersPage;
