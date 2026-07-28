import { revalidatePath } from "next/cache";
import { Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { practiceAreas } from "@/lib/brand";
import { db } from "@/lib/db";
import { bookingStatusLabel, formatDate, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

function toDateInput(iso: string) {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function toTimeInput(iso: string) {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${min}`;
}

export default async function AdminAgendaPage() {
  const bookings = await db.bookings.list();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = bookings.filter(
    (b) => new Date(b.scheduledAt).getTime() >= today.getTime(),
  );
  const past = bookings.filter(
    (b) => new Date(b.scheduledAt).getTime() < today.getTime(),
  );

  return (
    <AdminShell
      title="Agenda de consultas"
      subtitle="Gerencie horários, remarque e crie eventos manualmente."
    >
      <details className="panel mb-8 p-6" open>
        <summary className="flex cursor-pointer items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl text-ink">
              Nova consulta manual
            </h2>
            <p className="mt-1 text-sm text-muted">
              Registre um horário mesmo sem o cliente ter agendado pelo site.
            </p>
          </div>
          <span className="text-sm font-semibold text-wine">＋ Novo</span>
        </summary>

        <form
          className="mt-6 grid gap-4 md:grid-cols-3"
          action={async (formData) => {
            "use server";
            const name = String(formData.get("name") || "").trim();
            const email = String(formData.get("email") || "").trim();
            const phone = String(formData.get("phone") || "").trim();
            const area = String(formData.get("area") || "familia");
            const type = String(formData.get("type") || "ONLINE");
            const date = String(formData.get("date") || "");
            const time = String(formData.get("time") || "");
            const notes = String(formData.get("notes") || "");
            if (!name || !date || !time) return;
            const iso = new Date(`${date}T${time}:00`).toISOString();
            await db.bookings.create({
              name,
              email:
                email ||
                `${name.replace(/\s+/g, ".").toLowerCase()}@sem-email.local`,
              phone: phone || "-",
              type,
              area,
              notes: notes || null,
              scheduledAt: iso,
              lgpdConsent: true,
              status: "CONFIRMED",
            });
            revalidatePath("/admin/agenda");
          }}
        >
          <div className="field md:col-span-2">
            <label htmlFor="name">Nome</label>
            <input id="name" name="name" required />
          </div>
          <div className="field">
            <label htmlFor="phone">Telefone</label>
            <input id="phone" name="phone" />
          </div>
          <div className="field md:col-span-2">
            <label htmlFor="email">E-mail (opcional)</label>
            <input id="email" name="email" type="email" />
          </div>
          <div className="field">
            <label htmlFor="type">Tipo</label>
            <select id="type" name="type" defaultValue="ONLINE">
              <option value="ONLINE">Online</option>
              <option value="PRESENCIAL">Presencial</option>
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
            <label htmlFor="date">Data</label>
            <input id="date" name="date" type="date" required />
          </div>
          <div className="field">
            <label htmlFor="time">Horário</label>
            <input id="time" name="time" type="time" required />
          </div>
          <div className="field md:col-span-3">
            <label htmlFor="notes">Observações</label>
            <textarea id="notes" name="notes" rows={2} />
          </div>
          <button type="submit" className="btn btn-primary md:col-span-3 md:w-fit">
            Criar consulta
          </button>
        </form>
      </details>

      <BookingsList bookings={upcoming} title="Próximas consultas" />
      {past.length > 0 ? (
        <div className="mt-10">
          <BookingsList
            bookings={past.slice(0, 25)}
            title="Consultas anteriores"
          />
        </div>
      ) : null}
    </AdminShell>
  );
}

function BookingsList({
  bookings,
  title,
}: {
  bookings: Awaited<ReturnType<typeof db.bookings.list>>;
  title: string;
}) {
  if (bookings.length === 0) {
    return (
      <div className="panel p-6 text-sm text-muted">
        <h2 className="font-display mb-2 text-2xl text-ink">{title}</h2>
        Nenhuma consulta.
      </div>
    );
  }

  return (
    <section>
      <h2 className="font-display mb-4 text-2xl text-ink">{title}</h2>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <article key={booking.id} className="panel p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-ink">{booking.name}</p>
                <p className="text-sm text-muted">
                  {booking.email !== `${booking.name.replace(/\s+/g, ".").toLowerCase()}@sem-email.local`
                    ? booking.email
                    : ""}{" "}
                  {booking.phone ? `· ${booking.phone}` : ""}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {booking.type} · {booking.area}
                </p>
                {booking.notes ? (
                  <p className="mt-2 text-sm text-ink-soft">{booking.notes}</p>
                ) : null}
              </div>
              <span className="status-pill">
                {bookingStatusLabel[booking.status]}
              </span>
            </div>

            <form
              className="mt-5 grid gap-3 md:grid-cols-[auto_auto_auto_1fr_auto_auto]"
              action={async (formData) => {
                "use server";
                const date = String(formData.get("date") || "");
                const time = String(formData.get("time") || "");
                const status = String(formData.get("status") || booking.status);
                const iso = date && time
                  ? new Date(`${date}T${time}:00`).toISOString()
                  : undefined;
                await db.bookings.update(booking.id, {
                  scheduledAt: iso,
                  status,
                });
                revalidatePath("/admin/agenda");
              }}
            >
              <div className="field">
                <label className="text-xs">Data</label>
                <input
                  type="date"
                  name="date"
                  defaultValue={toDateInput(booking.scheduledAt)}
                  className="rounded border border-line px-2 py-1"
                />
              </div>
              <div className="field">
                <label className="text-xs">Horário</label>
                <input
                  type="time"
                  name="time"
                  defaultValue={toTimeInput(booking.scheduledAt)}
                  className="rounded border border-line px-2 py-1"
                />
              </div>
              <div className="field">
                <label className="text-xs">Status</label>
                <select
                  name="status"
                  defaultValue={booking.status}
                  className="rounded border border-line px-2 py-1"
                >
                  {Object.keys(bookingStatusLabel).map((key) => (
                    <option key={key} value={key}>
                      {bookingStatusLabel[key]}
                    </option>
                  ))}
                </select>
              </div>
              <p className="self-end text-xs text-muted">
                Atual: {formatDateTime(booking.scheduledAt)} ({formatDate(
                  booking.scheduledAt,
                  "EEEE",
                )})
              </p>
              <button type="submit" className="btn btn-ghost text-sm">
                Salvar
              </button>
              <button
                type="submit"
                formAction={async () => {
                  "use server";
                  await db.bookings.remove(booking.id);
                  revalidatePath("/admin/agenda");
                }}
                className="inline-flex items-center gap-1 text-sm text-muted hover:text-[var(--danger)]"
                title="Cancelar / remover"
              >
                <Trash2 size={14} /> Remover
              </button>
            </form>
          </article>
        ))}
      </div>
    </section>
  );
}
