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
          src={row.original.imageUrl ?? ""}
          alt={row.getValue("name")}
          className="h-10 w-10"
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
          href={`/dashboard/categories/${row.original.id}`}
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
            <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
            <p className="text-gray-600">Manage and track your categories</p>
          </div>

          <Link
            href="/dashboard/categories/create"
            className="bg-black  text-white px-4 py-1 rounded-md flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Create Category
          </Link>
        </div>

        {/* Orders Table Section */}
        <Card>
          <Tabs defaultValue="all">
            <TabsContent value="all" className="p-4">
              <DynamicDataTable<any>
                supabase={supabaseClient}
                table="categories"
                select="*"
                columns={columns}
                searchableColumns={["name"]}
                filterDefs={[]}
                initialPagination={{ pageSize: 20 }}
                bulkActions={[
                  {
                    id: "featured",
                    label: "Set Featured",
                    field: "",
                    type: "select",
                    options: [
                      { label: "Feature", value: "true" },
                      { label: "Unfeature", value: "false" },
                    ],
                    onUpdate: async (selectedRows, value) => {
                      const ids = selectedRows.map((row) => row.id);
                      const res = await supabaseClient
                        .from("categories")
                        .update({ featured: value === "true" })
                        .in("id", ids);

                      if (res.error) {
                        toast.error("Failed to update featured status");
                        return;
                      }

                      toast.success("Featured status updated successfully");
                      router.refresh();
                    },
                  },
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
                        .from("categories")
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
                        name:
                          row.name +
                          " (Copy " +
                          Math.floor(Math.random() * 1000) +
                          ")",
                        description: row.description,
                        imageUrl: row.imageUrl,
                        active: row.active,
                      }));

                      const res = await supabaseClient
                        .from("categories")
                        .insert(rowsToDuplicate);

                      if (res.error) {
                        toast.error("Failed to duplicate categories");
                        return;
                      }

                      toast.success("Categories duplicated successfully");
                      router.refresh();
                    },
                  },
                  {
                    id: "delete",
                    label: "Delete",

                    options: [],
                    onUpdate: async (selectedRows) => {
                      const ids = selectedRows.map((row) => row.id);
                      const res = await supabaseClient
                        .from("categories")
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
