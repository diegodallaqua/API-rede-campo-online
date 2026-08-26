### [Voltar ao menu](../README.md)

# Estrutura de Logs

## O que é registrado hoje

A API não usa biblioteca de logging: tudo é escrito no `stdout`/`stderr` via `console`. São três origens:

| Origem | Onde | Conteúdo |
| --- | --- | --- |
| **Inicialização** | `src/server.ts` | `[api] running on port <porta>` quando o servidor sobe, ou `[api] failed to start` seguido do erro, antes de encerrar com código 1 |
| **Erros inesperados** | `errorHandler.ts` | `[ErrorHandler]` seguido do objeto de erro completo, com stack trace |
| **SQL** | TypeORM (`data-source.ts`) | Todas as queries executadas - ativo apenas quando `NODE_ENV` **não** é `production` |

Erros de validação (celebrate) e `AppError` **não** são registrados: são situações previstas, respondidas ao cliente com status e código próprios. Só o que cai no 500 chega ao log.

> **Não há log de auditoria.** A API não registra quem fez qual operação. Se a rastreabilidade de ações se tornar um requisito, será necessário adicionar um middleware para isso.

---

## Visualização em desenvolvimento

```bash
npm run dev
```

Os logs aparecem direto no terminal, incluindo o SQL de cada consulta.

```bash
# Filtrar apenas os erros
npm run dev 2>&1 | grep ErrorHandler
```

> O log de SQL é bastante verboso. Para silenciá-lo temporariamente sem mudar o código, rode com `NODE_ENV=production` - atenção: isso também deixa de expor o `stack` nas respostas 500.

---

## Visualização em produção (PM2)

Em produção, o PM2 captura o `stdout` e o `stderr` do processo e os grava em arquivo. A configuração do PM2 está em [Deploy](deploy.md).

```bash
# Logs em tempo real
pm2 logs rede-campo-api
```

```bash
# Últimas 100 linhas
pm2 logs rede-campo-api --lines 100
```

```bash
# Apenas erros
pm2 logs rede-campo-api --err
```

```bash
# Filtrar por conteúdo
pm2 logs rede-campo-api --lines 500 | grep ErrorHandler
```

```bash
# Exportar para arquivo
pm2 logs rede-campo-api --lines 1000 --nostream > logs.txt
```

```bash
# Monitoramento de CPU e memória em tempo real
pm2 monit
```

### Localização dos arquivos

Por padrão, o PM2 grava em `~/.pm2/logs/`:

```
~/.pm2/logs/rede-campo-api-out.log     # stdout
~/.pm2/logs/rede-campo-api-error.log   # stderr
```

Os caminhos podem ser redefinidos no `ecosystem.config.yml` com `out_file` e `error_file`.

### Rotação de logs

Sem rotação, os arquivos crescem indefinidamente e podem encher o disco da VM. Instale o módulo de rotação:

```bash
pm2 install pm2-logrotate
```

```bash
pm2 set pm2-logrotate:max_size 10M
```

```bash
pm2 set pm2-logrotate:retain 14
```

```bash
pm2 set pm2-logrotate:compress true
```

Isso mantém arquivos de no máximo 10 MB, guarda os 14 mais recentes e comprime os antigos.

### Limpar os logs

```bash
pm2 flush
```

---

## Boas práticas

- **Nunca registre dados sensíveis.** Senhas, hashes, tokens JWT e credenciais do R2 não devem aparecer em log. Ao adicionar um `console.log` de depuração em um caso de uso de autenticação, verifique o que está sendo impresso antes de commitar.
- **Desligue o log de SQL em produção.** Manter `NODE_ENV=production` já faz isso: o volume seria enorme e as queries podem conter dados pessoais.
- **Prefixe as mensagens.** O padrão do projeto é `[contexto]` no início da linha (`[api]`, `[ErrorHandler]`), o que facilita filtrar com `grep`.
- **Inclua contexto útil.** Ao registrar um erro, o método HTTP, a rota e o id do recurso encurtam muito a investigação.
- **Configure a rotação antes de colocar em produção.** É a causa mais comum de disco cheio em VM.
- **Monitore o processo.** `pm2 monit` mostra consumo de recursos e número de restarts; restarts frequentes indicam crash em loop.

---

## Possíveis evoluções

Se o volume de logs crescer, vale considerar:

- Uma biblioteca de logging estruturado (`pino`, `winston`), com níveis (`info`, `warn`, `error`) e saída em JSON.
- Um middleware de log de requisições (`morgan` ou equivalente), registrando método, rota, status e tempo de resposta.
- Um id de correlação por requisição, propagado aos logs para rastrear o caminho completo de uma chamada.
- Um middleware de auditoria gravando em tabela quem executou cada operação de escrita - usando o `req.user` que o `isAuthenticated` já injeta.

---

# [Voltar ao menu](../README.md)
