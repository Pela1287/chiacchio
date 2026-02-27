"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function DashboardPage() {

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/dashboard/metrics")
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <p>Cargando dashboard...</p>;

  return (
    <div style={{ padding: 40 }}>

      <h1>Dashboard Financiero</h1>

      {/* KPIs */}
      <div style={grid}>
        <Card title="Clientes" value={data.totalClientes} />
        <Card title="Ingresos Totales" value={`$${data.ingresosTotales}`} />
      </div>

      {/* Line Chart */}
      <h2>Ingresos por mes</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data.ingresosChart}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="monto"
            stroke="#00ff88"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Bar Chart */}
      <h2>Ingresos comparativo</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.ingresosChart}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="monto" fill="#007bff" />
        </BarChart>
      </ResponsiveContainer>

      {/* Pie Chart */}
      <h2>Estado presupuestos</h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data.presupuestosChart}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
          >
            {data.presupuestosChart.map((_, i) => (
              <Cell
                key={i}
                fill={i === 0 ? "#00ff88" : "#ff4444"}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div style={{
      background: "#111",
      color: "#fff",
      padding: 20,
      borderRadius: 10
    }}>
      <h3>{title}</h3>
      <p style={{ fontSize: 28 }}>{value}</p>
    </div>
  );
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 20,
  marginBottom: 40
};