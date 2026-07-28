import Link from "next/link";
import { revalidatePath } from "next/cache";
import { FileText, PlusCircle } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { db } from "@/lib/db";
import { DEFAULT_TEMPLATES } from "@/lib/templates";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminModelosPage() {
  const templates = await db.templates.list();

  return (
    <AdminShell
      title="Modelos de documentos"
      subtitle="Crie modelos com campos variáveis (ex.: {{cliente.nome}}) que são preenchidos automaticamente a partir de um caso ou cliente."
      actions={
        <Link href="/admin/modelos/novo" className="btn btn-primary">
          <PlusCircle size={16} /> Novo modelo
        </Link>
      }
    >
      {templates.length === 0 ? (
        <div className="panel p-8 text-center">
          <FileText size={40} className="mx-auto text-gold" />
          <h2 className="font-display mt-4 text-2xl text-ink">
            Nenhum modelo ainda
          </h2>
          <p className="mt-2 text-muted">
            Comece com nossos modelos prontos (procuração, contrato de
            honorários e recibo).
          </p>
          <form
            className="mt-6"
            action={async () => {
              "use server";
              for (const template of DEFAULT_TEMPLATES) {
                await db.templates.create(template);
              }
              revalidatePath("/admin/modelos");
            }}
          >
            <button type="submit" className="btn btn-gold">
              Instalar modelos padrão
            </button>
          </form>
          <p className="mt-6 text-xs text-muted">
            Se a lista ficar vazia após instalar, rode <code>supabase/migrations.sql</code>{" "}
            para criar a tabela <code>document_templates</code>.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <article key={template.id} className="panel flex flex-col p-6">
              <p className="text-xs tracking-[0.14em] text-gold-deep uppercase">
                {template.category}
              </p>
              <h3 className="font-display mt-2 text-xl text-ink">
                {template.name}
              </h3>
              <p className="mt-2 text-xs text-muted">
                Atualizado {formatDate(template.updatedAt)}
              </p>
              <div className="mt-4 flex-1 text-sm text-muted line-clamp-4 whitespace-pre-line">
                {template.content.slice(0, 220)}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/admin/modelos/${template.id}`}
                  className="btn btn-primary text-sm"
                >
                  Editar / gerar
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
