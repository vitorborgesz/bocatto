import './globals.css';

import Providers from '@/components/Providers';

export const metadata = {
  title: {
    default: 'Bocatto',
    template: '%s | Bocatto',
  },
  description:
    'Plataforma de delivery que conecta clientes a restaurantes e permite explorar cardápios, realizar pedidos e acompanhar seu andamento.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
