import { NextResponse } from "next/server";
import { queries } from "../../../database/repositories/orders/queries";
import { withDatabase, DATABASE_ROUTE_CONFIG } from "../../../database";
import type { OrderFormData } from "@/types/database/inventory/orders";
import { PrismaClientKnownRequestError } from "../../../database/prisma/generated/client/runtime/library";

// Force dynamic rendering and no caching for this database-dependent route
export const dynamic = DATABASE_ROUTE_CONFIG.dynamic;
export const fetchCache = DATABASE_ROUTE_CONFIG.fetchCache;

// Example request for Postman: http://localhost:3000/api/orders?page=1&limit=10
export async function GET(req: Request) {
  // Extract search params from the request URL
  // For example, from: /api/inventory/transactions?page=2&limit=10
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  // Get limit (items per page) from URL params, defaulting to 50
  // This allows requests like ?limit=10 to show 10 items per page
  const limit = parseInt(searchParams.get("limit") || "50");

  try {
    const orders = await queries.getOrders({ page, limit });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// Example request for Postman: http://localhost:3000/api/orders,
// Format of body when sending from frontend: { material: "string", supplier: "string", quantity: "number" }
export async function POST(req: Request) {
  // Parse request body
  const body = await req.json();
  const { material, supplier, quantity, po_number = null } = body;

  try {
    // Use withDatabase to create a new order
    const newOrder: OrderFormData = await withDatabase(async (db) => {
      return db.orders.create({
        data: {
          supplier,
          material,
          quantity,
          po_number, // Only include po_number if it exists
        },
      });
    });

    // Return the combined data in JSON
    return NextResponse.json(
      {
        success: true,
        order: newOrder, // the order data
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      // PostgreSQL error messages are in error.message
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}
