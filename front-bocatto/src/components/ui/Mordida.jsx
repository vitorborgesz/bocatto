import { useId } from 'react';

// Elemento de assinatura da marca: um círculo com uma mordida na borda direita.
export default function Mordida({ className = 'h-6 w-6' }) {
  const mascara = useId();

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <mask id={mascara}>
        <rect width="24" height="24" fill="white" />
        <circle cx="23.5" cy="8.5" r="3.4" fill="black" />
        <circle cx="23" cy="14.5" r="3.4" fill="black" />
      </mask>
      <circle cx="12" cy="12" r="11" fill="currentColor" mask={`url(#${mascara})`} />
    </svg>
  );
}
