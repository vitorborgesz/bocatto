import EmConstrucao from '@/components/ui/EmConstrucao';

export const metadata = { title: 'Entrar' };

// Rota: /login — usa login() do AuthContext. Depois de entrar:
// admin → /admin, cliente → /.
export default function LoginPage() {
  return (
    <EmConstrucao
      titulo="Entrar"
      descricao="Formulário de e-mail e senha."
      links={[
        { href: '/cadastro', rotulo: 'Criar conta' },
        { href: '/', rotulo: 'Voltar ao início' },
      ]}
    />
  );
}
