# Arquitetura do Bocatto

> Documento vivo. As seções **Estado atual** descrevem o que existe no código hoje.
> Os itens marcados como **A definir** ainda dependem de decisão da equipe.

## 1. Visão geral

Aplicação web Full Stack, executada localmente para fins acadêmicos:

```text
Navegador (React + Vite)  ──HTTP/JSON──▶  API (FastAPI)  ──SQLAlchemy──▶  PostgreSQL
        front/                              api/                       serviço "db"
```

- **Front-end:** ainda não implementado (ver [front/README.md](../front/README.md)).
- **API:** REST com JSON, autenticação por JWT.
- **Banco:** PostgreSQL 16, schema versionado com Alembic.
- **Infraestrutura:** Docker Compose (serviços `db` e `api`).

Não há integrações externas: pagamentos, entregas e status de pedidos serão simulados
dentro do próprio sistema.

## 2. API — estado atual

Herdada da base do professor (projeto Agroemergia) e organizada em camadas:

| Pasta | Responsabilidade |
| --- | --- |
| `app/main.py` | Cria a aplicação, configura CORS, registra as rotas, expõe `/health` |
| `app/core/` | `config.py` (variáveis de ambiente via pydantic-settings), `security.py` (hash Argon2 e JWT) |
| `app/db/` | `base.py` (classe base do ORM), `session.py` (engine e fábrica de sessões) |
| `app/models/` | Tabelas (SQLAlchemy 2) |
| `app/schemas/` | Contratos de entrada e saída (Pydantic) |
| `app/api/` | `deps.py` (sessão do banco e usuário autenticado via `Depends`), `routes/` |
| `app/services/` | Reservada para regras de negócio (vazia) |
| `alembic/` | Migrations do banco |
| `tests/` | Reservada para testes automatizados (vazia) |

Fluxo de uma requisição autenticada:

1. A rota declara `CurrentUser` como dependência.
2. `get_current_user` lê o cabeçalho `Authorization: Bearer <token>`, valida assinatura
   e expiração do JWT e carrega o usuário pelo `sub` (id).
3. Usuário inexistente ou inativo resulta em 401.
4. A rota usa a sessão (`DbSession`), aberta e fechada a cada requisição.

Autorização atual: apenas por **dono do registro** (`owner_id`). Não há perfis de acesso.

## 3. Decisões a definir

| Tema | Situação |
| --- | --- |
| Perfis de acesso (cliente, restaurante, administrador) e como representá-los | A definir |
| Divisão de responsabilidades entre `routes/` e `services/` | A definir |
| Ciclo de vida do pedido (transições de status permitidas e quem pode executá-las) | A definir |
| Regra "carrinho de um único restaurante": no front, na API ou em ambos | A definir |
| Estratégia de testes automatizados | A definir |
| Linguagem do front (JavaScript ou TypeScript) e cliente HTTP (Axios ou Fetch) | A definir |
| Armazenamento do token JWT no front | A definir |
| Criação do primeiro administrador (seed) | A definir |

## 4. Registro de decisões

| Data | Decisão | Motivo |
| --- | --- | --- |
| 2026-11-16 | Reaproveitar a base do professor e renomear `backend/` para `api/` | Preservar o que já funciona (auth JWT, Alembic, Docker) e alinhar a estrutura ao projeto |
| 2026-11-16 | Nome do projeto Compose fixado como `bocatto` | Nomes de volumes e containers independentes do nome da pasta |
