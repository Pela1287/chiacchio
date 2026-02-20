// ============================================
// CHIACCHIO - API Registro
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, apellido, email, telefono, password } = body;

    // Validaciones
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

    // Verificar si el usuario ya existe
    const usuarioExistente = await prisma.user.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      return NextResponse.json(
        { error: 'Ya existe un usuario con ese email' },
        { status: 400 }
      );
    }

    // Crear usuario
    const hashedPassword = await hash(password, 12);

    const usuario = await prisma.user.create({
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

    // Crear cliente asociado
    await prisma.cliente.create({
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

    return NextResponse.json({
      success: true,
      message: 'Usuario creado correctamente',
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
