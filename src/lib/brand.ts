export type Brand = {
  name: string;
  shortName: string;
  title: string;
  oab: string;
  tagline: string;
  headline: string;
  about: string;
  email: string;
  phone: string;
  phoneHref: string;
  whatsapp: string;
  address: string;
  city: string;
};

export const defaultBrand: Brand = {
  name: "Dra. Laura Eva",
  shortName: "Laura Eva",
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
  phoneHref: "5511987654321",
  whatsapp: "https://wa.me/5511987654321",
  address: "São Paulo, SP",
  city: "São Paulo",
};

/** @deprecated use getBrand() for editable settings */
export const brand = defaultBrand;

export const practiceAreas = [
  {
    slug: "familia",
    title: "Direito de Família",
    short:
      "Divórcio, guarda, pensão e inventário com cuidado e estratégia.",
    description:
      "Atuação em divórcio consensual e litigioso, guarda compartilhada, pensão alimentícia, união estável e inventários. Cada família tem uma história — o atendimento é personalizado, com foco em soluções que reduzam desgaste emocional e jurídico.",
    topics: [
      "Divórcio e dissolução de união estável",
      "Guarda e convivência familiar",
      "Pensão alimentícia",
      "Inventário e partilha",
    ],
  },
  {
    slug: "trabalho",
    title: "Direito do Trabalho",
    short:
      "Defesa de direitos trabalhistas para quem precisa de segurança.",
    description:
      "Assessoria em demissões, verbas rescisórias, assédio, horas extras e acordos. Análise objetiva do caso, cálculo de direitos e acompanhamento até a resolução — judicial ou extrajudicial.",
    topics: [
      "Verbas rescisórias e FGTS",
      "Horas extras e adicional noturno",
      "Assédio moral e discriminação",
      "Acordos e reclamações trabalhistas",
    ],
  },
  {
    slug: "consumidor",
    title: "Direito do Consumidor",
    short:
      "Cobranças indevidas, contratos abusivos e falhas de serviço.",
    description:
      "Defesa em relações de consumo: bancos, planos de saúde, companhias aéreas, e-commerce e serviços essenciais. Negociação prévia quando possível; ação judicial quando necessário.",
    topics: [
      "Cobranças e negativação indevida",
      "Planos de saúde e negativas de cobertura",
      "Vícios de produto e serviço",
      "Contratos e cláusulas abusivas",
    ],
  },
] as const;

export const howItWorks = [
  {
    step: "01",
    title: "Contato inicial",
    text: "Você descreve a situação pelo formulário, WhatsApp ou agendamento. Sem compromisso de contratação.",
  },
  {
    step: "02",
    title: "Consulta",
    text: "Análise do caso, orientação jurídica e definição do caminho — online ou presencial.",
  },
  {
    step: "03",
    title: "Acompanhamento",
    text: "Documentos, prazos e próximos passos ficam organizados na área do cliente.",
  },
] as const;

export type PracticeAreaSlug = (typeof practiceAreas)[number]["slug"];

export function getAreaBySlug(slug: string) {
  return practiceAreas.find((area) => area.slug === slug);
}

export function whatsappDigits(phone: string) {
  return phone.replace(/\D/g, "");
}

export function toBrandFromSettings(settings: {
  name: string;
  shortName: string;
  title: string;
  oab: string;
  tagline: string;
  headline: string;
  about: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
}): Brand {
  const digits = whatsappDigits(settings.phone);
  return {
    ...settings,
    phoneHref: digits,
    whatsapp: settings.whatsapp || (digits ? `https://wa.me/${digits}` : ""),
  };
}
