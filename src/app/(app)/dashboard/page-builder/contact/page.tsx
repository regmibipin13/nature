import prisma from "@/lib/db";
import { saveContact } from "./action";
import { ContactPageBuilder } from "./contact-builder";
export const revalidate = 0;

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const metadata = {
  title: "Contact Us Page Builder | Nature and Nurtures",
  description: "Customize the Contact us page of your website.",
};

export default async function Page() {
  const pageContent = await prisma.pageContent.findUnique({
    where: { pageType: "CONTACT" },
  });

  const data = (pageContent?.content || null) as any;

  return (
    <ContactPageBuilder
      data={data}
      onSave={saveContact}
    />
  );
}
