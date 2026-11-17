import { DataTypes } from 'sequelize';

// Status simulados, na ordem do fluxo. "cancelado" pode acontecer antes da entrega.
export const STATUS_PEDIDO = [
  'aguardando_confirmacao',
  'confirmado',
  'em_preparacao',
  'saiu_para_entrega',
  'entregue',
  'cancelado',
];

export default (sequelize) =>
  sequelize.define(
    'Pedido',
    {
      cliente_id: { type: DataTypes.INTEGER, allowNull: false },
      restaurante_id: { type: DataTypes.INTEGER, allowNull: false },
      status: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: 'aguardando_confirmacao',
        validate: { isIn: [STATUS_PEDIDO] },
      },
      // Endereço digitado no checkout, guardado como texto no próprio pedido.
      endereco_entrega: { type: DataTypes.STRING(300), allowNull: false },
      // Valores calculados pela API na finalização (nunca recebidos do front).
      subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      taxa_entrega: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    },
    { tableName: 'pedidos' },
  );
