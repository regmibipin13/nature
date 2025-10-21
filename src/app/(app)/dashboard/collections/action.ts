"use server";

import prisma from "@/lib/db";
import { CollectionFormValues } from "./schema";

export async function saveCollection(data: CollectionFormValues) {
  try {
    if (data.id) {
      await prisma.productCollection.update({
        where: { id: data.id },
        data: {
          name: data.name,
          description: data.description,
          imageUrl: data.imageUrl,
          slug: data.slug,
          active: data.active || false,
          featured: data.featured || false,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
        },
      });
      return { success: true, message: "Collection updated successfully" };
    } else {
      await prisma.productCollection.create({
        data: {
          name: data.name,
          description: data.description,
          imageUrl: data.imageUrl,
          slug: data.slug,
          active: data.active || false,
          featured: data.featured || false,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
        },
      });
      return { success: true, message: "Collection created successfully" };
    }
  } catch (error) {
    console.error("Error updating collection:", error);
    return {
      success: false,
      message: `Failed to update collection: ${(error as Error).message}`,
    };
  }
}

export async function deleteCollection(id: string) {
  try {
    await prisma.productCollection.delete({
      where: { id },
    });
    return { success: true, message: "Collection deleted successfully" };
  } catch (error) {
    console.error("Error deleting collection:", error);
    return { success: false, message: "Failed to delete collection" };
  }
}

export async function removeProductFromCollection(
  collectionId: string,
  productId: string
) {
  try {
    await prisma.productCollection.update({
      where: { id: collectionId },
      data: {
        products: {
          disconnect: { id: productId },
        },
      },
    });
    return { success: true, message: "Product removed from collection" };
  } catch (error) {
    console.error("Error removing product from collection:", error);
    return {
      success: false,
      message: "Failed to remove product from collection",
    };
  }
}
