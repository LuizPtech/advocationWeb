import { notFound } from "next/navigation";
import { GeneratedDocument } from "../../../GeneratedDocument";
import { db } from "@/lib/db";
import { getBrand } from "@/lib/site-settings";
import { buildContext, renderTemplate } from "@/lib/templates";

type Props = { params: Promise<{ id: string; clientId: string }> };

export const dynamic = "force-dynamic";

export default async function GerarPorClientePage({ params }: Props) {
  const { id, clientId } = await params;
  const [template, client, brand] = await Promise.all([
    db.templates.findById(id),
    db.users.findById(clientId),
    getBrand(),
  ]);
  if (!template || !client) notFound();

  const ctx = buildContext({
    advogadaName: brand.name,
    advogadaOab: brand.oab,
    advogadaEmail: brand.email,
    advogadaPhone: brand.phone,
    advogadaAddress: brand.address,
    advogadaCity: brand.city,
    clientName: client.name,
    clientEmail: client.email,
    clientPhone: client.phone,
  });

  const rendered = renderTemplate(template.content, ctx);

  return (
    <GeneratedDocument
      title={template.name}
      subtitle={`Cliente: ${client.name}`}
      body={rendered}
      backHref={`/admin/modelos/${id}`}
    />
  );
}
