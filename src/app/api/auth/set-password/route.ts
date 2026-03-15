// ============================================
// CHIACCHIO - API Set Password (admin-created users)
// ============================================
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';

// GET: validate token
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json({ valid: false });
  }

  const record = await prisma.verificationToken.findFirst({
    where: {
      token,
      expires: { gt: new Date() },
    },
  });

  return NextResponse.json({ valid: !!record });
}

// POST: set the password
export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 });
    }

    const record = await prisma.verificationToken.findFirst({
      where: {
        token,
        expires: { gt: new Date() },
      },
    });

    if (!record) {
      return NextResponse.json({ error: 'El enlace expiró o ya fue utilizado' }, { status: 400 });
    }

    const hashedPassword = await hash(password, 12);

    // Update user password and mark email as verified
    await prisma.user.update({
      where: { id: record.identifier },
      data: {
        password: hashedPassword,
        emailVerified: new Date(),
      },
    });

    // Delete used token
    await prisma.verificationToken.deleteMany({
      where: { identifier: record.identifier },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting password:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
