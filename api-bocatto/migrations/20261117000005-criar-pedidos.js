'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pedidos', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onDelete: 'RESTRICT',
      },
      status: { type: Sequelize.STRING(30), allowNull: false, defaultValue: 'pendente' },
      // Cópia do endereço no momento da compra (sem FK para enderecos):
      // editar ou excluir o endereço depois não muda o histórico do pedido.
      endereco_rua: { type: Sequelize.STRING(150), allowNull: false },
      endereco_numero: { type: Sequelize.STRING(20), allowNull: false },
      endereco_complemento: { type: Sequelize.STRING(100) },
      endereco_bairro: { type: Sequelize.STRING(100), allowNull: false },
      endereco_cidade: { type: Sequelize.STRING(100), allowNull: false },
      endereco_cep: { type: Sequelize.STRING(8), allowNull: false },
      subtotal: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      taxa_entrega: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      total: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      criado_em: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
      atualizado_em: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE pedidos
        ADD CONSTRAINT ck_pedidos_status CHECK (status IN (
          'pendente', 'em_preparo', 'saiu_para_entrega', 'entregue', 'cancelado'
        )),
        ADD CONSTRAINT ck_pedidos_valores CHECK (
          subtotal >= 0 AND taxa_entrega >= 0 AND total = subtotal + taxa_entrega
        )
    `);

    // "Meus pedidos" (cliente) e filtro por status (admin).
    await queryInterface.addIndex('pedidos', ['usuario_id'], { name: 'ix_pedidos_usuario' });
    await queryInterface.addIndex('pedidos', ['status'], { name: 'ix_pedidos_status' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('pedidos');
  },
};
