'use client';

import { useState } from 'react';

import { IconeMais } from '@/components/ui/Icones';
import { mensagemDeErro } from '@/services/api';
import { criarCategoria, excluirCategoria, renomearCategoria } from '@/services/cardapioService';

const classeInput =
  'h-9 min-w-0 flex-1 rounded-xl border border-borda bg-white px-3 text-sm outline-none placeholder:text-suave/60 focus:border-marca focus:ring-3 focus:ring-marca/15';
const link = 'text-xs font-medium underline underline-offset-2 hover:text-marca disabled:opacity-40 disabled:no-underline';

// Conteúdo da janela "Categorias" do cardápio (só admin): lista, cria, renomeia e exclui.
// aoMudar(lista) recebe a lista nova de categorias.
export default function PainelCategorias({ categorias, contagem, aoMudar }) {
  const [nova, setNova] = useState('');
  const [editando, setEditando] = useState(null); // { id, nome }
  const [excluindo, setExcluindo] = useState(null); // id
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState(null);

  const executar = async (acao, padrao) => {
    setOcupado(true);
    setErro(null);
    try {
      await acao();
      return true;
    } catch (e) {
      setErro(mensagemDeErro(e, padrao));
      return false;
    } finally {
      setOcupado(false);
    }
  };

  const adicionar = async (evento) => {
    evento.preventDefault();
    const nome = nova.trim();
    if (nome.length < 2) return setErro('O nome precisa ter pelo menos 2 letras.');
    const ok = await executar(async () => {
      const criada = await criarCategoria(nome);
      aoMudar([...categorias, criada]);
    }, 'Não foi possível criar a categoria.');
    if (ok) setNova('');
  };

  const salvarNome = async (evento) => {
    evento.preventDefault();
    const nome = editando.nome.trim();
    if (nome.length < 2) return setErro('O nome precisa ter pelo menos 2 letras.');
    const ok = await executar(async () => {
      const atualizada = await renomearCategoria(editando.id, nome);
      aoMudar(categorias.map((c) => (c.id === atualizada.id ? atualizada : c)));
    }, 'Não foi possível renomear.');
    if (ok) setEditando(null);
  };

  const confirmarExclusao = async (id) => {
    const ok = await executar(async () => {
      await excluirCategoria(id);
      aoMudar(categorias.filter((c) => c.id !== id));
    }, 'Não foi possível excluir.');
    if (ok) setExcluindo(null);
  };

  return (
    <div className="mt-4">
      <ul>
        {categorias.map((c) => (
          <li key={c.id} className="border-b border-borda py-3 last:border-b-0">
            {editando?.id === c.id ? (
              <form onSubmit={salvarNome} className="flex items-center gap-2">
                <input
                  autoFocus
                  aria-label="Novo nome da categoria"
                  maxLength={60}
                  value={editando.nome}
                  onChange={(e) => setEditando({ ...editando, nome: e.target.value })}
                  className={classeInput}
                />
                <button type="submit" disabled={ocupado} className={link}>
                  Salvar
                </button>
                <button type="button" onClick={() => setEditando(null)} className={link}>
                  Voltar
                </button>
              </form>
            ) : excluindo === c.id ? (
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-suave">Excluir “{c.nome}”?</span>
                <span className="flex gap-3">
                  <button type="button" disabled={ocupado} onClick={() => confirmarExclusao(c.id)} className={`${link} text-erro`}>
                    Sim, excluir
                  </button>
                  <button type="button" onClick={() => setExcluindo(null)} className={link}>
                    Não
                  </button>
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <span className="min-w-0 truncate text-sm font-medium">
                  {c.nome}{' '}
                  <span className="text-xs font-normal text-suave tabular-nums">
                    · {contagem[c.id] ?? 0} {contagem[c.id] === 1 ? 'produto' : 'produtos'}
                  </span>
                </span>
                <span className="flex shrink-0 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setErro(null);
                      setExcluindo(null);
                      setEditando({ id: c.id, nome: c.nome });
                    }}
                    className={link}
                  >
                    Renomear
                  </button>
                  <button
                    type="button"
                    disabled={(contagem[c.id] ?? 0) > 0}
                    title={(contagem[c.id] ?? 0) > 0 ? 'Mova ou exclua os produtos antes' : undefined}
                    onClick={() => {
                      setErro(null);
                      setEditando(null);
                      setExcluindo(c.id);
                    }}
                    className={link}
                  >
                    Excluir
                  </button>
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>

      <form onSubmit={adicionar} className="mt-4 flex gap-2">
        <input
          aria-label="Nome da nova categoria"
          placeholder="Nova categoria"
          maxLength={60}
          value={nova}
          onChange={(e) => setNova(e.target.value)}
          className={classeInput}
        />
        <button
          type="submit"
          disabled={ocupado}
          aria-label="Adicionar categoria"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-marca text-white transition-colors hover:bg-marca-escura disabled:opacity-60"
        >
          <IconeMais className="h-4 w-4" />
        </button>
      </form>

      {erro && (
        <p role="alert" className="mt-3 rounded-xl bg-erro/8 px-3 py-2 text-xs text-erro">
          {erro}
        </p>
      )}
    </div>
  );
}
