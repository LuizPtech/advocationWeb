"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { defaultBrand } from "@/lib/brand";
import type { SettingsRow } from "@/lib/db";
import { saveSiteAction, type SaveSiteState } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="btn btn-primary w-fit"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 size={16} className="animate-spin" /> Salvando...
        </>
      ) : (
        "Salvar alterações"
      )}
    </button>
  );
}

export function SiteForm({ settings }: { settings: SettingsRow }) {
  const [state, formAction] = useActionState<SaveSiteState, FormData>(
    saveSiteAction,
    null,
  );

  return (
    <form action={formAction} className="panel grid gap-6 p-8">
      <section>
        <h2 className="font-display text-2xl text-ink">Fotos</h2>
        <p className="mt-1 text-sm text-muted">
          Você pode exibir uma foto no hero e na página Sobre — ou desativar
          se preferir um visual apenas com tipografia.
        </p>

        <label className="mt-5 flex items-start gap-3 rounded-xl border border-line-soft bg-paper-elevated p-4">
          <input
            type="checkbox"
            name="showPhoto"
            defaultChecked={settings.showPhoto}
            className="mt-1 h-4 w-4 accent-[var(--wine)]"
          />
          <span>
            <span className="block font-semibold text-ink">
              Mostrar foto no site
            </span>
            <span className="mt-1 block text-sm text-muted">
              Se desmarcado, as seções do hero e Sobre usam um layout sem foto,
              com composição tipográfica.
            </span>
          </span>
        </label>

        <div className="mt-5 grid gap-6 md:grid-cols-2">
          <div className="field">
            <label htmlFor="photoUrl">Foto principal (hero e Sobre)</label>
            <input
              id="photoUrl"
              name="photoUrl"
              defaultValue={settings.photoUrl || defaultBrand.photoUrl}
              placeholder="https://..."
            />
            <p className="text-xs text-muted">
              Cole o link (URL) da foto. Ignorado quando “mostrar foto” está
              desmarcado.
            </p>
            {settings.showPhoto && settings.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.photoUrl}
                alt="Preview"
                className="mt-3 h-40 w-40 rounded-full border border-line object-cover"
              />
            ) : null}
          </div>
          <div className="field">
            <label htmlFor="heroImageUrl">Imagem de fundo (opcional)</label>
            <input
              id="heroImageUrl"
              name="heroImageUrl"
              defaultValue={settings.heroImageUrl || ""}
              placeholder="https://..."
            />
            <p className="text-xs text-muted">
              Deixe em branco para usar o fundo padrão.
            </p>
          </div>
        </div>
      </section>

      <hr className="border-line-soft" />

      <section>
        <h2 className="font-display text-2xl text-ink">Identidade</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="field">
            <label htmlFor="name">Nome completo</label>
            <input id="name" name="name" defaultValue={settings.name} required />
          </div>
          <div className="field">
            <label htmlFor="shortName">Nome curto (menu)</label>
            <input
              id="shortName"
              name="shortName"
              defaultValue={settings.shortName}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="title">Título profissional</label>
            <input
              id="title"
              name="title"
              defaultValue={settings.title}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="oab">OAB</label>
            <input id="oab" name="oab" defaultValue={settings.oab} required />
          </div>
        </div>
      </section>

      <hr className="border-line-soft" />

      <section>
        <h2 className="font-display text-2xl text-ink">Textos do site</h2>
        <div className="mt-5 grid gap-5">
          <div className="field">
            <label htmlFor="tagline">Título principal (hero)</label>
            <input
              id="tagline"
              name="tagline"
              defaultValue={settings.tagline}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="headline">Subtítulo (hero)</label>
            <textarea
              id="headline"
              name="headline"
              rows={2}
              defaultValue={settings.headline}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="about">Texto da página Sobre</label>
            <textarea
              id="about"
              name="about"
              rows={6}
              defaultValue={settings.about}
              required
            />
          </div>
        </div>
      </section>

      <hr className="border-line-soft" />

      <section>
        <h2 className="font-display text-2xl text-ink">Contato</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={settings.email}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="phone">Telefone</label>
            <input
              id="phone"
              name="phone"
              defaultValue={settings.phone}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="whatsapp">Link do WhatsApp</label>
            <input
              id="whatsapp"
              name="whatsapp"
              defaultValue={settings.whatsapp}
              placeholder="https://wa.me/55..."
            />
            <p className="text-xs text-muted">
              Deixe em branco para gerar automaticamente pelo telefone.
            </p>
          </div>
          <div className="field">
            <label htmlFor="city">Cidade</label>
            <input id="city" name="city" defaultValue={settings.city} required />
          </div>
          <div className="field md:col-span-2">
            <label htmlFor="address">Endereço</label>
            <input
              id="address"
              name="address"
              defaultValue={settings.address}
              required
            />
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton />
        {state ? (
          <span
            role="status"
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
              state.ok
                ? "bg-[var(--wine-soft)] text-[var(--wine-deep)]"
                : "bg-red-100 text-[var(--danger)]"
            }`}
          >
            {state.ok ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            {state.message}
          </span>
        ) : null}
      </div>
    </form>
  );
}
