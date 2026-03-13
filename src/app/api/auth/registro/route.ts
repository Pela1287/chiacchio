// ============================================
// CHIACCHIO - API Registro
// ============================================

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
          // Si lo crea el admin, verificamos el email de inmediato
          emailVerified: createdByAdmin ? new Date() : null,
        }
      });

      // Crear token verificación
      const token = crypto.randomBytes(32).toString("hex");

      await tx.verificationToken.create({
        data: {
          identifier: usuario.id,
          token,
          // Admin-created: 48h para que establezca su contraseña; auto-registro: 24h
          expires: new Date(Date.now() + 1000 * 60 * 60 * (createdByAdmin ? 48 : 24))
        }
      });

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

    // Enviar email según el origen
    let emailEnviado = true;
    let emailError = '';
    try {
      if (createdByAdmin) {
        await sendWelcomeEmail(
          resultado.usuario.email,
          resultado.usuario.nombre,
          resultado.token,
          password
        );
      } else {
        await sendVerificationEmail(
          resultado.usuario.email,
          resultado.token
        );
      }
    } catch (emailErr: any) {
      // El email falló (destinatario no verificado en Resend, o error de red)
      // No bloqueamos la creación del usuario — solo avisamos
      emailEnviado = false;
      emailError = emailErr?.message || 'Error desconocido';
      console.warn('⚠️  Email no enviado:', emailError);
    }

    const mensaje = createdByAdmin
      ? emailEnviado
        ? 'Cliente creado. Se le envió un email para que establezca su contraseña.'
        : 'Cliente creado correctamente. No se pudo enviar el email (verificá la configuración de Resend o usá "Reenviar acceso").'
      : emailEnviado
        ? 'Usuario creado correctamente. Verificá tu email.'
        : 'Usuario creado. Hubo un problema al enviar el email de verificación.';

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