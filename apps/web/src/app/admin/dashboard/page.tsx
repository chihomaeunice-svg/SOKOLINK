"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp, DollarSign, ShoppingBag, Users,
  AlertTriangle, CheckCircle2, XCircle, Eye, RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import {
  adminGetPlatformStats,
  adminGetPendingSellers,
  adminGetAllOrders,
  adminApproveSeller,
  adminRejectSeller,
  type PlatformStats,
} from "@/lib/firebase/admin-service";
import type { SellerProfile, Order } from "@/lib/types";

const STATUS_MAP: Record<string, { label: string; variant: "success" | "warning" | "info" | "muted" | "danger" }> = {
  pending:    { label: "Inasubiri",     variant: "warning" },
  confirmed:  { label: "Imethibitishwa", variant: "info"   },
  processing: { label: "Inatengenezwa", variant: "info"    },
  shipped:    { label: "Imesafirishwa", variant: "success" },
  delivered:  { label: "Imefikia",      variant: "success" },
  cancelled:  { label: "Imefutwa",      variant: "danger"  },
  refunded:   { label: "Ilipwa Tena",   variant: "muted"   },
};

export default function AdminDashboard() {
  const [stats,   setStats]   = useState<PlatformStats | null>(null);
  const [pending, setPending] = useState<SellerProfile[]>([]);
  const [orders,  setOrders]  = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting,  setActing]  = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [s, p, o] = await Promise.all([
        adminGetPlatformStats(),
        adminGetPendingSellers(),
        adminGetAllOrders(20),
      ]);
      setStats(s);
      setPending(p);
      setOrders(o);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleApprove(id: string) {
    setActing(id);
    try {
      await adminApproveSeller(id);
      setPending((p) => p.filter((s) => s.id !== id));
      setStats((s) => s ? { ...s, pendingSellers: s.pendingSellers - 1, totalSellers: s.totalSellers + 1 } : s);
    } finally { setActing(null); }
  }

  async function handleReject(id: string) {
    setActing(id);
    try {
      await adminRejectSeller(id);
      setPending((p) => p.filter((s) => s.id !== id));
      setStats((s) => s ? { ...s, pendingSellers: s.pendingSellers - 1 } : s);
    } finally { setActing(null); }
  }

  const STAT_CARDS = stats ? [
    { label: "Mapato ya Jumla",    value: formatCurrency(stats.totalRevenue), sub: `${stats.totalOrders} maagizo yote`,              icon: DollarSign,  color: "text-emerald-600 bg-emerald-50" },
    { label: "Ada ya Platform 5%", value: formatCurrency(stats.platformFee),  sub: "Ada yaliyokusanywa",                              icon: TrendingUp,  color: "text-blue-600 bg-blue-50"       },
    { label: "Maagizo Yanayoendelea", value: String(stats.activeOrders),      sub: `${stats.totalOrders} yote`,                       icon: ShoppingBag, color: "text-purple-600 bg-purple-50"   },
    { label: "Watumiaji",          value: String(stats.totalUsers),           sub: `${stats.totalSellers} wauzaji · ${stats.pendingSellers} wanaosubiri`, icon: Users, color: "text-amber-600 bg-amber-50" },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Platform Overview</h1>
          <p className="text-sm text-gray-400 mt-0.5">Soko Link Admin Dashboard</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white border border-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STAT_CARDS.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm text-gray-500">{s.label}</p>
                <div className={`rounded-xl p-2 ${s.color}`}><s.icon className="h-4 w-4" /></div>
              </div>
              <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pending sellers alert */}
      {pending.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-amber-200">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <div>
                <p className="font-bold text-amber-900 text-sm">{pending.length} wauzaji wanaosubiri idhini</p>
                <p className="text-xs text-amber-700">Idhini haraka ili waanze kuuza</p>
              </div>
            </div>
            <Link href="/admin/sellers">
              <Button size="sm" variant="secondary">Ona Wote →</Button>
            </Link>
          </div>
          <div className="divide-y divide-amber-100">
            {pending.slice(0, 3).map((s) => (
              <div key={s.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-amber-200 flex items-center justify-center text-amber-800 font-bold text-sm flex-shrink-0">
                    {s.storeName?.[0] ?? "?"}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{s.storeName}</p>
                    <p className="text-xs text-gray-500">{s.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/admin/sellers/${s.id}`}>
                    <Button size="sm" variant="outline"><Eye className="h-3.5 w-3.5" /> Angalia</Button>
                  </Link>
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => handleApprove(s.id!)}
                    loading={acting === s.id}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Idhinisha
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleReject(s.id!)}
                    loading={acting === s.id}
                  >
                    <XCircle className="h-3.5 w-3.5" /> Kataa
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Maagizo ya Hivi Karibuni</h2>
          <Link href="/admin/orders" className="text-xs font-semibold text-brand-700 hover:text-brand-900">
            Ona Yote →
          </Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">Hakuna maagizo bado.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {orders.slice(0, 8).map((o) => {
              const st = STATUS_MAP[o.status] ?? { label: o.status, variant: "muted" as const };
              return (
                <div key={o.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{o.id}</p>
                    <p className="text-xs text-gray-400">{o.customerId}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={st.variant}>{st.label}</Badge>
                    <p className="text-sm font-bold text-gray-900 hidden sm:block">
                      {formatCurrency(o.totalAmount ?? 0)}
                    </p>
                    <Link href={`/admin/orders/${o.id}`}>
                      <Button variant="outline" size="icon-sm"><Eye className="h-4 w-4" /></Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
