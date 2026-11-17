import { env } from '../config/env.js';
import { Endereco, Pedido, PedidoItem, Produto, sequelize } from '../models/index.js';
import { AppError } from '../utils/appError.js';

// Fluxo do pedido para o admin: cada status só pode ir para os listados.
// Depois de "saiu_para_entrega" não há mais cancelamento pelo sistema.
const TRANSICOES_ADMIN = {
  pendente: ['em_preparo', 'cancelado'],
  em_preparo: ['saiu_para_entrega', 'cancelado'],
  saiu_para_entrega: ['entregue'],
  entregue: [],
  cancelado: [],
};

const INCLUIR_ITENS = { model: PedidoItem, as: 'itens', attributes: { exclude: ['pedido_id'] } };

// Contas em centavos (inteiros): somar "49.90" + "6.50" como float acumula erro.
const paraCentavos = (valor) => Math.round(Number(valor) * 100);
const paraReais = (centavos) => (centavos / 100).toFixed(2);

export async function criar(usuarioId, { endereco_id, itens }) {
  const endereco = await Endereco.findOne({ where: { id: endereco_id, usuario_id: usuarioId } });
  if (!endereco) {
    throw new AppError(404, 'Endereço não encontrado');
  }

  const produtos = await Produto.findAll({
    where: { id: itens.map((item) => item.produto_id), ativo: true },
  });
  if (produtos.length !== itens.length) {
    throw new AppError(400, 'Um ou mais produtos não estão disponíveis');
  }

  // Nome e preço vêm do banco, nunca do front.
  const produtoPorId = new Map(produtos.map((produto) => [produto.id, produto]));
  const linhas = itens.map(({ produto_id, quantidade }) => {
    const produto = produtoPorId.get(produto_id);
    return {
      produto_id,
      nome_produto: produto.nome,
      preco_unitario: produto.preco,
      quantidade,
    };
  });

  const subtotal = linhas.reduce((soma, l) => soma + paraCentavos(l.preco_unitario) * l.quantidade, 0);
  const taxa = paraCentavos(env.TAXA_ENTREGA);

  // Pedido e itens são gravados juntos: se algo falhar, nada fica pela metade.
  const pedidoId = await sequelize.transaction(async (transaction) => {
    const pedido = await Pedido.create(
      {
        usuario_id: usuarioId,
        endereco_rua: endereco.rua,
        endereco_numero: endereco.numero,
        endereco_complemento: endereco.complemento,
        endereco_bairro: endereco.bairro,
        endereco_cidade: endereco.cidade,
        endereco_cep: endereco.cep,
        subtotal: paraReais(subtotal),
        taxa_entrega: paraReais(taxa),
        total: paraReais(subtotal + taxa),
      },
      { transaction },
    );

    await PedidoItem.bulkCreate(
      linhas.map((linha) => ({ ...linha, pedido_id: pedido.id })),
      { transaction },
    );

    return pedido.id;
  });

  return Pedido.findByPk(pedidoId, { include: [INCLUIR_ITENS] });
}

export function listarDoCliente(usuarioId) {
  return Pedido.findAll({
    where: { usuario_id: usuarioId },
    include: [INCLUIR_ITENS],
    order: [['criado_em', 'DESC'], ['id', 'DESC']],
  });
}

export function listarTodos({ status } = {}) {
  return Pedido.findAll({
    where: status ? { status } : {},
    include: [INCLUIR_ITENS, { association: 'cliente', attributes: ['id', 'nome', 'email'] }],
    order: [['criado_em', 'DESC'], ['id', 'DESC']],
  });
}

// O UPDATE só acontece se o status ainda for o lido. Assim, se o cliente cancelar
// enquanto o admin avança o pedido, só a primeira alteração vale.
async function trocarStatus(pedido, novoStatus) {
  const [alterados] = await Pedido.update(
    { status: novoStatus },
    { where: { id: pedido.id, status: pedido.status } },
  );
  if (alterados === 0) {
    throw new AppError(409, 'O pedido foi alterado nesse meio-tempo. Atualize e tente de novo.');
  }
  return Pedido.findByPk(pedido.id, { include: [INCLUIR_ITENS] });
}

export async function cancelarPeloCliente(usuarioId, pedidoId) {
  const pedido = await Pedido.findOne({ where: { id: pedidoId, usuario_id: usuarioId } });
  if (!pedido) {
    throw new AppError(404, 'Pedido não encontrado');
  }
  if (pedido.status !== 'pendente') {
    throw new AppError(409, 'Só é possível cancelar pedidos pendentes');
  }
  return trocarStatus(pedido, 'cancelado');
}

export async function alterarStatus(pedidoId, novoStatus) {
  const pedido = await Pedido.findByPk(pedidoId);
  if (!pedido) {
    throw new AppError(404, 'Pedido não encontrado');
  }
  if (!TRANSICOES_ADMIN[pedido.status].includes(novoStatus)) {
    throw new AppError(409, `Não é possível mudar de "${pedido.status}" para "${novoStatus}"`);
  }
  return trocarStatus(pedido, novoStatus);
}
