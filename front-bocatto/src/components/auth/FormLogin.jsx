'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { comVoltar, destinoDoUsuario, destinoSeguro } from '@/components/auth/destino';
import CampoTexto from '@/components/ui/CampoTexto';
import { IconeSeta } from '@/components/ui/Icones';
import { useAuth } from '@/contexts/AuthContext';
import { mensagemDeErro } from '@/services/api';

export default function FormLogin() {
  const { usuario, login } = useAuth();
  const router = useRouter();
  const voltar = destinoSeguro(useSearchParams().get('voltar'));

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);

  // Já logado (inclusive logo depois de entrar): segue para o destino.
  useEffect(() => {
    if (usuario) router.replace(destinoDoUsuario(usuario, voltar));
  }, [usuario, voltar, router]);

  const enviar = async (evento) => {
    evento.preventDefault();

    const novosErros = {};
    if (!email.trim()) novosErros.email = 'Informe o e-mail';
    if (!senha) novosErros.senha = 'Informe a senha';
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    setEnviando(true);
    try {
      await login({ email: email.trim(), senha });
      // O redirecionamento acontece no useEffect, quando a sessão é salva.
    } catch (erro) {
      setErros({
        geral: erro.response
          ? mensagemDeErro(erro, 'Não foi possível entrar.')
          : 'Não conseguimos falar com o servidor. Tente de novo em instantes.',
      });
      setEnviando(false);
    }
  };

  return (
    <>
      <p className="text-[10px] font-bold tracking-[0.14em] text-marca uppercase">Bom te ver</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.05] font-extrabold tracking-tight">
        Entre. A fome não espera.
      </h1>

      <form onSubmit={enviar} noValidate className="mt-6">
        <CampoTexto
          rotulo="E-mail"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="voce@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          erro={erros.email}
        />
        <CampoTexto
          rotulo="Senha"
          type="password"
          name="senha"
          autoComplete="current-password"
          placeholder="Sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          erro={erros.senha}
          className="mt-4"
        />

        {erros.geral && (
          <p role="alert" className="mt-4 rounded-xl bg-erro/8 px-3 py-2.5 text-sm text-erro">
            {erros.geral}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="mt-5 flex h-9 w-full items-center justify-center gap-2 rounded-full bg-marca text-xs font-semibold text-white transition-colors hover:bg-marca-escura focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca disabled:opacity-70"
        >
          {enviando ? 'Entrando...' : 'Entrar'}
          {!enviando && <IconeSeta className="h-3.5 w-3.5" />}
        </button>
      </form>

      <p className="mt-4 text-center">
        <Link href={comVoltar('/cadastro', voltar)} className="text-sm font-medium underline underline-offset-2 hover:text-marca">
          Criar conta
        </Link>
      </p>
    </>
  );
}
