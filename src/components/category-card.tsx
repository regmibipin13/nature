import { imageThumbnailUrl } from "@/utils/image-otf";
import Link from "next/link";

export const CategoryCard: React.FC<{ category: any }> = ({ category }) => (
  <Link href={`/category/${category.slug}`} className="group block p-4">
    <div
      className="rounded-lg overflow-hidden aspect-square bg-center bg-cover transition-transform duration-300 ease-out group-hover:scale-105 group-hover:shadow-lg"
      style={{
        ...(category.imageUrl
          ? {
              backgroundImage: `url(${imageThumbnailUrl(
                category.imageUrl,
                400,
                400
              )})`,
            }
          : {
              backgroundColor: "#f3f4f6", // light gray fallback
            }),
      }}
    ></div>

    <h3 className="mt-3 font-semibold text-sm tracking-widest text-gray-900 text-center group-hover:text-primary transition-colors">
      {category.name}
    </h3>
  </Link>
);
