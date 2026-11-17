'use client';

import { createContext, useCallback, useContext, useMemo } from 'react';

import { CHAVES, lerLocal, salvarLocal, useArmazenamentoLocal } from '@/utils/armazenamentoLocal';

const CartContext = createContext(null);

const CARRINHO_VAZIO = { restaurante: null, itens: [] };

// Carrinho no localStorage: { restaurante: { id, nome, taxa_entrega }, itens: [{ id, nome, preco, quantidade }] }
// Regra: produtos de UM restaurante por vez. A API revalida tudo ao finalizar o pedido.
export function CartProvider({ children }) {
  const carrinho = useArmazenamentoLocal(CHAVES.carrinho) ?? CARRINHO_VAZIO;

  // Devolve false, sem alterar nada, se o produto for de OUTRO restaurante:
  // a tela pergunta se o cliente quer esvaziar o carrinho (limpar) e tenta de novo.
  const adicionar = useCallback((restaurante, produto, quantidade = 1) => {
    const atual = lerLocal(CHAVES.carrinho) ?? CARRINHO_VAZIO;
    if (atual.restaurante && atual.restaurante.id !== restaurante.id) return false;

    const existe = atual.itens.some((item) => item.id === produto.id);
    const itens = existe
      ? atual.itens.map((item) =>
          item.id === produto.id ? { ...item, quantidade: item.quantidade + quantidade } : item,
        )
      : [...atual.itens, { id: produto.id, nome: produto.nome, preco: produto.preco, quantidade }];

    const { id, nome, taxa_entrega } = restaurante;
    salvarLocal(CHAVES.carrinho, { restaurante: { id, nome, taxa_entrega }, itens });
    return true;
  }, []);

  // Quantidade 0 remove o item; carrinho sem itens é esvaziado.
  const alterarQuantidade = useCallback((produtoId, quantidade) => {
    const atual = lerLocal(CHAVES.carrinho) ?? CARRINHO_VAZIO;
    const itens =
      quantidade > 0
        ? atual.itens.map((item) => (item.id === produtoId ? { ...item, quantidade } : item))
        : atual.itens.filter((item) => item.id !== produtoId);
    salvarLocal(CHAVES.carrinho, itens.length > 0 ? { ...atual, itens } : null);
  }, []);

  const limpar = useCallback(() => salvarLocal(CHAVES.carrinho, null), []);

  const valor = useMemo(() => {
    // Soma em centavos: somar "49.90" + "6.50" como float acumula erro de arredondamento.
    const centavos = carrinho.itens.reduce(
      (soma, item) => soma + Math.round(Number(item.preco) * 100) * item.quantidade,
      0,
    );
    return {
      restaurante: carrinho.restaurante,
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
