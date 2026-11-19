-- =============================================================================
-- Bocatto - 01_drop_bocatto.sql
-- APAGA todas as tabelas do Bocatto (e TODOS os dados) do banco db-bocatto.
--
-- O banco db-bocatto continua existindo, só que vazio. Depois rode o
-- 02_create_bocatto.sql para criar tudo de novo.
--
-- No DataGrip: conecte no banco db-bocatto e execute o script inteiro
-- (Execute Script / Ctrl+Shift+F10, ou selecione tudo e Ctrl+Enter).
-- =============================================================================

BEGIN;

-- Trava de segurança: só roda conectado no db-bocatto.
-- Em qualquer outro banco (projeto_salas, loja...) o script para aqui e nada é apagado.
DO $$
BEGIN
  IF current_database() <> 'db-bocatto' THEN
    RAISE EXCEPTION 'Conectado no banco "%". Este script só pode rodar no db-bocatto.', current_database();
  END IF;
END
$$;

-- CASCADE leva junto as FKs, os índices e as sequências (ids) de cada tabela.
DROP TABLE IF EXISTS
  pedido_itens,
  pedidos,
  enderecos,
  produtos,
  categorias,
  usuarios,
  "SequelizeMeta",
  "SequelizeData"
CASCADE;

COMMIT;
