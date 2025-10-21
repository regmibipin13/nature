import prisma from "@/lib/db";
import { saveProduct } from "../action";
import { ProductForm } from "../form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CreateProductPage() {
  const categories = await prisma.category.findMany();
  const collections = await prisma.productCollection.findMany();

  return (
    <ProductForm
      categories={categories}
      collections={collections}
      SaveProduct={saveProduct}
    />
  );
}
