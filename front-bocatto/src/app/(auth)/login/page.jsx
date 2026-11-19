import { Suspense } from 'react';

import FormLogin from '@/components/auth/FormLogin';

export const metadata = { title: 'Entrar' };

// Rota: /login — admin vai para /admin; cliente volta para ?voltar=... ou para o início.
// Suspense: o formulário lê a URL (useSearchParams), que só existe no navegador.
export default function LoginPage() {
  return (
    <Suspense>
      <FormLogin />
    </Suspense>
  );
}
