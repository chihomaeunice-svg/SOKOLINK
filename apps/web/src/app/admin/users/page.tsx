"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Search, User, Store, Shield, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import { adminGetAllUsers, adminSuspendUser } from "@/lib/firebase/admin-service";
import type { User as UserType } from "@/lib/types";

type RoleFilter = "all" | "customer" | "seller" | "admin";

const ROLE_ICON: Record<string, React.ReactNode> = {
  customer: <User className="h-4 w-4" />,
  seller:   <Store className="h-4 w-4" />,
  admin:    <Shield className="h-4 w-4" />,
};

export default function AdminUsersPage() {
  const [users,   setUsers]   = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting,  setActing]  = useState<string | null>(null);
  const [filter,  setFilter]  = useState<RoleFilter>("all");
  const [search,  setSearch]  = useState("");

  async function load() {
    setLoading(true);
    try { setUsers(await adminGetAllUsers()); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  const filtered = users
    .filter((u) => filter === "all" || u.role === filter)
    .filter((u) =>
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    );

  const counts = {
    all:      users.length,
    customer: users.filter((u) => u.role === "customer").length,
    seller:   users.filter((u) => u.role === "seller").length,
    admin:    users.filter((u) => u.role === "admin").length,
  };

  async function handleSuspend(uid: string) {
    setActing(uid);
    try {
      await adminSuspendUser(uid);
      setUsers((prev) => prev.map((u) => u.id === uid ? { ...u, suspended: true } : u));
    } finally { setActing(null); }
  }

  const FILTERS: { key: RoleFilter; label: string }[] = [
    { key: "all",      label: `Wote (${counts.all})` },
    { key: "customer", label: `Wateja (${counts.customer})` },
    { key: "seller",   label: `Wauzaji (${counts.seller})` },
    { key: "admin",    label: `Wasimamizi (${counts.admin})` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Watumiaji</h1>
          <p className="text-sm text-gray-400 mt-0.5">{users.length} watumiaji wote</p>
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
            placeholder="Tafuta jina au nambari ya simu..."
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
          <div className="py-20 text-center">
            <User className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="font-semibold text-gray-500">Hakuna watumiaji</p>
            <p className="text-sm text-gray-400 mt-1">Jaribu filter nyingine</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((u) => (
              <div key={u.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full brand-gradient flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {u.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900">{u.name ?? "—"}</p>
                      {(u as any).suspended && <Badge variant="danger">Imesimamishwa</Badge>}
                    </div>
                    <p className="text-xs text-gray-400">{u.phone ?? u.email ?? "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                    u.role === "admin"    ? "bg-purple-100 text-purple-700" :
                    u.role === "seller"  ? "bg-blue-100 text-blue-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {ROLE_ICON[u.role ?? "customer"]}
                    {u.role === "admin" ? "Msimamizi" : u.role === "seller" ? "Muuzaji" : "Mteja"}
                  </div>
                  {u.role !== "admin" && !(u as any).suspended && (
                    <Button
                      size="icon-sm"
                      variant="outline"
                      className="text-red-500 border-red-200 hover:bg-red-50"
                      loading={acting === u.id}
                      onClick={() => handleSuspend(u.id!)}
                    >
                      <UserX className="h-4 w-4" />
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
