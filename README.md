# Advocacia Web — Dra. Laura Eva

Plataforma de advocacia (MVP): site institucional editável, agendamento, área do cliente e painel administrativo.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Auth.js (NextAuth) com credenciais
- Prisma + SQLite
- Upload local de documentos

## Começar

```bash
npm install
npm run db:setup
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Contas de demonstração

| Perfil  | E-mail                  | Senha       |
|---------|-------------------------|-------------|
| Admin   | admin@lauraeva.adv.br   | admin123    |
| Cliente | cliente@exemplo.com     | cliente123  |

## O que é editável no painel (`/admin`)

- **Editar site**: nome, OAB, headlines, texto Sobre, e-mail, telefone, WhatsApp, endereço
- **Blog**: criar, publicar e despublicar artigos
- **Leads, agenda, casos, clientes e honorários**

## Principais rotas

- `/` — home
- `/agendar` — agendamento online/presencial
- `/area-cliente` — casos, documentos, mensagens e honorários
- `/admin` — painel da advogada
- `/admin/site` — dados públicos do site
- `/privacidade` e `/termos` — LGPD e avisos legais

## Variáveis de ambiente

Copie `.env.example` para `.env` e ajuste `AUTH_SECRET` em produção.
