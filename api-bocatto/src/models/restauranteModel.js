import { DataTypes } from 'sequelize';

export default (sequelize) =>
  sequelize.define(
    'Restaurante',
    {
      // Dono do restaurante: um usuário com perfil "restaurante" (um restaurante por usuário).
      usuario_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
      categoria_id: { type: DataTypes.INTEGER, allowNull: false },
      nome: { type: DataTypes.STRING(120), allowNull: false },
      descricao: { type: DataTypes.TEXT },
      imagem_url: { type: DataTypes.STRING(500) },
      // Valores monetários sempre em DECIMAL: o driver devolve como texto ("7.90").
      taxa_entrega: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      tempo_entrega_minutos: { type: DataTypes.INTEGER },
      // Soft delete: restaurante desativado some do catálogo, mas os pedidos antigos continuam.
      ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: 'restaurantes' },
  );
