"use server";

import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { saveCollection } from "../../action";
import { CollectionForm } from "../../form";

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ collection_id: string }>;
}) {
  const param = await params;
  const collection = await prisma.productCollection.findUnique({
    where: {
      id: param.collection_id,
    },
  });

  if (!collection) {
    notFound();
  }

  return (
    <div>
      <CollectionForm
        defaultValues={collection as any}
        onSubmit={saveCollection}
      />
    </div>
  );
}
