"use client";

import { CategoryCard } from "@/components/category-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Category } from "@prisma/client";
import Autoplay from "embla-carousel-autoplay";
import * as React from "react";

export function CategoryShowcaseClient({
  categories,
}: {
  categories: Category[];
}) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <div className="bg-white text-neutral-800 p-4 sm:p-8 md:p-12 lg:p-16">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-start mb-8 sm:mb-12">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-light leading-tight">
              Find your own <em className="italic">unique style</em>, and
              thousands of brands.
            </h1>
          </div>
        </header>

        {/* Carousel */}
        <Carousel
          plugins={[plugin.current]}
          opts={{ align: "start", loop: false }}
          className="w-full"
        >
          <CarouselContent className="-ml-2">
            {categories.map((category) => (
              <CarouselItem
                key={category.id}
                className="pl-2 basis-3/4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <CategoryCard category={category} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
