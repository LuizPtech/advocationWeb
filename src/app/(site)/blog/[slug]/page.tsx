import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.blog.bySlug(slug);
  return { title: post?.title ?? "Artigo" };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await db.blog.bySlug(slug);
  if (!post || !post.published) notFound();

  return (
    <article className="section-pad">
      <div className="container-page max-w-3xl">
        <Link href="/blog" className="text-sm font-semibold text-accent">
          ← Blog
        </Link>
        <p className="mt-6 text-xs tracking-[0.12em] text-muted uppercase">
          {formatDate(post.publishedAt)}
          {post.area ? ` · ${post.area}` : ""}
        </p>
        <h1 className="font-display mt-3 text-5xl text-ink">{post.title}</h1>
        <p className="mt-5 text-lg text-muted">{post.excerpt}</p>
        <div className="prose-legal mt-10 space-y-4 text-lg leading-relaxed text-ink-soft whitespace-pre-line">
          {post.content}
        </div>
        <div className="mt-12 border-t border-line pt-8">
          <p className="text-sm text-muted">
            Este conteúdo é informativo e não constitui aconselhamento jurídico
            personalizado.
          </p>
          <Link href="/agendar" className="btn btn-primary mt-5">
            Agendar consulta
          </Link>
        </div>
      </div>
    </article>
  );
}
