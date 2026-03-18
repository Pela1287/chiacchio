"use client";

import { useEffect, useState } from "react";

interface Sucursal {
  id: string;
  codigo: string;
  nombre: string;
}

interface Admin {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  sucursal?: {
    codigo: string;
    nombre: string;
  };
}

export default function SuperAdminsPage() {

  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    password: "",
    sucursalCodigo: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarSucursales();
    cargarAdmins();
  }, []);

  async function cargarSucursales() {
    const res = await fetch("/api/super/sucursales");
    const data = await res.json();

    console.log("SUCURSALES:", data);

    setSucursales(data.sucursales || data);
  }

  async function cargarAdmins() {

    const res = await fetch("/api/super/admins");

    if (!res.ok) {
      console.error("Error cargando admins");
      setAdmins([]);
      return;
    }

    const data = await res.json();

    setAdmins(data.admins || []);

  }

  async function crearAdmin() {
  if (!form.nombre.trim()) {
    alert("Falta el nombre");
    return;
  }

  if (!form.apellido.trim()) {
    alert("Falta el apellido");
    return;
  }

  if (!form.email.trim()) {
    alert("Falta el email");
    return;
  }

  if (!form.password.trim()) {
    alert("Falta la contraseña");
    return;
  }

  if (!form.sucursalCodigo) {
    alert("Debes seleccionar una sucursal");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("/api/super/crear-admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "No se pudo crear el admin");
      return;
    }

    alert("Admin creado correctamente");

    setForm({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      password: "",
      sucursalCodigo: "",
    });

    cargarAdmins();
  } catch (error) {
    console.error("Error creando admin:", error);
    alert("Error de conexión al crear el admin");
  } finally {
    setLoading(false);
  }
}
  return (
    <div style={{ padding: 30 }}>

      <h1>Panel SUPER — Admins</h1>

      <h2>Crear Admin</h2>

      <form
        autoComplete="off"
        style={{ display: "grid", gap: 10, maxWidth: 400 }}
        onSubmit={(e) => {
          e.preventDefault();
          crearAdmin();
        }}
      >

        <input
          id="admin-nombre"
          name="adminNombre"
          autoComplete="off"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) =>
            setForm({ ...form, nombre: e.target.value })
          }
        />

        <input
          id="admin-apellido"
          name="adminApellido"
          autoComplete="off"
          placeholder="Apellido"
          value={form.apellido}
          onChange={(e) =>
            setForm({ ...form, apellido: e.target.value })
          }
        />

        <input
          id="admin-email"
          name="adminEmail"
          type="email"
          autoComplete="off"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          id="admin-telefono"
          name="adminTelefono"
          type="text"
          autoComplete="off"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={(e) =>
            setForm({ ...form, telefono: e.target.value })
          }
        />

        <input
          id="admin-password"
          name="adminPasswordNueva"
          type="password"
          autoComplete="new-password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <select
          id="admin-sucursal"
          name="adminSucursalCodigo"
          value={form.sucursalCodigo}
          onChange={(e) =>
            setForm({ ...form, sucursalCodigo: e.target.value })
          }
        >
          <option value="">Seleccionar sucursal</option>

          {sucursales.map((s) => (
            <option key={s.id} value={s.codigo}>
              {s.codigo} - {s.nombre}
            </option>
          ))}
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear Admin"}
        </button>

      </form>

      <hr style={{ margin: "30px 0" }} />

      <h2>Admins existentes</h2>

        {admins.map((a) => (
          <div key={a.id} style={{ marginBottom: 10 }}>

            <b>{a.nombre} {a.apellido}</b><br />

            {a.email}<br />

            Sucursal: {a.sucursal?.codigo} - {a.sucursal?.nombre}

          </div>
      ))}

    </div>
  );
}