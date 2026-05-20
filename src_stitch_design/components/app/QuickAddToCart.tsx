'use client';

import { useState } from 'react';
import { useAuth } from '@/components/app/AuthContext';
import { cesta } from '@/lib/db/actions/cesta-actions';
import { toast } from '@/hooks/use-toast';
import { dispatchCartUpdated } from '@/lib/cart-events';

interface Props {
  productId: number;
  productName: string;
  inStock: boolean;
}

/**
 * Botón de añadir al carrito directo desde las tarjetas del catálogo.
 * - Cantidad fija = 1 (acceso rápido)
 * - Si no está logueado → toast con aviso de login
 * - Estado: idle → loading → éxito (✓) → idle (reset a los 2s)
 */
export function QuickAddToCart({ productId, productName, inStock }: Props) {
  const { username, idCesta, isLoggedIn } = useAuth();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault(); // Evitar que el click llegue al Link padre
    e.stopPropagation();

    if (!inStock) return;

    if (!isLoggedIn) {
      toast({
        title: 'Inicia sesión primero',
        description: 'Necesitas una cuenta para añadir productos a la cesta.',
      });
      return;
    }

    setStatus('loading');
    try {
      await cesta(productId.toString(), idCesta.toString(), username, 1);
      setStatus('success');
      dispatchCartUpdated();
      toast({
        title: '✅ Añadido a la cesta',
        description: `${productName} añadido (x1).`,
      });
      // Reset a idle después de 2 segundos
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      setStatus('error');
      toast({
        variant: 'destructive',
        title: 'Error al añadir',
        description: err instanceof Error ? err.message : 'Inténtalo de nuevo.',
      });
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  if (!inStock) {
    return (
      <button
        disabled
        className="w-full py-3 bg-surface-container border border-outline-variant rounded-lg text-label-md text-on-surface-variant font-medium cursor-not-allowed opacity-60 flex items-center justify-center gap-2"
      >
        Sin stock
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      disabled={status === 'loading'}
      title="Añadir 1 al carrito"
      className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 text-label-md transition-all active:scale-95 ${
        status === 'success'
          ? 'bg-emerald-500 text-white'
          : status === 'error'
          ? 'bg-red-500 text-white'
          : 'bg-md-primary-container text-md-on-primary-container hover:brightness-95'
      } disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      {status === 'loading' ? (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : status === 'success' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m4-9l2 9" />
        </svg>
      )}
      <span className="sr-only">Añadir al carrito</span>
    </button>
  );
}
