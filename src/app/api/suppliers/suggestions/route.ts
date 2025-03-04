import { NextResponse } from "next/server";
import { getDb, DATABASE_ROUTE_CONFIG } from "@/database";

// Force dynamic rendering and no caching for this database-dependent route
export const dynamic = DATABASE_ROUTE_CONFIG.dynamic;
export const fetchCache = DATABASE_ROUTE_CONFIG.fetchCache;

// Define interfaces for the database results
interface SupplierResult {
  supplier: string;
}

interface SupplierNameResult {
  name: string;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  const material = searchParams.get("material");

  if (!material) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const db = getDb();

    // First, get historical suppliers for this material
    const historicalSuppliers = await db.orders.findMany({
      where: {
        material: {
          equals: material,
          mode: "insensitive",
        },
      },
      select: {
        supplier: true,
      },
      distinct: ["supplier"],
    });

    let suggestions: string[] = historicalSuppliers.map(
      (s: SupplierResult) => s.supplier
    );

    // If user is typing, filter existing suggestions and add new matches
    if (query) {
      const additionalSuppliers = await db.suppliers.findMany({
        where: {
          name: {
            startsWith: query,
            mode: "insensitive",
          },
          // Exclude suppliers we already have
          NOT: {
            name: {
              in: suggestions,
            },
          },
        },
        select: {
          name: true,
        },
        take: 10,
      });

      // Combine and sort results
      suggestions = [
        ...suggestions.filter((s: string) =>
          s.toLowerCase().startsWith(query.toLowerCase())
        ),
        ...additionalSuppliers.map((s: SupplierNameResult) => s.name),
      ];
    }

    return NextResponse.json({
      suggestions,
    });
  } catch (error) {
    console.error("Error fetching supplier suggestions:", error);
    return NextResponse.json(
      { error: "Failed to fetch suggestions" },
      { status: 500 }
    );
  }
}
