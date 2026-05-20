"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { associateCestaIdWithUsername } from "@/lib/db/actions/cesta-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { hashPassword } from "@/lib/utils";
import * as z from "zod";
import { useAuth } from "@/components/app/AuthContext";
import { getUser } from "@/lib/db/actions/auth-actions";
import Link from "next/link";

const formSchema = z.object({
  username: z.string().min(1, { message: "El usuario es obligatorio" }),
  password: z.string().min(1, { message: "La contraseña es obligatoria" }),
});

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setIsLoggedIn, setUsername, setId, setToken, setRole, idCesta } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    try {
      const hashedPassword = await hashPassword(values.password);
      values.password = hashedPassword;
      const user = await getUser(values.username, values.password);
      if (user) {
        const userRole = typeof user.role === "string" && user.role.length > 0 ? user.role : "customer";
        setIsLoggedIn(true);
        setUsername(user.username);
        setId(user.id);
        setToken(user.token);
        setRole(userRole);
        localStorage.setItem("user", JSON.stringify({ ...user, role: userRole }));
        await associateCestaIdWithUsername(idCesta.toString(), user.username);
        router.push(userRole === "admin" ? "/admin" : `/dashboard/${user.username}`);
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-[#F1F5F9] min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center px-gutter py-2xl">
        <div className="bg-surface-container-lowest w-full max-w-[440px] p-xl rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.1)]">

          {/* Logo + título */}
          <div className="flex flex-col items-center mb-xl">
            <Link href="/" className="text-headline-md font-bold text-md-primary mb-md hover:opacity-80 transition-opacity">
              KimiShop
            </Link>
            <h1 className="text-headline-md font-bold text-on-surface">Iniciar sesión</h1>
            <p className="text-body-md text-on-surface-variant mt-xs text-center">
              Accede a tu cuenta de KimiShop para gestionar tus pedidos.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-lg p-md bg-md-error-container text-md-on-error-container rounded-lg text-label-md font-medium border border-red-200">
              ⚠️ {error}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-lg">
            {/* Usuario */}
            <div className="space-y-xs">
              <label className="text-label-md font-medium text-on-surface" htmlFor="username">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                placeholder="Tu nombre de usuario"
                className="w-full h-[48px] px-md bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-md-primary focus:border-md-primary transition-all outline-none text-body-md"
                {...form.register("username")}
              />
              {form.formState.errors.username && (
                <p className="text-[12px] text-md-error">{form.formState.errors.username.message}</p>
              )}
            </div>

            {/* Contraseña */}
            <div className="space-y-xs">
              <div className="flex justify-between items-center">
                <label className="text-label-md font-medium text-on-surface" htmlFor="password">
                  Contraseña
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full h-[48px] px-md bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-md-primary focus:border-md-primary transition-all outline-none text-body-md pr-12"
                  {...form.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-[12px] text-md-error">{form.formState.errors.password.message}</p>
              )}
            </div>

            {/* Botón submit */}
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
                  Iniciando sesión...
                </>
              ) : (
                <>
                  Continuar
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Separador */}
          <div className="relative my-xl">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant" />
            </div>
            <div className="relative flex justify-center text-label-md">
              <span className="px-md bg-surface-container-lowest text-on-surface-variant">O continúa con</span>
            </div>
          </div>

          {/* Social buttons (decorativos) */}
          <div className="grid grid-cols-2 gap-md">
            <button className="h-[44px] flex items-center justify-center gap-sm border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors text-on-surface text-label-md">
              <span className="text-lg">G</span> Google
            </button>
            <button className="h-[44px] flex items-center justify-center gap-sm border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors text-on-surface text-label-md">
              <span className="text-lg">🍎</span> Apple
            </button>
          </div>

          {/* Link a registro */}
          <div className="mt-xl text-center">
            <p className="text-body-md text-on-surface-variant">
              ¿No tienes una cuenta?{" "}
              <Link href="/signup" className="text-md-primary font-bold hover:underline">
                Regístrate ahora
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-gutter py-xl max-w-container-max mx-auto gap-md">
          <div>
            <span className="text-headline-md font-bold text-on-surface">KimiShop</span>
            <p className="text-label-md text-on-surface-variant mt-1">© 2026 KimiShop. Todos los derechos reservados.</p>
          </div>
          <div className="flex gap-lg flex-wrap justify-center">
            {["Política de privacidad", "Términos", "Contacto", "Sobre nosotros"].map((l) => (
              <span key={l} className="text-label-md text-on-surface-variant hover:text-md-primary cursor-pointer transition-colors">{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
