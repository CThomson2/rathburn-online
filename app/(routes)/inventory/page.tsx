import { DrumsTable } from "@/features/inventory/components/drum-table";
import Link from "next/link";

const InventoryPage = () => {
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col justify-center gap-4 h-screen font-semibold text-center uppercase italic">
      <Link href="/inventory/orders">Orders</Link>
      <DrumsTable />
    </div>
  );
};

export default InventoryPage;
