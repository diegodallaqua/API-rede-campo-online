# API Rede Campo Online

API da plataforma **Rede Campo Online**, um site responsivo voltado ao grupo de pesquisa Rede Campo.

## Stack

- **Node.js** + **TypeScript**
- **Express 5**
- **TypeORM** + **MySQL/MariaDB**
- **TSyringe** (injeção de dependência)
- **JWT** (autenticação)
- **Celebrate/Joi** (validação)
- **Multer** + **Sharp** (upload e processamento de imagens)
- **Cloudflare R2** (armazenamento de imagens, via AWS S3 SDK)
- **Helmet**, **CORS**, **express-rate-limit** (segurança)

## Arquitetura

Organizado em módulos (DDD-like), cada um em `src/modules/<modulo>` contendo:

- `entities` — entidades TypeORM
- `repositories` — interfaces e implementações de repositório
- `useCases` — regras de negócio
- `http/controllers` — controllers HTTP
- `http/routes` — rotas Express
- `container` — registro de dependências (tsyringe)

Infraestrutura compartilhada em `src/shared`:

- `infra/http` — app Express, rotas globais, middlewares, error handler
- `infra/database` — data source TypeORM e migrations
- `container` — registro global de dependências

## Pré-requisitos

- Node.js 18+
- MySQL/MariaDB
- Conta Cloudflare R2 (para upload de imagens)

## Configuração

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Copie `.env.example` para `.env` e preencha as variáveis:

   ```bash
   cp .env.example .env
   ```

   | Variável | Descrição |
   | --- | --- |
   | `PORT` | Porta do servidor (padrão `3333`) |
   | `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_NAME`, `DB_PASS` | Credenciais do banco MariaDB/MySQL |
   | `JWT_SECRET`, `JWT_EXPIRES_IN` | Configuração do token JWT |
   | `CORS_ORIGIN` | Origens permitidas (separadas por vírgula) ou `*` |
   | `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX` | Configuração de rate limit |
   | `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL` | Credenciais do Cloudflare R2 para upload de imagens |

3. Execute as migrations:

   ```bash
   npm run migration:run
   ```

## Scripts

| Script | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor em modo desenvolvimento (hot reload) |
| `npm run migration:generate` | Gera uma nova migration a partir das entidades |
| `npm run migration:run` | Executa as migrations pendentes |
| `npm run migration:revert` | Desfaz a última migration |
| `npm run lint` | Executa o ESLint |
| `npm run format` | Formata o código com Prettier |

## Endpoints principais

A API expõe um endpoint de health check em `GET /health` e os seguintes recursos sob `/`:

- `/sessions` — autenticação (login/logout)
- `/states`, `/cities`, `/addresses` — localização
- `/organizations`, `/member-roles`, `/members` — membros e organizações
- `/project-types`, `/projects`, `/project-media` — projetos
- `/events`, `/event-media` — eventos
- `/news`, `/news-media` — notícias
- `/research-areas` — áreas de pesquisa
- `/publications`, `/external-authors`, `/contributor-role`, `/publication-contributors` — publicações e contribuidores
- `/articles`, `/thesis`, `/books`, `/book-chapters` — tipos de publicação
- `/images` — upload de imagens (Cloudflare R2)

A maioria das rotas de escrita exige autenticação via JWT (`Authorization: Bearer <token>`).

## Segurança

- `helmet` para headers HTTP seguros
- `cors` configurável via `CORS_ORIGIN`
- `express-rate-limit` para limitar requisições
- Senhas com `bcryptjs`
- Blacklist de tokens JWT no logout (`TokenBlacklist`)
