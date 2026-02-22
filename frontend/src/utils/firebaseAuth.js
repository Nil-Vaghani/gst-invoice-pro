import {
  GoogleAuthProvider,
  OAuthProvider,
  RecaptchaVerifier,
  signInWithPopup,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../firebaseConfig";

// ── Google Sign-In ────────────────────────────────────────
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const result = await signInWithPopup(auth, provider);
  const idToken = await result.user.getIdToken();
  return {
    idToken,
    user: {
      name: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
    },
  };
}

// ── Microsoft Sign-In ─────────────────────────────────────
export async function signInWithMicrosoft() {
  const provider = new OAuthProvider("microsoft.com");
  provider.setCustomParameters({ prompt: "select_account" });
  const result = await signInWithPopup(auth, provider);
  const idToken = await result.user.getIdToken();
  return {
    idToken,
    user: {
      name: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
    },
  };
}

// ── Apple Sign-In ─────────────────────────────────────────
export async function signInWithApple() {
  const provider = new OAuthProvider("apple.com");
  provider.addScope("email");
  provider.addScope("name");
  const result = await signInWithPopup(auth, provider);
  const idToken = await result.user.getIdToken();
  return {
    idToken,
    user: {
      name: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
    },
  };
}

// ── Phone OTP — Step 1: Send verification code ────────────
let recaptchaVerifier = null;

export function initRecaptcha(containerId) {
  // Clean up any existing verifier
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch {
      /* ignore */
    }
  }
  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
    callback: () => {
      // reCAPTCHA solved — allow signInWithPhoneNumber
    },
    "expired-callback": () => {
      // Reset if expired
      recaptchaVerifier = null;
    },
  });
  return recaptchaVerifier;
}

export async function sendPhoneOTP(phoneNumber) {
  if (!recaptchaVerifier) {
    throw new Error("reCAPTCHA not initialized. Please try again.");
  }
  const confirmationResult = await signInWithPhoneNumber(
    auth,
    phoneNumber,
    recaptchaVerifier,
  );
  return confirmationResult;
}

// ── Phone OTP — Step 2: Verify code ──────────────────────
export async function verifyPhoneOTP(confirmationResult, otp) {
  const userCredential = await confirmationResult.confirm(otp);
  const idToken = await userCredential.user.getIdToken();
  return {
    idToken,
    user: {
      name: userCredential.user.displayName || "Phone User",
      email: userCredential.user.email || null,
      phone: userCredential.user.phoneNumber,
      photoURL: userCredential.user.photoURL,
    },
  };
}

// ── Sign out from Firebase (cleanup) ─────────────────────
export async function firebaseSignOut() {
  try {
    await auth.signOut();
  } catch {
    /* ignore */
  }
}
