import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  caseStatusLabel,
  formatCurrency,
  formatDate,
  paymentStatusLabel,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AreaClientePage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/area-cliente");

  if (session.user.role === "ADMIN") {
    redirect("/admin");
  }

  const caseList = await db.cases.byClient(session.user.id);
  const cases = await Promise.all(
    caseList.map(async (item) => ({
      ...item,
      documents: await db.documents.byCase(item.id, true),
      messages: await db.messages.byCase(item.id),
    })),
  );

  const [payments, bookings] = await Promise.all([
    db.payments.byClient(session.user.id),
    db.bookings.byEmail(session.user.email || "", 5),
  ]);

  return (
    <div className="section-pad">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm tracking-[0.16em] text-accent uppercase">
              Área do cliente
            </p>
            <h1 className="font-display mt-2 text-4xl text-ink md:text-5xl">
              Olá, {session.user.name}
            </h1>
            <p className="mt-2 text-muted">
              Acompanhe casos, documentos, mensagens e honorários.
            </p>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button type="submit" className="btn btn-ghost">
              Sair
            </button>
          </form>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <section className="panel p-6 lg:col-span-2">
            <h2 className="font-display text-3xl text-ink">Meus casos</h2>
            {cases.length === 0 ? (
              <p className="mt-4 text-muted">
                Nenhum caso aberto ainda.{" "}
                <Link href="/agendar" className="text-accent">
                  Agende uma consulta
                </Link>
                .
              </p>
            ) : (
              <div className="mt-6 space-y-6">
                {cases.map((item) => (
                  <article
                    key={item.id}
                    className="border-t border-line pt-5 first:border-0 first:pt-0"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-xl font-semibold text-ink">
                        {item.title}
                      </h3>
                      <span className="status-pill">
                        {caseStatusLabel[item.status]}
                      </span>
                    </div>
                    <p className="mt-2 text-muted">{item.description}</p>
                    {item.nextStep ? (
                      <p className="mt-3 text-sm text-ink-soft">
                        <strong>Próximo passo:</strong> {item.nextStep}
                      </p>
                    ) : null}
                    {item.deadline ? (
                      <p className="mt-1 text-sm text-muted">
                        Prazo: {formatDate(item.deadline)}
                      </p>
                    ) : null}

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-semibold tracking-wide uppercase">
                          Documentos
                        </h4>
                        <ul className="mt-2 space-y-2 text-sm">
                          {item.documents.length === 0 ? (
                            <li className="text-muted">Nenhum documento ainda.</li>
                          ) : (
                            item.documents.map((doc) => (
                              <li key={doc.id}>
                                <a
                                  href={`/api/documents/${doc.id}`}
                                  className="text-accent"
                                >
                                  {doc.name}
                                </a>
                              </li>
                            ))
                          )}
                        </ul>
                        <form
                          className="mt-3 space-y-2"
                          action="/api/documents/upload"
                          method="post"
                          encType="multipart/form-data"
                        >
                          <input type="hidden" name="caseId" value={item.id} />
                          <input
                            type="file"
                            name="file"
                            required
                            className="block w-full text-sm"
                          />
                          <button type="submit" className="btn btn-ghost text-sm">
                            Enviar documento
                          </button>
                        </form>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold tracking-wide uppercase">
                          Mensagens
                        </h4>
                        <div className="mt-2 max-h-48 space-y-3 overflow-y-auto text-sm">
                          {item.messages.map((msg) => (
                            <div key={msg.id} className="rounded bg-paper p-3">
                              <p className="font-semibold text-ink">
                                {msg.author?.name}
                              </p>
                              <p className="text-muted">{msg.body}</p>
                              <p className="mt-1 text-xs text-muted">
                                {formatDate(msg.createdAt, "dd/MM/yyyy HH:mm")}
                              </p>
                            </div>
                          ))}
                        </div>
                        <form
                          action={async (formData) => {
                            "use server";
                            const body = String(formData.get("body") || "").trim();
                            if (!body) return;
                            const sessionInner = await auth();
                            if (!sessionInner?.user) return;
                            await db.messages.create({
                              body,
                              caseId: item.id,
                              authorId: sessionInner.user.id,
                            });
                          }}
                          className="mt-3 space-y-2"
                        >
                          <textarea
                            name="body"
                            rows={2}
                            required
                            placeholder="Escreva uma dúvida..."
                            className="w-full rounded border border-line p-2 text-sm"
                          />
                          <button type="submit" className="btn btn-ghost text-sm">
                            Enviar mensagem
                          </button>
                        </form>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <section className="panel p-6">
              <h2 className="font-display text-2xl text-ink">Honorários</h2>
              <ul className="mt-4 space-y-3">
                {payments.length === 0 ? (
                  <li className="text-sm text-muted">Nenhum lançamento.</li>
                ) : (
                  payments.map((payment) => (
                    <li
                      key={payment.id}
                      className="border-b border-line pb-3 last:border-0"
                    >
                      <p className="font-medium text-ink">
                        {payment.description}
                      </p>
                      <p className="text-sm text-muted">
                        {formatCurrency(payment.amount)} ·{" "}
                        {paymentStatusLabel[payment.status]}
                      </p>
                    </li>
                  ))
                )}
              </ul>
            </section>

            <section className="panel p-6">
              <h2 className="font-display text-2xl text-ink">Consultas</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {bookings.length === 0 ? (
                  <li className="text-muted">
                    Nenhuma consulta.{" "}
                    <Link href="/agendar" className="text-accent">
                      Agendar
                    </Link>
                  </li>
                ) : (
                  bookings.map((booking) => (
                    <li key={booking.id}>
                      {formatDate(booking.scheduledAt, "dd/MM/yyyy HH:mm")} ·{" "}
                      {booking.type.toLowerCase()}
                    </li>
                  ))
                )}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
