'use client';

import { useEffect, useState } from 'react';

import { useCart } from '@/contexts/CartContext';
import { listarProdutos } from '@/services/cardapioService';
import { buscarTaxaEntrega } from '@/services/pedidoService';

// Usado no carrinho e no checkout: busca a taxa de entrega e atualiza o carrinho
// com o cardápio atual (preço, foto; tira o que saiu do cardápio).
// taxa: "5.00" | undefined (carregando) | null (não deu para buscar).
// removidos: nomes dos itens tirados do carrinho.
export function useDadosCarrinho() {
  const { sincronizar } = useCart();
  const [taxa, setTaxa] = useState(undefined);
  const [removidos, setRemovidos] = useState([]);

  useEffect(() => {
    let ativo = true;

    buscarTaxaEntrega()
      .then((valor) => ativo && setTaxa(valor))
      .catch(() => ativo && setTaxa(null));

    // Se a API falhar, segue com o que já está salvo no carrinho.
    listarProdutos()
      .then((produtos) => {
        if (ativo) setRemovidos(sincronizar(produtos));
      })
      .catch(() => {});

    return () => {
      ativo = false;
    };
  }, [sincronizar]);

  return { taxa, removidos };
}
