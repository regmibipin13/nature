import { Footer } from "@/components/shared/footer";
import Header from "@/components/shared/header";
import prisma from "@/lib/db";
import type { Metadata } from "next";
import { CategoryProductClient } from "./client";

export const revalidate = 0;
export const dynamic = "force-dynamic";

async function getCategoryWithProducts(category_slug: string) {
  return prisma.category.findUnique({
    where: { slug: category_slug, active: true },
    include: {
      products: {
        where: { active: true },
        include: {
          category: {
            select: { id: true, name: true },
          },
          productImages: {
            select: { id: true, url: true, alt: true },
          },
        },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category_slug: string }>;
}): Promise<Metadata> {
  const { category_slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug: category_slug, active: true },
    select: {
      name: true,
      metaDescription: true,
      metaTitle: true,
      description: true,
    },
  });

  return {
    title: category
      ? category.metaTitle || `${category.name} | Nature and Nurtures`
      : "Category Not Found | Nature and Nurtures",
    description: category
      ? category.metaDescription ||
        category.description ||
        `Explore products under the ${category.name} category.`
      : "The category you're looking for is not available.",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ category_slug: string }>;
}) {
  const { category_slug } = await params;
  const data = await getCategoryWithProducts(category_slug);

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
        <p className="text-gray-600">
          The category you&apos;re looking for does not exist or is inactive.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <CategoryProductClient data={data} />
      <Footer />
    </div>
  );
}
