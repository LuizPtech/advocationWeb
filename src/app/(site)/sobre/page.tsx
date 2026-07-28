import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getBrand } from "@/lib/site-settings";
import { practiceAreas } from "@/lib/brand";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();
  return {
    title: "Sobre",
    description: `Conheça a trajetória de ${brand.name}.`,
  };
}

export default async function SobrePage() {
  const brand = await getBrand();

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(1000px 400px at 10% 0%, rgba(184,146,90,0.25), transparent 55%), linear-gradient(180deg, #f7ede0 0%, #fbf3e6 100%)",
          }}
        />
        <div
          className={
            brand.showPhoto
              ? "container-page section-pad grid gap-14 md:grid-cols-[0.85fr_1.15fr] md:items-center"
              : "container-page section-pad text-center"
          }
        >
          {brand.showPhoto ? (
            <div className="reveal">
              <div className="portrait-frame">
                <span className="flourish tl">✧</span>
                <span className="flourish br">✦</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={brand.photoUrl} alt={brand.name} />
              </div>
            </div>
          ) : null}

          <div
            className={
              brand.showPhoto ? "reveal reveal-delay-1" : "reveal mx-auto max-w-3xl"
            }
          >
            <span className={`eyebrow ${brand.showPhoto ? "" : "justify-center"}`}>
              Sobre
            </span>
            {!brand.showPhoto ? (
              <p className="font-display mt-6 text-4xl text-gold/70">✦</p>
            ) : null}
            <h1 className="font-display mt-5 text-5xl leading-tight text-ink md:text-6xl">
              {brand.name}
            </h1>
            <p className="mt-3 text-sm tracking-[0.22em] text-gold-deep uppercase">
              {brand.title} · {brand.oab}
            </p>
            <div
              className={`mt-8 space-y-5 text-lg leading-relaxed text-ink-soft whitespace-pre-line ${
                brand.showPhoto ? "" : "mx-auto"
              }`}
            >
              {brand.about}
            </div>
            <div
              className={`mt-10 flex flex-wrap gap-3 ${brand.showPhoto ? "" : "justify-center"}`}
            >
              <Link href="/agendar" className="btn btn-gold">
                Agendar consulta <ArrowRight size={16} />
              </Link>
              <Link href="/areas" className="btn btn-secondary">
                Ver áreas de atuação
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper-warm">
        <div className="container-page section-pad">
          <div className="text-center">
            <span className="eyebrow">Compromisso</span>
            <h2 className="font-display mt-5 text-4xl text-ink md:text-5xl">
              O que você pode esperar
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Escuta atenta",
                text: "Antes de qualquer estratégia, entendo o seu caso com calma e cuidado.",
              },
              {
                title: "Linguagem clara",
                text: "Nada de juridiquês. Você entende cada passo e o porquê de cada decisão.",
              },
              {
                title: "Acompanhamento próximo",
                text: "Status do processo, prazos e documentos organizados na área do cliente.",
              },
            ].map((item) => (
              <div key={item.title} className="panel p-7">
                <span className="badge-ico badge-ico-gold">
                  <CheckCircle2 size={22} />
                </span>
                <h3 className="font-display mt-5 text-xl text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <div className="text-center">
            <span className="eyebrow">Especialidades</span>
            <h2 className="font-display mt-5 text-4xl text-ink md:text-5xl">
              Áreas em que atuo
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {practiceAreas.map((area) => (
              <Link
                key={area.slug}
                href={`/areas/${area.slug}`}
                className="card-lift panel p-7"
              >
                <h3 className="font-display text-2xl text-ink">
                  {area.title}
                </h3>
                <p className="mt-3 text-muted">{area.short}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-wine">
                  Detalhes <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
