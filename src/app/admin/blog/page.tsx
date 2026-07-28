import Link from "next/link";
import { revalidatePath } from "next/cache";
import { AdminShell } from "@/components/admin/AdminShell";
import { practiceAreas } from "@/lib/brand";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default async function AdminBlogPage() {
  const posts = await db.blog.listAll();

  return (
    <AdminShell title="Conteúdo do blog">
      <form
        className="panel mb-8 grid gap-4 p-6"
        action={async (formData) => {
          "use server";
          const title = String(formData.get("title") || "").trim();
          const excerpt = String(formData.get("excerpt") || "").trim();
          const content = String(formData.get("content") || "").trim();
          const area = String(formData.get("area") || "") || null;
          if (!title || !excerpt || !content) return;

          let slug = slugify(title);
          const exists = await db.blog.bySlug(slug);
          if (exists) slug = `${slug}-${Date.now()}`;

          await db.blog.create({
            title,
            excerpt,
            content,
            area,
            slug,
          });
          revalidatePath("/admin/blog");
          revalidatePath("/blog");
        }}
      >
        <h2 className="font-display text-2xl">Novo artigo</h2>
        <div className="field">
          <label htmlFor="title">Título</label>
          <input id="title" name="title" required />
        </div>
        <div className="field">
          <label htmlFor="area">Área</label>
          <select id="area" name="area" defaultValue="">
            <option value="">Geral</option>
            {practiceAreas.map((area) => (
              <option key={area.slug} value={area.slug}>
                {area.title}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="excerpt">Resumo</label>
          <input id="excerpt" name="excerpt" required />
        </div>
        <div className="field">
          <label htmlFor="content">Conteúdo</label>
          <textarea id="content" name="content" rows={8} required />
        </div>
        <button type="submit" className="btn btn-primary w-fit">
          Publicar
        </button>
      </form>

      <div className="space-y-4">
        {posts.map((post) => (
          <article
            key={post.id}
            className="panel flex flex-wrap items-center justify-between gap-4 p-5"
          >
            <div>
              <h3 className="font-semibold">{post.title}</h3>
              <p className="text-sm text-muted">
                {formatDate(post.publishedAt)}
                {post.published ? " · publicado" : " · rascunho"}
              </p>
            </div>
            <div className="flex gap-3">
              <Link href={`/blog/${post.slug}`} className="btn btn-ghost text-sm">
                Ver
              </Link>
              <form
                action={async () => {
                  "use server";
                  await db.blog.setPublished(post.id, !post.published);
                  revalidatePath("/admin/blog");
                  revalidatePath("/blog");
                }}
              >
                <button type="submit" className="btn btn-secondary text-sm">
                  {post.published ? "Despublicar" : "Publicar"}
                </button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
