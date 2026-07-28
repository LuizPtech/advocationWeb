import { db } from "@/lib/db";

export type NavItem = { label: string; href: string };

export const DEFAULT_NAV_ITEMS: (NavItem & { position: number })[] = [
  { label: "Sobre", href: "/sobre", position: 1 },
  { label: "Áreas", href: "/areas", position: 2 },
  { label: "Como funciona", href: "/como-funciona", position: 3 },
  { label: "Blog", href: "/blog", position: 4 },
  { label: "Contato", href: "/contato", position: 5 },
];

export async function getNavItems(): Promise<NavItem[]> {
  try {
    const items = await db.nav.listVisible();
    if (items.length === 0) return DEFAULT_NAV_ITEMS;
    return items.map((item) => ({ label: item.label, href: item.href }));
  } catch {
    return DEFAULT_NAV_ITEMS;
  }
}
