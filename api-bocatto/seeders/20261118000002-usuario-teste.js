'use strict';

// Conta de TESTE para usar o site: teste@bocatto.com (cliente), com um endereço e
// três pedidos de exemplo (entregue, cancelado e um em preparo) para a tela "Meus pedidos".
// Senha: a mesma SEED_SENHA de api-bocatto/.env. Depende do cardápio do seeder anterior.
// Rodar: npm run db:seed   |   Desfazer só este: npx sequelize-cli db:seed:undo --seed 20261118000002-usuario-teste.js

const bcrypt = require('bcryptjs');

const EMAIL = 'teste@bocatto.com';

const ENDERECO = {
  rua: 'Avenida Getúlio Vargas',
  numero: '450',
  complemento: 'Sala 2',
  bairro: 'Centro',
  cidade: 'Chapecó',
  cep: '89801001',
};

// Do mais antigo para o mais recente. "minutosAtras" define a data do pedido.
const PEDIDOS = [
  {
    status: 'entregue',
    minutosAtras: 4 * 24 * 60,
    itens: [['Pizza Calabresa', 1], ['Refrigerante lata', 2]],
  },
  {
    status: 'cancelado',
    minutosAtras: 2 * 24 * 60,
    itens: [['Bocatto Bacon', 1]],
  },
  {
    status: 'em_preparo',
    minutosAtras: 15,
    itens: [['Bocatto Clássico', 2], ['Suco natural', 1]],
  },
];

// Contas em centavos (inteiros), como no pedidoService.
const centavos = (valor) => Math.round(Number(valor) * 100);
const reais = (c) => (c / 100).toFixed(2);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const senha = process.env.SEED_SENHA;
    if (!senha || senha.length < 8) {
      throw new Error('Defina SEED_SENHA em api-bocatto/.env (mínimo 8 caracteres) antes de rodar o seed.');
    }
    const taxa = centavos(process.env.TAXA_ENTREGA ?? 5);
    const senha_hash = await bcrypt.hash(senha, 10);

    await queryInterface.sequelize.transaction(async (transaction) => {
      const [usuario] = await queryInterface.bulkInsert(
        'usuarios',
        [{ nome: 'Usuário Teste', email: EMAIL, senha_hash, perfil: 'cliente' }],
        { returning: ['id'], transaction },
      );

      await queryInterface.bulkInsert('enderecos', [{ ...ENDERECO, usuario_id: usuario.id }], { transaction });

      // Nome e preço vêm do banco (cardápio criado pelo seeder de demonstração).
      const nomes = [...new Set(PEDIDOS.flatMap((p) => p.itens.map(([nome]) => nome)))];
      const [produtos] = await queryInterface.sequelize.query(
        'SELECT id, nome, preco FROM produtos WHERE nome IN (:nomes)',
        { replacements: { nomes }, transaction },
      );
      const porNome = new Map(produtos.map((p) => [p.nome, p]));
      const faltando = nomes.filter((nome) => !porNome.has(nome));
      if (faltando.length) {
        throw new Error(`Produtos não encontrados (rode o seeder de demonstração antes): ${faltando.join(', ')}`);
      }

      for (const pedido of PEDIDOS) {
        const linhas = pedido.itens.map(([nome, quantidade]) => {
          const produto = porNome.get(nome);
          return { produto_id: produto.id, nome_produto: produto.nome, preco_unitario: produto.preco, quantidade };
        });
        const subtotal = linhas.reduce((soma, l) => soma + centavos(l.preco_unitario) * l.quantidade, 0);
        const data = new Date(Date.now() - pedido.minutosAtras * 60 * 1000);

        const [criado] = await queryInterface.bulkInsert(
          'pedidos',
          [{
            usuario_id: usuario.id,
            status: pedido.status,
            endereco_rua: ENDERECO.rua,
            endereco_numero: ENDERECO.numero,
            endereco_complemento: ENDERECO.complemento,
            endereco_bairro: ENDERECO.bairro,
            endereco_cidade: ENDERECO.cidade,
            endereco_cep: ENDERECO.cep,
            subtotal: reais(subtotal),
            taxa_entrega: reais(taxa),
            total: reais(subtotal + taxa),
            criado_em: data,
            atualizado_em: data,
          }],
          { returning: ['id'], transaction },
        );

        await queryInterface.bulkInsert(
          'pedido_itens',
          linhas.map((linha) => ({ ...linha, pedido_id: criado.id })),
          { transaction },
        );
      }
    });
  },

  // Remove a conta de teste e os pedidos dela (itens e endereço caem em cascata).
  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const opcoes = { replacements: { email: EMAIL }, transaction };
      await queryInterface.sequelize.query(
        'DELETE FROM pedidos WHERE usuario_id IN (SELECT id FROM usuarios WHERE email = :email)',
        opcoes,
      );
      await queryInterface.sequelize.query('DELETE FROM usuarios WHERE email = :email', opcoes);
    });
  },
};
