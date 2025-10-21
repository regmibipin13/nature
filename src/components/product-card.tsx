import { imageThumbnailUrl } from "@/utils/image-otf";
import Link from "next/link";

export const ProductCard: React.FC<{ product: any }> = ({ product }) => (
  <Link href={`/products/${product.slug}`} className="group">
    <div className="flex flex-col items-center">
      {/* Image Container */}
      <div
        className="rounded-lg relative aspect-square lg:w-full w-[90%] bg-center bg-cover overflow-hidden
                   transition-transform duration-300 ease-out group-hover:scale-[1.02] group-hover:shadow-xl"
        style={{
          ...(product.productImages.length > 0
            ? {
                backgroundImage: `url(${imageThumbnailUrl(
                  product.productImages[0].url,
                  400,
                  400
                )})`,
              }
            : { backgroundColor: "#f3f4f6" }),
        }}
      ></div>

      {/* Product Info - Below Image */}
      <div className="pt-3 px-1 text-center sm:text-left w-full hidden sm:block">
        <h3 className="font-semibold  tracking-wide text-gray-900 group-hover:text-gray-700 transition-colors">
          {product.name}
        </h3>

        <p className="mt-2 font-bold text-base text-gray-900">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </div>
  </Link>
);
