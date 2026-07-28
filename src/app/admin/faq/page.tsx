import { revalidatePath } from "next/cache";
import { ChevronDown, HelpCircle, PlusCircle, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { db } from "@/lib/db";
import { getFaq, type FaqItem } from "@/lib/content";
import { faqDefault } from "@/lib/brand";

export const dynamic = "force-dynamic";

async function installDefaults() {
  "use server";
  for (const [index, item] of faqDefault.entries()) {
    await db.faq.create({
      question: item.q,
      answer: item.a,
      position: index,
    });
  }
  revalidatePath("/admin/faq");
  revalidatePath("/", "layout");
}

export default async function AdminFaqPage() {
  const items = await getFaq();
  const persisted = await db.faq.list();
  const isPersisted = persisted.length > 0;

  return (
    <AdminShell
      title="Perguntas frequentes"
      subtitle="Aparecem na seção FAQ ao final da home."
    >
      {!isPersisted ? (
        <form
          className="panel mb-6 flex flex-wrap items-center justify-between gap-4 p-6"
          action={installDefaults}
        >
          <div>
            <h2 className="font-display text-xl text-ink">
              Ainda usando FAQ padrão
            </h2>
            <p className="mt-1 text-sm text-muted">
              Instale as 5 perguntas padrão para poder editar.
            </p>
          </div>
          <button type="submit" className="btn btn-gold">
            Instalar FAQ padrão
          </button>
        </form>
      ) : null}

      <div className="space-y-3">
        {items.map((item) => (
          <FaqEditor key={item.id} item={item} readOnly={!isPersisted} />
        ))}
      </div>

      {isPersisted ? <NewFaqCard nextPosition={items.length + 1} /> : null}
    </AdminShell>
  );
}

function FaqEditor({ item, readOnly }: { item: FaqItem; readOnly: boolean }) {
  return (
    <details className="editor-card">
      <summary>
        <span className="badge-ico badge-ico-gold">
          <HelpCircle size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg text-ink truncate">
            {item.question}
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
            Somente leitura — instale as perguntas padrão primeiro.
          </p>
        ) : (
          <form
            action={async (formData) => {
              "use server";
              await db.faq.update(item.id, {
                question: String(formData.get("question") || item.question),
                answer: String(formData.get("answer") || item.answer),
                position: Number(formData.get("position") || item.position),
              });
              revalidatePath("/admin/faq");
              revalidatePath("/", "layout");
            }}
          >
            <div className="grid gap-5 md:grid-cols-[1fr_120px]">
              <div className="field">
                <label>Pergunta</label>
                <input name="question" defaultValue={item.question} required />
              </div>
              <div className="field">
                <label>Ordem</label>
                <input
                  type="number"
                  name="position"
                  defaultValue={item.position}
                />
              </div>
              <div className="field md:col-span-2">
                <label>Resposta</label>
                <textarea
                  name="answer"
                  rows={4}
                  defaultValue={item.answer}
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-line-soft pt-5">
              <form
                action={async () => {
                  "use server";
                  await db.faq.remove(item.id);
                  revalidatePath("/admin/faq");
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

function NewFaqCard({ nextPosition }: { nextPosition: number }) {
  return (
    <details className="editor-card mt-6">
      <summary>
        <span className="badge-ico badge-ico-wine">
          <PlusCircle size={20} />
        </span>
        <div className="flex-1">
          <p className="font-display text-lg text-ink">Nova pergunta</p>
          <p className="mt-1 text-xs text-muted">
            Aparece no fim da home assim que salvar.
          </p>
        </div>
        <ChevronDown size={18} className="caret shrink-0" />
      </summary>
      <div className="editor-body">
        <form
          className="grid gap-5 md:grid-cols-[1fr_120px]"
          action={async (formData) => {
            "use server";
            const q = String(formData.get("question") || "").trim();
            const a = String(formData.get("answer") || "").trim();
            const pos = Number(formData.get("position") || nextPosition);
            if (!q || !a) return;
            await db.faq.create({ question: q, answer: a, position: pos });
            revalidatePath("/admin/faq");
            revalidatePath("/", "layout");
          }}
        >
          <div className="field">
            <label>Pergunta</label>
            <input name="question" required />
          </div>
          <div className="field">
            <label>Ordem</label>
            <input type="number" name="position" defaultValue={nextPosition} />
          </div>
          <div className="field md:col-span-2">
            <label>Resposta</label>
            <textarea name="answer" rows={4} required />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="btn btn-primary text-sm">
              Adicionar pergunta
            </button>
          </div>
        </form>
      </div>
    </details>
  );
}
