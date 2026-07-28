import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await db.blog.listPublished();

  return (
    <div className="section-pad">
      <div className="container-page">
        <p className="text-sm tracking-[0.16em] text-accent uppercase">
          Conteúdo
        </p>
        <h1 className="font-display mt-3 text-5xl text-ink">Blog jurídico</h1>
        <p className="mt-5 max-w-2xl text-lg text-muted">
          Artigos acessíveis sobre família, trabalho e consumo. Conteúdo
          informativo — não substitui consulta formal.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="panel flex flex-col p-6">
              <p className="text-xs tracking-[0.12em] text-muted uppercase">
                {formatDate(post.publishedAt)}
                {post.area ? ` · ${post.area}` : ""}
              </p>
              <h2 className="font-display mt-3 text-2xl text-ink">
                {post.title}
              </h2>
              <p className="mt-3 flex-1 text-muted">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-5 text-sm font-semibold text-accent"
              >
                Ler artigo →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
