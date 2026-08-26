# API Rede Campo Online

API da plataforma **Rede Campo Online**, um site responsivo voltado ao grupo de pesquisa Rede Campo. Sistema RESTful desenvolvido em Node.js com TypeScript, usando Express e TypeORM para persistência em MariaDB/MySQL.

## Documentação

Consulte para detalhes completos:

>- [Instalação](md/instalacao.md): Pré-requisitos e instalação local
>- [Configuração](md/configuracao.md): Variáveis de ambiente e banco de dados
>- [Como Executar](md/como-executar.md): Execução em dev e produção, scripts npm
>- [Arquitetura do Projeto](md/arquitetura-do-projeto.md): Padrão modular, DDD, Clean Architecture
>- [Estrutura do Projeto](md/estrutura-do-projeto.md): Estrutura de diretórios e arquivos
>- [Sistema de Autenticação](md/sistema-de-autenticacao.md): JWT, blacklist de tokens, senhas
>- [Documentação da API](md/documentacao-da-api.md): Referência dos endpoints
>- [Erros comuns](md/erros.md): Troubleshooting
>- [Estrutura de Logs](md/estrutura-de-logs.md): Logs, PM2, boas práticas
>- [Contribuição](md/contribuicao.md): Padrões de código, commits, versionamento
>- [Deploy](md/deploy.md): Produção, PM2, proxy reverso, segurança
>- [Infraestrutura da VM](README_VM.md): Informações do ambiente hospedado

## Principais Características

- **Arquitetura Modular**: Domain-Driven Design (DDD) e Clean Architecture
- **RESTful API**: Endpoints organizados por domínio
- **TypeScript**: Tipagem forte (`strict`) e manutenção facilitada
- **MariaDB/MySQL**: Persistência relacional, schema versionado por migrations
- **JWT Authentication**: Tokens de acesso com blacklist no logout
- **TSyringe**: Injeção de dependências
- **Celebrate/Joi**: Validação declarada nas rotas
- **Cloudflare R2**: Armazenamento de imagens, com variantes WebP geradas pelo Sharp
- **Helmet, CORS e rate limit**: Camada de segurança HTTP

---

## Instalação Rápida

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
   # Edite o .env conforme seu ambiente
   ```

4. **Banco de dados:**

   ```sql
   CREATE DATABASE db_rede_campo_online;
   ```

   ```bash
   npm run migration:run
   ```

5. **Execute em desenvolvimento:**

   ```bash
   npm run dev
   ```

6. **Verifique:** `GET /health` deve responder `{ "ok": true }`.

Para detalhes, consulte [Instalação](md/instalacao.md) e [Configuração](md/configuracao.md).

---

## Recursos disponíveis

A API expõe um health check em `GET /health` e os seguintes recursos:

- `/sessions` - autenticação (login e logout)
- `/states`, `/cities`, `/addresses` - localização
- `/organizations`, `/member-roles`, `/members` - membros e organizações
- `/project-types`, `/projects`, `/project-media` - projetos
- `/events`, `/event-media` - eventos
- `/news`, `/news-media` - notícias
- `/research-areas` - áreas de pesquisa
- `/publications`, `/external-authors`, `/contributor-role`, `/publication-contributors` - publicações e contribuidores
- `/articles`, `/thesis`, `/books`, `/book-chapters` - tipos de publicação
- `/images` - upload de imagens (Cloudflare R2)

Em regra, a leitura é pública e a escrita exige autenticação via JWT (`Authorization: Bearer <token>`). As exceções e os parâmetros de cada endpoint estão em [Documentação da API](md/documentacao-da-api.md).

---

**© 2026 API Rede Campo Online** - Backend do site do grupo de pesquisa Rede Campo, desenvolvido com Node.js, TypeScript e arquitetura modular.
