import { DataTypes } from 'sequelize';

// Status simulados, na ordem do fluxo. As transições permitidas ficam no pedidoService.
export const STATUS_PEDIDO = ['pendente', 'em_preparo', 'saiu_para_entrega', 'entregue', 'cancelado'];

export default (sequelize) =>
  sequelize.define(
    'Pedido',
    {
      usuario_id: { type: DataTypes.INTEGER, allowNull: false },
      status: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: 'pendente',
        validate: { isIn: [STATUS_PEDIDO] },
      },
      // Cópia do endereço escolhido no checkout.
      endereco_rua: { type: DataTypes.STRING(150), allowNull: false },
      endereco_numero: { type: DataTypes.STRING(20), allowNull: false },
      endereco_complemento: { type: DataTypes.STRING(100) },
      endereco_bairro: { type: DataTypes.STRING(100), allowNull: false },
      endereco_cidade: { type: DataTypes.STRING(100), allowNull: false },
      endereco_cep: { type: DataTypes.STRING(8), allowNull: false },
      // Valores calculados pela API na finalização (nunca recebidos do front).
      subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      taxa_entrega: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    },
    { tableName: 'pedidos' },
  );
