const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "https://gst-invoice-backend-2wcc.onrender.com/api";
const INVOICES_URL = `${API_BASE}/invoices`;
const AUTH_URL = `${API_BASE}/auth`;

/**
 * Get auth headers with JWT token
 */
function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

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

// ── Auth Endpoints ────────────────────────────────────────

/**
 * Sign up a new user
 */
export async function signupUser({ name, email, password }) {
  let res;
  try {
    res = await fetch(`${AUTH_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
  } catch (err) {
    throw new Error("Cannot reach the server. Please try again later.");
  }
  if (!res.ok) {
    const msg = await parseError(res);
    throw new Error(msg);
  }
  return res.json();
}

/**
 * Log in an existing user
 */
export async function loginUser({ email, password }) {
  let res;
  try {
    res = await fetch(`${AUTH_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch (err) {
    throw new Error("Cannot reach the server. Please try again later.");
  }
  if (!res.ok) {
    const msg = await parseError(res);
    throw new Error(msg);
  }
  return res.json();
}

/**
 * Social login — send Firebase ID token to backend for verification
 */
export async function socialLogin(idToken) {
  let res;
  try {
    res = await fetch(`${AUTH_URL}/social`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
  } catch (err) {
    throw new Error("Cannot reach the server. Please try again later.");
  }
  if (!res.ok) {
    const msg = await parseError(res);
    throw new Error(msg);
  }
  return res.json();
}

// ── Invoice Endpoints (protected) ─────────────────────────

/**
 * Save a new invoice to the backend
 */
export async function saveInvoice(invoiceData) {
  let res;
  try {
    res = await fetch(INVOICES_URL, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(invoiceData),
    });
  } catch (err) {
    throw new Error("Cannot reach the server. Is the backend running?");
  }
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new CustomEvent("auth:logout"));
    throw new Error("Session expired. Please log in again.");
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
    res = await fetch(INVOICES_URL, {
      headers: authHeaders(),
    });
  } catch (err) {
    throw new Error("Cannot reach the server. Is the backend running?");
  }
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new CustomEvent("auth:logout"));
    throw new Error("Session expired. Please log in again.");
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
    res = await fetch(`${INVOICES_URL}/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
  } catch (err) {
    throw new Error("Cannot reach the server. Is the backend running?");
  }
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new CustomEvent("auth:logout"));
    throw new Error("Session expired. Please log in again.");
  }
  if (!res.ok) {
    const msg = await parseError(res);
    throw new Error(msg);
  }
  return res.json();
}
