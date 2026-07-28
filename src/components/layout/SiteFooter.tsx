import Link from "next/link";
import type { Brand } from "@/lib/brand";

export function SiteFooter({ brand }: { brand: Brand }) {
  return (
    <footer className="mt-auto bg-wine-deep text-paper">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl">{brand.name}</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-mist/90">
            {brand.tagline}
          </p>
          <p className="mt-5 text-xs tracking-[0.22em] text-gold-soft uppercase">
            {brand.oab}
          </p>
        </div>

        <div>
          <p className="text-xs tracking-[0.22em] text-gold-soft uppercase">
            Navegação
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link href="/sobre" className="hover:text-gold-soft">
              Sobre
            </Link>
            <Link href="/areas" className="hover:text-gold-soft">
              Áreas de atuação
            </Link>
            <Link href="/agendar" className="hover:text-gold-soft">
              Agendar consulta
            </Link>
            <Link href="/area-cliente" className="hover:text-gold-soft">
              Área do cliente
            </Link>
            <Link href="/blog" className="hover:text-gold-soft">
              Blog
            </Link>
          </div>
        </div>

        <div>
          <p className="text-xs tracking-[0.22em] text-gold-soft uppercase">
            Contato
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-mist/90">
            <a href={`mailto:${brand.email}`} className="hover:text-gold-soft">
              {brand.email}
            </a>
            <a
              href={brand.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="hover:text-gold-soft"
            >
              {brand.phone}
            </a>
            <p>{brand.address}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-5 text-xs text-mist/80 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {brand.shortName}. Todos os direitos
            reservados.
          </p>
          <div className="flex gap-4">
            <Link href="/privacidade" className="hover:text-gold-soft">
              Privacidade e LGPD
            </Link>
            <Link href="/termos" className="hover:text-gold-soft">
              Termos de uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
