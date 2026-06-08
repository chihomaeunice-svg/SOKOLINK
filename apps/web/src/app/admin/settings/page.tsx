"use client";

import { useState } from "react";
import { Save, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SITE_CONFIG, SELLER_COMMISSION_RATE, ESCROW_RELEASE_DAYS } from "@/lib/constants";

export default function AdminSettingsPage() {
  const [siteName,     setSiteName]     = useState(SITE_CONFIG.name);
  const [supportPhone, setSupportPhone] = useState(SITE_CONFIG.phone);
  const [supportEmail, setSupportEmail] = useState(SITE_CONFIG.email);
  const [commission,   setCommission]   = useState(String(SELLER_COMMISSION_RATE * 100));
  const [escrowDays,   setEscrowDays]   = useState(String(ESCROW_RELEASE_DAYS));
  const [saved,        setSaved]        = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Mipangilio ya Platform</h1>
        <p className="text-sm text-gray-400 mt-0.5">Dhibiti mipangilio ya msingi ya Soko Link</p>
      </div>

      {/* General settings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="font-bold text-gray-900 border-b border-gray-100 pb-3">Maelezo ya Jumla</h2>
        <Input label="Jina la Platform" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
        <Input label="Nambari ya Msaada" type="tel" value={supportPhone} onChange={(e) => setSupportPhone(e.target.value)} />
        <Input label="Barua Pepe ya Msaada" type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
      </div>

      {/* Payment settings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="font-bold text-gray-900 border-b border-gray-100 pb-3">Mipangilio ya Malipo</h2>

        <div>
          <Input
            label="Ada ya Platform (%)"
            type="number"
            min="0"
            max="30"
            value={commission}
            onChange={(e) => setCommission(e.target.value)}
          />
          <p className="mt-1.5 text-xs text-gray-400 flex items-center gap-1">
            <Info className="h-3.5 w-3.5" />
            Sasa ni {SELLER_COMMISSION_RATE * 100}%. Ada inakusanywa kwenye kila muamala.
          </p>
        </div>

        <div>
          <Input
            label="Siku za Escrow (baada ya delivery)"
            type="number"
            min="1"
            max="14"
            value={escrowDays}
            onChange={(e) => setEscrowDays(e.target.value)}
          />
          <p className="mt-1.5 text-xs text-gray-400 flex items-center gap-1">
            <Info className="h-3.5 w-3.5" />
            Pesa inashikiliwa kwa siku {ESCROW_RELEASE_DAYS} baada ya mteja kuthibitisha delivery.
          </p>
        </div>
      </div>

      {/* Note */}
      <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-700 flex items-start gap-3">
        <Info className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-500" />
        <div>
          <p className="font-semibold mb-1">Kumbuka</p>
          <p className="text-blue-600 leading-relaxed">
            Mipangilio hii imeandikwa kwenye code kwa sasa. Toleo lijalo litahifadhi mabadiliko haya
            moja kwa moja kwenye Firestore ili yawe hai mara moja.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} className={saved ? "bg-emerald-600 hover:bg-emerald-700" : ""}>
          <Save className="h-4 w-4" />
          {saved ? "Imehifadhiwa!" : "Hifadhi Mabadiliko"}
        </Button>
        {saved && <p className="text-sm text-emerald-600 font-medium">✓ Mipangilio imehifadhiwa</p>}
      </div>
    </div>
  );
}
