import prisma from "@/lib/db";
import Link from "next/link";

export const revalidate = 1;

export async function HeroSection() {
  const pageContent = await prisma.pageContent.findUnique({
    where: { pageType: "HERO" },
  });

  if (!pageContent) {
    return null;
  }

  const data = pageContent.content as any;

  return (
    <section
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-[100dvh] md:h-auto flex items-center justify-center -mt-4 md:mt-0"
      style={{
        backgroundColor: data.backgroundColor,
      }}
    >
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-1 md:gap-8 w-full max-w-md md:max-w-none pt-0 md:pt-8">
        {/* Right Content (Video or Image) - Mobile: Top, Desktop: Right */}
        <div className="flex justify-center order-1 md:order-2 mt-0">
          {data.videoUrl ? (
            <div className="w-full max-w-[180px] sm:max-w-sm md:max-w-lg md:aspect-video">
              <iframe
                className="w-full h-auto md:h-full rounded-lg"
                src={data.videoUrl}
                title="Video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              />
            </div>
          ) : (
            <img
              src={data.imageUrl}
              alt="Hero"
              className="w-full max-w-[180px] sm:max-w-sm md:max-w-lg object-contain rounded-lg"
            />
          )}
        </div>

        {/* Left Content - Mobile: Bottom, Desktop: Left */}
        <div className="space-y-1 sm:space-y-3 md:space-y-6 text-center md:text-left order-2 md:order-1 px-2">
          {/* Icon */}
          <div className="flex justify-center md:justify-start items-center">
            <span className="text-xl sm:text-4xl md:text-5xl lg:text-6xl">
              {data.icon}
            </span>
          </div>

          {/* Title */}
          <div
            className="prose prose-sm sm:prose-base md:prose-lg font-serif break-words overflow-hidden mx-auto md:mx-0
            [&_*]:max-w-full [&_img]:w-full [&_img]:object-cover
            [&_h1]:text-[11px] [&_h1]:sm:text-2xl [&_h1]:md:text-3xl [&_h1]:lg:text-4xl 
            [&_h1]:mb-0 [&_h1]:leading-tight [&_h1]:font-semibold [&_h1]:text-center [&_h1]:md:text-left
            [&_h2]:text-[10px] [&_h2]:sm:text-xl [&_h2]:md:text-2xl [&_h2]:mb-0 [&_h2]:leading-tight [&_h2]:text-center [&_h2]:md:text-left
            [&_p]:text-[10px] [&_p]:sm:text-base [&_p]:md:text-lg [&_p]:mb-0 [&_p]:leading-tight [&_p]:text-center [&_p]:md:text-left"
            dangerouslySetInnerHTML={{
              __html: data.title,
            }}
          />

          {/* Description */}
          <div
            className="prose prose-sm sm:prose-base md:prose-lg break-words overflow-hidden mx-auto md:mx-0
            [&_*]:max-w-full [&_img]:w-full [&_img]:object-cover
            [&_p]:text-[8px] [&_p]:sm:text-sm [&_p]:md:text-base 
            [&_p]:leading-tight [&_p]:mb-0 [&_p]:text-center [&_p]:md:text-left"
            dangerouslySetInnerHTML={{ __html: data.description }}
          />

          {/* CTA Button */}
          <div className="pt-1 sm:pt-2 md:pt-4 flex justify-center md:justify-start">
            <Link
              href="/products?search=oil"
              className="inline-flex items-center bg-brand rounded-full 
              px-3 sm:px-6 md:px-8 
              py-1 sm:py-2.5 md:py-3 
              text-[9px] sm:text-xs md:text-base 
              font-semibold uppercase tracking-wider
              transform transition-transform duration-200 hover:scale-105 hover:bg-brand/90"
            >
              {data.buttonText}
              <span
                className="ml-1 sm:ml-2 inline-flex justify-center items-center 
                w-2.5 h-2.5 sm:w-5 sm:h-5 md:w-6 md:h-6 
                bg-black text-white rounded-full 
                text-[7px] sm:text-xs
                transform transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
