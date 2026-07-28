import { revalidatePath } from "next/cache";
import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";
import { formatDateTime, leadStatusLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <AdminShell title="Leads e contatos">
      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line text-muted">
            <tr>
              <th className="p-4">Nome</th>
              <th className="p-4">Assunto</th>
              <th className="p-4">Status</th>
              <th className="p-4">Quando</th>
              <th className="p-4">Ação</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-line/70 align-top">
                <td className="p-4">
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-muted">{lead.email}</p>
                  <p className="text-muted">{lead.phone}</p>
                </td>
                <td className="p-4">
                  <p>{lead.subject}</p>
                  <p className="mt-1 text-muted">{lead.message}</p>
                </td>
                <td className="p-4">{leadStatusLabel[lead.status]}</td>
                <td className="p-4">{formatDateTime(lead.createdAt)}</td>
                <td className="p-4">
                  <form
                    action={async (formData) => {
                      "use server";
                      const status = String(formData.get("status"));
                      await prisma.lead.update({
                        where: { id: lead.id },
                        data: { status: status as never },
                      });
                      revalidatePath("/admin/leads");
                    }}
                    className="flex gap-2"
                  >
                    <select
                      name="status"
                      defaultValue={lead.status}
                      className="rounded border border-line px-2 py-1"
                    >
                      {Object.keys(leadStatusLabel).map((key) => (
                        <option key={key} value={key}>
                          {leadStatusLabel[key]}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="btn btn-ghost px-3 py-1 text-xs">
                      Salvar
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
