import { DataTypes } from 'sequelize';

// cliente: faz pedidos pelo site. admin: equipe do Bocatto (painel de pedidos e cardápio).
export const PERFIS = ['cliente', 'admin'];

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
