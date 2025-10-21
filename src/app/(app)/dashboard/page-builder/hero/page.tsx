import prisma from "@/lib/db";
import { SaveHero } from "./action";
import { HeroFormBuilder } from "./hero-builder";
export const revalidate = 0;

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const metadata = {
  title: "Hero Page Builder | Nature and Nurtures",
  description: "Customize the Hero section of your website.",
};

export default async function Page() {
  const pageContent = await prisma.pageContent.findUnique({
    where: { pageType: "HERO" },
  });

  const data = (pageContent?.content || {}) as any;

  return <HeroFormBuilder data={data} onSave={SaveHero} />;
}
