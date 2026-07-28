import type { Metadata } from "next";
import Link from "next/link";
import { practiceAreas } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Áreas de atuação",
};

export default function AreasPage() {
  return (
    <div className="section-pad">
      <div className="container-page">
        <p className="text-sm tracking-[0.16em] text-accent uppercase">
          Especialidades
        </p>
        <h1 className="font-display mt-3 max-w-3xl text-5xl text-ink md:text-6xl">
          Áreas de atuação
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted">
          Atuação focada em três frentes, com linguagem clara e acompanhamento
          contínuo do início ao fim.
        </p>

        <div className="mt-14 space-y-10">
          {practiceAreas.map((area, index) => (
            <article
              key={area.slug}
              className="grid gap-6 border-t border-line pt-10 md:grid-cols-[180px_1fr_auto]"
            >
              <p className="font-display text-4xl text-accent">0{index + 1}</p>
              <div>
                <h2 className="font-display text-3xl text-ink">{area.title}</h2>
                <p className="mt-3 max-w-2xl text-muted">{area.description}</p>
              </div>
              <Link
                href={`/areas/${area.slug}`}
                className="btn btn-secondary self-start"
              >
                Detalhes
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
