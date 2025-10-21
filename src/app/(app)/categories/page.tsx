import prisma from "@/lib/db";
import { CategoryProductClient } from "./client";

async function getCategories() {
  return prisma.category.findMany({
    where: { active: true },
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

export const revalidate = 0;
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Categories - Nature & Nurtures",
  description:
    "Explore our diverse range of product categories at Nature & Nurtures. From skincare to wellness, find everything you need to nurture your body and soul.",
};

export default async function Page() {
  const data = await getCategories();

  return <CategoryProductClient data={data} />;
}
