"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { setPassword } from "@/lib/db/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { hashPassword } from "@/lib/utils";
import { useAuth } from "@/components/app/AuthContext";

export default function ChangePassword() {
  const { customerId } = useParams();
  const { token } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (!token) {
      setError("Sesión no válida. Vuelve a iniciar sesión.");
      return;
    }

    try {
      
        // Hash the new password before sending it to the server
        const hashedNewPassword = await hashPassword(newPassword);
        const currentHashedPassword = await hashPassword(currentPassword);
        await setPassword(token, customerId as string, currentHashedPassword, hashedNewPassword);

      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Failed to change password. Please check your current password and try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-lg py-md">
      {/* Título y Cabecera */}
      <div className="pb-md border-b border-outline-variant">
        <h2 className="text-headline-md font-bold text-on-surface">Cambiar Contraseña</h2>
        <p className="text-body-md text-on-surface-variant">Actualiza las credenciales de tu cuenta para mantenerla segura.</p>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800 p-md flex items-start gap-md rounded-xl">
          <div className="text-2xl mt-xs">⚠️</div>
          <div>
            <AlertTitle className="font-bold text-red-950">Error al actualizar</AlertTitle>
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </div>
        </Alert>
      )}

      {success && (
        <Alert variant="default" className="bg-emerald-50 border-emerald-200 text-emerald-800 p-md flex items-start gap-md rounded-xl">
          <div className="text-2xl mt-xs">✅</div>
          <div>
            <AlertTitle className="font-bold text-emerald-950">¡Contraseña modificada!</AlertTitle>
            <AlertDescription className="text-emerald-700">Tu contraseña se ha cambiado correctamente.</AlertDescription>
          </div>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-outline-variant rounded-xl p-lg shadow-sm space-y-md">
        <div>
          <Label htmlFor="currentPassword" className="text-label-md font-bold text-on-surface-variant block mb-sm">
            Contraseña Actual
          </Label>
          <Input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="focus-visible:ring-md-primary rounded-lg border-outline-variant bg-surface-container-lowest"
            placeholder="Introduce tu contraseña actual"
            required
          />
        </div>

        <div>
          <Label htmlFor="newPassword" className="text-label-md font-bold text-on-surface-variant block mb-sm">
            Nueva Contraseña
          </Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="focus-visible:ring-md-primary rounded-lg border-outline-variant bg-surface-container-lowest"
            placeholder="Mínimo 6 caracteres"
            required
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="text-label-md font-bold text-on-surface-variant block mb-sm">
            Confirmar Nueva Contraseña
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="focus-visible:ring-md-primary rounded-lg border-outline-variant bg-surface-container-lowest"
            placeholder="Repite la nueva contraseña"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-md bg-md-primary hover:brightness-115 active:scale-95 text-white font-bold rounded-lg transition-all text-label-md flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-white">Actualizar Contraseña</span>
        </button>
      </form>
    </div>
  );
}

