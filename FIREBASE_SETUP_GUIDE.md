# Firebase Setup Guide - Production Deployment on Render

## Overview

This guide explains how to set up Firebase authentication for production deployment on Render.

## Why This Is Needed

The backend code (`backend/firebaseAdmin.js`) has two initialization paths:

1. **Local Development**: Reads from `firebase-service-account.json` file (safe, not committed to git)
2. **Production (Render)**: Uses environment variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)

## Step 1: Get Firebase Service Account Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select project: **gst-invoice-b2044**
3. Navigate to **Service Accounts** (search in top bar)
4. Click on service account: `firebase-adminsdk-fbsvc@gst-invoice-b2044.iam.gserviceaccount.com`
5. Go to **Keys** tab
6. Click **Add Key** → **Create new key** → **JSON**
7. A JSON file will download automatically
8. Open the JSON file and note these 3 values:
   - `project_id`
   - `private_key` (starts with `-----BEGIN PRIVATE KEY-----`)
   - `client_email`

## Step 2: Prepare the Private Key

The private key needs special formatting for environment variables:

**In the JSON file**, the private key looks like:

```
"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEv...(many lines)...\n-----END PRIVATE KEY-----\n"
```

**For Render env var**, copy the exact value as-is (with literal `\n` characters):

```
-----BEGIN PRIVATE KEY-----\nMIIEv...(many lines)...\n-----END PRIVATE KEY-----\n
```

## Step 3: Set Environment Variables on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your backend service: **gst-invoice-backend**
3. Go to **Environment** tab (left sidebar)
4. Add these 3 environment variables:

| Variable                | Value                                              |
| ----------------------- | -------------------------------------------------- |
| `FIREBASE_PROJECT_ID`   | From JSON: `project_id` field                      |
| `FIREBASE_CLIENT_EMAIL` | From JSON: `client_email` field                    |
| `FIREBASE_PRIVATE_KEY`  | From JSON: `private_key` field (with literal `\n`) |

5. Click **Save** - Render will automatically redeploy your backend

## Step 4: Add Authorized Domains in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/project/gst-invoice-b2044/authentication/settings)
2. Scroll to **Authorized domains**
3. Ensure these domains are added:
   - ✅ `localhost:5173` (local development)
   - ✅ `gst-invoice-pro-eight.vercel.app` (production)

If missing, click **Add domain** and add them.

## Step 5: Test Google Sign-In

1. Go to production frontend: https://gst-invoice-pro-eight.vercel.app/signup
2. Click **Continue with Google**
3. Sign in with your Google account
4. Verify you're redirected to the dashboard

## Troubleshooting

### "Failed to parse private key"

- **Cause**: Private key format is wrong
- **Fix**: Ensure the `FIREBASE_PRIVATE_KEY` value includes literal `\n` characters (not actual newlines)
- **Verify**: In Render, click the eye icon to view the variable - should show `\n` as text

### "Invalid token" or "401 Unauthorized"

- **Cause**: Wrong FIREBASE_CLIENT_EMAIL or FIREBASE_PROJECT_ID
- **Fix**: Double-check both values match your JSON file exactly
- **Example**: Should be `firebase-adminsdk-fbsvc@gst-invoice-b2044.iam.gserviceaccount.com`

### "Unauthorized domain"

- **Cause**: Your production domain isn't in Firebase authorized domains
- **Fix**: Add `gst-invoice-pro-eight.vercel.app` to authorized domains
- **Note**: Takes a few minutes to propagate

### Backend won't start

- **Cause**: Environment variables not set correctly
- **Fix**: Force redeploy on Render (Manual Deploy → Deploy latest commit)
- **Verify**: Check Render logs for error messages

## How It Works

```javascript
// backend/firebaseAdmin.js initialization logic:

// 1. Check for local JSON file (development)
if (fs.existsSync("firebase-service-account.json")) {
  serviceAccount = JSON.parse(fs.readFileSync(...))
}

// 2. Fall back to environment variables (production)
else {
  serviceAccount = {
    project_id: process.env.FIREBASE_PROJECT_ID,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    //                                                ↑ converts \n strings to actual newlines
  }
}

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})
```

## Security Notes

⚠️ **IMPORTANT**:

- Never commit the actual `firebase-service-account.json` to git (it's in `.gitignore`)
- Never share the private key in messages or documentation
- Private keys should only be stored as environment variables on Render
- If a private key is exposed, invalidate it immediately in Google Cloud Console and create a new one

## Local Development

For local development, the backend automatically uses `backend/firebase-service-account.json`:

1. Place the JSON file at: `backend/firebase-service-account.json`
2. Add it to `.gitignore` (already done)
3. Restart your backend: `npm start`
4. Backend will automatically load the JSON file

No need to set environment variables locally - the code checks for the file first.
