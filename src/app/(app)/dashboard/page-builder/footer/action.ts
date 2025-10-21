"use server";

import prisma from "@/lib/db";
import { FooterFormData } from "./schema";

export async function saveFooter(data: FooterFormData) {
  try {
    await prisma.pageContent.upsert({
      where: { pageType: "footer" },
      create: {
        pageType: "footer",
        content: data,
      },
      update: {
        content: data,
      },
    });

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
