"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { supabaseClient } from "@/lib/supabase/client";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Control, useFieldArray } from "react-hook-form";

interface Product {
  id: string;
  name: string;
  stockQuantity: number;
  price: number;
  images: string[];
  originalPrice: number;
}

interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

interface ProductSelectProps {
  control: Control<{ items: OrderItem[] }>;
  name: "items";
}

export function ProductSelect({ control, name }: ProductSelectProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");

  // RHF Field Array
  const { fields, append, remove, update } = useFieldArray({
    control,
    name,
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabaseClient
        .from("products")
        .select("id, name, stockQuantity, price, originalPrice, images")
        .limit(50);

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts((data as Product[]) || []);
      }
    };

    fetchProducts();
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const addProduct = (p: Product) => {
    const existingIndex = fields.findIndex((x) => x.productId === p.id);
    if (existingIndex !== -1) {
      update(existingIndex, {
        ...fields[existingIndex],
        quantity: fields[existingIndex].quantity + 1,
      });
    } else {
      append({
        productId: p.id,
        quantity: 1,
        unitPrice: p.price,
      });
    }
  };

  return (
    <div className="border rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-3">
        <h2 className="font-medium">Products</h2>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              Add or Remove Products
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="min-w-5xl p-0">
            <SheetTitle className="m-0 p-0"></SheetTitle>
            <div className="flex h-full">
              {/* Left: Product list */}
              <div className="flex-1 border-r p-4 flex flex-col">
                <h3 className="font-medium mb-2">Select Products</h3>
                <Input
                  placeholder="Search products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="mb-3"
                />
                <ScrollArea className="flex-1 min-h-0">
                  <div className="space-y-3">
                    {filtered.map((p) => (
                      <div
                        key={p.id}
                        className="border rounded-lg p-3 flex justify-between items-center"
                      >
                        <div className="flex items-center gap-3">
                          {p.images?.[0] && (
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-xs text-muted-foreground">
                              In Stock: {p.stockQuantity}
                            </p>
                            <p className="text-sm">
                              <span className="text-red-600 mr-2">
                                MRP Rs. {p.originalPrice}
                              </span>
                              <span className="text-green-600">
                                Discounted Rs. {p.price}
                              </span>
                            </p>
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => addProduct(p)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Right: Final items */}
              <div className="w-[350px] flex flex-col p-4">
                <h3 className="font-medium mb-2">
                  Final Items ({fields.length})
                </h3>
                <ScrollArea className="flex-1 min-h-0">
                  <div className="space-y-3">
                    {fields.map((field, index) => {
                      const product = products.find(
                        (p) => p.id === field.productId
                      );
                      if (!product) return null;
                      return (
                        <div
                          key={field.id} // field.id is RHF’s unique key
                          className="border rounded-lg p-3 flex justify-between items-center gap-3"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              {product.images?.[0] && (
                                <img
                                  // src={product.images[0]}
                                  src={
                                    product.images && product.images.length > 0
                                      ? product.images[0]
                                      : "/placeholder-image.png"
                                  }
                                  alt={product.name}
                                  className="w-16 h-16 object-cover rounded"
                                />
                              )}
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  In Stock: {product.stockQuantity}
                                </p>
                                <p className="text-sm">
                                  <span className="text-red-600 mr-2">
                                    MRP Rs. {product.originalPrice}
                                  </span>
                                  <span className="text-green-600">
                                    Discounted Rs. {product.price}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">
                                Qty:
                              </span>
                              <Input
                                type="number"
                                min={1}
                                value={field.quantity}
                                onChange={(e) =>
                                  update(index, {
                                    ...field,
                                    quantity: parseInt(e.target.value) || 1,
                                  })
                                }
                                className="w-20 h-8"
                              />
                            </div>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => remove(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Body */}
      <div className="text-muted-foreground">
        {fields.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm">No items</p>
          </div>
        ) : (
          <ul className="divide-y w-full">
            {fields.map((field) => {
              const product = products.find((p) => p.id === field.productId);
              if (!product) return null;
              return (
                <li key={field.id} className="p-3">
                  <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-3">
                      {product.images?.[0] && (
                        <img
                          // src={product.images[0]}
                          src={
                            product.images && product.images.length > 0
                              ? product.images[0]
                              : "/placeholder-image.png"
                          }
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          In Stock: {product.stockQuantity}
                        </p>
                        <p className="text-sm">
                          <span className="text-red-600 mr-2">
                            MRP Rs. {product.originalPrice}
                          </span>
                          <span className="text-green-600">
                            Discounted Rs. {product.price}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2 border p-2 rounded">
                      <span className="text-xs text-muted-foreground">
                        Qty:
                      </span>
                      <p className="font-bold text-green-600">
                        {field.quantity}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
