import { revalidatePath } from "next/cache";
import { PlusCircle, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { db } from "@/lib/db";
import { getFaq } from "@/lib/content";
import { faqDefault } from "@/lib/brand";

export const dynamic = "force-dynamic";

export default async function AdminFaqPage() {
  const items = await getFaq();
  const persisted = await db.faq.list();
  const isPersisted = persisted.length > 0;

  return (
    <AdminShell
      title="Perguntas frequentes"
      subtitle="Aparecem no final da home."
    >
      {!isPersisted ? (
        <form
          className="panel mb-6 p-6"
          action={async () => {
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
          }}
        >
          <h2 className="font-display text-2xl text-ink">Ainda sem FAQ</h2>
          <p className="mt-2 text-muted">
            O site mostra 5 perguntas padrão. Instale para poder editar.
          </p>
          <button type="submit" className="btn btn-gold mt-4">
            Instalar FAQ padrão
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
              await db.faq.update(item.id, {
                question: String(formData.get("question") || item.question),
                answer: String(formData.get("answer") || item.answer),
                position: Number(formData.get("position") || item.position),
              });
              revalidatePath("/admin/faq");
              revalidatePath("/", "layout");
            }}
          >
            <div className="grid gap-3 md:grid-cols-[1fr_120px_auto]">
              <div className="field">
                <label>Pergunta</label>
                <input
                  name="question"
                  defaultValue={item.question}
                  required
                  disabled={!isPersisted}
                />
              </div>
              <div className="field">
                <label>Posição</label>
                <input
                  type="number"
                  name="position"
                  defaultValue={item.position}
                  disabled={!isPersisted}
                />
              </div>
              <div className="flex items-end gap-2">
                {isPersisted ? (
                  <>
                    <button type="submit" className="btn btn-ghost text-sm">
                      Salvar
                    </button>
                    <button
                      type="submit"
                      formAction={async () => {
                        "use server";
                        await db.faq.remove(item.id);
                        revalidatePath("/admin/faq");
                        revalidatePath("/", "layout");
                      }}
                      className="text-muted hover:text-[var(--danger)]"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                ) : null}
              </div>
            </div>
            <div className="field mt-3">
              <label>Resposta</label>
              <textarea
                name="answer"
                rows={3}
                defaultValue={item.answer}
                required
                disabled={!isPersisted}
              />
            </div>
          </form>
        ))}
      </div>

      {isPersisted ? (
        <details className="panel mt-8 p-6" open>
          <summary className="cursor-pointer font-semibold text-ink">
            <PlusCircle size={16} className="mr-1 inline" /> Nova pergunta
          </summary>
          <form
            className="mt-4 grid gap-3 md:grid-cols-[1fr_120px_auto]"
            action={async (formData) => {
              "use server";
              const q = String(formData.get("question") || "").trim();
              const a = String(formData.get("answer") || "").trim();
              const pos = Number(formData.get("position") || 999);
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
              <label>Posição</label>
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
            <div className="field md:col-span-3">
              <label>Resposta</label>
              <textarea name="answer" rows={3} required />
            </div>
          </form>
        </details>
      ) : null}
    </AdminShell>
  );
}
