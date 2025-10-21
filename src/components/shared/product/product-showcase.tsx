import prisma from "@/lib/db";
import { ProductShowcaseClient } from "./product-showcase.client";

export async function ProductShowcase() {
  const products = await prisma.product.findMany({
    where: { active: true },
    take: 6,
    orderBy: { createdAt: "desc" },
    include: {
      category: {
        select: { name: true, id: true },
      },
      productImages: { select: { url: true, alt: true } },
    },
  });
  return <ProductShowcaseClient products={products} />;
}
