// Botão liga/desliga (role="switch"), usado para disponível/indisponível.
export default function Interruptor({ ligado, aoAlternar, rotulo, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={ligado}
      aria-label={rotulo}
      disabled={disabled}
      onClick={aoAlternar}
      className={`relative h-6 w-10 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca disabled:opacity-50 ${
        ligado ? 'bg-sucesso' : 'bg-borda'
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
          ligado ? 'translate-x-4' : ''
        }`}
      />
    </button>
  );
}
