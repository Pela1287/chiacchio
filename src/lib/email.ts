import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  token: string
) {

  const verifyUrl =
    `${process.env.APP_URL || "http://localhost:3000"}/api/auth/verify-email?token=${token}`;

  console.log("API KEY:", process.env.RESEND_API_KEY?.substring(0, 6));
  console.log("ENVIANDO EMAIL A:", email);

  const result = await resend.emails.send({
    from: "Chiacchio <onboarding@resend.dev>",
    to: email,
    subject: "Confirmá tu email - Chiacchio",
    html: `
      <h2>Confirmación de email</h2>
      <a href="${verifyUrl}">Confirmar email</a>
    `
  });

  console.log("RESULT RESEND:", result);

}