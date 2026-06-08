"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, CheckCircle2, XCircle, ShieldOff,
  Shield, Phone, MapPin, Star, Package, DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  adminGetSellerById,
  adminApproveSeller,
  adminRejectSeller,
  adminSuspendSeller,
  adminReactivateSeller,
} from "@/lib/firebase/admin-service";
import { adminGetAllOrders } from "@/lib/firebase/admin-service";
import type { SellerProfile, Order } from "@/lib/types";

export default function SellerDetailPage() {
  const { id }    = useParams<{ id: string }>();
  const router    = useRouter();
  const [seller,  setSeller]  = useState<SellerProfile | null>(null);
  const [orders,  setOrders]  = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting,  setActing]  = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [s, allOrders] = await Promise.all([
          adminGetSellerById(id),
          adminGetAllOrders(200),
        ]);
        setSeller(s);
        setOrders(allOrders.filter((o) => o.sellerIds?.includes(id)));
      } finally { setLoading(false); }
    })();
  }, [id]);

  async function handleApprove() {
    setActing(true);
    try { await adminApproveSeller(id); setSeller((s) => s ? { ...s, verified: true, active: true } : s); }
    finally { setActing(false); }
  }
  async function handleReject() {
    setActing(true);
    try { await adminRejectSeller(id); router.push("/admin/sellers"); }
    finally { setActing(false); }
  }
  async function handleSuspend() {
    setActing(true);
    try { await adminSuspendSeller(id); setSeller((s) => s ? { ...s, active: false } : s); }
    finally { setActing(false); }
  }
  async function handleReactivate() {
    setActing(true);
    try { await adminReactivateSeller(id); setSeller((s) => s ? { ...s, active: true } : s); }
    finally { setActing(false); }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 rounded-xl bg-gray-200 animate-pulse" />
        <div className="h-64 rounded-2xl bg-gray-200 animate-pulse" />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="py-24 text-center">
        <p className="text-gray-500">Muuzaji huyu hapatikani.</p>
        <Link href="/admin/sellers"><Button className="mt-4" variant="outline">Rudi</Button></Link>
      </div>
    );
  }

  const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount ?? 0), 0);

  return (
    <div className="space-y-6">
      {/* Back + heading */}
      <div className="flex items-center gap-4">
        <Link href="/admin/sellers">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /> Rudi</Button>
        </Link>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">{seller.storeName}</h1>
          <p className="text-sm text-gray-400">Maelezo ya Muuzaji</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: seller info */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-700 font-extrabold text-2xl">
                  {seller.storeName?.[0] ?? "?"}
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-gray-900">{seller.storeName}</h2>
                  <p className="text-sm text-gray-500">{seller.description || "Hakuna maelezo"}</p>
                </div>
              </div>
              <div>
                {seller.verified && seller.active && <Badge variant="success">Hai</Badge>}
                {!seller.verified && <Badge variant="warning">Inasubiri</Badge>}
                {seller.verified && !seller.active && <Badge variant="danger">Imesimamishwa</Badge>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400" />
                {seller.location || "Mahali hakujulikani"}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4 text-gray-400" />
                {seller.mpesaNumber || "—"}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Star className="h-4 w-4 text-amber-400" />
                Rating: {seller.rating?.toFixed(1) ?? "—"}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Package className="h-4 w-4 text-gray-400" />
                Mauzo: {seller.totalSales ?? 0}
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Maagizo ({orders.length})</h3>
            </div>
            {orders.length === 0 ? (
              <p className="py-10 text-center text-sm text-gray-400">Hakuna maagizo bado.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {orders.slice(0, 10).map((o) => (
                  <div key={o.id} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{o.id}</p>
                      <p className="text-xs text-gray-400">{o.customerId}</p>
                    </div>
                    <p className="text-sm font-bold">{formatCurrency(o.totalAmount ?? 0)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: actions */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-600" /> Mapato
            </h3>
            <p className="text-2xl font-extrabold text-gray-900">{formatCurrency(seller.totalRevenue ?? 0)}</p>
            <p className="text-xs text-gray-400 mt-1">Jumla ya mapato</p>
            <hr className="my-3 border-gray-100" />
            <p className="text-xl font-extrabold text-gray-900">{formatCurrency(totalRevenue)}</p>
            <p className="text-xs text-gray-400 mt-1">Kutoka maagizo {orders.length}</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            <h3 className="font-bold text-gray-900 mb-1">Hatua</h3>

            {!seller.verified && (
              <>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700" loading={acting} onClick={handleApprove}>
                  <CheckCircle2 className="h-4 w-4" /> Idhinisha Muuzaji
                </Button>
                <Button className="w-full" variant="destructive" loading={acting} onClick={handleReject}>
                  <XCircle className="h-4 w-4" /> Kataa Maombi
                </Button>
              </>
            )}

            {seller.verified && seller.active && (
              <Button className="w-full text-red-600 border-red-200 hover:bg-red-50" variant="outline" loading={acting} onClick={handleSuspend}>
                <ShieldOff className="h-4 w-4" /> Simamisha Duka
              </Button>
            )}

            {seller.verified && !seller.active && (
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700" loading={acting} onClick={handleReactivate}>
                <Shield className="h-4 w-4" /> Rejesha Duka
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
