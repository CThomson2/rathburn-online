import React from "react";
import { FileDown } from "lucide-react";

interface OrderDetailResponse {
  detail_id: number;
  order_id: number;
  material_id: number;
  material_description: string;
  drum_quantity: number;
}

interface DrumLabelProps {
  orderDetail: OrderDetailResponse;
  onError: (error: string) => void;
}

export const DrumLabel: React.FC<DrumLabelProps> = ({
  orderDetail: { detail_id, material_description, drum_quantity },
  onError,
}) => {
  /**
   * Calls the backend route to fetch a generated PDF for this order.
   * We open the PDF in a new tab once we get the Blob.
   */
  const handleGeneratePDF = async () => {
    try {
      // Use fetch directly for binary data instead of the API client
      const response = await fetch(`/api/barcodes/generate/${detail_id}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      // Get the PDF as a blob with the correct MIME type
      const pdfBlob = await response.blob();

      // Create a URL for the blob with the correct MIME type
      const pdfUrl = URL.createObjectURL(
        new Blob([pdfBlob], { type: "application/pdf" })
      );

      // Open the PDF in a new tab
      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error("Error generating barcode PDF:", error);
      onError("Failed to generate barcode PDF");
    }
  };

  return (
    <div className="space-y-8">
      {/* Order Details Section */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-slate-400 text-sm">Detail ID</p>
            <p className="text-xl font-semibold text-white">{detail_id}</p>
          </div>
          <div className="space-y-1">
            <p className="text-slate-400 text-sm">Material</p>
            <p className="text-xl font-semibold text-white">
              {material_description}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-slate-400 text-sm">Drum Quantity</p>
            <p className="text-xl font-semibold text-white">{drum_quantity}</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-600" />

      {/* PDF Generation Section */}
      <div className="space-y-3">
        <p className="text-slate-300 text-sm">
          Your order has been created successfully. Generate and print barcode
          labels for each drum in this order.
        </p>
        <button
          onClick={handleGeneratePDF}
          className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg transition-all duration-200 hover:translate-y-[-2px] active:translate-y-0 shadow-lg hover:shadow-blue-500/25"
        >
          <FileDown className="w-5 h-5 transition-transform group-hover:scale-110" />
          <span className="font-medium">Download Barcode Labels</span>
        </button>
      </div>
    </div>
  );
};
