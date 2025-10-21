import { Footer } from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { ProductsListClient } from "@/components/shared/product/products-list.client";
import prisma from "@/lib/db";
import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 1;

// ✅ SEO Metadata
export const metadata: Metadata = {
  title: "Shop Products | Best Deals & Categories | Nature and Nurtures",
  description:
    "Browse our latest collection of active products. Find the best deals, top categories, and trending items updated daily.",
  keywords: [
    "online shop",
    "products",
    "categories",
    "best deals",
    "trending items",
    "buy online",
  ],
  openGraph: {
    title: "Shop Products | Best Deals & Categories | Nature and Nurtures",
    description:
      "Explore our wide range of active products with top categories and trending items.",
    siteName: "Nature and Nurtures",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Products | Best Deals & Categories",
    description:
      "Discover trending products and top categories from our online shop.",
  },
  alternates: {
    canonical: "https://yourdomain.com/products",
  },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search: string | undefined;
  }>;
}) {
  const search = (await searchParams).search;
  const initialProducts = await prisma.product.findMany({
    where: {
      active: true,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    take: 10,
    include: {
      category: {
        select: { name: true, id: true },
      },
      productImages: { select: { id: true, url: true, alt: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Filter out products without categories
  const filteredProducts = initialProducts.filter(
    (product) => product.category !== null
  );

  const totalProducts = await prisma.product.count({
    where: {
      active: true,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
  });

  const hasMore = filteredProducts.length === 10 && totalProducts > 10;

  if (totalProducts === 0) {
    return (
      <>
        <Header />
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          {search ? (
            <h2 className="text-2xl font-semibold mb-4">
              No Products Found for &quot;{search}&quot;
            </h2>
          ) : (
            <h2 className="text-2xl font-semibold mb-4">
              No Products Available
            </h2>
          )}
          <p className="text-gray-600">
            We couldn&apos;t find any products matching your search.
          </p>

          <Link href={"/"} className="mt-4 text-blue-500 hover:underline">
            Go Back to Home
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <ProductsListClient
        initialProducts={filteredProducts as any}
        hasMore={hasMore}
      />
      <Footer />
    </>
  );
}
