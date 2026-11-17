import { sequelize } from '../config/database.js';
import defineCategoria from './categoriaModel.js';
import definePedidoItem from './pedidoItemModel.js';
import definePedido from './pedidoModel.js';
import defineProduto from './produtoModel.js';
import defineRestaurante from './restauranteModel.js';
import defineUsuario from './usuarioModel.js';

// Reúne os models e seus relacionamentos. A conexão vem de config/database.js.
export { sequelize };

export const Usuario = defineUsuario(sequelize);
export const Categoria = defineCategoria(sequelize);
export const Restaurante = defineRestaurante(sequelize);
export const Produto = defineProduto(sequelize);
export const Pedido = definePedido(sequelize);
export const PedidoItem = definePedidoItem(sequelize);

// Associações (as FKs de verdade ficam nas migrations).
Usuario.hasOne(Restaurante, { foreignKey: 'usuario_id', as: 'restaurante' });
Restaurante.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'dono' });

Categoria.hasMany(Restaurante, { foreignKey: 'categoria_id', as: 'restaurantes' });
Restaurante.belongsTo(Categoria, { foreignKey: 'categoria_id', as: 'categoria' });

Restaurante.hasMany(Produto, { foreignKey: 'restaurante_id', as: 'produtos' });
Produto.belongsTo(Restaurante, { foreignKey: 'restaurante_id', as: 'restaurante' });

Usuario.hasMany(Pedido, { foreignKey: 'cliente_id', as: 'pedidos' });
Pedido.belongsTo(Usuario, { foreignKey: 'cliente_id', as: 'cliente' });

Restaurante.hasMany(Pedido, { foreignKey: 'restaurante_id', as: 'pedidos' });
Pedido.belongsTo(Restaurante, { foreignKey: 'restaurante_id', as: 'restaurante' });

Pedido.hasMany(PedidoItem, { foreignKey: 'pedido_id', as: 'itens' });
PedidoItem.belongsTo(Pedido, { foreignKey: 'pedido_id', as: 'pedido' });
PedidoItem.belongsTo(Produto, { foreignKey: 'produto_id', as: 'produto' });
