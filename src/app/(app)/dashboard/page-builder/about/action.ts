"use server";

import prisma from "@/lib/db";
import { AboutFormData } from "./schema";

export async function SaveAbout(data: AboutFormData) {
  try {
    await prisma.pageContent.upsert({
      where: { pageType: "ABOUT" },
      update: { content: data },
      create: { pageType: "ABOUT", content: data },
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
