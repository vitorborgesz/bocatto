'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('produtos', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      restaurante_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'restaurantes', key: 'id' },
        onDelete: 'RESTRICT',
      },
      nome: { type: Sequelize.STRING(120), allowNull: false },
      descricao: { type: Sequelize.TEXT },
      preco: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      imagem_url: { type: Sequelize.STRING(500) },
      estoque: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      ativo: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      criado_em: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
      atualizado_em: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });

    // O banco é a última barreira: mesmo com bug na API, não existe
    // preço zerado nem estoque negativo.
    await queryInterface.sequelize.query(`
      ALTER TABLE produtos
        ADD CONSTRAINT ck_produtos_preco CHECK (preco > 0),
        ADD CONSTRAINT ck_produtos_estoque CHECK (estoque >= 0)
    `);

    await queryInterface.addIndex('produtos', ['restaurante_id'], { name: 'ix_produtos_restaurante' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('produtos');
  },
};
