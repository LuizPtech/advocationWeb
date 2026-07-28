import { notFound } from "next/navigation";
import { GeneratedDocument } from "../../../GeneratedDocument";
import { db } from "@/lib/db";
import { getBrand } from "@/lib/site-settings";
import { buildContext, renderTemplate } from "@/lib/templates";

type Props = { params: Promise<{ id: string; caseId: string }> };

export const dynamic = "force-dynamic";

export default async function GerarPorCasoPage({ params }: Props) {
  const { id, caseId } = await params;
  const [template, caseItem, brand] = await Promise.all([
    db.templates.findById(id),
    db.cases.findById(caseId),
    getBrand(),
  ]);
  if (!template || !caseItem || !caseItem.client) notFound();

  const ctx = buildContext({
    advogadaName: brand.name,
    advogadaOab: brand.oab,
    advogadaEmail: brand.email,
    advogadaPhone: brand.phone,
    advogadaAddress: brand.address,
    advogadaCity: brand.city,
    clientName: caseItem.client.name,
    clientEmail: caseItem.client.email,
    clientPhone: caseItem.client.phone,
    caseTitle: caseItem.title,
    caseDescription: caseItem.description,
    caseArea: caseItem.area,
    caseNextStep: caseItem.nextStep,
  });

  const rendered = renderTemplate(template.content, ctx);

  return (
    <GeneratedDocument
      title={template.name}
      subtitle={`Cliente: ${caseItem.client.name} · Caso: ${caseItem.title}`}
      body={rendered}
      backHref={`/admin/modelos/${id}`}
    />
  );
}
