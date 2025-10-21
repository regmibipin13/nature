import { ProductCard } from "@/components/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import prisma from "@/lib/db";
import { ChevronRight } from "lucide-react";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function FeaturedProductShowcase() {
  const products = await prisma.product.findMany({
    where: { active: true, featured: true },
    take: 6,
    orderBy: { createdAt: "desc" },
    include: {
      category: {
        select: { name: true, id: true },
      },
      productImages: { select: { url: true, alt: true } },
    },
  });
  return (
    <Carousel opts={{ align: "start", loop: true }} className="w-full">
      <div className="max-w-7xl mx-auto my-20 overflow-hidden px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="bg-white font-serif flex items-center justify-between w-full mb-10">
          {/* Central text block with "Explore Face Wash" and the curved arrow */}
          <div className="text-center relative">
            <h1 className="text-6xl italic text-gray-900">Featured Products</h1>
          </div>

          {/* Description text to the right of the central text */}

          {/* Navigation arrows on the far right */}
          <div className="flex items-center space-x-4">
            <CarouselNext className="relative border border-gray-300 rounded-full p-3 hover:bg-gray-100 transition-colors">
              <ChevronRight size={18} />
            </CarouselNext>
            <CarouselPrevious className="relative border border-gray-300 rounded-full p-3 hover:bg-gray-100 transition-colors"></CarouselPrevious>
          </div>
        </div>

        {/* Carousel */}
        <CarouselContent className="ml-0">
          {products.map((product: any) => (
            <CarouselItem
              key={product.id}
              className="basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </div>
    </Carousel>
  );
}
