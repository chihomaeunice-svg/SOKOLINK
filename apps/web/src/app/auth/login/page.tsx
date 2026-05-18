"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, ArrowRight, Shield, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { validatePhoneNumber, formatPhoneNumber } from "@/lib/utils";

type Step = "phone" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const [step,    setStep]    = useState<Step>("phone");
  const [phone,   setPhone]   = useState("");
  const [otp,     setOtp]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  async function handleSendOTP() {
    setError("");
    if (!validatePhoneNumber(phone)) { setError("Nambari si sahihi. Mfano: 0712 345 678"); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("otp"); }, 1000); // replace with real sendOTP()
  }

  async function handleVerifyOTP() {
    setError("");
    if (otp.length < 6) { setError("Ingiza namba 6 za OTP."); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); router.push("/shop"); }, 1000); // replace with real verifyOTP()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel (desktop) */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient text-white flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl glass flex items-center justify-center font-bold text-base">S</div>
          <span className="text-xl font-bold">Soko<span className="text-amber-300">Link</span></span>
        </Link>

        <div>
          <div className="text-6xl mb-6">🛍️</div>
          <h2 className="text-3xl font-extrabold mb-4 leading-tight">
            Tanzania&apos;s #1<br />Kariakoo Marketplace
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-8">
            Nunua bidhaa bora kwa bei za soko, ukiwa nyumbani kwako.
          </p>
          {["Malipo salama kwa M-Pesa", "Delivery Tanzania nzima", "Bidhaa halisi za Kariakoo"].map((f) => (
            <div key={f} className="flex items-center gap-3 mb-3 text-white/80 text-sm">
              <span className="h-5 w-5 rounded-full bg-emerald-500/30 flex items-center justify-center text-emerald-300 text-xs">✓</span>
              {f}
            </div>
          ))}
        </div>

        <p className="text-white/40 text-xs">© 2025 Soko Link · Dar es Salaam</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="mb-8 text-center lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl brand-gradient flex items-center justify-center text-white font-bold">S</div>
              <span className="text-2xl font-bold text-brand-900">Soko<span className="text-amber-500">Link</span></span>
            </Link>
          </div>

          {step === "phone" ? (
            <>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Karibu tena! 👋</h1>
              <p className="text-gray-500 text-sm mb-8">Ingiza nambari yako ya simu ili tuendelee.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nambari ya Simu</label>
                  <div className="flex items-center rounded-xl border-2 border-gray-200 bg-white focus-within:border-brand-700 transition-colors overflow-hidden">
                    <span className="px-4 py-3 text-sm font-semibold text-gray-500 border-r border-gray-200 bg-gray-50">+255</span>
                    <input
                      type="tel"
                      placeholder="712 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
                      className="flex-1 px-4 py-3 text-sm outline-none text-gray-800 placeholder:text-gray-400"
                    />
                  </div>
                  {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
                </div>

                <Button className="w-full" size="lg" onClick={handleSendOTP} loading={loading}>
                  Tuma OTP <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-sm text-emerald-700">
                <Shield className="h-4 w-4 mt-0.5 flex-shrink-0 text-emerald-600" />
                <span>Nambari yako inalindwa. Hatureki kwa mtu yeyote.</span>
              </div>

              <p className="mt-6 text-center text-sm text-gray-500">
                Huna akaunti?{" "}
                <Link href="/auth/register" className="font-bold text-brand-700 hover:text-brand-900">
                  Jiandikishe bure
                </Link>
              </p>
            </>
          ) : (
            <>
              <button onClick={() => { setStep("phone"); setOtp(""); setError(""); }}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
                <ChevronLeft className="h-4 w-4" /> Rudi
              </button>

              <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Angalia Simu Yako 📱</h1>
              <p className="text-gray-500 text-sm mb-8">
                Tumekutumia SMS kwa nambari <span className="font-semibold text-gray-700">+255 {phone}</span>.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Namba ya OTP</label>
                  <input
                    type="number"
                    placeholder="· · · · · ·"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 text-center text-2xl font-bold tracking-[0.5em] outline-none focus:border-brand-700 transition-colors"
                  />
                  {error && <p className="mt-2 text-xs text-red-600 text-center">{error}</p>}
                </div>

                <Button className="w-full" size="lg" onClick={handleVerifyOTP} loading={loading}>
                  Thibitisha na Ingia
                </Button>
              </div>

              <button onClick={handleSendOTP} className="mt-4 w-full text-center text-sm text-brand-700 hover:text-brand-900 font-semibold">
                Kutumwa tena OTP →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
