import prisma from "@/lib/db";
import { SaveInfo } from "./action";
import { InfoFormBuilder } from "./info-builder";
export const revalidate = 0;

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const metadata = {
  title: "Info Section | Nature and Nurtures",
  description: "Customize the Info section of your website.",
};

export default async function Page() {
  const pageContent = await prisma.pageContent.findUnique({
    where: { pageType: "INFO" },
  });

  const data = (pageContent?.content || {}) as any;

  return <InfoFormBuilder data={data} onSave={SaveInfo} />;
}
