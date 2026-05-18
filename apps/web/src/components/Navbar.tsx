"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Search, Menu, X, ChevronDown, Bell, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES } from "@/lib/constants";

interface NavbarProps {
  cartCount?: number;
  userRole?: "customer" | "seller" | "admin" | null;
  userName?: string;
}

export default function Navbar({ cartCount = 0, userRole, userName }: NavbarProps) {
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">

      {/* ── Announcement bar ── */}
      <div className="brand-gradient text-white text-center py-2 text-xs font-medium tracking-wide">
        🇹🇿 Soko Link — Kariakoo Ndani ya Simu &nbsp;·&nbsp; Malipo Salama M-Pesa &nbsp;·&nbsp; Delivery Tanzania Nzima
      </div>

      {/* ── Main bar ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl brand-gradient flex items-center justify-center text-white font-bold text-base shadow-sm">
              S
            </div>
            <span className="text-xl font-bold">
              <span className="text-brand-900">Soko</span><span className="text-gold-500">Link</span>
            </span>
          </Link>

          {/* Search (desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="flex w-full items-center rounded-xl border-2 border-gray-200 bg-gray-50 focus-within:border-brand-700 focus-within:bg-white transition-all overflow-hidden">
              <input
                type="text"
                placeholder="Tafuta bidhaa, duka..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
              />
              <button className="px-4 py-2.5 brand-gradient text-white text-sm font-medium hover:opacity-90 transition-opacity">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-1">
            {/* Notifications */}
            {userRole && (
              <button className="relative p-2 rounded-lg text-gray-500 hover:text-brand-900 hover:bg-gray-50 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
              </button>
            )}

            {/* Cart */}
            <Link href="/cart" className="relative p-2 rounded-lg text-gray-500 hover:text-brand-900 hover:bg-gray-50 transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 flex items-center justify-center rounded-full gold-gradient text-white text-xs font-bold shadow">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* Seller shortcut */}
            {userRole === "seller" && (
              <Link href="/seller/dashboard" className="hidden sm:block">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Store className="h-3.5 w-3.5" /> Duka Langu
                </Button>
              </Link>
            )}

            {/* Auth / User menu */}
            {userRole ? (
              <div className="relative hidden sm:block ml-1">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <div className="h-7 w-7 rounded-full brand-gradient flex items-center justify-center text-white text-xs font-bold">
                    {userName?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <span className="max-w-[80px] truncate">{userName}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-gray-100 bg-white shadow-xl py-2 z-50">
                    <Link href="/profile"    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">👤 Akaunti Yangu</Link>
                    <Link href="/orders"     className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">📦 Maagizo Yangu</Link>
                    <Link href="/wishlist"   className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">❤️ Wishlist</Link>
                    <hr className="my-1 border-gray-100" />
                    <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">🚪 Toka</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 ml-1">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">Ingia</Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Jiandikishe</Button>
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="sm:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-50"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Category strip (desktop) */}
        <div className="hidden md:flex items-center gap-0.5 overflow-x-auto scrollbar-hide border-t border-gray-100 py-1.5 -mx-1">
          {PRODUCT_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="flex flex-shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:text-brand-900 hover:bg-brand-50 transition-colors whitespace-nowrap"
            >
              <span>{cat.icon}</span>{cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white sm:hidden">
          {/* Mobile search */}
          <div className="px-4 pt-3 pb-2">
            <div className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-gray-50 overflow-hidden">
              <input
                autoFocus
                type="text"
                placeholder="Tafuta bidhaa..."
                className="flex-1 px-4 py-2.5 text-sm bg-transparent outline-none"
              />
              <button className="px-4 py-2.5 brand-gradient text-white">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="px-4 py-3 space-y-1">
            {!userRole ? (
              <div className="flex gap-2 pb-2">
                <Link href="/auth/login"    className="flex-1"><Button variant="outline" className="w-full">Ingia</Button></Link>
                <Link href="/auth/register" className="flex-1"><Button className="w-full">Jiandikishe</Button></Link>
              </div>
            ) : (
              <div className="pb-2 border-b border-gray-100 mb-2">
                <p className="font-semibold text-gray-900 mb-2">{userName}</p>
                <Link href="/profile" className="block py-2 text-sm text-gray-600">👤 Akaunti Yangu</Link>
                <Link href="/orders"  className="block py-2 text-sm text-gray-600">📦 Maagizo Yangu</Link>
                {userRole === "seller" && <Link href="/seller/dashboard" className="block py-2 text-sm font-semibold text-brand-800">🏪 Duka Langu</Link>}
              </div>
            )}
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 py-2">Aina za Bidhaa</p>
            {PRODUCT_CATEGORIES.map((cat) => (
              <Link key={cat.id} href={`/shop?category=${cat.slug}`}
                className="flex items-center gap-3 py-2.5 text-sm text-gray-700 hover:text-brand-900"
                onClick={() => setMobileOpen(false)}
              >
                <span className="text-lg">{cat.icon}</span>{cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
