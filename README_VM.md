# Backend - Instalação e Informações da Infraestrutura

> **Status:** a API ainda não foi implantada. Este documento é o modelo do registro de infraestrutura, a ser preenchido quando a VM da instituição estiver disponível. Todos os campos marcados com `<...>` ainda não têm valor definido.
>
> O procedimento completo de deploy está em [md/deploy.md](md/deploy.md).

---

## Estrutura do Repositório

| Item | Caminho |
| --- | --- |
| **Código-fonte** | `src/` |
| **Migrations (schema e dados iniciais)** | `src/shared/infra/typeorm/migrations` |
| **Requisições de exemplo** | `src/teste.http` |
| **Documentação** | `md/` |

> Este projeto **não** possui scripts SQL avulsos: todo o schema e os dados iniciais são criados pelas migrations do TypeORM.

---

## Instalação Local do Backend

1. **Clone o repositório**

   ```bash
   git clone https://github.com/diegodallaqua/API-rede-campo-online.git
   ```

   ```bash
   cd API-rede-campo-online
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Configure o ambiente**

   ```bash
   cp .env.example .env
   ```

   Edite o `.env` com as informações do banco local. Detalhes de cada variável em [md/configuracao.md](md/configuracao.md).

4. **Crie o banco e execute as migrations**

   ```sql
   CREATE DATABASE db_rede_campo_online;
   ```

   ```bash
   npm run migration:run
   ```

5. **Rode o servidor**

   ```bash
   npm run dev
   ```

6. **Verifique**

   ```bash
   curl http://192.168.0.131:3333/health
   ```

---

## Banco de Dados

- **SGBD:** MariaDB (driver `mariadb` do TypeORM; compatível com MySQL 8.0)
- **Banco local padrão:** `db_rede_campo_online`
- **Porta padrão no `.env.example`:** `3307` (a instalação padrão do MariaDB usa `3306` - confirme a porta do seu serviço)
- **Schema:** criado exclusivamente por migrations. `synchronize` está desligado
- **Dados iniciais:** inseridos pela migration `20260615000000-SeedInitialData.ts` - estados, cidades, áreas de pesquisa, tipos de projeto, papéis de membro, uma organização, um endereço e um membro administrador

### Credenciais de login

O membro administrador criado pelo seed usa o e-mail `amatte@utfpr.edu.br`. A senha é armazenada apenas como hash bcrypt e **não** consta no repositório.

Para definir uma senha nova:

```bash
node -e "console.log(require('bcryptjs').hashSync('SUA_SENHA', 10))"
```

```sql
UPDATE member SET password = '<hash_gerado>' WHERE id = 6;
```

---

## Informações da VM

*A preencher quando a VM for provisionada.*

| Item | Versão / Valor |
| --- | --- |
| **Endereço / Host** | `<...>` |
| **SO** | `<...>` |
| **Node.js** | `<...>` (mínimo: 18.x) |
| **MariaDB / MySQL** | `<...>` |
| **Porta do banco** | `<...>` |
| **PM2** | `<...>` |
| **Servidor web** | `<Nginx ou Apache>` |

> Senhas e credenciais **não** devem ser registradas neste arquivo - ele é versionado. Mantenha-as no `.env` da VM (com `chmod 600`) ou em um gerenciador de segredos.

---

## Localização do Backend na VM

*Estrutura planejada - ver [md/deploy.md](md/deploy.md).*

| Ambiente | Caminho | Banco | Processo PM2 |
| --- | --- | --- | --- |
| **Prod** | `/srv/API-rede-campo-online` | `db_rede_campo_prod` | `rede-campo-api` |
| **Dev** | `/srv/API-rede-campo-online_dev` | `db_rede_campo_dev` | `rede-campo-api-dev` |

Cada diretório possui o próprio `.env` e o próprio arquivo de configuração do PM2 (`ecosystem.config.yml`).

> O PM2 mantém o processo da API ativo, reinicia automaticamente em caso de falha e gerencia os logs.

---

## Comandos PM2

```bash
# Status de todos os processos
pm2 status
```

```bash
# Logs
pm2 logs rede-campo-api
pm2 logs rede-campo-api-dev
```

```bash
# Reiniciar
pm2 restart rede-campo-api
pm2 restart rede-campo-api-dev
```

```bash
# Parar
pm2 stop rede-campo-api
pm2 stop rede-campo-api-dev
```

```bash
# Monitorar recursos
pm2 monit
```

Detalhes sobre logs e rotação em [md/estrutura-de-logs.md](md/estrutura-de-logs.md).

---

## Sites (Front-end)

*Estrutura planejada.*

Os sites ficam em:

```
/var/www/html/
```

Divididos em:

- `/var/www/html/prod`
- `/var/www/html/dev`

### Configuração do servidor web

**Apache:**

```bash
sudo nano /etc/apache2/sites-available/000-default.conf
```

```bash
# Configuração de portas, caso sejam alteradas
sudo nano /etc/apache2/ports.conf
```

**Nginx:**

```bash
sudo nano /etc/nginx/sites-available/default
```

As configurações de proxy reverso para a API estão em [md/deploy.md](md/deploy.md).

---

## Armazenamento de Imagens

As imagens **não** são gravadas no disco da VM. O módulo `/images` envia os arquivos para o **Cloudflare R2**, que também os serve publicamente.

| Item | Valor |
| --- | --- |
| **Provedor** | Cloudflare R2 (API compatível com S3) |
| **Bucket de produção** | `<...>` |
| **URL pública** | `<...>` |
| **Variantes geradas** | `small` (320 px), `medium` (800 px), `large` (1920 px), todas em WebP |

As credenciais ficam nas variáveis `R2_*` do `.env`. Veja [md/configuracao.md](md/configuracao.md).

---

## Bancos de Dados na VM

*A preencher.*

| Ambiente | Banco |
| --- | --- |
| **Prod** | `db_rede_campo_prod` |
| **Dev** | `db_rede_campo_dev` |

---

## Documentação relacionada

- [Instalação](md/instalacao.md)
- [Configuração](md/configuracao.md)
- [Como Executar](md/como-executar.md)
- [Deploy](md/deploy.md)
- [Estrutura de Logs](md/estrutura-de-logs.md)
- [Erros comuns](md/erros.md)
