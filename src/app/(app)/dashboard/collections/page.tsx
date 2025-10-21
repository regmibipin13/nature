"use client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import DynamicDataTable from "@/components/ui/data-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { supabaseClient } from "@/lib/supabase/client";
import type { ColumnDef } from "@tanstack/react-table";
import { ExternalLink, PlusCircle } from "lucide-react";
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
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      return (
        <img
          src={row.original.imageUrl || "/placeholder.png"}
          alt="Collection Image"
          className="rounded-md w-12 h-12 object-cover"
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <Link
          className="text-blue-600 hover:underline flex items-center"
          href={`/dashboard/collections/${row.original.id}`}
        >
          {row.getValue("name")}

          <ExternalLink className="inline-block ml-2 h-4 w-4" />
        </Link>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground w-60 block overflow-hidden text-ellipsis whitespace-nowrap">
          {row.getValue("description")}
        </span>
      );
    },
  },
  {
    accessorKey: "active",
    header: "Active",
    cell: ({ row }) => {
      const active = row.getValue("active") as boolean;
      return (
        <Badge className={active ? "bg-green-500" : "bg-red-500"}>
          {active ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as Date;
      return <span>{new Date(createdAt).toLocaleDateString()}</span>;
    },
  },
];

export default function Page() {
  const router = useRouter();
  return (
    <div className="bg-gray-50/50 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Product Collections
            </h1>
            <p className="text-gray-600">
              Manage and track your product collections
            </p>
          </div>

          <Link
            href="/dashboard/collections/create"
            className="bg-black  text-white px-4 py-1 rounded-md flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Create Collection
          </Link>
        </div>

        {/* Orders Table Section */}
        <Card>
          <Tabs defaultValue="all">
            <TabsContent value="all" className="p-4">
              <DynamicDataTable<any>
                supabase={supabaseClient}
                table="product_collections"
                select="*"
                columns={columns}
                searchableColumns={["name"]}
                filterDefs={[]}
                initialPagination={{ pageSize: 20 }}
                bulkActions={[
                  {
                    id: "active",
                    label: "Change Status",
                    field: "",
                    type: "select",
                    options: [
                      { label: "Active", value: "true" },
                      { label: "Inactive", value: "false" },
                    ],
                    onUpdate: async (selectedRows, value) => {
                      const ids = selectedRows.map((row) => row.id);
                      const res = await supabaseClient
                        .from("product_collections")
                        .update({ active: value === "true" })
                        .in("id", ids);

                      if (res.error) {
                        toast.error("Failed to update status");
                        return;
                      }

                      toast.success("Status updated successfully");
                      router.refresh();
                    },
                  },
                  {
                    id: "duplicate",
                    label: "Duplicate",
                    onUpdate: async (selectedRows) => {
                      const rowsToDuplicate = selectedRows.map((row) => ({
                        // name: row.name + " (Copy)",
                        // random Copy + random number to avoid unique constraint
                        name:
                          row.name +
                          " (Copy " +
                          Math.floor(Math.random() * 1000) +
                          ")",
                        description: row.description,
                        imageUrl: row.imageUrl,
                        active: row.active,
                        updatedAt: new Date(),
                      }));

                      const res = await supabaseClient
                        .from("product_collections")
                        .insert(rowsToDuplicate);

                      if (res.error) {
                        console.log(res.error);
                        toast.error("Failed to duplicate collections");
                        return;
                      }

                      toast.success("Collections duplicated successfully");
                      router.refresh();
                    },
                  },
                  {
                    id: "delete",
                    label: "Delete",
                    onUpdate: async (selectedRows) => {
                      const ids = selectedRows.map((row) => row.id);
                      const res = await supabaseClient
                        .from("product_collections")
                        .delete()
                        .in("id", ids);

                      if (res.error) {
                        toast.error("Failed to delete categories");
                        return;
                      }

                      toast.success("Categories deleted successfully");
                      router.refresh();
                    },
                  },
                ]}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
