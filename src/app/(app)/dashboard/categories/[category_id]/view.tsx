"use client";

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
import DynamicDataTable from "@/components/ui/data-table";
import { useAlertDialog } from "@/hooks/alert-dialog/use-alert-dialog";
import { supabaseClient } from "@/lib/supabase/client";
import { formatCurrency, imageThumbnailUrl } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { TrashIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const columns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),

    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={`Select row ${row.id}`}
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center">
        {row.original.product_images?.[0] ? (
          <img
            src={
              imageThumbnailUrl(row.original.product_images[0].url) ||
              "/placeholder.png"
            }
            alt={row.original.product_images[0]?.alt}
            className="w-10 h-10 rounded-md mr-3 shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-md mr-3 bg-gray-200 flex items-center justify-center text-gray-500 shrink-0"></div>
        )}
        <Link
          href={`/dashboard/products/${row.original.id}`}
          className="ml-2 min-w-0 flex-1 flex items-center  group"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium max-w-xs text-blue-600 group-hover:underline">
              {row.original.name}
            </p>
            <span className="text-xs text-muted-foreground truncate block">
              {row.original.categories?.name}
            </span>
          </div>
        </Link>
      </div>
    ),
  },
  {
    accessorKey: "price",
    enableSorting: true,
    header: "Price",
    cell: ({ getValue }) => <div>{formatCurrency(getValue<number>())}</div>,
  },

  { accessorKey: "stockQuantity", header: "Stock" },
  { accessorKey: "sku", header: "SKU" },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue<boolean>();
      return status ? (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          Active
        </span>
      ) : (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
          Inactive
        </span>
      );
    },
  },
];

export function CategoryViewClient({
  category,
  handleDelete,
  categories,
}: {
  category: any;
  handleDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
  categories: any[];
}) {
  const { openDialog } = useAlertDialog();

  const router = useRouter();
  return (
    <div className="container mx-auto max-w-5xl p-6 space-y-8">
      {/* Header with Edit button */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{category.name}</h1>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/categories/${category.id}/edit`}>
            <Button>Edit Category</Button>
          </Link>

          <Button
            onClick={() =>
              openDialog({
                title: `Delete ${category.name}?`,
                description: "Deleting this category is irreversible. ",
                onConfirm: async () => {
                  const deleted = await handleDelete(category.id);
                  if (deleted.success) {
                    toast.success("Category deleted");
                    router.push("/dashboard/categories");
                  } else {
                    toast.error(deleted.error || "Error deleting category");
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

      {/* Category Info */}
      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
          {category.description && (
            <CardDescription>{category.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Image */}
          {category.imageUrl && (
            <div className="relative w-full ">
              <img
                src={category.imageUrl}
                alt={category.name}
                className="rounded-lg object-cover"
              />
            </div>
          )}

          {/* Info */}
          <div className="space-y-3">
            <p>
              <span className="font-medium">Slug:</span> {category.slug || "—"}
            </p>
            <p>
              <Badge
                className={
                  category.active
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {category.active ? "Active" : "Inactive"}
              </Badge>
            </p>
            {category.description && (
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Products */}
      <Card>
        <CardHeader>
          <CardTitle>Products in this Category</CardTitle>
          <CardDescription>
            {category.products?.length && category.products.length > 0
              ? `This category has ${category.products.length} product(s).`
              : "No products are assigned to this category."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <DynamicDataTable<any>
            supabase={supabaseClient}
            table="products"
            select="*, categories(name), product_images(url, alt)"
            columns={columns}
            searchableColumns={["name", "sku"]}
            filterDefs={[]}
            bulkActions={[
              {
                id: "disconnect",
                label: "Disconnect from Category",
                onUpdate: async (selectedRows, value) => {
                  const disconnectProducts = await supabaseClient
                    .from("products")
                    .update({ categoryId: null })
                    .in(
                      "id",
                      selectedRows.map((row) => row.id)
                    )
                    .select("*");

                  if (disconnectProducts.error) {
                    toast.error(disconnectProducts.error.message);
                    return;
                  }

                  toast.success(
                    `${disconnectProducts.data.length} product(s) disconnected from category`
                  );
                  router.refresh();
                  return;
                },
              },

              {
                id: "migrate",
                label: "Migrate to another Category",
                type: "select",
                options:
                  categories.map((cat) => ({
                    label: cat.name,
                    value: cat.id,
                  })) || [],
                onUpdate: async (selectedRows, value) => {
                  const migrateProducts = await supabaseClient
                    .from("products")
                    .update({ categoryId: value })
                    .in(
                      "id",
                      selectedRows.map((row) => row.id)
                    )
                    .select("*");

                  if (migrateProducts.error) {
                    toast.error(migrateProducts.error.message);
                    return;
                  }

                  toast.success(
                    `${migrateProducts.data.length} product(s) migrated to new category`
                  );
                  router.refresh();
                  return;
                },
              },
            ]}
            where={{ categoryId: category.id }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
