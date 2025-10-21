"use client";

import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/mult-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowLeft,
  Check,
  CheckCircle,
  Clock,
  Edit,
  Package,
  Truck,
} from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateOrderShipping, updateOrderStatus } from "./actions";

const columns: ColumnDef<any>[] = [
  {
    header: "Product",

    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3 w-60">
          <img
            src={
              row.original.product?.images?.length
                ? row.original.product.images[0]
                : "/placeholder-image.png"
            }
            className="w-12 h-12 rounded-md object-cover bg-gray-100"
          />
          <span className="font-medium text-gray-900">
            {row.original.product?.name}
          </span>
        </div>
      );
    },
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

export const OrderDetailsClient = ({ data }: { data: any }) => {
  const [deliveryStatus, setDeliveryStatus] = useState(
    data.deliveryStatus || "PENDING"
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(deliveryStatus);
  const [isPending, startTransition] = useTransition();
  const [carrier, setCarrier] = useState<string | null>(data.carrier || null);
  const [trackingNumber, setTrackingNumber] = useState<string | null>(
    data.trackingNumber || null
  );
  const [trackingUrl, setTrackingUrl] = useState<string | null>(
    data.trackingUrl || null
  );

  const currentStepIndex = deliverySteps.findIndex(
    (step) => step.id === deliveryStatus
  );
  const progressPercentage =
    currentStepIndex >= 0
      ? ((currentStepIndex + 1) / deliverySteps.length) * 100
      : 0;

  const handleDialogSubmit = () => {
    startTransition(async () => {
      const result = await updateOrderStatus(data.id, selectedStatus);
      if (result.success) {
        setDeliveryStatus(selectedStatus);
        setIsDialogOpen(false);
        toast.success(`Order status updated to ${selectedStatus}`, {
          description: `Order ${data.id} has been successfully updated.`,
        });
      } else {
        toast.error("Failed to update order status", {
          description:
            "Please try again or contact support if the issue persists.",
        });
        console.error("Failed to update order status");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-4">
            <Button onClick={() => history.back()} variant="ghost" size="icon">
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
          <div className="flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Order Status</DialogTitle>
                  <DialogDescription>
                    Change the delivery status for order {data.id}.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                      disabled={isPending}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                        <SelectItem value="PROCESSING">Processing</SelectItem>
                        <SelectItem value="SHIPPED">Shipped</SelectItem>
                        <SelectItem value="DELIVERED">Delivered</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        <SelectItem value="REFUNDED">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleDialogSubmit}
                    disabled={isPending || selectedStatus === deliveryStatus}
                  >
                    {isPending ? "Updating..." : "Update Status"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                  <div>
                    <Label className="text-sm">Carrier</Label>
                    <MultiSelect
                      options={["USPS", "UPS", "FedEx", "DHL", "Other"].map(
                        (c) => ({ label: c, value: c })
                      )}
                      multiple={false}
                      value={carrier || ""}
                      onChange={(val) => setCarrier(val as string)}
                      placeholder="Select carrier"
                    />
                  </div>

                  <div>
                    <Label className="text-sm">Tracking Number</Label>
                    <input
                      className="w-full border rounded px-2 py-1"
                      value={trackingNumber || ""}
                      onChange={(e) =>
                        setTrackingNumber(e.target.value || null)
                      }
                      placeholder="Tracking number"
                    />
                  </div>

                  <div>
                    <Label className="text-sm">Tracking URL (optional)</Label>
                    <input
                      className="w-full border rounded px-2 py-1"
                      value={trackingUrl || ""}
                      onChange={(e) => setTrackingUrl(e.target.value || null)}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        startTransition(async () => {
                          // Auto-generate tracking URL for known carriers if not provided
                          let genUrl = trackingUrl;
                          if (!genUrl && carrier && trackingNumber) {
                            const templates: Record<string, string> = {
                              USPS: `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${trackingNumber}`,
                              UPS: `https://wwwapps.ups.com/WebTracking/track?trackNums=${trackingNumber}`,
                              FedEx: `https://www.fedex.com/fedextrack/?tracknumbers=${trackingNumber}`,
                              DHL: `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`,
                            };
                            genUrl = templates[carrier] || genUrl;
                          }

                          const result = await updateOrderShipping(
                            data.id,
                            carrier,
                            trackingNumber,
                            genUrl
                          );
                          if (result.success) {
                            setTrackingUrl(genUrl || null);
                            toast.success("Shipping info saved");
                          } else {
                            toast.error("Failed to save shipping info");
                          }
                        });
                      }}
                    >
                      Save Shipping
                    </Button>
                  </div>
                </div>
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
