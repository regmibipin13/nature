"use client";

import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import z from "zod";
import { DataTable } from "../data-table";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const bestSellingColumns: ColumnDef<TableRow>[] = [
  { accessorKey: "header", header: "Product" },
  { accessorKey: "limit", header: "Qty" },
  { accessorKey: "target", header: "Sales" },
];

export const dataTableSchema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
});
type TableRow = z.infer<typeof dataTableSchema>;

function getBgColor(status: string) {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-600";
    case "Pending":
      return "bg-yellow-100 text-yellow-600";
    case "Cancelled":
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-500";
  }
}

const recentOrdersColumns: ColumnDef<TableRow>[] = [
  { accessorKey: "header", header: "Order" },
  { accessorKey: "type", header: "Product" },
  {
    accessorKey: "target",
    header: "Amount",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge className={cn(getBgColor(row.getValue("status")))}>
        {row.getValue("status")}
      </Badge>
    ),
  },
  { accessorKey: "reviewer", header: "Avatar" },
];

interface DashboardData {
  recentOrders: Array<{
    id: string;
    customer: string;
    product: string;
    amount: string;
    status: string;
    avatar: string;
  }>;
  bestSellingProducts: Array<{
    name: string;
    sales: string;
    quantity: number;
    image: string;
  }>;
}

export function OrdersAndProductsTable({ data }: { data: DashboardData }) {
  const recentOrdersTable = data.recentOrders.map((o: any, i: number) => ({
    id: i + 1,
    header: `${o.customer} — ${o.product}`,
    type: o.product,
    status: o.status,
    target: o.amount,
    limit: "-",
    reviewer: o.avatar || "",
  }));

  const bestSellingTable = data.bestSellingProducts.map(
    (p: any, i: number) => ({
      id: data.recentOrders.length + i + 1,
      header: p.name,
      type: p.image,
      status: "Available",
      target: p.sales,
      limit: String(p.quantity),
      reviewer: "",
    })
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Orders</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable data={recentOrdersTable} columns={recentOrdersColumns} />
          <p className="text-xs text-gray-500 mt-4">
            Showing 1 to {recentOrdersTable.length} of{" "}
            {recentOrdersTable.length} results
          </p>
        </CardContent>
      </Card>

      {/* Best Selling Products */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Best Selling Products</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable data={bestSellingTable} columns={bestSellingColumns} />
          <p className="text-xs text-gray-500 mt-4">
            Showing 1 to {bestSellingTable.length} of {bestSellingTable.length}{" "}
            results
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
