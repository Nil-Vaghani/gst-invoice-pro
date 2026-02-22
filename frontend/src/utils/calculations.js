/**
 * GST Calculation Utilities
 * All math logic for the GST Invoice Generator
 */

const GST_SLABS = [5, 12, 18, 28];

/**
 * Calculate the line-item amount (qty × price)
 * Gracefully handles empty strings / NaN
 */
export function calcItemAmount(quantity, price) {
  const q = Number(quantity) || 0;
  const p = Number(price) || 0;
  return Math.round(q * p * 100) / 100;
}

/**
 * Calculate subtotal from an array of items
 */
export function calcSubTotal(items) {
  if (!items || items.length === 0) return 0;
  return items.reduce((sum, item) => {
    const amount = calcItemAmount(item.quantity, item.price);
    return Math.round((sum + amount) * 100) / 100;
  }, 0);
}

/**
 * Calculate CGST amount (half of GST rate applied to subtotal)
 */
export function calcCGST(subTotal, gstRate) {
  const rate = Number(gstRate) || 0;
  return Math.round(((subTotal * (rate / 2)) / 100) * 100) / 100;
}

/**
 * Calculate SGST amount (same as CGST for intra-state)
 */
export function calcSGST(subTotal, gstRate) {
  return calcCGST(subTotal, gstRate);
}

/**
 * Calculate the grand total = subtotal + CGST + SGST
 */
export function calcGrandTotal(subTotal, cgst, sgst) {
  return Math.round((subTotal + cgst + sgst) * 100) / 100;
}

/**
 * Full calculation pipeline — returns all computed fields
 */
export function calculateInvoiceTotals(items, gstRate) {
  const rate = Number(gstRate) || 0;
  const subTotal = calcSubTotal(items);
  const cgstAmount = calcCGST(subTotal, rate);
  const sgstAmount = calcSGST(subTotal, rate);
  const grandTotal = calcGrandTotal(subTotal, cgstAmount, sgstAmount);

  return { subTotal, cgstAmount, sgstAmount, grandTotal };
}

/**
 * Format number as INR (₹1,23,456.00)
 */
export function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a date to readable Indian format
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Generate a default empty item
 */
export function createEmptyItem() {
  return {
    productName: "",
    quantity: "",
    price: "",
    amount: 0,
  };
}

export { GST_SLABS };
