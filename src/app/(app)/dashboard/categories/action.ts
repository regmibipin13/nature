"use server";

import prisma from "@/lib/db";
import { CategoryFormValues } from "./schema";

export async function saveCategory(data: CategoryFormValues) {
  try {
    if (data.id) {
      await prisma.category.update({
        where: { id: data.id },
        data: {
          name: data.name,
          description: data.description,
          imageUrl: data.imageUrl,
          slug: data.slug,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          active: data.active || false,
          featured: data.featured || false,
        },
      });
      return { success: true, message: "Category updated successfully" };
    } else {
      await prisma.category.create({
        data: {
          name: data.name,
          description: data.description,
          imageUrl: data.imageUrl,
          slug: data.slug,
          active: data.active || false,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          featured: data.featured || false,
        },
      });
      return { success: true, message: "Category created successfully" };
    }
  } catch (error) {
    console.error("Error updating category:", error);
    return {
      success: false,
      message: `Failed to update category: ${(error as Error).message}`,
    };
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    });
    return { success: true, message: "Category deleted successfully" };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, message: "Failed to delete category" };
  }
}

export async function removeProductFromCategory(
  categoryId: string,
  productId: string
) {
  try {
    await prisma.category.update({
      where: { id: categoryId },
      data: {
        products: {
          disconnect: { id: productId },
        },
      },
    });
    return {
      success: true,
      message: "Product removed from category successfully",
    };
  } catch (error) {
    console.error("Error removing product from category:", error);
    return {
      success: false,
      message: "Failed to remove product from category",
    };
  }
}
