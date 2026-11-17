'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pedidos', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      cliente_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onDelete: 'RESTRICT',
      },
      restaurante_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'restaurantes', key: 'id' },
        onDelete: 'RESTRICT',
      },
      status: { type: Sequelize.STRING(30), allowNull: false, defaultValue: 'aguardando_confirmacao' },
      endereco_entrega: { type: Sequelize.STRING(300), allowNull: false },
      subtotal: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      taxa_entrega: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      total: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      criado_em: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
      atualizado_em: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE pedidos
        ADD CONSTRAINT ck_pedidos_status CHECK (status IN (
          'aguardando_confirmacao', 'confirmado', 'em_preparacao',
          'saiu_para_entrega', 'entregue', 'cancelado'
        )),
        ADD CONSTRAINT ck_pedidos_valores CHECK (
          subtotal >= 0 AND taxa_entrega >= 0 AND total = subtotal + taxa_entrega
        )
    `);

    // "Meus pedidos" (cliente) e "pedidos recebidos" (restaurante).
    await queryInterface.addIndex('pedidos', ['cliente_id'], { name: 'ix_pedidos_cliente' });
    await queryInterface.addIndex('pedidos', ['restaurante_id', 'status'], { name: 'ix_pedidos_restaurante_status' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('pedidos');
  },
};
