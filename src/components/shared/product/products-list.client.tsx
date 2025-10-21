"use client";

import { ProductCard } from "@/components/product-card";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category?: { name: string; id: string } | null;
  type?: string;
  slug: string;
}

interface ProductsListClientProps {
  initialProducts: Product[];
  hasMore: boolean;
}

export function ProductsListClient({
  initialProducts,
  hasMore: initialHasMore,
}: ProductsListClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(2);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/products?page=${page}&limit=10`);
      const data = await response.json();

      setProducts((prev) => [...prev, ...data.products]);
      setHasMore(data.hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Our Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
