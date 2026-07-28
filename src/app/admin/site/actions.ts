"use server";

import { revalidatePath } from "next/cache";
import { whatsappDigits } from "@/lib/brand";
import { db } from "@/lib/db";

export type SaveSiteState = {
  ok: boolean;
  message: string;
} | null;

export async function saveSiteAction(
  _prev: SaveSiteState,
  formData: FormData,
): Promise<SaveSiteState> {
  try {
    const phone = String(formData.get("phone") || "").trim();
    const digits = whatsappDigits(phone);
    const whatsappRaw = String(formData.get("whatsapp") || "").trim();

    await db.settings.upsert({
      name: String(formData.get("name") || ""),
      shortName: String(formData.get("shortName") || ""),
      title: String(formData.get("title") || "Advogada"),
      oab: String(formData.get("oab") || ""),
      tagline: String(formData.get("tagline") || ""),
      headline: String(formData.get("headline") || ""),
      about: String(formData.get("about") || ""),
      email: String(formData.get("email") || ""),
      phone,
      whatsapp: whatsappRaw || (digits ? `https://wa.me/${digits}` : ""),
      address: String(formData.get("address") || ""),
      city: String(formData.get("city") || ""),
      photoUrl: String(formData.get("photoUrl") || "") || null,
      heroImageUrl: String(formData.get("heroImageUrl") || "") || null,
      showPhoto: formData.get("showPhoto") === "on",
    });

    revalidatePath("/");
    revalidatePath("/sobre");
    revalidatePath("/contato");
    revalidatePath("/privacidade");
    revalidatePath("/termos");
    revalidatePath("/admin/site");

    return { ok: true, message: "Alterações salvas com sucesso!" };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? `Erro ao salvar: ${error.message}`
          : "Erro ao salvar alterações.",
    };
  }
}
