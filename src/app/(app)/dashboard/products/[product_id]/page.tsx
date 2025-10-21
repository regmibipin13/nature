import prisma from "@/lib/db";
import Link from "next/link";
import { handleDelete } from "../action";
import { ProductViewClient } from "./view";

export default async function ProductView({
  params,
}: {
  params: Promise<{ product_id: string }>;
}) {
  const param = await params;

  const product = await prisma.product.findUnique({
    where: { id: param.product_id },
    include: {
      colors: true,
      sizes: true,
      features: true,
      specifications: true,
      category: true,
      collections: true,
      productImages: true,
    },
  });

  if (!product) {
    return (
      <div className="container mx-auto max-w-5xl p-6">
        <h1 className="text-3xl font-bold">Product Not Found</h1>
        <p className="mt-4 text-muted-foreground">
          The product you are looking for does not exist.
        </p>
        <Link
          href="/dashboard/products"
          className="text-blue-500 hover:underline"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return <ProductViewClient handleDelete={handleDelete} product={product} />;
}
