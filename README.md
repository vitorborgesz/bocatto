# Bocatto

Sistema de delivery para **um único restaurante**. O cliente vê o cardápio, monta
o carrinho, escolhe onde receber e acompanha o pedido etapa por etapa. A equipe do
restaurante usa um painel para receber os pedidos, avançar cada um pelo fluxo de
preparo e entrega, e manter o cardápio atualizado.

| Parte | Pasta | Endereço local |
|---|---|---|
| Front-end (site) | [`front-bocatto/`](front-bocatto/) | http://localhost:4100 |
| API REST | [`api-bocatto/`](api-bocatto/) | http://localhost:4444 |
| Banco de dados (scripts SQL) | [`db-bocatto/`](db-bocatto/) | PostgreSQL em `localhost:5432`, banco `db-bocatto` |
| Documentação extra | [`docs/`](docs/) | — |

---

## Sumário

1. [Funcionalidades](#1-funcionalidades)
2. [Tecnologias](#2-tecnologias)
3. [Arquitetura](#3-arquitetura)
4. [Como rodar](#4-como-rodar)
5. [Como funciona](#5-como-funciona)
6. [Banco de dados](#6-banco-de-dados)
7. [API: rotas](#7-api-rotas)
8. [Front-end: telas e organização](#8-front-end-telas-e-organização)
9. [Identidade visual](#9-identidade-visual)
10. [Segurança](#10-segurança)
11. [Limitações e próximos passos](#11-limitações-e-próximos-passos)

---

## 1. Funcionalidades

### Cliente

- **Conta:** criar conta (nome, e-mail e senha) e entrar. O site só abre depois do login.
- **Cardápio:** produtos por categoria, com a opção "Todos". Cada produto tem foto
  (ou a inicial da categoria), descrição e preço.
- **Carrinho:**
  - adicionar com um clique, com um aviso de confirmação;
  - alterar quantidades e remover itens;
  - ver subtotal, taxa de entrega e total.
- **Endereço:** escolher um endereço salvo ou cadastrar um novo, com apelido opcional
  ("Casa", "Trabalho").
- **Pedido:** confirmar e cair na tela "Pedido confirmado".
- **Meus pedidos:**
  - cada pedido em andamento aparece com a linha de etapas (Recebido → Em preparo →
    Saiu para entrega → Entregue), que se atualiza sozinha;
  - pedidos concluídos ficam no histórico;
  - um pedido pode ser cancelado enquanto ainda estiver pendente.

### Administrador (painel em `/admin`)

- **Pedidos:**
  - fila com filtros por status e o total de pedidos e de vendas do dia;
  - um botão para o próximo passo de cada pedido, e cancelamento com confirmação;
  - a lista se atualiza sozinha a cada 15 segundos.
- **Cardápio:**
  - cadastrar, editar e excluir produtos;
  - deixar um produto disponível ou indisponível com um interruptor;
  - criar, renomear e excluir categorias.

---

## 2. Tecnologias

### Front-end (`front-bocatto/`)

| Tecnologia | Versão | Para quê |
|---|---|---|
| [Next.js](https://nextjs.org/) (App Router, Turbopack) | 16.3 | estrutura do site, rotas por pastas, build |
| [React](https://react.dev/) | 19.2 | componentes e estado das telas |
| [Tailwind CSS](https://tailwindcss.com/) | 4.3 | estilos com classes utilitárias e as cores da marca (`@theme`) |
| [axios](https://axios-http.com/) | 1.20 | chamadas à API, com o token enviado automaticamente |
| `next/font` (Bricolage Grotesque e Inter) | — | fontes do Google servidas pelo próprio site |
| ESLint (`eslint-config-next`) | 9.39 | padrão de código |

### API (`api-bocatto/`)

| Tecnologia | Versão | Para quê |
|---|---|---|
| [Node.js](https://nodejs.org/) | ≥ 20.11 | ambiente de execução |
| [Express](https://expressjs.com/) | 5.2 | servidor HTTP e rotas. Na versão 5, erros em funções `async` chegam ao tratador central sozinhos |
| [Sequelize](https://sequelize.org/) + `sequelize-cli` | 6.37 / 6.6 | ORM, migrations e seeders |
| `pg` / `pg-hstore` | 8.23 / 2.3 | driver do PostgreSQL usado pelo Sequelize |
| [Zod](https://zod.dev/) | 4.6 | validação do corpo das requisições e das variáveis de ambiente |
| `jsonwebtoken` | 9.0 | login com token JWT (HS256) |
| `bcryptjs` | 3.0 | hash das senhas |
| `cors` | 2.8 | libera só o front autorizado |
| `dotenv` | 17.4 | lê o `.env` |
| `nodemon` (desenvolvimento) | 3.1 | reinicia a API ao salvar um arquivo |

### Banco de dados

- **PostgreSQL 16**.
- A estrutura é criada pelas **migrations** do Sequelize. Os scripts SQL em
  [`db-bocatto/sql/`](db-bocatto/sql/) recriam tudo pelo DataGrip, igual às migrations.

---

## 3. Arquitetura

```
 Navegador (http://localhost:4100)
   │  páginas React (Next.js). Sessão e carrinho ficam no localStorage
   │
   │  HTTP + JSON  ·  Authorization: Bearer <token>
   ▼
 API Express (http://localhost:4444)
   rota → middlewares (autenticar, exigirPerfil, validar) → controller → service → model
   │
   │  Sequelize (SQL)
   ▼
 PostgreSQL 16 (localhost:5432, banco db-bocatto)
```

O front e a API são **projetos separados**, cada um com seu `package.json`, e se
falam só por HTTP. O front nunca acessa o banco.

### Organização da API

```
api-bocatto/
├── server.js               # sobe o Express: CORS, JSON, rotas, /health e tratamento de erros
├── migrations/             # estrutura do banco, em ordem (uma alteração por arquivo)
├── seeders/                # dados de demonstração (contas, cardápio, pedidos de exemplo)
└── src/
    ├── config/             # env.js (valida o .env com Zod) e database.js (conexão)
    ├── routes/             # URLs de cada recurso e quem pode acessá-las
    ├── middlewares/        # autenticar (JWT), exigirPerfil, validar (Zod), erros
    ├── controllers/        # recebem a requisição e devolvem a resposta HTTP
    ├── services/           # regras de negócio (login, cálculo e fluxo dos pedidos)
    ├── models/             # tabelas no Sequelize e os relacionamentos
    └── utils/              # schemas Zod de cada recurso e a classe AppError
```

### Organização do front

```
front-bocatto/
├── public/images/produtos/ # fotos dos produtos, servidas em /images/produtos/...
└── src/
    ├── app/                # rotas (cada pasta é uma URL)
    │   ├── (auth)/         # /login e /cadastro
    │   ├── (cliente)/      # /, /cardapio, /carrinho, /checkout, /pedido-confirmado, /pedidos
    │   └── admin/          # /admin (pedidos) e /admin/cardapio
    ├── components/         # telas e peças por assunto: cardapio, carrinho, checkout, pedidos, admin, auth, layout, ui
    ├── contexts/           # AuthContext (sessão), CartContext (carrinho), AvisoContext (avisos)
    ├── services/           # funções que chamam a API (api.js configura o axios)
    └── utils/              # formatação de moeda e datas, e acesso ao localStorage
```

As pastas entre parênteses, como `(cliente)`, são **grupos de rotas** do Next: não
aparecem na URL e servem para compartilhar um layout. Todas as páginas do cliente,
por exemplo, têm o mesmo header e exigem login.

---

## 4. Como rodar

O passo a passo completo, com instalação do PostgreSQL, variáveis de ambiente,
backup e solução de problemas, está em **[docs/CONFIGURACAO_BANCO.md](docs/CONFIGURACAO_BANCO.md)**.
Resumo:

**Requisitos:** Node.js 20+ e PostgreSQL 16, com o banco `db-bocatto` já criado.

```bash
# 1. API: dependências e variáveis
cd api-bocatto
npm ci
cp .env.example .env            # preencha POSTGRES_PASSWORD e JWT_SECRET

# 2. Banco: estrutura e dados de demonstração
npm run db:migrate
npm run db:seed
#    (ou, pelo DataGrip: rode db-bocatto/sql/01_drop_bocatto.sql e 02_create_bocatto.sql)

# 3. Subir a API (terminal 1)
npm run dev                     # http://localhost:4444

# 4. Subir o front (terminal 2)
cd ../front-bocatto
npm ci
npm run dev                     # http://localhost:4100
```

### Contas de teste

| E-mail | Senha | Perfil | O que tem |
|---|---|---|---|
| `admin@bocatto.com` | `123456` | admin | acesso ao painel `/admin` |
| `cliente@bocatto.com` | `123456` | cliente | 2 endereços e 3 pedidos de exemplo |

Também é possível criar uma conta de cliente nova em `/cadastro`.

### Scripts

| Onde | Comando | O que faz |
|---|---|---|
| `api-bocatto/` | `npm run dev` | API com reinício automático (nodemon) |
| `api-bocatto/` | `npm start` | API sem reinício automático |
| `api-bocatto/` | `npm run db:migrate` / `db:migrate:status` | aplica / lista as migrations |
| `api-bocatto/` | `npm run db:seed` | cria os dados de demonstração (não duplica) |
| `front-bocatto/` | `npm run dev` | site em modo desenvolvimento |
| `front-bocatto/` | `npm run build` e depois `npm start` | gera a versão otimizada e roda ela |
| `front-bocatto/` | `npm run lint` | confere o padrão do código |

---

## 5. Como funciona

### Login e perfis

1. O cliente cria a conta em `POST /auth/cadastro`. A senha é guardada só como **hash
   bcrypt**, e toda conta nova é `cliente`. Contas `admin` vêm do seed.
2. No login (`POST /auth/login`), a API confere a senha e devolve um **token JWT**,
   válido por 8 h, com o id do usuário.
3. O front guarda `{ token, usuario }` no `localStorage`, e o axios envia o token em
   toda requisição (`Authorization: Bearer ...`).
4. Em cada rota protegida, o middleware `autenticar` valida o token e **lê o usuário
   no banco**, para pegar o perfil atualizado e recusar contas desativadas.
   `exigirPerfil('admin')` ou `exigirPerfil('cliente')` libera a rota só para aquele perfil.
5. No front, `AreaProtegida` manda para `/login` quem não está logado e guarda a
   página de origem (`?voltar=`), para voltar a ela depois do login. Se a API
   responder 401 (token vencido), a sessão é encerrada e a tela volta para o login.

> A proteção que vale é a da **API**. O front só esconde as telas, e um usuário
> sem permissão não consegue os dados mesmo chamando a API direto.

### Carrinho

- Fica no **`localStorage`** do navegador: sobrevive a recarregar a página e não
  precisa de login para ser montado.
- Ao abrir o carrinho ou o checkout, ele é **sincronizado com o cardápio atual**:
  preços e fotos são atualizados, e produtos excluídos ou indisponíveis saem com um aviso.
- O carrinho serve só para **exibir**. Na hora do pedido, o front envia apenas
  `produto_id` e `quantidade`.

### Pedido

1. O cliente confirma o pedido no checkout com um endereço escolhido.
2. A API (`pedidoService.criar`):
   - confere se o endereço é **do próprio cliente**;
   - confere se os produtos existem e estão **disponíveis**;
   - **lê nome e preço no banco**, ignorando o que veio do navegador;
   - soma tudo **em centavos**, para não acumular erro de arredondamento, e adiciona a
     **taxa de entrega** (`TAXA_ENTREGA` no `.env`, R$ 5,00 por padrão);
   - grava o pedido e os itens numa **transação**: ou grava tudo, ou nada.
3. O pedido guarda uma **cópia** do endereço e, em cada item, uma cópia do nome e do
   preço. Assim o histórico não muda se o cliente apagar o endereço ou se o
   restaurante alterar ou excluir o produto depois.

### Fluxo de status

```
pendente ──► em_preparo ──► saiu_para_entrega ──► entregue
   │              │
   └──────────────┴──► cancelado
```

| Quem | Pode fazer |
|---|---|
| Admin | avançar para o próximo status; cancelar enquanto está `pendente` ou `em_preparo` |
| Cliente | cancelar só enquanto está `pendente` |

As regras ficam na API (`TRANSICOES_ADMIN` em `pedidoService.js`). A troca de status
usa `UPDATE ... WHERE status = <status lido>`. Se o cliente cancelar no mesmo
instante em que o admin avança o pedido, só a primeira ação vale e a outra recebe
um erro 409 pedindo para atualizar a tela.

### Cardápio e produtos

- **Indisponível** (`ativo = false`): o produto some do cardápio do cliente, mas continua
  no painel e pode voltar com um clique.
- **Excluir** apaga o produto de vez. Os pedidos antigos mantêm o nome e o preço do
  item, e só a ligação com o produto vira `NULL`.
- Uma **categoria** só pode ser excluída quando não tem produtos.
- **Fotos:** o campo `imagem_url` aceita um link `https://...` ou um caminho do
  próprio site, como `/images/produtos/foto.jpg`, para arquivos em
  `front-bocatto/public/images/produtos/`.

---

## 6. Banco de dados

### Tabelas

| Tabela | Guarda | Regras principais |
|---|---|---|
| `usuarios` | contas | e-mail único; `perfil` só `cliente` ou `admin`; senha só como hash |
| `categorias` | categorias do cardápio | nome único |
| `produtos` | itens do cardápio | `preco > 0`; `ativo` controla se aparece para o cliente |
| `enderecos` | endereços salvos do cliente | apagados junto com o usuário (CASCADE) |
| `pedidos` | pedidos | status validado; `total = subtotal + taxa_entrega`; cópia do endereço |
| `pedido_itens` | itens de cada pedido | `quantidade > 0`; um produto por pedido; cópia de nome e preço |

Mais duas tabelas de controle do `sequelize-cli`: `SequelizeMeta` (migrations
aplicadas) e `SequelizeData` (seeders aplicados).

### Relacionamentos

```
usuarios 1 ──< N enderecos         (excluir usuário apaga os endereços)
usuarios 1 ──< N pedidos           (usuário com pedidos não pode ser excluído)
categorias 1 ──< N produtos        (categoria com produtos não pode ser excluída)
pedidos 1 ──< N pedido_itens       (excluir pedido apaga os itens)
produtos 1 ──< N pedido_itens      (excluir produto deixa produto_id = NULL)
```

### Decisões

- **Valores em `NUMERIC(10,2)`**, nunca `float`. A API devolve esses valores como texto
  (`"49.90"`), e o front converte só para exibir.
- **Regras também no banco:** `CHECK`, `UNIQUE` e chaves estrangeiras garantem os dados
  certos mesmo se algum código falhar.
- **Índice em toda chave estrangeira**, porque o PostgreSQL não cria esses índices sozinho.
- **Datas** em `criado_em` e `atualizado_em`, com fuso horário (`timestamptz`).

### Migrations, seeders e scripts SQL

| Forma | Quando usar |
|---|---|
| `npm run db:migrate` + `npm run db:seed` | instalação normal; aplica só o que falta |
| `db-bocatto/sql/01_drop_bocatto.sql` + `02_create_bocatto.sql` | zerar o banco pelo DataGrip e recriar com os dados de teste |

Os scripts SQL têm uma trava: só rodam conectados ao banco `db-bocatto`. Eles também
já marcam as migrations e os seeders como aplicados.

> Toda migration nova precisa entrar também no `02_create_bocatto.sql`.

---

## 7. API: rotas

Base: `http://localhost:4444`. Corpo e respostas em JSON.

**Erros:**
- formato padrão: `{ "erro": "mensagem" }`;
- erros de validação também trazem
  `"detalhes": [{ "campo", "mensagem" }]`.

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/health` | público | API e banco no ar |
| POST | `/auth/cadastro` | público | cria conta de cliente `{ nome, email, senha }` |
| POST | `/auth/login` | público | `{ email, senha }` → `{ token, usuario }` |
| GET | `/auth/me` | logado | dados do usuário do token |
| GET | `/categorias` | público | lista as categorias |
| POST · PUT · DELETE | `/categorias`, `/categorias/:id` | admin | cria, renomeia, exclui (409 se tiver produtos) |
| GET | `/produtos` | público | cardápio: só produtos disponíveis (`?categoria_id=`) |
| GET | `/produtos/todos` | admin | todos, inclusive indisponíveis |
| POST · PUT · DELETE | `/produtos`, `/produtos/:id` | admin | cria, edita (parcial), exclui |
| GET · POST | `/enderecos` | cliente | lista / cadastra os próprios endereços |
| PUT · DELETE | `/enderecos/:id` | cliente | edita / exclui um endereço próprio |
| GET | `/pedidos/taxa-entrega` | público | `{ "taxa_entrega": "5.00" }` |
| POST | `/pedidos` | cliente | cria `{ endereco_id, itens: [{ produto_id, quantidade }] }` |
| GET | `/pedidos/meus` | cliente | pedidos do cliente, com itens |
| PATCH | `/pedidos/:id/cancelar` | cliente | cancela (só `pendente`) |
| GET | `/pedidos` | admin | todos os pedidos, com itens e cliente (`?status=`) |
| PATCH | `/pedidos/:id/status` | admin | `{ status }`, seguindo o fluxo |

**Códigos de resposta:**

| Código | Quando |
|---|---|
| 400 | dados inválidos |
| 401 | sem login, ou token inválido ou vencido |
| 403 | perfil sem permissão |
| 404 | não encontrado |
| 409 | conflito: e-mail repetido, transição de status inválida, categoria com produtos |

---

## 8. Front-end: telas e organização

| Rota | Tela | Quem acessa |
|---|---|---|
| `/login` | entrar | todos (primeira tela) |
| `/cadastro` | criar conta | todos |
| `/` e `/cardapio` | cardápio com categorias e "Todos" | logado |
| `/carrinho` | itens, quantidades e resumo | logado |
| `/checkout` | escolher ou cadastrar o endereço e confirmar | cliente |
| `/pedido-confirmado` | confirmação com o número do pedido | cliente |
| `/pedidos` | pedidos em andamento (com etapas) e histórico | cliente |
| `/admin` | fila de pedidos | admin |
| `/admin/cardapio` | produtos e categorias | admin |

### Padrões usados no código

- **Telas em componentes de cliente** (`'use client'`), porque dependem da sessão e do
  carrinho, que estão no navegador.
- **Contextos** para o estado global:
  - `AuthContext`: sessão;
  - `CartContext`: carrinho;
  - `AvisoContext`: os avisos rápidos no rodapé da tela.
- **localStorage + `useSyncExternalStore`** (em `utils/armazenamentoLocal.js`): a tela se
  atualiza na hora quando a sessão ou o carrinho mudam, inclusive em outra aba.
- **`services/`:** toda chamada à API passa por um arquivo de serviço. Os componentes
  não usam o axios direto.
- **Cada tela trata os estados** carregando (esqueleto), erro (com "Tentar de novo")
  e vazio.
- **Acessibilidade:**
  - rótulos nos campos;
  - `aria-live` nos avisos;
  - `role="switch"` nos interruptores;
  - `<dialog>` nativo nos modais;
  - a animação do aviso fica desligada para quem pede movimento reduzido no sistema.

---

## 9. Identidade visual

O visual é minimalista, com personalidade, e foi desenhado no Figma.

| Token | Cor | Uso |
|---|---|---|
| `marca` | `#e8590c` | laranja da marca: botões, preços, destaques |
| `marca-escura` | `#c2410c` | botão ao passar o mouse |
| `marca-clara` | `#ffe8d9` | fundos de destaque e chips selecionados |
| `creme` | `#fff8f1` | fundo das páginas |
| `tinta` | `#1f1612` | textos |
| `suave` | `#7a6a60` | textos secundários |
| `borda` | `#f0e2d6` | bordas e divisórias |
| `sucesso` / `erro` | `#2f9e44` / `#e03131` | confirmações e erros |

- **Fontes:** *Bricolage Grotesque* nos títulos e *Inter* nos textos.
- **"Mordida":** o símbolo da marca é um círculo laranja com uma mordida na borda
  (`components/ui/Mordida.jsx`). Aparece no logo, nos estados vazios e na confirmação
  do pedido.
- As cores ficam em `front-bocatto/src/app/globals.css` (`@theme`) e viram classes
  do Tailwind (`bg-marca`, `text-suave`...).

---

## 10. Segurança

- **Senhas:** só o hash bcrypt vai para o banco. As consultas nunca devolvem o hash
  (`defaultScope` do model).
- **Login:** a mensagem de erro é a mesma para "e-mail não existe" e "senha errada", e
  o tempo de resposta é parecido nos dois casos. Assim não dá para descobrir quais
  e-mails têm conta.
- **JWT:** chave de no mínimo 32 caracteres (a API não sobe sem ela) e algoritmo fixo
  (HS256).
- **Validação:** todo corpo de requisição passa por um schema Zod. Campos não previstos
  são descartados.
- **Dados de cada cliente:** endereços e pedidos são sempre filtrados pelo usuário do
  token. Um cliente não acessa os dados de outro mudando o id na URL.
- **Valores:** preço e total são sempre calculados pela API.
- **CORS:** só o front configurado em `CORS_ORIGINS` pode chamar a API pelo navegador.
- **Segredos:** o `.env` não vai para o Git, e o `.env.example` documenta as variáveis
  sem os valores reais.
- **Senha `123456` das contas de teste:** existe só para desenvolvimento e deve ser
  trocada fora dele.

---

## 11. Limitações e próximos passos

O que funciona hoje cobre o fluxo completo de um delivery. Melhorias possíveis:

- **Testes automatizados:**
  - testes de integração da API, por exemplo com `node:test` e `supertest`;
  - testes de tela, por exemplo com Playwright.
- **Gerenciar endereços:** a API já tem editar e excluir (`PUT`/`DELETE /enderecos/:id`),
  mas o site ainda só cadastra.
- **Segurança em produção:**
  - limitar tentativas de login (rate limit);
  - cabeçalhos de segurança (helmet);
  - token em cookie `httpOnly` em vez do `localStorage`.
- **Upload de fotos** pelo painel. Hoje a foto é um link ou um arquivo colocado em
  `public/images/produtos/`.
- **Paginação** na lista de pedidos do admin, que hoje traz todos.
- **Tempo real:** trocar a atualização a cada 15/20 s por WebSocket ou Server-Sent Events.
- **Pagamento:** o sistema ainda não trata pagamento. O pedido é confirmado sem
  escolher a forma de pagamento.
