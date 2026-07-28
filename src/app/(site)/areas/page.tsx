import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Scale, ShieldCheck, Users } from "lucide-react";
import { practiceAreas } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Áreas de atuação",
};

const areaIcons: Record<string, typeof Scale> = {
  familia: Users,
  sucessoes: ShieldCheck,
  imobiliario: Scale,
};

export default function AreasPage() {
  return (
    <div className="section-pad">
      <div className="container-page">
        <div className="text-center">
          <span className="eyebrow">Especialidades</span>
          <h1 className="font-display mt-5 text-5xl text-ink md:text-6xl">
            Áreas de atuação
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Atendimento especializado, com linguagem clara e acompanhamento
            próximo em cada etapa.
          </p>
        </div>

        <div className="mt-14 grid gap-8">
          {practiceAreas.map((area, index) => {
            const Icon = areaIcons[area.slug] || Scale;
            const isEven = index % 2 === 0;
            return (
              <article
                key={area.slug}
                className={`panel grid gap-8 p-8 md:p-10 md:grid-cols-[1fr_1.6fr] md:items-center ${
                  isEven ? "" : "md:[&>*:first-child]:order-2"
                }`}
              >
                <div className="flex flex-col items-start gap-5">
                  <span className="badge-ico badge-ico-lg badge-ico-gold">
                    <Icon size={30} />
                  </span>
                  <p className="text-xs tracking-[0.22em] text-gold-deep uppercase">
                    0{index + 1}
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-3xl text-ink md:text-4xl">
                    {area.title}
                  </h2>
                  <p className="mt-4 text-muted">{area.description}</p>

                  <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                    {area.topics.map((topic) => (
                      <li
                        key={topic}
                        className="flex items-start gap-2 text-sm text-ink-soft"
                      >
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gold" />
                        {topic}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href={`/areas/${area.slug}`}
                      className="btn btn-primary"
                    >
                      Detalhes <ArrowRight size={14} />
                    </Link>
                    <Link href="/agendar" className="btn btn-secondary">
                      Agendar consulta
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
