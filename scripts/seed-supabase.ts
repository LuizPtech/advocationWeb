import "dotenv/config";
import bcrypt from "bcryptjs";
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

async function main() {
  const probe = await supabase.from("users").select("id").limit(1);
  if (probe.error) {
    console.error("\nTabelas ainda não existem no Supabase.");
    console.error(
      "1) Abra o SQL Editor do projeto e execute o arquivo supabase/schema.sql",
    );
    console.error(
      "2) Depois rode novamente: npm run db:seed\n",
    );
    console.error("Erro:", probe.error.message);
    process.exit(1);
  }

  const adminHash = await bcrypt.hash("admin123", 10);
  const clientHash = await bcrypt.hash("cliente123", 10);

  const { data: existingAdmin } = await supabase
    .from("users")
    .select("*")
    .eq("email", "admin@lauraeva.adv.br")
    .maybeSingle();

  let adminId = existingAdmin?.id as string | undefined;
  if (!adminId) {
    adminId = createId();
    const { error } = await supabase.from("users").insert({
      id: adminId,
      name: "Dra. Laura Eva",
      email: "admin@lauraeva.adv.br",
      password_hash: adminHash,
      role: "ADMIN",
      phone: "(11) 98765-4321",
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
  } else {
    await supabase
      .from("users")
      .update({ name: "Dra. Laura Eva", password_hash: adminHash })
      .eq("id", adminId);
  }

  const { data: existingClient } = await supabase
    .from("users")
    .select("*")
    .eq("email", "cliente@exemplo.com")
    .maybeSingle();

  let clientId = existingClient?.id as string | undefined;
  if (!clientId) {
    clientId = createId();
    const { error } = await supabase.from("users").insert({
      id: clientId,
      name: "Ana Souza",
      email: "cliente@exemplo.com",
      password_hash: clientHash,
      role: "CLIENT",
      phone: "(11) 91234-5678",
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
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

  const { data: existingCase } = await supabase
    .from("cases")
    .select("*")
    .eq("client_id", clientId)
    .maybeSingle();

  let caseId = existingCase?.id as string | undefined;
  if (!caseId) {
    caseId = createId();
    const { error } = await supabase.from("cases").insert({
      id: caseId,
      title: "Divórcio consensual",
      description:
        "Acompanhamento de divórcio consensual com partilha de bens e regulamentação de convivência.",
      area: "familia",
      status: "IN_PROGRESS",
      next_step: "Enviar certidão de casamento atualizada",
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
      tags: JSON.stringify(["divórcio", "consensual"]),
      client_id: clientId,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
  }

  const { count: messageCount } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("case_id", caseId);

  if (!messageCount) {
    await supabase.from("messages").insert([
      {
        id: createId(),
        case_id: caseId,
        author_id: adminId,
        body: "Olá, Ana. Seu caso foi aberto. Assim que os documentos chegarem, avanço com a minuta do acordo.",
      },
      {
        id: createId(),
        case_id: caseId,
        author_id: clientId,
        body: "Obrigada, doutora. Vou digitalizar a certidão e enviar ainda esta semana.",
      },
    ]);
  }

  const { count: paymentCount } = await supabase
    .from("payments")
    .select("*", { count: "exact", head: true })
    .eq("client_id", clientId);

  if (!paymentCount) {
    await supabase.from("payments").insert([
      {
        id: createId(),
        description: "Honorários — consulta inicial e abertura do caso",
        amount: 1200,
        status: "PAID",
        paid_at: new Date().toISOString(),
        case_id: caseId,
        client_id: clientId,
      },
      {
        id: createId(),
        description: "Honorários — elaboração de acordo",
        amount: 2500,
        status: "PENDING",
        due_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
        case_id: caseId,
        client_id: clientId,
      },
    ]);
  }

  const posts = [
    {
      slug: "divorcio-consensual-passo-a-passo",
      title: "Divórcio consensual: o que precisa saber antes de começar",
      excerpt:
        "Documentos, prazos e o que muda quando há filhos menores envolvidos.",
      area: "familia",
      content: `O divórcio consensual é o caminho mais célere quando as partes estão de acordo sobre partilha, guarda e pensão.

## Documentos usuais
- Certidão de casamento atualizada
- Documentos pessoais
- Comprovantes de renda, quando há pensão
- Relação de bens, se houver partilha

Este conteúdo é informativo e não substitui consulta jurídica personalizada.`,
    },
    {
      slug: "verbas-rescisorias-checklist",
      title: "Demissão: checklist de verbas rescisórias",
      excerpt:
        "O que conferir no termo de rescisão e quando buscar orientação.",
      area: "trabalho",
      content: `Ao ser demitido, confira saldo de salário, férias proporcionais, 13º, aviso prévio e FGTS.

Guarde holerites, cartões de ponto e comunicações. Uma consulta rápida pode evitar perda de direitos.`,
    },
    {
      slug: "negativacao-indevida-o-que-fazer",
      title: "Negativação indevida: primeiros passos",
      excerpt:
        "Como agir quando seu nome é negativado sem dívida legítima.",
      area: "consumidor",
      content: `Se o nome foi negativado indevidamente, reúna comprovantes de pagamento ou ausência de relação contratual.

Não ignore prazos de contestação. Orientação jurídica antecipa a melhor estratégia.`,
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

  console.log("Seed Supabase concluído.");
  console.log("Admin: admin@lauraeva.adv.br / admin123");
  console.log("Cliente: cliente@exemplo.com / cliente123");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
