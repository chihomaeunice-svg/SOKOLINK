"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import type { Product } from "@/lib/types";

/* ── demo products ──────────────────────────────────────────── */
const mkSeller = (id: string, name: string, loc: string) => ({
  id, userId: id, storeName: name, description: "", location: loc,
  verified: true, rating: 4.8, totalSales: 100, mpesaNumber: "+255712000001", createdAt: new Date(),
});

const DEMO: Product[] = [
  { id:"1", sellerId:"s1", seller: mkSeller("s1","TechHub DSM","Ilala"),     name:"Samsung Galaxy A35 5G", description:"", price:650000, compareAtPrice:750000, category:"electronics", images:["https://picsum.photos/seed/phone1/400/400"],  stock:15, tags:[], rating:4.7, reviewCount:234, sold:89,  active:true, createdAt:new Date(), updatedAt:new Date() },
  { id:"2", sellerId:"s2", seller: mkSeller("s2","Fashion Dar","Ilala"),   name:"Kanga ya Tanzania",    description:"", price:25000, compareAtPrice:undefined,  category:"fashion",     images:["https://picsum.photos/seed/kanga1/400/400"],  stock:50, tags:[], rating:4.9, reviewCount:87,  sold:312, active:true, createdAt:new Date(), updatedAt:new Date() },
  { id:"3", sellerId:"s1", seller: mkSeller("s1","TechHub DSM","Ilala"),   name:"TWS Earbuds Pro",       description:"", price:45000, compareAtPrice:65000,      category:"electronics", images:["https://picsum.photos/seed/earbuds1/400/400"], stock:8,  tags:[], rating:4.3, reviewCount:56,  sold:43,  active:true, createdAt:new Date(), updatedAt:new Date() },
  { id:"4", sellerId:"s3", seller: mkSeller("s3","Duka la Nyumbani","Kinondoni"), name:"Sufuria Aluminium 20L", description:"", price:35000, compareAtPrice:undefined, category:"home",   images:["https://picsum.photos/seed/pot1/400/400"],    stock:20, tags:[], rating:4.6, reviewCount:34,  sold:28,  active:true, createdAt:new Date(), updatedAt:new Date() },
  { id:"5", sellerId:"s2", seller: mkSeller("s2","Fashion Dar","Ilala"),   name:"Viatu vya Ngozi",       description:"", price:85000, compareAtPrice:120000,     category:"fashion",     images:["https://picsum.photos/seed/shoes1/400/400"],  stock:3,  tags:[], rating:4.8, reviewCount:102, sold:67,  active:true, createdAt:new Date(), updatedAt:new Date() },
  { id:"6", sellerId:"s4", seller: mkSeller("s4","Gadget Store","Temeke"), name:"Power Bank 20000mAh",   description:"", price:55000, compareAtPrice:75000,      category:"electronics", images:["https://picsum.photos/seed/powerbank1/400/400"],stock:25, tags:[], rating:4.5, reviewCount:178, sold:145, active:true, createdAt:new Date(), updatedAt:new Date() },
  { id:"7", sellerId:"s5", seller: mkSeller("s5","Dawa za Asili","Arusha"), name:"Asali ya Asili 1kg",   description:"", price:22000, compareAtPrice:undefined,  category:"health",      images:["https://picsum.photos/seed/honey1/400/400"],  stock:40, tags:[], rating:4.9, reviewCount:67,  sold:203, active:true, createdAt:new Date(), updatedAt:new Date() },
  { id:"8", sellerId:"s3", seller: mkSeller("s3","Duka la Nyumbani","Kinondoni"), name:"Godoro la Povu 6×6", description:"", price:180000, compareAtPrice:220000, category:"home",    images:["https://picsum.photos/seed/mattress1/400/400"],stock:10, tags:[], rating:4.4, reviewCount:45,  sold:32,  active:true, createdAt:new Date(), updatedAt:new Date() },
];

function ShopContent() {
  const params        = useSearchParams();
  const [cat, setCat] = useState(params.get("category") || "");
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const filtered = DEMO
    .filter((p) => !cat    || p.category === cat)
    .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "price-asc")  return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating")     return b.rating - a.rating;
      if (sort === "popular")    return b.sold - a.sold;
      return 0;
    });

  const activeCat = PRODUCT_CATEGORIES.find((c) => c.slug === cat);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartCount={cartCount} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-7">

          {/* ── Sidebar ───────────────────────────────── */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 px-1">Aina</p>
                <button
                  onClick={() => setCat("")}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-0.5 ${!cat ? "bg-brand-900 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  Zote
                </button>
                {PRODUCT_CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCat(c.slug)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-0.5 ${cat === c.slug ? "bg-brand-900 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <span>{c.icon}</span>{c.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Main ──────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Top bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              {/* Search */}
              <div className="flex-1 max-w-sm">
                <div className="flex items-center rounded-xl border-2 border-gray-200 bg-white focus-within:border-brand-700 transition-colors overflow-hidden">
                  <Search className="h-4 w-4 text-gray-400 ml-3 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Tafuta bidhaa..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Active filter pill */}
                {activeCat && (
                  <span className="flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1.5 text-xs font-semibold text-brand-800">
                    {activeCat.icon} {activeCat.name}
                    <button onClick={() => setCat("")}><X className="h-3 w-3" /></button>
                  </span>
                )}

                {/* Sort */}
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-xl border-2 border-gray-200 bg-white px-3 py-2.5 text-sm font-medium outline-none focus:border-brand-700 transition-colors cursor-pointer"
                >
                  <option value="newest">Mpya Zaidi</option>
                  <option value="popular">Maarufu</option>
                  <option value="rating">Rating ya Juu</option>
                  <option value="price-asc">Bei: Chini → Juu</option>
                  <option value="price-desc">Bei: Juu → Chini</option>
                </select>
              </div>
            </div>

            {/* Results count */}
            <p className="text-sm text-gray-500 mb-4">
              {filtered.length} bidhaa {activeCat ? `za ${activeCat.name}` : ""}
            </p>

            {/* Grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} onAddToCart={() => setCartCount((c) => c + 1)} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-lg font-bold text-gray-700">Hakuna bidhaa</p>
                <p className="text-sm text-gray-400 mt-1 mb-6">Jaribu aina nyingine au tafuta tena</p>
                <Button variant="outline" onClick={() => { setCat(""); setSearch(""); }}>
                  Ondoa Chujio
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">🛍️</div>
          <p className="text-gray-500 text-sm">Inapakia bidhaa...</p>
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
