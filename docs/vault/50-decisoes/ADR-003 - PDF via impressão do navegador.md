---
tags: [adr, decisao]
data: 2026-07-28
status: aceito
---

# ADR-003 — PDF via impressão do navegador

## Contexto
Modelos de documento (procuração, contrato) precisam gerar arquivo baixável. Alternativas:

1. **HTML + `window.print()`** — nativo, zero dependência, usuário escolhe "Salvar como PDF"
2. **Biblioteca client-side (jsPDF, html2pdf)** — pesa +200 KB e nunca sai igual ao print nativo
3. **Puppeteer server-side** — PDF perfeito, mas 300 MB de dependência, incompatível com Vercel Functions
4. **Serviço externo (browserless.io, PDFCrowd)** — custo mensal + latência de rede
5. **Word (.docx) via lib** — pacote `docx` é 100 KB, mas gera arquivo binário

## Decisão
**Opção 1** — HTML formatado + `window.print()`.

## Consequências
- Zero dependência, zero servidor
- Tela `/admin/modelos/[id]/gerar/...` já vem pronta para impressão com CSS `@media print`
- Usuário aprende 1 passo: escolher "Salvar como PDF" no diálogo. Instrução explícita no topo da tela.
- Também tem botão **Copiar texto** para colar em Word

## Se o cenário mudar
Adicionar `docx` (biblioteca `docx` npm) para exportar `.docx` de verdade — só quando alguém pedir Word editável.
