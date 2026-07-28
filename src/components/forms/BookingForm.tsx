"use client";

import { FormEvent, useMemo, useState } from "react";
import { addDays, format, getDay, setHours, setMinutes } from "date-fns";
import { practiceAreas } from "@/lib/brand";

function buildSlots() {
  const slots: { value: string; label: string }[] = [];
  const now = new Date();

  for (let dayOffset = 1; dayOffset <= 14; dayOffset += 1) {
    const day = addDays(now, dayOffset);
    const weekday = getDay(day);
    if (weekday === 0 || weekday === 6) continue;

    const hours = weekday === 5 ? [9, 10, 11, 14, 15, 16] : [9, 10, 11, 14, 15, 16, 17];
    for (const hour of hours) {
      const date = setMinutes(setHours(day, hour), 0);
      slots.push({
        value: date.toISOString(),
        label: format(date, "dd/MM/yyyy 'às' HH:mm"),
      });
    }
  }

  return slots;
}

export function BookingForm() {
  const slots = useMemo(() => buildSlots(), []);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha ao agendar");
      setStatus("ok");
      setMessage(
        "Consulta solicitada. Você receberá confirmação por e-mail em breve.",
      );
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Não foi possível agendar.",
      );
    }
  }

  return (
    <form onSubmit={onSubmit} className="panel space-y-5 p-6 shadow-[var(--shadow)] md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="field">
          <label htmlFor="name">Nome completo</label>
          <input id="name" name="name" required />
        </div>
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" required />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="field">
          <label htmlFor="phone">Telefone / WhatsApp</label>
          <input id="phone" name="phone" required />
        </div>
        <div className="field">
          <label htmlFor="area">Área</label>
          <select id="area" name="area" required defaultValue="familia">
            {practiceAreas.map((area) => (
              <option key={area.slug} value={area.slug}>
                {area.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="field">
          <label htmlFor="type">Tipo de atendimento</label>
          <select id="type" name="type" required defaultValue="ONLINE">
            <option value="ONLINE">Online (videoconferência)</option>
            <option value="PRESENCIAL">Presencial — São Paulo</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="scheduledAt">Horário</label>
          <select id="scheduledAt" name="scheduledAt" required defaultValue="">
            <option value="" disabled>
              Selecione um horário
            </option>
            {slots.map((slot) => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="notes">Breve descrição do caso</label>
        <textarea id="notes" name="notes" rows={4} />
      </div>

      <label className="flex items-start gap-3 text-sm text-muted">
        <input
          type="checkbox"
          name="lgpdConsent"
          value="true"
          required
          className="mt-1"
        />
        Autorizo o tratamento dos meus dados para agendamento e contato,
        conforme a{" "}
        <a href="/privacidade" className="text-accent underline">
          Política de Privacidade
        </a>
        .
      </label>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Agendando..." : "Solicitar horário"}
      </button>

      {message ? (
        <p
          className={
            status === "ok" ? "text-sm text-success" : "text-sm text-danger"
          }
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
