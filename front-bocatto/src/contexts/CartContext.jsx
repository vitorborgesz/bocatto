'use client';

import { createContext, useCallback, useContext, useMemo } from 'react';

import { CHAVES, lerLocal, salvarLocal, useArmazenamentoLocal } from '@/utils/armazenamentoLocal';

const CartContext = createContext(null);

const CARRINHO_VAZIO = { itens: [] };

// Mesmo limite por item que a API aceita no pedido.
export const QUANTIDADE_MAXIMA = 99;

const limitar = (quantidade) => Math.min(quantidade, QUANTIDADE_MAXIMA);

// O que o carrinho guarda de cada produto (só para exibir).
const dadosDoProduto = (produto) => ({
  id: produto.id,
  nome: produto.nome,
  preco: produto.preco,
  descricao: produto.descricao ?? null,
  imagem_url: produto.imagem_url ?? null,
  categoria: produto.categoria?.nome ?? null,
});

const salvarItens = (itens) => salvarLocal(CHAVES.carrinho, itens.length > 0 ? { itens } : null);

// Carrinho no localStorage: { itens: [{ id, nome, preco, descricao, imagem_url, categoria, quantidade }] }.
// Serve só para a tela: ao finalizar, a API relê nome e preço do banco.
export function CartProvider({ children }) {
  const armazenado = useArmazenamentoLocal(CHAVES.carrinho);
  const carrinho = armazenado ?? CARRINHO_VAZIO;

  // Devolve a quantidade desse produto no carrinho depois de adicionar.
  const adicionar = useCallback((produto, quantidade = 1) => {
    const { itens } = lerLocal(CHAVES.carrinho) ?? CARRINHO_VAZIO;
    const existe = itens.some((item) => item.id === produto.id);
    const novosItens = existe
      ? itens.map((item) =>
          item.id === produto.id ? { ...item, quantidade: limitar(item.quantidade + quantidade) } : item,
        )
      : [...itens, { ...dadosDoProduto(produto), quantidade: limitar(quantidade) }];

    salvarItens(novosItens);
    return novosItens.find((item) => item.id === produto.id).quantidade;
  }, []);

  // Quantidade 0 remove o item; carrinho sem itens é esvaziado.
  const alterarQuantidade = useCallback((produtoId, quantidade) => {
    const { itens } = lerLocal(CHAVES.carrinho) ?? CARRINHO_VAZIO;
    const novosItens =
      quantidade > 0
        ? itens.map((item) => (item.id === produtoId ? { ...item, quantidade: limitar(quantidade) } : item))
        : itens.filter((item) => item.id !== produtoId);
    salvarItens(novosItens);
  }, []);

  // Atualiza nome, preço e foto com o cardápio atual e tira o que saiu do cardápio.
  // Devolve os nomes dos itens removidos.
  const sincronizar = useCallback((produtosAtivos) => {
    const { itens } = lerLocal(CHAVES.carrinho) ?? CARRINHO_VAZIO;
    const porId = new Map(produtosAtivos.map((produto) => [produto.id, produto]));
    const removidos = itens.filter((item) => !porId.has(item.id)).map((item) => item.nome);
    const novosItens = itens
      .filter((item) => porId.has(item.id))
      .map((item) => ({ ...dadosDoProduto(porId.get(item.id)), quantidade: item.quantidade }));

    // Só grava se algo mudou (evita avisar a tela à toa).
    if (JSON.stringify(novosItens) !== JSON.stringify(itens)) salvarItens(novosItens);
    return removidos;
  }, []);

  const limpar = useCallback(() => salvarLocal(CHAVES.carrinho, null), []);

  const valor = useMemo(() => {
    // Soma em centavos: somar "49.90" + "6.50" como float acumula erro de arredondamento.
    const centavos = carrinho.itens.reduce(
      (soma, item) => soma + Math.round(Number(item.preco) * 100) * item.quantidade,
      0,
    );
    return {
      itens: carrinho.itens,
      quantidadeTotal: carrinho.itens.reduce((soma, item) => soma + item.quantidade, 0),
      subtotal: centavos / 100,
      // true só no primeiro render (servidor/hidratação), antes de ler o localStorage.
      carregando: armazenado === undefined,
      adicionar,
      alterarQuantidade,
      sincronizar,
      limpar,
    };
  }, [carrinho, armazenado, adicionar, alterarQuantidade, sincronizar, limpar]);

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
}

export function useCart() {
  const contexto = useContext(CartContext);
  if (!contexto) throw new Error('useCart deve ser usado dentro de <CartProvider>');
  return contexto;
}
