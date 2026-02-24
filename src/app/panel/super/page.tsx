"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "../admin/page.module.css";

export default function SuperDashboard() {

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {

    if (status === "loading") return;

    const role = (session?.user as any)?.role;

    if (role !== "SUPER") {
      router.replace("/panel");
    }

  }, [session, status, router]);

  if (status === "loading") {
    return <div>Cargando...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Panel Super Usuario</h1>

      <div style={{ marginTop: "20px" }}>
        <p><strong>Nombre:</strong> {(session?.user as any)?.name}</p>
        <p><strong>Email:</strong> {(session?.user as any)?.email}</p>
        <p><strong>Rol:</strong> {(session?.user as any)?.role}</p>
      </div>

    </div>
  );
}