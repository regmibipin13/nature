"use server";

import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { saveCategory } from "../../action";
import { CategoryForm } from "../../form";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ category_id: string }>;
}) {
  const param = await params;
  const category = await prisma.category.findUnique({
    where: {
      id: param.category_id,
    },
  });

  console.log("Category:", category);
  if (!category) {
    notFound();
  }

  return (
    <div>
      <CategoryForm defaultValues={category as any} onSubmit={saveCategory} />
    </div>
  );
}
