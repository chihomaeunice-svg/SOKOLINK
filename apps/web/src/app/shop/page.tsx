"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { getProducts } from "@/lib/firebase/firestore";
import type { Product } from "@/lib/types";

// Demo products for UI display before Firebase is connected
const DEMO_PRODUCTS: Product[] = [
  { id: "1", sellerId: "s1", seller: { id: "s1", userId: "s1", storeName: "Kariakoo Electronics", description: "", location: "Kariakoo", verified: true, rating: 4.8, totalSales: 200, mpesaNumber: "+255712000001", createdAt: new Date() }, name: "Samsung Galaxy A35 5G", description: "", price: 650000, compareAtPrice: 750000, category: "electronics", images: ["https://picsum.photos/seed/phone1/400/400"], stock: 15, tags: [], rating: 4.7, reviewCount: 234, sold: 89, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "2", sellerId: "s2", seller: { id: "s2", userId: "s2", storeName: "Fashion Dar", description: "", location: "Ilala", verified: true, rating: 4.5, totalSales: 150, mpesaNumber: "+255712000002", createdAt: new Date() }, name: "Kanga ya Tanzania — Asante", description: "", price: 25000, compareAtPrice: undefined, category: "fashion", images: ["https://picsum.photos/seed/kanga1/400/400"], stock: 50, tags: [], rating: 4.9, reviewCount: 87, sold: 312, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "3", sellerId: "s1", seller: { id: "s1", userId: "s1", storeName: "Kariakoo Electronics", description: "", location: "Kariakoo", verified: true, rating: 4.8, totalSales: 200, mpesaNumber: "+255712000001", createdAt: new Date() }, name: "Earbuds Wireless — TWS Pro", description: "", price: 45000, compareAtPrice: 65000, category: "electronics", images: ["https://picsum.photos/seed/earbuds1/400/400"], stock: 8, tags: [], rating: 4.3, reviewCount: 56, sold: 43, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "4", sellerId: "s3", seller: { id: "s3", userId: "s3", storeName: "Duka la Nyumbani", description: "", location: "Kariakoo", verified: true, rating: 4.6, totalSales: 90, mpesaNumber: "+255712000003", createdAt: new Date() }, name: "Sufuria ya Aluminium 20L", description: "", price: 35000, compareAtPrice: undefined, category: "home", images: ["https://picsum.photos/seed/pot1/400/400"], stock: 20, tags: [], rating: 4.6, reviewCount: 34, sold: 28, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "5", sellerId: "s2", seller: { id: "s2", userId: "s2", storeName: "Fashion Dar", description: "", location: "Ilala", verified: true, rating: 4.5, totalSales: 150, mpesaNumber: "+255712000002", createdAt: new Date() }, name: "Viatu vya Ngozi — Handmade", description: "", price: 85000, compareAtPrice: 120000, category: "fashion", images: ["https://picsum.photos/seed/shoes1/400/400"], stock: 3, tags: [], rating: 4.8, reviewCount: 102, sold: 67, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "6", sellerId: "s4", seller: { id: "s4", userId: "s4", storeName: "Tech Kariakoo", description: "", location: "Kariakoo", verified: true, rating: 4.7, totalSales: 300, mpesaNumber: "+255712000004", createdAt: new Date() }, name: "Power Bank 20000mAh", description: "", price: 55000, compareAtPrice: 75000, category: "electronics", images: ["https://picsum.photos/seed/powerbank1/400/400"], stock: 25, tags: [], rating: 4.5, reviewCount: 178, sold: 145, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "7", sellerId: "s5", seller: { id: "s5", userId: "s5", storeName: "Dawa za Asili", description: "", location: "Arusha", verified: true, rating: 4.4, totalSales: 60, mpesaNumber: "+255712000005", createdAt: new Date() }, name: "Asali ya Asili — 1kg", description: "", price: 22000, compareAtPrice: undefined, category: "health", images: ["https://picsum.photos/seed/honey1/400/400"], stock: 40, tags: [], rating: 4.9, reviewCount: 67, sold: 203, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "8", sellerId: "s3", seller: { id: "s3", userId: "s3", storeName: "Duka la Nyumbani", description: "", location: "Kariakoo", verified: true, rating: 4.6, totalSales: 90, mpesaNumber: "+255712000003", createdAt: new Date() }, name: "Godoro la Povu — 6x6", description: "", price: 180000, compareAtPrice: 220000, category: "home", images: ["https://picsum.photos/seed/mattress1/400/400"], stock: 10, tags: [], rating: 4.4, reviewCount: 45, sold: 32, active: true, createdAt: new Date(), updatedAt: new Date() },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "";

  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const filtered = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "popular") return b.sold - a.sold;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartCount={cartCount} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar filters (desktop) */}
          <aside className="hidden w-56 flex-shrink-0 lg:block">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <h3 className="mb-4 font-bold text-gray-900">Aina za Bidhaa</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setActiveCategory("")}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${!activeCategory ? "bg-brand-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                  >
                    Zote
                  </button>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.slug)}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${activeCategory === cat.slug ? "bg-brand-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                    >
                      <span>{cat.icon}</span> {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            {/* Top bar */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {activeCategory
                    ? PRODUCT_CATEGORIES.find((c) => c.slug === activeCategory)?.name ?? "Bidhaa"
                    : "Bidhaa Zote"}
                </h1>
                <p className="text-sm text-gray-500">{sorted.length} bidhaa zinapatikana</p>
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile filter toggle */}
                <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setFiltersOpen(!filtersOpen)}>
                  <SlidersHorizontal className="h-4 w-4" /> Chaguo
                </Button>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-700"
                >
                  <option value="newest">Mpya Zaidi</option>
                  <option value="popular">Maarufu Zaidi</option>
                  <option value="rating">Rating ya Juu</option>
                  <option value="price-asc">Bei: Chini → Juu</option>
                  <option value="price-desc">Bei: Juu → Chini</option>
                </select>
              </div>
            </div>

            {/* Active category pill */}
            {activeCategory && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm text-gray-500">Inachujwa na:</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">
                  {PRODUCT_CATEGORIES.find((c) => c.slug === activeCategory)?.icon}{" "}
                  {PRODUCT_CATEGORIES.find((c) => c.slug === activeCategory)?.name}
                  <button onClick={() => setActiveCategory("")} className="ml-1 hover:text-brand-600">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              </div>
            )}

            {/* Products grid */}
            {sorted.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {sorted.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => setCartCount((c) => c + 1)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-lg font-semibold text-gray-700">Hakuna bidhaa zilizopatikana</p>
                <p className="mt-1 text-sm text-gray-500">Jaribu aina nyingine au tafuta tena</p>
                <Button className="mt-4" onClick={() => setActiveCategory("")}>Ona Bidhaa Zote</Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-gray-500">Inapakia bidhaa...</div>}>
      <ShopContent />
    </Suspense>
  );
}
