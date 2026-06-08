"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { adminGetOrderById, adminUpdateOrderStatus } from "@/lib/firebase/admin-service";
import type { Order } from "@/lib/types";

const STATUS_MAP: Record<string, { label: string; variant: "success" | "warning" | "info" | "muted" | "danger" }> = {
  pending:    { label: "Inasubiri",     variant: "warning" },
  confirmed:  { label: "Imethibitishwa", variant: "info"   },
  processing: { label: "Inatengenezwa", variant: "info"    },
  shipped:    { label: "Imesafirishwa", variant: "success" },
  delivered:  { label: "Imefikia",      variant: "success" },
  cancelled:  { label: "Imefutwa",      variant: "danger"  },
  refunded:   { label: "Ilipwa Tena",   variant: "muted"   },
};

const STATUS_FLOW = ["pending","confirmed","processing","shipped","delivered"];

export default function OrderDetailPage() {
  const { id }   = useParams<{ id: string }>();
  const [order,   setOrder]   = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting,  setActing]  = useState(false);

  async function load() {
    setLoading(true);
    try { setOrder(await adminGetOrderById(id)); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [id]);

  async function changeStatus(status: string) {
    setActing(true);
    try {
      await adminUpdateOrderStatus(id, status);
      setOrder((o) => o ? { ...o, status } : o);
    } finally { setActing(false); }
  }

  if (loading) return (
    <div className="space-y-4">
      <div className="h-8 w-48 rounded-xl bg-gray-200 animate-pulse" />
      <div className="h-80 rounded-2xl bg-gray-200 animate-pulse" />
    </div>
  );

  if (!order) return (
    <div className="py-24 text-center">
      <p className="text-gray-500">Agizo halipatikani.</p>
      <Link href="/admin/orders"><Button className="mt-4" variant="outline">Rudi</Button></Link>
    </div>
  );

  const st = STATUS_MAP[order.status] ?? { label: order.status, variant: "muted" as const };
  const currentIdx = STATUS_FLOW.indexOf(order.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /> Rudi</Button>
        </Link>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">{order.id}</h1>
          <p className="text-sm text-gray-400">Maelezo ya Agizo</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          {/* Order details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900">Maelezo</h2>
              <Badge variant={st.variant}>{st.label}</Badge>
            </div>
            <dl className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-400 mb-1">Mteja (UID)</dt>
                <dd className="font-semibold text-gray-900 font-mono text-xs break-all">{order.customerId ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-gray-400 mb-1">Jumla ya Malipo</dt>
                <dd className="font-extrabold text-gray-900">{formatCurrency(order.totalAmount ?? 0)}</dd>
              </div>
              <div>
                <dt className="text-gray-400 mb-1">Njia ya Malipo</dt>
                <dd className="font-semibold text-gray-900 capitalize">{order.paymentMethod ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-gray-400 mb-1">Hali ya Malipo</dt>
                <dd className="font-semibold text-gray-900 capitalize">{order.paymentStatus ?? "—"}</dd>
              </div>
            </dl>
          </div>

          {/* Delivery address */}
          {order.deliveryAddress && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 mb-4">Anwani ya Delivery</h2>
              <p className="text-sm text-gray-700">{order.deliveryAddress.name}</p>
              <p className="text-sm text-gray-500">{order.deliveryAddress.phone}</p>
              <p className="text-sm text-gray-500">{order.deliveryAddress.street}, {order.deliveryAddress.city}</p>
            </div>
          )}

          {/* Order items */}
          {order.items && order.items.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Bidhaa ({order.items.length})</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{item.productName ?? item.productId}</p>
                      <p className="text-xs text-gray-400">Idadi: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold">{formatCurrency((item.price ?? 0) * (item.quantity ?? 1))}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: status change */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-4">Badilisha Hali</h3>
            <div className="space-y-2">
              {STATUS_FLOW.map((s, i) => (
                <button
                  key={s}
                  disabled={acting || order.status === s}
                  onClick={() => changeStatus(s)}
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors text-left ${
                    order.status === s
                      ? "bg-brand-900 text-white cursor-default"
                      : i <= currentIdx
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-200 text-gray-700 hover:border-brand-300 hover:bg-brand-50"
                  }`}
                >
                  <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    order.status === s ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"
                  }`}>
                    {i + 1}
                  </span>
                  {STATUS_MAP[s]?.label ?? s}
                </button>
              ))}
              {order.status !== "cancelled" && (
                <button
                  disabled={acting}
                  onClick={() => changeStatus("cancelled")}
                  className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <span className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center text-xs font-bold">✕</span>
                  Futa Agizo
                </button>
              )}
            </div>

            {acting && (
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Inasasisha...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
