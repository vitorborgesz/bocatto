'use strict';

// Índice na FK pedido_itens.produto_id. O PostgreSQL não cria índice para FK
// sozinho: sem ele, toda vez que um produto é apagado/verificado (ON DELETE RESTRICT)
// o banco precisa varrer a tabela pedido_itens inteira.
// (pedido_id já está coberto pelo UNIQUE (pedido_id, produto_id).)

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('pedido_itens', ['produto_id'], { name: 'ix_pedido_itens_produto' });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('pedido_itens', 'ix_pedido_itens_produto');
  },
};
