'use strict';

// Apelido opcional do endereço ("Casa", "Trabalho"), mostrado no checkout.
// Coluna nova e opcional: os endereços que já existem ficam com apelido NULL.

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('enderecos', 'apelido', { type: Sequelize.STRING(40), allowNull: true });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('enderecos', 'apelido');
  },
};
