"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Store, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/lib/firebase/auth";
import { setDocument } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { validatePhoneNumber } from "@/lib/utils";
import type { UserRole } from "@/lib/types";
import { serverTimestamp } from "firebase/firestore";

const ROLES: { value: UserRole; label: string; icon: typeof User; desc: string }[] = [
  { value: "customer", label: "Mteja", icon: User, desc: "Ninataka kununua bidhaa" },
  { value: "seller", label: "Muuzaji", icon: Store, desc: "Ninataka kuuza bidhaa zangu" },
];

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const uid = params.get("uid") || "";
  const phoneFromUrl = params.get("phone") || "";

  const [role, setRole] = useState<UserRole>("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeLocation, setStoreLocation] = useState("");
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister() {
    setError("");
    if (!name.trim()) { setError("Ingiza jina lako kamili."); return; }
    if (role === "seller") {
      if (!storeName.trim()) { setError("Ingiza jina la duka lako."); return; }
      if (!validatePhoneNumber(mpesaNumber)) { setError("Nambari ya M-Pesa si sahihi."); return; }
    }

    setLoading(true);
    try {
      // Create user profile
      await registerUser(uid, { name, phone: phoneFromUrl, role, email: email || undefined });

      // If seller, create seller profile too (pending approval)
      if (role === "seller") {
        await setDocument(COLLECTIONS.SELLERS, uid, {
          userId: uid,
          storeName,
          description: "",
          location: storeLocation,
          verified: false,
          active: false,
          rating: 0,
          totalSales: 0,
          totalRevenue: 0,
          mpesaNumber,
          createdAt: serverTimestamp(),
        });
        router.push("/seller/pending");
      } else {
        router.push("/shop");
      }
    } catch (e) {
      setError("Imeshindwa kuunda akaunti. Jaribu tena.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-lg">
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
          <h1 className="mb-1 text-2xl font-bold text-gray-900">Karibu Soko Link!</h1>
          <p className="mb-6 text-sm text-gray-500">Jaza maelezo yako ili kukamilisha usajili.</p>

          {/* Role selector */}
          <div className="mb-6">
            <p className="mb-3 text-sm font-medium text-gray-700">Wewe ni nani?</p>
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
                    role === r.value
                      ? "border-brand-700 bg-brand-50 text-brand-900"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <r.icon className="h-6 w-6" />
                  <div>
                    <p className="font-semibold text-sm">{r.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Input label="Jina Kamili" placeholder="Jina na Ukoo" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Barua Pepe (hiari)" type="email" placeholder="example@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />

            {role === "seller" && (
              <>
                <div className="my-4 border-t pt-4">
                  <p className="mb-3 text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Store className="h-4 w-4" /> Maelezo ya Duka
                  </p>
                </div>
                <Input label="Jina la Duka" placeholder="Mfano: Bora Electronics" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
                <Input label="Mahali pa Duka" placeholder="Mfano: Ilala, Dar es Salaam" value={storeLocation} onChange={(e) => setStoreLocation(e.target.value)} />
                <Input label="Nambari ya M-Pesa ya Malipo" type="tel" placeholder="0712 345 678" value={mpesaNumber} onChange={(e) => setMpesaNumber(e.target.value)} />
                <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
                  ⚠️ Akaunti yako ya muuzaji itahitaji idhini ya admin kabla hujaanza kuuza.
                  Hii inachukua masaa 24–48.
                </div>
              </>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button className="w-full" size="lg" onClick={handleRegister} loading={loading}>
              <ShieldCheck className="h-4 w-4" />
              Kamilisha Usajili
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Una akaunti tayari?{" "}
            <Link href="/auth/login" className="font-semibold text-brand-700 hover:text-brand-900">
              Ingia hapa
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Inapakia...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
