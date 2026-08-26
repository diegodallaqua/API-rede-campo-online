### [Voltar ao menu](../README.md)

# Sistema de Autenticação

A autenticação é feita com **JWT (JSON Web Tokens)**, configurado em `src/config/auth.ts` a partir das variáveis `JWT_SECRET` e `JWT_EXPIRES_IN`.

Os usuários do sistema são os próprios **membros** (`member`): a entidade `Member` guarda `email` e `password` (hash bcrypt), além dos dados de perfil.

---

## Login

**`POST /sessions`** - rota pública.

Requisição:

```json
{
  "email": "membro@utfpr.edu.br",
  "password": "sua_senha"
}
```

Fluxo, em `AuthenticateMemberUseCase`:

1. O e-mail é normalizado (`trim` + minúsculas).
2. O membro é buscado pelo e-mail, incluindo o campo `password` (normalmente omitido nas consultas).
3. A senha é comparada com o hash usando `bcryptjs.compare`.
4. Em caso de sucesso, um token é assinado com `subject` igual ao id do membro e os claims `role_id` e `organization_id`.

Resposta:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 6,
    "name": "Nome do Membro",
    "email": "membro@utfpr.edu.br",
    "member_role": { "id": 1, "name": "Fundador" },
    "organization": { "id": 1, "name": "UTFPR", "logo": "", "address_id": 1 }
  }
}
```

> Tanto o e-mail inexistente quanto a senha incorreta retornam a mesma resposta - `401` com código `INVALID_CREDENTIALS`. Isso é intencional: evita revelar quais e-mails estão cadastrados.

---

## Uso do token

Envie o token no header `Authorization` em todas as rotas protegidas:

```
Authorization: Bearer <token>
```

Payload do token:

| Claim | Conteúdo |
| --- | --- |
| `sub` | Id do membro, como string |
| `role_id` | Id do papel do membro (`member_role`) |
| `organization_id` | Id da organização do membro |
| `iat` / `exp` | Emissão e expiração, conforme `JWT_EXPIRES_IN` |

---

## Middleware `isAuthenticated`

Localizado em `src/shared/infra/http/middlewares/isAuthenticated.ts`, executa em ordem:

1. Verifica a presença do header `Authorization` → `401 TOKEN_MISSING` se ausente.
2. Extrai o token depois do prefixo `Bearer` → `401 TOKEN_MISSING` se vazio.
3. Verifica a assinatura e a expiração com `jwt.verify` → `401 TOKEN_INVALID` se falhar.
4. Calcula o hash SHA-256 do token e consulta a tabela `token_blacklist` → `401 TOKEN_INVALID` se estiver na lista.
5. Injeta `req.user = { id, role_id, organization_id }` e segue para o próximo middleware.

### Rotas protegidas

O padrão adotado é declarar as rotas públicas primeiro e, em seguida, aplicar `router.use(isAuthenticated)` - tudo que vier depois exige token:

```ts
// leitura pública
projectsRoutes.get("/", celebrate({ ... }), listController.handle);
projectsRoutes.get("/:id/publications", celebrate({ ... }), listPublicationsController.handle);

// a partir daqui, exige autenticação
projectsRoutes.use(isAuthenticated);

projectsRoutes.post("/", celebrate({ ... }), createController.handle);
```

Em regra: **leitura (`GET`) é pública, escrita (`POST`, `PUT`, `DELETE`) exige token.** As exceções são:

- **`/organizations`** - todo o router exige autenticação, inclusive o `GET`.
- **`/images`** - todo o router exige autenticação.
- **`/member-roles`, `/project-types`, `/contributor-role`, `/research-areas`** - apenas leitura pública, sem rotas de escrita.

A lista completa está em [Documentação da API](documentacao-da-api.md).

---

## Logout e blacklist de tokens

**`DELETE /sessions`** - exige autenticação.

Um JWT não pode ser "apagado" no servidor: enquanto não expirar, continua válido. Para permitir a invalidação imediata, o projeto mantém a tabela `token_blacklist`.

Fluxo, em `LogoutUseCase`:

1. O token é decodificado (sem re-verificar a assinatura, já validada pelo middleware) para obter o `exp`.
2. O hash SHA-256 do token é gravado com a data de expiração. Se o `exp` estiver ausente, assume-se 24 horas.
3. Os registros já expirados são removidos da tabela - a limpeza acontece a cada logout, sem necessidade de rotina agendada.

Estrutura da tabela (`TokenBlacklist`):

| Coluna | Tipo | Descrição |
| --- | --- | --- |
| `id` | int, PK | Identificador |
| `token_hash` | varchar(64), único | SHA-256 do token - o token em si nunca é armazenado |
| `expires_at` | datetime | Momento em que o token expiraria naturalmente |
| `created_at` | datetime | Momento do logout |

> Armazenar o hash em vez do token evita que um vazamento do banco entregue tokens ainda válidos.

---

## Senhas

- Armazenadas apenas como hash **bcrypt** (`bcryptjs`), nunca em texto plano.
- A comparação usa `compare`, resistente a ataques de temporização.
- O campo `password` não é retornado nas consultas comuns de membro; a autenticação usa um método específico (`findByEmailWithPassword`).
- A validação exige senha entre 8 e 100 caracteres no login.

Para gerar um hash manualmente (ex.: redefinir a senha de um membro direto no banco):

```bash
node -e "console.log(require('bcryptjs').hashSync('nova_senha', 10))"
```

---

## Códigos de erro de autenticação

| Código | Status | Situação |
| --- | --- | --- |
| `TOKEN_MISSING` | 401 | Header `Authorization` ausente ou sem token após o `Bearer` |
| `TOKEN_INVALID` | 401 | Assinatura inválida, token expirado ou presente na blacklist |
| `INVALID_CREDENTIALS` | 401 | E-mail não encontrado ou senha incorreta |

---

## Limitações conhecidas

- **Não há refresh token.** Quando o token expira (`JWT_EXPIRES_IN`, padrão `1d`), é necessário fazer login novamente.
- **Não há autorização por papel.** O `role_id` viaja no token e fica disponível em `req.user`, mas nenhuma rota restringe o acesso com base nele: qualquer membro autenticado pode executar qualquer operação de escrita.
- **Não há fluxo de recuperação de senha.** A redefinição precisa ser feita manualmente no banco.

---

# [Voltar ao menu](../README.md)
