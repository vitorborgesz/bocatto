'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('restaurantes', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      // unique: cada usuário de perfil "restaurante" tem um único restaurante.
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'usuarios', key: 'id' },
        onDelete: 'RESTRICT',
      },
      categoria_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'categorias', key: 'id' },
        onDelete: 'RESTRICT',
      },
      nome: { type: Sequelize.STRING(120), allowNull: false },
      descricao: { type: Sequelize.TEXT },
      imagem_url: { type: Sequelize.STRING(500) },
      taxa_entrega: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      tempo_entrega_minutos: { type: Sequelize.INTEGER },
      ativo: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      criado_em: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
      atualizado_em: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE restaurantes
        ADD CONSTRAINT ck_restaurantes_taxa_entrega CHECK (taxa_entrega >= 0),
        ADD CONSTRAINT ck_restaurantes_tempo_entrega CHECK (tempo_entrega_minutos > 0)
    `);

    // Filtro por categoria na página inicial.
    await queryInterface.addIndex('restaurantes', ['categoria_id'], { name: 'ix_restaurantes_categoria' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('restaurantes');
  },
};
