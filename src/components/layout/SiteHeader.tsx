"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import type { Brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

const links = [
  { href: "/sobre", label: "Sobre" },
  { href: "/areas", label: "Áreas" },
  { href: "/como-funciona", label: "Como funciona" },
  { href: "/blog", label: "Blog" },
  { href: "/contato", label: "Contato" },
];

export function SiteHeader({ brand }: { brand: Brand }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-[rgba(245,247,248,0.86)] backdrop-blur-md">
      <div className="container-page flex items-center justify-between gap-4 py-4">
        <Link href="/" className="group min-w-0">
          <p className="font-display text-2xl leading-none text-ink transition-colors group-hover:text-accent md:text-[1.7rem]">
            {brand.shortName}
          </p>
          <p className="mt-1 text-xs tracking-[0.14em] text-muted uppercase">
            {brand.title} · {brand.oab}
          </p>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link"
              data-active={pathname.startsWith(link.href)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/login" className="nav-link">
            Entrar
          </Link>
          <Link href="/agendar" className="btn btn-primary">
            Agendar consulta
          </Link>
        </div>

        <button
          type="button"
          className="btn btn-ghost px-3 py-2 lg:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-line/70 bg-paper-elevated lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <div className="container-page flex flex-col gap-4 py-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-ink-soft"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/login" onClick={() => setOpen(false)}>
            Entrar
          </Link>
          <Link
            href="/agendar"
            className="btn btn-primary"
            onClick={() => setOpen(false)}
          >
            Agendar consulta
          </Link>
        </div>
      </div>
    </header>
  );
}
