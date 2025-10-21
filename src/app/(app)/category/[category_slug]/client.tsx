"use client";

import { ProductCard } from "@/components/product-card";

export function CategoryProductClient({ data }: { data: any }) {
  // --- State for Filters & Sorting ---

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        {/* Breadcrumb */}
        {/* <div className="mb-6 sm:mb-10">
          <Breadcrumb>
            <BreadcrumbList className="flex flex-wrap text-xs sm:text-sm">
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{data.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div> */}

        {/* Header Section */}
        <header className="text-center mb-12">
          {/* <div className="flex justify-center mb-4">
            <Star size={16} className="text-gray-800" fill="currentColor" />
          </div>
          <p className="text-xs sm:text-sm uppercase tracking-widest text-gray-500">
            Category
          </p> */}
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-serif text-gray-900 my-2">
            {data.name}
          </h1>
          <p className="max-w-5xl mt-4 mx-auto text-gray-600 text-xs sm:text-sm leading-relaxed">
            {data.description}
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- Product Section --- */}
          <section className="w-full lg:w-3/4">
            <div className="border-y border-gray-200 py-3 sm:py-4 mb-8 sm:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm gap-2">
              <span className="text-gray-600">
                {data.products.length} PRODUCTS
              </span>
            </div>

            {/* Product Grid */}
            <main>
              {data.products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-6 sm:gap-y-10">
                  {data.products.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 text-sm">
                  No products found in this price range.
                </p>
              )}
            </main>
          </section>
        </div>
      </div>
    </div>
  );
}
