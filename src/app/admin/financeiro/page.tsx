import Link from "next/link";
import { revalidatePath } from "next/cache";
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Trash2,
  Wallet,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { db } from "@/lib/db";
import {
  formatCurrency,
  formatDate,
  paymentStatusLabel,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

function monthKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const [year, month] = key.split("-");
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
}

export default async function AdminFinanceiroPage() {
  const [payments, expenses, clients] = await Promise.all([
    db.payments.all(),
    db.expenses.list(),
    db.users.listClients(),
  ]);

  const clientMap = new Map(clients.map((c) => [c.id, c]));

  const now = new Date();
  const thisMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const paidThisMonth = payments
    .filter(
      (p) =>
        p.status === "PAID" && p.paidAt && monthKey(p.paidAt) === thisMonthKey,
    )
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingTotal = payments
    .filter((p) => p.status === "PENDING")
    .reduce((sum, p) => sum + p.amount, 0);

  const overdueTotal = payments
    .filter(
      (p) =>
        p.status === "PENDING" &&
        p.dueDate &&
        new Date(p.dueDate).getTime() < Date.now(),
    )
    .reduce((sum, p) => sum + p.amount, 0);

  const expensesThisMonth = expenses
    .filter((e) => monthKey(e.incurredAt) === thisMonthKey)
    .reduce((sum, e) => sum + e.amount, 0);

  const netThisMonth = paidThisMonth - expensesThisMonth;

  // Últimos 6 meses
  const monthKeys: string[] = [];
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthKeys.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
    );
  }

  const seriesIncome = monthKeys.map((key) =>
    payments
      .filter(
        (p) => p.status === "PAID" && p.paidAt && monthKey(p.paidAt) === key,
      )
      .reduce((sum, p) => sum + p.amount, 0),
  );

  const seriesExpense = monthKeys.map((key) =>
    expenses
      .filter((e) => monthKey(e.incurredAt) === key)
      .reduce((sum, e) => sum + e.amount, 0),
  );

  const chartMax = Math.max(1, ...seriesIncome, ...seriesExpense);

  return (
    <AdminShell
      title="Financeiro"
      subtitle="Fluxo de caixa do escritório — recebimentos e despesas."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <div className="stat-card tone-wine">
          <span className="badge-ico badge-ico-wine">
            <ArrowUpRight size={22} />
          </span>
          <p className="mt-4 text-sm text-muted">Recebido no mês</p>
          <p className="font-display mt-1 text-3xl text-ink">
            {formatCurrency(paidThisMonth)}
          </p>
        </div>
        <div className="stat-card">
          <span className="badge-ico badge-ico-gold">
            <Wallet size={22} />
          </span>
          <p className="mt-4 text-sm text-muted">A receber</p>
          <p className="font-display mt-1 text-3xl text-ink">
            {formatCurrency(pendingTotal)}
          </p>
          <p className="mt-1 text-xs text-muted">
            {formatCurrency(overdueTotal)} em atraso
          </p>
        </div>
        <div className="stat-card">
          <span className="badge-ico badge-ico-gold">
            <ArrowDownRight size={22} />
          </span>
          <p className="mt-4 text-sm text-muted">Despesas no mês</p>
          <p className="font-display mt-1 text-3xl text-ink">
            {formatCurrency(expensesThisMonth)}
          </p>
        </div>
        <div className="stat-card tone-wine">
          <span className="badge-ico badge-ico-wine">
            <DollarSign size={22} />
          </span>
          <p className="mt-4 text-sm text-muted">Resultado do mês</p>
          <p
            className={`font-display mt-1 text-3xl ${
              netThisMonth >= 0 ? "text-[var(--success)]" : "text-[var(--danger)]"
            }`}
          >
            {formatCurrency(netThisMonth)}
          </p>
        </div>
      </div>

      <section className="panel mt-8 p-6">
        <h2 className="font-display text-2xl text-ink">Últimos 6 meses</h2>
        <p className="mt-1 text-sm text-muted">
          Receitas (bordô) e despesas (dourado) por mês.
        </p>

        <div className="mt-6 grid grid-cols-6 items-end gap-4 sm:gap-6">
          {monthKeys.map((key, i) => (
            <div key={key} className="flex flex-col items-center gap-2">
              <div className="flex h-40 w-full items-end justify-center gap-1">
                <div
                  className="w-4 rounded-t bg-wine transition-all sm:w-5"
                  style={{
                    height: `${Math.max(4, (seriesIncome[i] / chartMax) * 100)}%`,
                  }}
                  title={`Receita: ${formatCurrency(seriesIncome[i])}`}
                />
                <div
                  className="w-4 rounded-t bg-gold transition-all sm:w-5"
                  style={{
                    height: `${Math.max(4, (seriesExpense[i] / chartMax) * 100)}%`,
                  }}
                  title={`Despesa: ${formatCurrency(seriesExpense[i])}`}
                />
              </div>
              <span className="text-xs text-muted">{monthLabel(key)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-6 text-xs text-muted">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-wine" /> Recebimentos
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-gold" /> Despesas
          </span>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="panel p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-ink">
              Honorários recentes
            </h2>
            <Link
              href="/admin/casos"
              className="text-sm font-semibold text-wine"
            >
              Gerenciar em casos →
            </Link>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead className="text-xs tracking-[0.14em] text-muted uppercase">
                <tr>
                  <th className="pb-3">Descrição</th>
                  <th className="pb-3">Cliente</th>
                  <th className="pb-3">Valor</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {payments.slice(0, 10).map((payment) => (
                  <tr key={payment.id}>
                    <td className="py-3 text-ink-soft">{payment.description}</td>
                    <td className="py-3 text-muted">
                      {clientMap.get(payment.clientId)?.name || "—"}
                    </td>
                    <td className="py-3 font-medium">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="py-3">
                      <form
                        action={async (formData) => {
                          "use server";
                          await db.payments.updateStatus(
                            payment.id,
                            String(formData.get("status")),
                          );
                          revalidatePath("/admin/financeiro");
                        }}
                        className="flex gap-2"
                      >
                        <select
                          name="status"
                          defaultValue={payment.status}
                          className="rounded border border-line px-2 py-1 text-xs"
                        >
                          {Object.keys(paymentStatusLabel).map((key) => (
                            <option key={key} value={key}>
                              {paymentStatusLabel[key]}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="text-xs font-semibold text-wine"
                        >
                          Salvar
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-muted">
                      Nenhum honorário lançado ainda. Lance em um caso.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel p-6">
          <h2 className="font-display text-2xl text-ink">Despesas</h2>
          <p className="mt-1 text-sm text-muted">
            Lance despesas do escritório (aluguel, sistemas, marketing…).
          </p>

          <form
            className="mt-5 grid gap-3 md:grid-cols-4"
            action={async (formData) => {
              "use server";
              const description = String(formData.get("description") || "");
              const amount = Number(formData.get("amount") || 0);
              const category =
                String(formData.get("category") || "geral") || "geral";
              const date = formData.get("date");
              if (!description || !amount) return;
              await db.expenses.create({
                description,
                amount,
                category,
                incurredAt: date
                  ? new Date(String(date)).toISOString()
                  : undefined,
              });
              revalidatePath("/admin/financeiro");
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
              name="date"
              type="date"
              className="rounded border border-line px-3 py-2"
            />
            <select
              name="category"
              defaultValue="geral"
              className="rounded border border-line px-3 py-2 md:col-span-2"
            >
              <option value="geral">Geral</option>
              <option value="aluguel">Aluguel / condomínio</option>
              <option value="marketing">Marketing</option>
              <option value="assinaturas">Assinaturas / softwares</option>
              <option value="taxas">Taxas / impostos</option>
              <option value="viagens">Viagens</option>
              <option value="outros">Outros</option>
            </select>
            <button
              type="submit"
              className="btn btn-primary md:col-span-2 md:w-fit"
            >
              Lançar despesa
            </button>
          </form>

          <ul className="mt-6 divide-y divide-line-soft">
            {expenses.length === 0 ? (
              <li className="py-3 text-sm text-muted">
                Nenhuma despesa lançada.
                {expenses.length === 0 ? (
                  <span className="mt-2 block text-xs">
                    Se aparecer erro ao lançar, verifique se a tabela{" "}
                    <code>expenses</code> existe (rode{" "}
                    <code>supabase/migrations.sql</code>).
                  </span>
                ) : null}
              </li>
            ) : (
              expenses.slice(0, 15).map((expense) => (
                <li
                  key={expense.id}
                  className="flex items-center justify-between gap-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-ink">{expense.description}</p>
                    <p className="text-xs text-muted">
                      {formatDate(expense.incurredAt)} · {expense.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-[var(--danger)]">
                      {formatCurrency(expense.amount)}
                    </span>
                    <form
                      action={async () => {
                        "use server";
                        await db.expenses.remove(expense.id);
                        revalidatePath("/admin/financeiro");
                      }}
                    >
                      <button
                        type="submit"
                        className="text-muted hover:text-[var(--danger)]"
                        title="Remover"
                      >
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
    </AdminShell>
  );
}
