import { revalidatePath } from "next/cache";
import { PlusCircle, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { db } from "@/lib/db";
import { DEFAULT_NAV_ITEMS } from "@/lib/nav";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  const items = await db.nav.list();

  return (
    <AdminShell
      title="Menu do site"
      subtitle="Adicione, esconda ou reordene os links do menu principal."
    >
      {items.length === 0 ? (
        <div className="panel p-8 text-center">
          <h2 className="font-display text-2xl text-ink">
            Menu padrão em uso
          </h2>
          <p className="mt-2 text-muted">
            Sobre, Áreas, Como funciona, Blog e Contato. Personalize
            adicionando o menu ao banco.
          </p>
          <form
            className="mt-6"
            action={async () => {
              "use server";
              for (const item of DEFAULT_NAV_ITEMS) {
                await db.nav.create(item);
              }
              revalidatePath("/admin/menu");
              revalidatePath("/", "layout");
            }}
          >
            <button type="submit" className="btn btn-gold">
              Personalizar menu
            </button>
          </form>
          <p className="mt-4 text-xs text-muted">
            Precisa executar <code>supabase/migrations.sql</code> antes (tabela{" "}
            <code>nav_items</code>).
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <form
              key={item.id}
              className="panel grid gap-3 p-5 md:grid-cols-[1fr_1fr_auto_auto_auto_auto]"
              action={async (formData) => {
                "use server";
                await db.nav.update(item.id, {
                  label: String(formData.get("label") || item.label),
                  href: String(formData.get("href") || item.href),
                  position: Number(formData.get("position") || item.position),
                  visible: formData.get("visible") === "on",
                });
                revalidatePath("/admin/menu");
                revalidatePath("/", "layout");
              }}
            >
              <div className="field">
                <label className="text-xs">Texto</label>
                <input name="label" defaultValue={item.label} required />
              </div>
              <div className="field">
                <label className="text-xs">Link</label>
                <input name="href" defaultValue={item.href} required />
              </div>
              <div className="field">
                <label className="text-xs">Ordem</label>
                <input
                  name="position"
                  type="number"
                  defaultValue={item.position}
                  className="w-24"
                />
              </div>
              <label className="flex items-center gap-2 pt-6 text-sm text-ink-soft">
                <input
                  type="checkbox"
                  name="visible"
                  defaultChecked={item.visible}
                  className="h-4 w-4 accent-[var(--wine)]"
                />
                Visível
              </label>
              <button type="submit" className="btn btn-ghost self-end text-sm">
                Salvar
              </button>
              <button
                type="submit"
                formAction={async () => {
                  "use server";
                  await db.nav.remove(item.id);
                  revalidatePath("/admin/menu");
                  revalidatePath("/", "layout");
                }}
                className="inline-flex items-center gap-1 self-end text-sm text-muted hover:text-[var(--danger)]"
              >
                <Trash2 size={14} />
              </button>
            </form>
          ))}

          <details className="panel p-6" open>
            <summary className="cursor-pointer font-semibold text-ink">
              <PlusCircle size={16} className="mr-1 inline" /> Adicionar novo
              item
            </summary>
            <form
              className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_120px_auto]"
              action={async (formData) => {
                "use server";
                const label = String(formData.get("label") || "").trim();
                const href = String(formData.get("href") || "").trim();
                const position = Number(formData.get("position") || 999);
                if (!label || !href) return;
                await db.nav.create({ label, href, position });
                revalidatePath("/admin/menu");
                revalidatePath("/", "layout");
              }}
            >
              <div className="field">
                <label className="text-xs">Texto</label>
                <input name="label" required placeholder="Ex.: Depoimentos" />
              </div>
              <div className="field">
                <label className="text-xs">Link</label>
                <input name="href" required placeholder="/depoimentos" />
              </div>
              <div className="field">
                <label className="text-xs">Ordem</label>
                <input
                  name="position"
                  type="number"
                  defaultValue={items.length + 1}
                />
              </div>
              <button type="submit" className="btn btn-primary self-end">
                Adicionar
              </button>
            </form>
            <p className="mt-3 text-xs text-muted">
              Links podem apontar para páginas do site (<code>/sobre</code>,{" "}
              <code>/blog</code>) ou URLs externas (
              <code>https://instagram.com/...</code>).
            </p>
          </details>
        </div>
      )}
    </AdminShell>
  );
}
