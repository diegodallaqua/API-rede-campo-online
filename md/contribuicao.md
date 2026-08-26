### [Voltar ao menu](../README.md)

# Contribuição

## Padrões de Código

- **TypeScript com tipagem forte.** O `tsconfig.json` usa `strict: true`. Evite `any`; quando for inevitável (ex.: `req.user`), isole o cast em um único ponto.
- **Siga a estrutura de módulos existente.** Um novo recurso não deve inventar uma organização própria - veja o passo a passo em [Estrutura do Projeto](estrutura-do-projeto.md).
- **Regra de negócio fica no caso de uso.** Controllers apenas leem a requisição, resolvem o caso de uso pelo container e devolvem a resposta. Nada de consulta ao banco dentro do controller.
- **Validação de entrada fica na rota**, com celebrate/Joi, declarada por segmento (`BODY`, `QUERY`, `PARAMS`).
- **Erros esperados usam `AppError`**, sempre com status HTTP e um `code` estável - o front-end depende desse código.
- **Alterações de schema são feitas por migration.** `synchronize` está desligado, e deve continuar assim.
- **Nomes de arquivos, classes e rotas seguem as convenções** da tabela em [Estrutura do Projeto](estrutura-do-projeto.md).
- **Comentários explicam o porquê, não o quê.** O padrão do repositório é comentar decisões não óbvias (como a configuração de `trust proxy` no `app.ts`), não descrever o que o código já diz.

### Ferramentas de qualidade

O `package.json` já traz os scripts:

```bash
npm run lint
```

```bash
npm run format
```

> **Pendência conhecida:** `eslint` e `prettier` ainda não estão em `devDependencies` e o repositório não tem `.eslintrc` nem `.prettierrc`. Os scripts falham até que isso seja configurado. Para habilitá-los:
>
> ```bash
> npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier
> ```
>
> Em seguida, crie os arquivos de configuração e commite-os junto - assim todo mundo formata o código igual.

---

## Estrutura de Commits

Adote o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/), que torna o histórico legível e permite automatizar changelogs.

**Formato:**

```
tipo(escopo)!: descrição breve
```

- `tipo`: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `build`, `perf`, `ci`
- `escopo`: o módulo afetado (opcional, mas recomendado)
- `!`: indica breaking change
- `descrição`: curta, objetiva, no imperativo, em português

**Exemplos:**

```
feat(publications): adiciona filtro por project_id na listagem
fix(sessions): corrige logout com token sem claim exp
docs(md): documenta as variáveis do Cloudflare R2
refactor(members)!: renomeia campo profile_picture para avatar_url
chore(deps): atualiza typeorm para 0.3.28
```

### O que não commitar

- `.env` e qualquer arquivo com credenciais reais
- `node_modules/` e `dist/`
- Tokens JWT válidos em arquivos de exemplo (atenção ao `src/teste.http`)
- Dumps de banco com dados pessoais

---

## Fluxo de trabalho

1. Crie uma branch a partir da `main`:

   ```bash
   git checkout -b feat/nome-da-funcionalidade
   ```

2. Faça commits pequenos e coesos, seguindo o padrão acima.

3. Antes de abrir o Pull Request, verifique que o projeto compila:

   ```bash
   npm run build
   ```

4. Se a mudança envolveu schema, teste a migration nos dois sentidos:

   ```bash
   npm run migration:run
   ```

   ```bash
   npm run migration:revert
   ```

5. Atualize a documentação afetada em `md/` **no mesmo Pull Request**. Documentação desatualizada é pior do que documentação ausente.

6. Abra o Pull Request descrevendo o que muda, por quê, e como testar.

### Convenção de nomes de branch

| Prefixo | Uso |
| --- | --- |
| `feat/` | Nova funcionalidade |
| `fix/` | Correção de bug |
| `refactor/` | Reestruturação sem mudança de comportamento |
| `docs/` | Somente documentação |
| `chore/` | Dependências, configuração, tarefas de manutenção |

---

## Migrations

- **Nunca edite uma migration já aplicada** em um ambiente compartilhado. Crie uma nova.
- Mantenha o padrão de nome `AAAAMMDDHHMMSS-Descricao.ts` - a ordem de execução depende do timestamp.
- Implemente sempre o método `down`, para permitir o rollback.
- Migrations de dados (seed) devem ser **idempotentes**: verifique se o registro já existe antes de inserir, como faz a `20260615000000-SeedInitialData.ts`.

---

# Versionamento

Este projeto segue o [Semantic Versioning](https://semver.org/):

- **MAJOR**: mudanças incompatíveis na API (remoção de endpoint, alteração no formato de resposta, campo obrigatório novo)
- **MINOR**: funcionalidades adicionadas de forma compatível (novo endpoint, novo filtro opcional)
- **PATCH**: correções de bugs compatíveis

A versão atual está no campo `version` do `package.json`.

---

## Pontos conhecidos que precisam de atenção

Lista de melhorias já identificadas, úteis como ponto de partida para quem for contribuir:

- **Rotas duplicadas.** Em `states/http/routes/routes.ts` e `cities/http/routes/routes.ts`, há dois `GET "/"` registrados. O primeiro, sem validação, atende todas as requisições e o segundo - com a validação Joi de `search`, `page` e `take` - nunca é alcançado. Basta remover o primeiro.
- **ESLint e Prettier não configurados**, conforme descrito acima.
- **Sem Swagger.** Os endpoints são documentados manualmente em [Documentação da API](documentacao-da-api.md).
- **Sem testes automatizados.** Não há framework de testes no projeto. A injeção de dependências já deixa os casos de uso prontos para serem testados com repositórios mockados.
- **Sem autorização por papel.** O `role_id` está no token e disponível em `req.user`, mas nenhuma rota o utiliza: qualquer membro autenticado pode executar qualquer escrita.
- **Sem refresh token.** Expirado o token, é preciso refazer o login.
- **Tokens de exemplo versionados.** O `src/teste.http` contém tokens JWT reais (já expirados). O ideal é substituí-los por um placeholder.

---

# [Voltar ao menu](../README.md)
