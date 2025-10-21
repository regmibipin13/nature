import prisma from "@/lib/db";
import Link from "next/link";
import { deleteCollection } from "../action";
import { CollectionViewClient } from "./view";

export const revalidate = 1;
export const metadata = {
  title: "Collection Details | Nature and Nurtures",
  description: "View details of the product collection.",
};

export default async function CategoryDisplayPage({
  params,
}: {
  params: Promise<{ collection_id: string }>;
}) {
  const collection = await prisma.productCollection.findUnique({
    where: { id: (await params).collection_id },
    include: {
      products: {
        include: {
          productImages: true,
        },
      },
    },
  });

  const collections = await prisma.productCollection.findMany();

  if (!collection) {
    return (
      <div className="container mx-auto max-w-5xl p-6">
        <h1 className="text-3xl font-bold">Collection Not Found</h1>
        <p className="mt-4 text-muted-foreground">
          The collection you are looking for does not exist.
        </p>
        <Link
          href="/dashboard/categories"
          className="text-blue-500 hover:underline"
        >
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <CollectionViewClient
      handleDelete={deleteCollection}
      collection={collection}
      collections={collections}
    />
  );
}
