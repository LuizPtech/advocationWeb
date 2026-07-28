import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

  const caseRecord = await prisma.case.findUnique({ where: { id: caseId } });
  if (!caseRecord) {
    return NextResponse.json({ error: "Caso não encontrado." }, { status: 404 });
  }

  const isAdmin = session.user.role === "ADMIN";
  if (!isAdmin && caseRecord.clientId !== session.user.id) {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const uploadsDir = path.join(process.cwd(), "uploads", caseId);
  await mkdir(uploadsDir, { recursive: true });

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filename = `${Date.now()}-${safeName}`;
  const fullPath = path.join(uploadsDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(fullPath, buffer);

  await prisma.document.create({
    data: {
      name: file.name,
      filename,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      path: fullPath,
      visibleToClient: true,
      caseId,
      uploadedById: session.user.id,
    },
  });

  const redirectTo =
    session.user.role === "ADMIN"
      ? `/admin/casos/${caseId}`
      : "/area-cliente";

  return NextResponse.redirect(new URL(redirectTo, request.url));
}
