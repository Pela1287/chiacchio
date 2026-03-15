import crypto from "crypto"
import { prisma } from "@/lib/prisma"

export async function crearTokenVerificacion(usuarioId: string) {

  const token = crypto.randomBytes(32).toString("hex")

  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 horas

  await prisma.verificationToken.create({
    data: {
      identifier: usuarioId,
      token,
      expires,
    },
  })

  return token
}