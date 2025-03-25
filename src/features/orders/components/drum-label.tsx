import React, { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";

interface OrderDetailResponse {
  detail: {
    detail_id: number;
    order_id: number;
    material_id: number;
    material_description: string;
    drum_quantity: number;
    status: string;
  };
  material: string;
  drum_quantity: number;
  drums: any[];
}

interface DrumLabelProps {
  orderDetail: OrderDetailResponse;
  onError: (error: string) => void;
}

export const DrumLabel: React.FC<DrumLabelProps> = ({
  orderDetail,
  onError,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * Calls the backend route to fetch a generated PDF for this order.
   * We open the PDF in a new tab once we get the Blob.
   */
  const handleGeneratePDF = async () => {
    try {
      setIsGenerating(true);

      // Extract detail_id from the nested structure
      const detail_id = orderDetail.detail.detail_id;

      // Use fetch directly for binary data
      const response = await fetch(`/api/barcodes/stock-drums/${detail_id}`, {
        method: "GET",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      // Get the blob directly from the response
      const pdfBlob = await response.blob();

      // Create a URL for the blob
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Open the PDF in a new tab
      window.open(pdfUrl, "_blank");

      // Clean up the blob URL after some time
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 30000);
    } catch (error) {
      console.error("Error generating barcode PDF:", error);
      onError(
        error instanceof Error
          ? error.message
          : "Failed to generate barcode PDF"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Extract necessary fields from the nested structure
  const { detail, material, drum_quantity, drums } = orderDetail;
  const { detail_id } = detail;

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
            <p className="text-xl font-semibold text-white">{material}</p>
          </div>
          <div className="space-y-1">
            <p className="text-slate-400 text-sm">Drum Quantity</p>
            <p className="text-xl font-semibold text-white">{drum_quantity}</p>
          </div>
          <div className="space-y-1">
            <p className="text-slate-400 text-sm">Generated Drums</p>
            <p className="text-xl font-semibold text-white">{drums.length}</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-600" />

      {/* PDF Generation Section */}
      <div className="space-y-3">
        <p className="text-slate-300 text-sm">
          Generate and print barcode labels for the {drum_quantity} drums of{" "}
          {material}.
        </p>
        <button
          onClick={handleGeneratePDF}
          disabled={isGenerating}
          className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all duration-200 hover:translate-y-[-2px] active:translate-y-0 shadow-lg hover:shadow-blue-500/25"
        >
          {isGenerating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <FileDown className="w-5 h-5 transition-transform group-hover:scale-110" />
          )}
          <span className="font-medium">
            {isGenerating ? "Generating PDF..." : "Download Barcode Labels"}
          </span>
        </button>
      </div>
    </div>
  );
};
