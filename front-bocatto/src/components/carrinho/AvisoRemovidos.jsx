// Aviso quando itens saíram do cardápio e foram tirados do carrinho.
export default function AvisoRemovidos({ nomes }) {
  if (nomes.length === 0) return null;
  return (
    <p role="status" className="mt-8 rounded-xl bg-marca-clara px-4 py-3 text-sm">
      {nomes.length === 1
        ? `"${nomes[0]}" saiu do cardápio e foi tirado do seu carrinho.`
        : `${nomes.join(', ')} saíram do cardápio e foram tirados do seu carrinho.`}
    </p>
  );
}
