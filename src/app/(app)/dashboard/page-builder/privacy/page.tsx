import prisma from "@/lib/db";
import { Metadata } from "next";
import { SavePrivacy } from "./action";
import { PrivacyPolicyBuilder } from "./privacy-policy-builder";
export const revalidate = 0;

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const metadata: Metadata = {
  title: "Dashboard - Privacy Policy Page Builder",
  description:
    "Build and edit the Privacy Policy page content in the dashboard.",
};

export default async function Page() {
  const pageContent = await prisma.pageContent.findUnique({
    where: { pageType: "PRIVACY" },
  });

  const data = (pageContent?.content || {}) as any;

  return <PrivacyPolicyBuilder data={data} onSave={SavePrivacy} />;
}
