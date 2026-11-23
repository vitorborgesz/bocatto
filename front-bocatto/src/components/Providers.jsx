'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { AvisoProvider } from '@/contexts/AvisoContext';
import { CartProvider } from '@/contexts/CartContext';

// Contextos globais da aplicação (o layout raiz é Server Component e não pode criá-los).
export default function Providers({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <AvisoProvider>{children}</AvisoProvider>
      </CartProvider>
    </AuthProvider>
  );
}
