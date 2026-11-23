'use strict';

// Permite excluir um produto que já foi vendido.
// Antes: pedido_itens.produto_id era obrigatório e ON DELETE RESTRICT (o banco recusava a exclusão).
// Agora: ON DELETE SET NULL. O item do pedido continua com nome_produto e preco_unitario
// (cópias feitas na compra), então o histórico não muda; só perde a ligação com o produto.
// Não altera nem apaga nenhum dado: muda só a regra da coluna.

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      `ALTER TABLE pedido_itens
         DROP CONSTRAINT pedido_itens_produto_id_fkey,
         ALTER COLUMN produto_id DROP NOT NULL,
         ADD CONSTRAINT pedido_itens_produto_id_fkey
           FOREIGN KEY (produto_id) REFERENCES produtos (id) ON DELETE SET NULL`,
    );
  },

  // Só volta se nenhum item estiver sem produto (itens de produtos já excluídos impedem o NOT NULL).
  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `ALTER TABLE pedido_itens
         DROP CONSTRAINT pedido_itens_produto_id_fkey,
         ALTER COLUMN produto_id SET NOT NULL,
         ADD CONSTRAINT pedido_itens_produto_id_fkey
           FOREIGN KEY (produto_id) REFERENCES produtos (id) ON DELETE RESTRICT`,
    );
  },
};
