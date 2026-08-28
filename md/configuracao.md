### [Voltar ao menu](../README.md)

# Configuração

Toda a configuração da API vem de variáveis de ambiente, carregadas com `dotenv` a partir do arquivo `.env` na raiz do projeto. Use o [`.env.example`](../.env.example) como base.

```bash
cp .env.example .env
```

> O `.env` está no `.gitignore` e **nunca** deve ser commitado. O `.env.example` deve conter apenas chaves vazias ou valores de exemplo, jamais credenciais reais.

---

## Variáveis de ambiente

### Aplicação

| Variável | Obrigatória | Padrão | Descrição |
| --- | --- | --- | --- |
| `NODE_ENV` | Não | - | `development` habilita o log de SQL do TypeORM e a exposição do `stack` nas respostas de erro 500. Use `production` no servidor |
| `PORT` | Não | `3333` | Porta em que o servidor Express escuta |

### Banco de dados

| Variável | Obrigatória | Padrão | Descrição |
| --- | --- | --- | --- |
| `DB_HOST` | Não | `192.168.0.131` | Host do MariaDB/MySQL |
| `DB_PORT` | Não | `3307` | Porta do banco. A instalação padrão do MariaDB/MySQL usa `3306` |
| `DB_USER` | Não | `root` | Usuário do banco |
| `DB_PASS` | Não | vazio | Senha do banco |
| `DB_NAME` | Não | `db_rede_campo_online` | Nome do banco |

O data source (`src/shared/infra/database/data-source.ts`) usa o driver `mariadb`, com `synchronize: false` - o schema é sempre controlado por migrations.

### Autenticação

| Variável | Obrigatória | Padrão | Descrição |
| --- | --- | --- | --- |
| `JWT_SECRET` | **Sim em produção** | `fallback_dev_secret_change_me` | Chave usada para assinar e verificar os tokens JWT |
| `JWT_EXPIRES_IN` | Não | `1d` | Tempo de expiração do token (formato aceito pelo `jsonwebtoken`: `1d`, `12h`, `3600`) |

> O valor padrão do `JWT_SECRET` existe apenas para não quebrar o ambiente local. **Defina um segredo forte e exclusivo em produção** - qualquer pessoa que conheça o segredo consegue forjar tokens válidos.
>
> Para gerar um segredo:
>
> ```bash
> node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
> ```

### CORS e rate limit

| Variável | Obrigatória | Padrão | Descrição |
| --- | --- | --- | --- |
| `CORS_ORIGIN` | Não | vazio | Lista de origens permitidas, separadas por vírgula. Vazio reflete a origem da requisição - comportamento esperado apenas em desenvolvimento |
| `RATE_LIMIT_WINDOW_MS` | Não | `60000` | Janela de tempo do rate limit, em milissegundos |
| `RATE_LIMIT_MAX` | Não | `120` | Número máximo de requisições por IP dentro da janela |

Exemplo em produção:

```
CORS_ORIGIN=https://redecampo.exemplo.br,https://www.redecampo.exemplo.br
```

### Proxy reverso

| Variável | Obrigatória | Padrão | Descrição |
| --- | --- | --- | --- |
| `TRUST_PROXY` | Não | `0` | Número de proxies reversos à frente da API |

- `0` - execução local, sem proxy. O rate limit usa o IP real da conexão e ignora o header `X-Forwarded-For`.
- `1` - API atrás de um único proxy (Nginx, Apache, Railway). Necessário para que o rate limit e os logs enxerguem o IP real do cliente.

> Definir `TRUST_PROXY` maior do que o número real de proxies permite que um cliente falsifique o próprio IP via `X-Forwarded-For` e escape do rate limit.

### Cloudflare R2 (upload de imagens)

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `R2_ACCOUNT_ID` | Sim, para usar `/images` | Dashboard → R2 → Account ID |
| `R2_ACCESS_KEY_ID` | Sim, para usar `/images` | Dashboard → R2 → Manage R2 API Tokens → Create Token |
| `R2_SECRET_ACCESS_KEY` | Sim, para usar `/images` | Gerado junto com o Access Key ID e exibido apenas uma vez |
| `R2_BUCKET_NAME` | Sim, para usar `/images` | Nome do bucket |
| `R2_PUBLIC_URL` | Sim, para usar `/images` | URL pública base, **sem barra no final**. Domínio próprio (`https://cdn.exemplo.br`) ou a URL `r2.dev` habilitada em Settings → Public Access |

O restante da API funciona normalmente sem essas variáveis; apenas as rotas de `/images` falham.

---

## Banco de dados

### Criação

```sql
CREATE DATABASE db_rede_campo_online;
```

### Migrations

O schema é criado e versionado exclusivamente por migrations, localizadas em `src/shared/infra/typeorm/migrations`:

```bash
npm run migration:run
```

A última migration (`20260615000000-SeedInitialData.ts`) popula os dados iniciais e é idempotente: verifica se cada registro já existe antes de inserir.

Veja [Como Executar](como-executar.md) para os demais comandos de migration.

---

## Checklist de configuração para produção

- [ ] `NODE_ENV=production`
- [ ] `JWT_SECRET` forte, exclusivo e diferente do usado em desenvolvimento
- [ ] `CORS_ORIGIN` com a lista explícita de domínios do front-end
- [ ] `TRUST_PROXY` igual ao número real de proxies à frente da API
- [ ] Usuário de banco dedicado, sem privilégios de administrador
- [ ] Credenciais do R2 com permissão restrita ao bucket do projeto
- [ ] `.env` fora do controle de versão e com permissão de leitura restrita

---

# [Voltar ao menu](../README.md)
