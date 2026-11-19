import { useId } from 'react';

// Campo de formulário com rótulo e mensagem de erro logo abaixo.
export default function CampoTexto({ rotulo, erro, className = '', ...props }) {
  const id = useId();
  const idErro = `${id}-erro`;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-xs font-medium">
        {rotulo}
      </label>
      <input
        id={id}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? idErro : undefined}
        className={`h-[38px] w-full rounded-xl border bg-white px-3 text-sm transition-colors outline-none placeholder:text-suave/60 focus:border-marca focus:ring-3 focus:ring-marca/15 ${
          erro ? 'border-erro' : 'border-borda'
        }`}
        {...props}
      />
      {erro && (
        <p id={idErro} className="mt-1.5 text-xs text-erro">
          {erro}
        </p>
      )}
    </div>
  );
}
