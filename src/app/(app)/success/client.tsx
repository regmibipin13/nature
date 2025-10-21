"use client";

import { useCartStore } from "@/lib/cart-store";
import { useEffect } from "react";

interface SuccessButtonsProps {
  errorState?: boolean;
  orderId?: string;
}

export default function SuccessButtons({
  errorState = false,
  orderId,
}: SuccessButtonsProps) {
  // set cart to empty array
  const { clearCart } = useCartStore();
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const handleContinueShopping = () => {
    window.location.href = "/";
  };

  const handleViewOrders = (orderId?: string) => {
    if (orderId) window.location.href = `/details/${orderId}`;
  };

  if (errorState) {
    return (
      <button
        onClick={handleContinueShopping}
        className="w-full bg-black text-white rounded-full py-3 font-semibold hover:bg-gray-900 transition"
      >
        RETURN HOME
      </button>
    );
  }

  return (
    <div>
      <div className="space-y-3">
        <button
          onClick={handleContinueShopping}
          className="w-full bg-black text-white rounded-full py-3 font-semibold hover:bg-gray-900 transition"
        >
          CONTINUE SHOPPING
        </button>
        <button
          onClick={() => handleViewOrders(orderId)}
          className="w-full border border-gray-900 text-gray-900 rounded-full py-3 font-semibold hover:bg-gray-100 transition"
        >
          VIEW ORDERS
        </button>
      </div>
    </div>
  );
}
