import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
    <div className="section-pad">
      <div className="container-page max-w-3xl">
        <Link href="/areas" className="text-sm font-semibold text-accent">
          ← Todas as áreas
        </Link>
        <h1 className="font-display mt-6 text-5xl text-ink md:text-6xl">
          {area.title}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-ink-soft">
          {area.description}
        </p>

        <h2 className="font-display mt-12 text-3xl text-ink">
          Temas frequentes
        </h2>
        <ul className="mt-6 space-y-3">
          {area.topics.map((topic) => (
            <li
              key={topic}
              className="border-l-2 border-accent pl-4 text-ink-soft"
            >
              {topic}
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/agendar" className="btn btn-primary">
            Agendar consulta nesta área
          </Link>
          <Link href="/contato" className="btn btn-secondary">
            Tirar dúvida
          </Link>
        </div>
      </div>
    </div>
  );
}
