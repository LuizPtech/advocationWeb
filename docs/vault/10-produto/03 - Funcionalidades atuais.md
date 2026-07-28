---
tags: [produto, features]
---

# 03 — Funcionalidades atuais

Estado atual da plataforma. Última revisão: **28/07/2026**.

## Site público

### Páginas
- **Home** — hero editável, áreas, sobre, como funciona, contato, FAQ
- **Sobre** — foto + biografia + compromissos
- **Áreas** — Família, Sucessões e Imobiliário (fixas no código; ver [[Backlog - Ideias]])
- **Como funciona** — 4 etapas do atendimento
- **Blog** — artigos com slug e categoria por área
- **Contato** — formulário + WhatsApp + endereço
- **Privacidade / Termos** — LGPD

### Agendamento
`/agendar` cria um `booking` com status `PENDING`. Cliente escolhe:
- Tipo (Online / Presencial)
- Área
- Data e horário disponíveis
- Consentimento LGPD obrigatório

Conflito de horário é bloqueado.

## Área do cliente

`/area-cliente` (autenticada). Cliente enxerga **apenas seus casos**:
- Status do caso, próximo passo, prazo
- Documentos (upload/download)
- Mensagens trocadas com a advogada
- Honorários (pago / a receber)
- Histórico de consultas

## Painel administrativo

`/admin` — só perfis `ADMIN`.

| Módulo | Rota | Função |
|---|---|---|
| Visão geral | `/admin` | KPIs + agenda + casos recentes |
| Editar site | `/admin/site` | Fotos, textos, contato — feedback ao salvar |
| Menu do site | `/admin/menu` | Reordenar / esconder / adicionar links |
| Leads | `/admin/leads` | Formulários de contato recebidos |
| Agenda | `/admin/agenda` | Consultas — criar, remarcar, cancelar |
| Casos | `/admin/casos` | CRUD de casos + docs + mensagens + notas internas |
| Clientes | `/admin/clientes` | CRUD de clientes |
| Financeiro | `/admin/financeiro` | Fluxo de caixa + despesas |
| Modelos | `/admin/modelos` | Templates de documentos (procuração, contrato…) |
| Blog | `/admin/blog` | CRUD de artigos |

Ver [[Playbook - Editar o site]] e demais playbooks.
