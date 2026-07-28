import "dotenv/config";
import { createId } from "@paralleldrive/cuid2";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL!;
const secret = process.env.SUPABASE_SECRET_KEY!;

if (!url || !secret) {
  console.error("Configure SUPABASE_URL e SUPABASE_SECRET_KEY no .env");
  process.exit(1);
}

const supabase = createClient(url, secret, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const STAFF_PASSWORD_HASH =
  "$2b$10$WJHVQGYQDWqGHHcmgb1vo.NBcCtU4ZPsP49clR9M0HxwjBWDrX5WK";

const staffUsers = [
  {
    email: "lauraadv@lauraeva.adv.br",
    name: "Dra. Laura Eva",
    role: "ADMIN",
  },
  {
    email: "luizphelipe@lauraeva.adv.br",
    name: "Luiz Phelipe",
    role: "ADMIN",
  },
] as const;

async function upsertUser(input: {
  email: string;
  name: string;
  role: string;
  passwordHash: string;
}) {
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", input.email)
    .maybeSingle();

  if (existing?.id) {
    const { error } = await supabase
      .from("users")
      .update({
        name: input.name,
        password_hash: input.passwordHash,
        role: input.role,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
    if (error) throw error;
    return existing.id as string;
  }

  const id = createId();
  const { error } = await supabase.from("users").insert({
    id,
    name: input.name,
    email: input.email,
    password_hash: input.passwordHash,
    role: input.role,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
  return id;
}

async function main() {
  const probe = await supabase.from("users").select("id").limit(1);
  if (probe.error) {
    console.error("\nTabelas ainda não existem no Supabase.");
    console.error("1) Execute supabase/schema.sql no SQL Editor");
    console.error("2) Depois: npm run db:seed\n");
    console.error("Erro:", probe.error.message);
    process.exit(1);
  }

  const passwordHash = STAFF_PASSWORD_HASH;

  // Remove usuários de demonstração
  const demoEmails = ["admin@lauraeva.adv.br", "cliente@exemplo.com"];
  for (const email of demoEmails) {
    const { data: demo } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (demo?.id) {
      await supabase.from("messages").delete().eq("author_id", demo.id);
      await supabase.from("notes").delete().eq("author_id", demo.id);
      await supabase.from("documents").delete().eq("uploaded_by_id", demo.id);
      await supabase.from("payments").delete().eq("client_id", demo.id);
      await supabase.from("bookings").delete().eq("user_id", demo.id);
      await supabase.from("cases").delete().eq("client_id", demo.id);
      await supabase.from("users").delete().eq("id", demo.id);
    }
  }

  for (const user of staffUsers) {
    await upsertUser({
      email: user.email,
      name: user.name,
      role: user.role,
      passwordHash,
    });
  }

  await supabase.from("site_settings").upsert({
    id: "default",
    name: "Dra. Laura Eva",
    short_name: "Laura Eva",
    title: "Advogada",
    oab: "OAB/SP 000.000",
    tagline:
      "Orientação jurídica clara, com acompanhamento humano em cada etapa.",
    headline:
      "Advocacia em família, trabalho e relações de consumo — com clareza desde o primeiro contato.",
    about:
      "Advogada com atuação em Direito de Família, Direito do Trabalho e Direito do Consumidor. O atendimento começa com escuta, segue com análise objetiva das opções e permanece transparente no acompanhamento do caso — com linguagem clara e próximos passos bem definidos.",
    email: "contato@lauraeva.adv.br",
    phone: "(11) 98765-4321",
    whatsapp: "https://wa.me/5511987654321",
    address: "São Paulo, SP",
    city: "São Paulo",
    updated_at: new Date().toISOString(),
  });

  const posts = [
    {
      slug: "divorcio-consensual-passo-a-passo",
      title: "Divórcio consensual: o que precisa saber antes de começar",
      excerpt:
        "Documentos, prazos e o que muda quando há filhos menores envolvidos.",
      area: "familia",
      content:
        "O divórcio consensual é o caminho mais célere quando as partes estão de acordo. Este conteúdo é informativo e não substitui consulta jurídica personalizada.",
    },
    {
      slug: "verbas-rescisorias-checklist",
      title: "Demissão: checklist de verbas rescisórias",
      excerpt:
        "O que conferir no termo de rescisão e quando buscar orientação.",
      area: "trabalho",
      content:
        "Ao ser demitido, confira saldo de salário, férias proporcionais, 13º, aviso prévio e FGTS.",
    },
    {
      slug: "negativacao-indevida-o-que-fazer",
      title: "Negativação indevida: primeiros passos",
      excerpt:
        "Como agir quando seu nome é negativado sem dívida legítima.",
      area: "consumidor",
      content:
        "Reúna comprovantes e busque orientação jurídica para exclusão e eventual indenização.",
    },
  ];

  for (const post of posts) {
    const { data: existing } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", post.slug)
      .maybeSingle();
    if (existing) {
      await supabase.from("blog_posts").update(post).eq("id", existing.id);
    } else {
      await supabase.from("blog_posts").insert({
        id: createId(),
        ...post,
        published: true,
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  }

  console.log("Seed concluído.");
  console.log("Usuários admin:");
  console.log("- lauraadv@lauraeva.adv.br");
  console.log("- luizphelipe@lauraeva.adv.br");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
