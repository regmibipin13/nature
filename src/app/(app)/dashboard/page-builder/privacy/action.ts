"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function SavePrivacy(data: any) {
  try {
    await prisma.pageContent.upsert({
      where: { pageType: "PRIVACY" },
      update: { content: data as any },
      create: {
        pageType: "PRIVACY",
        content: data as any,
      },
    });

    revalidatePath("/privacy");
    revalidatePath("/dashboard/page-builder/privacy");

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
