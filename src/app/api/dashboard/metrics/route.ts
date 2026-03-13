import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {

  const totalClientes = await prisma.cliente.count();

  const pagos = await prisma.pago.findMany({
    select: {
      monto: true,
      createdAt: true
    }
  });

  const presupuestos = await prisma.presupuesto.findMany({
    select: {
      estado: true,
      createdAt: true
    }
  });

  // ingresos por mes
  const ingresosPorMes: Record<string, number> = {};

  pagos.forEach(p => {
    const mes = new Date(p.createdAt).toLocaleString("es-AR", {
      month: "short",
      year: "numeric"
    });

    ingresosPorMes[mes] = (ingresosPorMes[mes] || 0) + p.monto.toNumber();

  });

  const ingresosChart = Object.entries(ingresosPorMes).map(
    ([mes, monto]) => ({ mes, monto })
  );

  // presupuestos chart
  const presupuestosChart = [
    {
      name: "Aprobados",
      value: presupuestos.filter(p => p.estado === "APROBADO").length
    },
    {
      name: "Pendientes",
      value: presupuestos.filter(p => p.estado !== "APROBADO").length
    }
  ];

  const ingresosTotales = pagos.reduce((a, b) => a + b.monto, 0);

  return NextResponse.json({
    totalClientes,
    ingresosTotales,
    ingresosChart,
    presupuestosChart
  });
}