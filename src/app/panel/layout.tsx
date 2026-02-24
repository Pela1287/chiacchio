"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingOverlay } from "@/components/ui";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login");
    }
  }, [status, router]);

  // Solo mostrar loading mientras verifica sesión
  if (status === "loading") {
    return <LoadingOverlay text="Verificando sesión..." />;
  }

  // Si está autenticado, mostrar contenido SIEMPRE
  return <>{children}</>;
}