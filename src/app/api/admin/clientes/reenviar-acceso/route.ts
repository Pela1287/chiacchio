// ============================================
// CHIACCHIO - Admin: Reenviar acceso a cliente
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN','SUPER'].includes(session?.user?.role as string)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { clienteId } = await request.json();
    if (!clienteId) {
      return NextResponse.json({ error: 'clienteId requerido' }, { status: 400 });
    }

    // Get user via cliente
    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
      include: { usuario: true },
    });

    if (!cliente?.usuario) {
      return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
    }

    const user = cliente.usuario;

    // Delete old tokens for this user
    await prisma.verificationToken.deleteMany({
      where: { identifier: user.id },
    });

    // Create new token (48h)
    const token = crypto.randomBytes(32).toString('hex');
    await prisma.verificationToken.create({
      data: {
        identifier: user.id,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 48),
      },
    });

    // Make sure emailVerified is set so they can login after setting password
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    // Send welcome email (non-blocking)
    try {
      await sendWelcomeEmail(user.email, user.nombre, token, '');
      return NextResponse.json({ success: true, message: 'Email de acceso enviado a ' + user.email });
    } catch (emailErr: any) {
      console.warn('Email no enviado:', emailErr?.message);
      // Still success — token was created, admin can share the link manually
      const setPasswordUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/set-password?token=${token}`;
      return NextResponse.json({
        success: true,
        message: 'No se pudo enviar el email. Compartí este link manualmente con el cliente:',
        link: setPasswordUrl,
        emailError: emailErr?.message,
      });
    }
  } catch (error) {
    console.error('Error reenviar acceso:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
