"use server";

import prisma from "@/lib/db";
import { ContactPageForm } from "./schema";

export async function saveContact(data: ContactPageForm) {
  try {
    await prisma.pageContent.upsert({
      where: { pageType: "CONTACT" },
      create: {
        pageType: "CONTACT",
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
