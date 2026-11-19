'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { comVoltar, destinoDoUsuario, destinoSeguro } from '@/components/auth/destino';
import CampoTexto from '@/components/ui/CampoTexto';
import { IconeSeta } from '@/components/ui/Icones';
import { useAuth } from '@/contexts/AuthContext';
import { mensagemDeErro } from '@/services/api';
import { cadastrar } from '@/services/authService';

const SENHA_MINIMA = 6;

function validar({ nome, email, senha, confirmacao }) {
  const erros = {};
  if (nome.trim().length < 2) erros.nome = 'Informe seu nome';
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) erros.email = 'Informe um e-mail válido';
  if (senha.length < SENHA_MINIMA) erros.senha = `A senha deve ter pelo menos ${SENHA_MINIMA} caracteres`;
  if (!erros.senha && confirmacao !== senha) erros.confirmacao = 'As senhas não conferem';
  return erros;
}

// Cria a conta (sempre como cliente) e já entra no site.
export default function FormCadastro() {
  const { usuario, login } = useAuth();
  const router = useRouter();
  const voltar = destinoSeguro(useSearchParams().get('voltar'));

  const [dados, setDados] = useState({ nome: '', email: '', senha: '', confirmacao: '' });
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);

  // Logado (inclusive logo depois de criar a conta): segue para o site.
  useEffect(() => {
    if (usuario) router.replace(destinoDoUsuario(usuario, voltar));
  }, [usuario, voltar, router]);

  const campo = (nome) => ({
    name: nome,
    value: dados[nome],
    erro: erros[nome],
    onChange: (e) => setDados((atual) => ({ ...atual, [nome]: e.target.value })),
  });

  const enviar = async (evento) => {
    evento.preventDefault();
    const novosErros = validar(dados);
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    setEnviando(true);
    const credenciais = { email: dados.email.trim(), senha: dados.senha };
    try {
      await cadastrar({ nome: dados.nome.trim(), ...credenciais });
    } catch (erro) {
      // 409 = e-mail já usado; 400 = validação da API, campo a campo.
      const porCampo = Object.fromEntries(
        (erro.response?.data?.detalhes ?? []).map(({ campo: nome, mensagem }) => [nome, mensagem]),
      );
      if (erro.response?.status === 409) porCampo.email = 'Este e-mail já tem conta. Que tal entrar?';
      setErros(
        Object.keys(porCampo).length > 0
          ? porCampo
          : {
              geral: erro.response
                ? mensagemDeErro(erro, 'Não foi possível criar a conta.')
                : 'Não conseguimos falar com o servidor. Tente de novo em instantes.',
            },
      );
      setEnviando(false);
      return;
    }

    // Conta criada: entra direto (o redirecionamento acontece no useEffect).
    try {
      await login(credenciais);
    } catch {
      router.replace(comVoltar('/login', voltar));
    }
  };

  return (
    <>
      <p className="text-[10px] font-bold tracking-[0.14em] text-marca uppercase">Primeira vez por aqui?</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.05] font-extrabold tracking-tight">
        Crie sua conta. A fome agradece.
      </h1>

      <form onSubmit={enviar} noValidate className="mt-6 space-y-4">
        <CampoTexto rotulo="Nome" autoComplete="name" placeholder="Como podemos te chamar?" maxLength={120} {...campo('nome')} />
        <CampoTexto
          rotulo="E-mail"
          type="email"
          autoComplete="email"
          placeholder="voce@email.com"
          maxLength={254}
          {...campo('email')}
        />
        <CampoTexto
          rotulo="Senha"
          type="password"
          autoComplete="new-password"
          placeholder={`Mínimo de ${SENHA_MINIMA} caracteres`}
          {...campo('senha')}
        />
        <CampoTexto
          rotulo="Confirmar senha"
          type="password"
          autoComplete="new-password"
          placeholder="Repita a senha"
          {...campo('confirmacao')}
        />

        {erros.geral && (
          <p role="alert" className="rounded-xl bg-erro/8 px-3 py-2.5 text-sm text-erro">
            {erros.geral}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="mt-1 flex h-9 w-full items-center justify-center gap-2 rounded-full bg-marca text-xs font-semibold text-white transition-colors hover:bg-marca-escura focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca disabled:opacity-70"
        >
          {enviando ? 'Criando conta...' : 'Criar conta'}
          {!enviando && <IconeSeta className="h-3.5 w-3.5" />}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-suave">
        Já tem conta?{' '}
        <Link
          href={comVoltar('/login', voltar)}
          className="font-medium text-tinta underline underline-offset-2 hover:text-marca"
        >
          Entrar
        </Link>
      </p>
    </>
  );
}
