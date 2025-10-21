"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { TOSFormData } from "./schema";

export async function SaveTos(data: TOSFormData) {
  try {
    await prisma.pageContent.upsert({
      where: { pageType: "TOS" },
      update: { content: data as any },
      create: {
        pageType: "TOS",
        content: data as any,
      },
    });

    revalidatePath("/tos");
    revalidatePath("/dashboard/page-builder/tos");

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
