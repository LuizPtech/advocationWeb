---
tags: [playbook, operacao, documentos]
---

# Playbook — Gerar documentos

Rota: `/admin/modelos`

## Modelos padrão

Já vêm criados:

- **Procuração ad judicia**
- **Contrato de honorários advocatícios**
- **Recibo de honorários**

## Criar modelo novo

`/admin/modelos/novo` — escreva o texto usando **placeholders**.

## Placeholders disponíveis

| Placeholder | Substituído por |
|---|---|
| `{{advogada.nome}}` | Nome completo (site_settings) |
| `{{advogada.oab}}` | OAB |
| `{{advogada.email}}` | E-mail do escritório |
| `{{advogada.telefone}}` | Telefone |
| `{{advogada.endereco}}` | Endereço |
| `{{cliente.nome}}` | Cliente escolhido |
| `{{cliente.email}}` | E-mail do cliente |
| `{{cliente.telefone}}` | Telefone do cliente |
| `{{cliente.cpf}}` | CPF (deixe em branco no modelo se não coleta) |
| `{{caso.titulo}}` | Título do caso |
| `{{caso.descricao}}` | Descrição |
| `{{caso.area}}` | Área (familia, sucessoes…) |
| `{{caso.proximoPasso}}` | Próximo passo |
| `{{data.curta}}` | 28/07/2026 |
| `{{data.extenso}}` | São Paulo, 28 de julho de 2026 |
| `{{data.cidade}}` | Cidade do escritório |

## Gerar

Dentro do modelo:

1. **Gerar a partir de caso** — escolhe o caso, vem tudo preenchido (cliente + caso)
2. **Gerar a partir de cliente** — só dados do cliente (útil para procuração inicial)

Abre uma tela imprimível:
- **Copiar texto** — cola em Word / Docs
- **Imprimir / Salvar PDF** — abre o diálogo do navegador → escolha "Salvar como PDF"

## Fluxo recomendado

1. Cliente contratou → crie o cliente em `/admin/clientes`
2. Abra um caso em `/admin/casos`
3. Vá em `/admin/modelos` → escolha **Contrato de honorários**
4. Gerar a partir do caso → Salvar como PDF
5. Envie por e-mail / suba no caso via `/admin/casos/[id]` → **Enviar documento**

---

> [!info] Roadmap
> Assinatura digital direta e envio automático por e-mail — ver [[Roadmap - Próximas entregas]].
