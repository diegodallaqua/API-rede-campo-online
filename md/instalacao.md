### [Voltar ao menu](../README.md)

# Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- **Node.js** (versão 18.x ou superior)
- **npm** (versão 9.x ou superior)
- **MariaDB** (10.6+) ou **MySQL** (8.0+)
- **Git** para controle de versão
- Uma conta **Cloudflare R2** (necessária apenas para o módulo de upload de imagens)

> O TypeScript é instalado como dependência do projeto, não é necessário instalá-lo globalmente.

---

# Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/diegodallaqua/API-rede-campo-online.git
   ```

   ```bash
   cd API-rede-campo-online
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure o ambiente:**

   ```bash
   cp .env.example .env
   ```

   Edite o arquivo `.env` conforme o ambiente local. Os detalhes de cada variável estão em [Configuração](configuracao.md).

   Valores sugeridos para desenvolvimento:

   | Variável | Valor de desenvolvimento |
   | --- | --- |
   | `NODE_ENV` | `development` |
   | `PORT` | `3333` |
   | `DB_HOST` | `localhost` |
   | `DB_PORT` | `3307` (a instalação padrão do MariaDB/MySQL usa `3306`) |
   | `DB_USER` | `root` |
   | `DB_NAME` | `db_rede_campo_online` |
   | `DB_PASS` | senha do seu MariaDB local |
   | `JWT_SECRET` | qualquer string longa e aleatória |
   | `TRUST_PROXY` | `0` |

4. **Crie o banco de dados vazio:**

   ```sql
   CREATE DATABASE db_rede_campo_online;
   ```

   O nome do banco deve ser o mesmo definido em `DB_NAME`. As tabelas **não** devem ser criadas manualmente - elas são geradas pelas migrations.

5. **Execute as migrations:**

   ```bash
   npm run migration:run
   ```

   As migrations criam todo o schema e, na última delas (`SeedInitialData`), inserem os dados iniciais: estados, cidades, áreas de pesquisa, tipos de projeto, papéis de membro, uma organização, um endereço e um membro administrador.

6. **Rode o servidor:**

   ```bash
   npm run dev
   ```

7. **Verifique se subiu:**

   ```bash
   curl http://192.168.0.131:3333/health
   ```

   A resposta esperada é `{"ok":true}`.

---

## Credenciais iniciais

O membro administrador é criado pela migration `20260615000000-SeedInitialData.ts` com a senha já em hash bcrypt. O e-mail cadastrado é `amatte@utfpr.edu.br`.

> A senha em texto plano **não** fica registrada no repositório. Se você não a possui, gere um novo hash e atualize o registro:
>
> ```bash
> node -e "console.log(require('bcryptjs').hashSync('SUA_SENHA', 10))"
> ```
>
> ```sql
> UPDATE member SET password = '<hash_gerado>' WHERE id = 6;
> ```

Autentique-se em `POST /sessions` para obter o token JWT. Veja [Sistema de Autenticação](sistema-de-autenticacao.md).

---

## Arquivo de requisições de exemplo

O arquivo [`src/teste.http`](../src/teste.http) contém requisições prontas (login, logout, upload de imagem, CRUDs) apontadas para o ambiente local. Ele pode ser executado pela extensão **REST Client** do VS Code.

> Confira a porta usada no `teste.http`: ela precisa ser a mesma definida em `PORT` no seu `.env`.

Para os detalhes de cada variável de ambiente, veja [Configuração](configuracao.md).

---

# [Voltar ao menu](../README.md)
