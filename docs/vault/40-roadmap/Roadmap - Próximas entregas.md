---
tags: [roadmap]
---

# Roadmap — Próximas entregas

Ordenado por **impacto × esforço**. Cada linha vira uma issue.

## 🟢 Rápidas e de alto impacto

### Notificações por e-mail
- E-mail automático quando entra novo **lead**
- E-mail de confirmação de **agendamento** (para cliente + advogada)
- Provedor: **Resend** — barato, API simples
- Templates de e-mail em `src/emails/*.tsx` (react-email)
- Estimativa: pequena (uma tabela + integração)

### Prazos processuais
- Aba dentro de cada caso: lista de prazos com título, data-limite, cumprido/pendente
- Destaque no dashboard quando faltar < 7 dias
- Nova tabela `deadlines(case_id, title, due_date, done_at)`
- Estimativa: pequena

### Pipeline de leads (Kanban)
- `/admin/leads` vira board Kanban por status: Novo → Contatado → Qualificado → Convertido → Arquivado
- Drag & drop entre colunas
- Estimativa: média

### Relatório mensal em PDF
- Botão em `/admin/financeiro` gera PDF do mês (recebido, a receber, despesas, resultado)
- Reaproveitar o mesmo mecanismo de [[Playbook - Gerar documentos]]
- Estimativa: pequena

## 🟡 Médio prazo

### Cálculos jurídicos
- `/admin/calculadoras`
  - Verbas rescisórias (rescisão CLT)
  - Pensão alimentícia (percentual sobre salário mínimo / rendimentos)
  - Correção monetária (INPC/IGPM)
- Estimativa: média

### Integração Google Calendar
- Ao criar/remarcar consulta, cria evento no Google Calendar da advogada
- OAuth Google + Calendar API
- Estimativa: média

### Timesheet por caso
- Registrar horas trabalhadas em cada caso
- Base para honorários por hora
- Estimativa: pequena

### Contas a pagar recorrentes
- Cadastrar despesas fixas (aluguel, softwares) que se lançam sozinhas todo mês
- Estimativa: pequena

### Assinatura digital
- Integração Clicksign ou D4Sign
- Enviar contrato de honorários direto pra assinar
- Estimativa: média

## 🔵 Estratégico / longo prazo

### Pagamento pelo cliente
- Cliente paga honorários pelo próprio painel (Stripe / Pagar.me / Asaas)
- Boleto e PIX
- Estimativa: grande

### Multi-advogado
- Suporte a equipe (várias advogadas)
- Escopo por responsável
- Estimativa: grande

### CMS de páginas fixas
- Sobre / Áreas / Como funciona / FAQ 100% editáveis pelo admin
- Editor rich text (tiptap ou similar)
- Estimativa: grande

### Analytics de conversão
- Métricas: visitas → formulário → agendamento → contratação
- Integração com Vercel Analytics (já pronto)
- Estimativa: pequena (só de habilitar + dashboard)

---

Ver também [[Backlog - Ideias]] para coisas menos priorizadas.
