"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package, ShoppingBag, TrendingUp, DollarSign,
  Plus, Eye, AlertTriangle, CheckCircle2, Clock,
  Store, Bell, Settings, LogOut, ChevronRight, BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";

// Demo data
const DEMO_STATS = {
  totalRevenue: 4850000,
  monthRevenue: 1230000,
  totalOrders: 87,
  pendingOrders: 5,
  totalProducts: 23,
  activeProducts: 20,
  rating: 4.7,
};

const DEMO_ORDERS = [
  { id: "SL-ABC123", customer: "Amina Hassan", amount: 65000, status: "confirmed", items: 2, createdAt: new Date(Date.now() - 1000 * 60 * 20) },
  { id: "SL-DEF456", customer: "John Mwangi", amount: 180000, status: "processing", items: 1, createdAt: new Date(Date.now() - 1000 * 60 * 90) },
  { id: "SL-GHI789", customer: "Fatuma Ali", amount: 45000, status: "shipped", items: 3, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5) },
  { id: "SL-JKL012", customer: "Peter Kimani", amount: 25000, status: "delivered", items: 1, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { id: "SL-MNO345", customer: "Zainab Said", amount: 95000, status: "pending", items: 2, createdAt: new Date(Date.now() - 1000 * 60 * 5) },
];

const DEMO_PRODUCTS = [
  { id: "p1", name: "Samsung Galaxy A35 5G", price: 650000, stock: 15, sold: 89, active: true },
  { id: "p2", name: "Earbuds TWS Pro", price: 45000, stock: 2, sold: 43, active: true },
  { id: "p3", name: "Power Bank 20000mAh", price: 55000, stock: 0, sold: 34, active: false },
];

const STATUS_CONFIG: Record<string, { label: string; variant: "success" | "warning" | "info" | "muted" | "danger" }> = {
  pending: { label: "Inasubiri", variant: "warning" },
  confirmed: { label: "Imethibitishwa", variant: "info" },
  processing: { label: "Inatengenezwa", variant: "info" },
  shipped: { label: "Imesafirishwa", variant: "success" },
  delivered: { label: "Imefikia", variant: "success" },
  cancelled: { label: "Imefutwa", variant: "danger" },
};

export default function SellerDashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "products">("overview");
  const sellerName = "Kariakoo Electronics";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-white shadow-sm lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-900 text-white font-bold text-sm">S</div>
          <div>
            <span className="font-bold text-brand-900">Soko</span>
            <span className="font-bold text-gold-500">Link</span>
            <span className="ml-1 text-xs text-gray-400">Seller</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {[
            { id: "overview", label: "Muhtasari", icon: BarChart3 },
            { id: "orders", label: "Maagizo", icon: ShoppingBag, badge: DEMO_STATS.pendingOrders },
            { id: "products", label: "Bidhaa Zangu", icon: Package },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as typeof activeTab)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? "bg-brand-900 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4" />
                {item.label}
              </div>
              {item.badge ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}

          <div className="my-3 border-t" />

          <Link href="/seller/products/new" className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100">
            <Plus className="h-4 w-4" /> Ongeza Bidhaa
          </Link>
          <Link href="/seller/settings" className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100">
            <Settings className="h-4 w-4" /> Mipangilio
          </Link>
        </nav>

        <div className="border-t p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-900 font-bold text-sm">K</div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">{sellerName}</p>
              <p className="text-xs text-green-600">✓ Duka Limethibitishwa</p>
            </div>
          </div>
          <button className="flex w-full items-center gap-2 text-xs text-gray-500 hover:text-red-600">
            <LogOut className="h-3.5 w-3.5" /> Toka
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
          <div>
            <h1 className="font-bold text-gray-900">
              {activeTab === "overview" && "Muhtasari wa Duka"}
              {activeTab === "orders" && "Maagizo"}
              {activeTab === "products" && "Bidhaa Zangu"}
            </h1>
            <p className="text-xs text-gray-500">{sellerName}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <Link href="/seller/products/new">
              <Button size="sm"><Plus className="h-4 w-4" /> Bidhaa Mpya</Button>
            </Link>
          </div>
        </header>

        <main className="p-6">
          {/* ── Overview Tab ── */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Mapato ya Jumla", value: formatCurrency(DEMO_STATS.totalRevenue), icon: DollarSign, color: "text-green-600 bg-green-100", sub: "Tangu uanze" },
                  { label: "Mapato ya Mwezi", value: formatCurrency(DEMO_STATS.monthRevenue), icon: TrendingUp, color: "text-blue-600 bg-blue-100", sub: "Mei 2025" },
                  { label: "Maagizo Yote", value: DEMO_STATS.totalOrders.toString(), icon: ShoppingBag, color: "text-purple-600 bg-purple-100", sub: `${DEMO_STATS.pendingOrders} yanasubiri` },
                  { label: "Bidhaa Zinazouza", value: `${DEMO_STATS.activeProducts}/${DEMO_STATS.totalProducts}`, icon: Package, color: "text-amber-600 bg-amber-100", sub: "Amilifu / Zote" },
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

              {/* Recent orders */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base">Maagizo ya Hivi Karibuni</CardTitle>
                  <button onClick={() => setActiveTab("orders")} className="flex items-center gap-1 text-xs text-brand-700 hover:text-brand-900">
                    Ona Yote <ChevronRight className="h-3 w-3" />
                  </button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {DEMO_ORDERS.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{order.id}</p>
                          <p className="text-xs text-gray-500">{order.customer} · {order.items} bidhaa</p>
                          <p className="text-xs text-gray-400">{formatRelativeTime(order.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-brand-900 text-sm">{formatCurrency(order.amount)}</p>
                          <Badge variant={STATUS_CONFIG[order.status].variant} className="mt-1">
                            {STATUS_CONFIG[order.status].label}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Low stock alert */}
              {DEMO_PRODUCTS.some((p) => p.stock < 5) && (
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-amber-900">Bidhaa Zinaisha</p>
                        <p className="mt-1 text-sm text-amber-700">
                          {DEMO_PRODUCTS.filter((p) => p.stock < 5).map((p) => p.name).join(", ")} — stock ya chini.
                        </p>
                        <button onClick={() => setActiveTab("products")} className="mt-2 text-xs font-medium text-amber-900 underline">
                          Ongeza Stock →
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* ── Orders Tab ── */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {["Zote", "Zinasubiri", "Zinatengenezwa", "Zimesafirishwa", "Zimefikia"].map((f) => (
                  <button key={f} className="flex-shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium text-gray-600 hover:bg-brand-50 hover:border-brand-300 hover:text-brand-800 transition-colors">
                    {f}
                  </button>
                ))}
              </div>

              <Card>
                <div className="divide-y">
                  {DEMO_ORDERS.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-5 hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-900 font-bold text-xs">
                          {order.customer[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{order.id}</p>
                          <p className="text-xs text-gray-500">{order.customer} · {order.items} bidhaa</p>
                          <p className="text-xs text-gray-400">{formatRelativeTime(order.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <p className="font-bold text-gray-900 text-sm">{formatCurrency(order.amount)}</p>
                          <Badge variant={STATUS_CONFIG[order.status].variant}>
                            {STATUS_CONFIG[order.status].label}
                          </Badge>
                        </div>
                        <Button variant="outline" size="icon-sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* ── Products Tab ── */}
          {activeTab === "products" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{DEMO_PRODUCTS.length} bidhaa</p>
                <Link href="/seller/products/new">
                  <Button size="sm"><Plus className="h-4 w-4" /> Bidhaa Mpya</Button>
                </Link>
              </div>

              <Card>
                <div className="divide-y">
                  {DEMO_PRODUCTS.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-5">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-lg bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">📦</div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500">{formatCurrency(product.price)} · {product.sold} ziliuzwa</p>
                          <div className="mt-1 flex items-center gap-2">
                            {product.stock === 0 ? (
                              <Badge variant="danger">Imeisha</Badge>
                            ) : product.stock < 5 ? (
                              <Badge variant="warning">Imebaki {product.stock}</Badge>
                            ) : (
                              <Badge variant="success">Stock: {product.stock}</Badge>
                            )}
                            {!product.active && <Badge variant="muted">Imefichwa</Badge>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/seller/products/${product.id}/edit`}>
                          <Button variant="outline" size="sm">Hariri</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
