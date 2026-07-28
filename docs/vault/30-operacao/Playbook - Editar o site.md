---
tags: [playbook, operacao]
---

# Playbook — Editar o site

Como mudar o visual/texto/foto sem tocar em código.

## O que dá para editar sem programador

Em `/admin/site`:

- **Fotos**: foto principal (hero + Sobre) e imagem de fundo (URL de qualquer imagem online)
- **Mostrar/ocultar foto**: checkbox — se desativado, o site usa layout só com tipografia
- **Identidade**: nome, nome curto (menu), título profissional, OAB
- **Textos**: título principal (hero), subtítulo, texto da página Sobre
- **Contato**: e-mail, telefone, WhatsApp, cidade, endereço

Em `/admin/menu`:

- Renomear item do menu
- Reordenar (número)
- Esconder (checkbox)
- Adicionar novo (link interno tipo `/depoimentos` ou externo tipo `https://instagram.com/...`)

Em `/admin/blog`:

- Criar / editar / publicar / despublicar artigos

## O que **precisa** de programador (por enquanto)

- Nomes / descrições das áreas de atuação (fixas em `src/lib/brand.ts`)
- Etapas do "Como funciona"
- Perguntas do FAQ
- Layout / paleta de cores
- Novas páginas fixas (ex.: `/depoimentos`)

Ver [[Backlog - Ideias]] para tornar isso editável.

## Dicas para foto

- Formato **quadrado** (1:1), mínimo 800×800
- Luz suave, fundo neutro/desfocado
- Instagram → clicar na foto → "Copiar link" → colar no campo. Se não funcionar, subir no Google Fotos ou Imgur e usar o link direto da imagem.
