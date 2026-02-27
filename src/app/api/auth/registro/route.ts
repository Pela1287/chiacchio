// ============================================
// CHIACCHIO - API Registro
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {

  try {

    const body = await request.json();

    const {
      nombre,
      apellido,
      email,
      telefono,
      password
    } = body;

    // Validaciones básicas
    if (!nombre || !apellido || !email || !password) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Verificar si ya existe
    const usuarioExistente = await prisma.user.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      return NextResponse.json(
        { error: 'Ya existe un usuario con ese email' },
        { status: 400 }
      );
    }

    // Transacción completa
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
        }
      });

      // Crear token
      const token = crypto.randomBytes(32).toString("hex");

      await tx.verificationToken.create({
        data: {
          identifier: usuario.id,
          token,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24)
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

    // Enviar email fuera de la transacción
    await sendVerificationEmail(
      resultado.usuario.email,
      resultado.token
    );

    return NextResponse.json({
      success: true,
      message: 'Usuario creado correctamente. Verificá tu email.',
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
      {
        error: 'Error interno del servidor',
      },
      { status: 500 }
    );
  }
}