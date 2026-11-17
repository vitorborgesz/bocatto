import { DataTypes } from 'sequelize';

// Seção do cardápio (Hambúrgueres, Pizzas, Bebidas...).
export default (sequelize) =>
  sequelize.define(
    'Categoria',
    {
      nome: { type: DataTypes.STRING(60), allowNull: false, unique: true },
    },
    { tableName: 'categorias' },
  );
