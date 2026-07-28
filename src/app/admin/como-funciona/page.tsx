import { revalidatePath } from "next/cache";
import { ChevronDown, PlusCircle, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Icon } from "@/components/Icon";
import { db } from "@/lib/db";
import { STEP_ICON_CHOICES, type Step, getSteps } from "@/lib/content";
import { howItWorks as defaults } from "@/lib/brand";

export const dynamic = "force-dynamic";

async function installDefaults() {
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
}

export default async function AdminComoFuncionaPage() {
  const items = await getSteps();
  const persisted = await db.howItWorks.list();
  const isPersisted = persisted.length > 0;

  return (
    <AdminShell
      title="Como funciona"
      subtitle="Etapas exibidas na home e em /como-funciona."
    >
      {!isPersisted ? (
        <form
          className="panel mb-6 flex flex-wrap items-center justify-between gap-4 p-6"
          action={installDefaults}
        >
          <div>
            <h2 className="font-display text-xl text-ink">
              Ainda usando etapas padrão
            </h2>
            <p className="mt-1 text-sm text-muted">
              Instale para começar a editar (4 etapas).
            </p>
          </div>
          <button type="submit" className="btn btn-gold">
            Instalar etapas padrão
          </button>
        </form>
      ) : null}

      <div className="space-y-3">
        {items.map((item) => (
          <StepEditor key={item.id} item={item} readOnly={!isPersisted} />
        ))}
      </div>

      {isPersisted ? <NewStepCard nextPosition={items.length + 1} /> : null}
    </AdminShell>
  );
}

function StepEditor({ item, readOnly }: { item: Step; readOnly: boolean }) {
  return (
    <details className="editor-card">
      <summary>
        <span className="badge-ico badge-ico-gold">
          <Icon name={item.icon} size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg text-ink truncate">
            <span className="text-gold-deep">{item.stepNumber}.</span>{" "}
            {item.title}
          </p>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted">
            <span className="chip chip-muted">Ordem {item.position}</span>
          </div>
        </div>
        <ChevronDown size={18} className="caret shrink-0" />
      </summary>

      <div className="editor-body">
        {readOnly ? (
          <p className="text-sm text-muted">
            Somente leitura — instale as etapas padrão primeiro.
          </p>
        ) : (
          <form
            action={async (formData) => {
              "use server";
              await db.howItWorks.update(item.id, {
                stepNumber: String(
                  formData.get("stepNumber") || item.stepNumber,
                ),
                icon: String(formData.get("icon") || item.icon),
                title: String(formData.get("title") || item.title),
                body: String(formData.get("body") || item.body),
                position: Number(formData.get("position") || item.position),
              });
              revalidatePath("/admin/como-funciona");
              revalidatePath("/", "layout");
            }}
          >
            <div className="grid gap-5 md:grid-cols-[120px_1fr_1fr_100px]">
              <div className="field">
                <label>Nº</label>
                <input
                  name="stepNumber"
                  defaultValue={item.stepNumber}
                  placeholder="01"
                />
              </div>
              <div className="field">
                <label>Título</label>
                <input name="title" defaultValue={item.title} required />
              </div>
              <div className="field">
                <label>Ícone</label>
                <select name="icon" defaultValue={item.icon}>
                  {STEP_ICON_CHOICES.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Ordem</label>
                <input
                  type="number"
                  name="position"
                  defaultValue={item.position}
                />
              </div>
              <div className="field md:col-span-4">
                <label>Descrição</label>
                <textarea
                  name="body"
                  rows={3}
                  defaultValue={item.body}
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-line-soft pt-5">
              <form
                action={async () => {
                  "use server";
                  await db.howItWorks.remove(item.id);
                  revalidatePath("/admin/como-funciona");
                  revalidatePath("/", "layout");
                }}
              >
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 text-xs text-muted hover:text-[var(--danger)]"
                >
                  <Trash2 size={14} /> Excluir
                </button>
              </form>
              <button type="submit" className="btn btn-primary text-sm">
                Salvar alterações
              </button>
            </div>
          </form>
        )}
      </div>
    </details>
  );
}

function NewStepCard({ nextPosition }: { nextPosition: number }) {
  return (
    <details className="editor-card mt-6">
      <summary>
        <span className="badge-ico badge-ico-wine">
          <PlusCircle size={20} />
        </span>
        <div className="flex-1">
          <p className="font-display text-lg text-ink">Nova etapa</p>
          <p className="mt-1 text-xs text-muted">
            Aparece no fluxo "Como funciona" assim que salvar.
          </p>
        </div>
        <ChevronDown size={18} className="caret shrink-0" />
      </summary>
      <div className="editor-body">
        <form
          className="grid gap-5 md:grid-cols-[120px_1fr_1fr_100px]"
          action={async (formData) => {
            "use server";
            const stepNumber = String(formData.get("stepNumber") || "").trim();
            const icon = String(formData.get("icon") || "message");
            const title = String(formData.get("title") || "").trim();
            const body = String(formData.get("body") || "").trim();
            const pos = Number(formData.get("position") || nextPosition);
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
            <input name="stepNumber" placeholder="05" required />
          </div>
          <div className="field">
            <label>Título</label>
            <input name="title" required />
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
            <label>Ordem</label>
            <input type="number" name="position" defaultValue={nextPosition} />
          </div>
          <div className="field md:col-span-4">
            <label>Descrição</label>
            <textarea name="body" rows={3} required />
          </div>
          <div className="md:col-span-4 flex justify-end">
            <button type="submit" className="btn btn-primary text-sm">
              Adicionar etapa
            </button>
          </div>
        </form>
      </div>
    </details>
  );
}
