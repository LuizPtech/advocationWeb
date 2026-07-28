"use client";

import Link from "next/link";
import { ArrowLeft, Copy, Printer } from "lucide-react";

export function GeneratedDocument({
  title,
  subtitle,
  body,
  backHref,
}: {
  title: string;
  subtitle?: string;
  body: string;
  backHref: string;
}) {
  return (
    <div className="min-h-screen bg-paper">
      <div className="no-print sticky top-0 z-10 border-b border-line-soft bg-paper-elevated/95 backdrop-blur">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-4">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-wine"
          >
            <ArrowLeft size={14} /> Voltar ao modelo
          </Link>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(body);
              }}
              className="btn btn-ghost text-sm"
            >
              <Copy size={14} /> Copiar texto
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="btn btn-primary text-sm"
            >
              <Printer size={14} /> Imprimir / Salvar PDF
            </button>
          </div>
        </div>
      </div>

      <div className="container-page py-10">
        <div className="mx-auto max-w-3xl">
          <div className="no-print mb-6">
            <h1 className="font-display text-3xl text-ink">{title}</h1>
            {subtitle ? (
              <p className="mt-1 text-sm text-muted">{subtitle}</p>
            ) : null}
            <p className="mt-4 rounded-xl border border-gold-soft bg-[var(--gold-soft)]/40 px-4 py-3 text-sm text-ink-soft">
              💡 Clique em <strong>Imprimir / Salvar PDF</strong> e escolha
              “Salvar como PDF” no diálogo de impressão para gerar o arquivo.
            </p>
          </div>

          <article className="printable rounded-2xl border border-line-soft bg-white p-10 shadow-[var(--shadow-soft)] md:p-14">
            <pre className="font-serif text-base leading-relaxed whitespace-pre-wrap text-ink">
              {body}
            </pre>
          </article>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .printable {
            border: 0 !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
