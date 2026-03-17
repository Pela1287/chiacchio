// ============================================
// CHIACCHIO - API Registro
// ============================================
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { sendVerificationEmail, sendWelcomeEmail } from "@/lib/email";

export async function POST(request: NextRequest) {

  try {

    const body = await request.json();

    let {
      nombre,
      apellido,
      email,
      telefono,
      password,
      createdByAdmin = false,
    } = body;

    // Validaciones básicas
    if (!nombre || !apellido || !email) {

      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      );

    }

    // Si no viene password (ej: creado por admin) generamos una
    if (!password) {

      password = crypto.randomBytes(4).toString("hex"); // 8 caracteres

    }

    if (password.length < 6) {

      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );

    }

    // Verificar si ya existe usuario
    const usuarioExistente = await prisma.user.findUnique({
      where: { email }
    });

    if (usuarioExistente) {

      return NextResponse.json(
        { error: 'Ya existe un usuario con ese email' },
        { status: 400 }
      );

    }

    // Transacción
    const resultado = await prisma.$transaction(async (tx) => {

      const hashedPassword = await hash(password, 12);

      // Crear usuario
const usuario = await tx.user.create({
  data: {
    nombre,
    apellido,
    email,
    telefono: telefono || null,
    password: hashedPassword,
    rol: 'CLIENTE',
    activo: true,
    // Temporalmente dejamos todos los usuarios verificados
    // para no bloquear el acceso mientras resolvemos emails
    emailVerified: new Date(),
  }
});

      // Crear token verificación
      // Solo generamos token si el usuario fue creado por un admin
      // para que pueda establecer su contraseña desde el email
      let token: string | null = null;

      if (createdByAdmin) {
        token = crypto.randomBytes(32).toString("hex");

        await tx.verificationToken.create({
          data: {
            identifier: usuario.id,
            token,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 48)
          }
        });
      }

      // Crear cliente asociado
      await tx.cliente.create({
        data: {
          usuarioId: usuario.id,
          nombre,
          apellido,
          email,
          telefono: telefono || '',
          direccion: '',
          ciudad: '',
          codigoPostal: '',
        }
      });

      return {
        usuario,
        token
      };

    });

    // Enviar email solo si el usuario fue creado por admin
// En auto-registro público no enviamos confirmación por ahora
let emailEnviado = true;
let emailError = '';

if (createdByAdmin && resultado.token) {
  try {
    await sendWelcomeEmail(
      resultado.usuario.email,
      resultado.usuario.nombre,
      resultado.token,
      password
    );
  } catch (emailErr: any) {
    emailEnviado = false;
    emailError = emailErr?.message || 'Error desconocido';
    console.warn('⚠️ Email no enviado:', emailError);
  }
}
    const mensaje = createdByAdmin
      ? emailEnviado
        ? 'Cliente creado correctamente.'
        : 'Cliente creado correctamente.'
      : 'Usuario creado correctamente. Ya podés iniciar sesión.';

    return NextResponse.json({
      success: true,
      message: mensaje,
      emailEnviado,
      usuario: {
        id: resultado.usuario.id,
        email: resultado.usuario.email,
        nombre: resultado.usuario.nombre,
        apellido: resultado.usuario.apellido
      }
    });

  } catch (error) {

    console.error("🔥 ERROR REGISTRO:");
    console.error(error);

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );

  }
}