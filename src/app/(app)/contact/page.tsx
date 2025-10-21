import { ContactPreview } from "@/components/contact-preview";
import { Footer } from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { supabaseClient } from "@/lib/supabase/client";
export const revalidate = 0;

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const metadata = {
  title: "Contact Us | Nature and Nurtures",
  description:
    "Get in touch with Nature and Nurtures for inquiries and support.",
};
export default async function ContactPage() {
  const { data } = await supabaseClient
    .from("PageContent")
    .select("*")
    .eq("pageType", "CONTACT")
    .single();

  return (
    <div>
      <Header />

      <main className="min-h-screen flex flex-col justify-center items-center p-6">
        <ContactPreview data={data.content} />
      </main>
      <Footer />
    </div>
  );
}
