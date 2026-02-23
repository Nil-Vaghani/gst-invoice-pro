import { useEffect, useState } from "react";
import {
  Trash2,
  RefreshCcw,
  ChevronDown,
  ChevronUp,
  Clock,
  IndianRupee,
  AlertCircle,
  X,
  Download,
  Loader2,
} from "lucide-react";
import jsPDF from "jspdf";
import { fetchInvoices, deleteInvoice } from "../utils/api";
import { formatINR, formatDate } from "../utils/calculations";

export default function InvoiceHistory({ refreshKey = 0 }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  // ── Fetch invoices on mount ─────────────────────────────
  const loadInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchInvoices();
      setInvoices(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, [refreshKey]);

  // ── Delete handler ──────────────────────────────────────
  const requestDelete = (id) => {
    setConfirmDeleteId(id);
    setDeleteError(null);
  };

  const cancelDelete = () => setConfirmDeleteId(null);

  const confirmDelete = async () => {
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    setDeletingId(id);
    setDeleteError(null);
    try {
      await deleteInvoice(id);
      setInvoices((prev) => prev.filter((inv) => inv._id !== id));
    } catch (err) {
      setDeleteError(err.message);
      setTimeout(() => setDeleteError(null), 5000);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // ── Download PDF handler ──────────────────────────────
  const handleDownloadPdf = async (inv) => {
    setDownloadingId(inv._id);
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pw = pdf.internal.pageSize.getWidth();
      const margin = 15;
      const cw = pw - margin * 2;
      let y = margin;

      // Header bg
      pdf.setFillColor(30, 41, 59); // slate-800
      pdf.rect(0, 0, pw, 42, "F");

      // Business name
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text(inv.businessName || "Business", margin, 16);

      // Business address / GSTIN
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      if (inv.businessAddress) pdf.text(inv.businessAddress, margin, 23);
      if (inv.businessGSTIN)
        pdf.text(`GSTIN: ${inv.businessGSTIN}`, margin, 28);

      // Invoice number + date (right)
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.text("TAX INVOICE", pw - margin, 14, { align: "right" });
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.text(inv.invoiceNumber || "INV-XXXX", pw - margin, 21, {
        align: "right",
      });
      pdf.text(formatDate(inv.invoiceDate || inv.createdAt), pw - margin, 27, {
        align: "right",
      });

      // Bill to
      y = 52;
      pdf.setTextColor(100, 116, 139); // slate-500
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "bold");
      pdf.text("BILL TO", margin, y);
      y += 5;
      pdf.setTextColor(30, 41, 59);
      pdf.setFontSize(10);
      pdf.text(inv.clientName || "Client", margin, y);
      y += 5;
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      if (inv.clientAddress) {
        pdf.text(inv.clientAddress, margin, y);
        y += 4;
      }
      if (inv.clientGSTIN) {
        pdf.text(`GSTIN: ${inv.clientGSTIN}`, margin, y);
        y += 4;
      }

      // Items table header
      y += 6;
      pdf.setFillColor(241, 245, 249); // slate-100
      pdf.rect(margin, y - 4, cw, 8, "F");
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(100, 116, 139);
      pdf.text("#", margin + 2, y);
      pdf.text("ITEM", margin + 12, y);
      pdf.text("QTY", margin + cw * 0.55, y);
      pdf.text("PRICE", margin + cw * 0.7, y, { align: "right" });
      pdf.text("AMOUNT", margin + cw, y, { align: "right" });
      y += 6;

      // Items rows
      pdf.setTextColor(30, 41, 59);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      (inv.items || []).forEach((item, i) => {
        pdf.text(String(i + 1), margin + 2, y);
        pdf.text(item.productName || "—", margin + 12, y);
        pdf.text(String(item.quantity || 0), margin + cw * 0.55, y);
        pdf.text(formatINR(item.price), margin + cw * 0.7, y, {
          align: "right",
        });
        pdf.setFont("helvetica", "bold");
        pdf.text(formatINR(item.amount), margin + cw, y, { align: "right" });
        pdf.setFont("helvetica", "normal");
        y += 6;
      });

      // Totals
      y += 4;
      pdf.setDrawColor(226, 232, 240);
      pdf.line(margin + cw * 0.5, y, margin + cw, y);
      y += 6;
      const gstRate = inv.gstRate || 0;
      const totals = [
        ["Subtotal", formatINR(inv.subTotal)],
        [`CGST (${gstRate / 2}%)`, formatINR(inv.cgstAmount)],
        [`SGST (${gstRate / 2}%)`, formatINR(inv.sgstAmount)],
      ];
      pdf.setFontSize(8);
      totals.forEach(([label, val]) => {
        pdf.setTextColor(100, 116, 139);
        pdf.text(label, margin + cw * 0.6, y);
        pdf.setTextColor(30, 41, 59);
        pdf.text(val, margin + cw, y, { align: "right" });
        y += 5;
      });

      // Grand total
      y += 1;
      pdf.setDrawColor(30, 41, 59);
      pdf.setLineWidth(0.5);
      pdf.line(margin + cw * 0.5, y, margin + cw, y);
      y += 6;
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(30, 41, 59);
      pdf.text("Grand Total", margin + cw * 0.6, y);
      pdf.text(formatINR(inv.grandTotal), margin + cw, y, { align: "right" });

      // Footer
      y += 15;
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(148, 163, 184);
      pdf.text(
        "This is a computer-generated invoice and does not require a physical signature.",
        pw / 2,
        y,
        { align: "center" },
      );

      const fileName = `Invoice-${inv.invoiceNumber || "DRAFT"}-${formatDate(inv.invoiceDate || inv.createdAt).replace(/\//g, "-")}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setDownloadingId(null);
    }
  };

  // ── Loading / Error / Empty states ──────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500"></div>
        <p className="mt-3 text-sm text-white/50">Loading invoices…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 backdrop-blur-sm p-6 text-center">
        <p className="text-sm font-semibold text-red-300">
          Failed to load invoices
        </p>
        <p className="mt-1 text-xs text-red-400/70">{error}</p>
        <button
          onClick={loadInvoices}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-red-500/20 border border-red-500/30 px-4 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/30 transition-colors"
        >
          <RefreshCcw size={13} />
          Retry
        </button>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/15 py-16">
        <Clock size={36} className="text-white/20" />
        <p className="mt-3 text-sm font-semibold text-white/50">
          No invoices yet
        </p>
        <p className="mt-1 text-xs text-white/30">
          Create your first invoice using the form above.
        </p>
      </div>
    );
  }

  // ── Invoice List ────────────────────────────────────────
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white/60">
          {invoices.length} Invoice(s)
        </h3>
        <button
          onClick={loadInvoices}
          className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/50 transition-colors hover:bg-white/10 hover:text-white/70"
        >
          <RefreshCcw size={12} />
          Refresh
        </button>
      </div>

      {invoices.map((inv) => {
        const isExpanded = expandedId === inv._id;
        return (
          <div
            key={inv._id}
            className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.1)]"
          >
            {/* Summary Row */}
            <div
              onClick={() => toggleExpand(inv._id)}
              className="flex cursor-pointer items-center justify-between px-5 py-4 transition-colors hover:bg-white/5"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 ring-1 ring-indigo-500/20">
                  <IndianRupee size={18} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white/90">
                    {inv.invoiceNumber || "INV-XXXX"}
                  </p>
                  <p className="text-xs text-white/40">
                    {inv.clientName} &middot;{" "}
                    {formatDate(inv.invoiceDate || inv.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-extrabold text-white/90">
                  {formatINR(inv.grandTotal)}
                </span>
                {isExpanded ? (
                  <ChevronUp size={16} className="text-white/30" />
                ) : (
                  <ChevronDown size={16} className="text-white/30" />
                )}
              </div>
            </div>

            {/* Expanded Detail */}
            {isExpanded && (
              <div className="border-t border-white/5 bg-white/[0.03] px-5 py-4">
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-white/30">
                      Business:
                    </span>{" "}
                    <span className="text-white/60">{inv.businessName}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-white/30">Client:</span>{" "}
                    <span className="text-white/60">{inv.clientName}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-white/30">
                      GST Rate:
                    </span>{" "}
                    <span className="text-white/60">{inv.gstRate}%</span>
                  </div>
                  <div>
                    <span className="font-semibold text-white/30">
                      Subtotal:
                    </span>{" "}
                    <span className="text-white/60">
                      {formatINR(inv.subTotal)}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-white/30">CGST:</span>{" "}
                    <span className="text-white/60">
                      {formatINR(inv.cgstAmount)}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-white/30">SGST:</span>{" "}
                    <span className="text-white/60">
                      {formatINR(inv.sgstAmount)}
                    </span>
                  </div>
                </div>

                {/* Items */}
                {inv.items && inv.items.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/30">
                      Items
                    </p>
                    <div className="space-y-1">
                      {inv.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-md bg-white/[0.03] px-3 py-1.5 text-xs transition-colors hover:bg-white/5"
                        >
                          <span className="text-white/60">
                            {item.productName} &times; {item.quantity}
                          </span>
                          <span className="font-semibold text-white/80">
                            {formatINR(item.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadPdf(inv);
                    }}
                    disabled={downloadingId === inv._id}
                    className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-400 transition-all hover:bg-indigo-500/20 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] disabled:opacity-50"
                  >
                    {downloadingId === inv._id ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Download size={13} />
                    )}
                    {downloadingId === inv._id ? "Generating…" : "Download PDF"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      requestDelete(inv._id);
                    }}
                    disabled={deletingId === inv._id}
                    className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition-all hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] disabled:opacity-50"
                  >
                    <Trash2 size={13} />
                    {deletingId === inv._id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* ── Delete Confirmation Modal ─────────────────────── */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#1a1145]/95 backdrop-blur-xl p-6 shadow-2xl">
            <h4 className="text-base font-bold text-white">Delete Invoice?</h4>
            <p className="mt-1 text-sm text-white/50">
              This action cannot be undone. The invoice will be permanently
              removed.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/60 transition-colors hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-lg bg-red-500/80 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Error Toast ────────────────────────────── */}
      {deleteError && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 backdrop-blur-xl px-4 py-3 text-sm font-medium text-red-300 shadow-lg animate-fade-in">
          <AlertCircle size={16} className="shrink-0" />
          <span>Delete failed: {deleteError}</span>
          <button
            onClick={() => setDeleteError(null)}
            className="ml-2 rounded-full p-0.5 hover:bg-red-500/20"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
