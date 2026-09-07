import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCQuFacjdgPXub5dyevrTOAyo5DA6i4PKE",
  authDomain: "geopulse-960e4.firebaseapp.com",
  projectId: "geopulse-960e4",
  storageBucket: "geopulse-960e4.firebasestorage.app",
  messagingSenderId: "619736173202",
  appId: "1:619736173202:web:680dc77de63043c4ac344b",
  measurementId: "G-WHXZ28R5W7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Helper to set up invisible Recaptcha Verifier
export const setupRecaptcha = (containerId = "recaptcha-container") => {
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch (e) { }
    window.recaptchaVerifier = null;
  }
  window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
    callback: () => {
      // reCAPTCHA solved - allow signInWithPhoneNumber
    },
    "expired-callback": () => {
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch (e) { }
        window.recaptchaVerifier = null;
      }
    }
  });
  return window.recaptchaVerifier;
};

// Helper to send real SMS OTP via Firebase Phone Auth
export const sendFirebaseOtp = async (fullPhoneNumber, containerId = "recaptcha-container") => {
  try {
    const verifier = setupRecaptcha(containerId);
    const confirmationResult = await signInWithPhoneNumber(auth, fullPhoneNumber, verifier);
    window.confirmationResult = confirmationResult;
    return { success: true, confirmationResult };
  } catch (error) {
    console.error("Firebase sendOtp error:", error);
    console.error("Firebase error code:", error.code);
    console.error("Firebase error message:", error.message);
    
    // Provide user-friendly error messages based on Firebase error codes
    let userMessage = error.message;
    if (error.code === "auth/unauthorized-domain") {
      userMessage = "This domain is not authorized in Firebase. Add it to Firebase Console → Authentication → Settings → Authorized domains.";
    } else if (error.code === "auth/operation-not-allowed") {
      userMessage = "Phone Auth is not enabled. Enable it in Firebase Console → Authentication → Sign-in method → Phone.";
    } else if (error.code === "auth/too-many-requests") {
      userMessage = "Too many OTP requests. Please wait a few minutes before trying again.";
    } else if (error.code === "auth/invalid-phone-number") {
      userMessage = "Invalid phone number format. Please check and try again.";
    } else if (error.code === "auth/captcha-check-failed") {
      userMessage = "reCAPTCHA verification failed. Please refresh the page and try again.";
    }

    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) { }
      window.recaptchaVerifier = null;
    }
    return { success: false, error: userMessage };
  }
};

// Helper to verify 6-digit OTP received via SMS
export const verifyFirebaseOtp = async (otpCode) => {
  try {
    if (!window.confirmationResult) {
      throw new Error("No active OTP session. Please request a new OTP.");
    }
    const result = await window.confirmationResult.confirm(otpCode);
    const user = result.user;
    const idToken = await user.getIdToken();
    return { success: true, user, idToken };
  } catch (error) {
    console.error("Firebase verifyOtp error:", error);
    return { success: false, error: error.message };
  }
};
