"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { adminGetAllOrders } from "@/lib/firebase/admin-service";
import type { Order } from "@/lib/types";

type StatusFilter = "all" | "pending" | "processing" | "shipped" | "delivered" | "cancelled";

const STATUS_MAP: Record<string, { label: string; variant: "success" | "warning" | "info" | "muted" | "danger" }> = {
  pending:    { label: "Inasubiri",     variant: "warning" },
  confirmed:  { label: "Imethibitishwa", variant: "info"   },
  processing: { label: "Inatengenezwa", variant: "info"    },
  shipped:    { label: "Imesafirishwa", variant: "success" },
  delivered:  { label: "Imefikia",      variant: "success" },
  cancelled:  { label: "Imefutwa",      variant: "danger"  },
  refunded:   { label: "Ilipwa Tena",   variant: "muted"   },
};

export default function AdminOrdersPage() {
  const [orders,  setOrders]  = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState<StatusFilter>("all");
  const [search,  setSearch]  = useState("");

  async function load() {
    setLoading(true);
    try { setOrders(await adminGetAllOrders(200)); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  const filtered = orders
    .filter((o) => filter === "all" || o.status === filter)
    .filter((o) =>
      !search ||
      o.id?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerId?.toLowerCase().includes(search.toLowerCase())
    );

  const FILTERS: { key: StatusFilter; label: string }[] = [
    { key: "all",       label: `Yote (${orders.length})` },
    { key: "pending",   label: "Inasubiri" },
    { key: "processing",label: "Inatengenezwa" },
    { key: "shipped",   label: "Imesafirishwa" },
    { key: "delivered", label: "Imefikia" },
    { key: "cancelled", label: "Imefutwa" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Maagizo Yote</h1>
          <p className="text-sm text-gray-400 mt-0.5">{orders.length} maagizo</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center rounded-xl border-2 border-gray-200 bg-white focus-within:border-brand-700 overflow-hidden flex-1 max-w-sm">
          <Search className="h-4 w-4 text-gray-400 ml-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Tafuta nambari ya agizo..."
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

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(8)].map((_, i) => <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm">Hakuna maagizo yaliyopatikana.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((o) => {
              const st = STATUS_MAP[o.status] ?? { label: o.status, variant: "muted" as const };
              return (
                <div key={o.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{o.id}</p>
                    <p className="text-xs text-gray-400">
                      Mteja: {o.customerId ?? "—"}
                      {o.createdAt && ` · ${formatRelativeTime(
                        o.createdAt instanceof Date ? o.createdAt : (o.createdAt as any).toDate()
                      )}`}
                    </p>
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
