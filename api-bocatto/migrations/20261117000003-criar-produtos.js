'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('produtos', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      // RESTRICT: não dá para apagar uma categoria que ainda tem produtos.
      categoria_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'categorias', key: 'id' },
        onDelete: 'RESTRICT',
      },
      nome: { type: Sequelize.STRING(120), allowNull: false },
      descricao: { type: Sequelize.TEXT },
      preco: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      imagem_url: { type: Sequelize.STRING(500) },
      ativo: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      criado_em: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
      atualizado_em: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });

    // O banco é a última barreira: mesmo com bug na API, não existe preço zerado.
    await queryInterface.sequelize.query(`
      ALTER TABLE produtos ADD CONSTRAINT ck_produtos_preco CHECK (preco > 0)
    `);

    await queryInterface.addIndex('produtos', ['categoria_id'], { name: 'ix_produtos_categoria' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('produtos');
  },
};
