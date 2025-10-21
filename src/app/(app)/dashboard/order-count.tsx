"use client";

import React, { useEffect, useRef } from "react";

export function OrderCount() {
  const [orderCount, setOrderCount] = React.useState<number | null>(null);
  const prevCountRef = useRef<number | null>(null);

  // Preload sound
  const playSound = () => {
    const audio = new Audio("/sounds/notification.mp3"); // put a file in /public/sounds/
    audio.play().catch(() => {
      // Ignore audio play errors
    });
  };

  useEffect(() => {
    // load initial count
    const fetchInitialCount = async () => {
      try {
        const response = await fetch('/api/orders/count');
        if (!response.ok) {
          throw new Error('Failed to fetch order count');
        }
        const data = await response.json();
        const count = data.count ?? 0;
        
        setOrderCount(count);
        prevCountRef.current = count;
      } catch (error) {
        console.error("Error fetching initial order count:", error);
        setOrderCount(0);
      }
    };

    fetchInitialCount();
  }, []);

  useEffect(() => {
    // Poll for new orders every 10 seconds
    const fetchCount = async () => {
      try {
        const response = await fetch('/api/orders/count');
        if (!response.ok) {
          throw new Error('Failed to fetch order count');
        }
        const data = await response.json();
        const count = data.count ?? 0;

        // Compare with previous count
        if (
          prevCountRef.current !== null &&
          count > prevCountRef.current
        ) {
          playSound(); // 🔊 play only if new unseen orders increased
        }

        prevCountRef.current = count;
        setOrderCount(count);
      } catch (error) {
        console.error("Error fetching order count:", error);
      }
    };

    // Poll every 10 seconds
    const intervalId = setInterval(fetchCount, 10000);

    // Initial load
    fetchCount();

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      {orderCount !== null && orderCount > 0 ? (
        <div className="inline-flex items-center px-2 py-1 text-xs bg-red-600 text-white  rounded-full">
          {orderCount}
        </div>
      ) : null}
    </>
  );
}
