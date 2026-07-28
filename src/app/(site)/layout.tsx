import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getBrand } from "@/lib/site-settings";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const brand = await getBrand();

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-3 focus:py-2"
      >
        Ir para o conteúdo
      </a>
      <SiteHeader brand={brand} />
      <main id="conteudo" className="flex-1">
        {children}
      </main>
      <SiteFooter brand={brand} />
      <Link
        href={brand.whatsapp}
        target="_blank"
        rel="noreferrer"
        className="fixed right-4 bottom-4 z-40 btn btn-primary shadow-[var(--shadow)]"
        aria-label="Falar no WhatsApp"
      >
        WhatsApp
      </Link>
    </>
  );
}
