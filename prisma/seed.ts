import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminHash = await bcrypt.hash("admin123", 10);
  const clientHash = await bcrypt.hash("cliente123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@helenavasconcelos.adv.br" },
    update: {},
    create: {
      name: "Dra. Helena Vasconcelos",
      email: "admin@helenavasconcelos.adv.br",
      passwordHash: adminHash,
      role: "ADMIN",
      phone: "(11) 98765-4321",
    },
  });

  const client = await prisma.user.upsert({
    where: { email: "cliente@exemplo.com" },
    update: {},
    create: {
      name: "Ana Souza",
      email: "cliente@exemplo.com",
      passwordHash: clientHash,
      role: "CLIENT",
      phone: "(11) 91234-5678",
    },
  });

  const existingCase = await prisma.case.findFirst({
    where: { clientId: client.id },
  });

  let caseRecord = existingCase;
  if (!caseRecord) {
    caseRecord = await prisma.case.create({
      data: {
        title: "Divórcio consensual",
        description:
          "Acompanhamento de divórcio consensual com partilha de bens e regulamentação de convivência.",
        area: "familia",
        status: "IN_PROGRESS",
        nextStep: "Enviar certidão de casamento atualizada",
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
        tags: JSON.stringify(["divórcio", "consensual"]),
        clientId: client.id,
      },
    });
  }

  const messageCount = await prisma.message.count({
    where: { caseId: caseRecord.id },
  });
  if (messageCount === 0) {
    await prisma.message.createMany({
      data: [
        {
          caseId: caseRecord.id,
          authorId: admin.id,
          body: "Olá, Ana. Seu caso foi aberto. Assim que os documentos chegarem, avanço com a minuta do acordo.",
        },
        {
          caseId: caseRecord.id,
          authorId: client.id,
          body: "Obrigada, doutora. Vou digitalizar a certidão e enviar ainda esta semana.",
        },
      ],
    });
  }

  const paymentCount = await prisma.payment.count({
    where: { clientId: client.id },
  });
  if (paymentCount === 0) {
    await prisma.payment.create({
      data: {
        description: "Honorários — consulta inicial e abertura do caso",
        amount: 1200,
        status: "PAID",
        paidAt: new Date(),
        caseId: caseRecord.id,
        clientId: client.id,
      },
    });
    await prisma.payment.create({
      data: {
        description: "Honorários — elaboração de acordo",
        amount: 2500,
        status: "PENDING",
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
        caseId: caseRecord.id,
        clientId: client.id,
      },
    });
  }

  const noteCount = await prisma.note.count({ where: { caseId: caseRecord.id } });
  if (noteCount === 0) {
    await prisma.note.create({
      data: {
        caseId: caseRecord.id,
        authorId: admin.id,
        body: "Cliente prefere audiência online. Verificar disponibilidade do cônjuge para assinatura.",
      },
    });
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

## Com filhos
A regulamentação de convivência e alimentos precisa de atenção especial. O acordo bem redigido evita conflitos futuros.

Este conteúdo é informativo e não substitui consulta jurídica personalizada.`,
    },
    {
      slug: "verbas-rescisorias-checklist",
      title: "Demissão: checklist de verbas rescisórias",
      excerpt:
        "O que conferir no termo de rescisão e quando buscar orientação.",
      area: "trabalho",
      content: `Ao ser demitido, confira saldo de salário, férias proporcionais, 13º, aviso prévio e FGTS.

## Atenção
Multa de 40% do FGTS (quando cabível), horas extras e adicionais precisam de análise do histórico.

Guarde holerites, cartões de ponto e comunicações. Uma consulta rápida pode evitar perda de direitos.`,
    },
    {
      slug: "negativacao-indevida-o-que-fazer",
      title: "Negativação indevida: primeiros passos",
      excerpt:
        "Como agir quando seu nome é negativado sem dívida legítima.",
      area: "consumidor",
      content: `Se o nome foi negativado indevidamente, reúna comprovantes de pagamento ou ausência de relação contratual.

## Caminhos
1. Contato formal com a empresa
2. Registro em órgãos de defesa do consumidor
3. Ação judicial para exclusão e eventual indenização

Não ignore prazos de contestação. Orientação jurídica antecipa a melhor estratégia.`,
    },
  ];

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  const slotCount = await prisma.availabilitySlot.count();
  if (slotCount === 0) {
    await prisma.availabilitySlot.createMany({
      data: [
        { weekday: 1, startTime: "09:00", endTime: "12:00" },
        { weekday: 1, startTime: "14:00", endTime: "18:00" },
        { weekday: 2, startTime: "09:00", endTime: "12:00" },
        { weekday: 2, startTime: "14:00", endTime: "18:00" },
        { weekday: 3, startTime: "09:00", endTime: "12:00" },
        { weekday: 3, startTime: "14:00", endTime: "18:00" },
        { weekday: 4, startTime: "09:00", endTime: "12:00" },
        { weekday: 4, startTime: "14:00", endTime: "18:00" },
        { weekday: 5, startTime: "09:00", endTime: "12:00" },
        { weekday: 5, startTime: "14:00", endTime: "17:00" },
      ],
    });
  }

  console.log("Seed concluído.");
  console.log("Admin: admin@helenavasconcelos.adv.br / admin123");
  console.log("Cliente: cliente@exemplo.com / cliente123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
