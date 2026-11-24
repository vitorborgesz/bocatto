'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import ConfirmarExclusao from '@/components/admin/ConfirmarExclusao';
import FormProduto from '@/components/admin/FormProduto';
import PainelCategorias from '@/components/admin/PainelCategorias';
import CardProduto from '@/components/cardapio/CardProduto';
import { IconeMais } from '@/components/ui/Icones';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { mensagemDeErro } from '@/services/api';
import { listarCategorias, listarProdutos, listarTodosProdutos } from '@/services/cardapioService';
import { formatarMoeda } from '@/utils/formatadores';

// Cardápio (tela inicial e /cardapio): chips de categoria + produtos. Mesma página para todos.
// Cliente: só os produtos disponíveis.
// Admin: todos os produtos e categorias, mais a gestão do cardápio nesta mesma tela
// (novo produto, editar, excluir, disponível e categorias). A API confere o perfil em cada ação.
export default function Cardapio() {
  const { usuario } = useAuth();
  const ehAdmin = usuario?.perfil === 'admin';
  const [dados, setDados] = useState({ status: 'carregando' });
  const [tentativa, setTentativa] = useState(0);
  const [categoriaEscolhida, setCategoriaEscolhida] = useState(null);
  // Gestão (só admin): undefined = fechado; null = novo produto; objeto = edição.
  const [editando, setEditando] = useState(undefined);
  const [excluindo, setExcluindo] = useState(null);
  const [categoriasAbertas, setCategoriasAbertas] = useState(false);

  useEffect(() => {
    let ativo = true;
    // GET /produtos/todos é só para admin: a API recusa (403) se um cliente tentar.
    Promise.all([listarCategorias(), ehAdmin ? listarTodosProdutos() : listarProdutos()])
      .then(([categorias, produtos]) => ativo && setDados({ status: 'pronto', categorias, produtos }))
      .catch((erro) => {
        if (ativo) setDados({ status: 'erro', mensagem: mensagemDeErro(erro, 'Não foi possível carregar o cardápio.') });
      });
    return () => {
      ativo = false;
    };
  }, [tentativa, ehAdmin]);

  const categorias = dados.categorias ?? [];
  const produtos = dados.produtos ?? [];
  // Cliente: só categorias com produto. Admin: todas (para poder preencher uma categoria vazia).
  const categoriasVisiveis = ehAdmin ? categorias : categorias.filter((c) => produtos.some((p) => p.categoria_id === c.id));
  const contagem = Object.fromEntries(
    categorias.map((c) => [c.id, produtos.filter((p) => p.categoria_id === c.id).length]),
  );

  // Produto criado ou editado. A API devolve sem a categoria: completa com a da lista.
  const salvarProduto = (salvo) => {
    setDados((atual) => {
      const categoria = atual.categorias.find((c) => c.id === salvo.categoria_id);
      const produto = { ...salvo, categoria: categoria ? { id: categoria.id, nome: categoria.nome } : null };
      const existe = atual.produtos.some((p) => p.id === produto.id);
      const lista = existe ? atual.produtos.map((p) => (p.id === produto.id ? produto : p)) : [...atual.produtos, produto];
      return { ...atual, produtos: lista.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')) };
    });
    setEditando(undefined);
  };

  const removerProduto = (id) => {
    setDados((atual) => ({ ...atual, produtos: atual.produtos.filter((p) => p.id !== id) }));
    setExcluindo(null);
  };

  // Categoria criada, renomeada ou excluída: atualiza também o nome mostrado nos produtos.
  const mudarCategorias = (lista) =>
    setDados((atual) => ({
      ...atual,
      categorias: lista,
      produtos: atual.produtos.map((p) => {
        const categoria = lista.find((c) => c.id === p.categoria_id);
        return categoria ? { ...p, categoria: { id: categoria.id, nome: categoria.nome } } : p;
      }),
    }));

  const tentarDeNovo = () => {
    setDados({ status: 'carregando' });
    setTentativa((valor) => valor + 1);
  };

  return (
    <section className="pt-6 pb-24 sm:pt-12 sm:pb-12">
      <p className="text-xs font-bold tracking-[0.14em] text-marca uppercase">Escolha sem pressa</p>
      <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight sm:text-6xl">Cardápio</h1>
      <p className="mt-3 text-suave">Tem coisa boa em todas as direções.</p>

      {ehAdmin && dados.status === 'pronto' && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setCategoriasAbertas(true)}
            className="h-11 rounded-full border border-borda bg-white px-6 text-sm font-semibold transition-colors hover:border-tinta"
          >
            Editar categorias
          </button>
          <button
            type="button"
            onClick={() => setEditando(null)}
            disabled={categorias.length === 0}
            title={categorias.length === 0 ? 'Crie uma categoria primeiro' : undefined}
            className="flex h-11 items-center gap-2 rounded-full bg-marca px-6 text-sm font-semibold text-white transition-colors hover:bg-marca-escura disabled:opacity-60"
          >
            <IconeMais className="h-4 w-4" />
            Novo produto
          </button>
        </div>
      )}

      {dados.status === 'carregando' && <Esqueleto />}

      {dados.status === 'erro' && (
        <div className="mt-10 rounded-2xl border border-borda bg-white p-8 text-center">
          <p className="font-display text-xl font-bold">Ops, a cozinha não respondeu.</p>
          <p className="mt-1 text-sm text-suave">{dados.mensagem}</p>
          <button
            type="button"
            onClick={tentarDeNovo}
            className="mt-5 rounded-full bg-marca px-5 py-2.5 text-sm font-semibold text-white hover:bg-marca-escura"
          >
            Tentar de novo
          </button>
        </div>
      )}

      {dados.status === 'pronto' && categoriasVisiveis.length === 0 && (
        <p className="mt-10 rounded-2xl border border-borda bg-white p-8 text-center text-suave">
          {ehAdmin ? 'Nenhuma categoria ainda. Comece por "Editar categorias".' : 'O cardápio está sendo preparado. Volte daqui a pouco!'}
        </p>
      )}

      {dados.status === 'pronto' && categoriasVisiveis.length > 0 && (
        <ListaPorCategoria
          categorias={categoriasVisiveis}
          produtos={produtos}
          categoriaId={categoriaEscolhida}
          aoEscolher={setCategoriaEscolhida}
          gestao={ehAdmin ? { aoAtualizar: salvarProduto, aoEditar: setEditando, aoExcluir: setExcluindo } : null}
        />
      )}

      <BarraCarrinho />

      {ehAdmin && (
        <>
          <Modal
            aberto={editando !== undefined}
            aoFechar={() => setEditando(undefined)}
            titulo={editando ? 'Editar produto' : 'Novo produto'}
          >
            <FormProduto
              key={editando?.id ?? 'novo'}
              produto={editando ?? null}
              categorias={categorias}
              categoriaInicial={categoriaEscolhida}
              aoSalvar={salvarProduto}
              aoCancelar={() => setEditando(undefined)}
            />
          </Modal>

          <Modal aberto={Boolean(excluindo)} aoFechar={() => setExcluindo(null)} titulo="Excluir produto?">
            {excluindo && (
              <ConfirmarExclusao produto={excluindo} aoExcluir={removerProduto} aoCancelar={() => setExcluindo(null)} />
            )}
          </Modal>

          <Modal aberto={categoriasAbertas} aoFechar={() => setCategoriasAbertas(false)} titulo="Categorias">
            <PainelCategorias categorias={categorias} contagem={contagem} aoMudar={mudarCategorias} />
          </Modal>
        </>
      )}
    </section>
  );
}

// categoriaId null = "Todos": o cardápio inteiro, separado por categoria.
function ListaPorCategoria({ categorias, produtos, categoriaId, aoEscolher, gestao }) {
  const escolhida = categorias.find((c) => c.id === categoriaId) ?? null;
  const grupos = (escolhida ? [escolhida] : categorias).map((categoria) => ({
    categoria,
    itens: produtos.filter((p) => p.categoria_id === categoria.id),
  }));
  // A "mordida" aparece uma vez só: no primeiro card sem foto.
  const primeiroSemFoto = grupos.flatMap((g) => g.itens).find((p) => !p.imagem_url)?.id;

  return (
    <>
      <div className="-mx-4 mt-10 overflow-x-auto px-4 scrollbar-none">
        <div role="tablist" className="inline-flex gap-2 rounded-full border border-borda bg-creme p-1.5">
          {[{ id: null, nome: 'Todos' }, ...categorias].map((c) => {
            const ativa = c.id === (escolhida?.id ?? null);
            return (
              <button
                key={c.id ?? 'todos'}
                type="button"
                role="tab"
                aria-selected={ativa}
                onClick={() => aoEscolher(c.id)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
                  ativa
                    ? 'border-marca-clara bg-marca-clara text-marca'
                    : 'border-borda bg-white text-tinta hover:border-tinta/40'
                }`}
              >
                {c.nome}
              </button>
            );
          })}
        </div>
      </div>

      {grupos.map(({ categoria, itens }) => (
        <section key={categoria.id} aria-label={categoria.nome}>
          {/* Com "Todos", cada categoria ganha um título; com uma só, os chips já dizem qual é. */}
          {!escolhida && (
            <h2 className="mt-10 flex items-baseline gap-2 font-display text-2xl font-bold tracking-tight">
              {categoria.nome}
              <span className="font-sans text-sm font-normal text-suave tabular-nums">{itens.length}</span>
            </h2>
          )}
          {itens.length === 0 && (
            <p className={`text-sm text-suave ${escolhida ? 'mt-6' : 'mt-4'}`}>Nenhum produto nesta categoria ainda.</p>
          )}
          <div className={`grid gap-4 md:grid-cols-2 ${escolhida ? 'mt-6' : 'mt-4'}`}>
            {itens.map((produto) => (
              <CardProduto
                key={produto.id}
                produto={produto}
                inicial={categoria.nome.charAt(0)}
                comMordida={produto.id === primeiroSemFoto}
                gestao={gestao}
              />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

// No celular, atalho fixo para o carrinho quando há itens.
function BarraCarrinho() {
  const { quantidadeTotal, subtotal } = useCart();
  if (quantidadeTotal === 0) return null;

  return (
    <Link
      href="/carrinho"
      className="fixed inset-x-4 bottom-4 z-10 flex items-center justify-between rounded-full bg-marca px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-marca/25 sm:hidden"
    >
      <span>Ver carrinho</span>
      <span className="tabular-nums">
        {quantidadeTotal} {quantidadeTotal === 1 ? 'item' : 'itens'} · {formatarMoeda(subtotal)}
      </span>
    </Link>
  );
}

function Esqueleto() {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="mt-10 h-14 w-full max-w-md rounded-full bg-borda/60" />
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="flex h-40 overflow-hidden rounded-2xl border border-borda bg-white">
            <div className="w-28 bg-marca-clara/60 sm:w-33.75" />
            <div className="flex-1 space-y-3 p-5">
              <div className="h-5 w-1/2 rounded bg-borda" />
              <div className="h-3 w-5/6 rounded bg-borda/70" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
