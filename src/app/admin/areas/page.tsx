import Link from "next/link";
import { revalidatePath } from "next/cache";
import { PlusCircle, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Icon } from "@/components/Icon";
import { db } from "@/lib/db";
import {
  AREA_ICON_CHOICES,
  type Area,
  getAreas,
} from "@/lib/content";
import { practiceAreas as defaults } from "@/lib/brand";

export const dynamic = "force-dynamic";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default async function AdminAreasPage() {
  const areas = await getAreas();
  const persistedItems = await db.areas.list();
  const persisted = persistedItems.length > 0;

  return (
    <AdminShell
      title="Áreas de atuação"
      subtitle="Edite os cards que aparecem na home e na página /areas."
    >
      {!persisted ? (
        <div className="panel mb-6 p-6">
          <h2 className="font-display text-2xl text-ink">Começar do zero</h2>
          <p className="mt-2 text-muted">
            Hoje o site mostra áreas padrão (Família, Sucessões, Imobiliário).
            Instale-as no banco para poder editar.
          </p>
          <form
            action={async () => {
              "use server";
              for (const [index, area] of defaults.entries()) {
                await db.areas.create({
                  slug: area.slug,
                  title: area.title,
                  short: area.short,
                  description: area.description,
                  topics: [...area.topics],
                  icon:
                    area.slug === "familia"
                      ? "users"
                      : area.slug === "sucessoes"
                        ? "shield"
                        : area.slug === "imobiliario"
                          ? "scale"
                          : "scale",
                  position: index,
                });
              }
              revalidatePath("/admin/areas");
              revalidatePath("/", "layout");
            }}
            className="mt-4"
          >
            <button type="submit" className="btn btn-gold">
              Instalar áreas padrão
            </button>
          </form>
        </div>
      ) : null}

      <div className="space-y-6">
        {areas.map((area) => (
          <AreaForm key={area.id} area={area} readOnly={!persisted} />
        ))}
      </div>

      {persisted ? (
        <details className="panel mt-8 p-6" open>
          <summary className="cursor-pointer font-semibold text-ink">
            <PlusCircle size={16} className="mr-1 inline" /> Adicionar nova área
          </summary>
          <form
            className="mt-4 grid gap-4 md:grid-cols-2"
            action={async (formData) => {
              "use server";
              const title = String(formData.get("title") || "").trim();
              const slug =
                String(formData.get("slug") || "").trim() || slugify(title);
              const short = String(formData.get("short") || "").trim();
              const description = String(
                formData.get("description") || "",
              ).trim();
              const topicsRaw = String(formData.get("topics") || "");
              const icon = String(formData.get("icon") || "scale");
              if (!title || !slug || !short || !description) return;
              await db.areas.create({
                slug,
                title,
                short,
                description,
                topics: topicsRaw
                  .split("\n")
                  .map((t) => t.trim())
                  .filter(Boolean),
                icon,
                position: 999,
              });
              revalidatePath("/admin/areas");
              revalidatePath("/", "layout");
            }}
          >
            <div className="field">
              <label>Nome</label>
              <input name="title" required />
            </div>
            <div className="field">
              <label>Slug (URL)</label>
              <input name="slug" placeholder="ex.: trabalhista" />
            </div>
            <div className="field md:col-span-2">
              <label>Resumo (aparece nos cards)</label>
              <input name="short" required />
            </div>
            <div className="field md:col-span-2">
              <label>Descrição completa</label>
              <textarea name="description" rows={3} required />
            </div>
            <div className="field md:col-span-2">
              <label>Tópicos (um por linha)</label>
              <textarea name="topics" rows={4} />
            </div>
            <div className="field">
              <label>Ícone</label>
              <select name="icon" defaultValue="scale">
                {AREA_ICON_CHOICES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="btn btn-primary self-end md:col-span-2 md:w-fit"
            >
              Adicionar área
            </button>
          </form>
        </details>
      ) : null}
    </AdminShell>
  );
}

function AreaForm({ area, readOnly }: { area: Area; readOnly: boolean }) {
  return (
    <form
      className="panel p-6"
      action={async (formData) => {
        "use server";
        await db.areas.update(area.id, {
          slug: String(formData.get("slug") || area.slug),
          title: String(formData.get("title") || area.title),
          short: String(formData.get("short") || area.short),
          description: String(formData.get("description") || area.description),
          topics: String(formData.get("topics") || "")
            .split("\n")
            .map((t) => t.trim())
            .filter(Boolean),
          icon: String(formData.get("icon") || area.icon),
          position: Number(formData.get("position") || area.position),
          published: formData.get("published") === "on",
        });
        revalidatePath("/admin/areas");
        revalidatePath("/", "layout");
        revalidatePath(`/areas/${area.slug}`);
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="badge-ico badge-ico-gold">
            <Icon name={area.icon} size={20} />
          </span>
          <div>
            <h3 className="font-display text-xl text-ink">{area.title}</h3>
            <p className="text-xs text-muted">/{area.slug}</p>
          </div>
        </div>
        {readOnly ? (
          <p className="text-xs text-muted">
            Somente leitura — instale as áreas primeiro.
          </p>
        ) : (
          <div className="flex items-center gap-3 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="published"
                defaultChecked={area.published}
                className="h-4 w-4 accent-[var(--wine)]"
              />
              Publicado
            </label>
            <button type="submit" className="btn btn-ghost text-sm">
              Salvar
            </button>
            <form
              action={async () => {
                "use server";
                await db.areas.remove(area.id);
                revalidatePath("/admin/areas");
                revalidatePath("/", "layout");
              }}
            >
              <button
                type="submit"
                className="inline-flex items-center gap-1 text-xs text-muted hover:text-[var(--danger)]"
              >
                <Trash2 size={14} /> Excluir
              </button>
            </form>
          </div>
        )}
      </div>

      {!readOnly ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="field">
            <label>Nome</label>
            <input name="title" defaultValue={area.title} required />
          </div>
          <div className="field">
            <label>Slug</label>
            <input name="slug" defaultValue={area.slug} required />
          </div>
          <div className="field md:col-span-2">
            <label>Resumo (cards)</label>
            <input name="short" defaultValue={area.short} required />
          </div>
          <div className="field md:col-span-2">
            <label>Descrição completa</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={area.description}
              required
            />
          </div>
          <div className="field md:col-span-2">
            <label>Tópicos (um por linha)</label>
            <textarea
              name="topics"
              rows={4}
              defaultValue={area.topics.join("\n")}
            />
          </div>
          <div className="field">
            <label>Ícone</label>
            <select name="icon" defaultValue={area.icon}>
              {AREA_ICON_CHOICES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Posição</label>
            <input
              type="number"
              name="position"
              defaultValue={area.position}
              className="w-24"
            />
          </div>
        </div>
      ) : null}

      <p className="mt-4 text-xs text-muted">
        Preview público:{" "}
        <Link href={`/areas/${area.slug}`} className="text-wine">
          /areas/{area.slug}
        </Link>
      </p>
    </form>
  );
}
