"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCustomerOrders } from "@/lib/db/actions/order-actions";
import Orders, { type CustomerOrderRow } from "@/components/app/Orders";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/components/app/AuthContext";

export default function CustomerOrders() {
	const { customerId } = useParams();
	const { token, loading: authLoading } = useAuth();
	const [orders, setOrders] = useState<CustomerOrderRow[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loadingOrders, setLoadingOrders] = useState(true);

	useEffect(() => {
		setError(null);
		if (authLoading) return;

		if (!token) {
			setError("Debes iniciar sesión para ver tus pedidos.");
			setLoadingOrders(false);
			return;
		}

		let cancelled = false;
		setLoadingOrders(true);
		(async () => {
			try {
				const orderData = await getCustomerOrders(token, customerId as string);
				if (!cancelled) {
					setOrders(orderData as CustomerOrderRow[]);
				}
			} catch (err) {
				if (!cancelled) {
					setError(
						err instanceof Error
							? err.message
							: "No se pudieron cargar los pedidos."
					);
				}
				console.error(err);
			} finally {
				if (!cancelled) setLoadingOrders(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [customerId, token, authLoading]);

	if (authLoading || loadingOrders) {
		return <div className="p-4">Cargando pedidos…</div>;
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
		<Orders orders={orders} customerId={customerId as string} />
	);
}
