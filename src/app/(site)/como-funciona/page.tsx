import type { Metadata } from "next";
import Link from "next/link";
import { howItWorks } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Como funciona",
};

export default function ComoFuncionaPage() {
  return (
    <div className="section-pad">
      <div className="container-page">
        <p className="text-sm tracking-[0.16em] text-accent uppercase">
          Jornada
        </p>
        <h1 className="font-display mt-3 max-w-3xl text-5xl text-ink md:text-6xl">
          Como funciona o atendimento
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted">
          Um fluxo simples para você entender o que acontece em cada etapa —
          antes mesmo de contratar.
        </p>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {howItWorks.map((item) => (
            <article key={item.step} className="panel p-7 shadow-[var(--shadow)]">
              <p className="font-display text-4xl text-accent">{item.step}</p>
              <h2 className="mt-4 text-xl font-semibold text-ink">
                {item.title}
              </h2>
              <p className="mt-3 text-muted">{item.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 panel p-8 md:p-10">
          <h2 className="font-display text-3xl text-ink">
            Área do cliente
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            Depois da contratação, você acompanha status do caso, envia
            documentos, troca mensagens e consulta honorários em um só lugar.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/agendar" className="btn btn-primary">
              Agendar consulta
            </Link>
            <Link href="/login" className="btn btn-secondary">
              Acessar área do cliente
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
