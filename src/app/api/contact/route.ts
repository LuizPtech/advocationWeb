import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(2),
  message: z.string().min(10),
  area: z.string().optional(),
  lgpdConsent: z.union([z.literal("true"), z.literal(true)]),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos. Verifique os campos." },
        { status: 400 },
      );
    }

    const data = parsed.data;
    await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone || null,
        subject: data.subject,
        message: data.message,
        area: data.area || null,
        lgpdConsent: true,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Erro ao salvar contato." },
      { status: 500 },
    );
  }
}
