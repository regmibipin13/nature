"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Search, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    router.push(`/products?search=${encodeURIComponent(searchTerm)}`);
  };

  if (isMobile) {
    return (
      <>
        <Drawer direction="top" open={open} onOpenChange={setOpen}>
          <DrawerTrigger>
            <button
              onClick={() => setOpen(true)}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
            >
              <Search size={20} />
            </button>
          </DrawerTrigger>
          <DrawerContent className="px-4 py-4 border-b">
            <DrawerHeader>
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 border rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-black"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-black text-white rounded-full px-4 py-2 font-semibold hover:bg-gray-900 transition disabled:opacity-50"
                >
                  {loading ? "..." : "Search"}
                </button>
              </form>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  // Desktop version (inline search bar)
  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center border rounded-full px-4 py-2 max-w-md w-full"
    >
      <Search size={20} className="text-gray-500 mr-2" />
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 outline-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="ml-2 text-sm font-semibold text-black hover:underline disabled:opacity-50"
      >
        {loading ? "..." : <SearchIcon />}
      </button>
    </form>
  );
}
