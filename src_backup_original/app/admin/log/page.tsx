"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/app/AuthContext";
import { getActivityLog } from "@/lib/db/actions/activity-actions";
import type { ActivityLogRow } from "@/lib/db/db-types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminLogPage() {
  const { token, loading: authLoading } = useAuth();
  const [filterUser, setFilterUser] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [rows, setRows] = useState<ActivityLogRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getActivityLog(token, {
        limit: 150,
        username: filterUser.trim() || undefined,
        action: filterAction.trim() || undefined,
      });
      setRows(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cargar el log.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading || !token) {
      if (!authLoading && !token) {
        setError("Sesión no disponible.");
        setLoading(false);
      }
      return;
    }
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- carga inicial; filtros con botón
  }, [token, authLoading]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Log de actividad</h1>

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="log-user">Usuario</Label>
          <Input
            id="log-user"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            placeholder="Opcional"
            className="w-48"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="log-action">Acción</Label>
          <Input
            id="log-action"
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            placeholder="login, signup…"
            className="w-48"
          />
        </div>
        <Button type="button" variant="secondary" onClick={() => void load()} disabled={loading || !token}>
          Aplicar filtros
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {authLoading || loading ? (
        <p className="text-slate-600">Cargando…</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Acción</TableHead>
              <TableHead>Objetivo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="whitespace-nowrap text-xs">{r.fecha}</TableCell>
                <TableCell>{r.username}</TableCell>
                <TableCell>{r.action}</TableCell>
                <TableCell>{r.target ?? "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
