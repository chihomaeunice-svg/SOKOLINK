"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [wishlisted,  setWishlisted]  = useState(false);
  const [justAdded,   setJustAdded]   = useState(false);

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <Link href={`/shop/${product.id}`} className="group block">
      <div className="hover-lift rounded-2xl border border-gray-100 bg-white overflow-hidden flex flex-col">

        {/* Image */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-5xl text-gray-300">🛍️</div>
          )}

          {/* Top-left badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="rounded-lg bg-red-500 px-2 py-0.5 text-xs font-bold text-white shadow-sm">
                -{discount}%
              </span>
            )}
            {product.stock > 0 && product.stock < 5 && (
              <span className="rounded-lg bg-amber-500 px-2 py-0.5 text-xs font-bold text-white shadow-sm">
                Imebaki {product.stock}
              </span>
            )}
            {product.stock === 0 && (
              <span className="rounded-lg bg-gray-400 px-2 py-0.5 text-xs font-bold text-white">
                Imeisha
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWishlisted(!wishlisted); }}
            className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
          >
            <Heart className={`h-4 w-4 transition-colors ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
          </button>
        </div>

        {/* Info */}
        <div className="p-3 flex flex-col flex-1">
          {product.seller && (
            <p className="text-[11px] text-gray-400 font-medium truncate mb-0.5">{product.seller.storeName}</p>
          )}

          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug mb-2">
            {product.name}
          </h3>

          {/* Stars */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className={`h-3 w-3 ${s <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-200"}`} />
              ))}
            </div>
            <span className="text-[11px] text-gray-400 ml-0.5">({product.reviewCount})</span>
          </div>

          {/* Price + Cart */}
          <div className="mt-auto flex items-end justify-between gap-2">
            <div>
              <p className="text-base font-extrabold text-brand-900 leading-none">
                {formatCurrency(product.price)}
              </p>
              {product.compareAtPrice && (
                <p className="text-xs text-gray-400 line-through mt-0.5">
                  {formatCurrency(product.compareAtPrice)}
                </p>
              )}
            </div>

            <button
              onClick={handleCart}
              disabled={product.stock === 0}
              className={`flex-shrink-0 h-9 w-9 rounded-xl flex items-center justify-center text-white font-bold text-sm transition-all duration-200 shadow-sm ${
                justAdded
                  ? "bg-green-500 scale-95"
                  : product.stock === 0
                    ? "bg-gray-200 cursor-not-allowed"
                    : "brand-gradient hover:opacity-90 hover:scale-105"
              }`}
            >
              {justAdded ? "✓" : <ShoppingCart className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
