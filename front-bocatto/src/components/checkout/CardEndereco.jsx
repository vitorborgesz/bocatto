import { IconePin } from '@/components/ui/Icones';
import { formatarCep } from '@/utils/formatadores';

// Card de endereço que funciona como opção de rádio (um só selecionado).
export default function CardEndereco({ endereco, selecionado, aoEscolher }) {
  const { apelido, rua, numero, complemento, bairro, cidade, cep } = endereco;
  const ruaENumero = [`${rua}, ${numero}`, complemento].filter(Boolean).join(' · ');

  return (
    <label
      className={`flex cursor-pointer gap-3 rounded-2xl border bg-white p-4 transition-colors has-focus-visible:ring-3 has-focus-visible:ring-marca/20 sm:p-5 ${
        selecionado ? 'border-marca' : 'border-borda hover:border-tinta/30'
      }`}
    >
      <input
        type="radio"
        name="endereco"
        value={endereco.id}
        checked={selecionado}
        onChange={() => aoEscolher(endereco.id)}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[1.5px] ${
          selecionado ? 'border-marca' : 'border-borda'
        }`}
      >
        {selecionado && <span className="h-2 w-2 rounded-full bg-marca" />}
      </span>
      <IconePin className="mt-0.5 h-[18px] w-[18px] shrink-0" />

      <span className="min-w-0">
        {/* Sem apelido, a própria rua vira o título. */}
        <span className="block font-semibold">{apelido || ruaENumero}</span>
        {apelido && <span className="mt-1 block text-sm font-semibold">{ruaENumero}</span>}
        <span className="mt-1 block text-xs text-suave">
          {bairro} · {cidade} · CEP {formatarCep(cep)}
        </span>
      </span>
    </label>
  );
}
