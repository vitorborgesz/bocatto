'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import Mordida from '@/components/ui/Mordida';
import { useAuth } from '@/contexts/AuthContext';

// Mostra o conteúdo só para quem está logado (e, se informado, com o perfil certo).
// Sem login → /login. Logado sem o perfil exigido (cliente no /admin) → página inicial.
// Isto controla só a TELA: quem barra de verdade é a API.
export default function AreaProtegida({ perfil, children }) {
  const { usuario, carregando } = useAuth();
  const router = useRouter();
  const caminho = usePathname();
  const permitido = Boolean(usuario) && (!perfil || usuario.perfil === perfil);

  useEffect(() => {
    if (carregando || permitido) return;
    if (usuario) {
      router.replace('/');
      return;
    }
    // Sem login: guarda a página atual para voltar a ela depois de entrar.
    router.replace(caminho === '/' ? '/login' : `/login?voltar=${encodeURIComponent(caminho)}`);
  }, [carregando, permitido, usuario, router, caminho]);

  if (!permitido) {
    return (
      <div aria-label="Carregando" className="flex flex-1 items-center justify-center py-24">
        <Mordida className="h-8 w-8 animate-pulse text-marca" />
      </div>
    );
  }

  return children;
}
