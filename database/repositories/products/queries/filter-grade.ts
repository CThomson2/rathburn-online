// database/repositories/products/queries.ts
import { withDatabase } from "@/database";

const Grade = {
  GD: "GD",
  HPLC: "HPLC",
  LCMS: "LCMS",
  PTS_DS: "PTS_DS",
} as const;

type GradeType = keyof typeof Grade;

/**
 * Counts the total number of products, optionally filtered by grade
 * @param grade Optional GRADE enum value to filter products by
 * @returns Promise resolving to the count of products matching the criteria
 *
 * Example SQL generated:
 * SELECT COUNT(*) FROM products WHERE grade = $1
 * Or if no grade provided:
 * SELECT COUNT(*) FROM products
 */
export async function byGrade(grade?: GradeType): Promise<number> {
  return withDatabase((db) =>
    db.products.count({
      where: grade ? { grade } : undefined,
    })
  );
}

/**
 * Gets counts of products broken down by grade and total
 * Uses a single GROUP BY query for efficiency rather than multiple count queries
 * @returns Object containing total count and count per grade
 *
 * Example SQL generated:
 * SELECT grade, COUNT(*) as _count
 * FROM products
 * GROUP BY grade;
 *
 * And:
 * SELECT COUNT(*) FROM products;
 *
 * Returns object like:
 * {
 *   all: number,    // Total products
 *   GD: number,     // Count of GD grade products
 *   HPLC: number,   // Count of HPLC grade products
 *   LCMS: number,   // Count of LCMS grade products
 *   PTS_DS: number  // Count of PTS-DS grade products
 * }
 */

export async function getProductCounts() {
  return withDatabase(async (db) => {
    // Fetch all counts in a single query using GroupBy
    const gradeCounts = await db.products.groupBy({
      by: ["grade"],
      _count: true,
      orderBy: {
        grade: "asc",
      },
    });

    const totalCount = await db.products.count();

    return {
      all: totalCount,
      GD:
        gradeCounts.find((count: any) => count.grade === Grade.GD)?._count ?? 0,
      HPLC:
        gradeCounts.find((count: any) => count.grade === Grade.HPLC)?._count ??
        0,
      LCMS:
        gradeCounts.find((count: any) => count.grade === Grade.LCMS)?._count ??
        0,
      PTS_DS:
        gradeCounts.find((count: any) => count.grade === Grade.PTS_DS)
          ?._count ?? 0,
    };
  });
}
