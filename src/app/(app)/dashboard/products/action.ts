"use server";

import prisma from "@/lib/db";
import { stripeServer } from "@/lib/stripe/stripe-server";
import { ProductFormData } from "./schema";

export async function saveProduct(data: ProductFormData) {
  if (!stripeServer) {
    throw new Error("Stripe not initialized");
  }

  try {
    if (data.id) {
      const existing = await prisma.product.findUnique({
        where: { id: data.id },
      });
      if (!existing) {
        throw new Error("Product not found");
      }

      let stripeProductId = existing.stripeProductId;
      let stripePriceId = existing.stripePriceId;

      if (!stripeProductId) {
        const stripeProduct = await stripeServer.products.create({
          name: data.name,
          description: data.description || "",
          images: data.images,
          metadata: { sku: data.sku },
        });

        const stripePrice = await stripeServer.prices.create({
          unit_amount: Math.round(data.price * 100),
          currency: "usd",
          product: stripeProduct.id,
        });

        stripeProductId = stripeProduct.id;
        stripePriceId = stripePrice.id;
      } else {
        // Update Stripe product
        await stripeServer.products.update(stripeProductId, {
          name: data.name,
          description: data.description || "",
          images: data.images,
        });

        // Deactivate old price if exists
        if (stripePriceId) {
          await stripeServer.prices.update(stripePriceId, { active: false });
        }

        // Create new price
        const stripePrice = await stripeServer.prices.create({
          unit_amount: Math.round(data.price * 100),
          currency: "usd",
          product: stripeProductId,
        });

        stripePriceId = stripePrice.id;
      }

      // ✅ Update DB product
      const updatedProduct = await prisma.product.update({
        where: { id: data.id },
        data: {
          name: data.name,
          metaTitle: data.metaTitle,
          category: { connect: { id: data.categoryId } },
          collections:
            data.collections && data.collections.length > 0
              ? {
                  set: data.collections.map((collection) => ({
                    id: collection,
                  })),
                }
              : { set: [] },

          slug: data.slug,
          images: data.images,
          description: data.description,
          about: data.about,
          active: data.active,
          sku: data.sku,
          stockQuantity: data.stockQuantity,
          price: data.price,
          featured: data.featured,
          metaDescription: data.metaDescription,

          originalPrice: data.originalPrice,
          discount: data.originalPrice
            ? Math.round(
                ((data.originalPrice - data.price) / data.originalPrice) * 100
              )
            : 0,
          inStock: data.inStock,

          ...(data.colors &&
            data.colors.length > 0 && {
              colors: {
                deleteMany: {},
                create: data.colors.map((color) => ({
                  name: color.name,
                  hexColor: color.hexColor,
                })),
              },
            }),

          ...(data.productImages &&
            data.productImages.length > 0 && {
              productImages: {
                deleteMany: {},
                create: data.productImages.map((img) => ({
                  url: img.url,
                  alt: img.alt,
                })),
              },
            }),

          ...(data.sizes &&
            data.sizes.length > 0 && {
              sizes: {
                deleteMany: {},
                create: data.sizes.map((size) => ({
                  size: size.size,
                })),
              },
            }),

          ...(data.features &&
            data.features.length > 0 && {
              features: {
                deleteMany: {},
                create: data.features.map((feature) => ({
                  title: feature.description,
                  description: feature.description,
                })),
              },
            }),

          ...(data.specifications &&
            data.specifications.length > 0 && {
              specifications: {
                deleteMany: {},
                create: data.specifications.map((spec) => ({
                  key: spec.key,
                  value: spec.value,
                })),
              },
            }),

          stripeProductId,
          stripePriceId,
        },
      });

      return { ok: true, product: updatedProduct };
    } else {
      // ✅ Create new product (with Stripe integration)
      const stripeProduct = await stripeServer.products.create({
        name: data.name,
        description: data.description || "",
        images: data.images,
        metadata: { sku: data.sku },
      });

      const stripePrice = await stripeServer.prices.create({
        unit_amount: Math.round(data.price * 100),
        currency: "usd",
        product: stripeProduct.id,
      });

      const newProduct = await prisma.product.create({
        data: {
          name: data.name,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          category: { connect: { id: data.categoryId } },
          collections:
            data.collections && data.collections.length > 0
              ? {
                  connect: data.collections.map((collection) => ({
                    id: collection,
                  })),
                }
              : undefined,
          slug: `${data.name.replace(/\s+/g, "-").toLowerCase()}-${data.sku}`,
          images: data.images,
          description: data.description,
          about: data.about,
          sku: data.sku,
          active: data.active,
          productImages: data.productImages
            ? {
                create: data.productImages.map((img) => ({
                  url: img.url,
                  alt: img.alt,
                })),
              }
            : undefined,

          stockQuantity: data.stockQuantity,
          price: data.price,
          featured: data.featured,
          originalPrice: data.originalPrice,
          discount: data.originalPrice
            ? Math.round(
                ((data.originalPrice - data.price) / data.originalPrice) * 100
              )
            : 0,
          inStock: data.inStock,

          ...(data.colors && {
            colors: {
              create: data.colors.map((color) => ({
                name: color.name,
                hexColor: color.hexColor,
              })),
            },
          }),
          ...(data.sizes && {
            sizes: {
              create: data.sizes.map((size) => ({
                size: size.size,
              })),
            },
          }),
          ...(data.features && {
            features: {
              create: data.features.map((feature) => ({
                title: feature.description,
                description: feature.description,
              })),
            },
          }),
          ...(data.specifications && {
            specifications: {
              create: data.specifications.map((spec) => ({
                key: spec.key,
                value: spec.value,
              })),
            },
          }),

          stripeProductId: stripeProduct.id,
          stripePriceId: stripePrice.id,
        },
      });

      return { ok: true, product: newProduct };
    }
  } catch (err) {
    console.error("saveProduct error:", err);
    return {
      success: false,
      error: "Failed to save product",
    };
  }
}

export const handleDelete = async (productId: string) => {
  try {
    await prisma.product.delete({
      where: { id: productId },
    });
    console.log("Product deleted:", productId);
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      error: "Failed to delete product",
    };
  }
};
