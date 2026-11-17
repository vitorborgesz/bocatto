'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pedido_itens', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      // Apagar um pedido apaga seus itens; apagar um produto já vendido é recusado.
      pedido_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'pedidos', key: 'id' },
        onDelete: 'CASCADE',
      },
      produto_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'produtos', key: 'id' },
        onDelete: 'RESTRICT',
      },
      quantidade: { type: Sequelize.INTEGER, allowNull: false },
      preco_unitario: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE pedido_itens
        ADD CONSTRAINT ck_pedido_itens_quantidade CHECK (quantidade > 0),
        ADD CONSTRAINT ck_pedido_itens_preco CHECK (preco_unitario > 0),
        ADD CONSTRAINT uq_pedido_itens_produto UNIQUE (pedido_id, produto_id)
    `);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('pedido_itens');
  },
};
