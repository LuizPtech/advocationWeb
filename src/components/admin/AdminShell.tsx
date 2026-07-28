import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Briefcase,
  Calendar,
  ExternalLink,
  FileText,
  LayoutDashboard,
  LogOut,
  Palette,
  UserCog,
  Users,
} from "lucide-react";
import { auth, signOut } from "@/lib/auth";

const nav = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/site", label: "Editar site", icon: Palette },
  { href: "/admin/leads", label: "Leads", icon: UserCog },
  { href: "/admin/agenda", label: "Agenda", icon: Calendar },
  { href: "/admin/casos", label: "Casos", icon: Briefcase },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/blog", label: "Blog", icon: FileText },
];

export async function AdminShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <div className="dashboard-shell">
      <aside className="admin-sidebar">
        <div className="flex items-center gap-3">
          <span className="font-display grid h-11 w-11 place-items-center rounded-full border border-gold/70 text-xl text-gold-soft">
            {(session.user.name || "").slice(0, 1)}
          </span>
          <div className="min-w-0">
            <p className="font-display truncate text-xl">Painel</p>
            <p className="truncate text-xs text-gold-soft/80">
              {session.user.name}
            </p>
          </div>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="admin-nav-link">
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 border-t border-white/10 pt-6 space-y-2">
          <Link
            href="/"
            className="admin-nav-link"
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink size={16} />
            Ver site
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button type="submit" className="admin-nav-link w-full text-left">
              <LogOut size={16} />
              Sair
            </button>
          </form>
        </div>
      </aside>

      <div className="p-6 md:p-10">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line-soft pb-6">
          <div>
            <p className="text-xs tracking-[0.22em] text-gold-deep uppercase">
              Painel administrativo
            </p>
            <h1 className="font-display mt-2 text-4xl text-ink">{title}</h1>
            {subtitle ? (
              <p className="mt-2 max-w-2xl text-muted">{subtitle}</p>
            ) : null}
          </div>
          {actions ? <div className="flex gap-2">{actions}</div> : null}
        </header>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
