"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCustomer } from "@/lib/db/actions/customer-actions";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/components/app/AuthContext";

interface Customer {
  CustomerID: string;
  CompanyName: string;
  ContactName: string;
  ContactTitle: string;
  Address: string;
  City: string;
  Region: string | null;
  PostalCode: string;
  Country: string;
  Phone: string;
  Fax: string | null;
}

export default function CustomerProfile() {
  const { customerId } = useParams();
  const { token, loading: authLoading } = useAuth();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    setError(null);
    if (authLoading || !token) return;

    let cancelled = false;
    setLoadingProfile(true);
    (async () => {
      try {
        const customerData = (await getCustomer(
          token,
          customerId as string
        )) as Customer | null;
        if (!cancelled) {
          setCustomer(customerData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "No se pudieron cargar los datos."
          );
        }
        console.error(err);
      } finally {
        if (!cancelled) setLoadingProfile(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [customerId, token, authLoading]);

  if (authLoading) {
    return <div className="p-4">Cargando perfil…</div>;
  }

  if (!token) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Sesión requerida</AlertTitle>
        <AlertDescription>
          Debes iniciar sesión para ver tu perfil.
        </AlertDescription>
      </Alert>
    );
  }

  if (loadingProfile) {
    return <div className="p-4">Cargando perfil…</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!customer) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Sin datos</AlertTitle>
        <AlertDescription>No se encontró el cliente.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-lg">
      {/* Título y CTA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md pb-md border-b border-outline-variant">
        <div>
          <h2 className="text-headline-md font-bold text-on-surface">Datos de Perfil</h2>
          <p className="text-body-md text-on-surface-variant">Detalle de tu cuenta corporativa y dirección de facturación/envío.</p>
        </div>
        <Link
          href={`/dashboard/${customerId}/profile/edit`}
          className="inline-flex items-center gap-2 px-lg py-md bg-md-primary text-white font-bold rounded-lg hover:brightness-115 active:scale-95 transition-all text-label-md shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-2.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Editar Perfil
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        {/* Información de la empresa */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-sm space-y-md">
          <div className="flex items-center gap-md pb-sm border-b border-outline-variant">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-md-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-headline-sm font-bold text-on-surface">Datos de la Empresa</h3>
          </div>

          <div className="space-y-sm">
            <div className="flex justify-between py-sm border-b border-outline-variant/40">
              <span className="text-label-md text-on-surface-variant">Nombre de Empresa:</span>
              <span className="text-body-md font-bold text-on-surface text-right">{customer.CompanyName}</span>
            </div>
            <div className="flex justify-between py-sm border-b border-outline-variant/40">
              <span className="text-label-md text-on-surface-variant">Nombre de Contacto:</span>
              <span className="text-body-md font-bold text-on-surface text-right">{customer.ContactName}</span>
            </div>
            <div className="flex justify-between py-sm">
              <span className="text-label-md text-on-surface-variant">Cargo del Contacto:</span>
              <span className="text-body-md font-bold text-on-surface text-right">{customer.ContactTitle}</span>
            </div>
          </div>
        </div>

        {/* Información de contacto */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-sm space-y-md">
          <div className="flex items-center gap-md pb-sm border-b border-outline-variant">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-headline-sm font-bold text-on-surface">Dirección y Contacto</h3>
          </div>

          <div className="space-y-xs">
            <div className="flex justify-between py-xs border-b border-outline-variant/40">
              <span className="text-label-md text-on-surface-variant">Dirección:</span>
              <span className="text-body-md font-bold text-on-surface text-right">{customer.Address}</span>
            </div>
            <div className="flex justify-between py-xs border-b border-outline-variant/40">
              <span className="text-label-md text-on-surface-variant">Ciudad:</span>
              <span className="text-body-md font-bold text-on-surface text-right">{customer.City}</span>
            </div>
            <div className="flex justify-between py-xs border-b border-outline-variant/40">
              <span className="text-label-md text-on-surface-variant">Región / Estado:</span>
              <span className="text-body-md font-bold text-on-surface text-right">{customer.Region || "N/A"}</span>
            </div>
            <div className="flex justify-between py-xs border-b border-outline-variant/40">
              <span className="text-label-md text-on-surface-variant">Código Postal:</span>
              <span className="text-body-md font-bold text-on-surface text-right">{customer.PostalCode}</span>
            </div>
            <div className="flex justify-between py-xs border-b border-outline-variant/40">
              <span className="text-label-md text-on-surface-variant">País:</span>
              <span className="text-body-md font-bold text-on-surface text-right">{customer.Country}</span>
            </div>
            <div className="flex justify-between py-xs border-b border-outline-variant/40">
              <span className="text-label-md text-on-surface-variant">Teléfono:</span>
              <span className="text-body-md font-bold text-on-surface text-right">{customer.Phone}</span>
            </div>
            <div className="flex justify-between py-xs">
              <span className="text-label-md text-on-surface-variant">Fax:</span>
              <span className="text-body-md font-bold text-on-surface text-right">{customer.Fax || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
