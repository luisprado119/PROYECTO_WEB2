'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { insertUser } from "@/lib/db/actions/auth-actions";
import { hashPassword } from '@/lib/utils';
import Link from 'next/link';

const formSchema = z.object({
  username: z.string().min(3, { message: 'Mínimo 3 caracteres.' }),
  password: z.string().min(6, { message: 'Mínimo 6 caracteres.' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,/\\])[A-Za-z\d.,/\\]{6,}$/, {
      message: 'Debe incluir mayúscula, minúscula, número y carácter especial (.,/\\).',
    }),
  confirmPassword: z.string(),
  acceptPolicy: z.boolean().refine(val => val === true, { message: 'Debes aceptar la política de seguridad.' }),
  acceptMarketing: z.boolean(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof formSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      acceptPolicy: false,
      acceptMarketing: false,
    },
  });

  const acceptPolicy = watch('acceptPolicy');
  const acceptMarketing = watch('acceptMarketing');

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    try {
      const hashedPassword = await hashPassword(values.password);
      values.password = hashedPassword;
      await insertUser(values.username, values.password, values.acceptPolicy, values.acceptMarketing);
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-[#F1F5F9] min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center px-gutter py-2xl">
        <div className="bg-surface-container-lowest w-full max-w-[480px] p-xl rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.1)]">

          {/* Logo + título */}
          <div className="flex flex-col items-center mb-xl">
            <Link href="/" className="text-headline-md font-bold text-md-primary mb-md hover:opacity-80 transition-opacity">
              KimiShop
            </Link>
            <h1 className="text-headline-md font-bold text-on-surface">Crear cuenta</h1>
            <p className="text-body-md text-on-surface-variant mt-xs text-center">
              Únete a KimiShop y empieza a comprar hoy.
            </p>
          </div>

          {/* Error general */}
          {error && (
            <div className="mb-lg p-md bg-md-error-container text-md-on-error-container rounded-lg text-label-md font-medium">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-lg">

            {/* Usuario */}
            <div className="space-y-xs">
              <label className="text-label-md font-medium text-on-surface" htmlFor="username">Usuario</label>
              <input
                id="username"
                type="text"
                placeholder="Ej: ALFKI"
                className="w-full h-[48px] px-md bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-md-primary focus:border-md-primary transition-all outline-none text-body-md"
                {...register('username')}
              />
              {errors.username && <p className="text-[12px] text-md-error">{errors.username.message}</p>}
            </div>

            {/* Contraseña */}
            <div className="space-y-xs">
              <label className="text-label-md font-medium text-on-surface" htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full h-[48px] px-md bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-md-primary focus:border-md-primary transition-all outline-none text-body-md"
                {...register('password')}
              />
              <p className="text-[11px] text-on-surface-variant">
                Mín. 6 caracteres con mayúscula, minúscula, número y carácter especial (.,/\).
              </p>
              {errors.password && <p className="text-[12px] text-md-error">{errors.password.message}</p>}
            </div>

            {/* Confirmar contraseña */}
            <div className="space-y-xs">
              <label className="text-label-md font-medium text-on-surface" htmlFor="confirmPassword">Confirmar contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="w-full h-[48px] px-md bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-md-primary focus:border-md-primary transition-all outline-none text-body-md"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && <p className="text-[12px] text-md-error">{errors.confirmPassword.message}</p>}
            </div>

            {/* Checkboxes */}
            <div className="space-y-md pt-sm border-t border-outline-variant">
              <label className="flex items-start gap-sm cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-0.5 rounded border-outline-variant text-md-primary focus:ring-md-primary"
                  {...register('acceptPolicy')}
                />
                <span className="text-body-md text-on-surface group-hover:text-md-primary transition-colors">
                  Acepto la <span className="text-md-primary underline">política de seguridad</span>
                </span>
              </label>
              {errors.acceptPolicy && <p className="text-[12px] text-md-error -mt-sm">{errors.acceptPolicy.message}</p>}

              <label className="flex items-start gap-sm cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-0.5 rounded border-outline-variant text-md-primary focus:ring-md-primary"
                  {...register('acceptMarketing')}
                />
                <span className="text-body-md text-on-surface-variant group-hover:text-on-surface transition-colors">
                  Acepto recibir comunicaciones de marketing
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[48px] bg-md-primary-container text-md-on-primary-container font-bold text-button-text rounded-lg hover:brightness-110 active:scale-95 transition-all duration-200 shadow-sm flex items-center justify-center gap-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creando cuenta...
                </>
              ) : (
                <>
                  Crear cuenta
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Link a login */}
          <div className="mt-xl text-center">
            <p className="text-body-md text-on-surface-variant">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-md-primary font-bold hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-gutter py-xl max-w-container-max mx-auto gap-md">
          <span className="text-headline-md font-bold text-on-surface">KimiShop</span>
          <p className="text-label-md text-on-surface-variant">© 2026 KimiShop. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
