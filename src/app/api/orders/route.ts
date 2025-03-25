import { NextResponse } from "next/server";
import { queries as q } from "@/database/models/orders/queries";
import { withDatabase, DATABASE_ROUTE_CONFIG } from "@/database";
import { PrismaClientKnownRequestError } from "/prisma/generated/client/runtime/library";
import { StockOrderFormValues } from "@/types/models";

// Force dynamic rendering and no caching for this database-dependent route
export const dynamic = DATABASE_ROUTE_CONFIG.dynamic;
export const fetchCache = DATABASE_ROUTE_CONFIG.fetchCache;

/**
 * GET handler for fetching orders data
 *
 * @param req - The incoming request
 * @returns JSON response with orders data or error
 */
export async function GET(req: Request) {
  // Extract search params from the request URL
  // For example, from: /api/inventory/activity?page=2&limit=10
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  // Get limit (items per page) from URL params, defaulting to 50
  // This allows requests like ?limit=10 to show 10 items per page
  const limit = parseInt(searchParams.get("limit") || "30");

  console.log(
    `[API] Fetching orders with page=${page}, limit=${limit}, URL=${req.url}`
  );

  try {
    const orders = await q.getOrders({ page, limit });
    console.log(`[API] Successfully fetched ${orders.orders.length} orders`);

    // Return response with CORS and cache control headers
    return new NextResponse(JSON.stringify(orders), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("[API] Error fetching orders:", error);

    // Return detailed error for debugging
    return new NextResponse(
      JSON.stringify({
        error: "Failed to fetch orders",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  }
}

/**
 * POST handler for creating a new order
 *
 * @param req - The incoming request
 * @returns JSON response with the created order or error
 */
export async function POST(req: Request) {
  try {
    // Parse request body
    const body: StockOrderFormValues = await req.json();
    const { supplier, po_number, date_ordered, orderDetails } = body;

    console.log(
      `[API] Creating new order with ${orderDetails.length} materials from ${supplier}`
    );

    // Use withDatabase to create a new order
    const result = await withDatabase(async (db) => {
      // First, find the supplier_id
      const supplierRecord = await db.suppliers.findFirst({
        where: {
          supplier_name: supplier,
        },
        select: {
          supplier_id: true,
        },
      });

      if (!supplierRecord) {
        throw new Error(`Supplier "${supplier}" not found`);
      }

      // Create the stock_order record
      const newOrder = await db.$queryRaw<
        Array<{
          order_id: number;
          po_number: string;
          date_ordered: Date;
          supplier_id: number;
          notes: string | null;
        }>
      >`
        INSERT INTO "inventory"."stock_orders" ("po_number", "date_ordered", "supplier_id")
        VALUES (${po_number}, ${new Date(date_ordered)}, ${
        supplierRecord.supplier_id
      })
        RETURNING "order_id", "po_number", "date_ordered", "supplier_id", "notes";
      `;

      // Extract order_id from the result
      const order_id = newOrder[0].order_id;

      // Create stock_order_details records for each material
      const orderDetailsPromises = orderDetails.map(async (detail) => {
        // Find material_id
        const materialRecord = await db.raw_materials.findFirst({
          where: {
            material_name: detail.material,
          },
          select: {
            material_id: true,
          },
        });

        if (!materialRecord) {
          throw new Error(`Material "${detail.material}" not found`);
        }

        // Create stock_order_details record using raw SQL
        const orderDetailResult = await db.$queryRaw<
          Array<{
            detail_id: number;
            order_id: number;
            material_description: string;
            drum_quantity: number;
            status: string;
          }>
        >`
          INSERT INTO "inventory"."stock_order_details" 
          ("order_id", "material_description", "drum_quantity", "status")
          VALUES (
            ${order_id}, 

            ${detail.material}, 
            ${detail.drum_quantity}, 
            'en route'
          )
          RETURNING "detail_id", "order_id", "material_id", "material_description", "drum_quantity", "status";
        `;

        // Fetch the stock_drums records that were automatically created by the database trigger
        // The trigger creates drum_quantity records in stock_drums with order_detail_id set to the new detail_id
        const newStockDrums = await db.stock_drums.findMany({
          where: {
            order_detail_id: orderDetailResult[0].detail_id,
          },
        });

        console.log(
          `[API] Found ${newStockDrums.length} auto-generated stock_drums records for detail_id ${orderDetailResult[0].detail_id}`
        );

        return {
          detail: orderDetailResult[0],
          material: detail.material,
          drum_quantity: detail.drum_quantity,
          drums: newStockDrums,
        };
      });

      // Wait for all order details to be created
      const createdOrderDetails = await Promise.all(orderDetailsPromises);

      return {
        order: newOrder[0],
        orderDetails: createdOrderDetails,
      };
    });

    console.log(
      `[API] Successfully created order with ID: ${result.order.order_id}`
    );

    // Return the combined data in JSON
    return NextResponse.json(
      {
        success: true,
        order: result.order,
        orderDetails: result.orderDetails,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API] Error creating order:", error);

    if (error instanceof PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create order",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler for CORS preflight requests
 */
export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}
