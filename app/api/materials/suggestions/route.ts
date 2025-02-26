import { NextResponse } from "next/server";
import { getDb, DATABASE_ROUTE_CONFIG } from "../../../../database";

// Force dynamic rendering and no caching for this database-dependent route
export const dynamic = DATABASE_ROUTE_CONFIG.dynamic;
export const fetchCache = DATABASE_ROUTE_CONFIG.fetchCache;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const db = getDb();
    const suggestions = (await db.raw_materials.findMany({
      where: {
        name: {
          startsWith: query,
          mode: "insensitive", // Case-insensitive search
        },
      },
      select: {
        name: true,
      },
      take: 10, // Limit results
    })) as Array<{ name: string }>;

    return NextResponse.json({
      suggestions: suggestions.map((s) => s.name),
    });
  } catch (error) {
    console.error("Error fetching material suggestions:", error);
    return NextResponse.json(
      { error: "Failed to fetch suggestions" },
      { status: 500 }
    );
  }
}
