import { Footer } from "@/components/shared/footer";
import Header from "@/components/shared/header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import prisma from "@/lib/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";
export const revalidate = 0;

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
type TOSData = {
  title: string;
  content: string;
};

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about Nature & Nurtures",
};

export default async function TOSPage() {
  const tosData = await prisma.pageContent.findUnique({
    where: { pageType: "ABOUT" },
  });

  if (!tosData) {
    notFound();
  }

  const data = tosData.content as TOSData;

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{data.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
              {data.title}
            </h1>
            <div
              className="prose  break-words overflow-hidden [&_*]:max-w-full   [&_img]:w-full [&_img]:object-cover"
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
