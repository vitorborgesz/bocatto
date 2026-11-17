import EmConstrucao from '@/components/ui/EmConstrucao';

export const metadata = { title: 'Criar conta' };

// Rota: /cadastro — usa cadastrar() do authService (cria conta de cliente).
export default function CadastroPage() {
  return (
    <EmConstrucao
      titulo="Criar conta"
      descricao="Formulário de nome, e-mail e senha."
      links={[
        { href: '/login', rotulo: 'Já tenho conta' },
        { href: '/', rotulo: 'Voltar ao início' },
      ]}
    />
  );
}
