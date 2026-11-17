'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuth } from '@/contexts/AuthContext';

// Mostra o conteúdo só para quem está logado (e, se informado, com o perfil certo).
// Sem login → /login. Logado com outro perfil → página inicial.
// Isto controla só a TELA: quem barra de verdade é a API.
export default function AreaProtegida({ perfil, children }) {
  const { usuario, carregando } = useAuth();
  const router = useRouter();
  const permitido = Boolean(usuario) && (!perfil || usuario.perfil === perfil);

  useEffect(() => {
    if (carregando || permitido) return;
    router.replace(usuario ? '/' : '/login');
  }, [carregando, permitido, usuario, router]);

  if (!permitido) {
    return <p className="py-16 text-center text-sm text-zinc-500">Carregando...</p>;
  }

  return children;
}
