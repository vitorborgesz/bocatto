'use client';

import { useEffect, useState } from 'react';

import ConfirmarExclusao from '@/components/admin/ConfirmarExclusao';
import FormProduto from '@/components/admin/FormProduto';
import LinhaProdutoAdmin from '@/components/admin/LinhaProdutoAdmin';
import PainelCategorias from '@/components/admin/PainelCategorias';
import { IconeMais } from '@/components/ui/Icones';
import Modal from '@/components/ui/Modal';
import { mensagemDeErro } from '@/services/api';
import { listarCategorias, listarTodosProdutos } from '@/services/cardapioService';

// Tela /admin/cardapio: produtos (com disponível/indisponível) e categorias.
export default function GerenciarCardapio() {
  const [dados, setDados] = useState({ status: 'carregando' });
  const [tentativa, setTentativa] = useState(0);
  const [categoriaId, setCategoriaId] = useState(null); // null = todas
  const [editando, setEditando] = useState(undefined); // undefined = fechado; null = novo; objeto = edição
  const [excluindo, setExcluindo] = useState(null); // produto a confirmar a exclusão

  useEffect(() => {
    let ativo = true;
    Promise.all([listarCategorias(), listarTodosProdutos()])
      .then(([categorias, produtos]) => ativo && setDados({ status: 'pronto', categorias, produtos }))
      .catch((erro) => {
        if (ativo) setDados({ status: 'erro', mensagem: mensagemDeErro(erro, 'Não foi possível carregar o cardápio.') });
      });
    return () => {
      ativo = false;
    };
  }, [tentativa]);

  const categorias = dados.categorias ?? [];
  const produtos = dados.produtos ?? [];
  const contagem = Object.fromEntries(
    categorias.map((c) => [c.id, produtos.filter((p) => p.categoria_id === c.id).length]),
  );
  const filtroValido = categorias.some((c) => c.id === categoriaId) ? categoriaId : null;
  const visiveis = filtroValido ? produtos.filter((p) => p.categoria_id === filtroValido) : produtos;
  const indisponiveis = produtos.filter((p) => !p.ativo).length;

  // A API devolve o produto salvo sem a categoria: completa com a da lista.
  const comCategoria = (produto) => {
    const categoria = categorias.find((c) => c.id === produto.categoria_id);
    return { ...produto, categoria: categoria ? { id: categoria.id, nome: categoria.nome } : null };
  };

  const salvarProduto = (salvo) => {
    const produto = comCategoria(salvo);
    setDados((atual) => {
      const existe = atual.produtos.some((p) => p.id === produto.id);
      const lista = existe
        ? atual.produtos.map((p) => (p.id === produto.id ? produto : p))
        : [...atual.produtos, produto];
      return { ...atual, produtos: lista.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')) };
    });
    setEditando(undefined);
  };

  const removerProduto = (id) => {
    setDados((atual) => ({ ...atual, produtos: atual.produtos.filter((p) => p.id !== id) }));
    setExcluindo(null);
  };

  // Categoria renomeada: atualiza o nome mostrado nos produtos também.
  const mudarCategorias = (lista) =>
    setDados((atual) => ({
      ...atual,
      categorias: lista,
      produtos: atual.produtos.map((p) => {
        const categoria = lista.find((c) => c.id === p.categoria_id);
        return categoria ? { ...p, categoria: { id: categoria.id, nome: categoria.nome } } : p;
      }),
    }));

  return (
    <section className="pt-6 pb-12 sm:pt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-marca uppercase">Sua vitrine</p>
          <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight sm:text-6xl">Cardápio</h1>
          {dados.status === 'pronto' && (
            <p className="mt-3 text-suave">
              {produtos.length} produtos · {indisponiveis} {indisponiveis === 1 ? 'indisponível' : 'indisponíveis'}
            </p>
          )}
        </div>
        {dados.status === 'pronto' && (
          <button
            type="button"
            onClick={() => setEditando(null)}
            disabled={categorias.length === 0}
            title={categorias.length === 0 ? 'Crie uma categoria primeiro' : undefined}
            className="flex h-11 items-center gap-2 rounded-full bg-marca px-5 text-sm font-semibold text-white transition-colors hover:bg-marca-escura disabled:opacity-60"
          >
            <IconeMais className="h-4 w-4" />
            Novo produto
          </button>
        )}
      </div>

      {dados.status === 'carregando' && (
        <div aria-hidden="true" className="mt-10 grid animate-pulse gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="h-96 rounded-2xl bg-borda/60" />
          <div className="h-64 rounded-2xl bg-borda/60" />
        </div>
      )}

      {dados.status === 'erro' && (
        <div className="mt-10 rounded-2xl border border-borda bg-white p-8 text-center">
          <p className="font-display text-xl font-bold">Ops, o cardápio não carregou.</p>
          <p className="mt-1 text-sm text-suave">{dados.mensagem}</p>
          <button
            type="button"
            onClick={() => {
              setDados({ status: 'carregando' });
              setTentativa((n) => n + 1);
            }}
            className="mt-5 rounded-full bg-marca px-5 py-2.5 text-sm font-semibold text-white hover:bg-marca-escura"
          >
            Tentar de novo
          </button>
        </div>
      )}

      {dados.status === 'pronto' && (
        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none]">
              <div role="tablist" className="inline-flex gap-2 rounded-full border border-borda bg-creme p-1.5">
                {[{ id: null, nome: 'Todos' }, ...categorias].map((c) => {
                  const ativa = c.id === filtroValido;
                  return (
                    <button
                      key={c.id ?? 'todos'}
                      type="button"
                      role="tab"
                      aria-selected={ativa}
                      onClick={() => setCategoriaId(c.id)}
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

            <div className="mt-6 rounded-2xl border border-borda bg-white px-5">
              {visiveis.length === 0 ? (
                <p className="py-12 text-center text-sm text-suave">Nenhum produto nesta categoria ainda.</p>
              ) : (
                <ul>
                  {visiveis.map((produto) => (
                    <LinhaProdutoAdmin
                      key={produto.id}
                      produto={produto}
                      aoAtualizar={salvarProduto}
                      aoEditar={setEditando}
                      aoExcluir={setExcluindo}
                    />
                  ))}
                </ul>
              )}
            </div>
          </div>

          <PainelCategorias categorias={categorias} contagem={contagem} aoMudar={mudarCategorias} />
        </div>
      )}

      <Modal
        aberto={editando !== undefined}
        aoFechar={() => setEditando(undefined)}
        titulo={editando ? 'Editar produto' : 'Novo produto'}
      >
        <FormProduto
          key={editando?.id ?? 'novo'}
          produto={editando ?? null}
          categorias={categorias}
          categoriaInicial={filtroValido}
          aoSalvar={salvarProduto}
          aoCancelar={() => setEditando(undefined)}
        />
      </Modal>

      <Modal aberto={Boolean(excluindo)} aoFechar={() => setExcluindo(null)} titulo="Excluir produto?">
        {excluindo && (
          <ConfirmarExclusao produto={excluindo} aoExcluir={removerProduto} aoCancelar={() => setExcluindo(null)} />
        )}
      </Modal>
    </section>
  );
}
