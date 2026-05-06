"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Search, Menu, X, User, Bell, Store, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES } from "@/lib/constants";

interface NavbarProps {
  cartCount?: number;
  userRole?: "customer" | "seller" | "admin" | null;
  userName?: string;
}

export default function Navbar({ cartCount = 0, userRole, userName }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      {/* Top bar */}
      <div className="brand-gradient py-1.5 text-center text-xs text-white">
        <span>🇹🇿 Tanzania&apos;s #1 Kariakoo Marketplace &nbsp;|&nbsp; Lipa M-Pesa Salama &nbsp;|&nbsp; Delivery Tanzania Nzima</span>
      </div>

      {/* Main navbar */}
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-900 text-white font-bold text-lg">
            S
          </div>
          <div>
            <span className="text-xl font-bold text-brand-900">Soko</span>
            <span className="text-xl font-bold text-gold-500">Link</span>
          </div>
        </Link>

        {/* Search bar (desktop) */}
        <div className="hidden flex-1 max-w-2xl md:flex">
          <div className="flex w-full rounded-lg border-2 border-brand-900 overflow-hidden">
            <select className="border-r border-gray-300 bg-gray-50 px-3 text-sm text-gray-700 outline-none cursor-pointer">
              <option value="">Aina Zote</option>
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Tafuta bidhaa, duka, au brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 text-sm outline-none"
            />
            <button className="brand-gradient px-5 text-white hover:opacity-90 transition-opacity">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* Search icon (mobile) */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-brand-900"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Notifications */}
          {userRole && (
            <button className="relative p-2 text-gray-600 hover:text-brand-900">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>
          )}

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center gap-1 rounded-lg p-2 text-gray-600 hover:text-brand-900 hover:bg-gray-50 transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-xs font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {/* Seller dashboard shortcut */}
          {userRole === "seller" && (
            <Link href="/seller">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Store className="h-4 w-4" />
                Duka Langu
              </Button>
            </Link>
          )}

          {/* Admin dashboard shortcut */}
          {userRole === "admin" && (
            <Link href="/admin">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                Admin
              </Button>
            </Link>
          )}

          {/* User menu */}
          {userRole ? (
            <div className="relative hidden sm:block">
              <button
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-brand-900 font-bold text-xs">
                  {userName?.[0]?.toUpperCase() || "U"}
                </div>
                {userName}
                <ChevronDown className="h-4 w-4" />
              </button>
              {categoriesOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border bg-white shadow-lg z-50">
                  <Link href="/profile" className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50">
                    <User className="h-4 w-4" /> Akaunti Yangu
                  </Link>
                  <Link href="/orders" className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50">
                    📦 Maagizo Yangu
                  </Link>
                  <hr className="my-1" />
                  <button className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50">
                    🚪 Toka
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="outline" size="sm">Ingia</Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Jiandikishe</Button>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="sm:hidden p-2 text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Category nav (desktop) */}
      <div className="hidden border-t border-gray-100 bg-gray-50 md:block">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8 scrollbar-hide">
          {PRODUCT_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="flex flex-shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-brand-50 hover:text-brand-900 transition-colors whitespace-nowrap"
            >
              <span>{cat.icon}</span>
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile search */}
      {searchOpen && (
        <div className="border-t bg-white p-3 md:hidden">
          <div className="flex rounded-lg border-2 border-brand-900 overflow-hidden">
            <input
              type="text"
              placeholder="Tafuta bidhaa..."
              className="flex-1 px-4 py-2 text-sm outline-none"
              autoFocus
            />
            <button className="brand-gradient px-4 text-white">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-white sm:hidden">
          <div className="space-y-1 px-4 py-3">
            {!userRole ? (
              <div className="flex gap-2 pb-3">
                <Link href="/auth/login" className="flex-1">
                  <Button variant="outline" className="w-full">Ingia</Button>
                </Link>
                <Link href="/auth/register" className="flex-1">
                  <Button className="w-full">Jiandikishe</Button>
                </Link>
              </div>
            ) : (
              <div className="pb-3">
                <p className="font-semibold text-gray-900">{userName}</p>
                <div className="mt-2 space-y-1">
                  <Link href="/profile" className="block py-2 text-sm text-gray-600">Akaunti Yangu</Link>
                  <Link href="/orders" className="block py-2 text-sm text-gray-600">Maagizo Yangu</Link>
                  {userRole === "seller" && (
                    <Link href="/seller" className="block py-2 text-sm text-brand-900 font-medium">Duka Langu</Link>
                  )}
                </div>
              </div>
            )}
            <hr />
            <p className="py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Aina za Bidhaa</p>
            {PRODUCT_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="flex items-center gap-2 py-2 text-sm text-gray-600"
                onClick={() => setMobileOpen(false)}
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
