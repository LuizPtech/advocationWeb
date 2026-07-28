import { defaultBrand, toBrandFromSettings, type Brand } from "@/lib/brand";
import { prisma } from "@/lib/prisma";

export async function getBrand(): Promise<Brand> {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  if (!settings) return defaultBrand;
  return toBrandFromSettings(settings);
}

export async function ensureSiteSettings() {
  const existing = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });
  if (existing) return existing;

  return prisma.siteSettings.create({
    data: {
      id: "default",
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
    },
  });
}
