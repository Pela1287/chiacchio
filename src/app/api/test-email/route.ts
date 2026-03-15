export const dynamic = "force-dynamic";

import { sendVerificationEmail } from "@/lib/email"

export async function GET() {

  await sendVerificationEmail(
    "ncarrizo.nac@gmail.com",
    "token_prueba_123"
  )

  return Response.json({ ok: true })
}