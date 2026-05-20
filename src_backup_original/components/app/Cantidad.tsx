'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/app/AuthContext';
import { cesta } from "@/lib/db/actions/cesta-actions";
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';
import { dispatchCartUpdated } from '@/lib/cart-events';

const formSchema = z.object({
  cantidad: z.coerce.number().int().min(1, { message: "Indica al menos 1 unidad" }),
});

interface CantidadProps {
  productoId: number;
  cantidad?: number;
}

export default function Cantidad({ productoId, cantidad }: CantidadProps) {
  const { username, idCesta } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cantidad: cantidad ?? 1,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    
    setIsLoading(true);
    setSuccess(false);
    setError(false);
    try {
      
      await cesta(productoId.toString(), idCesta.toString(), username, values.cantidad);
      setSuccess(true);
      toast({
        title: 'Cesta actualizada',
        description: 'Producto añadido correctamente.',
      });
      dispatchCartUpdated();
    } catch (error) {
      console.error('Error al añadir a la cesta:', error);
      setError(true);
      toast({
        variant: 'destructive',
        title: 'No se pudo actualizar la cesta',
        description: error instanceof Error ? error.message : 'Inténtalo de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-1">
        <FormField
          control={form.control}
          name="cantidad"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cantidad</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading || idCesta <= 0} className="mt-8">
          {isLoading ? 'Añadiendo...' : 'Añadir a la cesta'}
        </Button>
      </form>
      {success && <p className="text-green-500">
        
        <div className="mt-2">
          <Link href="/products" className="text-blue-500 hover:underline mr-4">Seguir comprando</Link>
          <Link href={`/cesta/${idCesta}`} className="text-blue-500 hover:underline">Ver cesta</Link>
        </div>
        Producto añadido a la cesta correctamente
        </p>
        
        }
      {error && <p className="text-red-500">Error al añadir a la cesta</p>}
    </Form>
  );
}

