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

  // ── Dark Glowing Input & Label classes ────────────────
  const inputCls =
    "w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white transition-all duration-300 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:shadow-[0_0_15px_rgba(99,102,241,0.5)] focus:border-indigo-500/50 hover:bg-black/30";
  const labelCls =
    "mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-white/40";

  const gstRate = Number(formData.gstRate) || 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Business Details ──────────────────────────── */}
      <fieldset className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]">
        <legend className="flex items-center gap-2 px-1 text-sm font-semibold tracking-tight text-white">
          <Building2 size={16} className="text-indigo-400" />
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
      <fieldset className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]">
        <legend className="flex items-center gap-2 px-1 text-sm font-semibold tracking-tight text-white">
          <User size={16} className="text-indigo-400" />
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
      <fieldset className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]">
        <legend className="flex items-center gap-2 px-1 text-sm font-semibold tracking-tight text-white">
          <Package size={16} className="text-indigo-400" />
          Items / Services
        </legend>

        <div className="mt-3 space-y-3">
          {formData.items.map((item, idx) => (
            <div
              key={idx}
              className="animate-fade-in rounded-xl border border-white/5 bg-white/[0.03] p-4 transition-all duration-300"
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
                  <p className="truncate py-2.5 text-sm font-semibold text-white/70">
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
                    className="mb-1 rounded-lg p-2 text-red-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-300 hover:shadow-[0_0_10px_rgba(239,68,68,0.3)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-red-400 disabled:hover:shadow-none"
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
          className="mt-4 flex items-center gap-1.5 rounded-xl border border-dashed border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-400 transition-all duration-200 hover:bg-indigo-500/20 hover:border-indigo-400/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]"
        >
          <Plus size={15} />
          Add Item
        </button>
      </fieldset>

      {/* ── GST Rate & Notes ──────────────────────────── */}
      <fieldset className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]">
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
                " cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:invert"
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

      {/* ── Neon Submit Button ─────────────────────────── */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] hover:-translate-y-1 active:translate-y-0 active:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
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
