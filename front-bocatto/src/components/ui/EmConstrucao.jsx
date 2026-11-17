import Link from 'next/link';

// Placeholder TEMPORÁRIO: cada página troca este componente pela tela real.
// `links` existe só para navegar entre as páginas enquanto elas não estão prontas.
export default function EmConstrucao({ titulo, descricao, links = [] }) {
  return (
    <section className="mx-auto max-w-2xl py-16 text-center">
      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
        Em construção
      </span>
      <h1 className="mt-4 text-3xl font-bold">{titulo}</h1>
      <p className="mt-2 text-zinc-600">{descricao}</p>

      {links.length > 0 && (
        <nav className="mt-8 flex flex-wrap justify-center gap-3">
          {links.map(({ href, rotulo }) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium hover:border-marca hover:text-marca"
            >
              {rotulo}
            </Link>
          ))}
        </nav>
      )}
    </section>
  );
}
