import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const APP_URL = process.env.APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
const FROM = process.env.EMAIL_FROM || 'Chiacchio <onboarding@resend.dev>';

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${APP_URL}/api/auth/verify-email?token=${token}`;

  const html = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f7f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f9;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">
        
        <!-- Header -->
        <tr><td style="background:#1e3a5f;padding:32px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;letter-spacing:.5px;">⚡ Chiacchio</h1>
          <p style="color:#93c5fd;margin:6px 0 0;font-size:13px;">Servicios de Mantenimiento Eléctrico</p>
        </td></tr>
        
        <!-- Body -->
        <tr><td style="padding:40px 40px 32px;">
          <h2 style="color:#111827;font-size:20px;margin:0 0 12px;">Confirmá tu dirección de email</h2>
          <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 28px;">
            ¡Bienvenido a Chiacchio! Para activar tu cuenta y comenzar a solicitar servicios, necesitás confirmar tu email.
          </p>
          
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr><td align="center" style="padding-bottom:28px;">
              <a href="${verifyUrl}"
                 style="display:inline-block;background:#1e3a5f;color:#ffffff;font-size:15px;font-weight:600;
                        text-decoration:none;padding:14px 36px;border-radius:8px;letter-spacing:.3px;">
                ✓ Confirmar mi email
              </a>
            </td></tr>
          </table>
          
          <p style="color:#6b7280;font-size:13px;margin:0 0 8px;">
            O copiá este enlace en tu navegador:
          </p>
          <p style="color:#2563eb;font-size:12px;word-break:break-all;background:#eff6ff;padding:10px 14px;border-radius:6px;margin:0 0 28px;">
            ${verifyUrl}
          </p>
          
          <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:12px 16px;border-radius:0 6px 6px 0;margin-bottom:0;">
            <p style="color:#92400e;font-size:13px;margin:0;">
              ⏰ Este enlace expira en <strong>24 horas</strong>. Si no creaste esta cuenta, ignorá este email.
            </p>
          </div>
        </td></tr>
        
        <!-- Footer -->
        <tr><td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">
            © ${new Date().getFullYear()} Chiacchio · Servicios Eléctricos · La Plata, Buenos Aires
          </p>
        </td></tr>
        
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  console.log("📨 Enviando verificación a:", email);
  console.log("📨 FROM:", FROM);
  console.log("📨 VERIFY URL:", verifyUrl);

  const result = await resend.emails.send({
    from: FROM,
    to: email,
    subject: '⚡ Confirmá tu email — Chiacchio',
    html,
  });

  console.log("✅ RESULTADO RESEND:", result);

  return result;
}

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${APP_URL}/api/auth/verify-email?token=${token}`;

  const html = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f7f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f9;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">
        <tr><td style="background:#1e3a5f;padding:32px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;">⚡ Chiacchio</h1>
        </td></tr>
        <tr><td style="padding:40px;">
          <h2 style="color:#111827;font-size:20px;margin:0 0 12px;">Recuperar contraseña</h2>
          <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 28px;">
            Recibimos una solicitud para restablecer la contraseña de tu cuenta.
            Si no fuiste vos, ignorá este email.
          </p>
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr><td align="center" style="padding-bottom:28px;">
              <a href="${resetUrl}"
                 style="display:inline-block;background:#dc2626;color:#ffffff;font-size:15px;font-weight:600;
                        text-decoration:none;padding:14px 36px;border-radius:8px;">
                Restablecer contraseña
              </a>
            </td></tr>
          </table>
          <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:12px 16px;border-radius:0 6px 6px 0;">
            <p style="color:#92400e;font-size:13px;margin:0;">
              ⏰ Este enlace expira en <strong>1 hora</strong>.
            </p>
          </div>
        </td></tr>
        <tr><td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">© ${new Date().getFullYear()} Chiacchio</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  console.log("📨 Enviando verificación a:", email);
  console.log("📨 FROM:", FROM);
  console.log("📨 VERIFY URL:", verifyUrl);

  const result = await resend.emails.send({
    from: FROM,
    to: email,
    subject: '⚡ Confirmá tu email — Chiacchio',
    html,
  });

  console.log("✅ RESULTADO RESEND:", result);

  return result;
}

export async function sendWelcomeEmail(
  email: string,
  nombre: string,
  token: string,
  passwordTemporal: string
) {
  const setPasswordUrl = `${APP_URL}/auth/set-password?token=${token}`;

  const html = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f4f4f4;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
  <tr><td style="background:#16a34a;padding:32px 40px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700;">Chiacchio Electricidad</h1>
    <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">Tu cuenta fue creada</p>
  </td></tr>
  <tr><td style="padding:40px;">
    <h2 style="color:#111;font-size:20px;margin:0 0 12px;">Bienvenido, ${nombre}!</h2>
    <p style="color:#444;font-size:15px;line-height:1.6;margin:0 0 20px;">
      El equipo de Chiacchio creo una cuenta para vos. Para ingresar al sistema, necesitas establecer tu propia contrasena haciendo clic en el boton de abajo.
    </p>
    <table cellpadding="0" cellspacing="0" style="margin:24px auto;">
      <tr><td style="background:#16a34a;border-radius:8px;text-align:center;">
        <a href="${setPasswordUrl}" style="display:inline-block;padding:14px 32px;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">Establecer mi contrasena</a>
      </td></tr>
    </table>
    <p style="color:#888;font-size:13px;margin:20px 0 0;">El enlace expira en 48 horas. Si no pediste esta cuenta, ignora este email.</p>
    <hr style="border:none;border-top:1px solid #eee;margin:28px 0;">
    <p style="color:#666;font-size:13px;margin:0;">
      Tu email de acceso: <strong>${email}</strong>
    </p>
  </td></tr>
  <tr><td style="background:#f9f9f9;padding:20px 40px;text-align:center;">
    <p style="color:#aaa;font-size:12px;margin:0;">Chiacchio Electricidad &bull; La Plata, Buenos Aires</p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;

  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "Chiacchio - Tu cuenta fue creada, establecé tu contraseña",
    html,
  });
}
