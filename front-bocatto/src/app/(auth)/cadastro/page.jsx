import { Suspense } from 'react';

import FormCadastro from '@/components/auth/FormCadastro';

export const metadata = { title: 'Criar conta' };

// Rota: /cadastro — cria uma conta de cliente e já entra no site.
// Suspense: o formulário lê a URL (useSearchParams), que só existe no navegador.
export default function CadastroPage() {
  return (
    <Suspense>
      <FormCadastro />
    </Suspense>
  );
}
