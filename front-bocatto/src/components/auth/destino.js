// Para onde mandar o usuário depois de entrar (login ou cadastro).

// Só aceita caminhos internos ("/pedidos"), nunca "//site.com" ou URLs externas.
export function destinoSeguro(valor) {
  return valor?.startsWith('/') && !valor.startsWith('//') ? valor : null;
}

// Admin → painel; cliente → página que pediu o login ou o início (cardápio).
export function destinoDoUsuario(usuario, voltar) {
  if (usuario.perfil === 'admin') return voltar?.startsWith('/admin') ? voltar : '/admin';
  return voltar && !voltar.startsWith('/admin') ? voltar : '/';
}

// Mantém o ?voltar= ao trocar entre /login e /cadastro.
export const comVoltar = (caminho, voltar) =>
  voltar ? `${caminho}?voltar=${encodeURIComponent(voltar)}` : caminho;
