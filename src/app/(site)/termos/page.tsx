import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Termos de uso",
};

export default function TermosPage() {
  return (
    <div className="section-pad">
      <div className="container-page max-w-3xl">
        <h1 className="font-display text-5xl text-ink">Termos de uso</h1>
        <p className="mt-4 text-muted">
          Última atualização: {new Date().toLocaleDateString("pt-BR")}
        </p>

        <div className="mt-10 space-y-6 text-ink-soft leading-relaxed">
          <p>
            Ao utilizar o site de {brand.name}, você concorda com estes termos.
          </p>

          <h2 className="font-display text-3xl text-ink">
            1. Conteúdo informativo
          </h2>
          <p>
            Artigos, páginas institucionais e materiais publicados têm caráter
            informativo e educacional. Eles <strong>não substituem</strong>{" "}
            consulta jurídica formal, análise personalizada do caso nem
            constituição de relação advogado-cliente.
          </p>

          <h2 className="font-display text-3xl text-ink">
            2. Relação profissional
          </h2>
          <p>
            A relação advogado-cliente inicia-se apenas após contato expresso,
            análise do caso e eventual contratação formal, com definição de
            honorários e escopo.
          </p>

          <h2 className="font-display text-3xl text-ink">3. Área do cliente</h2>
          <p>
            O acesso à área logada é pessoal e intransferível. Você é
            responsável por manter a confidencialidade da senha e pela veracidade
            dos documentos enviados.
          </p>

          <h2 className="font-display text-3xl text-ink">4. Limitação</h2>
          <p>
            O escritório não se responsabiliza por decisões tomadas com base
            exclusiva em conteúdo genérico do site, sem análise do caso concreto.
          </p>

          <h2 className="font-display text-3xl text-ink">5. Contato</h2>
          <p>
            Dúvidas sobre estes termos: {brand.email}.
          </p>
        </div>
      </div>
    </div>
  );
}
