### [Voltar ao menu](../README.md)

# Deploy

> **Status:** a API ainda não está hospedada. Este documento descreve o procedimento planejado para o deploy na VM da instituição. Os valores marcados com `<...>` devem ser preenchidos quando a VM estiver disponível, e o [README_VM](../README_VM.md) deve ser atualizado com os dados reais do ambiente.

---

## Ambiente de produção recomendado

| Item | Versão mínima |
| --- | --- |
| Sistema operacional | Ubuntu 20.04 LTS ou superior |
| Node.js | 18.x |
| MariaDB | 10.6 (ou MySQL 8.0) |
| PM2 | 5.x |
| Servidor web | Nginx ou Apache, como proxy reverso |

### Preparação da VM

```bash
sudo apt update && sudo apt upgrade -y
```

```bash
# Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

```bash
# MariaDB
sudo apt install -y mariadb-server
sudo mysql_secure_installation
```

```bash
# PM2, global
sudo npm install -g pm2
```

---

## Estrutura de diretórios planejada

| Ambiente | Caminho | Banco de dados | Processo PM2 |
| --- | --- | --- | --- |
| **Produção** | `/srv/API-rede-campo-online` | `db_rede_campo_prod` | `rede-campo-api` |
| **Desenvolvimento** | `/srv/API-rede-campo-online_dev` | `db_rede_campo_dev` | `rede-campo-api-dev` |

Cada diretório mantém o próprio `.env` e o próprio `ecosystem.config.yml`.

O front-end fica sob `/var/www/html/`, separado por ambiente:

```
/var/www/html/prod
/var/www/html/dev
```

---

## Procedimento de deploy

### 1. Clonar o repositório

```bash
sudo mkdir -p /srv && cd /srv
```

```bash
sudo git clone https://github.com/diegodallaqua/API-rede-campo-online.git
```

### 2. Instalar as dependências

```bash
cd /srv/API-rede-campo-online && npm ci --omit=dev
```

> Use `npm ci`, não `npm install`: ele respeita exatamente o `package-lock.json`. E **nunca** copie a pasta `node_modules` de outra máquina - o `sharp` usa binários nativos, específicos por sistema operacional.
>
> A compilação (`npm run build`) precisa do `typescript`, que está em `dependencies` neste projeto, então `--omit=dev` não a impede.

### 3. Criar o banco de dados

```sql
CREATE DATABASE db_rede_campo_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'rede_campo'@'localhost' IDENTIFIED BY '<senha_forte>';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, INDEX, REFERENCES ON db_rede_campo_prod.* TO 'rede_campo'@'localhost';
FLUSH PRIVILEGES;
```

> Use um usuário dedicado, nunca o `root`. Os privilégios de DDL (`CREATE`, `ALTER`, `DROP`, `INDEX`, `REFERENCES`) são necessários porque as migrations do TypeORM criam e alteram tabelas.

### 4. Configurar o `.env`

```bash
cp .env.example .env && nano .env
```

Valores de produção:

```
NODE_ENV=production
PORT=3333

DB_HOST=localhost
DB_PORT=3306
DB_USER=rede_campo
DB_PASS=<senha_forte>
DB_NAME=db_rede_campo_prod

JWT_SECRET=<segredo_gerado_exclusivo_para_producao>
JWT_EXPIRES_IN=1d

CORS_ORIGIN=https://<dominio_do_front>
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=120

TRUST_PROXY=1

R2_ACCOUNT_ID=<...>
R2_ACCESS_KEY_ID=<...>
R2_SECRET_ACCESS_KEY=<...>
R2_BUCKET_NAME=<...>
R2_PUBLIC_URL=https://<dominio_ou_url_r2>
```

Gere o segredo do JWT:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Restrinja a leitura do arquivo:

```bash
chmod 600 .env
```

> `DB_PORT` acima é `3306`, a porta padrão de uma instalação nova. O padrão do projeto (`3307`) reflete o ambiente de desenvolvimento local. Confirme a porta real da VM.

### 5. Compilar e migrar

```bash
npm run build
```

```bash
npm run migration:run
```

> Faça backup do banco antes de rodar migrations em produção.

### 6. Configurar o PM2

Crie `ecosystem.config.yml` na raiz do projeto:

```yaml
apps:
  - name: rede-campo-api
    script: dist/server.js
    cwd: /srv/API-rede-campo-online
    instances: 1
    exec_mode: fork
    autorestart: true
    max_memory_restart: 500M
    env:
      NODE_ENV: production
```

Inicie a aplicação:

```bash
pm2 start ecosystem.config.yml
```

```bash
# Salva a lista de processos para restaurar após reboot
pm2 save
```

```bash
# Gera e instala o serviço de inicialização automática
pm2 startup
```

O comando `pm2 startup` imprime uma linha `sudo env PATH=...` que precisa ser executada para concluir a instalação.

### 7. Configurar o proxy reverso

#### Nginx

```nginx
server {
    listen 80;
    server_name <dominio_da_api>;

    location / {
        proxy_pass http://192.168.0.131:3333;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # O upload de imagem aceita arquivos de até 10 MB
        client_max_body_size 12M;
    }
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
```

#### Apache

Se a VM já usa Apache para servir o front-end, habilite os módulos de proxy:

```bash
sudo a2enmod proxy proxy_http headers
```

E adicione ao virtual host em `/etc/apache2/sites-available/000-default.conf`:

```apache
<VirtualHost *:80>
    ServerName <dominio_da_api>

    ProxyPreserveHost On
    ProxyPass        / http://192.168.0.131:3333/
    ProxyPassReverse / http://192.168.0.131:3333/

    RequestHeader set X-Forwarded-Proto "http"
</VirtualHost>
```

```bash
sudo apachectl configtest && sudo systemctl reload apache2
```

Se as portas forem alteradas, ajuste também `/etc/apache2/ports.conf`.

> Com proxy reverso à frente, `TRUST_PROXY=1` é obrigatório - sem isso, o rate limit enxerga todas as requisições vindo do IP do proxy e bloqueia todo mundo de uma vez.

### 8. Verificar

```bash
curl http://192.168.0.131:3333/health
```

```bash
curl http://<dominio_da_api>/health
```

Ambos devem responder `{"ok":true}`.

```bash
pm2 status
```

```bash
pm2 logs rede-campo-api --lines 50
```

---

## Atualização de uma versão já implantada

```bash
cd /srv/API-rede-campo-online
```

```bash
git pull origin main
```

```bash
npm ci --omit=dev
```

```bash
npm run build
```

```bash
npm run migration:run
```

```bash
pm2 restart rede-campo-api
```

Faça backup do banco antes de qualquer atualização que inclua migrations:

```bash
mysqldump -u rede_campo -p db_rede_campo_prod > backup-$(date +%F).sql
```

---

## HTTPS

Com um domínio apontado para a VM, use o Certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

```bash
sudo certbot --nginx -d <dominio_da_api>
```

Para Apache, troque `python3-certbot-nginx` por `python3-certbot-apache` e `--nginx` por `--apache`. A renovação é automática via timer do systemd.

---

## Checklist de segurança para produção

- [ ] `NODE_ENV=production` (desliga o log de SQL e a exposição do stack trace)
- [ ] `JWT_SECRET` forte e diferente do usado em desenvolvimento
- [ ] `CORS_ORIGIN` com a lista explícita de domínios, nunca vazio
- [ ] `TRUST_PROXY` igual ao número real de proxies
- [ ] Usuário de banco dedicado, sem privilégios de administrador
- [ ] `.env` com `chmod 600`, fora do controle de versão
- [ ] Firewall permitindo apenas as portas necessárias (`ufw allow 80,443/tcp`); a porta 3333 não deve ser exposta externamente
- [ ] HTTPS configurado
- [ ] Rotação de logs do PM2 ativa - veja [Estrutura de Logs](estrutura-de-logs.md)
- [ ] Rotina de backup do banco definida
- [ ] Senha do membro administrador alterada em relação ao valor do seed

---

# [Voltar ao menu](../README.md)
