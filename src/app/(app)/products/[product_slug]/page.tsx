"use server";

import { Footer } from "@/components/shared/footer";
import Header from "@/components/shared/header/index";
import prisma from "@/lib/db";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPage } from "./client";

async function getProduct(product_slug: string) {
  return prisma.product.findUnique({
    where: { slug: product_slug, active: true },
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
      sizes: true,
      colors: true,
      features: { select: { description: true } },
      specifications: true,
      productImages: { select: { id: true, url: true, alt: true } },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ product_slug: string }>;
}): Promise<Metadata> {
  const { product_slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug: product_slug, active: true },
    include: {
      category: { select: { name: true } },
    },
  });

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.description,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ product_slug: string }>;
}) {
  const { product_slug } = await params;
  const product = await getProduct(product_slug);
  if (!product) return notFound();

  return (
    <>
      <Header />
      <ProductPage product={product} />
      <Footer />
    </>
  );
}
