"use client";

import { useState } from "react";
import {
  Users, Store, ShoppingBag, DollarSign,
  CheckCircle2, XCircle, Eye, AlertTriangle,
  TrendingUp, Package, BarChart3, Settings,
  LogOut, Shield, Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";

const DEMO_PLATFORM_STATS = {
  totalRevenue: 48500000,
  monthRevenue: 12300000,
  totalOrders: 1247,
  activeOrders: 89,
  totalSellers: 134,
  pendingSellers: 8,
  totalCustomers: 4521,
  platformFeeCollected: 2425000,
};

const DEMO_PENDING_SELLERS = [
  { id: "ps1", storeName: "Mama Pima Fashion", ownerName: "Amina Juma", phone: "+255712001001", location: "Kariakoo, DSM", appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 3) },
  { id: "ps2", storeName: "TechHub Arusha", ownerName: "David Mollel", phone: "+255754002002", location: "Arusha Mjini", appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 7) },
  { id: "ps3", storeName: "Zanzibar Spices", ownerName: "Hassan Omar", phone: "+255777003003", location: "Zanzibar Town", appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 14) },
];

const DEMO_RECENT_ORDERS = [
  { id: "SL-P9X1A", customer: "Fatuma Ali", seller: "Kariakoo Electronics", amount: 650000, status: "processing" },
  { id: "SL-Q2B7M", customer: "John Mwangi", seller: "Fashion Dar", amount: 85000, status: "shipped" },
  { id: "SL-R3C8N", customer: "Amina Hassan", seller: "Tech Kariakoo", amount: 55000, status: "delivered" },
  { id: "SL-S4D9P", customer: "Peter Kimani", seller: "Duka la Nyumbani", amount: 35000, status: "pending" },
];

const STATUS_CONFIG: Record<string, { label: string; variant: "success" | "warning" | "info" | "muted" | "danger" }> = {
  pending: { label: "Inasubiri", variant: "warning" },
  confirmed: { label: "Imethibitishwa", variant: "info" },
  processing: { label: "Inatengenezwa", variant: "info" },
  shipped: { label: "Imesafirishwa", variant: "success" },
  delivered: { label: "Imefikia", variant: "success" },
  cancelled: { label: "Imefutwa", variant: "danger" },
};

type Tab = "overview" | "sellers" | "orders";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [pendingSellers, setPendingSellers] = useState(DEMO_PENDING_SELLERS);

  function approveSeller(id: string) {
    setPendingSellers((prev) => prev.filter((s) => s.id !== id));
    alert("Muuzaji ameidhinishwa! Atapata SMS.");
  }

  function rejectSeller(id: string) {
    setPendingSellers((prev) => prev.filter((s) => s.id !== id));
    alert("Ombi la muuzaji limekataliwa.");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-brand-900 text-white lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
          <Shield className="h-6 w-6 text-gold-400" />
          <div>
            <span className="font-bold">Soko</span>
            <span className="font-bold text-gold-400">Link</span>
            <span className="ml-1 text-xs text-white/60">Admin</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {[
            { id: "overview", label: "Muhtasari", icon: BarChart3 },
            { id: "sellers", label: "Wauzaji", icon: Store, badge: DEMO_PLATFORM_STATS.pendingSellers },
            { id: "orders", label: "Maagizo Yote", icon: ShoppingBag },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === item.id ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4" />
                {item.label}
              </div>
              {item.badge ? (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}

          <div className="my-3 border-t border-white/10" />

          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white">
            <Users className="h-4 w-4" /> Wateja
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white">
            <Settings className="h-4 w-4" /> Mipangilio
          </button>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 font-bold text-sm">A</div>
            <div>
              <p className="text-sm font-semibold">Admin Panel</p>
              <p className="text-xs text-white/50">Soko Link HQ</p>
            </div>
          </div>
          <button className="flex items-center gap-2 text-xs text-white/50 hover:text-white">
            <LogOut className="h-3.5 w-3.5" /> Toka
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
          <div>
            <h1 className="font-bold text-gray-900">
              {activeTab === "overview" && "Platform Overview"}
              {activeTab === "sellers" && "Usimamizi wa Wauzaji"}
              {activeTab === "orders" && "Maagizo Yote"}
            </h1>
            <p className="text-xs text-gray-500">Soko Link Admin Panel</p>
          </div>
          <button className="relative p-2 text-gray-500">
            <Bell className="h-5 w-5" />
            {DEMO_PLATFORM_STATS.pendingSellers > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {DEMO_PLATFORM_STATS.pendingSellers}
              </span>
            )}
          </button>
        </header>

        <main className="p-6">
          {/* ── Overview ── */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Mapato ya Platform", value: formatCurrency(DEMO_PLATFORM_STATS.totalRevenue), icon: DollarSign, color: "text-green-600 bg-green-100", sub: "Jumla ya transactions" },
                  { label: "Mapato ya Mwezi", value: formatCurrency(DEMO_PLATFORM_STATS.monthRevenue), icon: TrendingUp, color: "text-blue-600 bg-blue-100", sub: "Mei 2025" },
                  { label: "Maagizo Yote", value: DEMO_PLATFORM_STATS.totalOrders.toLocaleString(), icon: ShoppingBag, color: "text-purple-600 bg-purple-100", sub: `${DEMO_PLATFORM_STATS.activeOrders} yanafanyika` },
                  { label: "Ada ya Platform (5%)", value: formatCurrency(DEMO_PLATFORM_STATS.platformFeeCollected), icon: Package, color: "text-amber-600 bg-amber-100", sub: "Mwezi huu" },
                ].map((stat) => (
                  <Card key={stat.label}>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">{stat.label}</p>
                          <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
                          <p className="mt-1 text-xs text-gray-400">{stat.sub}</p>
                        </div>
                        <div className={`rounded-xl p-3 ${stat.color}`}>
                          <stat.icon className="h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Users summary */}
                <Card>
                  <CardHeader><CardTitle className="text-base">Watumiaji wa Platform</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: "Wateja Wote", value: DEMO_PLATFORM_STATS.totalCustomers.toLocaleString(), icon: Users, color: "text-blue-600 bg-blue-100" },
                      { label: "Wauzaji Walioidhinishwa", value: (DEMO_PLATFORM_STATS.totalSellers - DEMO_PLATFORM_STATS.pendingSellers).toString(), icon: Store, color: "text-green-600 bg-green-100" },
                      { label: "Wauzaji Wanaosubiri", value: DEMO_PLATFORM_STATS.pendingSellers.toString(), icon: AlertTriangle, color: "text-amber-600 bg-amber-100" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`rounded-lg p-2 ${item.color}`}><item.icon className="h-4 w-4" /></div>
                          <span className="text-sm text-gray-700">{item.label}</span>
                        </div>
                        <span className="font-bold text-gray-900">{item.value}</span>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full mt-2" onClick={() => setActiveTab("sellers")}>
                      Simamia Wauzaji →
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent orders */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-base">Maagizo ya Hivi Karibuni</CardTitle>
                    <button onClick={() => setActiveTab("orders")} className="text-xs text-brand-700 hover:text-brand-900">Ona Yote →</button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {DEMO_RECENT_ORDERS.map((order) => (
                        <div key={order.id} className="flex items-center justify-between px-6 py-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{order.id}</p>
                            <p className="text-xs text-gray-500">{order.customer} · {order.seller}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">{formatCurrency(order.amount)}</p>
                            <Badge variant={STATUS_CONFIG[order.status].variant} className="mt-0.5">
                              {STATUS_CONFIG[order.status].label}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* ── Sellers Tab ── */}
          {activeTab === "sellers" && (
            <div className="space-y-6">
              {pendingSellers.length > 0 && (
                <Card className="border-amber-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base text-amber-800">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      Wauzaji Wanaosubiri Idhini ({pendingSellers.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {pendingSellers.map((seller) => (
                        <div key={seller.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 font-bold text-sm flex-shrink-0">
                              {seller.storeName[0]}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{seller.storeName}</p>
                              <p className="text-sm text-gray-500">{seller.ownerName} · {seller.phone}</p>
                              <p className="text-xs text-gray-400">📍 {seller.location} · Aliomba {formatRelativeTime(seller.appliedAt)}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline"><Eye className="h-4 w-4" /> Angalia</Button>
                            <Button size="sm" onClick={() => approveSeller(seller.id)} className="bg-green-600 hover:bg-green-700">
                              <CheckCircle2 className="h-4 w-4" /> Idhinisha
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => rejectSeller(seller.id)}>
                              <XCircle className="h-4 w-4" /> Kataa
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {pendingSellers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mb-3" />
                  <p className="font-semibold text-gray-700">Hakuna wauzaji wanaosubiri idhini!</p>
                  <p className="text-sm text-gray-500 mt-1">Ombi zote zimeshughulikiwa.</p>
                </div>
              )}
            </div>
          )}

          {/* ── Orders Tab ── */}
          {activeTab === "orders" && (
            <Card>
              <div className="divide-y">
                {DEMO_RECENT_ORDERS.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-5 hover:bg-gray-50">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{order.id}</p>
                      <p className="text-xs text-gray-500">{order.customer} ← {order.seller}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-sm">{formatCurrency(order.amount)}</p>
                        <Badge variant={STATUS_CONFIG[order.status].variant}>{STATUS_CONFIG[order.status].label}</Badge>
                      </div>
                      <Button variant="outline" size="icon-sm"><Eye className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
