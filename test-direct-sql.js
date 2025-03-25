const { PrismaClient } = require("./prisma/generated/client");

async function testDirectSql() {
  const prisma = new PrismaClient();

  const today = new Date().toISOString();
  // Mock request data
  const mockOrderData = {
    supplier: "Kimia",
    po_number: "TEST-123",
    date_ordered: today,
    orderDetails: [
      {
        material: "Hexane",
        drum_quantity: 2,
      },
    ],
  };

  console.log("Testing order creation with raw SQL...");

  try {
    // First, find the supplier_id
    const supplierRecord = await prisma.suppliers.findFirst({
      where: {
        supplier_name: mockOrderData.supplier,
      },
      select: {
        supplier_id: true,
      },
    });

    console.log("Found supplier:", supplierRecord);

    if (!supplierRecord) {
      throw new Error(`Supplier "${mockOrderData.supplier}" not found`);
    }

    // Create the stock_order record using raw SQL
    console.log("Creating stock_order record with raw SQL...");
    const createOrderSql = `
      INSERT INTO "inventory"."stock_orders" ("supplier_id", "po_number", "date_ordered")
      VALUES (${supplierRecord.supplier_id}, '${
      mockOrderData.po_number
    }', '${new Date(mockOrderData.date_ordered).toISOString()}')
      RETURNING "order_id", "po_number", "date_ordered", "supplier_id", "notes";
    `;

    const [newOrder] = await prisma.$queryRawUnsafe(createOrderSql);
    console.log("Created new order:", newOrder);

    // Process order details
    for (const detail of mockOrderData.orderDetails) {
      // Find material_id
      const materialRecord = await prisma.raw_materials.findFirst({
        where: {
          material_name: detail.material,
        },
        select: {
          material_id: true,
        },
      });

      console.log("Found material:", materialRecord);

      if (!materialRecord) {
        throw new Error(`Material "${detail.material}" not found`);
      }

      // Create stock_order_details record using raw SQL
      console.log("Creating stock_order_details record with raw SQL...");
      const createDetailSql = `
        INSERT INTO "inventory"."stock_order_details" 
        ("order_id", "material_id", "material_name", "drum_quantity", "status")
        VALUES (
          ${newOrder.order_id}, 
          ${materialRecord.material_id}, 
          '${detail.material}', 
          ${detail.drum_quantity}, 
          'en route'
        )
        RETURNING "detail_id", "order_id", "material_id", "material_name", "drum_quantity", "status";
      `;

      const [orderDetail] = await prisma.$queryRawUnsafe(createDetailSql);
      console.log("Created order detail:", orderDetail);
    }

    console.log("Order creation successful!");
  } catch (error) {
    console.error("Error creating order:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testDirectSql();
