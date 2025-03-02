import { NextResponse } from "next/server";
import { queries as q } from "@/database/models/orders/queries";
import { withDatabase, DATABASE_ROUTE_CONFIG } from "@/database";
import { PrismaClientKnownRequestError } from "@/database/prisma/generated/client/runtime/library";

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
    const body = await req.json();
    const { material, supplier, quantity, po_number = null } = body;

    console.log(
      `[API] Creating new order: ${material} from ${supplier}, quantity: ${quantity}`
    );

    // Use withDatabase to create a new order
    const newOrder = await withDatabase(async (db) => {
      return db.orders.create({
        data: {
          supplier,
          material,
          quantity,
          po_number, // Only include po_number if it exists
        },
      });
    });

    console.log(
      `[API] Successfully created order with ID: ${newOrder.order_id}`
    );

    // Return the combined data in JSON
    return NextResponse.json(
      {
        success: true,
        order: newOrder, // the order data
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API] Error creating order:", error);

    if (error instanceof PrismaClientKnownRequestError) {
      // PostgreSQL error messages are in error.message
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
