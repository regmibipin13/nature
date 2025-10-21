import prisma from "@/lib/db";
import { saveProduct } from "../../action";
import { ProductForm } from "../../form";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default async function CreateProductPage({
  params,
}: {
  params: Promise<{ product_id: string }>;
}) {
  const param = await params;
  const product = await prisma.product.findUnique({
    where: { id: param.product_id },
    include: {
      collections: true,
      category: true,
      colors: true,
      features: true,
      sizes: true,
      specifications: true,
      productImages: true,
    },
  });

  if (!product) {
    return <div>Product not found</div>;
  }

  const categories = await prisma.category.findMany();
  const collections = await prisma.productCollection.findMany();

  return (
    <ProductForm
      categories={categories}
      collections={collections}
      SaveProduct={saveProduct}
      product={product as any}
    />
  );
}
