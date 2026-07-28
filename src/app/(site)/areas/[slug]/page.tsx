import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { getAreaBySlug, practiceAreas } from "@/lib/brand";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return practiceAreas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const area = getAreaBySlug(slug);
  return { title: area?.title ?? "Área" };
}

export default async function AreaDetailPage({ params }: Props) {
  const { slug } = await params;
  const area = getAreaBySlug(slug);
  if (!area) notFound();

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(900px 400px at 90% 0%, rgba(184,146,90,0.22), transparent 55%), linear-gradient(180deg, #f7ede0 0%, #fbf3e6 100%)",
          }}
        />
        <div className="container-page section-pad">
          <Link
            href="/areas"
            className="inline-flex items-center gap-1 text-sm font-semibold text-wine"
          >
            <ArrowLeft size={14} /> Todas as áreas
          </Link>
          <span className="eyebrow mt-8">Especialidade</span>
          <h1 className="font-display mt-4 max-w-3xl text-5xl text-ink md:text-6xl">
            {area.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            {area.description}
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid gap-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="font-display text-3xl text-ink">
              Temas frequentes
            </h2>
            <ul className="mt-6 space-y-3">
              {area.topics.map((topic) => (
                <li
                  key={topic}
                  className="flex items-start gap-3 rounded-xl border border-line-soft bg-paper-elevated p-4"
                >
                  <span className="mt-1 text-gold">
                    <CheckCircle2 size={18} />
                  </span>
                  <span className="text-ink-soft">{topic}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="panel h-fit p-8">
            <h3 className="font-display text-2xl text-ink">
              Quer conversar sobre isso?
            </h3>
            <p className="mt-3 text-muted">
              Agende uma consulta e receba orientação clara para o seu caso.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/agendar" className="btn btn-primary">
                Agendar consulta <ArrowRight size={14} />
              </Link>
              <Link href="/contato" className="btn btn-secondary">
                Tirar dúvida
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
