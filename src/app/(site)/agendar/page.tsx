import type { Metadata } from "next";
import { BookingForm } from "@/components/forms/BookingForm";

export const metadata: Metadata = {
  title: "Agendar consulta",
};

export default function AgendarPage() {
  return (
    <div className="section-pad">
      <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm tracking-[0.16em] text-accent uppercase">
            Agenda
          </p>
          <h1 className="font-display mt-3 text-5xl text-ink md:text-6xl">
            Agendar consulta
          </h1>
          <p className="mt-5 text-lg text-muted">
            Escolha atendimento online ou presencial. Os horários listados
            respeitam a disponibilidade da semana; conflitos são bloqueados
            automaticamente.
          </p>
          <ul className="mt-8 space-y-3 text-ink-soft">
            <li>• Duração estimada: 45 a 60 minutos</li>
            <li>• Online por videoconferência</li>
            <li>• Presencial em São Paulo, com horário marcado</li>
            <li>• Confirmação enviada por e-mail</li>
          </ul>
        </div>
        <BookingForm />
      </div>
    </div>
  );
}
