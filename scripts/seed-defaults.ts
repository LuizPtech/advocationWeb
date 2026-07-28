import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { createId } from "@paralleldrive/cuid2";
import { DEFAULT_TEMPLATES } from "../src/lib/templates";
import { DEFAULT_NAV_ITEMS } from "../src/lib/nav";

async function main() {
  const s = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false } },
  );

  const now = new Date().toISOString();

  const { count: templateCount } = await s
    .from("document_templates")
    .select("*", { count: "exact", head: true });
  if ((templateCount || 0) === 0) {
    for (const template of DEFAULT_TEMPLATES) {
      const { error } = await s.from("document_templates").insert({
        id: createId(),
        name: template.name,
        category: template.category,
        content: template.content,
        updated_at: now,
      });
      if (error) console.error("template err:", error);
    }
    console.log(`Seed: ${DEFAULT_TEMPLATES.length} templates criados.`);
  } else {
    console.log(`Seed: templates já existem (${templateCount}).`);
  }

  const { count: navCount } = await s
    .from("nav_items")
    .select("*", { count: "exact", head: true });
  if ((navCount || 0) === 0) {
    for (const item of DEFAULT_NAV_ITEMS) {
      const { error } = await s.from("nav_items").insert({
        id: createId(),
        label: item.label,
        href: item.href,
        position: item.position,
        visible: true,
      });
      if (error) console.error("nav err:", error);
    }
    console.log(`Seed: ${DEFAULT_NAV_ITEMS.length} itens de menu criados.`);
  } else {
    console.log(`Seed: nav_items já existem (${navCount}).`);
  }
}
main();
