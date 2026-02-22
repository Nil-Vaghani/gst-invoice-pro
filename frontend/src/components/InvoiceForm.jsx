import { Plus, Trash2, Building2, User, Package, Loader2 } from "lucide-react";
import {
  GST_SLABS,
  calcItemAmount,
  createEmptyItem,
} from "../utils/calculations";

export default function InvoiceForm({
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
}) {
  // ── Field Updaters ──────────────────────────────────────
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateItem = (index, field, value) => {
    setFormData((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      items[index].amount = calcItemAmount(
        items[index].quantity,
        items[index].price,
      );
      return { ...prev, items };
    });
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, createEmptyItem()],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  // ── Shared input classes (Stripe-style) ───────────────
  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-300";
  const labelCls =
    "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500";

  const gstRate = Number(formData.gstRate) || 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Business Details ──────────────────────────── */}
      <fieldset className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
        <legend className="flex items-center gap-2 px-1 text-sm font-semibold tracking-tight text-slate-900">
          <Building2 size={16} className="text-indigo-500" />
          Your Business Details
        </legend>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Business Name *</label>
            <input
              className={inputCls}
              placeholder="e.g. Shiv Tech Solutions Pvt Ltd"
              value={formData.businessName}
              onChange={(e) => updateField("businessName", e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelCls}>GSTIN</label>
            <input
              className={inputCls}
              placeholder="e.g. 24ABCDE1234F1Z5"
              maxLength={15}
              value={formData.businessGSTIN}
              onChange={(e) =>
                updateField("businessGSTIN", e.target.value.toUpperCase())
              }
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Address</label>
            <input
              className={inputCls}
              placeholder="e.g. 302, Shivalik Plaza, SG Highway, Ahmedabad - 380015"
              value={formData.businessAddress}
              onChange={(e) => updateField("businessAddress", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input
              className={inputCls}
              placeholder="e.g. +91 98765 43210"
              value={formData.businessPhone}
              onChange={(e) => updateField("businessPhone", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input
              className={inputCls}
              type="email"
              placeholder="e.g. billing@shivtech.com"
              value={formData.businessEmail}
              onChange={(e) => updateField("businessEmail", e.target.value)}
            />
          </div>
        </div>
      </fieldset>

      {/* ── Client Details ────────────────────────────── */}
      <fieldset className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
        <legend className="flex items-center gap-2 px-1 text-sm font-semibold tracking-tight text-slate-900">
          <User size={16} className="text-indigo-500" />
          Client / Bill To
        </legend>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Client Name *</label>
            <input
              className={inputCls}
              placeholder="e.g. ABC Enterprises"
              value={formData.clientName}
              onChange={(e) => updateField("clientName", e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelCls}>Client GSTIN</label>
            <input
              className={inputCls}
              placeholder="e.g. 24FGHIJ5678K1Z2"
              maxLength={15}
              value={formData.clientGSTIN}
              onChange={(e) =>
                updateField("clientGSTIN", e.target.value.toUpperCase())
              }
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Address</label>
            <input
              className={inputCls}
              placeholder="e.g. 12, Business Park, Prahladnagar, Ahmedabad - 380015"
              value={formData.clientAddress}
              onChange={(e) => updateField("clientAddress", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input
              className={inputCls}
              placeholder="e.g. +91 91234 56789"
              value={formData.clientPhone}
              onChange={(e) => updateField("clientPhone", e.target.value)}
            />
          </div>
        </div>
      </fieldset>

      {/* ── Line Items ────────────────────────────────── */}
      <fieldset className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
        <legend className="flex items-center gap-2 px-1 text-sm font-semibold tracking-tight text-slate-900">
          <Package size={16} className="text-indigo-500" />
          Items / Services
        </legend>

        <div className="mt-3 space-y-3">
          {formData.items.map((item, idx) => (
            <div
              key={idx}
              className="animate-fade-in rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all duration-300"
            >
              {/* Product name — full width on mobile, top row */}
              <div className="mb-2">
                <label className={labelCls}>Product / Service *</label>
                <input
                  className={inputCls}
                  placeholder="Enter product or service name"
                  value={item.productName}
                  onChange={(e) =>
                    updateItem(idx, "productName", e.target.value)
                  }
                  required
                />
              </div>

              {/* Qty, Price, Total, Delete — bottom row with flex */}
              <div className="flex items-end gap-2">
                <div className="min-w-0 flex-1">
                  <label className={labelCls}>Qty *</label>
                  <input
                    className={inputCls + " min-w-0"}
                    type="number"
                    min="1"
                    step="1"
                    placeholder="0"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(idx, "quantity", e.target.value)
                    }
                    onBlur={(e) => {
                      if (e.target.value === "" || Number(e.target.value) < 1) {
                        updateItem(idx, "quantity", "");
                      }
                    }}
                    required
                  />
                </div>
                <div className="min-w-0 flex-[1.5]">
                  <label className={labelCls}>Price (₹) *</label>
                  <input
                    className={inputCls + " min-w-0"}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={item.price}
                    onChange={(e) => updateItem(idx, "price", e.target.value)}
                    onBlur={(e) => {
                      if (e.target.value === "" || Number(e.target.value) < 0) {
                        updateItem(idx, "price", "");
                      }
                    }}
                    required
                  />
                </div>
                <div className="w-28 shrink-0 text-right">
                  <label className={labelCls}>Total</label>
                  <p className="truncate py-2.5 text-sm font-semibold text-slate-600">
                    ₹
                    {calcItemAmount(item.quantity, item.price).toLocaleString(
                      "en-IN",
                    )}
                  </p>
                </div>
                <div className="w-10 shrink-0 flex items-end justify-center">
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    disabled={formData.items.length <= 1}
                    className="mb-1 rounded-lg p-2 text-red-400 transition-all duration-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-red-400"
                    title={
                      formData.items.length <= 1
                        ? "At least one item required"
                        : "Remove item"
                    }
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="mt-4 flex items-center gap-1.5 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50 px-4 py-2 text-sm font-semibold text-indigo-600 transition-all duration-200 hover:bg-indigo-100 hover:border-indigo-300"
        >
          <Plus size={15} />
          Add Item
        </button>
      </fieldset>

      {/* ── GST Rate & Notes ──────────────────────────── */}
      <fieldset className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>GST Rate *</label>
            <select
              className={inputCls + " cursor-pointer"}
              value={formData.gstRate}
              onChange={(e) =>
                updateField(
                  "gstRate",
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
              required
            >
              <option value="" disabled>
                — Select GST Rate —
              </option>
              {GST_SLABS.map((rate) => (
                <option key={rate} value={rate}>
                  {rate}% GST ({rate / 2}% CGST + {rate / 2}% SGST)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Invoice Date</label>
            <input
              className={
                inputCls +
                " cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              }
              type="date"
              value={formData.invoiceDate}
              onChange={(e) => updateField("invoiceDate", e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Notes / Terms</label>
            <textarea
              className={inputCls + " resize-none"}
              rows={3}
              placeholder="Enter payment terms, bank details, or any additional notes..."
              value={formData.notes}
              onChange={(e) => updateField("notes", e.target.value)}
            />
          </div>
        </div>
      </fieldset>

      {/* ── Submit ─────────────────────────────────────── */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Saving Invoice…
          </>
        ) : (
          "💾  Save & Generate Invoice"
        )}
      </button>
    </form>
  );
}
