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
    accessorKey: "title",
    header: "Post Title",
    cell: (info) => (
      <Link
        href={`/dashboard/blogs/edit/${info.row.original.id}`}
        className="font-medium text-blue-600 hover:underline flex items-center"
      >
        {info.getValue<string>()}

        <ExternalLink className="inline-block ml-1 h-4 w-4" />
      </Link>
    ),
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => (
      <Badge className="capitalize">{info.getValue<string>()}</Badge>
    ),
  },
  {
    accessorKey: "categories",
    header: "Category",
    cell: (info) => (
      <div className="">
        {info
          .getValue<string[]>()
          .map((category) => category)
          .join(", ")}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: (info) => (
      <div className="">
        {new Date(info.getValue<string>()).toLocaleDateString()}
      </div>
    ),
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
            <h1 className="text-2xl font-semibold text-gray-900">Blogs</h1>
            <p className="text-gray-600">Manage and track your blog posts</p>
          </div>

          <Link
            href="/dashboard/blogs/create"
            className="bg-black  text-white px-4 py-1 rounded-md flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Create Blogs
          </Link>
        </div>

        {/* Orders Table Section */}
        <Card>
          <Tabs defaultValue="all">
            <TabsContent value="all" className="p-4">
              <DynamicDataTable<any>
                supabase={supabaseClient}
                table="Blog"
                select="*"
                columns={columns}
                searchableColumns={["name"]}
                filterDefs={[
                  {
                    id: "status",
                    title: "Filter By Status",
                    options: [
                      { label: "Draft", value: "draft" },
                      { label: "Published", value: "published" },
                    ],
                    type: "select",
                  },
                ]}
                initialPagination={{ pageSize: 20 }}
                bulkActions={[
                  {
                    id: "active",
                    label: "Change Status",
                    field: "",
                    type: "select",
                    options: [
                      { label: "Draft", value: "draft" },
                      { label: "Published", value: "published" },
                    ],
                    onUpdate: async (selectedRows, value) => {
                      const ids = selectedRows.map((row) => row.id);
                      const res = await supabaseClient
                        .from("Blog")
                        .update({ status: value })
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
                    id: "delete",
                    label: "Delete",
                    onUpdate: async (selectedRows) => {
                      const ids = selectedRows.map((row) => row.id);
                      const res = await supabaseClient
                        .from("Blog")
                        .delete()
                        .in("id", ids);

                      if (res.error) {
                        toast.error("Failed to delete blogs");
                        return;
                      }

                      toast.success("Blog deleted successfully");
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
