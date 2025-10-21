import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import prisma from "@/lib/db";

interface FAQItem {
  title: string;
  content: string;
}

interface FAQData {
  headline: string;
  accordionItems: FAQItem[];
  imageUrl: string;
}

export async function FAQSection() {
  const pageContent = await prisma.pageContent.findUnique({
    where: { pageType: "FAQ" },
  });

  if (!pageContent) {
    return null;
  }

  const faqData: FAQData = pageContent.content as any;

  return (
    <section className="bg-white w-full py-12 sm:py-16 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left Column: Image */}
          <div className="w-full flex justify-center">
            <img
              src={faqData.imageUrl}
              alt="FAQ Image"
              className="rounded-lg w-full max-w-md sm:max-w-full object-cover"
            />
          </div>

          {/* Right Column: Headline & Accordion */}
          <div className="p-2 sm:p-4 min-w-0 w-full">
            <div
              className="prose prose-sm sm:prose-base break-words overflow-hidden [&_*]:max-w-full [&_*]:break-words [&_*]:whitespace-pre-wrap [&_img]:w-full [&_img]:object-cover [&_*]:overflow-wrap-anywhere"
              dangerouslySetInnerHTML={{ __html: faqData.headline }}
            ></div>

            <Accordion
              type="multiple"
              defaultValue={
                faqData.accordionItems[0]?.title
                  ? [faqData.accordionItems[0].title]
                  : []
              }
              className="mt-4 sm:mt-6 min-w-0 w-full"
            >
              {faqData.accordionItems.map((item) => (
                <AccordionItem
                  key={item.title}
                  value={item.title}
                  className="min-w-0 w-full"
                >
                  <AccordionTrigger className="text-base sm:text-lg font-medium text-left min-w-0 w-full break-words whitespace-pre-wrap overflow-wrap-anywhere hyphens-auto pr-6">
                    <span className="block min-w-0 w-full break-words overflow-wrap-anywhere">
                      {item.title}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="min-w-0 w-full">
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap overflow-wrap-anywhere hyphens-auto min-w-0 w-full">
                      {item.content}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
