import prisma from "@/lib/db";

export const revalidate = 1;

export async function InfoSection() {
  const pageContent = await prisma.pageContent.findUnique({
    where: { pageType: "INFO" },
  });

  if (!pageContent) {
    return null;
  }

  const data = pageContent.content as any;
  return (
    <section
      className="py-16 sm:py-24"
      style={{ backgroundColor: data.backgroundColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text */}
          <div className="lg:col-span-5">
            <div
              className="prose  break-words overflow-hidden [&_*]:max-w-full   [&_img]:w-full [&_img]:object-cover"
              dangerouslySetInnerHTML={{ __html: data.title }}
            />
            <div
              className="prose  break-words overflow-hidden [&_*]:max-w-full   [&_img]:w-full [&_img]:object-cover"
              dangerouslySetInnerHTML={{ __html: data.description }}
            />
          </div>

          {/* Image Grid (2x2 square) */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            {data.image1 && (
              <img
                src={data.image1}
                alt="Image 1"
                className="rounded-xl object-cover w-full aspect-square"
              />
            )}
            {data.image2 && (
              <img
                src={data.image2}
                alt="Image 2"
                className="rounded-xl object-cover w-full aspect-square"
              />
            )}
            {data.image3 && (
              <img
                src={data.image3}
                alt="Image 3"
                className="rounded-xl object-cover w-full aspect-square"
              />
            )}
            {data.image4 && (
              <img
                src={data.image4}
                alt="Image 4"
                className="rounded-xl object-cover w-full aspect-square"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
