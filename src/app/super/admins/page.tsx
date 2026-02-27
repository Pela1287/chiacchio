"use client";

import { useEffect, useMemo, useState } from "react";

type Sucursal = { id: string; codigo: string; nombre: string };
type Admin = {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string | null;
  activo: boolean;
  createdAt: string;
  sucursal?: { codigo: string; nombre: string } | null;
};

export default function SuperAdminsPage() {
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string>("");

  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);

  // form
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [sucursalCodigo, setSucursalCodigo] = useState("001"); // default

  const sucursalLabel = useMemo(() => {
    const s = sucursales.find(x => x.codigo === sucursalCodigo);
    return s ? `${s.codigo} - ${s.nombre}` : sucursalCodigo;
  }, [sucursales, sucursalCodigo]);

  async function loadAll() {
    setLoading(true);
    setError("");

    try {
      const [sRes, aRes] = await Promise.all([
        fetch("/api/super/sucursales", { cache: "no-store" }),
        fetch("/api/super/admins", { cache: "no-store" }),
      ]);

      const sJson = await sRes.json();
      const aJson = await aRes.json();

      if (!sRes.ok) throw new Error(sJson.error || "No pude cargar sucursales");
      if (!aRes.ok) throw new Error(aJson.error || "No pude cargar admins");

      setSucursales(sJson.sucursales || []);
      setAdmins(aJson.admins || []);
    } catch (e: any) {
      setError(e?.message || "Error cargando datos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function crearAdmin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!nombre || !apellido || !email || !password) {
      setError("Completá nombre, apellido, email y contraseña.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/super/crear-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          apellido,
          email,
          telefono,
          password,
          sucursalCodigo,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "No se pudo crear el admin");
      }

      // limpiar form
      setNombre("");
      setApellido("");
      setEmail("");
      setTelefono("");
      setPassword("");

      await loadAll();
    } catch (e: any) {
      setError(e?.message || "Error creando admin");
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.h1}>Super • Admins</h1>
        <p style={styles.p}>
          Creá admins por sucursal y revisá los existentes. Hoy arrancamos con{" "}
          <b>{sucursalLabel}</b>.
        </p>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      <div style={styles.grid}>
        <section style={styles.card}>
          <h2 style={styles.h2}>Crear Admin</h2>

          <form onSubmit={crearAdmin} style={styles.form}>
            <div style={styles.row2}>
              <Field label="Nombre">
                <input style={styles.input} value={nombre} onChange={e => setNombre(e.target.value)} />
              </Field>
              <Field label="Apellido">
                <input style={styles.input} value={apellido} onChange={e => setApellido(e.target.value)} />
              </Field>
            </div>

            <Field label="Email">
              <input style={styles.input} value={email} onChange={e => setEmail(e.target.value)} />
            </Field>

            <Field label="Teléfono (opcional)">
              <input style={styles.input} value={telefono} onChange={e => setTelefono(e.target.value)} />
            </Field>

            <Field label="Contraseña">
              <input
                style={styles.input}
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </Field>

            <Field label="Sucursal">
              <select
                style={styles.input}
                value={sucursalCodigo}
                onChange={e => setSucursalCodigo(e.target.value)}
              >
                {/* por ahora 001, pero ya queda escalable */}
                {sucursales.length === 0 ? (
                  <option value="001">001 - La Plata</option>
                ) : (
                  sucursales.map(s => (
                    <option key={s.id} value={s.codigo}>
                      {s.codigo} - {s.nombre}
                    </option>
                  ))
                )}
              </select>
            </Field>

            <button style={styles.button} disabled={sending}>
              {sending ? "Creando..." : "Crear Admin"}
            </button>
          </form>
        </section>

        <section style={styles.card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <h2 style={styles.h2}>Admins existentes</h2>
            <button style={styles.buttonGhost} onClick={loadAll} disabled={loading}>
              {loading ? "Actualizando..." : "Refrescar"}
            </button>
          </div>

          {loading ? (
            <p style={styles.p}>Cargando...</p>
          ) : admins.length === 0 ? (
            <p style={styles.p}>Todavía no hay admins.</p>
          ) : (
            <div style={styles.list}>
              {admins.map(a => (
                <div key={a.id} style={styles.listItem}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <b>{a.nombre} {a.apellido}</b>
                    <span style={styles.muted}>
                      {a.email} {a.telefono ? `• ${a.telefono}` : ""}
                    </span>
                    <span style={styles.badge}>
                      {a.sucursal ? `${a.sucursal.codigo} ${a.sucursal.nombre}` : "Sin sucursal"}
                    </span>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span style={a.activo ? styles.ok : styles.off}>
                      {a.activo ? "Activo" : "Inactivo"}
                    </span>
                    <div style={styles.muted}>
                      {new Date(a.createdAt).toLocaleString("es-AR")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div style={styles.footerNote}>
        Tip: si te aparece “No autorizado”, asegurate de estar logueado con rol <b>SUPER</b>.
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: any }) {
  return (
    <label style={styles.field}>
      <span style={styles.label}>{label}</span>
      {children}
    </label>
  );
}

const styles: Record<string, any> = {
  page: { padding: 28, maxWidth: 1100, margin: "0 auto" },
  header: { marginBottom: 16 },
  h1: { fontSize: 26, margin: 0 },
  h2: { fontSize: 18, margin: "0 0 12px 0" },
  p: { margin: "8px 0 0 0", opacity: 0.85 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 16, alignItems: "start" },
  card: { border: "1px solid rgba(0,0,0,.12)", borderRadius: 14, padding: 16, background: "#fff" },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, opacity: 0.7 },
  input: { padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(0,0,0,.18)", outline: "none" },
  button: { padding: "10px 12px", borderRadius: 10, border: "none", background: "#0b57d0", color: "#fff", cursor: "pointer" },
  buttonGhost: { padding: "8px 10px", borderRadius: 10, border: "1px solid rgba(0,0,0,.18)", background: "transparent", cursor: "pointer" },
  list: { display: "flex", flexDirection: "column", gap: 10, marginTop: 10 },
  listItem: { display: "flex", justifyContent: "space-between", gap: 14, padding: 12, borderRadius: 12, border: "1px solid rgba(0,0,0,.10)" },
  muted: { fontSize: 12, opacity: 0.7 },
  badge: { display: "inline-flex", width: "fit-content", padding: "2px 8px", borderRadius: 999, background: "rgba(11,87,208,.10)", color: "#0b57d0", fontSize: 12 },
  ok: { color: "#0a7a2f", fontWeight: 600 },
  off: { color: "#9b1c1c", fontWeight: 600 },
  errorBox: { margin: "10px 0 16px", padding: 12, borderRadius: 12, background: "rgba(220,38,38,.10)", color: "#b91c1c" },
  footerNote: { marginTop: 14, fontSize: 12, opacity: 0.7 },
};