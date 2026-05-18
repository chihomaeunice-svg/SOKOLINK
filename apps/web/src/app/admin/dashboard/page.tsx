"use client";

import { useState } from "react";
import {
  LayoutDashboard, Store, ShoppingBag, Users,
  CheckCircle2, XCircle, Eye, AlertTriangle,
  TrendingUp, DollarSign, Bell, Shield, LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";

/* ── demo data ──────────────────────────────────────────────── */
const STATS = [
  { label:"Mapato ya Jumla",    value:"TZS 48,500,000", sub:"Jumla ya transactions",      icon:DollarSign,  color:"text-emerald-600 bg-emerald-50" },
  { label:"Ada ya Platform 5%", value:"TZS 2,425,000",  sub:"Mwezi huu",                  icon:TrendingUp,  color:"text-blue-600 bg-blue-50"       },
  { label:"Maagizo Yote",       value:"1,247",           sub:"89 yanafanyika sasa",         icon:ShoppingBag, color:"text-purple-600 bg-purple-50"   },
  { label:"Watumiaji",          value:"4,655",           sub:"4,521 wateja · 134 wauzaji", icon:Users,       color:"text-amber-600 bg-amber-50"     },
];

const PENDING = [
  { id:"ps1", store:"Mama Pima Fashion",  owner:"Amina Juma",   phone:"+255712001001", loc:"Kariakoo, DSM",  at: new Date(Date.now()-1000*60*60*3)  },
  { id:"ps2", store:"TechHub Arusha",     owner:"David Mollel", phone:"+255754002002", loc:"Arusha Mjini",   at: new Date(Date.now()-1000*60*60*7)  },
  { id:"ps3", store:"Zanzibar Spices",    owner:"Hassan Omar",  phone:"+255777003003", loc:"Zanzibar Town",  at: new Date(Date.now()-1000*60*60*14) },
];

const ORDERS = [
  { id:"SL-P9X1A", customer:"Fatuma Ali",   seller:"Kariakoo Electronics", amount:650000, status:"processing" },
  { id:"SL-Q2B7M", customer:"John Mwangi",  seller:"Fashion Dar",           amount:85000,  status:"shipped"    },
  { id:"SL-R3C8N", customer:"Amina Hassan", seller:"Tech Kariakoo",          amount:55000,  status:"delivered"  },
  { id:"SL-S4D9P", customer:"Peter Kimani", seller:"Duka la Nyumbani",       amount:35000,  status:"pending"    },
];

const STATUS: Record<string,{label:string; variant:"success"|"warning"|"info"|"muted"|"danger"}> = {
  pending:    { label:"Inasubiri",    variant:"warning" },
  processing: { label:"Inatengenezwa", variant:"info"   },
  shipped:    { label:"Imesafirishwa", variant:"success" },
  delivered:  { label:"Imefikia",      variant:"success" },
};

type Tab = "overview" | "sellers" | "orders";

const NAV = [
  { id:"overview", label:"Muhtasari",  icon:LayoutDashboard },
  { id:"sellers",  label:"Wauzaji",    icon:Store, badge:PENDING.length },
  { id:"orders",   label:"Maagizo",    icon:ShoppingBag },
];

export default function AdminDashboard() {
  const [tab,     setTab]     = useState<Tab>("overview");
  const [pending, setPending] = useState(PENDING);

  const approve = (id: string) => { setPending((p) => p.filter((s) => s.id !== id)); };
  const reject  = (id: string) => { setPending((p) => p.filter((s) => s.id !== id)); };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden lg:flex lg:flex-col w-60 bg-gray-950 text-white">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/10">
          <Shield className="h-5 w-5 text-amber-400" />
          <span className="font-bold">SokoLink <span className="text-xs font-normal text-white/40">Admin</span></span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setTab(n.id as Tab)}
              className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                tab === n.id ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3"><n.icon className="h-4 w-4" />{n.label}</div>
              {n.badge ? <span className="h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs">{n.badge}</span> : null}
            </button>
          ))}

          <div className="my-3 border-t border-white/10" />

          <button className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white">
            <Users className="h-4 w-4" /> Wateja
          </button>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">A</div>
            <div>
              <p className="text-sm font-semibold">Admin</p>
              <p className="text-xs text-white/40">Soko Link HQ</p>
            </div>
          </div>
          <button className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors">
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
              {tab === "overview" && "Platform Overview"}
              {tab === "sellers"  && "Usimamizi wa Wauzaji"}
              {tab === "orders"   && "Maagizo Yote"}
            </h1>
            <p className="text-xs text-gray-400">Soko Link Admin</p>
          </div>
          <button className="relative p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50">
            <Bell className="h-5 w-5" />
            {pending.length > 0 && (
              <span className="absolute top-1.5 right-1.5 h-4 w-4 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
                {pending.length}
              </span>
            )}
          </button>
        </header>

        <main className="p-6 space-y-6">

          {/* ── Overview ── */}
          {tab === "overview" && (
            <>
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

              {/* Pending sellers alert */}
              {pending.length > 0 && (
                <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="font-bold text-amber-900 text-sm">{pending.length} wauzaji wanaosubiri idhini</p>
                      <p className="text-xs text-amber-700">Idhini haraka ili waanze kuuza</p>
                    </div>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => setTab("sellers")}>
                    Angalia →
                  </Button>
                </div>
              )}

              {/* Recent orders */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900">Maagizo ya Hivi Karibuni</h2>
                  <button onClick={() => setTab("orders")} className="text-xs font-semibold text-brand-700 hover:text-brand-900">Ona Yote →</button>
                </div>
                <div className="divide-y divide-gray-50">
                  {ORDERS.map((o) => (
                    <div key={o.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{o.id}</p>
                        <p className="text-xs text-gray-400">{o.customer} ← {o.seller}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={STATUS[o.status].variant}>{STATUS[o.status].label}</Badge>
                        <p className="text-sm font-bold text-gray-900 hidden sm:block">{formatCurrency(o.amount)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── Sellers ── */}
          {tab === "sellers" && (
            <>
              {pending.length > 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <h2 className="font-bold text-gray-900 text-sm">Wauzaji Wanaosubiri Idhini ({pending.length})</h2>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {pending.map((s) => (
                      <div key={s.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 hover:bg-gray-50/50">
                        <div className="flex items-center gap-4">
                          <div className="h-11 w-11 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm flex-shrink-0">
                            {s.store[0]}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{s.store}</p>
                            <p className="text-xs text-gray-500">{s.owner} · {s.phone}</p>
                            <p className="text-xs text-gray-400">📍 {s.loc} · {formatRelativeTime(s.at)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button size="sm" variant="outline"><Eye className="h-3.5 w-3.5" /> Angalia</Button>
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => approve(s.id)}>
                            <CheckCircle2 className="h-3.5 w-3.5" /> Idhinisha
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => reject(s.id)}>
                            <XCircle className="h-3.5 w-3.5" /> Kataa
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-3" />
                  <p className="font-bold text-gray-700">Hakuna wanaosubiri!</p>
                  <p className="text-sm text-gray-400 mt-1">Ombi zote zimeshughulikiwa.</p>
                </div>
              )}
            </>
          )}

          {/* ── Orders ── */}
          {tab === "orders" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-50">
                {ORDERS.map((o) => (
                  <div key={o.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{o.id}</p>
                      <p className="text-xs text-gray-400">{o.customer} ← {o.seller}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={STATUS[o.status].variant}>{STATUS[o.status].label}</Badge>
                      <p className="font-bold text-gray-900 text-sm">{formatCurrency(o.amount)}</p>
                      <Button variant="outline" size="icon-sm"><Eye className="h-4 w-4" /></Button>
                    </div>
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
