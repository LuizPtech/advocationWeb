import { revalidatePath } from "next/cache";
import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";
import { bookingStatusLabel, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminAgendaPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { scheduledAt: "asc" },
  });

  return (
    <AdminShell title="Agenda de consultas">
      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-line text-muted">
            <tr>
              <th className="p-4">Cliente</th>
              <th className="p-4">Horário</th>
              <th className="p-4">Tipo / Área</th>
              <th className="p-4">Status</th>
              <th className="p-4">Ação</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-line/70 align-top">
                <td className="p-4">
                  <p className="font-medium">{booking.name}</p>
                  <p className="text-muted">{booking.email}</p>
                  <p className="text-muted">{booking.phone}</p>
                  {booking.notes ? (
                    <p className="mt-2 text-muted">{booking.notes}</p>
                  ) : null}
                </td>
                <td className="p-4">{formatDateTime(booking.scheduledAt)}</td>
                <td className="p-4">
                  {booking.type} · {booking.area}
                </td>
                <td className="p-4">{bookingStatusLabel[booking.status]}</td>
                <td className="p-4">
                  <form
                    action={async (formData) => {
                      "use server";
                      const status = String(formData.get("status"));
                      await prisma.booking.update({
                        where: { id: booking.id },
                        data: { status: status as never },
                      });
                      revalidatePath("/admin/agenda");
                    }}
                    className="flex gap-2"
                  >
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
