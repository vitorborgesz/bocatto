# Modelagem do banco de dados

> Documento vivo. A seção **Estado atual** reflete as migrations existentes.
> A modelagem do Bocatto ainda será elaborada: nada abaixo dela é decisão tomada.

## 1. Estado atual do banco

Tabelas criadas pelas migrations herdadas da base do professor (`api/alembic/versions/`):

### `users`

| Coluna | Tipo | Restrições |
| --- | --- | --- |
| `id` | integer | PK |
| `email` | varchar(320) | NOT NULL, único (índice `ix_users_email`) |
| `hashed_password` | varchar(255) | NOT NULL (hash Argon2, nunca a senha) |
| `is_active` | boolean | NOT NULL, padrão `true` |
| `created_at` | timestamptz | NOT NULL, padrão `now()` |

### `items` (entidade genérica de exemplo)

| Coluna | Tipo | Restrições |
| --- | --- | --- |
| `id` | integer | PK |
| `title` | varchar(200) | NOT NULL |
| `description` | text | opcional |
| `created_at` | timestamptz | NOT NULL, padrão `now()` |
| `owner_id` | integer | NOT NULL, FK → `users.id` (ON DELETE CASCADE), indexado |

Relacionamento: um usuário possui zero ou mais itens.

`items` é o CRUD didático da base e serve de modelo para as entidades do Bocatto.
Quando deixar de ser útil, deverá ser removido por uma **nova** migration; as migrations
existentes não são apagadas nem editadas.

### Histórico de migrations

| Ordem | Revisão | Descrição |
| --- | --- | --- |
| 1 | `5c6c7e9008d9` | cria tabela `items` |
| 2 | `71dc08c733c6` | cria tabela `users` |
| 3 | `071990882b0f` | adiciona dono (`owner_id`) aos `items` |

## 2. Modelagem do Bocatto

**A definir.** Esta seção receberá o diagrama ER e a descrição das entidades.

Requisitos que a modelagem precisa atender (levantados no escopo do projeto):

- Três perfis de usuário: cliente, restaurante e administrador.
- Restaurantes com cardápio de produtos, que podem ser desativados e têm controle de estoque.
- Categorias gerenciadas pelo administrador.
- Busca e filtro de restaurantes.
- Carrinho com produtos de apenas um restaurante por vez.
- Pedidos com endereço de entrega, histórico e acompanhamento.
- Status simulados de pedido: aguardando confirmação, confirmado, em preparação,
  saiu para entrega, entregue, cancelado.
- Administrador pode desativar estabelecimentos e visualizar todos os pedidos.

### Entidades

_A definir._

### Relacionamentos

_A definir._

### Diagrama ER

_A definir._

## 3. Decisões de modelagem

| Data | Decisão | Motivo |
| --- | --- | --- |
| — | — | — |
