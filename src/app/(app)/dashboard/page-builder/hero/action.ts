"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { HeroData } from "./schema";

export async function SaveHero(data: HeroData) {
  try {
    await prisma.pageContent.upsert({
      where: { pageType: "HERO" },
      update: { content: data as any },
      create: {
        pageType: "HERO",
        content: data as any,
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard/page-builder/hero");

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
