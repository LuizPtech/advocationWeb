import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { FileText, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { db } from "@/lib/db";
import { TEMPLATE_PLACEHOLDERS } from "@/lib/templates";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export default async function EditTemplatePage({ params }: Props) {
  const { id } = await params;
  const template = await db.templates.findById(id);
  if (!template) notFound();

  const [clients, cases] = await Promise.all([
    db.users.listClients(),
    db.cases.list(),
  ]);

  return (
    <AdminShell
      title={template.name}
      subtitle={`Categoria: ${template.category}`}
      actions={
        <Link href="/admin/modelos" className="btn btn-ghost">
          ← Voltar
        </Link>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="panel p-6">
          <h2 className="font-display text-2xl text-ink">Editar modelo</h2>
          <form
            className="mt-5 space-y-4"
            action={async (formData) => {
              "use server";
              await db.templates.update(id, {
                name: String(formData.get("name") || ""),
                category: String(formData.get("category") || "geral"),
                content: String(formData.get("content") || ""),
              });
              revalidatePath(`/admin/modelos/${id}`);
              revalidatePath("/admin/modelos");
            }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="field">
                <label htmlFor="name">Nome</label>
                <input
                  id="name"
                  name="name"
                  defaultValue={template.name}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="category">Categoria</label>
                <input
                  id="category"
                  name="category"
                  defaultValue={template.category}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="content">Conteúdo</label>
              <textarea
                id="content"
                name="content"
                rows={22}
                defaultValue={template.content}
                required
                className="font-mono text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="btn btn-primary">
                Salvar alterações
              </button>
              <form
                action={async () => {
                  "use server";
                  await db.templates.remove(id);
                  revalidatePath("/admin/modelos");
                  redirect("/admin/modelos");
                }}
              >
                <button
                  type="submit"
                  className="btn btn-ghost inline-flex items-center gap-2 text-[var(--danger)]"
                >
                  <Trash2 size={14} /> Excluir modelo
                </button>
              </form>
            </div>
          </form>
        </section>

        <aside className="space-y-6">
          <div className="panel p-6">
            <h2 className="font-display text-2xl text-ink">Gerar documento</h2>
            <p className="mt-2 text-sm text-muted">
              Selecione um caso — cliente e dados do caso serão preenchidos
              automaticamente.
            </p>
            <form
              action={async (formData) => {
                "use server";
                const caseId = String(formData.get("caseId") || "");
                if (!caseId) return;
                redirect(`/admin/modelos/${id}/gerar/caso/${caseId}`);
              }}
              className="mt-4 space-y-3"
            >
              <div className="field">
                <label htmlFor="caseId">Caso</label>
                <select id="caseId" name="caseId" required defaultValue="">
                  <option value="" disabled>
                    Selecione um caso
                  </option>
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} — {c.client?.name}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary w-full">
                <FileText size={16} /> Abrir para imprimir/PDF
              </button>
            </form>

            <div className="mt-6 border-t border-line-soft pt-6">
              <p className="text-sm text-muted">
                Ou gere apenas com dados do cliente (sem caso):
              </p>
              <form
                action={async (formData) => {
                  "use server";
                  const clientId = String(formData.get("clientId") || "");
                  if (!clientId) return;
                  redirect(`/admin/modelos/${id}/gerar/cliente/${clientId}`);
                }}
                className="mt-3 space-y-3"
              >
                <div className="field">
                  <label htmlFor="clientId">Cliente</label>
                  <select
                    id="clientId"
                    name="clientId"
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Selecione um cliente
                    </option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-secondary w-full">
                  Gerar sem caso vinculado
                </button>
              </form>
            </div>
          </div>

          <div className="panel p-6">
            <h3 className="font-display text-xl text-ink">Campos disponíveis</h3>
            <p className="mt-2 text-xs text-muted">
              Use dentro do conteúdo para inserir dados automaticamente.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {TEMPLATE_PLACEHOLDERS.map((placeholder) => (
                <code
                  key={placeholder}
                  className="rounded bg-paper-elevated px-2 py-1 text-xs text-ink"
                >
                  {placeholder}
                </code>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}
