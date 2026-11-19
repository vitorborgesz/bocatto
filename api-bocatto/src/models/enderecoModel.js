import { DataTypes } from 'sequelize';

// Endereços salvos do cliente. O pedido guarda uma CÓPIA, não uma referência.
export default (sequelize) =>
  sequelize.define(
    'Endereco',
    {
      usuario_id: { type: DataTypes.INTEGER, allowNull: false },
      // "Casa", "Trabalho"... (opcional)
      apelido: { type: DataTypes.STRING(40) },
      rua: { type: DataTypes.STRING(150), allowNull: false },
      numero: { type: DataTypes.STRING(20), allowNull: false },
      complemento: { type: DataTypes.STRING(100) },
      bairro: { type: DataTypes.STRING(100), allowNull: false },
      cidade: { type: DataTypes.STRING(100), allowNull: false },
      cep: { type: DataTypes.STRING(8), allowNull: false },
    },
    { tableName: 'enderecos' },
  );
