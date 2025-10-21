"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useCartStore } from "@/lib/cart-store";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag } from "lucide-react"; // 👈 Added Menu icon
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CartClientDrawer } from "../cart/client";
import { SearchBar } from "../search/search-drawer";

export function HeaderClient({
  data,
  collections,
}: {
  data: any;
  collections: any;
}) {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false);

  const { items } = useCartStore();

  const categories = Array.isArray(data) ? data : [];
  const megaMenuCategories = categories.slice(0, 4);

  const showDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-2 md:py-6">
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Logo"
              width={128}
              height={32}
              className="h-8 w-auto"
            />
          </Link>

          {/* Navigation (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium relative">
            <Link href="/" className="hover:text-gray-700">
              HOME
            </Link>

            {/* SHOP with Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setMenuOpen(true)}
              onMouseLeave={() => setMenuOpen(false)}
            >
              <Link
                href="/categories"
                className="hover:text-gray-700 inline-flex items-center"
              >
                SHOP ▾
              </Link>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="fixed left-0 top-20 w-full z-30 bg-white shadow-2xl border-b border-gray-100 px-16 py-12 flex justify-center"
                  >
                    <div className="flex w-full max-w-7xl space-x-12">
                      {/* Categories */}
                      {megaMenuCategories.map((category: any) => (
                        <div key={category.id} className="min-w-[220px]">
                          <Link
                            href={`/category/${encodeURIComponent(
                              category.slug
                            )}`}
                            className="font-serif text-xl mb-2 text-gray-900 hover:text-[#7c2943] block"
                          >
                            {category.name}
                          </Link>
                          <ul className="ml-2 pl-2 border-l border-[#7c2943] space-y-1">
                            {(category.products || [])
                              .slice(0, 6)
                              .map((item: any) => (
                                <li key={item.id}>
                                  <Link
                                    href={`/products/${encodeURIComponent(
                                      item.slug
                                    )}`}
                                    className="text-gray-900 hover:text-[#7c2943] text-base font-normal transition-colors"
                                  >
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                          </ul>
                        </div>
                      ))}

                      {/* Collections */}
                      <div className="min-w-[180px]">
                        <h4 className="font-bold mb-4 text-xs tracking-widest text-[#7c2943]">
                          COLLECTIONS
                        </h4>
                        <ul className="space-y-2">
                          {collections.length ? (
                            collections.map((collection: any) => (
                              <li key={collection.id}>
                                <Link
                                  href={`/collections/${encodeURIComponent(
                                    collection.slug
                                  )}`}
                                  className="text-gray-900 hover:text-[#7c2943] transition-colors"
                                >
                                  {collection.name}
                                </Link>
                              </li>
                            ))
                          ) : (
                            <li className="text-gray-500">No collections</li>
                          )}
                        </ul>
                      </div>

                      {/* Category Images */}
                      <div className="flex flex-col items-center justify-start space-y-6">
                        {categories
                          .filter((c: any) => c.imageUrl)
                          .slice(0, 3)
                          .map((c: any) => (
                            <Link
                              key={c.id}
                              href={`/category/${encodeURIComponent(c.slug)}`}
                              className="flex flex-col items-center"
                            >
                              <Image
                                src={c.imageUrl}
                                alt={c.name}
                                width={160}
                                height={128}
                                className="w-40 h-32 object-cover rounded"
                                unoptimized
                              />
                              <span className="mt-2 text-sm text-gray-700 text-center">
                                {c.name}
                              </span>
                            </Link>
                          ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/blogs" className="hover:text-gray-700">
              BLOGS
            </Link>
            <Link href="/about" className="hover:text-gray-700">
              ABOUT
            </Link>
            <Link href="/contact" className="hover:text-gray-700">
              CONTACT
            </Link>
          </nav>
        </div>

        {/* Search + Cart + Hamburger */}
        <div className="flex items-center space-x-4">
          {/* Mobile Hamburger Menu */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileExploreOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 text-gray-800" />
          </button>

          {/* Search */}
          <div className="hidden md:block w-64">
            <SearchBar />
          </div>
          <div className="md:hidden">
            <SearchBar />
          </div>

          {/* Cart */}
          <div className="relative">
            <ShoppingBag
              className="w-5 h-5 cursor-pointer"
              onClick={showDrawer}
            />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-black text-white rounded-full px-1 min-w-[18px] h-[18px] flex items-center justify-center">
                {items.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartClientDrawer open={open} closeDrawer={closeDrawer} />

      {/* Mobile Drawer */}
      <Drawer open={mobileExploreOpen} onOpenChange={setMobileExploreOpen}>
        <DrawerContent className="h-[85vh]">
          <DrawerHeader>
            <DrawerTitle>MENU</DrawerTitle>
          </DrawerHeader>

          <div className="p-6 overflow-y-auto space-y-8">
            {/* Categories */}
            {megaMenuCategories.map((category: any) => (
              <div key={category.id}>
                <Link
                  href={`/category/${encodeURIComponent(category.slug)}`}
                  className="font-serif text-lg text-gray-900 hover:text-[#7c2943] block mb-2"
                  onClick={() => setMobileExploreOpen(false)}
                >
                  {category.name}
                </Link>
                <ul className="ml-3 pl-2 border-l border-[#7c2943] space-y-1">
                  {(category.products || []).slice(0, 6).map((item: any) => (
                    <li key={item.id}>
                      <Link
                        href={`/products/${encodeURIComponent(item.slug)}`}
                        className="text-gray-700 hover:text-[#7c2943] transition-colors"
                        onClick={() => setMobileExploreOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Collections */}
            <div>
              <h4 className="font-bold mb-3 text-xs tracking-widest text-[#7c2943]">
                COLLECTIONS
              </h4>
              <ul className="space-y-2">
                {collections.length ? (
                  collections.map((collection: any) => (
                    <li key={collection.id}>
                      <Link
                        href={`/collections/${encodeURIComponent(
                          collection.slug
                        )}`}
                        className="text-gray-900 hover:text-[#7c2943] transition-colors"
                        onClick={() => setMobileExploreOpen(false)}
                      >
                        {collection.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No collections</li>
                )}
              </ul>
            </div>

            {/* Bottom Links */}
            <div className="pt-6 border-t border-gray-200">
              <ul className="space-y-3 text-lg">
                <li>
                  <Link
                    href="/"
                    className="text-gray-900 hover:text-[#7c2943]"
                    onClick={() => setMobileExploreOpen(false)}
                  >
                    HOME
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories"
                    className="text-gray-900 hover:text-[#7c2943]"
                    onClick={() => setMobileExploreOpen(false)}
                  >
                    SHOP
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blogs"
                    className="text-gray-900 hover:text-[#7c2943]"
                    onClick={() => setMobileExploreOpen(false)}
                  >
                    BLOGS
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-gray-900 hover:text-[#7c2943]"
                    onClick={() => setMobileExploreOpen(false)}
                  >
                    ABOUT
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-900 hover:text-[#7c2943]"
                    onClick={() => setMobileExploreOpen(false)}
                  >
                    CONTACT
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </header>
  );
}
