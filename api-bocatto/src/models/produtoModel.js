import { DataTypes } from 'sequelize';

export default (sequelize) =>
  sequelize.define(
    'Produto',
    {
      restaurante_id: { type: DataTypes.INTEGER, allowNull: false },
      nome: { type: DataTypes.STRING(120), allowNull: false },
      descricao: { type: DataTypes.TEXT },
      preco: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      imagem_url: { type: DataTypes.STRING(500) },
      // O banco recusa estoque negativo (CHECK). A baixa acontece na finalização do pedido.
      estoque: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      // Soft delete: produto desativado sai do cardápio, mas continua nos pedidos antigos.
      ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: 'produtos' },
  );
