export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const tecnicos = await prisma.tecnico.findMany({
    where: { activo: true },
    select: {
      id: true,
      nombre: true,
      apellido: true,
      especialidad: true,
      telefono: true,
      avatar: true,
      _count: { select: { solicitudes: true } },
    },
    orderBy: { nombre: "asc" },
  });

  return NextResponse.json(tecnicos);
}