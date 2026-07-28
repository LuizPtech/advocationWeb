import { revalidatePath } from "next/cache";
import { AdminShell } from "@/components/admin/AdminShell";
import { defaultBrand, whatsappDigits } from "@/lib/brand";
import { ensureSiteSettings } from "@/lib/site-settings";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminSitePage() {
  const settings = await ensureSiteSettings();

  return (
    <AdminShell title="Editar site">
      <p className="mb-6 max-w-2xl text-muted">
        Altere fotos, textos e informações de contato. As mudanças aparecem
        imediatamente no site público.
      </p>

      <form
        className="panel grid gap-6 p-8"
        action={async (formData) => {
          "use server";
          const phone = String(formData.get("phone") || "").trim();
          const digits = whatsappDigits(phone);
          const whatsappRaw = String(formData.get("whatsapp") || "").trim();

          await db.settings.upsert({
            name: String(formData.get("name") || ""),
            shortName: String(formData.get("shortName") || ""),
            title: String(formData.get("title") || "Advogada"),
            oab: String(formData.get("oab") || ""),
            tagline: String(formData.get("tagline") || ""),
            headline: String(formData.get("headline") || ""),
            about: String(formData.get("about") || ""),
            email: String(formData.get("email") || ""),
            phone,
            whatsapp: whatsappRaw || (digits ? `https://wa.me/${digits}` : ""),
            address: String(formData.get("address") || ""),
            city: String(formData.get("city") || ""),
            photoUrl: String(formData.get("photoUrl") || "") || null,
            heroImageUrl: String(formData.get("heroImageUrl") || "") || null,
          });

          revalidatePath("/");
          revalidatePath("/sobre");
          revalidatePath("/contato");
          revalidatePath("/privacidade");
          revalidatePath("/termos");
          revalidatePath("/admin/site");
        }}
      >
        <section>
          <h2 className="font-display text-2xl text-ink">Fotos</h2>
          <p className="mt-1 text-sm text-muted">
            Cole o link (URL) da foto — pode ser Instagram, Google Fotos, ou
            qualquer imagem hospedada online. Recomendado: foto quadrada,
            iluminação suave.
          </p>
          <div className="mt-5 grid gap-6 md:grid-cols-2">
            <div className="field">
              <label htmlFor="photoUrl">Foto principal (hero e Sobre)</label>
              <input
                id="photoUrl"
                name="photoUrl"
                defaultValue={settings.photoUrl || defaultBrand.photoUrl}
                placeholder="https://..."
              />
              {settings.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.photoUrl}
                  alt="Preview"
                  className="mt-3 h-40 w-40 rounded-full border border-line object-cover"
                />
              ) : null}
            </div>
            <div className="field">
              <label htmlFor="heroImageUrl">
                Imagem de fundo (opcional)
              </label>
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
              <p className="text-xs text-muted">
                Ex.: “Advocacia especializada em Direito das Famílias”
              </p>
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
              <input
                id="city"
                name="city"
                defaultValue={settings.city}
                required
              />
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

        <button type="submit" className="btn btn-primary w-fit">
          Salvar alterações
        </button>
      </form>
    </AdminShell>
  );
}
