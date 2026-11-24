// Para onde mandar o usuário depois de entrar (login ou cadastro).

// Só aceita caminhos internos ("/pedidos"), nunca "//site.com" ou URLs externas.
export function destinoSeguro(valor) {
  return valor?.startsWith('/') && !valor.startsWith('//') ? valor : null;
}

// Volta para a página que pediu o login ou vai para o início (cardápio).
// O admin usa o site como qualquer cliente e chega ao painel pelo menu.
// Cliente nunca é mandado para /admin (lá ele seria barrado).
export function destinoDoUsuario(usuario, voltar) {
  if (!voltar) return '/';
  if (voltar.startsWith('/admin') && usuario.perfil !== 'admin') return '/';
  return voltar;
}

// Mantém o ?voltar= ao trocar entre /login e /cadastro.
export const comVoltar = (caminho, voltar) =>
  voltar ? `${caminho}?voltar=${encodeURIComponent(voltar)}` : caminho;
