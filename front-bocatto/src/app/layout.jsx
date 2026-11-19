import './globals.css';

import { Bricolage_Grotesque, Inter } from 'next/font/google';

import Providers from '@/components/Providers';

// Títulos (personalidade) e texto/UI. Viram variáveis CSS usadas no globals.css.
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

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
    <html lang="pt-BR" className={`${bricolage.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col bg-creme font-sans text-tinta antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
