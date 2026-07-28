import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Sobre",
  description: `Conheça a trajetória de ${brand.name}.`,
};

export default function SobrePage() {
  return (
    <div className="section-pad">
      <div className="container-page grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-start">
        <div
          className="reveal min-h-[420px] bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(11,28,36,0.15), rgba(11,28,36,0.45)), url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80')",
          }}
        />
        <div className="reveal reveal-delay-1">
          <p className="text-sm tracking-[0.16em] text-accent uppercase">
            Sobre
          </p>
          <h1 className="font-display mt-3 text-5xl text-ink md:text-6xl">
            {brand.name}
          </h1>
          <p className="mt-2 text-muted">{brand.oab}</p>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink-soft">
            <p>
              Advogada com atuação em Direito de Família, Direito do Trabalho e
              Direito do Consumidor. O escritório nasceu da convicção de que
              orientação jurídica deve ser clara, acessível e acompanhada de
              perto — sem jargão desnecessário e sem distância do cliente.
            </p>
            <p>
              Cada caso começa com escuta. Em seguida, uma análise objetiva das
              opções, dos riscos e do caminho mais adequado. Quando há processo,
              o acompanhamento permanece transparente: próximos passos,
              documentos e prazos ficam organizados.
            </p>
            <p>
              Atendimento em São Paulo e online para clientes em outras
              localidades, sempre com horário marcado.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/agendar" className="btn btn-primary">
              Agendar consulta
            </Link>
            <Link href="/areas" className="btn btn-secondary">
              Ver áreas de atuação
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
