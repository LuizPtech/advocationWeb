import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";

type Props = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Props) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id } = await params;
  const doc = await db.documents.findById(id);

  if (!doc) {
    return NextResponse.json({ error: "Documento não encontrado." }, { status: 404 });
  }

  const isAdmin = session.user.role === "ADMIN";
  const isOwner = doc.case?.clientId === session.user.id;

  if (!isAdmin && (!isOwner || !doc.visibleToClient)) {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin.storage
    .from("documents")
    .download(doc.path);

  if (error || !data) {
    return NextResponse.json({ error: "Arquivo ausente." }, { status: 404 });
  }

  const buffer = Buffer.from(await data.arrayBuffer());
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": doc.mimeType,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(doc.filename)}"`,
    },
  });
}
