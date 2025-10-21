import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Search as SearchIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";

interface SearchDrawerProps {
  open: boolean;
  closeDrawer: () => void;
}

import { useRouter } from "next/navigation";
import { useRef } from "react";

export function SearchDrawer({ open, closeDrawer }: SearchDrawerProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const value = inputRef.current?.value?.trim();
    if (value) {
      closeDrawer();
      router.push(`/products?search=${encodeURIComponent(value)}`);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && closeDrawer()}>
      <SheetContent side="top" className="p-6">
        <div className="mt-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearch}>
              <label
                className="text-gray-600 font-semibold"
                htmlFor="global-search"
              >
                Search
              </label>
              <div className="flex items-center gap-4 mt-2">
                {/* input wrapper should flex-grow */}
                <div className="flex items-center border rounded-lg overflow-hidden flex-1">
                  <div className="px-3 text-gray-400">
                    <SearchIcon />
                  </div>
                  <input
                    id="global-search"
                    ref={inputRef}
                    placeholder="Search products"
                    className="w-full px-4 py-3 focus:outline-none"
                    autoFocus
                  />
                </div>

                <Button
                  size="icon"
                  variant="outline"
                  onClick={closeDrawer}
                  type="button"
                >
                  <XIcon />
                </Button>
                <Button type="submit" variant="default">
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
