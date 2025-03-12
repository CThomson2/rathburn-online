// /app/api/barcodes/[drum_id]/route.ts
import { NextResponse } from "next/server";
import { withDatabase, DATABASE_ROUTE_CONFIG } from "@/database";
import bwipjs from "bwip-js";
import { PDFDocument, StandardFonts } from "pdf-lib";

// Force dynamic rendering and no caching for this database-dependent route
export const dynamic = DATABASE_ROUTE_CONFIG.dynamic;
export const fetchCache = DATABASE_ROUTE_CONFIG.fetchCache;

// For convenience, helper to convert inches to PDF points (72pt = 1in)
const inchesToPoints = (inches: number) => inches * 72;

export async function GET(
  req: Request,
  { params: { "drum-id": drumId } }: { params: { "drum-id": string } }
) {
  try {
    if (!drumId) {
      console.error("Missing drum_id");
      return NextResponse.json({ error: "Missing drum_id" }, { status: 400 });
    }

    return await withDatabase(async (db) => {
      // Fetch the drum with its related order information
      const drum = await db.new_drums.findUnique({
        where: {
          drum_id: Number(drumId),
        },
        include: {
          orders: true, // Include the related order information
        },
      });

      if (!drum) {
        return NextResponse.json(
          { error: `Drum with ID ${drumId} not found` },
          { status: 404 }
        );
      }

      // Extract the necessary data for the barcode
      const { material, supplier } = drum.orders || {
        material: drum.material,
        supplier: "Unknown",
      };

      // Generate the barcode image (PNG) for `H{drum_id}`
      const codeText = `H${drum.drum_id}`;

      const barcodeBuffer = await bwipjs.toBuffer({
        bcid: "code128",
        text: codeText,
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: "center",
      });

      // 1) Create a PDF
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Page size for 6" x 4" label printing (landscape)
      const PAGE_WIDTH = inchesToPoints(6);
      const PAGE_HEIGHT = inchesToPoints(4);

      // Add a new page for the drum's label
      const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      const barcodeImage = await pdfDoc.embedPng(new Uint8Array(barcodeBuffer));

      // Get barcode dimensions for centering
      const { width: barcodeWidth } = barcodeImage.scale(1);
      const centerX = (PAGE_WIDTH - barcodeWidth) / 2;

      // Calculate text widths for centering
      const supplierText = `Supplier: ${supplier}`;
      const materialText = `Material: ${material}`;
      const drumIdText = `Drum ID: ${drum.drum_id}`;

      const supplierWidth = boldFont.widthOfTextAtSize(supplierText, 14);
      const materialWidth = boldFont.widthOfTextAtSize(materialText, 14);
      const drumIdWidth = font.widthOfTextAtSize(drumIdText, 14);

      // Add centered text
      page.drawText(supplierText, {
        x: (PAGE_WIDTH - supplierWidth) / 2,
        y: PAGE_HEIGHT - 30,
        size: 14,
        font: boldFont,
      });

      page.drawText(materialText, {
        x: (PAGE_WIDTH - materialWidth) / 2,
        y: PAGE_HEIGHT - 50,
        size: 14,
        font: boldFont,
      });

      // Place the centered barcode image
      page.drawImage(barcodeImage, {
        x: centerX,
        y: 50,
      });

      // Add centered drum ID text
      page.drawText(drumIdText, {
        x: (PAGE_WIDTH - drumIdWidth) / 2,
        y: 200,
        size: 14,
        font,
      });

      // Finalize PDF
      const pdfBytes = await pdfDoc.save();

      // Return PDF response
      return new NextResponse(Buffer.from(pdfBytes), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="drum-${drum.drum_id}-barcode.pdf"`,
        },
      });
    });
  } catch (error) {
    console.error("Error generating barcode:", error);
    return NextResponse.json(
      { error: "Failed to generate barcode" },
      { status: 500 }
    );
  }
}
