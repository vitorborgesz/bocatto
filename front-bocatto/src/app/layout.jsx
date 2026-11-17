import './globals.css';

import Providers from '@/components/Providers';

export const metadata = {
  title: {
    default: 'Bocatto',
    template: '%s | Bocatto',
  },
  description:
    'Delivery do Bocatto: conheça o cardápio, monte seu pedido e acompanhe a entrega.',
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
