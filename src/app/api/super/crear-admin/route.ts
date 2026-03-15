export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== "SUPER") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { nombre, apellido, email, telefono, password, sucursalCodigo } = body;

    if (!nombre || !apellido || !email || !password || !sucursalCodigo) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    const sucursal = await prisma.sucursal.findUnique({
      where: { codigo: sucursalCodigo },
    });

    if (!sucursal) {
      return NextResponse.json({ error: "Sucursal inválida" }, { status: 400 });
    }

    const existe = await prisma.user.findUnique({ where: { email } });
    if (existe) {
      return NextResponse.json({ error: "Email ya registrado" }, { status: 400 });
    }

    const hashed = await hash(password, 12);

    const admin = await prisma.user.create({
      data: {
        nombre,
        apellido,
        email,
        telefono: telefono || null,
        password: hashed,
        rol: "ADMIN",
        activo: true,
        emailVerified: new Date(), // admins creados por super: verificados de una
        sucursalId: sucursal.id,
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        rol: true,
        sucursalId: true,
      },
    });

    return NextResponse.json({ success: true, admin });
  } catch (error) {
    console.error("ERROR crear-admin:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}