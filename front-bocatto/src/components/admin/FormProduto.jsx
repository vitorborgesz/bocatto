'use client';

import { useState } from 'react';

import CampoTexto from '@/components/ui/CampoTexto';
import Interruptor from '@/components/ui/Interruptor';
import { mensagemDeErro } from '@/services/api';
import { atualizarProduto, criarProduto } from '@/services/cardapioService';

const classeCampo =
  'w-full rounded-xl border bg-white px-3 text-sm transition-colors outline-none placeholder:text-suave/60 focus:border-marca focus:ring-3 focus:ring-marca/15';

// "12,90" ou "12.90" → 12.9. Devolve NaN se não for número.
const lerPreco = (texto) => Number(texto.trim().replace(/\./g, '').replace(',', '.') || NaN);

// Aceita "12,90" e também "12.90" (quando não há vírgula, o ponto é o decimal).
const paraNumero = (texto) => (texto.includes(',') ? lerPreco(texto) : Number(texto.trim() || NaN));

// Link externo (https://...) ou foto do próprio site, em public/ ("/images/produtos/x.jpg").
function fotoValida(texto) {
  if (texto.startsWith('/')) return /^\/(?!\/)(?!.*\.\.)[\w\-./]+$/.test(texto);
  try {
    return ['http:', 'https:'].includes(new URL(texto).protocol);
  } catch {
    return false;
  }
}

function validar(dados) {
  const erros = {};
  if (dados.nome.trim().length < 2) erros.nome = 'Informe o nome';
  if (!dados.categoria_id) erros.categoria_id = 'Escolha a categoria';
  const preco = paraNumero(dados.preco);
  if (!(preco > 0)) erros.preco = 'Informe um preço maior que zero';
  if (dados.imagem_url.trim() && !fotoValida(dados.imagem_url.trim())) erros.imagem_url = 'Use um link https://... ou /images/produtos/foto.jpg';
  return erros;
}

// Cadastro e edição de produto (dentro do Modal). produto = null → novo.
export default function FormProduto({ produto, categorias, categoriaInicial, aoSalvar, aoCancelar }) {
  const [dados, setDados] = useState({
    nome: produto?.nome ?? '',
    categoria_id: String(produto?.categoria_id ?? categoriaInicial ?? categorias[0]?.id ?? ''),
    preco: produto ? Number(produto.preco).toFixed(2).replace('.', ',') : '',
    descricao: produto?.descricao ?? '',
    imagem_url: produto?.imagem_url ?? '',
    ativo: produto?.ativo ?? true,
  });
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);

  const alterar = (nome) => (e) => setDados((atual) => ({ ...atual, [nome]: e.target.value }));

  const enviar = async (evento) => {
    evento.preventDefault();
    const novosErros = validar(dados);
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    const corpo = {
      nome: dados.nome.trim(),
      categoria_id: Number(dados.categoria_id),
      preco: Math.round(paraNumero(dados.preco) * 100) / 100,
      descricao: dados.descricao.trim() || null,
      imagem_url: dados.imagem_url.trim() || null,
      ativo: dados.ativo,
    };

    setSalvando(true);
    try {
      aoSalvar(produto ? await atualizarProduto(produto.id, corpo) : await criarProduto(corpo));
    } catch (erro) {
      const porCampo = Object.fromEntries(
        (erro.response?.data?.detalhes ?? []).map(({ campo, mensagem }) => [campo, mensagem]),
      );
      setErros({ ...porCampo, geral: mensagemDeErro(erro, 'Não foi possível salvar o produto.') });
      setSalvando(false);
    }
  };

  return (
    <form onSubmit={enviar} noValidate className="mt-6 space-y-4">
      <CampoTexto rotulo="Nome" maxLength={120} value={dados.nome} onChange={alterar('nome')} erro={erros.nome} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="produto-categoria" className="mb-2 block text-xs font-medium">
            Categoria
          </label>
          <select
            id="produto-categoria"
            value={dados.categoria_id}
            onChange={alterar('categoria_id')}
            className={`${classeCampo} h-[38px] ${erros.categoria_id ? 'border-erro' : 'border-borda'}`}
          >
            <option value="" disabled>
              Escolha...
            </option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
          {erros.categoria_id && <p className="mt-1.5 text-xs text-erro">{erros.categoria_id}</p>}
        </div>
        <CampoTexto
          rotulo="Preço (R$)"
          inputMode="decimal"
          placeholder="0,00"
          value={dados.preco}
          onChange={alterar('preco')}
          erro={erros.preco}
        />
      </div>

      <div>
        <label htmlFor="produto-descricao" className="mb-2 block text-xs font-medium">
          Descrição <span className="font-normal text-suave">(opcional)</span>
        </label>
        <textarea
          id="produto-descricao"
          rows={3}
          maxLength={1000}
          value={dados.descricao}
          onChange={alterar('descricao')}
          placeholder="O que vai no prato, tamanho, porção..."
          className={`${classeCampo} resize-none border-borda py-2.5`}
        />
      </div>

      <CampoTexto
        rotulo="Foto (opcional)"
        placeholder="/images/produtos/foto.jpg ou https://..."
        maxLength={500}
        value={dados.imagem_url}
        onChange={alterar('imagem_url')}
        erro={erros.imagem_url}
      />

      <div className="flex items-center justify-between rounded-xl border border-borda bg-white px-4 py-3">
        <div>
          <p className="text-sm font-medium">Disponível no cardápio</p>
          <p className="text-xs text-suave">Desligado, o produto some para os clientes.</p>
        </div>
        <Interruptor
          ligado={dados.ativo}
          rotulo="Disponível no cardápio"
          aoAlternar={() => setDados((atual) => ({ ...atual, ativo: !atual.ativo }))}
        />
      </div>

      {erros.geral && (
        <p role="alert" className="rounded-xl bg-erro/8 px-3 py-2.5 text-sm text-erro">
          {erros.geral}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button type="button" onClick={aoCancelar} className="h-10 rounded-full px-4 text-sm font-medium text-suave hover:text-tinta">
          Cancelar
        </button>
        <button
          type="submit"
          disabled={salvando}
          className="h-10 rounded-full bg-marca px-5 text-sm font-semibold text-white transition-colors hover:bg-marca-escura disabled:opacity-70"
        >
          {salvando ? 'Salvando...' : produto ? 'Salvar alterações' : 'Cadastrar produto'}
        </button>
      </div>
    </form>
  );
}
