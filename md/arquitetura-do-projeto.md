### [Voltar ao menu](../README.md)

# Arquitetura do Projeto

## Padrão Arquitetural

O projeto segue uma [arquitetura modular](https://modular.arquiteturadesoftware.online/o-que-e-arquitetura-modular-e-por-que-ela-e-importante-introducao-versao-1-0/) inspirada em [Domain-Driven Design (DDD)](https://engsoftmoderna.info/artigos/ddd.html), com cada módulo representando um domínio de negócio específico. Dentro de cada módulo, a organização das camadas segue princípios de [Clean Architecture](https://engsoftmoderna.info/artigos/arquitetura-limpa.html): as regras de negócio (`useCases`) não conhecem o Express nem o TypeORM diretamente - dependem de interfaces de repositório, resolvidas em tempo de execução pelo container de injeção de dependências.

## Estrutura dos Módulos

Cada módulo (ex.: `members`, `projects`, `publications`) é organizado nas seguintes camadas:

```
modulo/
├── entities/                 # Entidades de domínio (mapeadas para tabelas do banco)
│   └── Entity.ts             # Estrutura de dados e relacionamentos (decorators do TypeORM)
├── repositories/             # Interfaces e implementações de repositório
│   ├── IEntityRepository.ts  # Contrato de acesso a dados
│   └── EntityRepository.ts   # Implementação concreta sobre o TypeORM
├── useCases/                 # Casos de uso (regras de negócio)
│   ├── CreateEntityUseCase.ts
│   ├── UpdateEntityUseCase.ts
│   ├── DeleteEntityUseCase.ts
│   └── ListEntitiesUseCase.ts
├── container/                # Registro das dependências do módulo
│   └── index.ts              # container.registerSingleton(...)
└── http/                     # Camada HTTP
    ├── controllers/          # Recebem a requisição, resolvem o useCase e devolvem a resposta
    │   ├── CreateEntityController.ts
    │   ├── UpdateEntityController.ts
    │   ├── DeleteEntityController.ts
    │   └── ListEntitiesController.ts
    └── routes/
        └── routes.ts         # Endpoints, validação (celebrate) e middleware de autenticação
```

Alguns módulos são propositalmente parciais:

- **Tabelas de junção** (`projectHasMembers`, `projectHasResearchAreas`, `publicationHasResearchAreas`, `newsHasResearchAreas`) possuem apenas `entities`, `repositories` e `container`. Não expõem rotas próprias: são manipuladas pelos casos de uso dos módulos principais.
- **Tabelas de apoio somente leitura** (`memberRoles`, `projectTypes`, `contributorRoles`, `researchAreas`) expõem apenas `GET /`, já que os registros vêm do seed.
- **`images`** não possui entidade nem repositório: o upload envia os arquivos ao Cloudflare R2 e devolve as URLs, sem gravar nada no banco. A URL escolhida é persistida pelo módulo de mídia correspondente (`projectMedia`, `eventMedia`, `newsMedia`).
- **`sessions`** possui apenas a entidade `TokenBlacklist`; a autenticação lê os dados do membro pelo repositório do módulo `members`.

## Fluxo de uma requisição

```
Requisição HTTP
      │
      ▼
  app.ts ──────────► helmet → express.json → cors → rate-limit
      │
      ▼
routes/index.ts ───► roteia para o módulo pelo prefixo (/members, /projects, ...)
      │
      ▼
modulo/http/routes ► isAuthenticated (quando aplicável) → celebrate (validação)
      │
      ▼
   Controller ─────► container.resolve(UseCase)
      │
      ▼
    UseCase ───────► regra de negócio → IRepository
      │
      ▼
   Repository ─────► TypeORM → MariaDB
      │
      ▼
  Resposta JSON  ou  AppError → errorHandler
```

## Detalhes de Implementação

### Inicialização

- **`src/server.ts`**: ponto de entrada. Inicializa o `AppDataSource` e só então chama `app.listen`. Se a conexão com o banco falhar, o processo encerra com código 1 - o servidor nunca sobe sem banco.
- **`src/shared/infra/http/app.ts`**: monta a aplicação Express - `trust proxy`, `helmet`, `express.json` (limite de 1 MB), CORS, rate limit, o endpoint `/health`, as rotas e, por último, os handlers de erro.

A ordem dos middlewares em `app.ts` é significativa: `errors()` do celebrate vem antes do `errorHandler` próprio, e ambos ficam depois de todas as rotas.

### Middlewares

Localizados em `src/shared/infra/http/middlewares`:

- **`isAuthenticated.ts`**: extrai o token do header `Authorization: Bearer <token>`, verifica a assinatura com o `JWT_SECRET`, confere se o hash SHA-256 do token está na tabela `token_blacklist` e injeta `req.user` com `id`, `role_id` e `organization_id`.
- **`errorHandler.ts`**: handler global de erros. Trata erros do celebrate (400 com o detalhe de cada segmento), instâncias de `AppError` (status e código próprios) e erros inesperados (500, com `stack` apenas fora de produção).
- **`upload.ts`**: fábrica de middleware de upload com Multer em memória. Aceita apenas JPEG, PNG e WebP, limita o arquivo a 10 MB e converte erros do Multer em `AppError`.

### Entidades

As entidades são classes TypeScript decoradas com anotações do TypeORM:

- Cada entidade corresponde a uma tabela do banco.
- Relacionamentos usam `@OneToOne`, `@OneToMany`, `@ManyToOne` e chaves compostas em tabelas de junção.
- Os identificadores são inteiros auto-incrementais (`@PrimaryGeneratedColumn`), diferente de projetos que adotam UUID.
- O carregamento das entidades é feito por glob em `data-source.ts` (`modules/**/entities/*.{ts,js}`), funcionando tanto em desenvolvimento (TS) quanto após o build (JS).

### Casos de Uso

Cada caso de uso encapsula uma operação de negócio:

- Recebe um objeto de entrada tipado (`IRequest`).
- Aplica as regras (existência de registros relacionados, unicidade, normalização de dados).
- Interage com o repositório.
- Retorna o resultado já no formato esperado pela resposta.
- Lança `AppError` com mensagem, status HTTP e código quando alguma regra é violada.

### Injeção de Dependências

O projeto usa **TSyringe**:

- `src/shared/container/index.ts` importa o `container` de cada módulo, registrando todos os repositórios na inicialização (`import "../../container/index"` no topo do `app.ts`).
- Cada módulo registra sua implementação sob um token string (ex.: `"MemberRepository"`), e os casos de uso recebem a interface via `@inject`.
- Isso desacopla a regra de negócio da implementação de persistência e facilita substituir o repositório por um mock em testes.

### Validação

A validação de entrada é feita com **celebrate/Joi**, declarada na própria definição da rota, por segmento (`BODY`, `QUERY`, `PARAMS`). Como roda antes do controller, os casos de uso podem assumir que os tipos e os limites de tamanho já foram verificados.

### Tratamento de Erros

`AppError` (`src/shared/errors/AppError.ts`) carrega `message`, `statusCode` (padrão 400) e um `code` opcional, usado pelo front-end para distinguir situações (`TOKEN_MISSING`, `TOKEN_INVALID`, `INVALID_CREDENTIALS`, `INVALID_MIME_TYPE`, `FILE_TOO_LARGE`, ...).

## Principais Tecnologias

| Tecnologia | Uso no projeto |
| --- | --- |
| **Node.js** | Ambiente de execução |
| **TypeScript** | Linguagem, com `strict: true` e decorators habilitados |
| **Express 5** | Framework HTTP |
| **TypeORM** | ORM e controle de migrations |
| **MariaDB / MySQL** | Banco de dados relacional |
| **TSyringe** | Injeção de dependências |
| **jsonwebtoken** | Emissão e verificação dos tokens JWT |
| **bcryptjs** | Hash de senhas |
| **Celebrate / Joi** | Validação das requisições |
| **Multer** | Recebimento de upload em memória |
| **Sharp** | Redimensionamento e conversão de imagens para WebP |
| **AWS SDK (S3)** | Cliente compatível com o Cloudflare R2 |
| **Helmet** | Headers HTTP de segurança |
| **CORS** | Controle de origens permitidas |
| **express-rate-limit** | Limitação de requisições por IP |

## Domínios da Aplicação

A API atende ao site do grupo de pesquisa **Rede Campo**, organizada nos seguintes domínios:

- **Localização**: estados, cidades e endereços.
- **Pessoas e instituições**: organizações, papéis de membro e membros (que também são os usuários autenticáveis do sistema).
- **Projetos**: tipos de projeto, projetos, mídias de projeto e os vínculos com áreas de pesquisa e membros.
- **Eventos**: eventos e suas mídias.
- **Notícias**: notícias, mídias e o vínculo com áreas de pesquisa.
- **Publicações**: publicações e suas especializações (artigos, teses, livros e capítulos de livro), autores externos, papéis de contribuidor e a lista ordenada de contribuidores.
- **Áreas de pesquisa**: taxonomia compartilhada entre projetos, publicações e notícias.
- **Imagens**: upload, geração de variantes e armazenamento no Cloudflare R2.
- **Sessões**: autenticação, logout e blacklist de tokens.

---

# [Voltar ao menu](../README.md)
