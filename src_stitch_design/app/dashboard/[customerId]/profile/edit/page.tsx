"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getCustomer, saveCustomer } from "@/lib/db/actions/customer-actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/components/app/AuthContext";
import type { CustomerProfileRow } from "@/lib/db/db-types";

const formSchema = z.object({
  CompanyName: z.string().min(1, "Company Name is required"),
  ContactName: z.string().min(1, "Contact Name is required"),
  ContactTitle: z.string().min(1, "Contact Title is required"),
  Address: z.string().min(1, "Address is required"),
  City: z.string().min(1, "City is required"),
  Region: z.string().nullable(),
  PostalCode: z.string().min(1, "Postal Code is required"),
  Country: z.string().min(1, "Country is required"),
  Phone: z.string().min(1, "Phone is required"),
  Fax: z.string().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditCustomerProfile() {
  const { customerId } = useParams();
  const { token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerProfileRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      CompanyName: "",
      ContactName: "",
      ContactTitle: "",
      Address: "",
      City: "",
      Region: null,
      PostalCode: "",
      Country: "",
      Phone: "",
      Fax: null,
    },
  });

  useEffect(() => {
    setError(null);
    if (authLoading || !token) return;

    async function fetchCustomer() {
      try {
        const customerData = await getCustomer(token, customerId as string);
        if (!customerData) {
          setError("Cliente no encontrado.");
          return;
        }
        setCustomer(customerData);
        // `CustomerID` no entra en el formulario (solo identificación en URL).
        const { CustomerID: _omitCustomerId, ...forForm } = customerData;
        void _omitCustomerId;
        form.reset(forForm);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "No se pudieron cargar los datos."
        );
        console.error(err);
      }
    }

    fetchCustomer();
  }, [customerId, form, token, authLoading]);

  async function onSubmit(values: FormValues) {
    if (!token) {
      setError("Sesión no válida. Vuelve a iniciar sesión.");
      return;
    }
    try {
      await saveCustomer(token, customerId as string, values);
      setSuccess(true);

      setTimeout(() => {
        router.push(`/dashboard/${customerId}/profile`);
      }, 4000);
    } catch (err) {
      setError("Failed to save customer data");
      console.error(err);
    }
  }

  if (authLoading) {
    return <div className="p-4">Cargando…</div>;
  }

  if (!token) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Sesión requerida</AlertTitle>
        <AlertDescription>
          Debes iniciar sesión para editar tu perfil.
        </AlertDescription>
      </Alert>
    );
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
    return <div className="p-4">Cargando datos del cliente…</div>;
  }

  return (
    <div className="space-y-lg max-w-2xl mx-auto">
      {/* Título y Cabecera */}
      <div className="pb-md border-b border-outline-variant flex items-center gap-md">
        <Link
          href={`/dashboard/${customerId}/profile`}
          className="p-sm hover:bg-surface-container rounded-full text-on-surface-variant hover:text-on-surface active:scale-90 transition-all"
          title="Volver al perfil"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h2 className="text-headline-md font-bold text-on-surface">Editar Perfil Corporativo</h2>
          <p className="text-body-md text-on-surface-variant">Modifica los datos de contacto y facturación de tu empresa.</p>
        </div>
      </div>

      {success && (
        <Alert variant="default" className="bg-emerald-50 border-emerald-200 text-emerald-800 p-md flex items-start gap-md rounded-xl">
          <div className="text-2xl mt-xs">✅</div>
          <div>
            <AlertTitle className="font-bold text-emerald-900">¡Perfil Actualizado!</AlertTitle>
            <AlertDescription className="text-emerald-700">Los datos se han guardado con éxito. Redirigiendo al perfil...</AlertDescription>
          </div>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-md">
          
          <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-sm space-y-md">
            <h3 className="text-headline-sm font-bold text-on-surface pb-sm border-b border-outline-variant">Información de Empresa</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <FormField
                control={form.control}
                name="CompanyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-label-md font-bold text-on-surface-variant">Nombre de la Empresa</FormLabel>
                    <FormControl>
                      <Input {...field} className="focus-visible:ring-md-primary rounded-lg border-outline-variant bg-surface-container-lowest" />
                    </FormControl>
                    <FormMessage className="text-red-500 text-[12px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ContactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-label-md font-bold text-on-surface-variant">Nombre del Contacto</FormLabel>
                    <FormControl>
                      <Input {...field} className="focus-visible:ring-md-primary rounded-lg border-outline-variant bg-surface-container-lowest" />
                    </FormControl>
                    <FormMessage className="text-red-500 text-[12px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ContactTitle"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-label-md font-bold text-on-surface-variant">Cargo o Puesto del Contacto</FormLabel>
                    <FormControl>
                      <Input {...field} className="focus-visible:ring-md-primary rounded-lg border-outline-variant bg-surface-container-lowest" />
                    </FormControl>
                    <FormMessage className="text-red-500 text-[12px]" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-sm space-y-md">
            <h3 className="text-headline-sm font-bold text-on-surface pb-sm border-b border-outline-variant">Dirección y Contacto</h3>
            
            <FormField
              control={form.control}
              name="Address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-label-md font-bold text-on-surface-variant">Dirección Completa</FormLabel>
                  <FormControl>
                    <Input {...field} className="focus-visible:ring-md-primary rounded-lg border-outline-variant bg-surface-container-lowest" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-[12px]" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              <FormField
                control={form.control}
                name="City"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-label-md font-bold text-on-surface-variant">Ciudad</FormLabel>
                    <FormControl>
                      <Input {...field} className="focus-visible:ring-md-primary rounded-lg border-outline-variant bg-surface-container-lowest" />
                    </FormControl>
                    <FormMessage className="text-red-500 text-[12px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-label-md font-bold text-on-surface-variant">Región / Estado</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} className="focus-visible:ring-md-primary rounded-lg border-outline-variant bg-surface-container-lowest" />
                    </FormControl>
                    <FormMessage className="text-red-500 text-[12px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="PostalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-label-md font-bold text-on-surface-variant">Código Postal</FormLabel>
                    <FormControl>
                      <Input {...field} className="focus-visible:ring-md-primary rounded-lg border-outline-variant bg-surface-container-lowest" />
                    </FormControl>
                    <FormMessage className="text-red-500 text-[12px]" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              <FormField
                control={form.control}
                name="Country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-label-md font-bold text-on-surface-variant">País</FormLabel>
                    <FormControl>
                      <Input {...field} className="focus-visible:ring-md-primary rounded-lg border-outline-variant bg-surface-container-lowest" />
                    </FormControl>
                    <FormMessage className="text-red-500 text-[12px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-label-md font-bold text-on-surface-variant">Teléfono</FormLabel>
                    <FormControl>
                      <Input {...field} className="focus-visible:ring-md-primary rounded-lg border-outline-variant bg-surface-container-lowest" />
                    </FormControl>
                    <FormMessage className="text-red-500 text-[12px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Fax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-label-md font-bold text-on-surface-variant">Fax (Opcional)</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} className="focus-visible:ring-md-primary rounded-lg border-outline-variant bg-surface-container-lowest" />
                    </FormControl>
                    <FormMessage className="text-red-500 text-[12px]" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row justify-end items-center gap-md pt-md">
            <Link
              href={`/dashboard/${customerId}/profile`}
              className="w-full sm:w-auto px-lg py-md border border-outline-variant text-on-surface hover:bg-surface-container active:scale-95 transition-all rounded-lg font-bold text-center text-label-md"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="w-full sm:w-auto px-xl py-md bg-md-primary hover:brightness-115 active:scale-95 text-white font-bold rounded-lg transition-all text-label-md flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span className="text-white">Guardar Cambios</span>
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}
