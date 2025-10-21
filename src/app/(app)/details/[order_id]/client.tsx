"use client";

import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowLeft,
  Check,
  CheckCircle,
  Clock,
  Package,
  Truck,
} from "lucide-react";
import { useState } from "react";

const columns: ColumnDef<any>[] = [
  {
    accessorKey: "product.name",
    header: "Product",

    cell: ({ row }) => (
      <div className="flex items-center gap-3 w-60">
        <img
          src={row.original.product.images[0]}
          className="w-12 h-12 rounded-md object-cover bg-gray-100"
        />
        <span className="font-medium text-gray-900">
          {row.original.product.name}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => (
      <div className=" text-gray-600">{row.getValue("quantity")}</div>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <div className=" text-green-600 text-lg font-semibold">
        $ {row.original.unitPrice / 100}
      </div>
    ),
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => (
      <div className=" text-green-600 text-lg font-semibold">
        $ {row.original.totalPrice / 100}
      </div>
    ),
  },
];

const deliverySteps = [
  { id: "PENDING", label: "Pending", icon: Clock },
  { id: "CONFIRMED", label: "Confirmed", icon: Check },
  { id: "PROCESSING", label: "Processing", icon: Package },
  { id: "SHIPPED", label: "Shipped", icon: Truck },
  { id: "DELIVERED", label: "Delivered", icon: CheckCircle },
];

const statusColors = {
  PENDING: "bg-gray-100 text-gray-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-yellow-100 text-yellow-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-orange-100 text-orange-800",
};

export const OrderDetailsPublicClient = ({ data }: { data: any }) => {
  const [deliveryStatus] = useState(data.deliveryStatus || "PENDING");

  const currentStepIndex = deliverySteps.findIndex(
    (step) => step.id === deliveryStatus
  );
  const progressPercentage =
    currentStepIndex >= 0
      ? ((currentStepIndex + 1) / deliverySteps.length) * 100
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Order {data.id}
              </h1>
              <p className="text-sm text-gray-500">
                Placed on {new Date(data.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium text-gray-900">{data.customerName}</p>
                <p className="text-gray-600">{data.customerEmail}</p>
                <div>
                  <p className="text-gray-600">
                    {data.customerAddressLine1}, {data.customerAddressLine2},{" "}
                    {data.customerCity}, {data.customerPostalCode}
                    {data.customerCountry}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Message</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <span className="font-bold">Instructions:</span>{" "}
                  {data.deliveryInstructions}
                </div>
                <div>
                  <span className="font-bold">Landmark:</span> {data.landmark}
                </div>
                <div>
                  <span className="font-bold">Preferred Delivery Time:</span>{" "}
                  {data.preferredDeliveryTime}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Status */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Bar */}
                <div className="relative">
                  <div className="flex justify-between items-center mb-4">
                    {deliverySteps.map((step, index) => {
                      const Icon = step.icon;
                      const isCompleted = index <= currentStepIndex;
                      return (
                        <div
                          key={step.id}
                          className="flex flex-col items-center relative z-10"
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                              isCompleted
                                ? "bg-green-500 border-green-500 text-white"
                                : "bg-white border-gray-300 text-gray-400"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <span
                            className={`text-xs mt-2 font-medium ${
                              isCompleted ? "text-green-600" : "text-gray-500"
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Progress Line */}
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-0">
                    <div
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      statusColors[
                        deliveryStatus as keyof typeof statusColors
                      ] || "bg-gray-100 text-gray-800"
                    }
                  >
                    {deliveryStatus}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    Last updated:{" "}
                    {new Date(data.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={columns} data={data.items} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="text-lg font-semibold text-green-600">
                      ${data.amountSubtotal / 100}
                    </span>
                  </div>

                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${data.amountTotal / 100}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
