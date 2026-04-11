# Firebase Authentication Error Fix - Render Deployment

## Problem

❌ **Error on production**: `503 Service Unavailable` when clicking "Continue with Google"
❌ **Backend Error**: `Failed to parse private key: Error: Invalid PEM formatted message`
❌ **Root Cause**: Render backend doesn't have Firebase credentials set as environment variables

## Solution: Set Firebase Environment Variables on Render

The backend code (`backend/firebaseAdmin.js`) has two initialization paths:

1. **Local Development**: Reads from `firebase-service-account.json` (✅ works)
2. **Production (Render)**: Falls back to environment variables (❌ missing FIREBASE_PRIVATE_KEY)

### Step-by-Step Fix

#### Step 1: Go to Render Dashboard

1. Open https://dashboard.render.com
2. Click on your backend service: **gst-invoice-backend**
3. Go to **Environment** tab (on the left sidebar)

#### Step 2: Add Firebase Environment Variables

Add the following 3 environment variables:

**FIREBASE_PROJECT_ID**

```
gst-invoice-b2044
```

**FIREBASE_CLIENT_EMAIL**

```
firebase-adminsdk-fbsvc@gst-invoice-b2044.iam.gserviceaccount.com
```

**FIREBASE_PRIVATE_KEY** (Important: Use the exact format below with literal `\n` characters)

```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC34Pi3AoRmBTG1\nOtnrq6jRPPAOwj8pZ8DpdABsyBQqdE+o5KD9OQP34ohd9KhMS2mQ8/asyXZ3ndqq\nQ0P147kOHk6b+EHN9Et3Ndx8OE7UaX1DfcBFxttkLuV5xLVNPHuvwC66Lxb3kHvK\nsZrercQ45ZwXeRwEWEs+DS49gX8NEO6KLUv3kCj4fPjIPZJdJIHANz/LD4kXSaFN\n2+iIafGUuir8AHBngtb+hfc+pJnHbMPb5bwqNnuuNxQelpNqfaS71x2EbS0XsGOe\nlbVsZQJIKnFD/d6cNbOeDRUm4lw0+mqaH+/XK5QLSve33GhbxfD2Utj29+S62Azf\nuMA3fXDtAgMBAAECggEACFrQujIDVYZZZJhks+xUCpPH/YeuaoF0FrdmWIr7vZUU\n1IH03aSUTVRN6WT3K6ZGiOdI1z99IkC6IX/Wa+r5qs5OOJB+Xu8Bacx49OzzCfw0\nDJe/X3xCVio6U37QVQ7ROOJUzTFcDAoU0dghhwoirwohvkBKuVjQrGRZbEKAxRVi\n5bRsXVdcAypugakwqQEPg1l9s09IpoSPkqlXSqE8hyvfsu7tLmpd/PMlzoxikvld\nn6hv4BxtBcSePjekMtgUUMtmxFHb+IbNVCJovWri8uAzORjA5Rw40NfPZVJwdgta\n79nuPuecKHItxuyzYKLBi+GeWdC45jCZwrxEJbFmOQKBgQDa72fz2WRwHdD04wWy\nZdMx9AS/mSuGQzkCcKc7jVgte+LUewvJxlycHxuHQEuCr6ehMPDh4Uu43WyV+sU9\nmw0SMaSvQIpfJoXey6VMt9He2R0RNQ55tGq3Dvbb2MEmZrao8ACrnnS5zfAq/JhT\nMQ0jvRgl0fVVcFPxDoZiR0ptRQKBgQDXAjsY0gu14tKO8ghTqpHPV+DS9YTYOa+Y\nNCa7IB7XbUto6wh1FLCsSL1xHaV8gfiJozE+kNlMIzQbapptsKNjlstpJwKnONIn\nNQLyURhyp6w9tXwAGD+90OiCf4NB19K/0eUkTCf2oHNCwr9RS88o8Vfo8lLnEzGa\nL+Q1PAsLiQKBgFysLCd3JOGkbVfLZRTvrycc8Imdr2PEvrP+tXsqyGFwaEKi1wmQ\n8pCPRlrI522pJt6/Vad3c1MMPzN5E9aQ9EZ4Rwp72laOeuok75J62NZotroa6Eay\nDN3x8qJ6rL+xiK4X8WCz0Rr5RikcBOpp//LZzwfrSNriklWeXVnqbWG1AoGBAL8+\nP7yLEFl/YJQ/GkL5I+rOmq5qLfh6DwMN2Cl3n5c0ou+2pvYlKiSEKuUTXqAJpz0d\nx+6DvpRnd7CvOJ86j4pElbd5OHXvJ5YyI+XPVjSdian15E7dQs0epcF1lBWb19xA\n4VVQ2/cVrpACU1QHX0NmsDAGYtEglG02DgF/378pAoGAHRS2bDXIRa43rVd04SAX\ncaz3QK4s888Qodbu3rH6LM9/w4R6+nxXgVD3kK4EgI5PxPMNvV5aPkOQTZ9pBqPF\nJGep68aYbwzWNqHBNW726+k7czKrRf3v2yywnI4MnMuiyK/8jnr1n06k9C0hNnyt\n8bgL6nN9Vz63gfKJK8m8kD4=\n-----END PRIVATE KEY-----\n
```

#### Step 3: Save & Deploy

1. After adding all 3 variables, click **Save** (Render will automatically restart your backend)
2. Wait for the deployment to complete (check the "Events" tab)
3. You should see a new deployment build starting

#### Step 4: Add Authorized Domains in Firebase Console

1. Go to https://console.firebase.google.com/project/gst-invoice-b2044/authentication/settings
2. Scroll down to **Authorized domains**
3. Make sure both are added:
   - ✅ `localhost:5173` (local dev)
   - ✅ `gst-invoice-pro-eight.vercel.app` (production)
4. If `gst-invoice-pro-eight.vercel.app` is missing, click **Add domain** and add it

#### Step 5: Test Google Sign-In

1. Go to your production frontend: https://gst-invoice-pro-eight.vercel.app/signup
2. Click **Continue with Google**
3. Sign in with your Google account
4. You should be redirected to the dashboard after successful authentication

## Troubleshooting

If you still get errors after setting the variables:

### Error: "Failed to parse private key"

- **Cause**: The FIREBASE_PRIVATE_KEY contains actual newlines instead of escaped `\n`
- **Fix**: Make sure you copy the exact private key value from this document (with `\n` characters)
- **Verify**: In Render dashboard, click the eye icon to view the variable - it should show `\n` as literal text, not actual newlines

### Error: "Invalid token" or "401 Unauthorized"

- **Cause**: The FIREBASE_CLIENT_EMAIL or FIREBASE_PROJECT_ID is incorrect
- **Fix**: Double-check both values match exactly what's shown above
- **Verify**: Compare with the JSON file in `backend/firebase-service-account.json`

### Error: "Unauthorized domain"

- **Cause**: Your production domain isn't added to Firebase authorized domains
- **Fix**: Add `gst-invoice-pro-eight.vercel.app` to authorized domains in Firebase Console
- **Note**: Changes may take a few minutes to propagate

### Still not working?

1. Force refresh Render: Go to Render dashboard → Manual Deploy → Deploy latest commit
2. Clear browser cache and cookies
3. Try signing in again in an incognito window

## How This Works

The backend initialization flow:

```javascript
// 1. Try local JSON file (development)
if (fs.existsSync("firebase-service-account.json")) {
  // Load from file ✓ (local)
}

// 2. Fall back to environment variables (production)
else {
  // Parse FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, FIREBASE_PROJECT_ID ✓ (Render)
  privateKey.replace(/\\n/g, "\n"); // Convert \n strings to actual newlines
}
```

The line `privateKey.replace(/\\n/g, "\n")` is critical - it converts the escaped `\n` from the environment variable into actual newline characters that Firebase's PEM parser expects.
