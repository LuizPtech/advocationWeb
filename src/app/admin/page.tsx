import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  Sparkles,
  UserCog,
  Users,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  bookingStatusLabel,
  caseStatusLabel,
  formatDateTime,
  leadStatusLabel,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin");
  }

  const [
    leads,
    bookings,
    cases,
    clients,
    pendingBookings,
    openCases,
    newLeads,
  ] = await Promise.all([
    db.leads.recent(5),
    db.bookings.upcoming(5),
    db.cases.recent(5),
    db.users.countClients(),
    db.bookings.countPending(),
    db.cases.countOpen(),
    db.leads.countNew(),
  ]);

  const firstName = session.user.name?.split(" ")[0] || "advogada";

  return (
    <AdminShell
      title={`Olá, ${firstName}`}
      subtitle="Aqui está um resumo do que precisa da sua atenção hoje."
      actions={
        <>
          <Link href="/admin/site" className="btn btn-ghost">
            Editar site
          </Link>
          <Link href="/admin/casos" className="btn btn-primary">
            Novo caso
          </Link>
        </>
      }
    >
      <div className="grid gap-5 md:grid-cols-4">
        <div className="stat-card tone-wine">
          <span className="badge-ico badge-ico-wine">
            <UserCog size={22} />
          </span>
          <p className="mt-4 text-sm text-muted">Leads novos</p>
          <p className="font-display mt-1 text-4xl text-ink">{newLeads}</p>
        </div>
        <div className="stat-card">
          <span className="badge-ico badge-ico-gold">
            <Calendar size={22} />
          </span>
          <p className="mt-4 text-sm text-muted">Consultas pendentes</p>
          <p className="font-display mt-1 text-4xl text-ink">
            {pendingBookings}
          </p>
        </div>
        <div className="stat-card">
          <span className="badge-ico badge-ico-gold">
            <Briefcase size={22} />
          </span>
          <p className="mt-4 text-sm text-muted">Casos abertos</p>
          <p className="font-display mt-1 text-4xl text-ink">{openCases}</p>
        </div>
        <div className="stat-card tone-wine">
          <span className="badge-ico badge-ico-wine">
            <Users size={22} />
          </span>
          <p className="mt-4 text-sm text-muted">Clientes</p>
          <p className="font-display mt-1 text-4xl text-ink">{clients}</p>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <section className="panel p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-ink">Casos recentes</h2>
            <Link
              href="/admin/casos"
              className="inline-flex items-center gap-1 text-sm font-semibold text-wine"
            >
              Gerenciar <ArrowRight size={14} />
            </Link>
          </div>
          <ul className="mt-6 divide-y divide-line-soft">
            {cases.length === 0 ? (
              <li className="py-4 text-sm text-muted">
                Nenhum caso ainda. Crie o primeiro em{" "}
                <Link href="/admin/casos" className="text-wine">
                  Casos
                </Link>
                .
              </li>
            ) : (
              cases.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-4"
                >
                  <div>
                    <p className="font-medium text-ink">{item.title}</p>
                    <p className="text-sm text-muted">
                      {item.client?.name} · {caseStatusLabel[item.status]}
                    </p>
                  </div>
                  <Link
                    href={`/admin/casos/${item.id}`}
                    className="text-sm font-semibold text-wine"
                  >
                    Abrir
                  </Link>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="panel p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-ink">Agenda</h2>
            <Link
              href="/admin/agenda"
              className="inline-flex items-center gap-1 text-sm font-semibold text-wine"
            >
              Ver <ArrowRight size={14} />
            </Link>
          </div>
          <ul className="mt-6 space-y-4">
            {bookings.length === 0 ? (
              <li className="text-sm text-muted">Sem consultas agendadas.</li>
            ) : (
              bookings.map((booking) => (
                <li
                  key={booking.id}
                  className="rounded-lg border border-line-soft p-3"
                >
                  <p className="text-sm font-semibold text-ink">
                    {booking.name}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {formatDateTime(booking.scheduledAt)}
                  </p>
                  <span className="status-pill mt-2">
                    {bookingStatusLabel[booking.status]}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="panel p-6 lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-ink">Leads recentes</h2>
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-1 text-sm font-semibold text-wine"
            >
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs tracking-[0.14em] text-muted uppercase">
                <tr>
                  <th className="pb-3">Pessoa</th>
                  <th className="pb-3">Assunto</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Quando</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-muted">
                      Nenhum lead ainda.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="py-3">
                        <p className="font-medium text-ink">{lead.name}</p>
                        <p className="text-xs text-muted">{lead.email}</p>
                      </td>
                      <td className="py-3 text-ink-soft">{lead.subject}</td>
                      <td className="py-3">
                        <span className="status-pill">
                          {leadStatusLabel[lead.status]}
                        </span>
                      </td>
                      <td className="py-3 text-muted">
                        {formatDateTime(lead.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="mt-10 grid gap-4 rounded-2xl border border-line-soft bg-paper-elevated p-8 md:grid-cols-[auto_1fr_auto] md:items-center">
        <span className="badge-ico badge-ico-gold badge-ico-lg">
          <Sparkles size={26} />
        </span>
        <div>
          <h3 className="font-display text-2xl text-ink">
            Personalize sua landing page
          </h3>
          <p className="mt-1 text-muted">
            Troque foto, headline, textos e contatos direto pelo painel.
          </p>
        </div>
        <Link href="/admin/site" className="btn btn-primary">
          Editar site
        </Link>
      </section>
    </AdminShell>
  );
}
