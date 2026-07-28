"use client";

import { FormEvent, useState } from "react";
import { practiceAreas } from "@/lib/brand";

export function ContactForm() {
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha ao enviar");
      setStatus("ok");
      setMessage("Mensagem enviada. Retorno em até 1 dia útil.");
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Não foi possível enviar.",
      );
    }
  }

  return (
    <form onSubmit={onSubmit} className="panel space-y-5 p-6 shadow-[var(--shadow)] md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="field">
          <label htmlFor="name">Nome</label>
          <input id="name" name="name" required />
        </div>
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" required />
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="field">
          <label htmlFor="phone">Telefone</label>
          <input id="phone" name="phone" />
        </div>
        <div className="field">
          <label htmlFor="area">Área</label>
          <select id="area" name="area" defaultValue="">
            <option value="" disabled>
              Selecione
            </option>
            {practiceAreas.map((area) => (
              <option key={area.slug} value={area.slug}>
                {area.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="subject">Assunto</label>
        <input id="subject" name="subject" required />
      </div>
      <div className="field">
        <label htmlFor="message">Mensagem</label>
        <textarea id="message" name="message" rows={5} required />
      </div>
      <label className="flex items-start gap-3 text-sm text-muted">
        <input
          type="checkbox"
          name="lgpdConsent"
          value="true"
          required
          className="mt-1"
        />
        Concordo com o tratamento dos meus dados conforme a{" "}
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
        {status === "loading" ? "Enviando..." : "Enviar mensagem"}
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
