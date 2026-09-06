### [Voltar ao menu](../README.md)

# Estrutura do Projeto

A aplicação segue uma arquitetura modular baseada em princípios de Clean Architecture e Domain-Driven Design (DDD). Os conceitos por trás dessa organização estão em [Arquitetura do Projeto](arquitetura-do-projeto.md).

## Visão geral

```
API-rede-campo-online/
├── .env                      # Variáveis de ambiente locais (fora do controle de versão)
├── .env.example              # Modelo das variáveis de ambiente
├── .gitignore
├── README.md                 # Índice da documentação
├── README_VM.md              # Informações de infraestrutura da VM
├── md/                       # Documentação detalhada do projeto
├── package.json              # Manifesto, dependências e scripts
├── package-lock.json
├── tsconfig.json             # Configuração do TypeScript (target ES2021, strict, decorators)
└── src/                      # Código-fonte
    ├── server.ts             # Ponto de entrada: inicializa o data source e sobe o Express
    ├── teste.http            # Requisições de exemplo (extensão REST Client do VS Code)
    ├── config/               # Configurações da aplicação
    │   ├── auth.ts           # Segredo e expiração do JWT
    │   └── r2.ts             # Cliente S3 apontado para o Cloudflare R2
    ├── modules/              # Módulos de domínio
    └── shared/               # Código compartilhado entre módulos
```

## `src/shared` - infraestrutura compartilhada

```
src/shared/
├── container/
│   ├── index.ts              # Importa o container de todos os módulos (registro global)
│   └── providers/
│       └── index.ts          # Registro de providers compartilhados
├── errors/
│   └── AppError.ts           # Erro de aplicação com statusCode e code
└── infra/
    ├── database/
    │   └── data-source.ts    # DataSource do TypeORM (driver mariadb, synchronize: false)
    ├── http/
    │   ├── app.ts            # Aplicação Express: helmet, cors, rate-limit, /health, rotas, erros
    │   ├── middlewares/
    │   │   ├── errorHandler.ts     # Handler global de erros (celebrate, AppError, 500)
    │   │   ├── isAuthenticated.ts  # Verificação do JWT e da blacklist de tokens
    │   │   └── upload.ts           # Multer em memória: JPEG/PNG/WebP, máx. 10 MB
    │   └── routes/
    │       └── index.ts      # Router raiz: associa cada prefixo ao router do módulo
    └── typeorm/
        └── migrations/       # Migrations, nomeadas AAAAMMDDHHMMSS-Descricao.ts
```

### Migrations

```
src/shared/infra/typeorm/migrations/
├── 20260207184530-CreateStates.ts
├── 20260209184530-CreateCities.ts
├── 20260215062300-CreateAddresses.ts
├── 20260216000245-CreateOrganizations.ts
├── 20260216010400-CreateMemberRoles.ts
├── 20260216032200-CreateMember.ts
├── 20260220000000-CreateProjectType.ts
├── 20260303223000-CreateProjects.ts
├── 20260304010000-CreateProjectMedia.ts
├── 20260304220000-CreateEvents.ts
├── 20260305010000-CreateEventMedia.ts
├── 20260308022000-CreateNews.ts
├── 20260308051800-CreateNewsMedia.ts
├── 20260311010000-CreatePublications.ts
├── 20260312003000-CreateExternalAuthors.ts
├── 20260315000000-CreateContributorRole.ts
├── 20260318224000-CreatePublicationContributors.ts
├── 20260319001000-CreateArticles.ts
├── 20260319135200-CreateTechnicalReports.ts
├── 20260331113000-CreateBooks.ts
├── 20260331130000-CreateBookChapters.ts
├── 20260401000000-CreateResearchArea.ts
├── 20260403231500-CreatePublicationHasResearchAreas.ts
├── 20260403235000-CreateNewsHasResearchAreas.ts
├── 20260404014500-CreateProjectHasResearchAreas.ts
├── 20260404030000-CreateProjectHasMembers.ts
├── 20260527000000-CreateTokenBlacklist.ts
├── 20260609000000-CascadeDeleteMedia.ts
├── 20260609000001-RemoveProjectIdFromNews.ts
├── 20260611000000-CascadeDeletePublicationChildren.ts
├── 20260613000000-WidenMemberDescription.ts
├── 20260615000000-SeedInitialData.ts        # Dados iniciais (idempotente)
├── 20260811000000-AddProjectIdToPublications.ts
├── 20260827010000-CreateAcademicWorkType.ts
├── 20260827020000-RenameThesisToAcademicWork.ts
└── 20260827030000-AddBookRelationAndPagesToBookChapter.ts
```

> A ordem de execução é determinada pelo timestamp no início do nome. Nunca edite uma migration já aplicada em produção - crie uma nova.

## `src/modules` - módulos de domínio

Cada módulo completo segue o mesmo formato. Exemplo com o módulo `publications`:

```
src/modules/publications/
├── container/
│   └── index.ts                              # Registra PublicationsRepository no tsyringe
├── entities/
│   └── Publication.ts                        # Entidade TypeORM (tabela publication)
├── http/
│   ├── controllers/
│   │   ├── CreatePublicationController.ts
│   │   ├── ListPublicationsController.ts
│   │   ├── UpdatePublicationController.ts
│   │   └── DeletePublicationController.ts
│   └── routes/
│       └── routes.ts                         # Endpoints, validação Joi e isAuthenticated
├── repositories/
│   ├── IPublicationRepository.ts             # Contrato
│   └── PublicationsRepository.ts             # Implementação sobre o TypeORM
└── useCases/
    ├── CreatePublicationUseCase.ts
    ├── ListPublicationsUseCase.ts
    ├── UpdatePublicationUseCase.ts
    └── DeletePublicationUseCase.ts
```

### Módulos existentes

| Módulo | Prefixo da rota | Entidade | Observações |
| --- | --- | --- | --- |
| `sessions` | `/sessions` | `TokenBlacklist` | Login, logout e invalidação de tokens |
| `states` | `/states` | `State` | CRUD completo |
| `cities` | `/cities` | `City` | CRUD completo |
| `addresses` | `/addresses` | `Address` | CRUD completo |
| `organizations` | `/organizations` | `Organization` | CRUD completo (todo o router exige autenticação) |
| `memberRoles` | `/member-roles` | `MemberRole` | Somente leitura |
| `members` | `/members` | `Member` | CRUD completo. A entidade também guarda e-mail e senha de acesso |
| `projectTypes` | `/project-types` | `ProjectType` | Somente leitura |
| `projects` | `/projects` | `Project` | CRUD + `GET /:id/publications` |
| `projectMedia` | `/project-media` | `ProjectMedia` | CRUD completo |
| `projectHasMembers` | - | `ProjectHasMember` | Tabela de junção, sem rotas próprias |
| `projectHasResearchAreas` | - | `ProjectHasResearchArea` | Tabela de junção, sem rotas próprias |
| `events` | `/events` | `Event` | CRUD completo |
| `eventMedia` | `/event-media` | `EventMedia` | CRUD completo |
| `news` | `/news` | `News` | CRUD completo |
| `newsMedia` | `/news-media` | `NewsMedia` | CRUD completo |
| `newsHasResearchAreas` | - | `NewsHasResearchArea` | Tabela de junção, sem rotas próprias |
| `publications` | `/publications` | `Publication` | CRUD completo |
| `articles` | `/articles` | `Article` | Especialização de publicação |
| `academicWork` | `/academic-works` | `AcademicWork` | Especialização de publicação |
| `academicWorkTypes` | `/academic-work-types` | `AcademicWorkType` | Somente leitura |
| `books` | `/books` | `Book` | Especialização de publicação |
| `bookChapters` | `/book-chapters` | `BookChapter` | Especialização de publicação |
| `externalAuthors` | `/external-authors` | `ExternalAuthor` | Autores que não são membros |
| `contributorRoles` | `/contributor-role` | `ContributorRole` | Somente leitura |
| `publicationContributors` | `/publication-contributors` | `PublicationContributor` | Chave composta `publication_id` + `author_order` |
| `publicationHasResearchAreas` | - | `PublicationHasResearchArea` | Tabela de junção, sem rotas próprias |
| `researchAreas` | `/research-areas` | `ResearchArea` | Somente leitura |
| `images` | `/images` | - | Upload para o Cloudflare R2, sem persistência em banco |

### Módulos parciais

Nem todo módulo tem as cinco camadas:

```
src/modules/images/                  # Sem entities e sem repositories
├── container/index.ts
├── http/
│   ├── controllers/UploadImageController.ts
│   └── routes/routes.ts
└── useCases/UploadImageUseCase.ts   # sharp + PutObjectCommand no R2

src/modules/projectHasMembers/       # Tabela de junção: sem http e sem useCases
├── container/index.ts
├── entities/ProjectHasMember.ts
└── repositories/
    ├── IProjectHasMembersRepository.ts
    └── ProjectHasMembersRepository.ts

src/modules/researchAreas/           # Somente leitura: apenas o caso de uso de listagem
├── container/index.ts
├── entities/ResearchArea.ts
├── http/
│   ├── controllers/ListResearchAreasController.ts
│   └── routes/routes.ts
├── repositories/
│   ├── IResearchAreaRepository.ts
│   └── ResearchAreaRepository.ts
└── useCases/ListResearchAreasUseCase.ts
```

## Convenções de nomenclatura

| Elemento | Convenção | Exemplo |
| --- | --- | --- |
| Pasta de módulo | `camelCase`, no plural | `bookChapters` |
| Entidade | `PascalCase`, no singular | `BookChapter.ts` |
| Interface de repositório | `I` + entidade + `Repository` | `IBookChapterRepository.ts` |
| Implementação de repositório | Entidade + `Repository` | `BookChaptersRepository.ts` |
| Caso de uso | Verbo + entidade + `UseCase` | `CreateBookChapterUseCase.ts` |
| Controller | Verbo + entidade + `Controller` | `CreateBookChapterController.ts` |
| Arquivo de rotas | Sempre `routes.ts` | `http/routes/routes.ts` |
| Export do router | `camelCase` + `Routes` | `bookChaptersRoutes` |
| Prefixo da URL | `kebab-case` | `/book-chapters` |
| Migration | `AAAAMMDDHHMMSS-Descricao.ts` | `20260331130000-CreateBookChapters.ts` |

## Como adicionar um novo módulo

1. Crie a pasta `src/modules/<nomeDoModulo>` com as subpastas `entities`, `repositories`, `useCases`, `container` e `http/{controllers,routes}`.
2. Escreva a entidade e gere a migration correspondente.
3. Defina a interface do repositório e a implementação sobre o TypeORM.
4. Registre a implementação em `container/index.ts` do módulo.
5. Importe esse container em `src/shared/container/index.ts`.
6. Escreva os casos de uso, os controllers e o `routes.ts` com a validação Joi.
7. Registre o router em `src/shared/infra/http/routes/index.ts`.
8. Atualize a [Documentação da API](documentacao-da-api.md) com os novos endpoints.

---

# [Voltar ao menu](../README.md)
