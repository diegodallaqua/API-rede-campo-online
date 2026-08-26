### [Voltar ao menu](../README.md)

# Troubleshooting

## Problemas de banco de dados

### Acesso negado

```
Error: ER_ACCESS_DENIED_ERROR: Access denied for user 'root'@'localhost'
```

**Solução:** verifique `DB_USER` e `DB_PASS` no `.env`. Teste as credenciais diretamente:

```bash
mysql -u root -p --port=3307
```

### Conexão recusada

```
Error: connect ECONNREFUSED 127.0.0.1:3307
```

**Causas prováveis:**

1. O serviço do MariaDB/MySQL não está rodando.
2. `DB_PORT` está errado. Este projeto usa `3307` por padrão, mas a instalação padrão do MariaDB/MySQL escuta na `3306`.

**Solução:** confirme a porta real do serviço e ajuste o `.env`.

```bash
# Linux
sudo systemctl status mariadb
```

```powershell
# Windows
Get-Service -Name "*mysql*", "*maria*"
```

### Banco inexistente

```
Error: ER_BAD_DB_ERROR: Unknown database 'db_rede_campo_online'
```

**Solução:** crie o banco vazio. As migrations não criam o banco, apenas as tabelas.

```sql
CREATE DATABASE db_rede_campo_online;
```

### Tabela já existe

```
QueryFailedError: Table 'project' already exists
```

**Causa:** o banco tem tabelas criadas fora do controle de migrations, ou a tabela `migrations` foi apagada.

**Solução:** verifique o que já foi aplicado e, em ambiente de desenvolvimento, recrie o banco do zero.

```bash
npm run typeorm -- migration:show -d src/shared/infra/database/data-source.ts
```

```sql
DROP DATABASE db_rede_campo_online;
CREATE DATABASE db_rede_campo_online;
```

> **Nunca** faça `DROP DATABASE` em produção. Lá, faça backup e corrija a migration com uma nova migration.

### Erro de chave estrangeira ao remover

```
QueryFailedError: Cannot delete or update a parent row: a foreign key constraint fails
```

**Causa:** o registro ainda é referenciado por outro. Ex.: excluir um estado que possui cidades, ou uma publicação com contribuidores.

**Solução:** remova primeiro os registros dependentes. Parte das relações já usa `ON DELETE CASCADE` (mídias e filhos de publicação, definidos nas migrations `CascadeDeleteMedia` e `CascadeDeletePublicationChildren`), mas nem todas.

---

## Problemas de inicialização

### Porta já em uso

```
Error: listen EADDRINUSE: address already in use :::3333
```

**Solução:** altere `PORT` no `.env` ou finalize o processo que ocupa a porta.

```bash
# Linux
lsof -ti:3333 | xargs kill -9
```

```powershell
# Windows
Get-NetTCPConnection -LocalPort 3333 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```

### Módulo não encontrado

```
Error: Cannot find module 'express'
```

**Solução:** reinstale as dependências.

```bash
rm -rf node_modules package-lock.json
```

```bash
npm install
```

### Erro de decorators / metadata

```
ColumnTypeUndefinedError: Column type for Entity#field is not defined
```

**Causa:** o `reflect-metadata` não foi importado antes das entidades, ou os decorators estão desabilitados.

**Solução:** confirme que `experimentalDecorators` e `emitDecoratorMetadata` estão `true` no `tsconfig.json` e que `import "reflect-metadata"` aparece no topo de `app.ts` e de `data-source.ts`.

### `sharp` falha ao instalar ou carregar

```
Error: Could not load the "sharp" module using the <plataforma> runtime
```

**Causa:** o `sharp` usa binários nativos, específicos por sistema operacional e arquitetura. Copiar `node_modules` entre máquinas (ex.: Windows → VM Linux) quebra o módulo.

**Solução:** nunca versione nem copie `node_modules`. Rode `npm install` na própria máquina de destino.

```bash
npm rebuild sharp
```

---

## Problemas de autenticação

### `TOKEN_MISSING`

```json
{ "message": "JWT token missing", "code": "TOKEN_MISSING" }
```

**Solução:** envie o header no formato exato `Authorization: Bearer <token>`, com um espaço entre `Bearer` e o token.

### `TOKEN_INVALID`

```json
{ "message": "Invalid JWT token", "code": "TOKEN_INVALID" }
```

**Causas prováveis:**

1. O token expirou (`JWT_EXPIRES_IN`, padrão `1d`). Faça login novamente.
2. O `JWT_SECRET` mudou depois da emissão do token - todos os tokens anteriores se tornam inválidos.
3. Logout já foi feito com esse token: ele está na tabela `token_blacklist`.

### `INVALID_CREDENTIALS`

```json
{ "message": "Invalid credentials", "code": "INVALID_CREDENTIALS" }
```

**Solução:** a mesma resposta cobre e-mail inexistente e senha incorreta, por segurança. Confirme se o membro existe:

```sql
SELECT id, name, email FROM member WHERE email = 'seu@email.com';
```

Para redefinir a senha, gere um hash bcrypt e atualize o registro:

```bash
node -e "console.log(require('bcryptjs').hashSync('nova_senha', 10))"
```

---

## Problemas de CORS e rate limit

### Requisição bloqueada por CORS

```
Access to fetch at 'http://localhost:3333/members' from origin 'http://localhost:5173'
has been blocked by CORS policy
```

**Solução:** inclua a origem do front-end em `CORS_ORIGIN`, separando múltiplas por vírgula. Em desenvolvimento, deixar a variável vazia faz a API refletir a origem da requisição.

### `429 Too Many Requests`

**Causa:** o rate limit foi atingido - 120 requisições por IP a cada 60 segundos, por padrão.

**Solução:** em desenvolvimento, aumente `RATE_LIMIT_MAX`. Em produção, avalie se o valor está adequado antes de aumentar. Se a API está atrás de um proxy e **todas** as requisições parecem vir do mesmo IP, ajuste `TRUST_PROXY` para o número de proxies à frente da API.

---

## Problemas de upload de imagem

### `INVALID_MIME_TYPE` (415)

Apenas JPEG, PNG e WebP são aceitos.

### `FILE_TOO_LARGE` (413)

O limite é 10 MB, definido em `src/shared/infra/http/middlewares/upload.ts`.

### Erro de credenciais do R2

```
CredentialsProviderError / SignatureDoesNotMatch / NoSuchBucket
```

**Solução:** revise as cinco variáveis do R2 no `.env`. Pontos que costumam falhar:

- `R2_ACCOUNT_ID` compõe o endpoint - se estiver errado, a requisição vai para um host inexistente.
- `R2_PUBLIC_URL` **não** pode terminar com barra.
- O token do R2 precisa de permissão de escrita no bucket indicado em `R2_BUCKET_NAME`.

### URLs retornadas não abrem

**Causa:** o bucket não está com acesso público habilitado, ou o domínio configurado em `R2_PUBLIC_URL` não aponta para ele.

**Solução:** habilite o acesso público em Dashboard → R2 → bucket → Settings → Public Access, ou configure um domínio próprio.

---

## Problemas com os scripts de lint e format

```
sh: eslint: command not found
```

**Causa:** os scripts `lint` e `format` existem no `package.json`, mas `eslint` e `prettier` ainda não estão em `devDependencies` nem possuem arquivos de configuração no repositório.

**Solução:** instale e configure as ferramentas - veja [Contribuição](contribuicao.md).

---

## Debug da aplicação

### VS Code

Crie `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug API",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "skipFiles": ["<node_internals>/**"],
      "console": "integratedTerminal"
    }
  ]
}
```

Coloque os breakpoints e execute com `F5`.

### Log de SQL

Com `NODE_ENV` diferente de `production`, o TypeORM imprime todas as queries no console - útil para entender o que um caso de uso está executando de fato. Veja [Estrutura de Logs](estrutura-de-logs.md).

---

# [Voltar ao menu](../README.md)
