import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Privacidade e LGPD",
};

export default function PrivacidadePage() {
  return (
    <div className="section-pad">
      <div className="container-page max-w-3xl">
        <h1 className="font-display text-5xl text-ink">
          Política de Privacidade e LGPD
        </h1>
        <p className="mt-4 text-muted">
          Última atualização: {new Date().toLocaleDateString("pt-BR")}
        </p>

        <div className="mt-10 space-y-6 text-ink-soft leading-relaxed">
          <p>
            Esta política descreve como {brand.name} ({brand.oab}) trata dados
            pessoais coletados pelo site, formulários, agendamento e área do
            cliente, em conformidade com a Lei Geral de Proteção de Dados
            (LGPD — Lei nº 13.709/2018).
          </p>

          <h2 className="font-display text-3xl text-ink">1. Dados coletados</h2>
          <p>
            Podemos coletar nome, e-mail, telefone, CPF (quando necessário ao
            caso), descrição do assunto, documentos enviados e registros de
            comunicação relacionados ao atendimento jurídico.
          </p>

          <h2 className="font-display text-3xl text-ink">
            2. Finalidades e bases legais
          </h2>
          <p>
            Os dados são usados para responder contatos, agendar consultas,
            prestar serviços advocatícios, cumprir obrigações legais e manter a
            segurança da plataforma. Bases legais típicas: consentimento,
            execução de contrato e legítimo interesse (quando aplicável).
          </p>

          <h2 className="font-display text-3xl text-ink">3. Compartilhamento</h2>
          <p>
            Não vendemos dados pessoais. O compartilhamento ocorre apenas quando
            necessário à prestação do serviço (ex.: sistemas de infraestrutura),
            por obrigação legal ou com autorização.
          </p>

          <h2 className="font-display text-3xl text-ink">4. Segurança</h2>
          <p>
            Adotamos medidas técnicas e organizacionais razoáveis: autenticação,
            controle de acesso (cliente vê apenas seus dados) e armazenamento
            privado de documentos.
          </p>

          <h2 className="font-display text-3xl text-ink">5. Seus direitos</h2>
          <p>
            Você pode solicitar acesso, correção, portabilidade, eliminação
            (quando cabível), informação sobre usos e revogação de consentimento
            pelo e-mail {brand.email}.
          </p>

          <h2 className="font-display text-3xl text-ink">6. Contato do controlador</h2>
          <p>
            Controladora: {brand.name} — {brand.email} — {brand.phone} —{" "}
            {brand.address}.
          </p>
        </div>
      </div>
    </div>
  );
}
