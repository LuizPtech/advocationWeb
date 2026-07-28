import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { AdminShell } from "@/components/admin/AdminShell";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminClientesPage() {
  const clients = await db.users.listClients();

  return (
    <AdminShell title="Clientes">
      <form
        className="panel mb-8 grid gap-4 p-6 md:grid-cols-2"
        action={async (formData) => {
          "use server";
          const name = String(formData.get("name") || "").trim();
          const email = String(formData.get("email") || "")
            .trim()
            .toLowerCase();
          const phone = String(formData.get("phone") || "").trim();
          const password = String(formData.get("password") || "cliente123");
          if (!name || !email) return;

          const passwordHash = await bcrypt.hash(password, 10);
          await db.users.create({
            name,
            email,
            phone: phone || null,
            passwordHash,
            role: "CLIENT",
          });
          revalidatePath("/admin/clientes");
        }}
      >
        <h2 className="font-display text-2xl md:col-span-2">Novo cliente</h2>
        <div className="field">
          <label htmlFor="name">Nome</label>
          <input id="name" name="name" required />
        </div>
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div className="field">
          <label htmlFor="phone">Telefone</label>
          <input id="phone" name="phone" />
        </div>
        <div className="field">
          <label htmlFor="password">Senha inicial</label>
          <input id="password" name="password" defaultValue="cliente123" />
        </div>
        <button type="submit" className="btn btn-primary md:col-span-2 md:w-fit">
          Cadastrar
        </button>
      </form>

      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line text-muted">
            <tr>
              <th className="p-4">Nome</th>
              <th className="p-4">Contato</th>
              <th className="p-4">Casos</th>
              <th className="p-4">Desde</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b border-line/70">
                <td className="p-4 font-medium">{client.name}</td>
                <td className="p-4">
                  {client.email}
                  <br />
                  <span className="text-muted">{client.phone}</span>
                </td>
                <td className="p-4">{client._count?.cases ?? 0}</td>
                <td className="p-4">{formatDate(client.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
