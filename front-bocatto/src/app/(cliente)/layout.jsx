import HeaderCliente from '@/components/layout/HeaderCliente';

// Layout da área do cliente: header com carrinho em todas as páginas do grupo.
export default function ClienteLayout({ children }) {
  return (
    <>
      <HeaderCliente />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
    </>
  );
}
