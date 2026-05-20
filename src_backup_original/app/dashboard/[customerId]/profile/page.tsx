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
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Customer Profile</h1>
      <div className="flex justify-end mb-4">
        <Link
          href={`/dashboard/${customerId}/profile/edit`}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Edit Profile
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Company Information
          </h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium text-gray-600">Company Name:</span>{" "}
              {customer.CompanyName}
            </p>
            <p>
              <span className="font-medium text-gray-600">Contact Name:</span>{" "}
              {customer.ContactName}
            </p>
            <p>
              <span className="font-medium text-gray-600">Contact Title:</span>{" "}
              {customer.ContactTitle}
            </p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Contact Information
          </h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium text-gray-600">Address:</span>{" "}
              {customer.Address}
            </p>
            <p>
              <span className="font-medium text-gray-600">City:</span>{" "}
              {customer.City}
            </p>
            <p>
              <span className="font-medium text-gray-600">Region:</span>{" "}
              {customer.Region || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-600">Postal Code:</span>{" "}
              {customer.PostalCode}
            </p>
            <p>
              <span className="font-medium text-gray-600">Country:</span>{" "}
              {customer.Country}
            </p>
            <p>
              <span className="font-medium text-gray-600">Phone:</span>{" "}
              {customer.Phone}
            </p>
            <p>
              <span className="font-medium text-gray-600">Fax:</span>{" "}
              {customer.Fax || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
