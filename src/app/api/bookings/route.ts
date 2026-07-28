import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  type: z.enum(["ONLINE", "PRESENCIAL"]),
  area: z.string().min(2),
  notes: z.string().optional(),
  scheduledAt: z.string().datetime(),
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
    const scheduledAt = new Date(data.scheduledAt);

    if (scheduledAt.getTime() <= Date.now()) {
      return NextResponse.json(
        { error: "Selecione um horário futuro." },
        { status: 400 },
      );
    }

    const conflict = await db.bookings.findConflict(scheduledAt.toISOString());
    if (conflict) {
      return NextResponse.json(
        { error: "Este horário acabou de ser reservado. Escolha outro." },
        { status: 409 },
      );
    }

    const user = await db.users.findByEmail(data.email);

    const booking = await db.bookings.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      type: data.type,
      area: data.area,
      notes: data.notes || null,
      scheduledAt: scheduledAt.toISOString(),
      lgpdConsent: true,
      userId: user?.id,
    });

    return NextResponse.json({ ok: true, id: booking.id });
  } catch {
    return NextResponse.json(
      { error: "Erro ao criar agendamento." },
      { status: 500 },
    );
  }
}
