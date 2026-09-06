### [Voltar ao menu](../README.md)

# Documentação da API

> **Status:** a API ainda **não** possui Swagger/OpenAPI. Esta página é a referência dos endpoints, mantida manualmente. Enquanto o Swagger não é adicionado, use o arquivo [`src/teste.http`](../src/teste.http) - ele traz requisições prontas para todos os recursos, executáveis pela extensão **REST Client** do VS Code.

## Convenções gerais

- **Base URL (desenvolvimento):** `http://192.168.0.131:3333`
- **Formato:** JSON em todas as requisições e respostas, exceto o upload de imagem (`multipart/form-data`).
- **Autenticação:** header `Authorization: Bearer <token>` nas rotas protegidas. Veja [Sistema de Autenticação](sistema-de-autenticacao.md).
- **Limite do corpo da requisição:** 1 MB (`express.json`).
- **Rate limit:** 120 requisições por IP a cada 60 segundos, por padrão. As respostas trazem os headers `RateLimit-*`.

### Paginação

Os endpoints de listagem aceitam `page` e `take`:

| Parâmetro | Tipo | Padrão | Limite |
| --- | --- | --- | --- |
| `page` | inteiro ≥ 1 | `1` | - |
| `take` | inteiro ≥ 1 | `10` | `100` |

E respondem com o envelope:

```json
{
  "per_page": 10,
  "total": 42,
  "current_page": 1,
  "data": [ ... ]
}
```

### Formato dos erros

Erro de validação (celebrate/Joi) - `400`:

```json
{
  "message": "Validation error",
  "details": {
    "body": "\"name\" is required",
    "query": "\"take\" must be less than or equal to 100"
  }
}
```

Erro de aplicação (`AppError`) - status próprio:

```json
{
  "message": "Invalid credentials",
  "code": "INVALID_CREDENTIALS"
}
```

Erro inesperado - `500`. O campo `stack` só aparece quando `NODE_ENV` é diferente de `production`:

```json
{
  "message": "Internal server error"
}
```

### Códigos de status utilizados

| Status | Significado |
| --- | --- |
| `200` | Sucesso em leitura ou atualização |
| `201` | Recurso criado |
| `204` | Remoção concluída, sem corpo |
| `400` | Erro de validação ou regra de negócio |
| `401` | Token ausente, inválido ou credenciais incorretas |
| `404` | Recurso não encontrado |
| `409` | Conflito (registro duplicado ou em uso) |
| `413` | Arquivo maior que 10 MB |
| `415` | Tipo de arquivo não suportado |
| `429` | Rate limit excedido |
| `500` | Erro interno |

---

## Health check

| Método | Rota | Auth | Resposta |
| --- | --- | --- | --- |
| `GET` | `/health` | Não | `{ "ok": true }` |

---

## Sessões

| Método | Rota | Auth | Descrição |
| --- | --- | --- | --- |
| `POST` | `/sessions` | Não | Login. Corpo: `email`, `password` (8 a 100 caracteres). Retorna `token` e `user` |
| `DELETE` | `/sessions` | **Sim** | Logout. Adiciona o hash do token à blacklist |

---

## Localização

### Estados - `/states`

| Método | Rota | Auth | Parâmetros |
| --- | --- | --- | --- |
| `GET` | `/states` | Não | `search`, `page`, `take` |
| `POST` | `/states` | **Sim** | `name` (2 a 120 caracteres) |
| `PUT` | `/states/:id` | **Sim** | `name` |
| `DELETE` | `/states/:id` | **Sim** | - |

### Cidades - `/cities`

| Método | Rota | Auth | Parâmetros |
| --- | --- | --- | --- |
| `GET` | `/cities` | Não | `search`, `state_id`, `page`, `take` |
| `POST` | `/cities` | **Sim** | `state_id`, `name` |
| `PUT` | `/cities/:id` | **Sim** | `state_id`, `name` |
| `DELETE` | `/cities/:id` | **Sim** | - |

### Endereços - `/addresses`

| Método | Rota | Auth | Parâmetros |
| --- | --- | --- | --- |
| `GET` | `/addresses` | Não | `search`, `city_id`, `page`, `take` |
| `POST` | `/addresses` | **Sim** | `city_id`, `street`, `neighborhood`, `number`, `cep`, `complement` |
| `PUT` | `/addresses/:id` | **Sim** | Mesmos campos do `POST` |
| `DELETE` | `/addresses/:id` | **Sim** | - |

---

## Membros e organizações

### Organizações - `/organizations`

> Todo o router exige autenticação, **inclusive a listagem**.

| Método | Rota | Auth | Parâmetros |
| --- | --- | --- | --- |
| `GET` | `/organizations` | **Sim** | `search`, `address_id`, `page`, `take` |
| `POST` | `/organizations` | **Sim** | `address_id`, `name`, `logo` |
| `PUT` | `/organizations/:id` | **Sim** | Mesmos campos do `POST` |
| `DELETE` | `/organizations/:id` | **Sim** | - |

### Papéis de membro - `/member-roles`

| Método | Rota | Auth | Parâmetros |
| --- | --- | --- | --- |
| `GET` | `/member-roles` | Não | `search`, `page`, `take` |

Somente leitura. Os registros (`Fundador`, `Pesquisador`, `Desenvolvedor`) vêm do seed.

### Membros - `/members`

| Método | Rota | Auth | Parâmetros |
| --- | --- | --- | --- |
| `GET` | `/members` | Não | `search`, `member_role_id`, `organization_id`, `page`, `take` |
| `POST` | `/members` | **Sim** | `member_role_id`, `organization_id`, `name`, `email`, `password`, `description`, `lattes_url`, `linked_in_url`, `instagram_url`, `profile_picture` |
| `PUT` | `/members/:id` | **Sim** | Mesmos campos do `POST` |
| `DELETE` | `/members/:id` | **Sim** | - |

> O campo `password` nunca é retornado nas respostas.

---

## Projetos

### Projetos - `/projects`

| Método | Rota | Auth | Parâmetros |
| --- | --- | --- | --- |
| `GET` | `/projects` | Não | `project_name`, `status`, `page`, `take` |
| `GET` | `/projects/:id/publications` | Não | `title`, `page`, `take` |
| `POST` | `/projects` | **Sim** | `project_type_id`, `name`, `description`, `status`, `begin_date`, `end_date`, `research_area_ids[]`, `member_ids[]` |
| `PUT` | `/projects/:id` | **Sim** | Mesmos campos do `POST` |
| `DELETE` | `/projects/:id` | **Sim** | - |

- `begin_date` e `end_date` usam o formato `AAAA-MM-DD`. `end_date` aceita `null` ou string vazia.
- `research_area_ids` e `member_ids` são arrays de inteiros; quando omitidos, assumem `[]`.
- `GET /projects/:id/publications` devolve a publicação completa (detalhes do tipo, áreas de pesquisa, contribuidores e o objeto `project`), no mesmo formato de `GET /publications`.

### Tipos de projeto - `/project-types`

| Método | Rota | Auth | Parâmetros |
| --- | --- | --- | --- |
| `GET` | `/project-types` | Não | `search`, `page`, `take` |

Somente leitura. Registros do seed: `Projeto de Extensão`, `Projeto de Desenvolvimento Tecnológico e Inovação`, `Projeto de Pesquisa`.

### Mídias de projeto - `/project-media`

| Método | Rota | Auth | Parâmetros |
| --- | --- | --- | --- |
| `GET` | `/project-media` | Não | `project_id`, `search`, `page`, `take` |
| `POST` | `/project-media` | **Sim** | `project_id`, `media`, demais campos da mídia |
| `PUT` | `/project-media/:id` | **Sim** | Mesmos campos do `POST` |
| `DELETE` | `/project-media/:id` | **Sim** | - |

---

## Eventos

### Eventos - `/events`

| Método | Rota | Auth | Parâmetros |
| --- | --- | --- | --- |
| `GET` | `/events` | Não | `project_id`, `search`, `date_from`, `date_to`, `page`, `take` |
| `POST` | `/events` | **Sim** | Dados do evento |
| `PUT` | `/events/:id` | **Sim** | Dados do evento |
| `DELETE` | `/events/:id` | **Sim** | - |

`date_from` e `date_to` aceitam datas no formato ISO.

### Mídias de evento - `/event-media`

| Método | Rota | Auth | Parâmetros |
| --- | --- | --- | --- |
| `GET` | `/event-media` | Não | `event_id`, `search`, `page`, `take` |
| `POST` | `/event-media` | **Sim** | `event_id`, `media`, demais campos |
| `PUT` | `/event-media/:id` | **Sim** | Mesmos campos do `POST` |
| `DELETE` | `/event-media/:id` | **Sim** | - |

---

## Notícias

### Notícias - `/news`

| Método | Rota | Auth | Parâmetros |
| --- | --- | --- | --- |
| `GET` | `/news` | Não | `search`, `page`, `take` |
| `POST` | `/news` | **Sim** | Dados da notícia e `research_area_ids[]` |
| `PUT` | `/news/:id` | **Sim** | Mesmos campos do `POST` |
| `DELETE` | `/news/:id` | **Sim** | - |

### Mídias de notícia - `/news-media`

| Método | Rota | Auth | Parâmetros |
| --- | --- | --- | --- |
| `GET` | `/news-media` | Não | `news_id`, `search`, `page`, `take` |
| `POST` | `/news-media` | **Sim** | `news_id`, `media`, demais campos |
| `PUT` | `/news-media/:id` | **Sim** | Mesmos campos do `POST` |
| `DELETE` | `/news-media/:id` | **Sim** | - |

---

## Áreas de pesquisa

| Método | Rota | Auth | Parâmetros |
| --- | --- | --- | --- |
| `GET` | `/research-areas` | Não | `search`, `page`, `take` |

Somente leitura. As áreas são inseridas pelo seed e vinculadas a projetos, publicações e notícias pelas tabelas de junção.

---

## Publicações

### Publicações - `/publications`

| Método | Rota | Auth | Parâmetros |
| --- | --- | --- | --- |
| `GET` | `/publications` | Não | `title`, `project_id`, `page`, `take` |
| `POST` | `/publications` | **Sim** | `title`, `abstract`, `publication_date`, `doi`, `project_id`, `research_area_ids[]` |
| `PUT` | `/publications/:id` | **Sim** | Mesmos campos do `POST` |
| `DELETE` | `/publications/:id` | **Sim** | - |

O `project_id` é aceito como parâmetro de entrada (filtro e corpo), mas a resposta devolve o objeto `project` completo (ou `null`). A listagem devolve, para cada publicação, os detalhes do tipo específico (artigo, livro, capítulo ou tese), as áreas de pesquisa e a lista de contribuidores:

```json
{
  "per_page": 10,
  "total": 1,
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "title": "Título da publicação",
      "abstract": "Resumo...",
      "publication_date": "2026-03-15",
      "doi": "10.0000/exemplo",
      "project": {
        "id": 1,
        "name": "Nome do projeto",
        "description": "Descrição do projeto",
        "status": true,
        "begin_date": "2026-01-10",
        "end_date": null,
        "projectType": {
          "id": 3,
          "name": "Projeto de Pesquisa"
        }
      },
      "details": {
        "type": "article",
        "journal_name": "Nome do periódico",
        "volume": "12",
        "issue": "3",
        "pages": "45-60",
        "publisher": "Editora"
      },
      "research_areas": [ ... ],
      "contributors": [ ... ]
    }
  ]
}
```

O campo `details.type` assume os valores `article`, `book`, `book_chapter` ou `academic_work`, e é `null` quando a publicação ainda não foi especializada.

### Especializações de publicação

Cada tipo estende uma publicação existente e usa `publication_id` como identificador na rota.

| Recurso | Rotas | Auth (escrita) | Campos próprios |
| --- | --- | --- | --- |
| `/articles` | `GET /`, `POST /`, `PUT /:publication_id`, `DELETE /:publication_id` | **Sim** | `journal_name`, `volume`, `issue`, `pages`, `publisher` |
| `/academic-works` | `GET /`, `POST /`, `PUT /:publication_id`, `DELETE /:publication_id` | **Sim** | `number_of_pages`, `organization_id`, `academic_work_type_id`, `defense_date` |
| `/books` | `GET /`, `POST /`, `PUT /:publication_id`, `DELETE /:publication_id` | **Sim** | `publisher`, `edition`, `cover_photo`, `isbn`, `book_url` |
| `/book-chapters` | `GET /`, `POST /`, `PUT /:publication_id`, `DELETE /:publication_id` | **Sim** | `book_name`, `chapter_number`, `book_id` (opcional), `isbn` (opcional), `start_page`, `end_page` |

Filtros de listagem: `title`, `page`, `take` (em `/academic-works`, também `organization_id` e `academic_work_type_id`; em `/book-chapters`, também `book_id`).

`defense_date` é enviado no formato `AAAA-MM-DD`. Em `/book-chapters`, `book_id` referencia o `publication_id` de um livro existente e é opcional — quando informado, a resposta traz o objeto `book` com `id`, `publisher`, `edition`, `isbn` e `publication` (com `id`, `title`, `abstract`, `publication_date` e `doi` do livro).

### Tipos de trabalho acadêmico - `/academic-work-types`

Tabela de referência somente leitura, populada por migration.

| Rota | Auth | Filtros |
| --- | --- | --- |
| `GET /academic-work-types` | Não | `search`, `page`, `take` |

Valores: Trabalho de Conclusão de Curso (Graduação), Monografia (Especialização), Dissertação (Mestrado), Tese (Doutorado), Tese (Livre-docência), Relatório (Pós-doutorado).

> A ordem importa: crie primeiro a publicação em `/publications` e só depois a especialização, usando o `publication_id` retornado.

### Autores externos - `/external-authors`

| Método | Rota | Auth | Parâmetros |
| --- | --- | --- | --- |
| `GET` | `/external-authors` | Não | `name`, `page`, `take` |
| `POST` | `/external-authors` | **Sim** | Dados do autor |
| `PUT` | `/external-authors/:id` | **Sim** | Dados do autor |
| `DELETE` | `/external-authors/:id` | **Sim** | - |

### Papéis de contribuidor - `/contributor-role`

| Método | Rota | Auth | Parâmetros |
| --- | --- | --- | --- |
| `GET` | `/contributor-role` | Não | `search`, `page`, `take` |

Somente leitura.

### Contribuidores - `/publication-contributors`

| Método | Rota | Auth | Parâmetros |
| --- | --- | --- | --- |
| `GET` | `/publication-contributors` | Não | `publication_id`, `page`, `take` |
| `POST` | `/publication-contributors` | **Sim** | `publication_id`, `author_order`, `contributor_role_id` e o autor (membro **ou** autor externo) |
| `PUT` | `/publication-contributors/:publication_id/:author_order` | **Sim** | Mesmos campos do `POST` |
| `DELETE` | `/publication-contributors/:publication_id/:author_order` | **Sim** | - |

> A chave é composta por `publication_id` + `author_order`, e é isso que define a ordem de citação dos autores. Por isso as rotas de atualização e remoção recebem os dois valores.

---

## Imagens

> Todo o router exige autenticação.

### `POST /images/upload`

Envia uma imagem ao Cloudflare R2 e devolve as URLs públicas. **Nada é gravado no banco** - cabe ao cliente enviar a URL escolhida no campo `media` de `/project-media`, `/event-media` ou `/news-media`.

Requisição - `multipart/form-data`:

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `file` | binário | JPEG, PNG ou WebP. Máximo de 10 MB |
| `entityType` | string | Um de: `event`, `news`, `project`, `book`, `member` |
| `entityId` | string | Identificador da entidade (1 a 36 caracteres) |

Resposta - `201`:

```json
{
  "url_small": "https://cdn.exemplo.br/project/1/uuid-small.webp",
  "url_medium": "https://cdn.exemplo.br/project/1/uuid-medium.webp",
  "url_large": "https://cdn.exemplo.br/project/1/uuid-large.webp",
  "file_key": "project/1/uuid",
  "mime_type": "image/jpeg",
  "size_kb": 210
}
```

Cada upload gera três variantes em WebP, sem ampliar imagens menores que o alvo:

| Variante | Largura máxima | Qualidade |
| --- | --- | --- |
| `small` | 320 px | 75 |
| `medium` | 800 px | 80 |
| `large` | 1920 px | 85 |

Erros possíveis:

| Código | Status | Situação |
| --- | --- | --- |
| `FILE_MISSING` | 400 | Campo `file` ausente |
| `INVALID_IMAGE` | 400 | Arquivo corrompido ou ilegível pelo `sharp` |
| `FILE_TOO_LARGE` | 413 | Arquivo maior que 10 MB |
| `INVALID_MIME_TYPE` | 415 | Formato diferente de JPEG, PNG ou WebP |
| `UPLOAD_ERROR` | 400 | Demais erros do Multer |

---

## Boas práticas para manter esta documentação

- **Atualize junto com o código.** Toda alteração em `http/routes/routes.ts` deve refletir aqui, no mesmo commit.
- **Documente a autenticação de cada rota**, principalmente as exceções ao padrão "leitura pública, escrita protegida".
- **Padronize as mensagens de erro**, sempre com um `code` estável - o front-end depende dele.
- **Não use dados reais** nos exemplos: nada de e-mails de pessoas, senhas ou tokens válidos.
- **Considere adicionar Swagger.** Uma boa evolução seria incluir `swagger-ui-express` e servir a especificação em `/docs`, com a definição versionada em `src/swagger.json`.

---

# [Voltar ao menu](../README.md)
