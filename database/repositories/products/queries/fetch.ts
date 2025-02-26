import { withDatabase } from "@/database";
import { ProductTableRow } from "@/types/database/public/products";

export async function fetchProducts(): Promise<ProductTableRow[]> {
  return withDatabase(async (db) => {
    const products = await db.products.findMany({
      select: {
        product_id: true,
        name: true,
        sku: true,
        grade: true,
        raw_materials: {
          select: {
            cas_number: true,
          },
        },
      },
    });

    return products.map((product: any) => {
      // console.log(product.grade);
      return {
        ...product,
        cas_number: product.raw_materials?.cas_number ?? "",
      };
    });
  });
}
