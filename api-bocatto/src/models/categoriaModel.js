import { DataTypes } from 'sequelize';

// Categoria de restaurante (Pizza, Japonesa...), usada no filtro da página inicial.
export default (sequelize) =>
  sequelize.define(
    'Categoria',
    {
      nome: { type: DataTypes.STRING(60), allowNull: false, unique: true },
    },
    { tableName: 'categorias' },
  );
