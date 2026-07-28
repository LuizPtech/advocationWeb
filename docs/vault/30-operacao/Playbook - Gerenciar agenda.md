---
tags: [playbook, operacao, agenda]
---

# Playbook — Gerenciar agenda

Rota: `/admin/agenda`

## Cliente marcou pelo site

Aparece com status **Pendente**. Você:

1. Confirma o horário no seu calendário
2. Muda status para **Confirmado** (dropdown → Salvar)
3. Cliente vê a atualização na área dele

## Você quer bloquear um horário manualmente

Cliente ligou ou marcou por outro canal:

1. Clique em **Nova consulta manual**
2. Preencha nome (e-mail é opcional)
3. Escolha data/hora, tipo (online/presencial), área
4. Criar consulta — já entra como **Confirmado**

## Remarcar

Cada consulta tem campos inline de **Data / Horário / Status**. Ajuste e clique **Salvar**.

## Cancelar

Botão **Remover** apaga a consulta. Não notifica cliente automaticamente (por enquanto — ver [[Roadmap - Próximas entregas]]).

## Consultas passadas

Aparecem numa seção separada abaixo — histórico dos últimos 25.

---

> [!warning] Ainda não temos
> - Bloqueio de férias / dias inteiros
> - Sincronização com Google Calendar
> - Notificação por e-mail/WhatsApp ao remarcar
>
> Ver [[Roadmap - Próximas entregas]].
