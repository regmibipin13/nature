import prisma from "@/lib/db";
import { Metadata } from "next";
import { SaveTos } from "./action";
import { TOSBuilder } from "./tos-builder";
export const revalidate = 0;

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const metadata: Metadata = {
  title: "Dashboard - TOS Page Builder",
  description:
    "Build and edit the Terms of Service page content in the dashboard.",
};

export default async function Page() {
  const pageContent = await prisma.pageContent.findUnique({
    where: { pageType: "TOS" },
  });

  const data = (pageContent?.content || {}) as any;

  return <TOSBuilder data={data} saveTos={SaveTos} />;
}
