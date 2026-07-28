import { revalidatePath } from "next/cache";
import { PlusCircle, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Icon } from "@/components/Icon";
import { db } from "@/lib/db";
import { STEP_ICON_CHOICES, getSteps } from "@/lib/content";
import { howItWorks as defaults } from "@/lib/brand";

export const dynamic = "force-dynamic";

export default async function AdminComoFuncionaPage() {
  const items = await getSteps();
  const persisted = await db.howItWorks.list();
  const isPersisted = persisted.length > 0;

  return (
    <AdminShell
      title="Como funciona"
      subtitle="Etapas mostradas na home e em /como-funciona."
    >
      {!isPersisted ? (
        <form
          className="panel mb-6 p-6"
          action={async () => {
            "use server";
            for (const [index, step] of defaults.entries()) {
              await db.howItWorks.create({
                stepNumber: step.step,
                icon: step.icon,
                title: step.title,
                body: step.text,
                position: index,
              });
            }
            revalidatePath("/admin/como-funciona");
            revalidatePath("/", "layout");
          }}
        >
          <h2 className="font-display text-2xl text-ink">
            Instalar etapas padrão
          </h2>
          <p className="mt-2 text-muted">
            Começa com 4 etapas (Contato, Consulta, Estratégia,
            Acompanhamento). Depois você edita à vontade.
          </p>
          <button type="submit" className="btn btn-gold mt-4">
            Instalar
          </button>
        </form>
      ) : null}

      <div className="space-y-4">
        {items.map((item) => (
          <form
            key={item.id}
            className="panel p-5"
            action={async (formData) => {
              "use server";
              await db.howItWorks.update(item.id, {
                stepNumber: String(formData.get("stepNumber") || item.stepNumber),
                icon: String(formData.get("icon") || item.icon),
                title: String(formData.get("title") || item.title),
                body: String(formData.get("body") || item.body),
                position: Number(formData.get("position") || item.position),
              });
              revalidatePath("/admin/como-funciona");
              revalidatePath("/", "layout");
            }}
          >
            <div className="flex items-start gap-4">
              <span className="badge-ico badge-ico-gold">
                <Icon name={item.icon} size={22} />
              </span>
              <div className="flex-1 grid gap-3 md:grid-cols-[100px_100px_1fr]">
                <div className="field">
                  <label>Nº</label>
                  <input
                    name="stepNumber"
                    defaultValue={item.stepNumber}
                    disabled={!isPersisted}
                  />
                </div>
                <div className="field">
                  <label>Ícone</label>
                  <select
                    name="icon"
                    defaultValue={item.icon}
                    disabled={!isPersisted}
                  >
                    {STEP_ICON_CHOICES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Título</label>
                  <input
                    name="title"
                    defaultValue={item.title}
                    disabled={!isPersisted}
                  />
                </div>
              </div>
              <div className="w-20">
                <div className="field">
                  <label>Ordem</label>
                  <input
                    type="number"
                    name="position"
                    defaultValue={item.position}
                    disabled={!isPersisted}
                  />
                </div>
              </div>
            </div>
            <div className="field mt-3">
              <label>Descrição</label>
              <textarea
                name="body"
                rows={2}
                defaultValue={item.body}
                disabled={!isPersisted}
              />
            </div>
            {isPersisted ? (
              <div className="mt-3 flex gap-3">
                <button type="submit" className="btn btn-ghost text-sm">
                  Salvar
                </button>
                <button
                  type="submit"
                  formAction={async () => {
                    "use server";
                    await db.howItWorks.remove(item.id);
                    revalidatePath("/admin/como-funciona");
                    revalidatePath("/", "layout");
                  }}
                  className="inline-flex items-center gap-1 text-sm text-muted hover:text-[var(--danger)]"
                >
                  <Trash2 size={14} /> Remover
                </button>
              </div>
            ) : null}
          </form>
        ))}
      </div>

      {isPersisted ? (
        <details className="panel mt-8 p-6" open>
          <summary className="cursor-pointer font-semibold text-ink">
            <PlusCircle size={16} className="mr-1 inline" /> Nova etapa
          </summary>
          <form
            className="mt-4 grid gap-3 md:grid-cols-[100px_140px_1fr_100px_auto]"
            action={async (formData) => {
              "use server";
              const stepNumber = String(formData.get("stepNumber") || "").trim();
              const icon = String(formData.get("icon") || "message");
              const title = String(formData.get("title") || "").trim();
              const body = String(formData.get("body") || "").trim();
              const pos = Number(formData.get("position") || 999);
              if (!stepNumber || !title || !body) return;
              await db.howItWorks.create({
                stepNumber,
                icon,
                title,
                body,
                position: pos,
              });
              revalidatePath("/admin/como-funciona");
              revalidatePath("/", "layout");
            }}
          >
            <div className="field">
              <label>Nº</label>
              <input name="stepNumber" required placeholder="05" />
            </div>
            <div className="field">
              <label>Ícone</label>
              <select name="icon" defaultValue="message">
                {STEP_ICON_CHOICES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Título</label>
              <input name="title" required />
            </div>
            <div className="field">
              <label>Ordem</label>
              <input
                type="number"
                name="position"
                defaultValue={items.length + 1}
              />
            </div>
            <div className="flex items-end">
              <button type="submit" className="btn btn-primary text-sm">
                Adicionar
              </button>
            </div>
            <div className="field md:col-span-5">
              <label>Descrição</label>
              <textarea name="body" rows={2} required />
            </div>
          </form>
        </details>
      ) : null}
    </AdminShell>
  );
}
