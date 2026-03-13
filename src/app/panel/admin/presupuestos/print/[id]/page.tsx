'use client'

import { useEffect, useState } from "react"

export default function PrintPresupuesto({ params }: any) {

  const [presupuesto, setPresupuesto] = useState<any>(null)

  useEffect(() => {

    fetch(`/api/admin/presupuestos/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setPresupuesto(data)
      })

  }, [params.id])

  useEffect(() => {
    if (presupuesto) {
      setTimeout(() => window.print(), 500)
    }
  }, [presupuesto])

  if (!presupuesto) {
    return <div style={{ padding: 40 }}>Cargando presupuesto...</div>
  }

  return (
<>
  <div style={{ padding: 40, fontFamily: "Arial" }}>

    <div style={{ marginBottom: 30 }}>
      <img src="/logo-chiacchio.png" style={{ width: 260 }} />
    </div>

    <h2>Presupuesto #{presupuesto.numero}</h2>

    <p><strong>Cliente:</strong> {presupuesto.clienteNombre}</p>
    <p><strong>Dirección:</strong> {presupuesto.clienteDireccion}</p>
    <p><strong>Teléfono:</strong> {presupuesto.clienteTelefono}</p>

    <table
      style={{
        width: "100%",
        marginTop: 30,
        borderCollapse: "collapse"
      }}
    >
      <thead>
        <tr>
          <th style={{ borderBottom: "1px solid black" }}>Descripción</th>
          <th style={{ borderBottom: "1px solid black" }}>Cant.</th>
          <th style={{ borderBottom: "1px solid black" }}>Precio</th>
          <th style={{ borderBottom: "1px solid black" }}>Subtotal</th>
        </tr>
      </thead>

      <tbody>
        {presupuesto.items.map((item:any,i:number)=>(
          <tr key={i}>
            <td>{item.descripcion}</td>
            <td>{item.cantidad}</td>
            <td>${item.precioUnitario}</td>
            <td>${item.subtotal}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <div style={{ marginTop: 40, textAlign: "right" }}>
      <h2>Total: ${presupuesto.total}</h2>
    </div>

  </div>
</>
)
}