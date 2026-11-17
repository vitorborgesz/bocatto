'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('enderecos', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onDelete: 'CASCADE',
      },
      rua: { type: Sequelize.STRING(150), allowNull: false },
      numero: { type: Sequelize.STRING(20), allowNull: false },
      complemento: { type: Sequelize.STRING(100) },
      bairro: { type: Sequelize.STRING(100), allowNull: false },
      cidade: { type: Sequelize.STRING(100), allowNull: false },
      // Só os 8 dígitos (a API remove o hífen).
      cep: { type: Sequelize.STRING(8), allowNull: false },
      criado_em: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
      atualizado_em: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });

    await queryInterface.addIndex('enderecos', ['usuario_id'], { name: 'ix_enderecos_usuario' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('enderecos');
  },
};
