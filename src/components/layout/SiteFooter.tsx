import Link from "next/link";
import type { Brand } from "@/lib/brand";

export function SiteFooter({ brand }: { brand: Brand }) {
  return (
    <footer className="mt-auto border-t border-line/80 bg-ink text-paper">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl">{brand.name}</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-mist">
            {brand.tagline}
          </p>
          <p className="mt-4 text-sm text-mist">{brand.oab}</p>
        </div>

        <div>
          <p className="text-sm tracking-[0.12em] text-mist uppercase">
            Navegação
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link href="/areas">Áreas de atuação</Link>
            <Link href="/agendar">Agendar consulta</Link>
            <Link href="/area-cliente">Área do cliente</Link>
            <Link href="/blog">Blog</Link>
          </div>
        </div>

        <div>
          <p className="text-sm tracking-[0.12em] text-mist uppercase">
            Contato
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-mist">
            <a href={`mailto:${brand.email}`}>{brand.email}</a>
            <a href={brand.whatsapp} target="_blank" rel="noreferrer">
              {brand.phone}
            </a>
            <p>{brand.address}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-5 text-xs text-mist md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {brand.shortName}. Todos os direitos
            reservados.
          </p>
          <div className="flex gap-4">
            <Link href="/privacidade">Privacidade e LGPD</Link>
            <Link href="/termos">Termos de uso</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
