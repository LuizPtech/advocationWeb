import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/components/Icon";
import { getSteps } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Como funciona",
};

export default async function ComoFuncionaPage() {
  const steps = await getSteps();

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(900px 400px at 10% 0%, rgba(184,146,90,0.22), transparent 55%), linear-gradient(180deg, #f7ede0 0%, #fbf3e6 100%)",
          }}
        />
        <div className="container-page section-pad text-center">
          <span className="eyebrow">Jornada do atendimento</span>
          <h1 className="font-display mx-auto mt-5 max-w-3xl text-5xl text-ink md:text-6xl">
            Como funciona o atendimento
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
            Um fluxo simples e transparente — para você entender cada etapa
            antes mesmo de contratar.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-page grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <article
              key={step.id}
              className={`card-lift reveal reveal-delay-${(index % 3) + 1} panel p-7`}
            >
              <span className="badge-ico badge-ico-lg badge-ico-gold">
                <Icon name={step.icon} size={26} />
              </span>
              <p className="mt-6 text-xs tracking-[0.22em] text-gold-deep uppercase">
                Etapa {step.stepNumber}
              </p>
              <h3 className="font-display mt-2 text-xl text-ink">
                {step.title}
              </h3>
              <p className="mt-3 text-sm text-muted">{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-wine-deep text-paper">
        <div className="container-page section-pad grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <span className="eyebrow" style={{ color: "var(--gold-soft)" }}>
              Área do cliente
            </span>
            <h2 className="font-display mt-5 text-4xl leading-tight md:text-5xl">
              Tudo do seu caso em um só lugar
            </h2>
            <p className="mt-4 max-w-xl text-mist/90">
              Depois da contratação, você acessa status do processo, envia
              documentos, troca mensagens e consulta honorários — com
              autenticação segura e sigilo total.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/agendar" className="btn btn-gold">
              Agendar consulta <ArrowRight size={14} />
            </Link>
            <Link href="/login" className="btn btn-inverse">
              Acessar área do cliente
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
