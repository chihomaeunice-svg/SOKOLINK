"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Package, ShoppingBag, Settings,
  Plus, Bell, LogOut, TrendingUp, DollarSign,
  Eye, AlertTriangle, Store, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";

/* ── demo data ──────────────────────────────────────────────── */
const STATS = [
  { label: "Mapato ya Mwezi",   value: "TZS 1,230,000", sub: "+12% vs mwezi uliopita", icon: TrendingUp, color: "text-emerald-600 bg-emerald-50" },
  { label: "Mapato ya Jumla",   value: "TZS 4,850,000", sub: "Tangu ulipoanza",          icon: DollarSign, color: "text-blue-600 bg-blue-50"    },
  { label: "Maagizo ya Mwezi",  value: "34",             sub: "5 yanasubiri",             icon: ShoppingBag,color: "text-purple-600 bg-purple-50" },
  { label: "Bidhaa Zinazouza",  value: "20 / 23",        sub: "3 zimefichwa",             icon: Package,    color: "text-amber-600 bg-amber-50"   },
];

const ORDERS = [
  { id:"SL-ABC123", customer:"Amina Hassan",  amount:65000,  status:"confirmed",  items:2, at: new Date(Date.now()-1000*60*20)  },
  { id:"SL-DEF456", customer:"John Mwangi",   amount:180000, status:"processing", items:1, at: new Date(Date.now()-1000*60*90)  },
  { id:"SL-GHI789", customer:"Fatuma Ali",    amount:45000,  status:"shipped",    items:3, at: new Date(Date.now()-1000*60*60*5)},
  { id:"SL-JKL012", customer:"Peter Kimani",  amount:25000,  status:"delivered",  items:1, at: new Date(Date.now()-1000*60*60*24)},
  { id:"SL-MNO345", customer:"Zainab Said",   amount:95000,  status:"pending",    items:2, at: new Date(Date.now()-1000*60*5)   },
];

const PRODUCTS = [
  { id:"p1", name:"Samsung Galaxy A35 5G", price:650000, stock:15, sold:89,  active:true  },
  { id:"p2", name:"Earbuds TWS Pro",        price:45000,  stock:2,  sold:43,  active:true  },
  { id:"p3", name:"Power Bank 20000mAh",    price:55000,  stock:0,  sold:34,  active:false },
];

const STATUS: Record<string,{label:string; variant:"success"|"warning"|"info"|"muted"|"danger"}> = {
  pending:    { label:"Inasubiri",      variant:"warning" },
  confirmed:  { label:"Imethibitishwa",  variant:"info"    },
  processing: { label:"Inatengenezwa",   variant:"info"    },
  shipped:    { label:"Imesafirishwa",   variant:"success" },
  delivered:  { label:"Imefikia",        variant:"success" },
  cancelled:  { label:"Imefutwa",        variant:"danger"  },
};

type Tab = "overview" | "orders" | "products";

const NAV = [
  { id:"overview",  label:"Muhtasari",   icon:LayoutDashboard },
  { id:"orders",    label:"Maagizo",      icon:ShoppingBag, badge:5 },
  { id:"products",  label:"Bidhaa",       icon:Package },
];

export default function SellerDashboard() {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden lg:flex lg:flex-col w-60 bg-white border-r border-gray-100 shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-gray-100">
          <div className="h-8 w-8 rounded-xl brand-gradient flex items-center justify-center text-white font-bold text-sm">S</div>
          <span className="font-bold text-gray-900">Soko<span className="text-amber-500">Link</span> <span className="text-xs font-normal text-gray-400">Seller</span></span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setTab(n.id as Tab)}
              className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                tab === n.id ? "bg-brand-900 text-white" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-3"><n.icon className="h-4 w-4" />{n.label}</div>
              {n.badge && <span className="h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs">{n.badge}</span>}
            </button>
          ))}

          <div className="my-3 border-t border-gray-100" />

          <Link href="/seller/products/new" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
            <Plus className="h-4 w-4" /> Bidhaa Mpya
          </Link>
          <Link href="/seller/settings" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
            <Settings className="h-4 w-4" /> Mipangilio
          </Link>
        </nav>

        {/* Profile footer */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-full brand-gradient flex items-center justify-center text-white font-bold text-sm flex-shrink-0">D</div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">Duka Langu</p>
              <p className="text-xs text-emerald-600">✓ Duka Limethibitishwa</p>
            </div>
          </div>
          <button className="flex items-center gap-2 text-xs text-gray-400 hover:text-red-500 transition-colors">
            <LogOut className="h-3.5 w-3.5" /> Toka
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────── */}
      <div className="flex-1 lg:ml-60">

        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-6 h-16 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="font-extrabold text-gray-900">
              {tab === "overview" && "Muhtasari"}
              {tab === "orders"   && "Maagizo"}
              {tab === "products" && "Bidhaa Zangu"}
            </h1>
            <p className="text-xs text-gray-400">Duka Langu</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <Link href="/seller/products/new">
              <Button size="sm"><Plus className="h-4 w-4" /> Bidhaa Mpya</Button>
            </Link>
          </div>
        </header>

        <main className="p-6 space-y-6">

          {/* ── Overview ── */}
          {tab === "overview" && (
            <>
              {/* Stats grid */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {STATS.map((s) => (
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

              {/* Low stock alert */}
              {PRODUCTS.some((p) => p.stock < 5) && (
                <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-amber-900 text-sm">Bidhaa Zinaisha Stock</p>
                    <p className="text-sm text-amber-700 mt-0.5">
                      {PRODUCTS.filter((p) => p.stock < 5).map((p) => p.name).join(", ")}
                    </p>
                  </div>
                  <button onClick={() => setTab("products")} className="text-xs font-semibold text-amber-800 underline whitespace-nowrap">
                    Ongeza Stock
                  </button>
                </div>
              )}

              {/* Recent orders */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900">Maagizo ya Hivi Karibuni</h2>
                  <button onClick={() => setTab("orders")} className="flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-900">
                    Ona Yote <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  {ORDERS.slice(0,4).map((o) => (
                    <div key={o.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{o.id}</p>
                        <p className="text-xs text-gray-400">{o.customer} · {o.items} bidhaa · {formatRelativeTime(o.at)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={STATUS[o.status].variant}>{STATUS[o.status].label}</Badge>
                        <p className="text-sm font-extrabold text-brand-900">{formatCurrency(o.amount)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── Orders ── */}
          {tab === "orders" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 overflow-x-auto scrollbar-hide">
                {["Zote","Zinasubiri","Zinatengenezwa","Zimesafirishwa","Zimefikia"].map((f) => (
                  <button key={f} className="flex-shrink-0 rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold text-gray-500 hover:bg-brand-50 hover:border-brand-300 hover:text-brand-800 transition-colors">
                    {f}
                  </button>
                ))}
              </div>
              <div className="divide-y divide-gray-50">
                {ORDERS.map((o) => (
                  <div key={o.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full brand-gradient flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {o.customer[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{o.id}</p>
                        <p className="text-xs text-gray-400">{o.customer} · {o.items} bidhaa · {formatRelativeTime(o.at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={STATUS[o.status].variant}>{STATUS[o.status].label}</Badge>
                      <p className="font-extrabold text-gray-900 text-sm hidden sm:block">{formatCurrency(o.amount)}</p>
                      <Button variant="outline" size="icon-sm"><Eye className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Products ── */}
          {tab === "products" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <p className="text-sm text-gray-500">{PRODUCTS.length} bidhaa</p>
                <Link href="/seller/products/new">
                  <Button size="sm"><Plus className="h-4 w-4" /> Bidhaa Mpya</Button>
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
                {PRODUCTS.map((p) => (
                  <div key={p.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-xl bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">📦</div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-400">{formatCurrency(p.price)} · {p.sold} ziliuzwa</p>
                        <div className="flex gap-1.5 mt-1">
                          {p.stock === 0 ? <Badge variant="danger">Imeisha</Badge>
                            : p.stock < 5 ? <Badge variant="warning">Stock: {p.stock}</Badge>
                            : <Badge variant="success">Stock: {p.stock}</Badge>}
                          {!p.active && <Badge variant="muted">Imefichwa</Badge>}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Hariri</Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
