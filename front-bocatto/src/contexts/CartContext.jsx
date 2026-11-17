'use client';

import { createContext, useCallback, useContext, useMemo } from 'react';

import { CHAVES, lerLocal, salvarLocal, useArmazenamentoLocal } from '@/utils/armazenamentoLocal';

const CartContext = createContext(null);

const CARRINHO_VAZIO = { itens: [] };

// Carrinho no localStorage: { itens: [{ id, nome, preco, quantidade }] }.
// Serve só para a tela: ao finalizar, a API relê nome e preço do banco.
export function CartProvider({ children }) {
  const carrinho = useArmazenamentoLocal(CHAVES.carrinho) ?? CARRINHO_VAZIO;

  const adicionar = useCallback((produto, quantidade = 1) => {
    const { itens } = lerLocal(CHAVES.carrinho) ?? CARRINHO_VAZIO;
    const existe = itens.some((item) => item.id === produto.id);
    const novosItens = existe
      ? itens.map((item) =>
          item.id === produto.id ? { ...item, quantidade: item.quantidade + quantidade } : item,
        )
      : [...itens, { id: produto.id, nome: produto.nome, preco: produto.preco, quantidade }];

    salvarLocal(CHAVES.carrinho, { itens: novosItens });
  }, []);

  // Quantidade 0 remove o item; carrinho sem itens é esvaziado.
  const alterarQuantidade = useCallback((produtoId, quantidade) => {
    const { itens } = lerLocal(CHAVES.carrinho) ?? CARRINHO_VAZIO;
    const novosItens =
      quantidade > 0
        ? itens.map((item) => (item.id === produtoId ? { ...item, quantidade } : item))
        : itens.filter((item) => item.id !== produtoId);
    salvarLocal(CHAVES.carrinho, novosItens.length > 0 ? { itens: novosItens } : null);
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
      adicionar,
      alterarQuantidade,
      limpar,
    };
  }, [carrinho, adicionar, alterarQuantidade, limpar]);

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
}

export function useCart() {
  const contexto = useContext(CartContext);
  if (!contexto) throw new Error('useCart deve ser usado dentro de <CartProvider>');
  return contexto;
}
