"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validatePhoneNumber, formatPhoneNumber } from "@/lib/utils";
import { sendOTP, verifyOTP } from "@/lib/firebase/auth";
import { getUserProfile } from "@/lib/firebase/firestore";

type Step = "phone" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSendOTP() {
    setError("");
    if (!validatePhoneNumber(phone)) {
      setError("Nambari ya simu si sahihi. Mfano: 0712345678");
      return;
    }
    setLoading(true);
    try {
      await sendOTP(phone, "recaptcha-container");
      setStep("otp");
    } catch (e) {
      setError("Imeshindwa kutuma OTP. Jaribu tena.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP() {
    setError("");
    if (otp.length < 6) {
      setError("Ingiza namba 6 za OTP.");
      return;
    }
    setLoading(true);
    try {
      const user = await verifyOTP(otp);
      const profile = await getUserProfile(user.uid);

      if (!profile) {
        // New user — redirect to registration
        router.push(`/auth/register?uid=${user.uid}&phone=${formatPhoneNumber(phone)}`);
        return;
      }

      // Existing user — redirect based on role
      if (profile.role === "seller") router.push("/seller/dashboard");
      else if (profile.role === "admin") router.push("/admin/dashboard");
      else router.push("/shop");
    } catch (e) {
      setError("Namba ya OTP si sahihi. Jaribu tena.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div id="recaptcha-container" />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-900 text-white font-bold text-lg">S</div>
            <div>
              <span className="text-2xl font-bold text-brand-900">Soko</span>
              <span className="text-2xl font-bold text-gold-500">Link</span>
            </div>
          </Link>
        </div>

        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          {step === "phone" ? (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Ingia kwenye Akaunti</h1>
                <p className="mt-1 text-sm text-gray-500">Ingiza nambari yako ya simu. Utatuma SMS ya OTP.</p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Nambari ya Simu"
                  type="tel"
                  placeholder="0712 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  icon={<Phone className="h-4 w-4" />}
                  error={error}
                />

                <Button className="w-full" size="lg" onClick={handleSendOTP} loading={loading}>
                  Tuma OTP <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                <Shield className="h-4 w-4 flex-shrink-0" />
                Tunalinda data yako. Hatureki nambari yako kwa mtu yeyote.
              </div>

              <p className="mt-6 text-center text-sm text-gray-500">
                Huna akaunti?{" "}
                <Link href="/auth/register" className="font-semibold text-brand-700 hover:text-brand-900">
                  Jiandikishe hapa
                </Link>
              </p>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Ingiza OTP</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Tumekutumia SMS kwa nambari <strong>{phone}</strong>.
                  Ingiza namba 6 ulizopokea.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Namba ya OTP"
                  type="number"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  error={error}
                />

                <Button className="w-full" size="lg" onClick={handleVerifyOTP} loading={loading}>
                  Thibitisha na Ingia
                </Button>

                <button
                  onClick={() => { setStep("phone"); setOtp(""); setError(""); }}
                  className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
                >
                  ← Badilisha nambari ya simu
                </button>
              </div>

              <button
                onClick={handleSendOTP}
                className="mt-4 w-full text-center text-sm text-brand-700 hover:text-brand-900 font-medium"
              >
                Tuma tena OTP
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
