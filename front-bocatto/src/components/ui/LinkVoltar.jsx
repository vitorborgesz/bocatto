import Link from 'next/link';

import { IconeSeta } from '@/components/ui/Icones';

// "← Voltar ao ..." no topo das etapas da compra (carrinho → endereço).
export default function LinkVoltar({ href, children }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-suave transition-colors hover:text-tinta"
    >
      <IconeSeta className="h-4 w-4 rotate-180" />
      {children}
    </Link>
  );
}
