# Advocacia Web — Dra. Helena Vasconcelos

Plataforma de advocacia (MVP): site institucional, agendamento, área do cliente e painel administrativo.

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

| Perfil  | E-mail                             | Senha       |
|---------|------------------------------------|-------------|
| Admin   | admin@helenavasconcelos.adv.br     | admin123    |
| Cliente | cliente@exemplo.com                | cliente123  |

## Principais rotas

- `/` — home
- `/agendar` — agendamento online/presencial
- `/area-cliente` — casos, documentos, mensagens e honorários
- `/admin` — leads, agenda, casos, clientes e blog
- `/privacidade` e `/termos` — LGPD e avisos legais

## Variáveis de ambiente

Copie `.env.example` para `.env` e ajuste `AUTH_SECRET` em produção.
