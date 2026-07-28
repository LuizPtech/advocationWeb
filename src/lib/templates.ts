import { formatDate } from "@/lib/utils";

export type TemplateContext = {
  advogada: {
    nome: string;
    oab: string;
    email: string;
    telefone: string;
    endereco: string;
    cidade: string;
  };
  cliente: {
    nome: string;
    email: string;
    telefone: string;
    cpf: string;
  };
  caso: {
    titulo: string;
    descricao: string;
    area: string;
    proximoPasso: string;
  };
  data: {
    curta: string;
    extenso: string;
    cidade: string;
  };
};

function fmtLongDate(city: string) {
  const now = new Date();
  return `${city}, ${now.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}`;
}

export function buildContext(input: {
  advogadaName: string;
  advogadaOab: string;
  advogadaEmail: string;
  advogadaPhone: string;
  advogadaAddress: string;
  advogadaCity: string;
  clientName: string;
  clientEmail: string | null;
  clientPhone: string | null;
  clientCpf?: string | null;
  caseTitle?: string;
  caseDescription?: string | null;
  caseArea?: string;
  caseNextStep?: string | null;
}): TemplateContext {
  return {
    advogada: {
      nome: input.advogadaName,
      oab: input.advogadaOab,
      email: input.advogadaEmail,
      telefone: input.advogadaPhone,
      endereco: input.advogadaAddress,
      cidade: input.advogadaCity,
    },
    cliente: {
      nome: input.clientName,
      email: input.clientEmail || "",
      telefone: input.clientPhone || "",
      cpf: input.clientCpf || "",
    },
    caso: {
      titulo: input.caseTitle || "",
      descricao: input.caseDescription || "",
      area: input.caseArea || "",
      proximoPasso: input.caseNextStep || "",
    },
    data: {
      curta: formatDate(new Date()),
      extenso: fmtLongDate(input.advogadaCity),
      cidade: input.advogadaCity,
    },
  };
}

export function renderTemplate(content: string, ctx: TemplateContext): string {
  return content.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_match, key) => {
    const parts = String(key).split(".");
    let value: unknown = ctx;
    for (const part of parts) {
      if (value && typeof value === "object" && part in (value as object)) {
        value = (value as Record<string, unknown>)[part];
      } else {
        return `{{${key}}}`;
      }
    }
    return String(value ?? "");
  });
}

export const TEMPLATE_PLACEHOLDERS = [
  "{{advogada.nome}}",
  "{{advogada.oab}}",
  "{{advogada.email}}",
  "{{advogada.telefone}}",
  "{{advogada.endereco}}",
  "{{cliente.nome}}",
  "{{cliente.email}}",
  "{{cliente.telefone}}",
  "{{cliente.cpf}}",
  "{{caso.titulo}}",
  "{{caso.area}}",
  "{{caso.descricao}}",
  "{{caso.proximoPasso}}",
  "{{data.curta}}",
  "{{data.extenso}}",
  "{{data.cidade}}",
];

export const DEFAULT_TEMPLATES: {
  name: string;
  category: string;
  content: string;
}[] = [
  {
    name: "Procuração ad judicia",
    category: "Procuração",
    content: `PROCURAÇÃO

OUTORGANTE: {{cliente.nome}}, portador(a) do CPF nº {{cliente.cpf}},
residente e domiciliado(a) no endereço fornecido, telefone {{cliente.telefone}},
e-mail {{cliente.email}}.

OUTORGADO(A): {{advogada.nome}}, advogado(a) inscrito(a) na {{advogada.oab}},
com escritório em {{advogada.endereco}}, e-mail {{advogada.email}}.

PODERES: Pelo presente instrumento particular de procuração, o(a) outorgante
nomeia e constitui como seu(sua) bastante procurador(a) o(a) outorgado(a) acima
qualificado(a), a quem confere os poderes da cláusula "ad judicia et extra",
bem como poderes especiais para transigir, desistir, firmar compromissos,
receber e dar quitação, substabelecer com ou sem reserva de poderes.

FINALIDADE: Representar o(a) outorgante em todos os assuntos relacionados a
{{caso.titulo}} ({{caso.area}}).

{{data.extenso}}


____________________________________
{{cliente.nome}}
`,
  },
  {
    name: "Contrato de honorários advocatícios",
    category: "Contratos",
    content: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS

Entre as partes:

CONTRATANTE: {{cliente.nome}}, portador(a) do CPF {{cliente.cpf}},
telefone {{cliente.telefone}}, e-mail {{cliente.email}}.

CONTRATADA: {{advogada.nome}}, {{advogada.oab}},
com escritório em {{advogada.endereco}}.

1. OBJETO
A CONTRATADA prestará serviços de assessoria e representação jurídica no
seguinte caso: {{caso.titulo}} — {{caso.descricao}}.

2. HONORÁRIOS
Os honorários totais são de R$ ____________ (__________________________ reais),
pagos da seguinte forma: ________________________________.

3. DESPESAS PROCESSUAIS
Custas, taxas judiciais, emolumentos cartorários e outras despesas correm por
conta do(a) CONTRATANTE.

4. VIGÊNCIA E FORO
Este contrato vigora até o encerramento do caso. Fica eleito o foro de
{{advogada.cidade}} para dirimir eventuais controvérsias.

{{data.extenso}}


____________________________________
{{cliente.nome}} — Contratante


____________________________________
{{advogada.nome}} — {{advogada.oab}}
`,
  },
  {
    name: "Recibo de honorários",
    category: "Recibos",
    content: `RECIBO

Recebi de {{cliente.nome}} (CPF {{cliente.cpf}}) a importância de
R$ ____________ (__________________________ reais), referente a
{{caso.titulo}}, dando plena e total quitação neste ato.

{{data.extenso}}


____________________________________
{{advogada.nome}} — {{advogada.oab}}
`,
  },
];
