const { PrismaClient } = require("./prisma/generated/client");

async function testStockOrders() {
  const prisma = new PrismaClient();
  try {
    console.log("Testing access to stock_orders table...");

    // First, test if the table exists by trying to count records
    const count = await prisma.stock_orders.count();
    console.log(`Found ${count} records in stock_orders table`);

    // Try to access a related table (stock_order_details)
    const detailsCount = await prisma.stock_order_details.count();
    console.log(`Found ${detailsCount} records in stock_order_details table`);

    // Try to find a supplier for testing
    const firstSupplier = await prisma.suppliers.findFirst();
    console.log("Found supplier:", firstSupplier.supplier_name);

    // Log success
    console.log("All tables are accessible!");
  } catch (error) {
    console.error("Error accessing stock_orders table:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testStockOrders();
