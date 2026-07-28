import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";

const nav = [
  { href: "/admin", label: "Visão geral" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/agenda", label: "Agenda" },
  { href: "/admin/casos", label: "Casos" },
  { href: "/admin/clientes", label: "Clientes" },
  { href: "/admin/blog", label: "Blog" },
];

export async function AdminShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin");
  }

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
        <h1 className="font-display text-4xl text-ink">{title}</h1>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
