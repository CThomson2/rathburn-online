import { NextResponse } from "next/server";
import { withDatabase, DATABASE_ROUTE_CONFIG } from "@/database";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import bwipjs from "bwip-js";
import { toBuffer } from "qrcode";

// Force dynamic rendering and no caching for this database-dependent route
export const dynamic = DATABASE_ROUTE_CONFIG.dynamic;
export const fetchCache = DATABASE_ROUTE_CONFIG.fetchCache;

export async function GET(
  req: Request,
  {
    params: { "order-detail-id": detailId },
  }: { params: { "order-detail-id": string } }
) {
  try {
    if (!detailId || typeof detailId !== "string") {
      console.error("Missing order_detail_id");
      return NextResponse.json(
        { error: "Missing or invalid order_detail_id" },
        { status: 400 }
      );
    }

    return await withDatabase(async (db) => {
      // 1. Fetch drum records and associated details from the database.
      // Adjust the query to include joins for supplier, material, etc.
      const drums = await db.stock_drums.findMany({
        where: { order_detail_id: Number(detailId) },
        include: {
          stock_order_details: {
            include: {
              raw_materials: true,
              stock_orders: {
                include: {
                  suppliers: true,
                },
              },
            },
          },
        },
      });

      if (!drums.length) {
        return NextResponse.json(
          { error: "No drums found for this order" },
          { status: 404 }
        );
      }

      const material_id = await db.stock_order_details.findUnique({
        where: {
          detail_id: Number(detailId),
        },
        select: {
          material_id: true,
        },
      });
      const material =
        drums[0].stock_order_details.raw_materials?.material_name;
      const supplier =
        drums[0].stock_order_details.stock_orders.suppliers.supplier_name;
      // Attempt to find the material code, but handle case where material doesn't exist
      let materialCode = material?.slice(0, 3);
      try {
        const materialRecord = await db.raw_materials.findFirst({
          where: {
            material_name: material,
          },
          select: {
            material_code: true,
          },
        });

        // Only assign materialCode if the record was found
        if (materialRecord && materialRecord.material_code) {
          materialCode = materialRecord.material_code;
        }
      } catch (error) {
        console.error(
          `Error: no database record exists for material "${material}"`,
          error
        );
        // Continue execution with default materialCode
      }

      // Create QR code for the drum info URL
      const qrCodeUrl = `http://localhost/drums/info/${drum.drum_id}`;
      const qrCodeBuffer = await toBuffer(qrCodeUrl, {
        errorCorrectionLevel: "M",
        margin: 1,
        width: 150,
      });

      // 2. Create a new PDF document.
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // 3. Process each drum to generate a barcode and add a PDF page.
      for (const drum of drums) {
        // Generate barcode image using bwip-js.
        // The barcode text can be drum.drum_id or any other string.
        const barcodeBuffer = await bwipjs.toBuffer({
          bcid: "code128", // Barcode type: Code128
          text: String(drum.drum_id), // Adjust to your drum identifier field
          scale: 3, // Adjust scale as needed
          height: 10, // Barcode height in mm (approx)
          includetext: true, // Include human-readable text
          textxalign: "center",
        });

        // Embed the generated PNG image into the PDF.
        const barcodeImage = await pdfDoc.embedPng(barcodeBuffer);

        // Create a page for the label (adjust dimensions to your label format; e.g., 4x6 inches in points)
        const pageWidth = 288; // 4 inches * 72 points/inch
        const pageHeight = 432; // 6 inches * 72 points/inch
        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        // Calculate dimensions for barcode placement
        const barcodeDims = barcodeImage.scale(1);
        const barcodeX = (pageWidth - barcodeDims.width) / 2;
        const barcodeY = (pageHeight - barcodeDims.height) / 2;

        // Draw the barcode image on the page.
        page.drawImage(barcodeImage, {
          x: barcodeX,
          y: barcodeY,
          width: barcodeDims.width,
          height: barcodeDims.height,
        });

        // Add additional label text (e.g., supplier, material, etc.).
        const supplierName =
          drum.stock_order_details.stock_orders.suppliers.supplier_name ||
          "Unknown Supplier";
        const materialName =
          drum.stock_order_details.raw_materials?.material_name ||
          "Unknown Material";

        page.drawText(`Supplier: ${supplierName}`, {
          x: 20,
          y: pageHeight - 40,
          size: 12,
          font,
          color: rgb(0, 0, 0),
        });

        page.drawText(`Material: ${materialName}`, {
          x: 20,
          y: pageHeight - 60,
          size: 12,
          font,
          color: rgb(0, 0, 0),
        });

        // Optionally add more details like drum ID, order reference, etc.
        page.drawText(`Drum ID: ${drum.drum_id}`, {
          x: 20,
          y: pageHeight - 80,
          size: 12,
          font,
          color: rgb(0, 0, 0),
        });
      }

      // 4. Serialize the PDFDocument to bytes (a Uint8Array)
      const pdfBytes = await pdfDoc.save();

      // 5. Set response headers and return the PDF.
      return NextResponse.json(
        { pdfBytes },
        {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=barcodes.pdf",
          },
        }
      );
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
