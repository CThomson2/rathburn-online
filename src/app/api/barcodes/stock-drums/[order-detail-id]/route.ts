import { NextResponse } from "next/server";
import { withDatabase, DATABASE_ROUTE_CONFIG } from "@/database";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import bwipjs from "bwip-js";
import { toBuffer } from "qrcode";

// Force dynamic rendering and no caching for this database-dependent route
export const dynamic = DATABASE_ROUTE_CONFIG.dynamic;
export const fetchCache = DATABASE_ROUTE_CONFIG.fetchCache;

// For convenience, helper to convert inches to PDF points (72pt = 1in)
const inchesToPoints = (inches: number) => Math.floor(inches * 72);

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
      // 0. First find the order detail record using the detailId from URL param
      const orderDetails = await db.stock_order_details.findUnique({
        where: {
          detail_id: Number(detailId),
        },
      });

      if (!orderDetails) {
        return NextResponse.json(
          { error: `Order detail with ID ${detailId} not found` },
          { status: 404 }
        );
      }

      // 1. Now find the stock order using the order_id from the order detail
      const stockOrder = await db.stock_orders.findUnique({
        where: {
          order_id: orderDetails.order_id,
        },
        include: {
          stock_order_details: true,
        },
      });

      // 2. Get the supplier information
      const supplier = await db.suppliers.findUnique({
        where: { supplier_id: stockOrder?.supplier_id },
      });
      const material = await db.raw_materials.findUnique({
        where: { material_id: orderDetails.material_id },
      });

      // 1. Fetch drum records and associated details from the database.
      // Adjust the query to include joins for supplier, material, etc.
      const drums = await db.stock_drums.findMany({
        where: { order_detail_id: Number(detailId) },
        include: {
          // stock_order_details: true,
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

      // const material =
      //   drums[0].stock_order_details.raw_materials?.material_name;
      // const supplier =
      //   drums[0].stock_order_details.stock_orders.suppliers.supplier_name;
      // Attempt to find the material code, but handle case where material doesn't exist
      // let materialCode = material?.material_code;
      // try {
      //   const materialRecord = await db.raw_materials.findFirst({
      //     where: {
      //       material_name: material?.material_name,
      //     },
      //     select: {
      //       material_code: true,
      //     },
      //   });

      // Only assign materialCode if the record was found
      // if (material && materialRecord.material_code) {
      //   materialCode = materialRecord.material_code;
      // }
      // } catch (error) {
      //   console.error(
      //     `Error: no database record exists for material "${material}"`,
      //     error
      //   );
      //   // Continue execution with default materialCode
      // }

      // Create QR code for the drum info URL
      const qrCodeUrl = `http://localhost/drums/info/${drums[0].drum_id}`;
      const qrCodeBuffer = await toBuffer(qrCodeUrl, {
        errorCorrectionLevel: "M",
        margin: 1,
        width: 150,
      });

      // 2. Create a new PDF document.
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // 3. Process each drum to generate a barcode and add a PDF page.
      // Calculate total number of drums for the x/N labeling
      const totalDrums = drums.length;

      // Loop through each drum and create a PDF page for it
      for (let drumIndex = 0; drumIndex < drums.length; drumIndex++) {
        const drum = drums[drumIndex];
        // Current unit number (1-based index)
        const currentUnitNumber = drumIndex + 1;

        // Generate barcode image using bwip-js.
        // The barcode text can be drum.drum_id or any other string.
        const barcodeText = material?.material_code
          ? `${material.material_code}-${drum.drum_id}`
          : `${drum.drum_id}`;
        const barcodeBuffer = await bwipjs.toBuffer({
          bcid: "code128", // Barcode type: Code128
          text: barcodeText, // Adjust to your drum identifier field
          scale: 3, // Adjust scale as needed
          height: 10, // Barcode height in mm (approx)
          includetext: true, // Include human-readable text
          textxalign: "center",
        });

        // Create a page for the label (adjust dimensions to your label format; e.g., 4x6 inches in points)
        const pageWidth = 7.75; // 4 inches * 72 points/inch
        const pageHeight = 3.15; // 6 inches * 72 points/inch
        const page = pdfDoc.addPage([
          inchesToPoints(pageWidth),
          inchesToPoints(pageHeight),
        ]);

        // Embed images
        const qrImage = await pdfDoc.embedPng(qrCodeBuffer);
        const barcodeImage = await pdfDoc.embedPng(
          new Uint8Array(barcodeBuffer)
        );

        // Calculate dimensions for barcode placement
        const barcodeDims = barcodeImage.scale(1);
        const barcodeX = (pageWidth - barcodeDims.width) / 2; // Center horizontally
        const barcodeY = pageHeight * 0.25; // Position in the lower part of the PDF (25% from bottom)

        // Draw the barcode image on the page.
        page.drawImage(barcodeImage, {
          x: barcodeX,
          y: barcodeY,
          width: barcodeDims.width,
          height: barcodeDims.height,
        });

        // Add additional label text (e.g., supplier, material, etc.).
        const supplierName = supplier?.supplier_name || "Unknown Supplier";
        const materialName = material?.material_name || "Unknown Material";

        // Draw header section - using lines instead of rectangle for borders
        // Draw bottom border
        page.drawLine({
          start: { x: 0, y: page.getHeight() - 35 },
          end: { x: page.getWidth() - 60, y: page.getHeight() - 35 },
          thickness: 1,
          color: rgb(0, 0, 0),
        });

        // Draw right border
        page.drawLine({
          start: { x: page.getWidth() - 60, y: page.getHeight() },
          end: { x: page.getWidth() - 60, y: page.getHeight() - 35 },
          thickness: 1,
          color: rgb(0, 0, 0),
        });

        // Draw company name (smaller and positioned higher)
        page.drawText("RATHBURN CHEMICALS", {
          x: 10,
          y: page.getHeight() - 25,
          size: 14,
          font: fontBold,
        });

        // Draw large material text in header section
        page.drawText(material?.material_name.toUpperCase() || "", {
          x: page.getWidth() * (3 / 5),
          y: page.getHeight() - 25,
          size: 14,
          font: fontBold,
        });

        // Draw QR code in top right with adjusted text position
        page.drawImage(qrImage, {
          x: page.getWidth() - 90,
          y: page.getHeight() - 80,
          width: 60,
          height: 60,
        });

        // Draw "Drum Info" text centered under QR code
        const drumInfoText = "Drum Info";
        const drumInfoWidth = font.widthOfTextAtSize(drumInfoText, 12);
        page.drawText(drumInfoText, {
          x: page.getWidth() - 90 + (60 - drumInfoWidth) / 2, // Center under QR code
          y: page.getHeight() - 95,
          size: 12,
          font: font,
        });

        // Draw left side information
        const leftColumnX = 20;
        let currentY = page.getHeight() - 70;
        const lineSpacing = 20; // Increased spacing

        // Draw left column labels and values
        const leftColumnData = [
          { label: "Mfg :", value: supplier?.supplier_name || "N/A" },
          { label: "PO No. :", value: stockOrder?.po_number || "N/A" },
          { label: "Product :", value: `${material?.material_name}` },
          { label: "Date :", value: new Date().toLocaleDateString() },
        ];

        leftColumnData.forEach(({ label, value }) => {
          page.drawText(label, {
            x: leftColumnX,
            y: currentY,
            size: 12,
            font: font,
          });
          page.drawText(value, {
            x: leftColumnX + 80,
            y: currentY,
            size: 12,
            font: fontBold,
          });
          currentY -= lineSpacing;
        });

        // Draw additional information (Unit, Weight, Volume) to the right
        const rightColumnX = page.getWidth() * (3 / 5); // Position right of center
        currentY = page.getHeight() - 70; // Same starting height as left column

        const additionalInfo = [
          // Dynamic Unit value based on drum position and total drums
          { label: "Unit :", value: `${currentUnitNumber}/${totalDrums}` },
          { label: "Wt :", value: "158 KG" },
          { label: "Vol :", value: "199.5 LT" },
        ];

        additionalInfo.forEach(({ label, value }) => {
          page.drawText(label, {
            x: rightColumnX,
            y: currentY,
            size: 12,
            font: font,
          });
          page.drawText(value, {
            x: rightColumnX + 60,
            y: currentY,
            size: 12,
            font: fontBold,
          });
          currentY -= lineSpacing;
        });

        //   page.drawText(`Supplier: ${supplierName}`, {
        //     x: 20,
        //     y: pageHeight - 40,
        //     size: 12,
        //     font,
        //     color: rgb(0, 0, 0),
        //   });

        //   page.drawText(`Material: ${materialName}`, {
        //     x: 20,
        //     y: pageHeight - 60,
        //     size: 12,
        //     font,
        //     color: rgb(0, 0, 0),
        //   });

        //   // Optionally add more details like drum ID, order reference, etc.
        //   page.drawText(`Drum ID: ${drum.drum_id}`, {
        //     x: 20,
        //     y: pageHeight - 80,
        //     size: 12,
        //     font,
        //     color: rgb(0, 0, 0),
        //   });
        // }

        // 4. Serialize the PDFDocument to bytes (a Uint8Array)
        const pdfBytes = await pdfDoc.save();

        // 5. Return the PDF directly with appropriate headers
        return new NextResponse(pdfBytes, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=drums-${detailId}.pdf`,
          },
        });
      }
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
