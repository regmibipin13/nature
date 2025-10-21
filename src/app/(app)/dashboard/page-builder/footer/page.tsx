import prisma from "@/lib/db";
import { Metadata } from "next";
import { saveFooter } from "./action";
import { FooterForm } from "./footer-builder";
export const revalidate = 0;

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const metadata: Metadata = {
  title: "Dashboard - Footer Page Builder",
  description: "Manage and edit footer social media links in the dashboard.",
};

export default async function Page() {
  const pageContent = await prisma.pageContent.findUnique({
    where: { pageType: "footer" },
  });

  const data = pageContent?.content as any || {};
  const socialLinks = data.socialLinks || [];
  
  console.log(socialLinks);
  return <FooterForm data={socialLinks} onsave={saveFooter} />;
}
