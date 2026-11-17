import { sequelize } from '../config/database.js';
import defineCategoria from './categoriaModel.js';
import defineEndereco from './enderecoModel.js';
import definePedidoItem from './pedidoItemModel.js';
import definePedido from './pedidoModel.js';
import defineProduto from './produtoModel.js';
import defineUsuario from './usuarioModel.js';

// Reúne os models e seus relacionamentos. A conexão vem de config/database.js.
export { sequelize };

export const Usuario = defineUsuario(sequelize);
export const Endereco = defineEndereco(sequelize);
export const Categoria = defineCategoria(sequelize);
export const Produto = defineProduto(sequelize);
export const Pedido = definePedido(sequelize);
export const PedidoItem = definePedidoItem(sequelize);

// Associações (as FKs de verdade ficam nas migrations).
Usuario.hasMany(Endereco, { foreignKey: 'usuario_id', as: 'enderecos' });
Endereco.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

Usuario.hasMany(Pedido, { foreignKey: 'usuario_id', as: 'pedidos' });
Pedido.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'cliente' });

Categoria.hasMany(Produto, { foreignKey: 'categoria_id', as: 'produtos' });
Produto.belongsTo(Categoria, { foreignKey: 'categoria_id', as: 'categoria' });

Pedido.hasMany(PedidoItem, { foreignKey: 'pedido_id', as: 'itens' });
PedidoItem.belongsTo(Pedido, { foreignKey: 'pedido_id', as: 'pedido' });
PedidoItem.belongsTo(Produto, { foreignKey: 'produto_id', as: 'produto' });
