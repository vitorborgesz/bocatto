// Ícones de traço fino (estilo Lucide), desenhados inline para não depender de pacote.
function Icone({ children, className = 'h-5 w-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export function IconeUsuario(props) {
  return (
    <Icone {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </Icone>
  );
}

export function IconeSacola(props) {
  return (
    <Icone {...props}>
      <path d="M6 7h12l-1 13H7L6 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </Icone>
  );
}

export function IconeMais(props) {
  return (
    <Icone {...props}>
      <path d="M12 5v14M5 12h14" />
    </Icone>
  );
}

export function IconeCheck(props) {
  return (
    <Icone {...props}>
      <path d="m5 12 5 5 9-10" />
    </Icone>
  );
}

export function IconeRelogio(props) {
  return (
    <Icone {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Icone>
  );
}

export function IconeSeta(props) {
  return (
    <Icone {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Icone>
  );
}
