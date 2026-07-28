import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Props) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id } = await params;
  const doc = await prisma.document.findUnique({
    where: { id },
    include: { case: true },
  });

  if (!doc) {
    return NextResponse.json({ error: "Documento não encontrado." }, { status: 404 });
  }

  const isAdmin = session.user.role === "ADMIN";
  const isOwner = doc.case?.clientId === session.user.id;

  if (!isAdmin && (!isOwner || !doc.visibleToClient)) {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  try {
    const file = await readFile(doc.path);
    return new NextResponse(file, {
      headers: {
        "Content-Type": doc.mimeType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(doc.filename)}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Arquivo ausente." }, { status: 404 });
  }
}
