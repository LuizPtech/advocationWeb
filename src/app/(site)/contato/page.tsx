import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/forms/ContactForm";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Contato",
};

export default function ContatoPage() {
  return (
    <div className="section-pad">
      <div className="container-page grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-sm tracking-[0.16em] text-accent uppercase">
            Contato
          </p>
          <h1 className="font-display mt-3 text-5xl text-ink">Fale conosco</h1>
          <p className="mt-5 text-lg text-muted">
            Envie sua mensagem ou agende diretamente um horário. Resposta em
            horário comercial.
          </p>
          <div className="mt-8 space-y-3 text-ink-soft">
            <p>
              <strong>E-mail:</strong> {brand.email}
            </p>
            <p>
              <strong>Telefone:</strong>{" "}
              <a href={brand.whatsapp} className="text-accent">
                {brand.phone}
              </a>
            </p>
            <p>
              <strong>Endereço:</strong> {brand.address}
            </p>
          </div>
          <Link href="/agendar" className="btn btn-secondary mt-8">
            Ir para agendamento
          </Link>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
