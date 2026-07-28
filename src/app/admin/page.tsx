import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  bookingStatusLabel,
  caseStatusLabel,
  formatDateTime,
  leadStatusLabel,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

const nav = [
  { href: "/admin", label: "Visão geral" },
  { href: "/admin/site", label: "Editar site" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/agenda", label: "Agenda" },
  { href: "/admin/casos", label: "Casos" },
  { href: "/admin/clientes", label: "Clientes" },
  { href: "/admin/blog", label: "Blog" },
];

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin");
  }

  const [leads, bookings, cases, clients, pendingBookings, openCases, newLeads] =
    await Promise.all([
      db.leads.recent(5),
      db.bookings.upcoming(5),
      db.cases.recent(5),
      db.users.countClients(),
      db.bookings.countPending(),
      db.cases.countOpen(),
      db.leads.countNew(),
    ]);

  return (
    <div className="dashboard-shell bg-paper">
      <aside className="border-r border-line bg-ink p-6 text-paper">
        <p className="font-display text-2xl">Painel</p>
        <p className="mt-1 text-sm text-mist">{session.user.name}</p>
        <nav className="mt-8 flex flex-col gap-3 text-sm">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-accent-soft">
              {item.label}
            </Link>
          ))}
          <Link href="/" className="mt-4 text-mist hover:text-paper">
            Ver site
          </Link>
        </nav>
        <form
          className="mt-8"
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button type="submit" className="btn border border-paper/30 text-paper">
            Sair
          </button>
        </form>
      </aside>

      <div className="p-6 md:p-10">
        <h1 className="font-display text-4xl text-ink">Visão geral</h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="panel p-5">
            <p className="text-sm text-muted">Leads novos</p>
            <p className="font-display mt-2 text-4xl">{newLeads}</p>
          </div>
          <div className="panel p-5">
            <p className="text-sm text-muted">Consultas pendentes</p>
            <p className="font-display mt-2 text-4xl">{pendingBookings}</p>
          </div>
          <div className="panel p-5">
            <p className="text-sm text-muted">Casos abertos / clientes</p>
            <p className="font-display mt-2 text-4xl">
              {openCases} / {clients}
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="panel p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Leads recentes</h2>
              <Link href="/admin/leads" className="text-sm text-accent">
                Ver todos
              </Link>
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              {leads.map((lead) => (
                <li key={lead.id} className="border-b border-line pb-3">
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-muted">
                    {lead.subject} · {leadStatusLabel[lead.status]}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Agenda</h2>
              <Link href="/admin/agenda" className="text-sm text-accent">
                Ver agenda
              </Link>
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              {bookings.map((booking) => (
                <li key={booking.id} className="border-b border-line pb-3">
                  <p className="font-medium">{booking.name}</p>
                  <p className="text-muted">
                    {formatDateTime(booking.scheduledAt)} ·{" "}
                    {bookingStatusLabel[booking.status]}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Casos</h2>
              <Link href="/admin/casos" className="text-sm text-accent">
                Gerenciar
              </Link>
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              {cases.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3"
                >
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-muted">
                      {item.client?.name} · {caseStatusLabel[item.status]}
                    </p>
                  </div>
                  <Link href={`/admin/casos/${item.id}`} className="text-accent">
                    Abrir
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
