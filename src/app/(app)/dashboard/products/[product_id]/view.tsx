"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAlertDialog } from "@/hooks/alert-dialog/use-alert-dialog";
import { Pencil, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function ProductViewClient({
  product,
  handleDelete,
}: {
  product: any;
  handleDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
}) {
  const { openDialog } = useAlertDialog();

  const router = useRouter();

  return (
    <div className="max-w-5xl mx-auto p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          {/* Category */}
          {product.category && (
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                {product.category.name}
              </Badge>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/products/${product.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Link>
          </Button>
          <Button
            onClick={() =>
              openDialog({
                title: `Delete ${product.name}?`,
                description: "Deleting this product is irreversible. ",
                onConfirm: async () => {
                  const deleted = await handleDelete(product.id);
                  if (deleted.success) {
                    toast.success("Product deleted");
                    router.push("/dashboard/products");
                  } else {
                    toast.error(deleted.error || "Error deleting product");
                  }
                },
              })
            }
            className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
            size={"sm"}
            aria-label="Delete product"
          >
            Delete <TrashIcon size={18} className="text-red-600" />
          </Button>
        </div>
      </div>

      {/* Collections */}
      {product.collections && product.collections.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Collections:</h3>
          <div className="flex flex-wrap gap-2">
            {product.collections.map((collection: any) => (
              <Badge key={collection.id} variant="outline">
                {collection.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Images */}
        <Card>
          <CardContent className="p-4">
            {product.productImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {product.productImages.map((img: any, idx: number) => (
                  <img
                    key={idx}
                    src={img.url}
                    alt={img.alt || `Product image ${idx + 1}`}
                    width={300}
                    height={300}
                    className="rounded-lg object-cover w-full h-48"
                  />
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground text-sm">
                No images available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Details */}
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-lg font-semibold">
                ${product.price.toFixed(2)}
              </p>
              {product.originalPrice && (
                <p className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </p>
              )}
              {product.discount ? (
                <Badge variant="secondary">{product.discount}% off</Badge>
              ) : null}
            </div>
            <p className="text-sm">{product.description}</p>
            <Separator />
            <p className="text-sm">
              <span className="font-medium">SKU:</span> {product.sku}
            </p>
            <p className="text-sm">
              <span className="font-medium">Stock:</span>{" "}
              {product.inStock
                ? `${product.stockQuantity} available`
                : "Out of stock"}
            </p>
            <Separator />

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-1">
                <p className="font-medium">Colors:</p>
                <div className="flex gap-2">
                  {product.colors.map((c: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-1">
                      <span
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: c.hexColor }}
                      />
                      <span className="text-xs">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-1">
                <p className="font-medium">Sizes:</p>
                <div className="flex gap-2">
                  {product.sizes.map((s: any, idx: number) => (
                    <Badge key={idx} variant="outline">
                      {s.size}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      {product.features && product.features.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {product.features.map((f: any, idx: number) => (
                <li key={idx}>{f.description}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Specifications */}
      {product.specifications && product.specifications.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {product.specifications.map((spec: any, idx: number) => (
                <div key={idx} className="flex justify-between">
                  <dt className="font-medium">{spec.key}</dt>
                  <dd className="text-muted-foreground">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
