'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      nome: { type: Sequelize.STRING(120), allowNull: false },
      email: { type: Sequelize.STRING(254), allowNull: false, unique: true },
      senha_hash: { type: Sequelize.STRING(255), allowNull: false },
      perfil: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'cliente' },
      ativo: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      criado_em: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
      atualizado_em: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE usuarios
        ADD CONSTRAINT ck_usuarios_perfil CHECK (perfil IN ('cliente', 'admin'))
    `);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('usuarios');
  },
};
