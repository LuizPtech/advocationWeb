import Link from "next/link";
import { revalidatePath } from "next/cache";
import { AdminShell } from "@/components/admin/AdminShell";
import { practiceAreas } from "@/lib/brand";
import { db } from "@/lib/db";
import { caseStatusLabel, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCasosPage() {
  const [cases, clients] = await Promise.all([
    db.cases.list(),
    db.users.listClients(),
  ]);

  return (
    <AdminShell title="Gestão de casos">
      <form
        className="panel mb-8 grid gap-4 p-6 md:grid-cols-2"
        action={async (formData) => {
          "use server";
          const title = String(formData.get("title") || "").trim();
          const clientId = String(formData.get("clientId") || "");
          const area = String(formData.get("area") || "familia");
          const description = String(formData.get("description") || "");
          const nextStep = String(formData.get("nextStep") || "");
          if (!title || !clientId) return;

          await db.cases.create({
            title,
            clientId,
            area,
            description: description || null,
            nextStep: nextStep || null,
          });
          revalidatePath("/admin/casos");
        }}
      >
        <h2 className="font-display text-2xl md:col-span-2">Novo caso</h2>
        <div className="field">
          <label htmlFor="title">Título</label>
          <input id="title" name="title" required />
        </div>
        <div className="field">
          <label htmlFor="clientId">Cliente</label>
          <select id="clientId" name="clientId" required defaultValue="">
            <option value="" disabled>
              Selecione
            </option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="area">Área</label>
          <select id="area" name="area" defaultValue="familia">
            {practiceAreas.map((area) => (
              <option key={area.slug} value={area.slug}>
                {area.title}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="nextStep">Próximo passo</label>
          <input id="nextStep" name="nextStep" />
        </div>
        <div className="field md:col-span-2">
          <label htmlFor="description">Descrição</label>
          <textarea id="description" name="description" rows={3} />
        </div>
        <button type="submit" className="btn btn-primary md:col-span-2 md:w-fit">
          Criar caso
        </button>
      </form>

      <div className="space-y-4">
        {cases.map((item) => (
          <article
            key={item.id}
            className="panel flex flex-wrap items-center justify-between gap-4 p-5"
          >
            <div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-muted">
                {item.client?.name} · {caseStatusLabel[item.status]}
                {item.deadline ? ` · prazo ${formatDate(item.deadline)}` : ""}
              </p>
            </div>
            <Link href={`/admin/casos/${item.id}`} className="btn btn-secondary">
              Abrir
            </Link>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
