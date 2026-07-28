import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { db } from "@/lib/db";
import { TEMPLATE_PLACEHOLDERS } from "@/lib/templates";

export const dynamic = "force-dynamic";

export default function NovoTemplatePage() {
  return (
    <AdminShell
      title="Novo modelo"
      subtitle="Escreva o texto do documento. Use campos entre chaves duplas para inserir dados automaticamente."
    >
      <Link
        href="/admin/modelos"
        className="mb-6 inline-block text-sm font-semibold text-wine"
      >
        ← Voltar aos modelos
      </Link>

      <form
        className="panel grid gap-5 p-8"
        action={async (formData) => {
          "use server";
          const name = String(formData.get("name") || "").trim();
          const category = String(formData.get("category") || "geral");
          const content = String(formData.get("content") || "");
          if (!name || !content) return;
          const id = await db.templates.create({ name, category, content });
          redirect(`/admin/modelos/${id}`);
        }}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="field">
            <label htmlFor="name">Nome do modelo</label>
            <input id="name" name="name" required placeholder="Ex.: Procuração" />
          </div>
          <div className="field">
            <label htmlFor="category">Categoria</label>
            <input
              id="category"
              name="category"
              placeholder="Ex.: Contratos, Procuração"
              defaultValue="geral"
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="content">Conteúdo</label>
          <textarea
            id="content"
            name="content"
            rows={18}
            required
            placeholder="Cole aqui o texto do documento e use os campos entre chaves duplas..."
            className="font-mono text-sm"
          />
        </div>

        <details className="rounded-xl border border-line-soft bg-paper-elevated p-4">
          <summary className="cursor-pointer font-semibold text-ink">
            Campos disponíveis (clique para expandir)
          </summary>
          <p className="mt-3 text-sm text-muted">
            Copie e cole no texto — serão substituídos ao gerar o documento.
          </p>
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            {TEMPLATE_PLACEHOLDERS.map((placeholder) => (
              <code
                key={placeholder}
                className="rounded bg-white px-2 py-1 text-xs text-ink"
              >
                {placeholder}
              </code>
            ))}
          </div>
        </details>

        <button type="submit" className="btn btn-primary w-fit">
          Criar modelo
        </button>
      </form>
    </AdminShell>
  );
}
