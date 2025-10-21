"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { InfoData } from "./schema";

export async function SaveInfo(data: InfoData) {
  try {
    await prisma.pageContent.upsert({
      where: { pageType: "INFO" },
      update: { content: data as any },
      create: {
        pageType: "INFO",
        content: data as any,
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard/page-builder/info");

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
