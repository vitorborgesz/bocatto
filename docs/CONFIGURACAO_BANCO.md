# Configuração do banco e do ambiente local

Guia passo a passo para rodar o Bocatto em qualquer computador com PostgreSQL
instalado. A visão geral do projeto está no [README](../README.md).

| Peça | Endereço |
|---|---|
| Front-end | http://localhost:4100 |
| API | http://localhost:4444 |
| PostgreSQL | localhost:5432, banco `db-bocatto` |

> **Regra do projeto:** a estrutura do banco é definida **pelas migrations**
> (`api-bocatto/migrations/`).
>
> **Atalho pelo DataGrip:** os scripts em `db-bocatto/sql/` apagam e recriam o
> banco inteiro, já com os dados de teste. Veja a [seção 10](#10-recriar-o-banco-pelo-datagrip-scripts-sql).

---

## 1. Requisitos

| Ferramenta | Versão recomendada | Conferir com |
|---|---|---|
| PostgreSQL | **16** (é a versão usada no desenvolvimento) | `psql --version` |
| Node.js | **20 LTS** (mínimo 20.11) ou 22 LTS | `node -v` |
| npm | o que vem com o Node | `npm -v` |

Instalar o PostgreSQL 16:

- **Ubuntu / WSL:** `sudo apt install postgresql` (o Ubuntu 24.04 já traz a versão 16).
- **Windows (sem WSL):** instalador oficial em https://www.postgresql.org/download/windows/.
  Ele já inclui o `psql`, o `pg_dump` e o `pg_restore`.
- **macOS:** `brew install postgresql@16` ou o Postgres.app.

Para confirmar que o servidor está rodando, use `pg_isready -h localhost -p 5432`.
A resposta esperada é `accepting connections`.

---

## 2. Criar o banco (só na primeira vez)

O Bocatto usa o usuário administrador **`postgres`**, o mesmo dos outros projetos
locais. Só é preciso criar o banco:

```bash
sudo -u postgres psql -c 'CREATE DATABASE "db-bocatto" ENCODING '"'"'UTF8'"'"' TEMPLATE template0;'
# Windows/macOS:  psql -U postgres -c "CREATE DATABASE \"db-bocatto\" ENCODING 'UTF8' TEMPLATE template0;"
```

- O nome `db-bocatto` tem hífen, então **precisa de aspas duplas** no SQL.
- Não crie nenhuma tabela à mão. As migrations fazem isso no passo 5.
- O usuário `postgres` precisa ter uma senha, porque a API conecta por `localhost`
  com senha. Se você não souber qual é, procure no `.env` de outro projeto que
  use o `postgres`. Trocar a senha (`sudo -u postgres psql -c '\password postgres'`)
  quebra os outros projetos até você atualizar o `.env` de cada um.

Para testar o acesso (vai pedir a senha):

```bash
psql -h localhost -p 5432 -U postgres -d db-bocatto -c "select current_database(), current_user;"
```

> **Opcional: usuário exclusivo.** Para isolar o Bocatto dos outros projetos, crie
> um usuário só para ele e use-o no `.env`:
> `CREATE ROLE bocatto LOGIN PASSWORD '...'; ALTER DATABASE "db-bocatto" OWNER TO bocatto;`

---

## 3. Variáveis de ambiente

### API: `api-bocatto/.env`

```bash
cd api-bocatto
cp .env.example .env
```

Abra o `.env` e preencha:

| Variável | Valor |
|---|---|
| `POSTGRES_HOST` | `localhost` |
| `POSTGRES_PORT` | `5432` |
| `POSTGRES_DATABASE` | `db-bocatto` |
| `POSTGRES_USER` | `postgres` |
| `POSTGRES_PASSWORD` | a senha do usuário `postgres` (só no `.env`, nunca no Git) |
| `JWT_SECRET` | uma chave gerada com o comando abaixo (mínimo 32 caracteres) |
| `SEED_SENHA` | senha das contas de demonstração (desenvolvimento: `123456`) |
| `PORT` | `4444` |
| `CORS_ORIGINS` | `http://localhost:4100` |

Para gerar o `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

A API valida tudo ao iniciar. Se faltar uma variável ou ela estiver inválida, a API
não sobe e mostra o nome da variável com problema.

> O `.env` está no `.gitignore` e **nunca vai para o Git**. Só o `.env.example`,
> que não tem segredos, é versionado.

### Front-end: `front-bocatto/.env.local` (opcional)

O front já procura a API em `http://localhost:4444`. Só crie o arquivo se a API
estiver em outro endereço:

```bash
cd front-bocatto
cp .env.example .env.local     # NEXT_PUBLIC_API_URL=http://localhost:4444
```

---

## 4. Instalar as dependências

```bash
cd api-bocatto   && npm ci
cd ../front-bocatto && npm ci
```

O `npm ci` instala exatamente as versões do `package-lock.json`. É o mesmo
resultado em qualquer computador.

---

## 5. Migrations (estrutura do banco)

Rode sempre dentro de `api-bocatto/`:

```bash
npm run db:migrate:status   # lista as migrations: "up" = aplicada, "down" = pendente
npm run db:migrate          # aplica as pendentes, em ordem
```

As migrations aplicadas ficam registradas na tabela `SequelizeMeta`. Rodar
`db:migrate` de novo só aplica as que ainda faltam e nunca recria o que já existe.

O que as migrations criam:

| Tabela | Destaques |
|---|---|
| `usuarios` | e-mail único; `perfil` só aceita `cliente` ou `admin` |
| `categorias` | nome único |
| `produtos` | FK para categorias (RESTRICT); `preco > 0`; índice por categoria |
| `enderecos` | FK para usuarios (CASCADE); índice por usuário |
| `pedidos` | FK para usuarios (RESTRICT); status validado; `total = subtotal + taxa_entrega`; índices por usuário e por status |
| `pedido_itens` | FK para pedidos (CASCADE) e produtos (SET NULL: excluir um produto mantém o item no histórico); quantidade e preço positivos; um produto por pedido; índice por produto |

> ⚠️ `npm run db:migrate:undo` **desfaz** a última migration, e isso pode apagar
> uma tabela com dados. Só use se souber o que está desfazendo.

---

## 6. Seeders (dados de demonstração)

```bash
npm run db:seed
```

O seed cria:
- `admin@bocatto.com` (admin);
- `cliente@bocatto.com` (cliente), com 2 endereços ("Casa" e "Trabalho") e
  3 pedidos de exemplo (entregue, cancelado e em preparo);
- 4 categorias e 12 produtos do cardápio.

As duas contas usam a senha **`123456`** (valor de `SEED_SENHA` no `api-bocatto/.env`).
É uma senha só para desenvolvimento: não use em produção.

Os seeders executados ficam registrados na tabela `SequelizeData`. Rodar
`db:seed` de novo **não duplica** os dados.

Para remover só os dados de demonstração: `npm run db:seed:undo`. Isso apaga
também os pedidos feitos com as contas de demonstração.

---

## 7. Iniciar o projeto

Use dois terminais:

```bash
# Terminal 1 — API (porta 4444, reinicia sozinha ao salvar)
cd api-bocatto
npm run dev
# esperado: "Conectado ao banco de dados." e "API do Bocatto rodando em http://localhost:4444"

# Terminal 2 — Front-end (porta 4100)
cd front-bocatto
npm run dev
```

Depois, abra http://localhost:4100.

---

## 8. Verificar se tudo está conectado

| O quê | Como | Resultado esperado |
|---|---|---|
| Banco acessível | `pg_isready -h localhost -p 5432` | `accepting connections` |
| Migrations aplicadas | `npm run db:migrate:status` (em `api-bocatto/`) | todas como `up` |
| Tabelas criadas | `psql -h localhost -U postgres -d db-bocatto -c '\dt'` | 8 tabelas: as 6 do sistema, mais `SequelizeMeta` e `SequelizeData` |
| API + banco | `curl http://localhost:4444/health` | `{"status":"ok","banco":"ok"}` |
| Cardápio pela API | `curl http://localhost:4444/produtos` | lista com os produtos |
| Front ↔ API | abrir http://localhost:4100 | o cardápio aparece com os produtos |

Se o `/health` responder `503` com `"banco":"indisponível"`, a API está no ar mas
não alcança o banco. Confira as variáveis `POSTGRES_*` do `.env`.

Se o front mostrar "Ops, a cozinha não respondeu", confira se a API está rodando
e se `CORS_ORIGINS` contém `http://localhost:4100`.

---

## 9. Backup e restauração

### Backup completo (estrutura e dados)

```bash
pg_dump -h localhost -U postgres -d db-bocatto -Fc -f bocatto_$(date +%F).dump
```

- `-Fc` usa o formato "custom": é compactado e permite restaurar com o `pg_restore`.
- O arquivo `.dump` contém **dados reais**, como e-mails e hashes de senha.
  **Não coloque no Git.**

### Restaurar em um banco novo

```bash
# 1. criar um banco vazio (como administrador)
sudo -u postgres psql -c 'CREATE DATABASE "db-bocatto" ENCODING '"'"'UTF8'"'"' TEMPLATE template0;'

# 2. restaurar o backup nele
pg_restore -h localhost -U postgres -d db-bocatto --no-owner --no-privileges bocatto_AAAA-MM-DD.dump
```

> Restaure em um banco **vazio**. Restaurar em cima de um banco que já tem as
> tabelas gera erros de "já existe". Para substituir um banco existente é preciso
> apagá-lo antes, o que é irreversível: faça um backup dele primeiro.

### Só a estrutura (sem dados)

```bash
pg_dump -h localhost -U postgres -d db-bocatto --schema-only --no-owner --no-privileges -f bocatto_schema.sql
```

---

## 10. Recriar o banco pelo DataGrip (scripts SQL)

Dois scripts em `db-bocatto/sql/`, para rodar no DataGrip conectado ao banco **db-bocatto**:

| Script | O que faz |
|---|---|
| `01_drop_bocatto.sql` | **Apaga todas as tabelas e todos os dados** do Bocatto. O banco `db-bocatto` continua existindo, vazio. |
| `02_create_bocatto.sql` | Cria todas as tabelas (igual às migrations) e os dados de teste. |

Dados criados pelo `02_create_bocatto.sql`:

| Conta | Perfil | Senha |
|---|---|---|
| `admin@bocatto.com` | admin | `123456` |
| `cliente@bocatto.com` | cliente (2 endereços e 3 pedidos de exemplo) | `123456` |

Também cria 4 categorias e 12 produtos.

Como rodar:
1. No DataGrip, abra um console no data source do PostgreSQL com o banco **db-bocatto** selecionado.
2. Abra `01_drop_bocatto.sql` e execute o script inteiro.
3. Abra `02_create_bocatto.sql` e execute o script inteiro.
4. Reinicie a API (`npm run dev`), se ela estiver rodando.

Os dois scripts:
- só rodam no `db-bocatto`. Conectados em qualquer outro banco, eles param na primeira linha sem mexer em nada;
- rodam numa transação única: se algo falhar no meio, nada é aplicado;
- já preenchem `SequelizeMeta` e `SequelizeData`. Por isso, `npm run db:migrate` e
  `npm run db:seed` depois deles não fazem nada e não duplicam dados.

> ⚠️ Toda migration nova precisa entrar também no `02_create_bocatto.sql`, na
> estrutura e na lista do `SequelizeMeta`. Assim o script continua igual às migrations.
