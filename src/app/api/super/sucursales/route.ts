import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  

  if (!session?.user || role !== "SUPER") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const sucursales = await prisma.sucursal.findMany({
    where: { activa: true },
    select: { id: true, codigo: true, nombre: true },
    orderBy: { codigo: "asc" },
  });

  return NextResponse.json({ sucursales });
}