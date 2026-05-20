"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/app/AuthContext";
import { getAllCustomers } from "@/lib/db/actions/customer-actions";
import type { AdminCustomerRow } from "@/lib/db/db-types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AdminClientesPage() {
  const { token, loading: authLoading } = useAuth();
  const [rows, setRows] = useState<AdminCustomerRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setError(null);
    if (authLoading) return;
    if (!token) {
      setError("Sesión no disponible.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    void (async () => {
      try {
        const data = await getAllCustomers(token);
        if (!cancelled) setRows(data);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "No se pudieron cargar los clientes.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, authLoading]);

  if (authLoading || loading) {
    return <p className="text-slate-600">Cargando clientes…</p>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Ciudad</TableHead>
            <TableHead>País</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.CustomerID}>
              <TableCell>
                <Link className="text-blue-600 hover:underline" href={`/admin/clientes/${r.CustomerID}`}>
                  {r.CustomerID}
                </Link>
              </TableCell>
              <TableCell>{r.CompanyName ?? "—"}</TableCell>
              <TableCell>{r.ContactName ?? "—"}</TableCell>
              <TableCell>{r.City ?? "—"}</TableCell>
              <TableCell>{r.Country ?? "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
