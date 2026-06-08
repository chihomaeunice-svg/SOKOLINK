"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Store, ShoppingBag, Users,
  Settings, Shield, LogOut, Bell, ChevronRight,
} from "lucide-react";
import { onAuthChange, logout } from "@/lib/firebase/auth";

const NAV = [
  { href: "/admin/dashboard", label: "Muhtasari",  icon: LayoutDashboard },
  { href: "/admin/sellers",   label: "Wauzaji",     icon: Store },
  { href: "/admin/orders",    label: "Maagizo",     icon: ShoppingBag },
  { href: "/admin/users",     label: "Watumiaji",   icon: Users },
  { href: "/admin/settings",  label: "Mipangilio",  icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const [checking, setChecking]   = useState(true);
  const [userName, setUserName]   = useState("Admin");
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    const unsub = onAuthChange((profile) => {
      if (!profile) { router.replace("/auth/login"); return; }
      if (profile.role !== "admin") { router.replace("/shop"); return; }
      setUserName(profile.name ?? "Admin");
      setChecking(false);
    });
    return unsub;
  }, [router]);

  async function handleLogout() {
    await logout();
    router.push("/auth/login");
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="text-center">
          <Shield className="h-10 w-10 text-amber-400 mx-auto mb-3 animate-pulse" />
          <p className="text-white/60 text-sm">Inathibitisha ruhusa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── Sidebar (desktop) ────────────────────────────────── */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden lg:flex lg:flex-col w-60 bg-gray-950 text-white">
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/10">
          <Shield className="h-5 w-5 text-amber-400 flex-shrink-0" />
          <span className="font-bold">SokoLink <span className="text-xs font-normal text-white/40">Admin</span></span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map((n) => {
            const active = pathname === n.href || pathname.startsWith(n.href + "/");
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <n.icon className="h-4 w-4" />
                  {n.label}
                </div>
                {active && <ChevronRight className="h-3.5 w-3.5 text-white/40" />}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center font-bold text-gray-900 text-sm flex-shrink-0">
              {userName[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{userName}</p>
              <p className="text-xs text-white/40">Msimamizi</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-white/40 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" /> Toka
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────── */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">

        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 sm:px-6 h-16 flex items-center justify-between shadow-sm">
          {/* Mobile: hamburger + logo */}
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              onClick={() => setMobileNav(!mobileNav)}
            >
              <Shield className="h-5 w-5" />
            </button>
            <div className="lg:hidden font-bold text-gray-900 text-sm">
              Soko<span className="text-amber-500">Link</span>{" "}
              <span className="text-xs font-normal text-gray-400">Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50">
              <Bell className="h-5 w-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5">
              <div className="h-6 w-6 rounded-full bg-amber-500 flex items-center justify-center font-bold text-gray-900 text-xs">
                {userName[0]?.toUpperCase() ?? "A"}
              </div>
              <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">{userName}</span>
            </div>
          </div>
        </header>

        {/* Mobile nav drawer */}
        {mobileNav && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="w-60 bg-gray-950 text-white flex flex-col">
              <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/10">
                <Shield className="h-5 w-5 text-amber-400" />
                <span className="font-bold">SokoLink Admin</span>
              </div>
              <nav className="flex-1 px-3 py-4 space-y-0.5">
                {NAV.map((n) => {
                  const active = pathname === n.href || pathname.startsWith(n.href + "/");
                  return (
                    <Link
                      key={n.href}
                      href={n.href}
                      onClick={() => setMobileNav(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                        active ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <n.icon className="h-4 w-4" />{n.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="border-t border-white/10 p-4">
                <button onClick={handleLogout} className="flex items-center gap-2 text-xs text-white/40 hover:text-red-400">
                  <LogOut className="h-3.5 w-3.5" /> Toka
                </button>
              </div>
            </div>
            <div className="flex-1 bg-black/50" onClick={() => setMobileNav(false)} />
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
