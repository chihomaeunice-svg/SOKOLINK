"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle, CheckCircle2, XCircle, Eye,
  RefreshCw, Search, Store, Shield, ShieldOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import {
  adminGetAllSellers,
  adminApproveSeller,
  adminRejectSeller,
  adminSuspendSeller,
  adminReactivateSeller,
} from "@/lib/firebase/admin-service";
import type { SellerProfile } from "@/lib/types";

type Filter = "all" | "pending" | "active" | "suspended";

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<SellerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting,  setActing]  = useState<string | null>(null);
  const [filter,  setFilter]  = useState<Filter>("all");
  const [search,  setSearch]  = useState("");

  async function load() {
    setLoading(true);
    try {
      setSellers(await adminGetAllSellers());
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  const filtered = sellers
    .filter((s) => {
      if (filter === "pending")   return !s.verified && s.active !== false;
      if (filter === "active")    return s.verified && s.active;
      if (filter === "suspended") return s.verified && !s.active;
      return true;
    })
    .filter((s) =>
      !search ||
      s.storeName?.toLowerCase().includes(search.toLowerCase()) ||
      s.location?.toLowerCase().includes(search.toLowerCase())
    );

  const counts = {
    all:       sellers.length,
    pending:   sellers.filter((s) => !s.verified).length,
    active:    sellers.filter((s) => s.verified && s.active).length,
    suspended: sellers.filter((s) => s.verified && !s.active).length,
  };

  async function act(id: string, fn: () => Promise<void>, patch: Partial<SellerProfile>) {
    setActing(id);
    try {
      await fn();
      setSellers((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    } finally { setActing(null); }
  }

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "all",       label: `Wote (${counts.all})`           },
    { key: "pending",   label: `Wanaosubiri (${counts.pending})` },
    { key: "active",    label: `Wanaofanya Kazi (${counts.active})`     },
    { key: "suspended", label: `Wamesimamishwa (${counts.suspended})`   },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Usimamizi wa Wauzaji</h1>
          <p className="text-sm text-gray-400 mt-0.5">{sellers.length} wauzaji wote</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center rounded-xl border-2 border-gray-200 bg-white focus-within:border-brand-700 transition-colors overflow-hidden flex-1 max-w-sm">
          <Search className="h-4 w-4 text-gray-400 ml-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Tafuta duka au mahali..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                filter === f.key
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Store className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="font-semibold text-gray-500">Hakuna wauzaji</p>
            <p className="text-sm text-gray-400 mt-1">Jaribu filter nyingine</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((s) => (
              <div key={s.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 hover:bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm flex-shrink-0">
                    {s.storeName?.[0] ?? "?"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-900 text-sm">{s.storeName}</p>
                      {s.verified && s.active && <Badge variant="success">Hai</Badge>}
                      {!s.verified && <Badge variant="warning">Inasubiri</Badge>}
                      {s.verified && !s.active && <Badge variant="danger">Imesimamishwa</Badge>}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">📍 {s.location || "—"}</p>
                    <p className="text-xs text-gray-400">
                      Mauzo: {s.totalSales ?? 0} · Rating: {s.rating?.toFixed(1) ?? "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/admin/sellers/${s.id}`}>
                    <Button size="sm" variant="outline"><Eye className="h-3.5 w-3.5" /> Angalia</Button>
                  </Link>

                  {!s.verified && (
                    <>
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700"
                        loading={acting === s.id}
                        onClick={() => act(s.id!, () => adminApproveSeller(s.id!), { verified: true, active: true })}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Idhinisha
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        loading={acting === s.id}
                        onClick={() => act(s.id!, () => adminRejectSeller(s.id!), { active: false })}
                      >
                        <XCircle className="h-3.5 w-3.5" /> Kataa
                      </Button>
                    </>
                  )}

                  {s.verified && s.active && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      loading={acting === s.id}
                      onClick={() => act(s.id!, () => adminSuspendSeller(s.id!), { active: false })}
                    >
                      <ShieldOff className="h-3.5 w-3.5" /> Simamisha
                    </Button>
                  )}

                  {s.verified && !s.active && (
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      loading={acting === s.id}
                      onClick={() => act(s.id!, () => adminReactivateSeller(s.id!), { active: true })}
                    >
                      <Shield className="h-3.5 w-3.5" /> Rejesha
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
