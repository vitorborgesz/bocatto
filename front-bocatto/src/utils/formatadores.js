const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// A API devolve valores DECIMAL como texto ("49.90"): converte só para exibir.
export const formatarMoeda = (valor) => moeda.format(Number(valor ?? 0));
