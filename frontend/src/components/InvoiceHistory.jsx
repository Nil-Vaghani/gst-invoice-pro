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
} from "lucide-react";
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

  // ── Loading / Error / Empty states ──────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
        <p className="mt-3 text-sm text-slate-500">Loading invoices…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm font-semibold text-red-600">
          Failed to load invoices
        </p>
        <p className="mt-1 text-xs text-red-500">{error}</p>
        <button
          onClick={loadInvoices}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
        >
          <RefreshCcw size={13} />
          Retry
        </button>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-16">
        <Clock size={36} className="text-slate-300" />
        <p className="mt-3 text-sm font-semibold text-slate-500">
          No invoices yet
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Create your first invoice using the form above.
        </p>
      </div>
    );
  }

  // ── Invoice List ────────────────────────────────────────
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-600">
          {invoices.length} Invoice(s)
        </h3>
        <button
          onClick={loadInvoices}
          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50"
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
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Summary Row */}
            <div
              onClick={() => toggleExpand(inv._id)}
              className="flex cursor-pointer items-center justify-between px-5 py-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                  <IndianRupee size={18} className="text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">
                    {inv.invoiceNumber || "INV-XXXX"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {inv.clientName} &middot;{" "}
                    {formatDate(inv.invoiceDate || inv.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-extrabold text-slate-800">
                  {formatINR(inv.grandTotal)}
                </span>
                {isExpanded ? (
                  <ChevronUp size={16} className="text-slate-400" />
                ) : (
                  <ChevronDown size={16} className="text-slate-400" />
                )}
              </div>
            </div>

            {/* Expanded Detail */}
            {isExpanded && (
              <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-4">
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-slate-400">
                      Business:
                    </span>{" "}
                    <span className="text-slate-600">{inv.businessName}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400">
                      Client:
                    </span>{" "}
                    <span className="text-slate-600">{inv.clientName}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400">
                      GST Rate:
                    </span>{" "}
                    <span className="text-slate-600">{inv.gstRate}%</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400">
                      Subtotal:
                    </span>{" "}
                    <span className="text-slate-600">
                      {formatINR(inv.subTotal)}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400">CGST:</span>{" "}
                    <span className="text-slate-600">
                      {formatINR(inv.cgstAmount)}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400">SGST:</span>{" "}
                    <span className="text-slate-600">
                      {formatINR(inv.sgstAmount)}
                    </span>
                  </div>
                </div>

                {/* Items */}
                {inv.items && inv.items.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Items
                    </p>
                    <div className="space-y-1">
                      {inv.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-md bg-white px-3 py-1.5 text-xs"
                        >
                          <span className="text-slate-600">
                            {item.productName} &times; {item.quantity}
                          </span>
                          <span className="font-semibold text-slate-700">
                            {formatINR(item.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      requestDelete(inv._id);
                    }}
                    disabled={deletingId === inv._id}
                    className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h4 className="text-base font-bold text-slate-800">
              Delete Invoice?
            </h4>
            <p className="mt-1 text-sm text-slate-500">
              This action cannot be undone. The invoice will be permanently
              removed.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Error Toast ────────────────────────────── */}
      {deleteError && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-lg animate-fade-in">
          <AlertCircle size={16} className="shrink-0" />
          <span>Delete failed: {deleteError}</span>
          <button
            onClick={() => setDeleteError(null)}
            className="ml-2 rounded-full p-0.5 hover:bg-red-100"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
