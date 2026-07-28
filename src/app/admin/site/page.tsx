import { revalidatePath } from "next/cache";
import { AdminShell } from "@/components/admin/AdminShell";
import { whatsappDigits } from "@/lib/brand";
import { ensureSiteSettings } from "@/lib/site-settings";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminSitePage() {
  const settings = await ensureSiteSettings();

  return (
    <AdminShell title="Editar site">
      <p className="mb-6 max-w-2xl text-muted">
        Altere nome, OAB, textos da home/sobre e dados de contato. As mudanças
        aparecem imediatamente no site público.
      </p>

      <form
        className="panel grid gap-5 p-6 md:grid-cols-2"
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
          });

          revalidatePath("/");
          revalidatePath("/sobre");
          revalidatePath("/contato");
          revalidatePath("/privacidade");
          revalidatePath("/termos");
          revalidatePath("/admin/site");
        }}
      >
        <div className="field">
          <label htmlFor="name">Nome completo (hero)</label>
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
          <input id="title" name="title" defaultValue={settings.title} required />
        </div>
        <div className="field">
          <label htmlFor="oab">OAB</label>
          <input id="oab" name="oab" defaultValue={settings.oab} required />
        </div>
        <div className="field md:col-span-2">
          <label htmlFor="tagline">Frase de apoio</label>
          <input
            id="tagline"
            name="tagline"
            defaultValue={settings.tagline}
            required
          />
        </div>
        <div className="field md:col-span-2">
          <label htmlFor="headline">Headline da home</label>
          <textarea
            id="headline"
            name="headline"
            rows={2}
            defaultValue={settings.headline}
            required
          />
        </div>
        <div className="field md:col-span-2">
          <label htmlFor="about">Texto da página Sobre</label>
          <textarea
            id="about"
            name="about"
            rows={6}
            defaultValue={settings.about}
            required
          />
        </div>
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
          <input id="phone" name="phone" defaultValue={settings.phone} required />
        </div>
        <div className="field">
          <label htmlFor="whatsapp">Link WhatsApp</label>
          <input
            id="whatsapp"
            name="whatsapp"
            defaultValue={settings.whatsapp}
            placeholder="https://wa.me/55..."
          />
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
        <button type="submit" className="btn btn-primary md:col-span-2 md:w-fit">
          Salvar alterações
        </button>
      </form>
    </AdminShell>
  );
}
