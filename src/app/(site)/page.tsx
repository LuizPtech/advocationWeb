import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Icon } from "@/components/Icon";
import { getAreas, getFaq, getSteps } from "@/lib/content";
import { getBrand } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [brand, areas, steps, faq] = await Promise.all([
    getBrand(),
    getAreas(),
    getSteps(),
    getFaq(),
  ]);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(1200px 500px at 90% -10%, rgba(184,146,90,0.25), transparent 60%), radial-gradient(900px 400px at -10% 10%, rgba(122,31,46,0.16), transparent 55%), linear-gradient(180deg, #f7ede0 0%, #fbf3e6 100%)",
          }}
        />
        <div
          className={
            brand.showPhoto
              ? "container-page grid gap-14 py-16 md:grid-cols-[1.15fr_0.95fr] md:items-center md:py-24"
              : "container-page py-16 text-center md:py-28"
          }
        >
          <div className={brand.showPhoto ? "reveal" : "reveal mx-auto max-w-3xl"}>
            <span className={`eyebrow ${brand.showPhoto ? "" : "justify-center"}`}>
              Escritório de advocacia
            </span>
            <h1 className="font-display mt-6 text-5xl leading-[1.02] text-ink md:text-6xl lg:text-7xl">
              {brand.tagline}
            </h1>
            <p
              className={`mt-6 text-lg text-muted ${brand.showPhoto ? "max-w-lg" : "mx-auto max-w-2xl"}`}
            >
              {brand.headline}
            </p>

            <div
              className={`mt-9 flex flex-wrap gap-3 ${brand.showPhoto ? "" : "justify-center"}`}
            >
              <Link href="/agendar" className="btn btn-gold">
                Agendar consulta gratuita
                <ArrowRight size={16} />
              </Link>
              <Link
                href={brand.whatsapp}
                target="_blank"
                className="btn btn-secondary"
              >
                Falar no WhatsApp
              </Link>
            </div>

            <div
              className={`mt-10 flex flex-wrap items-center gap-6 text-sm text-muted ${brand.showPhoto ? "" : "justify-center"}`}
            >
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-gold" />
                Atendimento humanizado
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-gold" />
                Sigilo e ética profissional
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-gold" />
                {brand.oab}
              </div>
            </div>
          </div>

          {brand.showPhoto ? (
            <div className="reveal reveal-delay-2 drift">
              <div className="portrait-frame">
                <span className="flourish tl">✧</span>
                <span className="flourish br">✦</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={brand.photoUrl} alt={brand.name} />
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* AREAS */}
      {areas.length > 0 ? (
        <section className="section-pad">
          <div className="container-page">
            <div className="text-center">
              <span className="eyebrow">Como podemos te ajudar</span>
              <h2 className="font-display mt-5 text-4xl text-ink md:text-5xl">
                Áreas de atuação
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted">
                Atendimento especializado com foco em soluções claras e humanas
                para cada história.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {areas.map((area, index) => (
                <Link
                  key={area.id}
                  href={`/areas/${area.slug}`}
                  className={`card-lift reveal reveal-delay-${(index % 3) + 1} panel flex flex-col p-8`}
                >
                  <span className="badge-ico">
                    <Icon name={area.icon} size={24} />
                  </span>
                  <h3 className="font-display mt-5 text-2xl text-ink">
                    {area.title}
                  </h3>
                  <p className="mt-3 flex-1 text-muted">{area.short}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-wine">
                    Saiba mais <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link href="/agendar" className="btn btn-gold">
                Agendar consulta gratuita
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* SOBRE */}
      <section className="bg-wine-deep text-paper">
        <div
          className={
            brand.showPhoto
              ? "container-page section-pad grid gap-12 md:grid-cols-[0.85fr_1.15fr] md:items-center"
              : "container-page section-pad text-center"
          }
        >
          {brand.showPhoto ? (
            <div className="relative">
              <div
                className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden"
                style={{ borderRadius: "220px 220px 24px 24px" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={brand.photoUrl}
                  alt={brand.name}
                  className="h-full w-full object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 ring-1 ring-gold/50"
                  style={{ borderRadius: "220px 220px 24px 24px" }}
                />
              </div>
              <span className="font-display absolute -bottom-6 -left-2 text-6xl text-gold/60">
                ✦
              </span>
            </div>
          ) : null}

          <div className={brand.showPhoto ? "" : "mx-auto max-w-2xl"}>
            <span
              className={`eyebrow ${brand.showPhoto ? "" : "justify-center"}`}
              style={{ color: "var(--gold-soft)" }}
            >
              Quem irá trabalhar ao seu favor
            </span>
            {!brand.showPhoto ? (
              <p className="font-display mt-6 text-3xl text-gold/60">✦</p>
            ) : null}
            <h2 className="font-display mt-5 text-4xl leading-tight text-paper md:text-5xl">
              {brand.name}
            </h2>
            <p className="mt-3 text-sm tracking-[0.22em] text-gold-soft uppercase">
              {brand.oab}
            </p>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-mist/90 whitespace-pre-line">
              {brand.about}
            </div>
            <div
              className={`mt-8 flex flex-wrap gap-3 ${brand.showPhoto ? "" : "justify-center"}`}
            >
              <Link href="/sobre" className="btn btn-inverse">
                Conhecer mais
              </Link>
              <Link href="/agendar" className="btn btn-gold">
                Agendar consulta
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      {steps.length > 0 ? (
        <section className="section-pad">
          <div className="container-page">
            <div className="text-center">
              <span className="eyebrow">Como será o atendimento</span>
              <h2 className="font-display mt-5 text-4xl text-ink md:text-5xl">
                Entenda cada etapa do processo
              </h2>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`card-lift reveal reveal-delay-${(index % 3) + 1} panel-warm p-7 text-center`}
                >
                  <div className="mx-auto flex items-center justify-center">
                    <span className="badge-ico badge-ico-lg badge-ico-gold">
                      <Icon name={step.icon} size={28} />
                    </span>
                  </div>
                  <p className="mt-6 text-xs tracking-[0.22em] text-gold-deep uppercase">
                    Etapa {step.stepNumber}
                  </p>
                  <h3 className="font-display mt-2 text-xl text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link href="/agendar" className="btn btn-primary">
                Agendar minha consulta
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* CONTATO */}
      <section className="bg-paper-warm">
        <div className="container-page section-pad">
          <div className="text-center">
            <span className="eyebrow">Outras formas de me contatar</span>
            <h2 className="font-display mt-5 text-4xl text-ink md:text-5xl">
              Estou a um clique de distância
            </h2>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <a
              href={brand.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="card-lift panel flex items-center gap-5 p-6"
            >
              <span className="badge-ico badge-ico-wine">
                <MessageSquare size={22} />
              </span>
              <div>
                <p className="text-xs tracking-[0.22em] text-muted uppercase">
                  WhatsApp
                </p>
                <p className="mt-1 font-semibold text-ink">{brand.phone}</p>
              </div>
            </a>
            <a
              href={`mailto:${brand.email}`}
              className="card-lift panel flex items-center gap-5 p-6"
            >
              <span className="badge-ico badge-ico-wine">
                <Mail size={22} />
              </span>
              <div>
                <p className="text-xs tracking-[0.22em] text-muted uppercase">
                  E-mail
                </p>
                <p className="mt-1 font-semibold break-all text-ink">
                  {brand.email}
                </p>
              </div>
            </a>
            <a
              href={`tel:+${brand.phoneHref}`}
              className="card-lift panel flex items-center gap-5 p-6"
            >
              <span className="badge-ico badge-ico-wine">
                <Phone size={22} />
              </span>
              <div>
                <p className="text-xs tracking-[0.22em] text-muted uppercase">
                  Telefone
                </p>
                <p className="mt-1 font-semibold text-ink">{brand.phone}</p>
              </div>
            </a>
            <div className="panel flex items-center gap-5 p-6 sm:col-span-2 lg:col-span-3">
              <span className="badge-ico badge-ico-wine">
                <MapPin size={22} />
              </span>
              <div>
                <p className="text-xs tracking-[0.22em] text-muted uppercase">
                  Endereço
                </p>
                <p className="mt-1 font-semibold text-ink">{brand.address}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faq.length > 0 ? (
        <section className="section-pad">
          <div className="container-page max-w-3xl">
            <div className="text-center">
              <span className="eyebrow">Perguntas frequentes</span>
              <h2 className="font-display mt-5 text-4xl text-ink md:text-5xl">
                Dúvidas comuns dos clientes
              </h2>
            </div>

            <div className="mt-12">
              {faq.map((item) => (
                <details key={item.id} className="accordion-item">
                  <summary>{item.question}</summary>
                  <div className="accordion-body">{item.answer}</div>
                </details>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-muted">Não achou sua resposta?</p>
              <Link href="/contato" className="btn btn-primary mt-4">
                Enviar minha pergunta
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
