import prisma from "@/lib/db";
import { Metadata } from "next";
import { AboutBuilder } from "./about";
import { SaveAbout } from "./action";
import { AboutFormData } from "./schema";
export const revalidate = 0;

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const metadata: Metadata = {
  title: "Dashboard - TOS Page Builder",
  description:
    "Build and edit the Terms of Service page content in the dashboard.",
};

export default async function Page() {
  // const {
  //   data: { content: data },
  // } = await supabaseClient
  //   .from("PageContent")
  //   .select("*")
  //   .eq("pageType", "ABOUT")
  //   .single();

  const data = await prisma.pageContent.findUnique({
    where: { pageType: "ABOUT" },
  });
  return (
    <AboutBuilder
      data={data ? (data.content as AboutFormData) : null}
      saveAbout={SaveAbout}
    />
  );
}
