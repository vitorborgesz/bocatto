'use client';

import { useState } from 'react';

import CampoTexto from '@/components/ui/CampoTexto';
import { criarEndereco } from '@/services/enderecoService';
import { mensagemDeErro } from '@/services/api';

const VAZIO = { apelido: '', cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '' };

// Mostra o CEP como "00000-000" enquanto digita.
const mascararCep = (valor) =>
  valor
    .replace(/\D/g, '')
    .slice(0, 8)
    .replace(/^(\d{5})(\d)/, '$1-$2');

function validar(dados) {
  const erros = {};
  if (!/^\d{5}-?\d{3}$/.test(dados.cep)) erros.cep = 'CEP inválido';
  if (dados.rua.trim().length < 2) erros.rua = 'Informe a rua';
  if (!dados.numero.trim()) erros.numero = 'Informe o número';
  if (dados.bairro.trim().length < 2) erros.bairro = 'Informe o bairro';
  if (dados.cidade.trim().length < 2) erros.cidade = 'Informe a cidade';
  return erros;
}

// Cadastro de endereço dentro do checkout. Chama aoSalvar(endereco) com o endereço criado.
export default function FormEndereco({ aoSalvar, aoCancelar }) {
  const [dados, setDados] = useState(VAZIO);
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);

  const campo = (nome, ajustar = (valor) => valor) => ({
    name: nome,
    value: dados[nome],
    erro: erros[nome],
    onChange: (e) => setDados((atual) => ({ ...atual, [nome]: ajustar(e.target.value) })),
  });

  const enviar = async (evento) => {
    evento.preventDefault();
    const novosErros = validar(dados);
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    setSalvando(true);
    try {
      const endereco = await criarEndereco({
        ...dados,
        apelido: dados.apelido.trim() || null,
        complemento: dados.complemento.trim() || null,
      });
      aoSalvar(endereco);
    } catch (erro) {
      // Erros de validação da API vêm por campo: { detalhes: [{ campo, mensagem }] }.
      const porCampo = Object.fromEntries(
        (erro.response?.data?.detalhes ?? []).map(({ campo: nome, mensagem }) => [nome, mensagem]),
      );
      setErros({
        ...porCampo,
        geral: erro.response
          ? mensagemDeErro(erro, 'Não foi possível salvar o endereço.')
          : 'Não conseguimos falar com o servidor. Tente de novo em instantes.',
      });
      setSalvando(false);
    }
  };

  return (
    <form onSubmit={enviar} noValidate className="rounded-2xl border border-borda bg-white p-5 sm:p-6">
      <h2 className="font-display text-xl font-bold">Novo endereço</h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-6">
        <CampoTexto
          rotulo="Apelido (opcional)"
          placeholder="Casa, Trabalho..."
          maxLength={40}
          className="sm:col-span-3"
          {...campo('apelido')}
        />
        <CampoTexto
          rotulo="CEP"
          placeholder="00000-000"
          inputMode="numeric"
          autoComplete="postal-code"
          className="sm:col-span-3"
          {...campo('cep', mascararCep)}
        />
        <CampoTexto
          rotulo="Rua"
          autoComplete="address-line1"
          maxLength={150}
          className="sm:col-span-4"
          {...campo('rua')}
        />
        <CampoTexto rotulo="Número" maxLength={20} className="sm:col-span-2" {...campo('numero')} />
        <CampoTexto
          rotulo="Complemento (opcional)"
          placeholder="Apto, bloco, referência"
          autoComplete="address-line2"
          maxLength={100}
          className="sm:col-span-3"
          {...campo('complemento')}
        />
        <CampoTexto rotulo="Bairro" maxLength={100} className="sm:col-span-3" {...campo('bairro')} />
        <CampoTexto
          rotulo="Cidade"
          autoComplete="address-level2"
          maxLength={100}
          className="sm:col-span-6"
          {...campo('cidade')}
        />
      </div>

      {erros.geral && (
        <p role="alert" className="mt-4 rounded-xl bg-erro/8 px-3 py-2.5 text-sm text-erro">
          {erros.geral}
        </p>
      )}

      <div className="mt-5 flex items-center gap-3">
        <button
          type="submit"
          disabled={salvando}
          className="h-10 rounded-full bg-marca px-5 text-sm font-semibold text-white transition-colors hover:bg-marca-escura disabled:opacity-70"
        >
          {salvando ? 'Salvando...' : 'Salvar endereço'}
        </button>
        {aoCancelar && (
          <button
            type="button"
            onClick={aoCancelar}
            className="h-10 rounded-full px-4 text-sm font-medium text-suave hover:text-tinta"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
