// app/(dashboard)/contacts/page.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import DynamicDataTable from "@/components/ui/data-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { supabaseClient } from "@/lib/supabase/client";
import type { ColumnDef } from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function statusToColor(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "CONFIRMED":
      return "bg-blue-100 text-blue-800";
    case "PROCESSING":
      return "bg-purple-100 text-purple-800";
    case "SHIPPED":
      return "bg-orange-100 text-orange-800";
    case "DELIVERED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    case "REFUNDED":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

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
    accessorKey: "id",
    header: "Order Id",
    cell: ({ row }) => (
      <Link
        className="text-blue-600 hover:underline"
        href={`/dashboard/orders/${row.getValue("id")}`}
      >
        # {row.getValue("id")}
      </Link>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: (info) =>
      new Date(info.getValue() as string).toLocaleDateString("en-US", {
        timeZone: "America/Los_Angeles",
      }),
  },

  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col ">
          <p className="font-semibold">{row.original.customerName}</p>
          <p className="text-gray-500">{row.original.customerEmail}</p>
        </div>
      );
    },
  },
  {
    header: "Address",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col ">
          <p className="font-semibold">{row.original.customerAddressLine1}</p>
          <p className="text-gray-500">
            {row.original.customerAddressLine2}
            {", "}
            <span className="text-gray-500">{row.original.customerCity}</span>
          </p>
        </div>
      );
    },
  },

  {
    accessorKey: "deliveryStatus",
    header: "Delivery Status",
    // cell: ({ row }) => <Badge>{row.getValue("deliveryStatus")}</Badge>,
    cell: ({ row }) => {
      const status = row.getValue("deliveryStatus") as string;
      const colorClass = statusToColor(status);
      return (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}
        >
          {status}
        </span>
      );
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
            <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
            <p className="text-gray-600">Manage and track your orders</p>
          </div>

          <Link href="/dashboard/orders/create">
            <Button>
              <PlusCircle className="h-4 w-4" />
              Create Order
            </Button>
          </Link>
        </div>

        {/* Orders Table Section */}
        <Card>
          <Tabs defaultValue="all">
            <TabsContent value="all" className="p-4">
              <DynamicDataTable<any>
                supabase={supabaseClient}
                table="orders"
                select="*"
                columns={columns}
                defaultSortBy={{ id: "createdAt", desc: true }}
                searchableColumns={["customerName", "customerEmail"]}
                filterDefs={[
                  {
                    id: "id",
                    type: "text",
                    title: "Order Id",
                    operator: "eq",
                  },
                  {
                    id: "deliveryStatus",
                    type: "select",

                    title: "Delivery Status",
                    options: [
                      { label: "PROCESSING", value: "PROCESSING" },
                      { label: "COMPLETED", value: "COMPLETED" },
                      { label: "CANCELLED", value: "CANCELLED" },
                      { label: "PENDING", value: "PENDING" },
                    ],
                  },
                ]}
                bulkActions={[
                  {
                    id: "active",
                    label: "Change Status",
                    field: "",
                    type: "select",
                    options: [
                      { label: "PENDING", value: "PENDING" },
                      { label: "CONFIRMED", value: "CONFIRMED" },
                      { label: "PROCESSING", value: "PROCESSING" },
                      { label: "SHIPPED", value: "SHIPPED" },
                      { label: "DELIVERED", value: "DELIVERED" },
                      { label: "CANCELLED", value: "CANCELLED" },
                      { label: "REFUNDED", value: "REFUNDED" },
                    ],
                    onUpdate: async (selectedRows, value) => {
                      const ids = selectedRows.map((row) => row.id);
                      const res = await supabaseClient
                        .from("orders")
                        .update({ deliveryStatus: value })
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
                    field: "",
                    onUpdate: async (selectedRows) => {
                      const ids = selectedRows.map((row) => row.id);
                      const res = await supabaseClient
                        .from("orders")
                        .delete()
                        .in("id", ids);

                      if (res.error) {
                        toast.error("Failed to delete orders");
                        return;
                      }

                      toast.success("Orders deleted successfully");
                      router.refresh();
                    },
                  },
                ]}
                initialPagination={{ pageSize: 20 }}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
