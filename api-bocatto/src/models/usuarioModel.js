import { DataTypes } from 'sequelize';

export const PERFIS = ['cliente', 'restaurante'];

export default (sequelize) =>
  sequelize.define(
    'Usuario',
    {
      nome: { type: DataTypes.STRING(120), allowNull: false },
      email: { type: DataTypes.STRING(254), allowNull: false, unique: true },
      // Guardamos o HASH (bcrypt), nunca a senha.
      senha_hash: { type: DataTypes.STRING(255), allowNull: false },
      perfil: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'cliente',
        validate: { isIn: [PERFIS] },
      },
      ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    {
      tableName: 'usuarios',
      // Consultas nunca devolvem o hash. Para o login: Usuario.unscoped().
      defaultScope: { attributes: { exclude: ['senha_hash'] } },
    },
  );
