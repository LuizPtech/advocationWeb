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
  photoUrl: string;
  heroImageUrl: string;
};

export const defaultPhotoUrl =
  "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=900&q=80";
export const defaultHeroUrl =
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80";

export const defaultBrand: Brand = {
  name: "Dra. Laura Eva",
  shortName: "Laura Eva",
  title: "Advogada",
  oab: "OAB/SP 000.000",
  tagline:
    "Advocacia especializada em Direito das Famílias, Sucessões e Imobiliário.",
  headline:
    "Orientação jurídica clara, com acompanhamento humano em cada etapa.",
  about:
    "Advogada com atuação em Direito de Família, Direito do Trabalho e Direito do Consumidor. O atendimento começa com escuta, segue com análise objetiva das opções e permanece transparente no acompanhamento do caso — com linguagem clara e próximos passos bem definidos.",
  email: "contato@lauraeva.adv.br",
  phone: "(11) 98765-4321",
  phoneHref: "5511987654321",
  whatsapp: "https://wa.me/5511987654321",
  address: "São Paulo, SP",
  city: "São Paulo",
  photoUrl: defaultPhotoUrl,
  heroImageUrl: defaultHeroUrl,
};

/** @deprecated use getBrand() for editable settings */
export const brand = defaultBrand;

export const practiceAreas = [
  {
    slug: "familia",
    title: "Direito das Famílias",
    short: "Divórcio, guarda, pensão e proteção da sua família.",
    description:
      "Atuação em divórcio consensual e litigioso, guarda compartilhada, pensão alimentícia, união estável e reconhecimento de paternidade. Cada família tem uma história — o atendimento é personalizado, com foco em soluções que reduzam desgaste emocional e jurídico.",
    topics: [
      "Divórcio e dissolução de união estável",
      "Guarda e convivência familiar",
      "Pensão alimentícia",
      "União estável",
    ],
  },
  {
    slug: "sucessoes",
    title: "Sucessões",
    short:
      "Inventário, partilha e planejamento sucessório com clareza.",
    description:
      "Assessoria em inventários (judicial e extrajudicial), testamentos, partilha de bens e planejamento sucessório para preservar o patrimônio e evitar litígios entre herdeiros.",
    topics: [
      "Inventário e partilha",
      "Testamento",
      "Planejamento sucessório",
      "Holding familiar",
    ],
  },
  {
    slug: "imobiliario",
    title: "Direito Imobiliário",
    short:
      "Compra, venda, locação e regularização com segurança.",
    description:
      "Análise de contratos de compra, venda e locação, regularização de imóveis, ações possessórias e revisão de cláusulas abusivas — para você negociar com tranquilidade.",
    topics: [
      "Contratos de compra e venda",
      "Locação e despejo",
      "Regularização de imóveis",
      "Usucapião",
    ],
  },
] as const;

export const howItWorks = [
  {
    step: "01",
    icon: "message",
    title: "Contato inicial",
    text: "Envie sua situação pelo formulário ou WhatsApp. Retorno em horário comercial, sem compromisso.",
  },
  {
    step: "02",
    icon: "calendar",
    title: "Consulta agendada",
    text: "Atendimento online ou presencial, com hora marcada. Análise clara do seu caso.",
  },
  {
    step: "03",
    icon: "shield",
    title: "Estratégia definida",
    text: "Planejamento jurídico personalizado, com prazos, custos e caminhos bem explicados.",
  },
  {
    step: "04",
    icon: "check",
    title: "Acompanhamento contínuo",
    text: "Documentos, mensagens e status do caso disponíveis na área do cliente.",
  },
] as const;

export const faqDefault = [
  {
    q: "É preciso pagar para a primeira consulta?",
    a: "A primeira conversa para entender o caso pode ser gratuita, dependendo da complexidade. Após essa triagem, apresento os honorários de forma transparente antes de qualquer contratação.",
  },
  {
    q: "Vocês atendem online?",
    a: "Sim. Faço atendimento por videoconferência para clientes de qualquer localidade, com hora marcada. Presencialmente, atendo em São Paulo.",
  },
  {
    q: "Como acompanho meu processo?",
    a: "Depois da contratação você recebe acesso à área do cliente, com status do caso, documentos, mensagens e honorários organizados em um só lugar.",
  },
  {
    q: "Quais formas de pagamento aceitas?",
    a: "PIX, transferência e cartão. Honorários são apresentados por escrito antes de fechar contrato, com opção de parcelamento em alguns casos.",
  },
  {
    q: "Como funciona o sigilo do meu caso?",
    a: "Todo atendimento é confidencial, protegido pela advocacia e pela LGPD. Documentos ficam em armazenamento privado e apenas você e a advogada têm acesso.",
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
  photoUrl?: string | null;
  heroImageUrl?: string | null;
}): Brand {
  const digits = whatsappDigits(settings.phone);
  return {
    name: settings.name,
    shortName: settings.shortName,
    title: settings.title,
    oab: settings.oab,
    tagline: settings.tagline,
    headline: settings.headline,
    about: settings.about,
    email: settings.email,
    phone: settings.phone,
    address: settings.address,
    city: settings.city,
    phoneHref: digits,
    whatsapp: settings.whatsapp || (digits ? `https://wa.me/${digits}` : ""),
    photoUrl: settings.photoUrl || defaultPhotoUrl,
    heroImageUrl: settings.heroImageUrl || defaultHeroUrl,
  };
}
