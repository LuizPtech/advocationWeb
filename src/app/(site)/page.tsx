import Link from "next/link";
import { brand, howItWorks, practiceAreas } from "@/lib/brand";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "linear-gradient(105deg, rgba(11,28,36,0.88) 0%, rgba(11,28,36,0.55) 42%, rgba(11,28,36,0.25) 100%), url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=2000&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="container-page grid min-h-[88vh] items-end gap-10 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-24">
          <div className="reveal text-paper">
            <p className="font-display text-5xl leading-[0.95] tracking-tight md:text-7xl">
              {brand.name}
            </p>
            <h1 className="mt-6 max-w-xl text-xl leading-relaxed text-mist md:text-2xl">
              Advocacia em família, trabalho e relações de consumo — com clareza
              desde o primeiro contato.
            </h1>
            <p className="mt-4 max-w-lg text-base text-mist/90">{brand.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/agendar" className="btn btn-primary">
                Agendar consulta
              </Link>
              <Link
                href="/sobre"
                className="btn border border-paper/40 bg-transparent text-paper hover:bg-paper hover:text-ink"
              >
                Conhecer a trajetória
              </Link>
            </div>
          </div>

          <div className="hero-visual reveal reveal-delay-2 hidden md:block">
            <div className="border border-paper/20 bg-paper/10 p-8 backdrop-blur-sm">
              <p className="text-xs tracking-[0.18em] text-mist uppercase">
                Atendimento
              </p>
              <p className="font-display mt-3 text-4xl text-paper">
                Online e presencial
              </p>
              <p className="mt-4 text-sm leading-relaxed text-mist">
                Consultas com horário marcado em São Paulo ou por
                videoconferência. Acompanhamento contínuo na área do cliente.
              </p>
              <p className="mt-6 text-sm text-mist">{brand.oab}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="text-sm tracking-[0.16em] text-accent uppercase">
              Áreas de atuação
            </p>
            <h2 className="font-display mt-3 text-4xl text-ink md:text-5xl">
              Três frentes. Uma escuta atenta.
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {practiceAreas.map((area, index) => (
              <Link
                key={area.slug}
                href={`/areas/${area.slug}`}
                className={`group reveal reveal-delay-${index + 1} border-t border-ink/20 pt-6 transition-colors hover:border-accent`}
              >
                <p className="text-xs tracking-[0.14em] text-muted uppercase">
                  0{index + 1}
                </p>
                <h3 className="font-display mt-3 text-3xl text-ink group-hover:text-accent">
                  {area.title}
                </h3>
                <p className="mt-3 text-muted">{area.short}</p>
                <span className="mt-6 inline-block text-sm font-semibold text-accent">
                  Saiba mais →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line/80 bg-ink text-paper">
        <div className="container-page section-pad grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm tracking-[0.16em] text-accent-soft uppercase">
              Como funciona
            </p>
            <h2 className="font-display mt-3 text-4xl md:text-5xl">
              Do primeiro contato ao acompanhamento do caso
            </h2>
          </div>
          <div className="space-y-8">
            {howItWorks.map((item) => (
              <div key={item.step} className="grid grid-cols-[auto_1fr] gap-4">
                <p className="font-display text-3xl text-accent-soft">
                  {item.step}
                </p>
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-mist">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page panel overflow-hidden shadow-[var(--shadow)]">
          <div className="grid md:grid-cols-2">
            <div
              className="min-h-[280px] bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1400&q=80')",
              }}
            />
            <div className="flex flex-col justify-center p-8 md:p-12">
              <p className="text-sm tracking-[0.16em] text-accent uppercase">
                Próximo passo
              </p>
              <h2 className="font-display mt-3 text-4xl text-ink">
                Agende uma consulta e receba orientação objetiva
              </h2>
              <p className="mt-4 text-muted">
                Horários disponíveis para atendimento online ou presencial.
                Você também pode falar pelo WhatsApp.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/agendar" className="btn btn-primary">
                  Ver horários
                </Link>
                <Link href="/contato" className="btn btn-secondary">
                  Enviar mensagem
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
