import { DataTypes } from 'sequelize';

export default (sequelize) =>
  sequelize.define(
    'PedidoItem',
    {
      pedido_id: { type: DataTypes.INTEGER, allowNull: false },
      produto_id: { type: DataTypes.INTEGER, allowNull: false },
      // Nome e preço NO MOMENTO da compra: se o produto mudar depois,
      // o histórico do pedido continua correto.
      nome_produto: { type: DataTypes.STRING(120), allowNull: false },
      preco_unitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      quantidade: { type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: 'pedido_itens', timestamps: false },
  );
