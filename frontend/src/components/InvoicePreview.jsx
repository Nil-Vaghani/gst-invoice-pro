import { useRef, useState } from "react";
import { Download, FileText, Loader2, AlertCircle } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  formatINR,
  formatDate,
  calculateInvoiceTotals,
  calcItemAmount,
} from "../utils/calculations";

export default function InvoicePreview({ formData, invoiceNumber }) {
  const previewRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  const gstRate = Number(formData.gstRate) || 0;

  const { subTotal, cgstAmount, sgstAmount, grandTotal } =
    calculateInvoiceTotals(formData.items, gstRate);

  // ── PDF Download (production-grade) ─────────────────────
  const handleDownload = async () => {
    const element = previewRef.current;
    if (!element) return;

    setIsGenerating(true);
    setPdfError(null);
    try {
      // Temporarily remove border-radius & shadow for cleaner PDF
      const origStyle = element.style.cssText;
      element.style.borderRadius = "0";
      element.style.boxShadow = "none";
      element.style.border = "none";

      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        allowTaint: true,
        removeContainer: true,
      });

      // Restore original styles
      element.style.cssText = origStyle;

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 5;
      const usableWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * usableWidth) / canvas.width;

      // Handle multi-page if content exceeds A4 height
      if (imgHeight <= pageHeight - margin * 2) {
        // Single page — center vertically
        pdf.addImage(imgData, "PNG", margin, margin, usableWidth, imgHeight);
      } else {
        // Multi-page support
        let remainingHeight = imgHeight;
        let position = 0;
        let page = 0;

        while (remainingHeight > 0) {
          if (page > 0) pdf.addPage();
          const sliceHeight = Math.min(
            remainingHeight,
            pageHeight - margin * 2,
          );
          pdf.addImage(
            imgData,
            "PNG",
            margin,
            margin - position,
            usableWidth,
            imgHeight,
          );
          position += pageHeight - margin * 2;
          remainingHeight -= sliceHeight;
          page++;
        }
      }

      const fileName = `Invoice-${invoiceNumber || "DRAFT"}-${new Date().toISOString().split("T")[0]}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error("PDF generation failed:", err);
      setPdfError("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const hasItems = formData.items.some((i) => i.productName.trim() !== "");

  return (
    <div className="space-y-4 pb-4">
      {/* Download Button — disabled until invoice is saved */}
      <button
        onClick={handleDownload}
        disabled={!invoiceNumber || isGenerating}
        title={
          !invoiceNumber
            ? "Save the invoice first to enable download"
            : "Download invoice as PDF"
        }
        className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-sm font-bold transition-all duration-300 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${
          invoiceNumber
            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/40 hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] hover:-translate-y-1 active:shadow-md"
            : "bg-white/5 text-white/30 border border-white/10"
        }`}
      >
        {isGenerating ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Generating PDF…
          </>
        ) : (
          <>
            <Download size={16} />
            {invoiceNumber ? "Download PDF" : "Save invoice to download"}
          </>
        )}
      </button>

      {/* PDF Error Banner */}
      {pdfError && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 backdrop-blur-sm px-4 py-2.5 text-sm text-red-300 animate-fade-in">
          <AlertCircle size={16} className="shrink-0" />
          {pdfError}
        </div>
      )}

      {/* ── Invoice Preview Card ─────────────────────────── */}
      <div
        ref={previewRef}
        className="overflow-hidden rounded-sm bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
      >
        {/* Header Bar */}
        <div className="rounded-t-xl bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-white">
                {formData.businessName || "Your Business Name"}
              </h2>
              {formData.businessAddress && (
                <p className="mt-1 text-sm text-slate-300">
                  {formData.businessAddress}
                </p>
              )}
              {formData.businessGSTIN && (
                <p className="mt-0.5 text-xs font-medium text-slate-400">
                  GSTIN: {formData.businessGSTIN}
                </p>
              )}
              {formData.businessPhone && (
                <p className="mt-0.5 text-xs text-slate-400">
                  Ph: {formData.businessPhone}
                </p>
              )}
              {formData.businessEmail && (
                <p className="text-xs text-slate-400">
                  {formData.businessEmail}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur">
                <FileText size={14} className="text-primary-300" />
                <span className="text-xs font-bold text-white">
                  TAX INVOICE
                </span>
              </div>
              <p className="mt-2 text-xs font-semibold text-slate-300">
                {invoiceNumber || "INV-DRAFT"}
              </p>
              <p className="text-xs text-slate-400">
                {formData.invoiceDate
                  ? formatDate(formData.invoiceDate)
                  : formatDate(new Date())}
              </p>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="border-b border-slate-100 px-8 py-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Bill To
          </p>
          <p className="mt-1 text-sm font-bold text-slate-800">
            {formData.clientName || "Client Name"}
          </p>
          {formData.clientAddress && (
            <p className="text-xs text-slate-500">{formData.clientAddress}</p>
          )}
          {formData.clientGSTIN && (
            <p className="text-xs text-slate-500">
              GSTIN: {formData.clientGSTIN}
            </p>
          )}
          {formData.clientPhone && (
            <p className="text-xs text-slate-500">Ph: {formData.clientPhone}</p>
          )}
        </div>

        {/* Items Table */}
        <div className="px-8 py-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="pb-2 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  #
                </th>
                <th className="pb-2 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Item / Service
                </th>
                <th className="pb-2 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Qty
                </th>
                <th className="pb-2 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Price
                </th>
                <th className="pb-2 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {formData.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-2.5 text-xs text-slate-400">{idx + 1}</td>
                  <td className="py-2.5 font-medium text-slate-700">
                    {item.productName || "—"}
                  </td>
                  <td className="py-2.5 text-center text-slate-600">
                    {Number(item.quantity) || 0}
                  </td>
                  <td className="py-2.5 text-right text-slate-600">
                    {formatINR(item.price)}
                  </td>
                  <td className="py-2.5 text-right font-semibold text-slate-700">
                    {formatINR(calcItemAmount(item.quantity, item.price))}
                  </td>
                </tr>
              ))}
              {!hasItems && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-xs text-slate-400"
                  >
                    Add items in the form to see them here
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="border-t border-slate-200 px-8 py-5">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium text-slate-700">
                  {formatINR(subTotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">CGST ({gstRate / 2}%)</span>
                <span className="font-medium text-slate-700">
                  {formatINR(cgstAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">SGST ({gstRate / 2}%)</span>
                <span className="font-medium text-slate-700">
                  {formatINR(sgstAmount)}
                </span>
              </div>
              <div className="flex justify-between border-t-2 border-slate-800 pt-2 text-base">
                <span className="font-extrabold text-slate-800">
                  Grand Total
                </span>
                <span className="font-extrabold text-slate-800">
                  {formatINR(grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes & Footer */}
        {formData.notes && (
          <div className="border-t border-slate-100 px-8 py-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Notes / Terms
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              {formData.notes}
            </p>
          </div>
        )}

        <div className="rounded-b-xl bg-slate-50 px-8 py-4 text-center">
          <p className="text-[10px] text-slate-400">
            This is a computer-generated invoice and does not require a physical
            signature.
          </p>
        </div>
      </div>
    </div>
  );
}
