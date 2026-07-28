import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AdminShell } from "@/components/admin/AdminShell";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  caseStatusLabel,
  formatCurrency,
  formatDate,
  formatDateTime,
  paymentStatusLabel,
} from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export default async function AdminCasoDetailPage({ params }: Props) {
  const { id } = await params;
  const item = await prisma.case.findUnique({
    where: { id },
    include: {
      client: true,
      documents: { orderBy: { createdAt: "desc" } },
      messages: { include: { author: true }, orderBy: { createdAt: "asc" } },
      notes: { include: { author: true }, orderBy: { createdAt: "desc" } },
      payments: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!item) notFound();

  return (
    <AdminShell title={item.title}>
      <Link href="/admin/casos" className="text-sm font-semibold text-accent">
        ← Voltar aos casos
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="panel space-y-4 p-6">
          <p className="text-sm text-muted">
            Cliente: {item.client.name} ({item.client.email})
          </p>
          <form
            className="space-y-4"
            action={async (formData) => {
              "use server";
              await prisma.case.update({
                where: { id: item.id },
                data: {
                  status: String(formData.get("status")) as never,
                  nextStep: String(formData.get("nextStep") || "") || null,
                  description: String(formData.get("description") || "") || null,
                  deadline: formData.get("deadline")
                    ? new Date(String(formData.get("deadline")))
                    : null,
                  tags: JSON.stringify(
                    String(formData.get("tags") || "")
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  ),
                },
              });
              revalidatePath(`/admin/casos/${item.id}`);
            }}
          >
            <div className="field">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue={item.status}>
                {Object.keys(caseStatusLabel).map((key) => (
                  <option key={key} value={key}>
                    {caseStatusLabel[key]}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="nextStep">Próximo passo</label>
              <input
                id="nextStep"
                name="nextStep"
                defaultValue={item.nextStep || ""}
              />
            </div>
            <div className="field">
              <label htmlFor="deadline">Prazo</label>
              <input
                id="deadline"
                name="deadline"
                type="date"
                defaultValue={
                  item.deadline
                    ? formatDate(item.deadline, "yyyy-MM-dd")
                    : ""
                }
              />
            </div>
            <div className="field">
              <label htmlFor="tags">Tags (separadas por vírgula)</label>
              <input
                id="tags"
                name="tags"
                defaultValue={JSON.parse(item.tags || "[]").join(", ")}
              />
            </div>
            <div className="field">
              <label htmlFor="description">Descrição</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={item.description || ""}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Salvar caso
            </button>
          </form>
        </section>

        <section className="panel space-y-4 p-6">
          <h2 className="font-display text-2xl">Anotações internas</h2>
          <p className="text-sm text-muted">
            Visíveis apenas no painel da advogada.
          </p>
          <form
            action={async (formData) => {
              "use server";
              const session = await auth();
              if (!session?.user) return;
              const body = String(formData.get("body") || "").trim();
              if (!body) return;
              await prisma.note.create({
                data: {
                  body,
                  caseId: item.id,
                  authorId: session.user.id,
                },
              });
              revalidatePath(`/admin/casos/${item.id}`);
            }}
            className="space-y-3"
          >
            <textarea
              name="body"
              rows={3}
              required
              className="w-full rounded border border-line p-3"
              placeholder="Nota interna..."
            />
            <button type="submit" className="btn btn-ghost">
              Adicionar nota
            </button>
          </form>
          <ul className="space-y-3 text-sm">
            {item.notes.map((note) => (
              <li key={note.id} className="border-t border-line pt-3">
                <p>{note.body}</p>
                <p className="mt-1 text-xs text-muted">
                  {note.author.name} · {formatDateTime(note.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel space-y-4 p-6">
          <h2 className="font-display text-2xl">Documentos</h2>
          <ul className="space-y-2 text-sm">
            {item.documents.map((doc) => (
              <li key={doc.id}>
                <a href={`/api/documents/${doc.id}`} className="text-accent">
                  {doc.name}
                </a>
                {!doc.visibleToClient ? (
                  <span className="ml-2 text-xs text-muted">(interno)</span>
                ) : null}
              </li>
            ))}
          </ul>
          <form
            action="/api/documents/upload"
            method="post"
            encType="multipart/form-data"
            className="space-y-2"
          >
            <input type="hidden" name="caseId" value={item.id} />
            <input type="file" name="file" required />
            <button type="submit" className="btn btn-ghost">
              Enviar documento
            </button>
          </form>
        </section>

        <section className="panel space-y-4 p-6">
          <h2 className="font-display text-2xl">Mensagens com o cliente</h2>
          <div className="max-h-64 space-y-3 overflow-y-auto text-sm">
            {item.messages.map((msg) => (
              <div key={msg.id} className="rounded bg-paper p-3">
                <p className="font-semibold">{msg.author.name}</p>
                <p className="text-muted">{msg.body}</p>
              </div>
            ))}
          </div>
          <form
            action={async (formData) => {
              "use server";
              const session = await auth();
              if (!session?.user) return;
              const body = String(formData.get("body") || "").trim();
              if (!body) return;
              await prisma.message.create({
                data: {
                  body,
                  caseId: item.id,
                  authorId: session.user.id,
                },
              });
              revalidatePath(`/admin/casos/${item.id}`);
            }}
            className="space-y-2"
          >
            <textarea
              name="body"
              rows={2}
              required
              className="w-full rounded border border-line p-2"
            />
            <button type="submit" className="btn btn-ghost">
              Responder
            </button>
          </form>
        </section>

        <section className="panel space-y-4 p-6 lg:col-span-2">
          <h2 className="font-display text-2xl">Honorários</h2>
          <form
            className="grid gap-3 md:grid-cols-4"
            action={async (formData) => {
              "use server";
              const description = String(formData.get("description") || "");
              const amount = Number(formData.get("amount") || 0);
              if (!description || !amount) return;
              await prisma.payment.create({
                data: {
                  description,
                  amount,
                  status: "PENDING",
                  caseId: item.id,
                  clientId: item.clientId,
                  dueDate: formData.get("dueDate")
                    ? new Date(String(formData.get("dueDate")))
                    : null,
                },
              });
              revalidatePath(`/admin/casos/${item.id}`);
            }}
          >
            <input
              name="description"
              placeholder="Descrição"
              className="rounded border border-line px-3 py-2 md:col-span-2"
              required
            />
            <input
              name="amount"
              type="number"
              step="0.01"
              placeholder="Valor"
              className="rounded border border-line px-3 py-2"
              required
            />
            <input
              name="dueDate"
              type="date"
              className="rounded border border-line px-3 py-2"
            />
            <button type="submit" className="btn btn-primary md:col-span-4 md:w-fit">
              Lançar honorário
            </button>
          </form>
          <ul className="space-y-2 text-sm">
            {item.payments.map((payment) => (
              <li
                key={payment.id}
                className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3"
              >
                <span>
                  {payment.description} · {formatCurrency(payment.amount)} ·{" "}
                  {paymentStatusLabel[payment.status]}
                </span>
                <form
                  action={async () => {
                    "use server";
                    await prisma.payment.update({
                      where: { id: payment.id },
                      data: { status: "PAID", paidAt: new Date() },
                    });
                    revalidatePath(`/admin/casos/${item.id}`);
                  }}
                >
                  {payment.status !== "PAID" ? (
                    <button type="submit" className="btn btn-ghost text-xs">
                      Marcar pago
                    </button>
                  ) : null}
                </form>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AdminShell>
  );
}
