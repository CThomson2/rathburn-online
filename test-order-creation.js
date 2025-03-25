const { PrismaClient } = require("./prisma/generated/client");

async function testOrderCreation() {
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

  console.log(
    "Testing order creation with data:",
    JSON.stringify(mockOrderData, null, 2)
  );

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

    // Create the stock_order record
    console.log("Creating stock_order record...");
    const newOrder = await prisma.stock_orders.create({
      data: {
        supplier_id: supplierRecord.supplier_id,
        po_number: mockOrderData.po_number,
        date_ordered: new Date(mockOrderData.date_ordered),
      },
    });

    console.log("Created new order:", newOrder);

    // Create stock_order_details records for each material
    const orderDetailsPromises = mockOrderData.orderDetails.map(
      async (detail) => {
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

        // Create stock_order_details record - only specify the exact fields we need
        console.log("Creating stock_order_details record...");
        return prisma.stock_order_details.create({
          data: {
            order_id: newOrder.order_id,
            material_id: materialRecord.material_id,
            material_name: detail.material,
            drum_quantity: detail.drum_quantity,
            status: "en route", // Using the default value explicitly
          },
          // Only select specific fields to return
          select: {
            detail_id: true,
            order_id: true,
            material_id: true,
            material_name: true,
            drum_quantity: true,
            status: true,
          },
        });
      }
    );

    // Wait for all order details to be created
    const createdOrderDetails = await Promise.all(orderDetailsPromises);
    console.log("Created order details:", createdOrderDetails);

    console.log("Order creation successful!");

    // Return results for further testing
    return {
      order: newOrder,
      orderDetails: createdOrderDetails,
    };
  } catch (error) {
    console.error("Error creating order:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testOrderCreation();
