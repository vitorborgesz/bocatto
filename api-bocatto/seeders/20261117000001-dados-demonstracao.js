'use strict';

// Dados de demonstração: categorias, 3 restaurantes com cardápio e 1 cliente.
// Todas as contas usam a senha definida em SEED_SENHA (db-bocatto/.env).
// Rodar: npm run db:seed   |   Desfazer: npm run db:seed:undo

const bcrypt = require('bcryptjs');

const CATEGORIAS = ['Pizza', 'Hambúrguer', 'Japonesa', 'Brasileira', 'Doces'];

const RESTAURANTES = [
  {
    email: 'pizzaria@exemplo.com',
    dono: 'Forno da Nonna',
    categoria: 'Pizza',
    descricao: 'Pizzas de fermentação natural assadas no forno a lenha.',
    taxa_entrega: 6.9,
    tempo_entrega_minutos: 40,
    produtos: [
      { nome: 'Pizza Margherita', descricao: 'Molho de tomate, muçarela e manjericão.', preco: 49.9, estoque: 30 },
      { nome: 'Pizza Calabresa', descricao: 'Calabresa artesanal e cebola roxa.', preco: 52.9, estoque: 30 },
      { nome: 'Refrigerante lata', descricao: '350 ml.', preco: 6.5, estoque: 100 },
    ],
  },
  {
    email: 'burger@exemplo.com',
    dono: 'Brasa Burger',
    categoria: 'Hambúrguer',
    descricao: 'Hambúrgueres de costela grelhados na brasa.',
    taxa_entrega: 5.0,
    tempo_entrega_minutos: 30,
    produtos: [
      { nome: 'Brasa Clássico', descricao: 'Blend 180 g, queijo prato, alface e tomate.', preco: 32.0, estoque: 40 },
      { nome: 'Brasa Bacon', descricao: 'Blend 180 g, cheddar e bacon crocante.', preco: 36.0, estoque: 40 },
      { nome: 'Batata frita', descricao: 'Porção média com páprica.', preco: 18.0, estoque: 50 },
    ],
  },
  {
    email: 'sushi@exemplo.com',
    dono: 'Sakura Sushi',
    categoria: 'Japonesa',
    descricao: 'Combinados frescos preparados na hora.',
    taxa_entrega: 8.0,
    tempo_entrega_minutos: 50,
    produtos: [
      { nome: 'Combinado 20 peças', descricao: 'Sushis, sashimis e uramakis variados.', preco: 79.9, estoque: 20 },
      { nome: 'Temaki salmão', descricao: 'Salmão, cream cheese e cebolinha.', preco: 29.9, estoque: 25 },
      { nome: 'Guioza (6 un.)', descricao: 'Pastel japonês de porco grelhado.', preco: 24.9, estoque: 0 },
    ],
  },
];

const EMAILS = ['cliente@exemplo.com', ...RESTAURANTES.map((r) => r.email)];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const senha = process.env.SEED_SENHA;
    if (!senha || senha.length < 8) {
      throw new Error('Defina SEED_SENHA em db-bocatto/.env (mínimo 8 caracteres) antes de rodar o seed.');
    }
    const senha_hash = await bcrypt.hash(senha, 10);

    await queryInterface.sequelize.transaction(async (transaction) => {
      const categorias = await queryInterface.bulkInsert(
        'categorias',
        CATEGORIAS.map((nome) => ({ nome })),
        { returning: ['id', 'nome'], transaction },
      );
      const categoriaId = Object.fromEntries(categorias.map((c) => [c.nome, c.id]));

      await queryInterface.bulkInsert(
        'usuarios',
        [{ nome: 'Cliente Demonstração', email: 'cliente@exemplo.com', senha_hash, perfil: 'cliente' }],
        { transaction },
      );

      for (const r of RESTAURANTES) {
        const [dono] = await queryInterface.bulkInsert(
          'usuarios',
          [{ nome: r.dono, email: r.email, senha_hash, perfil: 'restaurante' }],
          { returning: ['id'], transaction },
        );

        const [restaurante] = await queryInterface.bulkInsert(
          'restaurantes',
          [{
            usuario_id: dono.id,
            categoria_id: categoriaId[r.categoria],
            nome: r.dono,
            descricao: r.descricao,
            taxa_entrega: r.taxa_entrega,
            tempo_entrega_minutos: r.tempo_entrega_minutos,
          }],
          { returning: ['id'], transaction },
        );

        await queryInterface.bulkInsert(
          'produtos',
          r.produtos.map((p) => ({ ...p, restaurante_id: restaurante.id })),
          { transaction },
        );
      }
    });
  },

  // Remove só os dados criados acima (na ordem inversa das FKs).
  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const opcoes = { replacements: { emails: EMAILS }, transaction };
      await queryInterface.sequelize.query(
        `DELETE FROM pedidos WHERE cliente_id IN (SELECT id FROM usuarios WHERE email IN (:emails))
            OR restaurante_id IN (SELECT r.id FROM restaurantes r JOIN usuarios u ON u.id = r.usuario_id WHERE u.email IN (:emails))`,
        opcoes,
      );
      await queryInterface.sequelize.query(
        `DELETE FROM produtos WHERE restaurante_id IN
           (SELECT r.id FROM restaurantes r JOIN usuarios u ON u.id = r.usuario_id WHERE u.email IN (:emails))`,
        opcoes,
      );
      await queryInterface.sequelize.query(
        'DELETE FROM restaurantes WHERE usuario_id IN (SELECT id FROM usuarios WHERE email IN (:emails))',
        opcoes,
      );
      await queryInterface.sequelize.query('DELETE FROM usuarios WHERE email IN (:emails)', opcoes);
      await queryInterface.bulkDelete('categorias', { nome: CATEGORIAS }, { transaction });
    });
  },
};
