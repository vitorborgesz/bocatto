'use client';

import { useCallback, useEffect, useState } from 'react';

import CardPedidoAdmin from '@/components/admin/CardPedidoAdmin';
import { EM_ANDAMENTO } from '@/components/pedidos/statusPedido';
import Mordida from '@/components/ui/Mordida';
import { mensagemDeErro } from '@/services/api';
import { listarTodosPedidos } from '@/services/pedidoService';
import { formatarMoeda } from '@/utils/formatadores';

// Novos pedidos aparecem sozinhos: a lista é recarregada neste intervalo.
const ATUALIZAR_A_CADA_MS = 15_000;

const FILTROS = [
  { id: 'andamento', rotulo: 'Em andamento', status: EM_ANDAMENTO },
  { id: 'pendente', rotulo: 'Pendentes', status: ['pendente'] },
  { id: 'em_preparo', rotulo: 'Em preparo', status: ['em_preparo'] },
  { id: 'saiu_para_entrega', rotulo: 'Saiu para entrega', status: ['saiu_para_entrega'] },
  { id: 'entregue', rotulo: 'Entregues', status: ['entregue'] },
  { id: 'cancelado', rotulo: 'Cancelados', status: ['cancelado'] },
  { id: 'todos', rotulo: 'Todos', status: null },
];

const hora = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });

// Tela /admin: pedidos recebidos, com filtro por status e o próximo passo de cada um.
export default function PainelPedidos() {
  const [dados, setDados] = useState({ status: 'carregando' });
  const [tentativa, setTentativa] = useState(0);
  const [filtroId, setFiltroId] = useState('andamento');

  const buscar = useCallback(
    () =>
      listarTodosPedidos().then(
        (pedidos) => ({ status: 'pronto', pedidos, atualizadoEm: new Date() }),
        (erro) => ({ status: 'erro', mensagem: mensagemDeErro(erro, 'Não foi possível carregar os pedidos.') }),
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

  // Atualização em segundo plano: só troca a tela se a busca der certo.
  useEffect(() => {
    const timer = setInterval(() => {
      buscar().then((resultado) => resultado.status === 'pronto' && setDados(resultado));
    }, ATUALIZAR_A_CADA_MS);
    return () => clearInterval(timer);
  }, [buscar]);

  const pedidos = dados.pedidos ?? [];
  const filtro = FILTROS.find((f) => f.id === filtroId);
  const visiveis = filtro.status ? pedidos.filter((p) => filtro.status.includes(p.status)) : pedidos;
  // Em andamento: o mais antigo primeiro (é o próximo a sair). Nos outros, o mais recente primeiro.
  const ordenados = filtroId === 'andamento' ? [...visiveis].reverse() : visiveis;

  const hoje = new Date().toDateString();
  const vendasHoje = pedidos.filter(
    (p) => p.status !== 'cancelado' && new Date(p.criado_em).toDateString() === hoje,
  );
  const totalHoje = vendasHoje.reduce((soma, p) => soma + Math.round(Number(p.total) * 100), 0) / 100;

  const substituir = (atualizado) =>
    setDados((atual) => ({
      ...atual,
      pedidos: atual.pedidos.map((p) => (p.id === atualizado.id ? atualizado : p)),
    }));

  const tentarDeNovo = () => {
    setDados({ status: 'carregando' });
    setTentativa((n) => n + 1);
  };

  return (
    <section className="pt-6 pb-12 sm:pt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-marca uppercase">Painel da cozinha</p>
          <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight sm:text-6xl">Pedidos</h1>
        </div>
        {dados.status === 'pronto' && (
          <div className="flex gap-3">
            <Numero rotulo="Pedidos hoje" valor={vendasHoje.length} />
            <Numero rotulo="Vendido hoje" valor={formatarMoeda(totalHoje)} />
          </div>
        )}
      </div>

      {dados.status === 'carregando' && (
        <div aria-hidden="true" className="mt-10 grid animate-pulse gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((n) => (
            <div key={n} className="h-72 rounded-2xl bg-borda/60" />
          ))}
        </div>
      )}

      {dados.status === 'erro' && (
        <div className="mt-10 rounded-2xl border border-borda bg-white p-8 text-center">
          <p className="font-display text-xl font-bold">Ops, os pedidos não carregaram.</p>
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

      {dados.status === 'pronto' && (
        <>
          <div className="-mx-4 mt-10 overflow-x-auto px-4 [scrollbar-width:none]">
            <div role="tablist" className="inline-flex gap-2 rounded-full border border-borda bg-creme p-1.5">
              {FILTROS.map((f) => {
                const ativo = f.id === filtroId;
                const quantidade = f.status ? pedidos.filter((p) => f.status.includes(p.status)).length : pedidos.length;
                return (
                  <button
                    key={f.id}
                    type="button"
                    role="tab"
                    aria-selected={ativo}
                    onClick={() => setFiltroId(f.id)}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
                      ativo
                        ? 'border-marca-clara bg-marca-clara text-marca'
                        : 'border-borda bg-white text-tinta hover:border-tinta/40'
                    }`}
                  >
                    {f.rotulo}
                    <span className={`text-xs tabular-nums ${ativo ? 'text-marca' : 'text-suave'}`}>{quantidade}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="mt-4 text-xs text-suave">Atualizado às {hora.format(dados.atualizadoEm)}</p>

          {ordenados.length === 0 ? (
            <div className="mt-6 flex flex-col items-center rounded-3xl border border-borda bg-white px-6 py-14 text-center">
              <Mordida className="h-12 w-12 text-marca" />
              <p className="mt-5 font-display text-2xl font-bold">
                {filtroId === 'andamento' ? 'Cozinha tranquila.' : 'Nenhum pedido aqui.'}
              </p>
              <p className="mt-1 text-suave">
                {filtroId === 'andamento'
                  ? 'Quando chegar um pedido novo, ele aparece aqui.'
                  : 'Troque o filtro para ver outros pedidos.'}
              </p>
            </div>
          ) : (
            <div className="mt-6 grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
              {ordenados.map((pedido) => (
                <CardPedidoAdmin key={pedido.id} pedido={pedido} aoAtualizar={substituir} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

function Numero({ rotulo, valor }) {
  return (
    <div className="rounded-2xl border border-borda bg-white px-4 py-3">
      <p className="text-[11px] font-medium text-suave">{rotulo}</p>
      <p className="mt-0.5 font-display text-xl font-bold tabular-nums">{valor}</p>
    </div>
  );
}
