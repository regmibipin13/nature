"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function SaveFAQ(data: any) {
  try {
    await prisma.pageContent.upsert({
      where: { pageType: "FAQ" },
      update: { content: data as any },
      create: {
        pageType: "FAQ",
        content: data as any,
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard/page-builder/faq");

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
    };
  }
}
