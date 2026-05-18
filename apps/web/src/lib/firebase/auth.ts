import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  ConfirmationResult,
} from "firebase/auth";
import { auth } from "./config";
import { getUserProfile, createUserProfile } from "./firestore";
import { formatPhoneNumber } from "@/lib/utils";
import type { User, UserRole } from "@/lib/types";

let confirmationResult: ConfirmationResult | null = null;

// Send OTP to phone number (uses Firebase phone auth — free)
export async function sendOTP(phone: string, recaptchaContainerId: string): Promise<void> {
  const formattedPhone = formatPhoneNumber(phone);

  const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
    size: "invisible",
    callback: () => {},
  });

  confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
}

// Verify OTP code entered by user
export async function verifyOTP(code: string): Promise<FirebaseUser> {
  if (!confirmationResult) throw new Error("No OTP request pending. Please request OTP first.");
  const result = await confirmationResult.confirm(code);
  return result.user;
}

// Register new user after OTP verified
export async function registerUser(
  uid: string,
  data: { name: string; phone: string; role: UserRole; email?: string }
): Promise<void> {
  await createUserProfile(uid, {
    ...data,
    createdAt: new Date(),
  });
}

// Sign out
export async function logout(): Promise<void> {
  await signOut(auth);
}

// Listen to auth state — call this once at app root
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }
    const profile = await getUserProfile(firebaseUser.uid);
    callback(profile);
  });
}

// Get current Firebase user (raw)
export function getCurrentFirebaseUser(): FirebaseUser | null {
  return auth.currentUser;
}
