"use client";

import { useState, useEffect } from "react";
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
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Edit Customer Profile</h1>
      {success && (
        <Alert variant="default">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Customer data updated successfully. Redirecting...</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="CompanyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ContactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ContactTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="City"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="PostalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Fax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fax</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Save Changes</Button>
        </form>
      </Form>
    </div>
  );
}
