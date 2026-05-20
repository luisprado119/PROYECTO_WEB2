"use client";

import { useAuth } from "@/components/app/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Exige sesión válida y rol admin (área comercio).
 */
export default function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { username, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!username) {
      router.replace("/login");
      return;
    }
    if (role !== "admin") {
      router.replace("/");
    }
  }, [username, role, loading, router]);

  if (loading || !username || role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
