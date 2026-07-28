import type { Metadata } from "next";
import { Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { getBrand } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contato",
};

export default async function ContatoPage() {
  const brand = await getBrand();

  return (
    <div className="section-pad">
      <div className="container-page grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <span className="eyebrow">Contato</span>
          <h1 className="font-display mt-5 text-5xl text-ink md:text-6xl">
            Fale conosco
          </h1>
          <p className="mt-5 text-lg text-muted">
            Envie sua mensagem ou agende diretamente um horário. Resposta em
            horário comercial.
          </p>

          <div className="mt-10 space-y-4">
            <a
              href={brand.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="panel flex items-center gap-4 p-5 hover:border-wine"
            >
              <span className="badge-ico badge-ico-wine">
                <MessageSquare size={20} />
              </span>
              <div>
                <p className="text-xs tracking-[0.2em] text-muted uppercase">
                  WhatsApp
                </p>
                <p className="font-semibold text-ink">{brand.phone}</p>
              </div>
            </a>
            <a
              href={`mailto:${brand.email}`}
              className="panel flex items-center gap-4 p-5 hover:border-wine"
            >
              <span className="badge-ico badge-ico-wine">
                <Mail size={20} />
              </span>
              <div className="min-w-0">
                <p className="text-xs tracking-[0.2em] text-muted uppercase">
                  E-mail
                </p>
                <p className="font-semibold break-all text-ink">
                  {brand.email}
                </p>
              </div>
            </a>
            <a
              href={`tel:+${brand.phoneHref}`}
              className="panel flex items-center gap-4 p-5 hover:border-wine"
            >
              <span className="badge-ico badge-ico-wine">
                <Phone size={20} />
              </span>
              <div>
                <p className="text-xs tracking-[0.2em] text-muted uppercase">
                  Telefone
                </p>
                <p className="font-semibold text-ink">{brand.phone}</p>
              </div>
            </a>
            <div className="panel flex items-center gap-4 p-5">
              <span className="badge-ico badge-ico-wine">
                <MapPin size={20} />
              </span>
              <div>
                <p className="text-xs tracking-[0.2em] text-muted uppercase">
                  Endereço
                </p>
                <p className="font-semibold text-ink">{brand.address}</p>
              </div>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
