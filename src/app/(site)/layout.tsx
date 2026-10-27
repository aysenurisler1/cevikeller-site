import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialFloat from "@/components/SocialFloat";
import QuoteChat from "@/components/QuoteChat";
import { getWizardImages } from "@/sanity/queries";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const wizardImages = await getWizardImages();

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <SocialFloat />
      <QuoteChat images={wizardImages} />
    </>
  );
}