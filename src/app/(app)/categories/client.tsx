import { CategoryCard } from "@/components/category-card";
import { Footer } from "@/components/shared/footer";
import Header from "@/components/shared/header/index";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Star } from "lucide-react";

export function CategoryProductClient({ data }: { data: any }) {
  return (
    <div>
      <Header />
      <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          {/* Breadcrumb */}
          <div className="mb-6 sm:mb-10">
            <Breadcrumb>
              <BreadcrumbList className="flex flex-wrap text-xs sm:text-sm">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Categories</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Header Section */}
          <header className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Star size={16} className="text-gray-800" fill="currentColor" />
            </div>
            <p className="text-xs sm:text-sm uppercase tracking-widest text-gray-500">
              Nature & Nurtures
            </p>
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-serif text-gray-900 my-2">
              Categories
            </h1>
            <p className="max-w-md mx-auto text-gray-600 text-xs sm:text-sm leading-relaxed">
              Explore our diverse range of product categories at Nature &
              Nurtures.
            </p>
          </header>

          {/* Product Grid */}
          <main>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-6 sm:gap-y-10">
              {data.map((category: any) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
