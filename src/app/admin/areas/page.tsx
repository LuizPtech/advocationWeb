import Link from "next/link";
import { revalidatePath } from "next/cache";
import { ChevronDown, PlusCircle, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Icon } from "@/components/Icon";
import { db } from "@/lib/db";
import { AREA_ICON_CHOICES, type Area, getAreas } from "@/lib/content";
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

async function installDefaults() {
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
            : "scale",
      position: index,
    });
  }
  revalidatePath("/admin/areas");
  revalidatePath("/", "layout");
}

export default async function AdminAreasPage() {
  const areas = await getAreas();
  const persisted = await db.areas.list();
  const isPersisted = persisted.length > 0;

  return (
    <AdminShell
      title="Áreas de atuação"
      subtitle="Edite os cards que aparecem na home e na página /areas."
    >
      {!isPersisted ? (
        <form className="panel mb-6 flex flex-wrap items-center justify-between gap-4 p-6" action={installDefaults}>
          <div>
            <h2 className="font-display text-xl text-ink">
              Ainda usando as áreas padrão
            </h2>
            <p className="mt-1 text-sm text-muted">
              Instale-as no banco para poder editar.
            </p>
          </div>
          <button type="submit" className="btn btn-gold">
            Instalar áreas padrão
          </button>
        </form>
      ) : null}

      <div className="space-y-3">
        {areas.map((area) => (
          <AreaEditor key={area.id} area={area} readOnly={!isPersisted} />
        ))}
      </div>

      {isPersisted ? <NewAreaCard nextPosition={areas.length + 1} /> : null}
    </AdminShell>
  );
}

function AreaEditor({ area, readOnly }: { area: Area; readOnly: boolean }) {
  return (
    <details className="editor-card">
      <summary>
        <span className="badge-ico badge-ico-gold">
          <Icon name={area.icon} size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg text-ink truncate">{area.title}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
            <span>/areas/{area.slug}</span>
            <span className={`chip ${area.published ? "" : "chip-muted"}`}>
              {area.published ? "Publicado" : "Rascunho"}
            </span>
            <span className="chip chip-muted">Ordem {area.position}</span>
          </div>
        </div>
        <ChevronDown size={18} className="caret shrink-0" />
      </summary>

      <div className="editor-body">
        {readOnly ? (
          <p className="text-sm text-muted">
            Somente leitura — instale as áreas primeiro.
          </p>
        ) : (
          <form
            action={async (formData) => {
              "use server";
              await db.areas.update(area.id, {
                slug: String(formData.get("slug") || area.slug),
                title: String(formData.get("title") || area.title),
                short: String(formData.get("short") || area.short),
                description: String(
                  formData.get("description") || area.description,
                ),
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
            <div className="grid gap-5 md:grid-cols-2">
              <div className="field">
                <label>Nome</label>
                <input name="title" defaultValue={area.title} required />
              </div>
              <div className="field">
                <label>Slug (URL)</label>
                <input name="slug" defaultValue={area.slug} required />
              </div>
              <div className="field md:col-span-2">
                <label>Resumo (aparece nos cards)</label>
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
                <label>Tópicos frequentes (um por linha)</label>
                <textarea
                  name="topics"
                  rows={4}
                  defaultValue={area.topics.join("\n")}
                  placeholder="Ex.:&#10;Divórcio consensual&#10;Guarda compartilhada"
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
                <label>Ordem</label>
                <input
                  type="number"
                  name="position"
                  defaultValue={area.position}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-5">
              <label className="flex items-center gap-2 text-sm text-ink-soft">
                <input
                  type="checkbox"
                  name="published"
                  defaultChecked={area.published}
                  className="h-4 w-4 accent-[var(--wine)]"
                />
                Publicado no site
              </label>
              <div className="flex items-center gap-3">
                <Link
                  href={`/areas/${area.slug}`}
                  target="_blank"
                  className="text-sm text-wine"
                >
                  Ver no site ↗
                </Link>
                <button type="submit" className="btn btn-primary text-sm">
                  Salvar alterações
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
                    title="Excluir área"
                  >
                    <Trash2 size={14} /> Excluir
                  </button>
                </form>
              </div>
            </div>
          </form>
        )}
      </div>
    </details>
  );
}

function NewAreaCard({ nextPosition }: { nextPosition: number }) {
  return (
    <details className="editor-card mt-6">
      <summary>
        <span className="badge-ico badge-ico-wine">
          <PlusCircle size={20} />
        </span>
        <div className="flex-1">
          <p className="font-display text-lg text-ink">Adicionar nova área</p>
          <p className="mt-1 text-xs text-muted">
            Aparecerá na home e em /areas assim que salvar.
          </p>
        </div>
        <ChevronDown size={18} className="caret shrink-0" />
      </summary>
      <div className="editor-body">
        <form
          className="grid gap-5 md:grid-cols-2"
          action={async (formData) => {
            "use server";
            const title = String(formData.get("title") || "").trim();
            const slug =
              String(formData.get("slug") || "").trim() || slugify(title);
            const short = String(formData.get("short") || "").trim();
            const description = String(formData.get("description") || "").trim();
            const icon = String(formData.get("icon") || "scale");
            if (!title || !slug || !short || !description) return;
            await db.areas.create({
              slug,
              title,
              short,
              description,
              topics: String(formData.get("topics") || "")
                .split("\n")
                .map((t) => t.trim())
                .filter(Boolean),
              icon,
              position: nextPosition,
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
            <label>Resumo</label>
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
          <div className="md:col-span-2 flex justify-end pt-2">
            <button type="submit" className="btn btn-primary">
              Adicionar área
            </button>
          </div>
        </form>
      </div>
    </details>
  );
}
