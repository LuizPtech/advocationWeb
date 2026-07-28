---
tags: [playbook, operacao, financeiro]
---

# Playbook — Registrar honorários e despesas

## Onde ver o fluxo de caixa

`/admin/financeiro` mostra:

- **Recebido no mês** — soma de `payments` com `status = PAID` e `paid_at` no mês atual
- **A receber** — `status = PENDING` (todos)
- **Em atraso** — `status = PENDING` com `due_date < hoje`
- **Resultado do mês** — recebido – despesas do mês
- **Gráfico dos últimos 6 meses** (receitas x despesas)

## Lançar honorário

Honorários são vinculados a **casos** e **clientes**. Cadastre em:

`/admin/casos/[id]` → seção **Honorários**

Campos:
- Descrição (ex.: "Contrato inicial")
- Valor
- Data de vencimento (opcional)

Status inicial é **Pendente**. Quando o cliente pagar:

- Botão **Marcar pago** dentro do caso, ou
- No `/admin/financeiro` → dropdown de status na linha do pagamento

## Lançar despesa

`/admin/financeiro` → formulário "Despesas"

Categorias:
- Aluguel / condomínio
- Marketing
- Assinaturas / softwares
- Taxas / impostos
- Viagens
- Outros

Data padrão é **hoje**. Ajuste se for lançamento retroativo.

## Dica: separação pessoa física × jurídica

Se o escritório é MEI/PJ, lance **apenas** despesas do escritório (não conta de luz de casa). Guarde comprovante fora do sistema por enquanto.

---

> [!tip] Próximas melhorias
> Ver [[Roadmap - Próximas entregas]]:
> - Contas recorrentes (assinaturas mensais automáticas)
> - Relatório mensal em PDF (DRE simplificada)
> - Exportar para CSV / conciliação bancária
