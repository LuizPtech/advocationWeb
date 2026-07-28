"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import type { Brand } from "@/lib/brand";
import type { NavItem } from "@/lib/nav";
import { cn } from "@/lib/utils";

function isExternal(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function SiteHeader({
  brand,
  links,
}: {
  brand: Brand;
  links: NavItem[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-[rgba(247,237,224,0.82)] backdrop-blur-xl">
      <div className="container-page flex items-center justify-between gap-4 py-4">
        <Link href="/" className="group flex min-w-0 items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold bg-paper-elevated font-display text-xl text-wine">
            {brand.shortName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </span>
          <span className="min-w-0">
            <span className="font-display block truncate text-xl leading-none text-ink transition-colors group-hover:text-wine md:text-2xl">
              {brand.shortName}
            </span>
            <span className="mt-1 block truncate text-[0.68rem] tracking-[0.22em] text-muted uppercase">
              {brand.title} · {brand.oab}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((link) =>
            isExternal(link.href) ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="nav-link"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link"
                data-active={
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href)
                }
              >
                {link.label}
              </Link>
            ),
          )}
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
          "border-t border-line-soft bg-paper-elevated lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <div className="container-page flex flex-col gap-4 py-4">
          {links.map((link) =>
            isExternal(link.href) ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-ink-soft"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-ink-soft"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ),
          )}
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
