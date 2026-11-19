const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// A API devolve valores DECIMAL como texto ("49.90"): converte só para exibir.
export const formatarMoeda = (valor) => moeda.format(Number(valor ?? 0));

const hora = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });
const dataCurta = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

const mesmoDia = (a, b) => a.toDateString() === b.toDateString();

// "Hoje, 19:42", "Ontem, 08:10" ou "18 jun 2025".
export function formatarDataPedido(valor) {
  const data = new Date(valor);
  const agora = new Date();
  const ontem = new Date(agora);
  ontem.setDate(agora.getDate() - 1);

  if (mesmoDia(data, agora)) return `Hoje, ${hora.format(data)}`;
  if (mesmoDia(data, ontem)) return `Ontem, ${hora.format(data)}`;
  // O Intl devolve "18 de jun. de 2025": tira os "de" e o ponto.
  return dataCurta.format(data).replace(/ de /g, ' ').replace('.', '');
}

// "05435020" → "05435-020" (a API guarda só os dígitos).
export const formatarCep = (cep = '') => cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
