import { DataTypes } from 'sequelize';

export default (sequelize) =>
  sequelize.define(
    'PedidoItem',
    {
      pedido_id: { type: DataTypes.INTEGER, allowNull: false },
      produto_id: { type: DataTypes.INTEGER, allowNull: false },
      quantidade: { type: DataTypes.INTEGER, allowNull: false },
      // Preço do produto NO MOMENTO da compra: se o restaurante mudar o preço
      // depois, o histórico do pedido continua correto.
      preco_unitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    },
    { tableName: 'pedido_itens', timestamps: false },
  );
