const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

/**
 * Lazy-initialize Firebase Admin SDK.
 * Priority: JSON key file (local dev) → env vars (production/Render).
 */
let initialized = false;

function getAdmin() {
  if (initialized) return admin;

  let serviceAccount = null;

  // 1. Try loading from JSON key file (local development)
  const keyFilePath = path.join(__dirname, "firebase-service-account.json");
  if (fs.existsSync(keyFilePath)) {
    serviceAccount = JSON.parse(fs.readFileSync(keyFilePath, "utf8"));
  }

  // 2. Fall back to env vars (production / Render)
  if (!serviceAccount) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (
      !projectId ||
      !clientEmail ||
      !privateKey ||
      projectId.startsWith("YOUR_") ||
      privateKey.includes("YOUR_PRIVATE_KEY_HERE")
    ) {
      throw new Error(
        "Firebase Admin SDK is not configured. Place firebase-service-account.json in the backend folder, or set FIREBASE_* env vars.",
      );
    }

    serviceAccount = {
      type: "service_account",
      project_id: projectId,
      private_key: privateKey.replace(/\\n/g, "\n"),
      client_email: clientEmail,
    };
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  initialized = true;
  console.log("✅ Firebase Admin SDK initialized");
  return admin;
}

module.exports = { getAdmin };
