'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuth } from '@/contexts/AuthContext';

// Mostra o conteúdo só para quem está logado (e, se informado, com o perfil certo).
// Sem login → /login. Logado com outro perfil → página inicial.
// Isto controla só a TELA: quem barra de verdade é a API.
export default function AreaProtegida({ perfil, children }) {
  const { usuario, carregando } = useAuth();
  const router = useRouter();
  const caminho = usePathname();
  const permitido = Boolean(usuario) && (!perfil || usuario.perfil === perfil);

  useEffect(() => {
    if (carregando || permitido) return;
    // Sem login: guarda a página atual para voltar a ela depois de entrar.
    router.replace(usuario ? '/' : `/login?voltar=${encodeURIComponent(caminho)}`);
  }, [carregando, permitido, usuario, router, caminho]);

  if (!permitido) {
    return <p className="py-16 text-center text-sm text-zinc-500">Carregando...</p>;
  }

  return children;
}
