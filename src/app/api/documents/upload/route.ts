import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const form = await request.formData();
  const caseId = String(form.get("caseId") || "");
  const file = form.get("file");

  if (!caseId || !(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Arquivo inválido." }, { status: 400 });
  }

  const caseRecord = await db.cases.findById(caseId);
  if (!caseRecord) {
    return NextResponse.json({ error: "Caso não encontrado." }, { status: 404 });
  }

  const isAdmin = session.user.role === "ADMIN";
  if (!isAdmin && caseRecord.clientId !== session.user.id) {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filename = `${Date.now()}-${safeName}`;
  const storagePath = `${caseId}/${filename}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabaseAdmin.storage
    .from("documents")
    .upload(storagePath, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: `Falha no upload: ${uploadError.message}` },
      { status: 500 },
    );
  }

  await db.documents.create({
    name: file.name,
    filename,
    mimeType: file.type || "application/octet-stream",
    size: file.size,
    path: storagePath,
    caseId,
    uploadedById: session.user.id,
  });

  const redirectTo =
    session.user.role === "ADMIN"
      ? `/admin/casos/${caseId}`
      : "/area-cliente";

  return NextResponse.redirect(new URL(redirectTo, request.url));
}
