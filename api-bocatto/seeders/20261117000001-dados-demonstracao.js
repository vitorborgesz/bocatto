'use strict';

// Dados de demonstração: 1 admin, 1 cliente com endereço, 4 categorias e o cardápio.
// As duas contas usam a senha definida em SEED_SENHA (db-bocatto/.env).
// Rodar: npm run db:seed   |   Desfazer: npm run db:seed:undo

const bcrypt = require('bcryptjs');

const USUARIOS = [
  { nome: 'Equipe Bocatto', email: 'admin@bocatto.com', perfil: 'admin' },
  { nome: 'Cliente Demonstração', email: 'cliente@bocatto.com', perfil: 'cliente' },
];

const ENDERECO_CLIENTE = {
  rua: 'Rua das Palmeiras',
  numero: '120',
  complemento: 'Apto 301',
  bairro: 'Centro',
  cidade: 'Chapecó',
  cep: '89801000',
};

const CARDAPIO = {
  'Hambúrgueres': [
    { nome: 'Bocatto Clássico', descricao: 'Blend 180 g, queijo prato, alface, tomate e molho da casa.', preco: 32.0 },
    { nome: 'Bocatto Bacon', descricao: 'Blend 180 g, cheddar e bacon crocante.', preco: 36.0 },
    { nome: 'Bocatto Veggie', descricao: 'Hambúrguer de grão-de-bico, rúcula e tomate seco.', preco: 34.0 },
  ],
  Pizzas: [
    { nome: 'Pizza Margherita', descricao: 'Molho de tomate, muçarela e manjericão.', preco: 49.9 },
    { nome: 'Pizza Calabresa', descricao: 'Calabresa artesanal e cebola roxa.', preco: 52.9 },
    { nome: 'Pizza Quatro Queijos', descricao: 'Muçarela, provolone, parmesão e gorgonzola.', preco: 56.9 },
  ],
  Bebidas: [
    { nome: 'Refrigerante lata', descricao: '350 ml.', preco: 6.5 },
    { nome: 'Suco natural', descricao: 'Laranja ou limão, 500 ml.', preco: 9.9 },
    { nome: 'Água mineral', descricao: '500 ml, com ou sem gás.', preco: 4.5 },
  ],
  Sobremesas: [
    { nome: 'Brownie com sorvete', descricao: 'Brownie de chocolate meio amargo e sorvete de creme.', preco: 18.0 },
    { nome: 'Pudim', descricao: 'Pudim de leite condensado com calda de caramelo.', preco: 12.0 },
    { nome: 'Petit gâteau', descricao: 'Bolinho de chocolate com recheio cremoso.', preco: 22.0 },
  ],
};

const CATEGORIAS = Object.keys(CARDAPIO);
const EMAILS = USUARIOS.map((u) => u.email);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const senha = process.env.SEED_SENHA;
    if (!senha || senha.length < 8) {
      throw new Error('Defina SEED_SENHA em db-bocatto/.env (mínimo 8 caracteres) antes de rodar o seed.');
    }
    const senha_hash = await bcrypt.hash(senha, 10);

    await queryInterface.sequelize.transaction(async (transaction) => {
      const usuarios = await queryInterface.bulkInsert(
        'usuarios',
        USUARIOS.map((u) => ({ ...u, senha_hash })),
        { returning: ['id', 'email'], transaction },
      );
      const cliente = usuarios.find((u) => u.email === 'cliente@bocatto.com');

      await queryInterface.bulkInsert(
        'enderecos',
        [{ ...ENDERECO_CLIENTE, usuario_id: cliente.id }],
        { transaction },
      );

      const categorias = await queryInterface.bulkInsert(
        'categorias',
        CATEGORIAS.map((nome) => ({ nome })),
        { returning: ['id', 'nome'], transaction },
      );

      const produtos = categorias.flatMap((categoria) =>
        CARDAPIO[categoria.nome].map((produto) => ({ ...produto, categoria_id: categoria.id })),
      );
      await queryInterface.bulkInsert('produtos', produtos, { transaction });
    });
  },

  // Remove só os dados criados acima (na ordem inversa das FKs).
  // Pedidos das contas de demonstração saem junto (os itens caem em cascata).
  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const opcoes = { replacements: { emails: EMAILS, categorias: CATEGORIAS }, transaction };
      await queryInterface.sequelize.query(
        'DELETE FROM pedidos WHERE usuario_id IN (SELECT id FROM usuarios WHERE email IN (:emails))',
        opcoes,
      );
      // Endereços caem em cascata junto com os usuários.
      await queryInterface.sequelize.query('DELETE FROM usuarios WHERE email IN (:emails)', opcoes);
      await queryInterface.sequelize.query(
        'DELETE FROM produtos WHERE categoria_id IN (SELECT id FROM categorias WHERE nome IN (:categorias))',
        opcoes,
      );
      await queryInterface.sequelize.query('DELETE FROM categorias WHERE nome IN (:categorias)', opcoes);
    });
  },
};
