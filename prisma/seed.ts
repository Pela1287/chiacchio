// ============================================
// CHIACCHIO - Seed de Base de Datos (MySQL)
// ============================================

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Crear usuarios ADMIN (no usuarios de prueba de clientes)
  const superUser = await prisma.user.upsert({
    where: { email: 'super@chiacchio.com' },
    update: {},
    create: {
      email: 'super@chiacchio.com',
      nombre: 'Carlos',
      apellido: 'Superadmin',
      password: await hash('admin123', 12),
      telefono: '+5492216011455',
      rol: 'SUPER',
      activo: true,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@chiacchio.com' },
    update: {},
    create: {
      email: 'admin@chiacchio.com',
      nombre: 'María',
      apellido: 'Administradora',
      password: await hash('admin123', 12),
      telefono: '+54 9 11 8765-4321',
      rol: 'ADMIN',
      activo: true,
    },
  });

  console.log('✅ Usuarios admin creados');

  // Crear servicios ELÉCTRICOS solamente
  await prisma.servicio.upsert({
    where: { id: 'serv-1' },
    update: {},
    create: {
      id: 'serv-1',
      nombre: 'Mantenimiento Eléctrico General',
      descripcion: 'Revisión y reparación de instalaciones eléctricas domiciliarias. Incluye revisión de tablero, tomas, interruptores y iluminación.',
      categoria: 'MANTENIMIENTO',
      tarifaBase: 3500,
      duracionEstimada: 120,
    },
  });

  await prisma.servicio.upsert({
    where: { id: 'serv-2' },
    update: {},
    create: {
      id: 'serv-2',
      nombre: 'Instalación de Aire Acondicionado',
      descripcion: 'Instalación completa de equipos split, incluye colocación de soportes, conexiones eléctricas y prueba de funcionamiento.',
      categoria: 'INSTALACION',
      tarifaBase: 12000,
      duracionEstimada: 240,
    },
  });

  await prisma.servicio.upsert({
    where: { id: 'serv-3' },
    update: {},
    create: {
      id: 'serv-3',
      nombre: 'Reparación de Aire Acondicionado',
      descripcion: 'Diagnóstico y reparación de fallas en equipos de aire acondicionado.',
      categoria: 'REPARACION',
      tarifaBase: 5000,
      duracionEstimada: 90,
    },
  });

  await prisma.servicio.upsert({
    where: { id: 'serv-4' },
    update: {},
    create: {
      id: 'serv-4',
      nombre: 'Tiro/Ingeniería Eléctrica',
      descripcion: 'Aumento de potencia contratada, instalación de nuevos circuitos y adecuación de tableros.',
      categoria: 'OBRA',
      tarifaBase: 50000,
      duracionEstimada: 480,
    },
  });

  await prisma.servicio.upsert({
    where: { id: 'serv-5' },
    update: {},
    create: {
      id: 'serv-5',
      nombre: 'Puesta a Tierra',
      descripcion: 'Instalación de sistema de puesta a tierra para protección de personas y equipos.',
      categoria: 'INSTALACION',
      tarifaBase: 15000,
      duracionEstimada: 240,
    },
  });

  await prisma.servicio.upsert({
    where: { id: 'serv-6' },
    update: {},
    create: {
      id: 'serv-6',
      nombre: 'Cableado Nuevo',
      descripcion: 'Tendido de cables eléctricos nuevos, instalación de cañerías y circuitos.',
      categoria: 'INSTALACION',
      tarifaBase: 20000,
      duracionEstimada: 360,
    },
  });

  console.log('✅ Servicios creados');

  // Crear TÉCNICOS
  await prisma.tecnico.upsert({
    where: { id: 'tec-1' },
    update: {},
    create: {
      id: 'tec-1',
      nombre: 'Roberto',
      apellido: 'Fernández',
      especialidad: 'Electricista Matriculado',
      telefono: '+54 9 221 555-1234',
      activo: true,
    },
  });

  await prisma.tecnico.upsert({
    where: { id: 'tec-2' },
    update: {},
    create: {
      id: 'tec-2',
      nombre: 'Miguel',
      apellido: 'Rodríguez',
      especialidad: 'Electricista',
      telefono: '+54 9 221 555-5678',
      activo: true,
    },
  });

  await prisma.tecnico.upsert({
    where: { id: 'tec-3' },
    update: {},
    create: {
      id: 'tec-3',
      nombre: 'Carlos',
      apellido: 'Gómez',
      especialidad: 'Técnico en Aire Acondicionado',
      telefono: '+54 9 221 555-9012',
      activo: true,
    },
  });

  await prisma.tecnico.upsert({
    where: { id: 'tec-4' },
    update: {},
    create: {
      id: 'tec-4',
      nombre: 'Diego',
      apellido: 'Martínez',
      especialidad: 'Electricista Industrial',
      telefono: '+54 9 221 555-3456',
      activo: true,
    },
  });

  console.log('✅ Técnicos creados');

  // Configuración del sistema
  await prisma.configuracion.upsert({
    where: { clave: 'whatsapp_super' },
    update: {},
    create: {
      clave: 'whatsapp_super',
      valor: '+5492216011455',
      descripcion: 'Número de WhatsApp del Super Usuario para notificaciones',
    },
  });

  await prisma.configuracion.upsert({
    where: { clave: 'membresia_precio' },
    update: { valor: '9900' },
    create: {
      clave: 'membresia_precio',
      valor: '9900',
      descripcion: 'Precio mensual de la membresía',
    },
  });

  await prisma.configuracion.upsert({
    where: { clave: 'ampliacion_descuento' },
    update: { valor: '20' },
    create: {
      clave: 'ampliacion_descuento',
      valor: '20',
      descripcion: 'Porcentaje de descuento para trabajos de ampliación',
    },
  });

  await prisma.configuracion.upsert({
    where: { clave: 'obra_descuento' },
    update: { valor: '30' },
    create: {
      clave: 'obra_descuento',
      valor: '30',
      descripcion: 'Porcentaje de descuento para trabajos de obra',
    },
  });

  console.log('✅ Configuración creada');

  // Artículos de conocimiento para el bot
  const articulosExistentes = await prisma.kbArticulo.count();
  if (articulosExistentes === 0) {
    await prisma.kbArticulo.createMany({
      data: [
        {
          titulo: 'Planes y Precios',
          contenido: 'Chiacchio ofrece membresía a $9.900/mes con ATENCIÓN ILIMITADA de mantenimiento eléctrico. Para ampliaciones: 20% de descuento y hasta 3 cuotas sin interés. Para obras: 30% de descuento y cuotas a convenir con el cliente.',
          categoria: 'membresia',
        },
        {
          titulo: 'Servicios de Mantenimiento',
          contenido: 'Servicios ELÉCTRICOS exclusivamente: mantenimiento eléctrico, instalación de aires acondicionados, tiro/ingeniería eléctrica, puesta a tierra, cableado nuevo, reparación de tableros, tomas, interruptores, lámparas y luminiarias.',
          categoria: 'servicios',
        },
        {
          titulo: 'Cómo Solicitar Servicio',
          contenido: 'Para solicitar un servicio, el cliente debe ingresar a su panel y crear una nueva solicitud indicando el tipo de servicio, dirección y descripción del problema. Recibirá confirmación por WhatsApp.',
          categoria: 'procesos',
        },
        {
          titulo: 'Contacto',
          contenido: 'Puede contactarnos por WhatsApp al +5492216011455, por email a contacto@chiacchio.com, o a través del formulario en nuestra página web. Horario de atención: Lunes a Viernes de 8:00 a 18:00.',
          categoria: 'contacto',
        },
      ],
    });
    console.log('✅ Artículos de conocimiento creados');
  }

  console.log('');
  console.log('🎉 Seed completado exitosamente!');
  console.log('');
  console.log('📋 Usuarios administrativos:');
  console.log('   Super: super@chiacchio.com / admin123');
  console.log('   Admin: admin@chiacchio.com / admin123');
  console.log('');
  console.log('📝 Los clientes se registran desde /auth/registro');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
