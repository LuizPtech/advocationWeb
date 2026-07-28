import {
  faqDefault,
  howItWorks as howItWorksDefaults,
  practiceAreas as practiceAreasDefaults,
} from "@/lib/brand";
import { db } from "@/lib/db";

export type Area = {
  id: string;
  slug: string;
  title: string;
  short: string;
  description: string;
  topics: string[];
  icon: string;
  position: number;
  published: boolean;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  position: number;
};

export type Step = {
  id: string;
  stepNumber: string;
  icon: string;
  title: string;
  body: string;
  position: number;
};

export async function getAreas(): Promise<Area[]> {
  try {
    const items = await db.areas.listPublished();
    if (items.length === 0) {
      return practiceAreasDefaults.map((area, index) => ({
        id: area.slug,
        slug: area.slug,
        title: area.title,
        short: area.short,
        description: area.description,
        topics: [...area.topics],
        icon: iconFallbackForSlug(area.slug),
        position: index,
        published: true,
      }));
    }
    return items;
  } catch {
    return [];
  }
}

export async function getAreaBySlugDynamic(slug: string) {
  const areas = await getAreas();
  return areas.find((area) => area.slug === slug) || null;
}

export async function getFaq(): Promise<FaqItem[]> {
  try {
    const items = await db.faq.list();
    if (items.length === 0) {
      return faqDefault.map((f, i) => ({
        id: `default-${i}`,
        question: f.q,
        answer: f.a,
        position: i,
      }));
    }
    return items;
  } catch {
    return [];
  }
}

export async function getSteps(): Promise<Step[]> {
  try {
    const items = await db.howItWorks.list();
    if (items.length === 0) {
      return howItWorksDefaults.map((s, i) => ({
        id: `default-${i}`,
        stepNumber: s.step,
        icon: s.icon,
        title: s.title,
        body: s.text,
        position: i,
      }));
    }
    return items;
  } catch {
    return [];
  }
}

function iconFallbackForSlug(slug: string): string {
  switch (slug) {
    case "familia":
      return "users";
    case "sucessoes":
      return "shield";
    case "imobiliario":
      return "scale";
    case "trabalho":
      return "briefcase";
    case "consumidor":
      return "shopping-bag";
    default:
      return "scale";
  }
}

export const AREA_ICON_CHOICES = [
  { value: "scale", label: "Balança" },
  { value: "users", label: "Pessoas" },
  { value: "shield", label: "Escudo" },
  { value: "briefcase", label: "Maleta" },
  { value: "shopping-bag", label: "Sacola" },
  { value: "home", label: "Casa" },
  { value: "book", label: "Livro" },
  { value: "gavel", label: "Martelo" },
  { value: "file-text", label: "Documento" },
  { value: "heart", label: "Coração" },
];

export const STEP_ICON_CHOICES = [
  { value: "message", label: "Mensagem" },
  { value: "calendar", label: "Calendário" },
  { value: "shield", label: "Escudo" },
  { value: "check", label: "Checkmark" },
  { value: "phone", label: "Telefone" },
  { value: "clock", label: "Relógio" },
  { value: "file-text", label: "Documento" },
  { value: "sparkles", label: "Brilho" },
];
