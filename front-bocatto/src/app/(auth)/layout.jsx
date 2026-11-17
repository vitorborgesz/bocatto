import Link from 'next/link';

// Layout de login e cadastro: conteúdo centralizado, sem o header da loja.
export default function AuthLayout({ children }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-8 text-3xl font-bold text-marca">
        Bocatto
      </Link>
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">{children}</div>
    </main>
  );
}
