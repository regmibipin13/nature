"use client";

import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCartStore } from "@/lib/cart-store";
import { imageThumbnailUrl } from "@/utils/image-otf";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface CartDrawerProps {
  open: boolean;
  closeDrawer: () => void;
}

export function CartClientDrawer({ open, closeDrawer }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, getTotalPrice } =
    useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  const subtotal = getTotalPrice();
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isMobile = useIsMobile();

  return (
    <Drawer
      direction={isMobile ? "bottom" : "right"}
      open={open}
      onOpenChange={(o) => !o && closeDrawer()}
    >
      <DrawerContent className="">
        <DrawerHeader className="border-b flex items-center justify-between px-4 sm:px-8 py-4">
          <DrawerTitle className="text-lg sm:text-xl">
            Shopping Cart
          </DrawerTitle>
          <span className="text-sm text-gray-500">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-row sm:flex-row items-center sm:items-center gap-2 py-4 border-b last:border-b-0"
            >
              <img
                // src={imageThumbnailUrl(item.image, 100, 100)}
                src={
                  item.image
                    ? imageThumbnailUrl(item.image, 100, 100)
                    : "/placeholder.png"
                }
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg bg-[#f8f5f2] sm:mr-6 mb-4 sm:mb-0"
              />
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-base tracking-wide">
                      {item.name}
                    </div>
                    <div className="text-gray-500 text-sm mt-1">
                      {item.options}
                    </div>
                    <div className="text-gray-400 text-sm mt-1">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="font-semibold text-base mt-2 sm:mt-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>

                <div className="flex items-center mt-4 flex-wrap gap-2">
                  {/* Decrement Button */}
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="border px-2 py-1 rounded-full text-gray-500 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>

                  {/* Current Quantity */}
                  <span className="mx-2 text-base font-semibold">
                    {item.quantity}
                  </span>

                  {/* Increment Button */}
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="border px-2 py-1 rounded-full text-gray-500 hover:text-black"
                  >
                    +
                  </button>

                  {/* Remove Item Button */}
                  <button
                    className="ml-2 text-gray-400 hover:text-red-500"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <DrawerFooter className="border-t px-4 sm:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-2">
            <span className="font-semibold text-base tracking-wide">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
            <span className="font-semibold text-lg mt-2 sm:mt-0">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <div className="text-gray-500 text-sm mb-6 text-center sm:text-left">
            SHIPPING AND TAXES CALCULATED AT CHECKOUT.
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
            <button
              className="flex-1 bg-black text-white rounded-full py-3 font-semibold hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCheckout}
              disabled={isLoading || items.length === 0}
            >
              {isLoading ? "PROCESSING..." : "CHECK OUT"}
            </button>
            <button
              className="flex-1 border border-gray-300 rounded-full py-3 font-semibold hover:bg-gray-100 transition"
              onClick={closeDrawer}
            >
              CONTINUE SHOPPING
            </button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
