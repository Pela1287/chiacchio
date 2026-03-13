// ============================================
// CHIACCHIO - Login
// ============================================

"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Button, Input } from "@/components/ui";
import styles from "./page.module.css";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified") === "1";
  const welcome = searchParams.get("welcome") === "1";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Credenciales incorrectas. Verifica tu email y contraseña.");
        setLoading(false);
        return;
      }

      // 🔥 Fuerza a traer la sesión ya seteada por NextAuth
      const session = await getSession();
      const role = (session?.user as any)?.role;

      if (role === "SUPER") router.replace("/panel/super");
      else if (role === "ADMIN") router.replace("/panel/admin");
      else if (role === "CLIENTE") router.replace("/panel/cliente");
      else router.replace("/panel"); // fallback

      // Nota: no setLoading(false) porque nos vamos de pantalla
    } catch (err) {
      setError("Error al iniciar sesión. Intenta nuevamente.");
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/logo.png"
              alt="Chiacchio"
              width={50}
              height={50}
              className={styles.logoImage}
            />
            <span>Chiacchio</span>
          </Link>
          <h1 className={styles.title}>Iniciar Sesión</h1>
          <p className={styles.description}>
            Accede a tu panel para gestionar tus servicios
          </p>
        </div>

        {verified && (
          <div style={{background:"#d1fae5",border:"1px solid #6ee7b7",borderRadius:8,padding:"12px 16px",marginBottom:16,color:"#065f46",fontSize:"0.875rem",fontWeight:500}}>
            ✅ ¡Email verificado! Ya podés iniciar sesión.
          </div>
        )}
      {welcome && (
        <div style={{background:"#d1fae5",border:"1px solid #6ee7b7",borderRadius:8,padding:"12px 16px",marginBottom:16,color:"#065f46",fontSize:"0.875rem",fontWeight:500}}>
          ✓ Contraseña establecida. Ingresá con tu email y tu nueva contraseña.
        </div>
      )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
          />

          <Input
            label="Contraseña"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          {error && <p className={styles.error}>{error}</p>}

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
          >
            Ingresar
          </Button>
        </form>



        <div className={styles.footer}>
          <p className={styles.footerText}>
            ¿No tienes cuenta?{" "}
            <Link href="/auth/registro" className={styles.footerLink}>
              Registrarse
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}