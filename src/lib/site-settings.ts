import { defaultBrand, toBrandFromSettings, type Brand } from "@/lib/brand";
import { db } from "@/lib/db";

export async function getBrand(): Promise<Brand> {
  try {
    const settings = await db.settings.get();
    if (!settings) return defaultBrand;
    return toBrandFromSettings(settings);
  } catch {
    return defaultBrand;
  }
}

export async function ensureSiteSettings() {
  const existing = await db.settings.get();
  if (existing) return existing;

  return db.settings.upsert({
    name: defaultBrand.name,
    shortName: defaultBrand.shortName,
    title: defaultBrand.title,
    oab: defaultBrand.oab,
    tagline: defaultBrand.tagline,
    headline: defaultBrand.headline,
    about: defaultBrand.about,
    email: defaultBrand.email,
    phone: defaultBrand.phone,
    whatsapp: defaultBrand.whatsapp,
    address: defaultBrand.address,
    city: defaultBrand.city,
    photoUrl: defaultBrand.photoUrl,
    heroImageUrl: defaultBrand.heroImageUrl,
  });
}
