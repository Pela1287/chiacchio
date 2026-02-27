"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "../admin/page.module.css";
import Link from "next/link";

function cardStyle(color: string) {

  return {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    borderLeft: `6px solid ${color}`,
    cursor: "pointer"
  };

}

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

    

    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px",
      marginTop: "30px"
    }}>

      <Link href="/panel/super/admins" style={{ textDecoration: "none" }}>
        <div style={cardStyle("#2563eb")}>
          <h2>Admins</h2>
          <p>Crear y gestionar administradores</p>
        </div>
      </Link>

      <Link href="/panel/super/sucursales" style={{ textDecoration: "none" }}>
        <div style={cardStyle("#059669")}>
          <h2>Sucursales</h2>
          <p>Crear y gestionar sucursales</p>
        </div>
      </Link>

      <Link href="/panel/clientes" style={{ textDecoration: "none" }}>
        <div style={cardStyle("#7c3aed")}>
          <h2>Clientes</h2>
          <p>Ver todos los clientes</p>
        </div>
      </Link>

      <Link href="/panel/super/dashboard" style={{ textDecoration: "none" }}>
        <div style={cardStyle("#ea580c")}>
          <h2>Dashboard</h2>
          <p>Estadísticas financieras</p>
        </div>
      </Link>

    </div>

  </div>
);
}