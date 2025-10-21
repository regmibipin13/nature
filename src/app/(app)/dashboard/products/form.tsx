"use client";

import { FileUpload } from "@/components/file-upload";
import { RichTextEditor } from "@/components/text-editor/text-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, ProductCollection } from "@prisma/client";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { ProductFormData, productSchema } from "./schema";

export function ProductForm({
  categories,
  collections,
  product,
  SaveProduct,
}: {
  categories: Category[];
  collections: ProductCollection[];
  product?: ProductFormData & { id?: string };
  SaveProduct: any;
}) {
  const router = useRouter();
  const params = useParams<{ product_id: string }>();
  const [collectionsOpen, setCollectionsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id: product?.id || undefined,
      featured: product?.featured || false,
      slug: product?.slug || "",
      name: product?.name || "",
      description: product?.description || "",
      about: product?.about || "",
      price: product?.price || 0,
      originalPrice: product?.originalPrice || undefined,
      sku: product?.sku || "",
      stockQuantity: product?.stockQuantity || 0,
      inStock: product?.inStock || false,
      active: product?.active ?? true,
      categoryId: product?.categoryId || "",
      collections: product?.collections?.map((c: any) => c.id) || [],
      images: product?.images || [],
      colors: product?.colors || [],
      sizes: product?.sizes || [],
      features: product?.features || [],
      specifications: product?.specifications || [],
      metaTitle: product?.metaTitle || "",
      metaDescription: product?.metaDescription || "",
      productImages: product?.productImages || [],
    },
  });

  const { control } = form;

  const colorsArray = useFieldArray({ control, name: "colors" });
  const sizesArray = useFieldArray({ control, name: "sizes" });
  const featuresArray = useFieldArray({ control, name: "features" });
  const specificationsArray = useFieldArray({
    control,
    name: "specifications",
  });

  const productImagesArray = useFieldArray({ control, name: "productImages" });

  const name = form.watch("name");
  const slug = form.watch("slug");

  console.log(form.formState.errors);

  useEffect(() => {
    if (name && !slug) {
      const generatedSlug = `${name
        .replace(/\s+/g, "-")
        .toLowerCase()}-${Math.floor(Math.random() * 1000)}`;
      form.setValue("slug", generatedSlug);
    }
  }, [name]);

  const onSubmit = async (values: ProductFormData) => {
    try {
      const payload = { ...values };
      // Remove empty productImages entries (those without a url)
      if (payload.productImages && Array.isArray(payload.productImages)) {
        payload.productImages = payload.productImages.filter(
          (p) => p && (p as any).url && (p as any).url.length > 0
        );
      }
      const result = await SaveProduct(payload, params.product_id);
      if (!result.ok) throw new Error("Failed to save product");

      if (params?.product_id) {
        toast.success("Product Updated Successfully");
      } else {
        toast.success("Product Created Successfully");
      }
      router.push("/dashboard/products");
    } catch (err) {
      toast.error(`Error submitting product: ${(err as Error).message}`);
      console.error("Error submitting product:", err);
    }
  };

  return (
    <Card className="w-full mx-auto rounded-none">
      <CardHeader>
        <CardTitle>
          {product?.id ? "Edit Product" : "Add New Product"}
        </CardTitle>
        <CardDescription>
          Fill in the essential details to {product?.id ? "update" : "create"} a
          product. All fields marked with * are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Slug </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center">
                              {category.imageUrl ? (
                                <img
                                  src={category.imageUrl}
                                  alt={category.name}
                                  width={24}
                                  height={24}
                                  className="w-6 h-6 mr-2 object-cover rounded-full"
                                />
                              ) : (
                                <div className="w-6 h-6 mr-2 bg-muted rounded-full" />
                              )}
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="collections"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collections</FormLabel>
                    <Popover
                      open={collectionsOpen}
                      onOpenChange={setCollectionsOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value?.length && "text-muted-foreground"
                            )}
                          >
                            {field.value?.length
                              ? `${field.value.length} collection(s) selected`
                              : "Select collections"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search collections..." />
                          <CommandEmpty>No collections found.</CommandEmpty>
                          <CommandGroup>
                            {collections.map((collection) => {
                              const isSelected = field.value?.some(
                                (c) => c === collection.id
                              );
                              return (
                                <CommandItem
                                  key={collection.id}
                                  onSelect={() => {
                                    const currentValue = field.value || [];
                                    if (isSelected) {
                                      field.onChange(
                                        currentValue.filter(
                                          (c) => c !== collection.id
                                        )
                                      );
                                    } else {
                                      field.onChange([
                                        ...currentValue,
                                        collection.id,
                                      ]);
                                    }
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      isSelected ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {collection.name}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {field.value?.length ? (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {field.value.map((collectionId) => {
                          const collection = collections.find(
                            (c) => c.id === (collectionId as unknown as string)
                          );

                          return (
                            <Badge
                              key={collectionId}
                              variant="secondary"
                              className="text-xs"
                            >
                              {collection?.name}
                              <button
                                type="button"
                                className="ml-2 text-muted-foreground hover:text-foreground"
                                onClick={() => {
                                  field.onChange(
                                    field.value?.filter(
                                      (id) => id !== collectionId
                                    )
                                  );
                                }}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          );
                        })}
                      </div>
                    ) : null}
                    <FormDescription>
                      Select one or more collections for this product
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  // <FormItem>
                  //   <FormLabel>Description *</FormLabel>
                  //   <FormControl>
                  //     <Textarea
                  //       placeholder="Describe your product..."
                  //       {...field}
                  //     />
                  //   </FormControl>
                  //   <FormDescription>
                  //     Provide a short description of your product
                  //   </FormDescription>
                  //   <FormMessage />
                  // </FormItem>
                  <FormItem className="flex-1 flex flex-col">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a short description of your product
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem className="flex-1 flex flex-col">
                    <FormLabel>About *</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a detailed description of your product
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Pricing</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={field.value ? field.value.toString() : ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                          onBlur={field.onBlur}
                          name={field.name}
                        />
                      </FormControl>
                      <FormDescription>Current selling price</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="originalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={field.value ? field.value.toString() : ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                          onBlur={field.onBlur}
                          name={field.name}
                        />
                      </FormControl>
                      <FormDescription>
                        Original price (if on sale)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Inventory */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Inventory</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU *</FormLabel>
                      <FormControl>
                        <Input placeholder="PROD-001" {...field} />
                      </FormControl>
                      <FormDescription>
                        Unique product identifier
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stockQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={field.value ? field.value.toString() : ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                          onBlur={field.onBlur}
                          name={field.name}
                        />
                      </FormControl>
                      <FormDescription>Available quantity</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="inStock"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">In Stock</FormLabel>
                      <FormDescription>
                        Is this product currently available for purchase?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <FormDescription>
                        Toggle whether the product is active (visible in
                        storefront)
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Is Featured</FormLabel>
                      <FormDescription>
                        Should this product be featured on the homepage?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Structured Product Images (with alt text) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  Product Images (with alt text)
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    productImagesArray.append({ url: "", alt: "" })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              </div>

              {productImagesArray.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-4 items-center p-4 border rounded-lg"
                >
                  <FormField
                    control={form.control}
                    name={`productImages.${index}.url`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <FileUpload
                            control={form.control}
                            name={`productImages.${index}.url`}
                            bucketName="ecom"
                            value={field.value || ""}
                            type="single"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`productImages.${index}.alt`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Alt text (for accessibility)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => productImagesArray.remove(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Available Colors */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Available Colors</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    colorsArray.append({ name: "", hexColor: "#000000" })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Color
                </Button>
              </div>
              {colorsArray.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-4 items-center p-4 border rounded-lg"
                >
                  <FormField
                    control={form.control}
                    name={`colors.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Color name (e.g., Navy Blue)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`colors.${index}.hexColor`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <input
                            type="color"
                            {...field}
                            className="h-10 w-16 rounded border border-input"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => colorsArray.remove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Available Sizes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Available Sizes</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => sizesArray.append({ size: "" })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Size
                </Button>
              </div>
              {sizesArray.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-4 items-center p-4 border rounded-lg"
                >
                  <FormField
                    control={form.control}
                    name={`sizes.${index}.size`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Size (e.g., XL, 42, Large)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => sizesArray.remove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Product Features */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Product Features</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => featuresArray.append({ description: "" })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </div>
              {featuresArray.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-4 items-start p-4 border rounded-lg"
                >
                  <FormField
                    control={form.control}
                    name={`features.${index}.description`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="Feature description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => featuresArray.remove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Specifications */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Specifications</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    specificationsArray.append({ key: "", value: "" })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Specification
                </Button>
              </div>
              {specificationsArray.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-4 items-center p-4 border rounded-lg"
                >
                  <FormField
                    control={form.control}
                    name={`specifications.${index}.key`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Specification name (e.g., Weight)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`specifications.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Value (e.g., 2.5 kg)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => specificationsArray.remove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* SEO Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">SEO Specifications</h3>

              <FormField
                control={form.control}
                name="metaTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Title</FormLabel>
                    <FormControl>
                      <Input placeholder="SEO meta title" {...field} />
                    </FormControl>
                    <FormDescription>Title for search engines</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metaDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="SEO meta description" {...field} />
                    </FormControl>
                    <FormDescription>
                      Description for search engines (max 160 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? `${product?.id ? "Updating" : "Creating"} Product...`
                : `${product?.id ? "Update" : "Create"} Product`}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
