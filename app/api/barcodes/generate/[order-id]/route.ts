// /app/api/barcodes/[orderId]/route.ts
import { NextResponse } from "next/server";
import { withDatabase, DATABASE_ROUTE_CONFIG } from "../../../../../database";
import bwipjs from "bwip-js";
import { PDFDocument, StandardFonts } from "pdf-lib";

// Force dynamic rendering and no caching for this database-dependent route
export const dynamic = DATABASE_ROUTE_CONFIG.dynamic;
export const fetchCache = DATABASE_ROUTE_CONFIG.fetchCache;

// For convenience, helper to convert inches to PDF points (72pt = 1in)
const inchesToPoints = (inches: number) => inches * 72;

// Example Postman API request (GET):
// https://localhost:3000/api/barcodes/generate/123?material=Steel&supplier=Acme

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;

    const { material, supplier } = Object.fromEntries(
      new URL(req.url).searchParams
    );

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    return await withDatabase(async (db) => {
      // 2) Fetch the newly-created drums
      const drumRecords = await db.new_drums.findMany({
        where: {
          order_id: Number(orderId),
        },
        select: {
          drum_id: true,
        },
      });

      // Convert the drum_ids into an array of numbers
      const drumIds: number[] = drumRecords.map((drum) => drum.drum_id);

      // 1) Create a PDF
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Page size for 6" x 4" label printing (landscape)
      const PAGE_WIDTH = inchesToPoints(6);
      const PAGE_HEIGHT = inchesToPoints(4);

      // For each drum, generate a barcode and a dedicated page in the PDF
      for (const drumId of drumIds) {
        // Generate the barcode image (PNG) for `[drumId]~[orderId]`
        const codeText = `${orderId}-H${drumId}`;

        const barcodeBuffer = await bwipjs.toBuffer({
          bcid: "code128",
          text: codeText,
          scale: 3,
          height: 10,
          includetext: true,
          textxalign: "center",
        });

        // Add a new page for each drum's label
        const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        const barcodeImage = await pdfDoc.embedPng(
          new Uint8Array(barcodeBuffer)
        );

        // Add Supplier and Material text in bold
        page.drawText(`Supplier: ${supplier}`, {
          x: 30,
          y: PAGE_HEIGHT - 30,
          size: 14,
          font: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
        });
        page.drawText(`Material: ${material}`, {
          x: 30,
          y: PAGE_HEIGHT - 50,
          size: 14,
          font: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
        });

        // Place the barcode image
        page.drawImage(barcodeImage, {
          x: 30,
          y: 50,
        });

        // Optional: Add some text
        page.drawText(`Order ID: ${orderId}`, {
          x: 30,
          y: 20,
          size: 14,
          font,
        });
        page.drawText(`Drum ID: ${drumId}`, {
          x: 30,
          y: 200,
          size: 14,
          font,
        });
      }

      // Finalize PDF
      const pdfBytes = await pdfDoc.save();

      // Return PDF response
      return new NextResponse(Buffer.from(pdfBytes), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'inline; filename="barcodes.pdf"',
        },
      });
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error generating barcodes" },
      { status: 500 }
    );
  }
}
