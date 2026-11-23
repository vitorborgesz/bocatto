'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import LinhaPedido from '@/components/pedidos/LinhaPedido';
import PedidoEmAndamento from '@/components/pedidos/PedidoEmAndamento';
import { EM_ANDAMENTO } from '@/components/pedidos/statusPedido';
import Mordida from '@/components/ui/Mordida';
import { mensagemDeErro } from '@/services/api';
import { listarMeusPedidos } from '@/services/pedidoService';

// Enquanto houver pedido a caminho, a lista é atualizada sozinha neste intervalo.
const ATUALIZAR_A_CADA_MS = 20_000;

export default function MeusPedidos() {
  const [dados, setDados] = useState({ status: 'carregando' });
  const [tentativa, setTentativa] = useState(0);

  const buscar = useCallback(
    () =>
      listarMeusPedidos().then(
        (pedidos) => ({ status: 'pronto', pedidos }),
        (erro) => ({ status: 'erro', mensagem: mensagemDeErro(erro, 'Não foi possível carregar seus pedidos.') }),
      ),
    [],
  );

  useEffect(() => {
    let ativo = true;
    buscar().then((resultado) => ativo && setDados(resultado));
    return () => {
      ativo = false;
    };
  }, [buscar, tentativa]);

  const pedidos = dados.status === 'pronto' ? dados.pedidos : [];
  // Todos os pedidos ainda não concluídos ganham o card com as etapas; o resto vai para o histórico.
  const emAndamento = pedidos.filter((p) => EM_ANDAMENTO.includes(p.status));
  const historico = pedidos.filter((p) => !EM_ANDAMENTO.includes(p.status));
  const temPedidoACaminho = emAndamento.length > 0;

  // Atualização em segundo plano: só troca a tela se a busca der certo.
  useEffect(() => {
    if (!temPedidoACaminho) return undefined;
    const timer = setInterval(() => {
      buscar().then((resultado) => resultado.status === 'pronto' && setDados(resultado));
    }, ATUALIZAR_A_CADA_MS);
    return () => clearInterval(timer);
  }, [temPedidoACaminho, buscar]);

  const substituir = (atualizado) =>
    setDados((atual) => ({
      ...atual,
      pedidos: atual.pedidos.map((p) => (p.id === atualizado.id ? atualizado : p)),
    }));

  return (
    <section className="pt-6 pb-12 sm:pt-12">
      <p className="text-xs font-bold tracking-[0.14em] text-marca uppercase">Histórico de boas escolhas</p>
      <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight sm:text-6xl">Meus pedidos</h1>

      {dados.status === 'carregando' && <Esqueleto />}

      {dados.status === 'erro' && (
        <div className="mt-10 rounded-3xl border border-borda bg-white p-8 text-center">
          <p className="font-display text-xl font-bold">Ops, não achamos seus pedidos.</p>
          <p className="mt-1 text-sm text-suave">{dados.mensagem}</p>
          <button
            type="button"
            onClick={() => {
              setDados({ status: 'carregando' });
              setTentativa((v) => v + 1);
            }}
            className="mt-5 rounded-full bg-marca px-5 py-2.5 text-sm font-semibold text-white hover:bg-marca-escura"
          >
            Tentar de novo
          </button>
        </div>
      )}

      {dados.status === 'pronto' && pedidos.length === 0 && (
        <div className="mt-10 flex flex-col items-center rounded-3xl border border-borda bg-white px-6 py-14 text-center">
          <Mordida className="h-12 w-12 text-marca" />
          <p className="mt-5 font-display text-2xl font-bold">Nada por aqui ainda.</p>
          <p className="mt-1 text-suave">Bora dar a primeira mordida?</p>
          <Link
            href="/cardapio"
            className="mt-6 rounded-full bg-marca px-6 py-3 text-sm font-semibold text-white hover:bg-marca-escura"
          >
            Ver cardápio
          </Link>
        </div>
      )}

      {emAndamento.length > 0 && (
        <section className="mt-10" aria-labelledby="titulo-andamento">
          <Titulo id="titulo-andamento" quantidade={emAndamento.length}>
            Em andamento
          </Titulo>
          <div className="mt-4 space-y-4">
            {emAndamento.map((pedido) => (
              <PedidoEmAndamento key={pedido.id} pedido={pedido} aoAtualizar={substituir} />
            ))}
          </div>
        </section>
      )}

      {historico.length > 0 && (
        <section className="mt-10" aria-labelledby="titulo-historico">
          <Titulo id="titulo-historico" quantidade={historico.length}>
            Histórico
          </Titulo>
          <ul className="mt-2">
            {historico.map((pedido) => (
              <LinhaPedido key={pedido.id} pedido={pedido} />
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}

function Titulo({ id, quantidade, children }) {
  return (
    <h2 id={id} className="flex items-baseline gap-2 font-display text-2xl font-bold tracking-tight">
      {children}
      <span className="font-sans text-sm font-normal text-suave tabular-nums">{quantidade}</span>
    </h2>
  );
}

function Esqueleto() {
  return (
    <div aria-hidden="true" className="mt-10 animate-pulse">
      <div className="h-52 rounded-3xl border border-borda bg-white" />
      {[1, 2, 3].map((n) => (
        <div key={n} className="space-y-2 border-b border-borda py-5">
          <div className="h-5 w-20 rounded-full bg-borda" />
          <div className="h-4 w-32 rounded bg-borda/70" />
        </div>
      ))}
    </div>
  );
}
