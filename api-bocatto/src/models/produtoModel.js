import { DataTypes } from 'sequelize';

export default (sequelize) =>
  sequelize.define(
    'Produto',
    {
      categoria_id: { type: DataTypes.INTEGER, allowNull: false },
      nome: { type: DataTypes.STRING(120), allowNull: false },
      descricao: { type: DataTypes.TEXT },
      // Valores monetários sempre em DECIMAL: o driver devolve como texto ("49.90").
      preco: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      imagem_url: { type: DataTypes.STRING(500) },
      // Disponível ou não. Produto inativo sai do cardápio, mas continua nos pedidos antigos.
      ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: 'produtos' },
  );
