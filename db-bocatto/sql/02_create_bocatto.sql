-- =============================================================================
-- Bocatto - 02_create_bocatto.sql
-- Cria todas as tabelas do Bocatto no banco db-bocatto, já com os dados de teste:
--   admin@bocatto.com   (admin)   senha 123456
--   cliente@bocatto.com (cliente) senha 123456, 2 endereços e 3 pedidos de exemplo
--   4 categorias e 12 produtos no cardápio
--
-- Rode com o banco VAZIO (depois do 01_drop_bocatto.sql).
-- No DataGrip: conecte no banco db-bocatto e execute o script inteiro.
--
-- A estrutura é a mesma das migrations do Sequelize (api-bocatto/migrations).
-- As tabelas SequelizeMeta/SequelizeData já saem preenchidas: assim
-- "npm run db:migrate" e "npm run db:seed" sabem que está tudo aplicado e não duplicam nada.
-- =============================================================================

BEGIN;

-- Trava de segurança: só roda conectado no db-bocatto.
DO $$
BEGIN
  IF current_database() <> 'db-bocatto' THEN
    RAISE EXCEPTION 'Conectado no banco "%". Este script só pode rodar no db-bocatto.', current_database();
  END IF;
END
$$;


-- -----------------------------------------------------------------------------
-- Estrutura
-- -----------------------------------------------------------------------------

-- Controle do sequelize-cli: migrations e seeders já aplicados.
CREATE TABLE "SequelizeMeta" (
  name VARCHAR(255) PRIMARY KEY
);

CREATE TABLE "SequelizeData" (
  name VARCHAR(255) PRIMARY KEY
);

CREATE TABLE usuarios (
  id            SERIAL PRIMARY KEY,
  nome          VARCHAR(120) NOT NULL,
  email         VARCHAR(254) NOT NULL UNIQUE,         -- a API guarda sempre em minúsculas
  senha_hash    VARCHAR(255) NOT NULL,                -- bcrypt, nunca a senha
  perfil        VARCHAR(20)  NOT NULL DEFAULT 'cliente',
  ativo         BOOLEAN      NOT NULL DEFAULT TRUE,
  criado_em     TIMESTAMPTZ  NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ  NOT NULL DEFAULT now(),
  CONSTRAINT ck_usuarios_perfil CHECK (perfil IN ('cliente', 'admin'))
);

CREATE TABLE categorias (
  id            SERIAL PRIMARY KEY,
  nome          VARCHAR(60) NOT NULL UNIQUE,
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE produtos (
  id            SERIAL PRIMARY KEY,
  categoria_id  INTEGER NOT NULL REFERENCES categorias (id) ON DELETE RESTRICT,
  nome          VARCHAR(120)  NOT NULL,
  descricao     TEXT,
  preco         NUMERIC(10,2) NOT NULL,
  imagem_url    VARCHAR(500),
  ativo         BOOLEAN       NOT NULL DEFAULT TRUE,  -- false = some do cardápio
  criado_em     TIMESTAMPTZ   NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ   NOT NULL DEFAULT now(),
  CONSTRAINT ck_produtos_preco CHECK (preco > 0)
);
CREATE INDEX ix_produtos_categoria ON produtos (categoria_id);

-- Endereços salvos do cliente (o pedido guarda uma cópia, não uma referência).
CREATE TABLE enderecos (
  id            SERIAL PRIMARY KEY,
  usuario_id    INTEGER NOT NULL REFERENCES usuarios (id) ON DELETE CASCADE,
  rua           VARCHAR(150) NOT NULL,
  numero        VARCHAR(20)  NOT NULL,
  complemento   VARCHAR(100),
  bairro        VARCHAR(100) NOT NULL,
  cidade        VARCHAR(100) NOT NULL,
  cep           VARCHAR(8)   NOT NULL,                -- só os 8 dígitos
  criado_em     TIMESTAMPTZ  NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ  NOT NULL DEFAULT now(),
  apelido       VARCHAR(40)                           -- "Casa", "Trabalho"... (opcional)
);
CREATE INDEX ix_enderecos_usuario ON enderecos (usuario_id);

CREATE TABLE pedidos (
  id                   SERIAL PRIMARY KEY,
  usuario_id           INTEGER NOT NULL REFERENCES usuarios (id) ON DELETE RESTRICT,
  status               VARCHAR(30)   NOT NULL DEFAULT 'pendente',
  -- Cópia do endereço no momento do pedido.
  endereco_rua         VARCHAR(150)  NOT NULL,
  endereco_numero      VARCHAR(20)   NOT NULL,
  endereco_complemento VARCHAR(100),
  endereco_bairro      VARCHAR(100)  NOT NULL,
  endereco_cidade      VARCHAR(100)  NOT NULL,
  endereco_cep         VARCHAR(8)    NOT NULL,
  subtotal             NUMERIC(10,2) NOT NULL,
  taxa_entrega         NUMERIC(10,2) NOT NULL,
  total                NUMERIC(10,2) NOT NULL,
  criado_em            TIMESTAMPTZ   NOT NULL DEFAULT now(),
  atualizado_em        TIMESTAMPTZ   NOT NULL DEFAULT now(),
  CONSTRAINT ck_pedidos_status
    CHECK (status IN ('pendente', 'em_preparo', 'saiu_para_entrega', 'entregue', 'cancelado')),
  CONSTRAINT ck_pedidos_valores
    CHECK (subtotal >= 0 AND taxa_entrega >= 0 AND total = subtotal + taxa_entrega)
);
CREATE INDEX ix_pedidos_usuario ON pedidos (usuario_id);
CREATE INDEX ix_pedidos_status  ON pedidos (status);

-- Itens com nome e preço copiados do produto no momento do pedido.
CREATE TABLE pedido_itens (
  id             SERIAL PRIMARY KEY,
  pedido_id      INTEGER NOT NULL REFERENCES pedidos (id)  ON DELETE CASCADE,
  produto_id     INTEGER NOT NULL REFERENCES produtos (id) ON DELETE RESTRICT,
  nome_produto   VARCHAR(120)  NOT NULL,
  preco_unitario NUMERIC(10,2) NOT NULL,
  quantidade     INTEGER       NOT NULL,
  CONSTRAINT ck_pedido_itens_preco      CHECK (preco_unitario > 0),
  CONSTRAINT ck_pedido_itens_quantidade CHECK (quantidade > 0),
  CONSTRAINT uq_pedido_itens_produto    UNIQUE (pedido_id, produto_id)
);
CREATE INDEX ix_pedido_itens_produto ON pedido_itens (produto_id);


-- -----------------------------------------------------------------------------
-- Dados de teste
-- -----------------------------------------------------------------------------

-- Senha das duas contas: 123456 (hash bcrypt gerado pela API).
INSERT INTO usuarios (nome, email, senha_hash, perfil) VALUES
  ('Equipe Bocatto',       'admin@bocatto.com',   '$2b$10$H8NKTqGJW.og2JB1W1Ir6eYNxw9URtgT01iUMqhnUnZeGVZ5lAU/W', 'admin'),
  ('Cliente Demonstração', 'cliente@bocatto.com', '$2b$10$H8NKTqGJW.og2JB1W1Ir6eYNxw9URtgT01iUMqhnUnZeGVZ5lAU/W', 'cliente');

INSERT INTO enderecos (usuario_id, apelido, rua, numero, complemento, bairro, cidade, cep)
SELECT u.id, e.apelido, e.rua, e.numero, e.complemento, e.bairro, e.cidade, e.cep
FROM (VALUES
  ('Casa',     'Rua das Palmeiras',      '120', 'Apto 301', 'Centro', 'Chapecó', '89801000'),
  ('Trabalho', 'Avenida Getúlio Vargas', '450', 'Sala 2',   'Centro', 'Chapecó', '89801001')
) AS e (apelido, rua, numero, complemento, bairro, cidade, cep)
CROSS JOIN usuarios u
WHERE u.email = 'cliente@bocatto.com';

INSERT INTO categorias (nome) VALUES
  ('Hambúrgueres'),
  ('Pizzas'),
  ('Bebidas'),
  ('Sobremesas');

INSERT INTO produtos (categoria_id, nome, descricao, preco)
SELECT c.id, p.nome, p.descricao, p.preco
FROM (VALUES
  ('Hambúrgueres', 'Bocatto Clássico',     'Blend 180 g, queijo prato, alface, tomate e molho da casa.', 32.00),
  ('Hambúrgueres', 'Bocatto Bacon',        'Blend 180 g, cheddar e bacon crocante.',                     36.00),
  ('Hambúrgueres', 'Bocatto Veggie',       'Hambúrguer de grão-de-bico, rúcula e tomate seco.',          34.00),
  ('Pizzas',       'Pizza Margherita',     'Molho de tomate, muçarela e manjericão.',                    49.90),
  ('Pizzas',       'Pizza Calabresa',      'Calabresa artesanal e cebola roxa.',                         52.90),
  ('Pizzas',       'Pizza Quatro Queijos', 'Muçarela, provolone, parmesão e gorgonzola.',                56.90),
  ('Bebidas',      'Refrigerante lata',    '350 ml.',                                                    6.50),
  ('Bebidas',      'Suco natural',         'Laranja ou limão, 500 ml.',                                  9.90),
  ('Bebidas',      'Água mineral',         '500 ml, com ou sem gás.',                                    4.50),
  ('Sobremesas',   'Brownie com sorvete',  'Brownie de chocolate meio amargo e sorvete de creme.',       18.00),
  ('Sobremesas',   'Pudim',                'Pudim de leite condensado com calda de caramelo.',           12.00),
  ('Sobremesas',   'Petit gâteau',         'Bolinho de chocolate com recheio cremoso.',                  22.00)
) AS p (categoria, nome, descricao, preco)
JOIN categorias c ON c.nome = p.categoria
ORDER BY c.id, p.nome;

-- Três pedidos de exemplo do cliente, entregues no endereço "Trabalho".
-- Os itens copiam nome e preço do cardápio; subtotal e total são calculados
-- a partir dos itens (taxa de entrega: R$ 5,00, a mesma TAXA_ENTREGA da API).
CREATE TEMPORARY TABLE pedidos_exemplo (
  ordem       INTEGER,
  status      VARCHAR(30),
  criado_em   TIMESTAMPTZ,
  produto     VARCHAR(120),
  quantidade  INTEGER
) ON COMMIT DROP;

INSERT INTO pedidos_exemplo VALUES
  (1, 'entregue',   now() - INTERVAL '4 days',    'Pizza Calabresa',   1),
  (1, 'entregue',   now() - INTERVAL '4 days',    'Refrigerante lata', 2),
  (2, 'cancelado',  now() - INTERVAL '2 days',    'Bocatto Bacon',     1),
  (3, 'em_preparo', now() - INTERVAL '15 minutes', 'Bocatto Clássico', 2),
  (3, 'em_preparo', now() - INTERVAL '15 minutes', 'Suco natural',     1);

-- Um pedido por "ordem", com o subtotal somado dos itens.
INSERT INTO pedidos (
  usuario_id, status,
  endereco_rua, endereco_numero, endereco_complemento, endereco_bairro, endereco_cidade, endereco_cep,
  subtotal, taxa_entrega, total, criado_em, atualizado_em
)
SELECT u.id, x.status,
       e.rua, e.numero, e.complemento, e.bairro, e.cidade, e.cep,
       SUM(p.preco * x.quantidade), 5.00, SUM(p.preco * x.quantidade) + 5.00, x.criado_em, x.criado_em
FROM pedidos_exemplo x
JOIN produtos  p ON p.nome = x.produto
JOIN usuarios  u ON u.email = 'cliente@bocatto.com'
JOIN enderecos e ON e.usuario_id = u.id AND e.apelido = 'Trabalho'
GROUP BY x.ordem, x.status, x.criado_em, u.id, e.id
ORDER BY x.ordem;

-- Liga cada item ao pedido pela data (cada pedido de exemplo tem uma data diferente).
INSERT INTO pedido_itens (pedido_id, produto_id, nome_produto, preco_unitario, quantidade)
SELECT pe.id, p.id, p.nome, p.preco, x.quantidade
FROM pedidos_exemplo x
JOIN produtos p  ON p.nome = x.produto
JOIN pedidos  pe ON pe.criado_em = x.criado_em
ORDER BY pe.id, p.id;


-- -----------------------------------------------------------------------------
-- Controle do sequelize-cli (tudo já aplicado)
-- -----------------------------------------------------------------------------

INSERT INTO "SequelizeMeta" (name) VALUES
  ('20261117000001-criar-usuarios.js'),
  ('20261117000002-criar-categorias.js'),
  ('20261117000003-criar-produtos.js'),
  ('20261117000004-criar-enderecos.js'),
  ('20261117000005-criar-pedidos.js'),
  ('20261117000006-criar-pedido-itens.js'),
  ('20261118000001-indice-pedido-itens-produto.js'),
  ('20261119000001-apelido-enderecos.js');

INSERT INTO "SequelizeData" (name) VALUES
  ('20261117000001-dados-demonstracao.js'),
  ('20261118000002-pedidos-demonstracao.js');

COMMIT;
