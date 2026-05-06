"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <Link href={`/shop/${product.id}`} className="group">
      <div className="card-hover relative flex flex-col rounded-xl border border-gray-200 bg-white overflow-hidden">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl">🛍️</div>
          )}

          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {discount > 0 && (
              <Badge variant="danger">-{discount}%</Badge>
            )}
            {product.stock < 5 && product.stock > 0 && (
              <Badge variant="warning">Imebaki {product.stock}</Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="muted">Imeisha</Badge>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setWishlisted(!wishlisted);
            }}
            className="absolute right-2 top-2 rounded-full bg-white p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart
              className={`h-4 w-4 ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`}
            />
          </button>
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col p-3">
          {/* Seller */}
          {product.seller && (
            <p className="mb-1 text-xs text-gray-400 truncate">{product.seller.storeName}</p>
          )}

          {/* Name */}
          <h3 className="mb-1 text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="mb-2 flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${
                    star <= Math.round(product.rating)
                      ? "fill-gold-400 text-gold-400"
                      : "text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400">({product.reviewCount})</span>
            {product.sold > 0 && (
              <span className="text-xs text-gray-400">· {product.sold} ziliuzwa</span>
            )}
          </div>

          {/* Price */}
          <div className="mt-auto flex items-center justify-between gap-2">
            <div>
              <p className="text-base font-bold text-brand-900">
                {formatCurrency(product.price)}
              </p>
              {product.compareAtPrice && (
                <p className="text-xs text-gray-400 line-through">
                  {formatCurrency(product.compareAtPrice)}
                </p>
              )}
            </div>

            <Button
              size="icon-sm"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={addedToCart ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {addedToCart ? "✓" : <ShoppingCart className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
