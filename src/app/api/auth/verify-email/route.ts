export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {

  try {

    const { searchParams } = new URL(req.url)

    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json(
        { error: "Token requerido" },
        { status: 400 }
      )
    }

    const record = await prisma.verificationToken.findUnique({
      where: { token }
    })

    if (!record) {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 400 }
      )
    }

    if (record.expires < new Date()) {
      return NextResponse.json(
        { error: "Token expirado" },
        { status: 400 }
      )
    }

    // Confirmar email
    await prisma.user.update({
      where: { id: record.identifier },
      data: {
        emailVerified: new Date()
      }
    })

    // Eliminar token
    await prisma.verificationToken.delete({
      where: { token }
    })

    // Redirigir correctamente
    return NextResponse.redirect(
      `${process.env.APP_URL || "http://localhost:3000"}/auth/login?verified=1`
    )

  } catch (error) {

    console.error("ERROR VERIFY EMAIL:", error)

    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    )
  }

}