### [Voltar ao menu](../README.md)

# Como Executar

## Ambiente de Desenvolvimento

```bash
npm run dev
```

O `ts-node-dev` roda o TypeScript direto, com hot reload (`--respawn`) e sem checagem de tipos em tempo de execução (`--transpile-only`). O servidor sobe em `http://127.0.0.1:3333` ou na porta definida em `PORT`.

Confirme que subiu:

```bash
curl http://127.0.0.1:3333/health
```

Resposta esperada: `{"ok":true}`.

> Antes do primeiro `npm run dev`, o banco precisa existir e as migrations precisam ter sido executadas. Veja [Instalação](instalacao.md).

## Ambiente de Produção

1. **Compile o projeto:**

   ```bash
   npm run build
   ```

   O TypeScript é compilado de `src/` para `dist/`, conforme o `tsconfig.json`.

2. **Execute as migrations no banco de produção:**

   ```bash
   npm run migration:run
   ```

3. **Inicie a aplicação:**

   ```bash
   npm start
   ```

   Equivale a `node dist/server.js`. Em um servidor, use o PM2 para manter o processo ativo - veja [Deploy](deploy.md).

---

# Scripts Disponíveis

| Script | Comando | Descrição |
| --- | --- | --- |
| `npm run dev` | `ts-node-dev --transpile-only --respawn --clear src/server.ts` | Servidor em modo desenvolvimento, com hot reload |
| `npm run build` | `tsc` | Compila o TypeScript de `src/` para `dist/` |
| `npm start` | `node dist/server.js` | Executa a build gerada |
| `npm run typeorm` | CLI do TypeORM com `dotenv` e `ts-node` carregados | Base para os comandos de migration |
| `npm run migration:generate` | `typeorm migration:generate` | Gera uma migration a partir da diferença entre as entidades e o banco |
| `npm run migration:run` | `typeorm migration:run` | Executa as migrations pendentes |
| `npm run migration:revert` | `typeorm migration:revert` | Desfaz a última migration aplicada |
| `npm run lint` | `eslint "src/**/*.ts"` | Verificação de linting |
| `npm run format` | `prettier --write "src/**/*.ts"` | Formatação do código |

> **Atenção:** `eslint` e `prettier` ainda não estão listados em `devDependencies` nem possuem arquivos de configuração no repositório. Os scripts `lint` e `format` só funcionam após a instalação e configuração dessas ferramentas - veja [Contribuição](contribuicao.md).

---

# Comandos Úteis

## Migrations (TypeORM)

Todos os comandos apontam para o data source em `src/shared/infra/database/data-source.ts`.

```bash
# Executar migrations pendentes
npm run migration:run
```

```bash
# Desfazer a última migration
npm run migration:revert
```

```bash
# Gerar uma migration a partir das entidades
npm run migration:generate
```

```bash
# Listar migrations e o status de cada uma
npm run typeorm -- migration:show -d src/shared/infra/database/data-source.ts
```

### Sobre o nome das migrations

O script `migration:generate` está fixo no caminho `src/shared/infra/typeorm/migrations/Init`, ou seja, sempre gera um arquivo com o sufixo `Init`. Para dar um nome próprio à migration, rode o comando completo:

```bash
npm run typeorm -- migration:generate src/shared/infra/typeorm/migrations/AddCampoNaTabela -d src/shared/infra/database/data-source.ts
```

Para criar uma migration vazia (a ser escrita manualmente, como a de seed):

```bash
npm run typeorm -- migration:create src/shared/infra/typeorm/migrations/NomeDaMigration
```

> As migrations existentes seguem o padrão `AAAAMMDDHHMMSS-NomeDescritivo.ts`. Mantenha esse formato ao criar novas: a ordem de execução depende do timestamp.

## Banco de dados

```bash
# Exportar o banco para um arquivo SQL
mysqldump -u root -p --port=3307 db_rede_campo_online > backup.sql
```

```bash
# Importar um arquivo SQL
mysql -u root -p --port=3307 db_rede_campo_online < backup.sql
```

## Git

```bash
# Criar uma branch para uma nova funcionalidade
git checkout -b feat/nome-da-funcionalidade
```

```bash
# Commit seguindo Conventional Commits
git commit -m "feat(publications): adiciona filtro por projeto"
```

Os padrões de commit e versionamento estão em [Contribuição](contribuicao.md).

## PM2 (produção)

```bash
# Status dos processos
pm2 status
```

```bash
# Logs em tempo real
pm2 logs rede-campo-api
```

```bash
# Reiniciar
pm2 restart rede-campo-api
```

Os comandos completos de PM2 e a configuração do `ecosystem.config.yml` estão em [Deploy](deploy.md) e [Estrutura de Logs](estrutura-de-logs.md).

---

# [Voltar ao menu](../README.md)
