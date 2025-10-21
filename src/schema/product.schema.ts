import { z } from "zod";

// Zod schemas for the auxiliary models
// ------------------------------------
export const ProductImageSchema = z.object({
  id: z.string().cuid(),
  url: z.string().url(),
  alt: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
  productId: z.string(),
});

export const ProductColorSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  hexColor: z.string(),
  sortOrder: z.number().int().default(0),
  productId: z.string(),
});

export const ProductSizeSchema = z.object({
  id: z.string().cuid(),
  size: z.string(),
  sortOrder: z.number().int().default(0),
  productId: z.string(),
});

export const ProductFeatureSchema = z.object({
  id: z.string().cuid(),
  title: z.string(),
  description: z.string(),
  icon: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
  productId: z.string(),
});

export const ProductSpecificationSchema = z.object({
  id: z.string().cuid(),
  key: z.string(),
  value: z.string(),
  sortOrder: z.number().int().default(0),
  productId: z.string(),
});

export const CategorySchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  description: z.string().optional().nullable(),
  createdAt: z.string().datetime(),
});

export const TagSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
});

// Zod schemas for the many-to-many junction tables
// ------------------------------------------------
export const ProductCategorySchema = z.object({
  id: z.string().cuid(),
  productId: z.string(),
  categoryId: z.string(),
});

export const ProductTagSchema = z.object({
  id: z.string().cuid(),
  productId: z.string(),
  tagId: z.string(),
});

// The main Product schema with relations
// --------------------------------------
export const ProductSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  slug: z.string().optional().nullable(),
  category: z.string(),
  type: z.string().optional().nullable(),

  // Pricing
  price: z.string(), // Mapped from Prisma Decimal
  originalPrice: z.string().optional().nullable(), // Mapped from Prisma Decimal
  discount: z.number().int().optional().nullable().default(0),

  // Description and content
  description: z.string(),
  aboutProduct: z.array(z.string()),

  // SEO and metadata
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),

  // Product details
  sku: z.string(),
  inStock: z.boolean().default(true),
  stockQuantity: z.number().int().optional().nullable().default(0),

  // Timestamps
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),

  // Relations (represented as arrays of the related schemas)
  images: z.array(ProductImageSchema).optional(),
  colors: z.array(ProductColorSchema).optional(),
  sizes: z.array(ProductSizeSchema).optional(),
  categories: z.array(ProductCategorySchema).optional(),
  tags: z.array(ProductTagSchema).optional(),
  features: z.array(ProductFeatureSchema).optional(),
  specifications: z.array(ProductSpecificationSchema).optional(),
  // Note: Review, CartItem, and OrderItem schemas are not defined here
  // as their Prisma models were not provided in the prompt.
});

// You can create sub-schemas for specific use cases (e.g., creation or updates)
// For example, a schema for creating a new product that doesn't include `id`, `createdAt`, `updatedAt`, or relations
export const ProductCreateSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  images: true,
  colors: true,
  sizes: true,
  categories: true,
  tags: true,
  features: true,
  specifications: true,
  // Omit other relation fields as needed
});
