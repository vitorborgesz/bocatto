# Bocatto

Plataforma de delivery que conecta clientes a restaurantes e permite explorar cardápios,
realizar pedidos e acompanhar seu andamento.

Projeto acadêmico da disciplina de Desenvolvimento de Aplicações Web (Ciência da Computação),
inspirado no funcionamento de aplicativos como o iFood.

> ⚠️ **Projeto em fase inicial.** Por enquanto existem apenas a infraestrutura, a autenticação
> JWT e um CRUD de exemplo herdados da base da disciplina. As funcionalidades do marketplace
> (restaurantes, cardápios, carrinho, pedidos, perfis de acesso) **ainda serão desenvolvidas**,
> e o front-end ainda não foi criado.

## Objetivo

Desenvolver uma aplicação web Full Stack funcional, do banco de dados à interface, que possa
ser executada localmente e demonstrada. Não há entregas reais, rastreamento, pagamentos ou
integrações externas: essas etapas serão **simuladas** dentro do sistema.

Perfis previstos:

- **Cliente:** cadastro e login, busca de restaurantes, cardápios, carrinho (um restaurante
  por vez), pedidos com endereço de entrega, histórico e acompanhamento de status.
- **Restaurante:** gestão de produtos e estoque, recebimento e atualização de pedidos.
- **Administrador:** gestão de usuários, restaurantes e categorias, visão de todos os pedidos.

## Tecnologias

| Camada | Tecnologia | Situação |
| --- | --- | --- |
| Banco de dados | PostgreSQL 16 | Configurado |
| Migrations | Alembic | Configurado |
| Back-end | Python 3.12 + FastAPI | Configurado |
| ORM | SQLAlchemy 2 | Configurado |
| Validação | Pydantic | Configurado |
| Autenticação | JWT (PyJWT) + hash Argon2 | Configurado |
| Front-end | React + Vite, React Router, Context API, Axios ou Fetch | Planejado |
| Comunicação | API REST (HTTP + JSON) | Configurado |
| Infraestrutura | Docker Compose | Configurado |
| Versionamento | Git + GitHub | Em uso |

## Estrutura de diretórios

```text
.
├── api/                    back-end (FastAPI)
│   ├── app/
│   │   ├── main.py         cria a aplicação, CORS, registra as rotas, /health
│   │   ├── core/           config.py (variáveis de ambiente), security.py (hash + JWT)
│   │   ├── db/             base.py (Base do ORM), session.py (conexão)
│   │   ├── models/         tabelas (SQLAlchemy)
│   │   ├── schemas/        contratos de entrada e saída (Pydantic)
│   │   ├── services/       regras de negócio (reservada)
│   │   └── api/            deps.py (get_db, get_current_user), routes/
│   ├── alembic/versions/   migrations (histórico versionado do schema)
│   ├── tests/              testes automatizados (reservada)
│   ├── Dockerfile
│   ├── alembic.ini
│   └── requirements.txt
├── front/                  front-end React + Vite (ainda não criado)
├── docs/                   arquitetura, modelagem e materiais do projeto
├── postman/                collection e environment para testar a API
├── .vscode/extensions.json extensões recomendadas
├── docker-compose.yml      serviços db (PostgreSQL) e api (FastAPI)
└── .env.example            modelo das variáveis de ambiente
```

## Pré-requisitos

Ambiente de desenvolvimento: **Windows com WSL 2 (Ubuntu)**. Execute os comandos no
terminal do WSL, com o repositório no sistema de arquivos do Linux (ex.: `~/...`), e não
em `/mnt/c/...`.

- Git
- Docker com Docker Compose v2 (Docker Engine no WSL ou Docker Desktop com integração WSL)
- Python 3 (só para gerar a `SECRET_KEY`; a API roda dentro do container)
- Node.js LTS (só quando o front-end for criado)

## Configuração do `.env`

```bash
cp .env.example .env
```

Edite o `.env`:

| Variável | O que é | Observação |
| --- | --- | --- |
| `POSTGRES_USER` | Usuário do banco | Padrão: `bocatto` |
| `POSTGRES_PASSWORD` | Senha do banco | **Troque.** Evite o caractere `%` |
| `POSTGRES_DB` | Nome do banco | Padrão: `bocatto` |
| `SECRET_KEY` | Chave que assina os JWT | **Obrigatória**, mínimo de 32 caracteres. A API não sobe com o valor de exemplo |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Validade do token | Padrão: 30 (de 1 a 1440) |
| `CORS_ORIGINS` | Front-ends autorizados (JSON) | Padrão: `["http://localhost:5173"]` (Vite) |

Gere a `SECRET_KEY`:

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(48))"
# sem Python local, use o container:
docker compose run --rm --no-deps api python -c "import secrets; print(secrets.token_urlsafe(48))"
```

A `DATABASE_URL` não vai no `.env`: o `docker-compose.yml` a monta a partir das variáveis
`POSTGRES_*`. O arquivo `.env` **nunca** deve ser versionado.

## Como executar

```bash
# 1. Suba banco + API (a primeira vez constrói a imagem)
docker compose up --build

# 2. Em OUTRO terminal, aplique as migrations
docker compose exec api alembic upgrade head
```

- Health check: <http://localhost:8000/health>
- Documentação interativa (Swagger): <http://localhost:8000/docs>
- PostgreSQL acessível do host em `localhost:5433` (a 5432 fica livre para um
  PostgreSQL instalado localmente)

### Comandos do dia a dia

```bash
docker compose up                    # sobe (sem rebuild)
docker compose up --build            # sobe reconstruindo (mudou o requirements.txt)
docker compose down                  # derruba, MANTÉM os dados
docker compose down -v               # derruba e APAGA o banco (volume bocatto_pgdata)
docker compose logs -f api           # acompanha os logs da API

# Banco
docker compose exec db psql -U bocatto -d bocatto   # use o usuário/banco do seu .env

# Migrations
docker compose exec api alembic revision --autogenerate -m "descreva a mudança"
docker compose exec api alembic upgrade head
docker compose exec api alembic downgrade -1
docker compose exec api alembic history
```

> **Sempre leia a migration gerada antes de aplicar.** O autogenerate é um rascunho:
> ele não sabe lidar com dados já existentes nem dar nome a todas as constraints.

## Endpoints existentes

| Método | Rota | Autenticação | O que faz |
| --- | --- | --- | --- |
| GET | `/health` | — | API e banco respondendo |
| POST | `/auth/register` | — | Cria usuário (JSON: `email`, `password`) |
| POST | `/auth/login` | — | Devolve o JWT (formulário: `username`, `password`) |
| GET | `/auth/me` | Bearer | Usuário dono do token |
| POST | `/items` | Bearer | Cria item do usuário logado |
| GET | `/items?limit=20&offset=0` | Bearer | Lista os itens do usuário logado |
| GET | `/items/{id}` | Bearer | Lê um item próprio (404 se for de outra pessoa) |
| PATCH | `/items/{id}` | Bearer | Altera um item próprio |
| DELETE | `/items/{id}` | Bearer | Apaga um item próprio |

`/items` é um **CRUD de exemplo** herdado da base, mantido como referência de implementação.
Ele não faz parte do domínio do Bocatto e será substituído pelas entidades reais.

Para testar no Postman, importe os dois arquivos de `postman/` e selecione o environment
**Bocatto local**.

## Como adicionar uma entidade

1. Crie o modelo em `api/app/models/` (use `item.py` como referência).
2. **Importe o modelo em `api/app/models/__init__.py`.** Sem isso, a migration sai vazia.
3. Crie os schemas em `api/app/schemas/` e as rotas em `api/app/api/routes/`.
4. Registre o router em `api/app/main.py`.
5. Gere a migration, **leia**, aplique e teste.

## Documentação

- [docs/arquitetura.md](docs/arquitetura.md): arquitetura da aplicação.
- [docs/modelagem.md](docs/modelagem.md): entidades, relacionamentos e decisões do banco.
- [front/README.md](front/README.md): planejamento do front-end.

## Origem da base

Este repositório parte da API base fornecida pelo professor da disciplina para o projeto
**Agroemergia**: infraestrutura Docker Compose, configuração do Alembic, autenticação JWT
e o CRUD de exemplo (`items`) vêm dessa base. As migrations originais foram mantidas em
`api/alembic/versions/`.

A base foi reorganizada para o Bocatto (pasta `backend/` renomeada para `api/`, nova
identificação e documentação), e o histórico do Git deste repositório começa a partir
dessa reorganização.
