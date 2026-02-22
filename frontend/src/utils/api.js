const API_BASE = "https://gst-invoice-backend-2wcc.onrender.com/api/invoices";

/**
 * Parse error response — handles JSON and non-JSON responses
 */
async function parseError(res) {
  try {
    const data = await res.json();
    return (
      data.message ||
      data.errors?.join(", ") ||
      `Request failed (${res.status})`
    );
  } catch {
    return `Request failed with status ${res.status}`;
  }
}

/**
 * Save a new invoice to the backend
 */
export async function saveInvoice(invoiceData) {
  let res;
  try {
    res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invoiceData),
    });
  } catch (err) {
    throw new Error(
      "Cannot reach the server. Is the backend running on port 5000?",
    );
  }
  if (!res.ok) {
    const msg = await parseError(res);
    throw new Error(msg);
  }
  return res.json();
}

/**
 * Fetch all invoices from the backend
 */
export async function fetchInvoices() {
  let res;
  try {
    res = await fetch(API_BASE);
  } catch (err) {
    throw new Error(
      "Cannot reach the server. Is the backend running on port 5000?",
    );
  }
  if (!res.ok) {
    const msg = await parseError(res);
    throw new Error(msg);
  }
  return res.json();
}

/**
 * Delete an invoice by ID
 */
export async function deleteInvoice(id) {
  let res;
  try {
    res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  } catch (err) {
    throw new Error(
      "Cannot reach the server. Is the backend running on port 5000?",
    );
  }
  if (!res.ok) {
    const msg = await parseError(res);
    throw new Error(msg);
  }
  return res.json();
}
