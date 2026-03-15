/* ============================================
   CHIACCHIO - Datos Mock (FASE 1)
   Todos los datos simulados para desarrollo
   ============================================ */

import {
  User,
  Cliente,
  Membresia,
  Servicio,
  Solicitud,
  Presupuesto,
  Pago,
  Lead,
  EstadisticasDashboard
} from '@/types';

// ===== USUARIOS MOCK =====
export const mockUsuarios: User[] = [
  {
    id: 'user-1',
    email: 'super@chiacchio.com',
    nombre: 'Carlos',
    apellido: 'Superadmin',
    telefono: '+5492216011455',
    rol: 'super',
    activo: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'user-2',
    email: 'admin@chiacchio.com',
    nombre: 'María',
    apellido: 'Administradora',
    telefono: '+54 9 11 8765-4321',
    rol: 'admin',
    activo: true,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15')
  },
  {
    id: 'user-3',
    email: 'juan.perez@email.com',
    nombre: 'Juan',
    apellido: 'Pérez',
    telefono: '+54 9 11 5555-1234',
    rol: 'cliente',
    activo: true,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10')
  },
  {
    id: 'user-4',
    email: 'ana.garcia@email.com',
    nombre: 'Ana',
    apellido: 'García',
    telefono: '+54 9 11 6666-7890',
    rol: 'cliente',
    activo: true,
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-04-05')
  }
];

// ===== CLIENTES MOCK =====
export const mockClientes: Cliente[] = [
  {
    id: 'cliente-1',
    usuarioId: 'user-3',
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@email.com',
    telefono: '+54 9 11 5555-1234',
    direccion: 'Av. Corrientes 1234, Piso 4, Depto B',
    ciudad: 'Buenos Aires',
    codigoPostal: '1043',
    notas: 'Cliente preferencial, prefiere contacto por WhatsApp',
    activo: true,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10')
  },
  {
    id: 'cliente-2',
    usuarioId: 'user-4',
    nombre: 'Ana',
    apellido: 'García',
    email: 'ana.garcia@email.com',
    telefono: '+54 9 11 6666-7890',
    direccion: 'Calle Florida 567',
    ciudad: 'Buenos Aires',
    codigoPostal: '1005',
    activo: true,
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-04-05')
  },
  {
    id: 'cliente-3',
    usuarioId: 'user-5',
    nombre: 'Roberto',
    apellido: 'Fernández',
    email: 'roberto.fernandez@email.com',
    telefono: '+54 9 11 7777-4321',
    direccion: 'Belgrano 890, Casa',
    ciudad: 'Córdoba',
    codigoPostal: '5000',
    notas: 'Tiene mascotas en el jardín',
    activo: true,
    createdAt: new Date('2024-05-20'),
    updatedAt: new Date('2024-05-20')
  },
  {
    id: 'cliente-4',
    usuarioId: 'user-6',
    nombre: 'Lucía',
    apellido: 'Martínez',
    email: 'lucia.martinez@email.com',
    telefono: '+54 9 11 8888-1111',
    direccion: 'San Martín 2345',
    ciudad: 'Rosario',
    codigoPostal: '2000',
    activo: true,
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-01')
  },
  {
    id: 'cliente-5',
    usuarioId: 'user-7',
    nombre: 'Miguel',
    apellido: 'Sánchez',
    email: 'miguel.sanchez@email.com',
    telefono: '+54 9 11 9999-2222',
    direccion: 'Rivadavia 4567, Piso 2',
    ciudad: 'Mendoza',
    codigoPostal: '5500',
    activo: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-15')
  }
];

// ===== SERVICIOS MOCK =====
export const mockServicios: Servicio[] = [
  {
    id: 'serv-1',
    nombre: 'Mantenimiento Eléctrico Básico',
    descripcion: 'Revisión y reparación de instalaciones eléctricas domiciliarias. Incluye revisión de tablero, tomas, interruptores y iluminación.',
    categoria: 'mantenimiento',
    tarifaBase: 3500,
    duracionEstimada: 120,
    activo: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'serv-2',
    nombre: 'Plomería General',
    descripcion: 'Reparación de pérdidas, destapaciones, instalación de sanitarios y griferías.',
    categoria: 'mantenimiento',
    tarifaBase: 4000,
    duracionEstimada: 90,
    activo: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'serv-3',
    nombre: 'Pintura Interior',
    descripcion: 'Pintura de ambientes interiores, incluye preparación de superficies y dos manos de pintura.',
    categoria: 'obra',
    tarifaBase: 8000,
    duracionEstimada: 480,
    activo: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'serv-4',
    nombre: 'Instalación de Aire Acondicionado',
    descripcion: 'Instalación completa de equipos split, incluye colocación de soportes, conexiones y prueba de funcionamiento.',
    categoria: 'instalacion',
    tarifaBase: 12000,
    duracionEstimada: 240,
    activo: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'serv-5',
    nombre: 'Reparación de Muebles',
    descripcion: 'Reparación y restauración de muebles de madera, incluye barnizado y cambios de herrajes.',
    categoria: 'reparacion',
    tarifaBase: 2500,
    duracionEstimada: 180,
    activo: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'serv-6',
    nombre: 'Ampliación de Cocina',
    descripcion: 'Proyecto de ampliación y reforma de cocina, incluye demolición, albañilería y terminaciones.',
    categoria: 'obra',
    tarifaBase: 150000,
    duracionEstimada: 2880, // 48 horas
    activo: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'serv-7',
    nombre: 'Cerrajería Domiciliaria',
    descripcion: 'Cambio de cerraduras, reparación de puertas y colocación de cerraduras de seguridad.',
    categoria: 'mantenimiento',
    tarifaBase: 3000,
    duracionEstimada: 60,
    activo: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'serv-8',
    nombre: 'Jardinería y Paisajismo',
    descripcion: 'Mantenimiento de jardines, poda, fertilización y diseño de espacios verdes.',
    categoria: 'mantenimiento',
    tarifaBase: 4500,
    duracionEstimada: 180,
    activo: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// ===== MEMBRESÍAS MOCK =====
export const mockMembresias: Membresia[] = [
  {
    id: 'memb-1',
    clienteId: 'cliente-1',
    plan: 'premium',
    precio: 9900,
    estado: 'activa',
    fechaInicio: new Date('2024-03-10'),
    fechaProximoPago: new Date('2025-01-10'),
    serviciosDisponibles: 10,
    serviciosUsados: 3,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10')
  },
  {
    id: 'memb-2',
    clienteId: 'cliente-2',
    plan: 'estandar',
    precio: 9900,
    estado: 'activa',
    fechaInicio: new Date('2024-04-05'),
    fechaProximoPago: new Date('2025-01-05'),
    serviciosDisponibles: 5,
    serviciosUsados: 1,
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-04-05')
  },
  {
    id: 'memb-3',
    clienteId: 'cliente-3',
    plan: 'basico',
    precio: 9900,
    estado: 'pausada',
    fechaInicio: new Date('2024-05-20'),
    fechaProximoPago: new Date('2024-12-20'),
    serviciosDisponibles: 3,
    serviciosUsados: 2,
    createdAt: new Date('2024-05-20'),
    updatedAt: new Date('2024-11-20')
  },
  {
    id: 'memb-4',
    clienteId: 'cliente-4',
    plan: 'premium',
    precio: 9900,
    estado: 'activa',
    fechaInicio: new Date('2024-06-01'),
    fechaProximoPago: new Date('2025-01-01'),
    serviciosDisponibles: 10,
    serviciosUsados: 0,
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-01')
  }
];

// ===== SOLICITUDES MOCK =====
export const mockSolicitudes: Solicitud[] = [
  {
    id: 'sol-1',
    clienteId: 'cliente-1',
    servicioId: 'serv-1',
    direccion: 'Av. Corrientes 1234, Piso 4, Depto B',
    ciudad: 'Buenos Aires',
    descripcion: 'Corto circuito en la cocina, se tira la llave térmica cuando enciendo el horno eléctrico.',
    estado: 'pendiente',
    prioridad: 'alta',
    fechaSolicitada: new Date('2024-12-20'),
    fechaProgramada: new Date('2024-12-23'),
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-20')
  },
  {
    id: 'sol-2',
    clienteId: 'cliente-2',
    servicioId: 'serv-2',
    direccion: 'Calle Florida 567',
    ciudad: 'Buenos Aires',
    descripcion: 'Pérdida de agua debajo del lavamanos del baño principal.',
    estado: 'confirmada',
    prioridad: 'media',
    fechaSolicitada: new Date('2024-12-18'),
    fechaProgramada: new Date('2024-12-22'),
    createdAt: new Date('2024-12-18'),
    updatedAt: new Date('2024-12-19')
  },
  {
    id: 'sol-3',
    clienteId: 'cliente-1',
    servicioId: 'serv-4',
    direccion: 'Av. Corrientes 1234, Piso 4, Depto B',
    ciudad: 'Buenos Aires',
    descripcion: 'Instalación de aire acondicionado split 3000 frigorías en dormitorio principal.',
    estado: 'completada',
    prioridad: 'baja',
    fechaSolicitada: new Date('2024-11-15'),
    fechaProgramada: new Date('2024-11-20'),
    fechaCompletada: new Date('2024-11-20'),
    presupuestoId: 'pres-1',
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-11-20')
  },
  {
    id: 'sol-4',
    clienteId: 'cliente-3',
    servicioId: 'serv-6',
    direccion: 'Belgrano 890, Casa',
    ciudad: 'Córdoba',
    descripcion: 'Ampliación de cocina: agregar 3 metros lineales de mesada y muebles nuevos.',
    estado: 'en_progreso',
    prioridad: 'media',
    fechaSolicitada: new Date('2024-12-01'),
    fechaProgramada: new Date('2024-12-15'),
    presupuestoId: 'pres-2',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-15')
  },
  {
    id: 'sol-5',
    clienteId: 'cliente-4',
    servicioId: 'serv-8',
    direccion: 'San Martín 2345',
    ciudad: 'Rosario',
    descripcion: 'Poda de árboles y mantenimiento general del jardín.',
    estado: 'pendiente',
    prioridad: 'baja',
    fechaSolicitada: new Date('2024-12-21'),
    createdAt: new Date('2024-12-21'),
    updatedAt: new Date('2024-12-21')
  }
];

// ===== PRESUPUESTOS MOCK =====
export const mockPresupuestos: Presupuesto[] = [
  {
    id: 'pres-1',
    clienteId: 'cliente-1',
    solicitudId: 'sol-3',
    items: [
      {
        id: 'item-1',
        descripcion: 'Aire Acondicionado Split Samsung 3000 Frigorías',
        cantidad: 1,
        precioUnitario: 450000,
        subtotal: 450000
      },
      {
        id: 'item-2',
        descripcion: 'Instalación completa con materiales',
        cantidad: 1,
        precioUnitario: 12000,
        subtotal: 12000
      },
      {
        id: 'item-3',
        descripcion: 'Flete y transporte',
        cantidad: 1,
        precioUnitario: 5000,
        subtotal: 5000
      }
    ],
    subtotal: 467000,
    iva: 98333.60,
    total: 565333.60,
    estado: 'aprobado',
    fechaEmision: new Date('2024-11-16'),
    fechaValidez: new Date('2024-12-16'),
    createdAt: new Date('2024-11-16'),
    updatedAt: new Date('2024-11-18')
  },
  {
    id: 'pres-2',
    clienteId: 'cliente-3',
    solicitudId: 'sol-4',
    items: [
      {
        id: 'item-4',
        descripcion: 'Mesada de granito negro (por m2)',
        cantidad: 3,
        precioUnitario: 45000,
        subtotal: 135000
      },
      {
        id: 'item-5',
        descripcion: 'Muebles de cocina a medida (por m lineal)',
        cantidad: 3,
        precioUnitario: 85000,
        subtotal: 255000
      },
      {
        id: 'item-6',
        descripcion: 'Demolición y retiro de escombros',
        cantidad: 1,
        precioUnitario: 25000,
        subtotal: 25000
      },
      {
        id: 'item-7',
        descripcion: 'Instalación eléctrica nueva',
        cantidad: 1,
        precioUnitario: 35000,
        subtotal: 35000
      },
      {
        id: 'item-8',
        descripcion: 'Mano de obra albañilería y terminaciones',
        cantidad: 1,
        precioUnitario: 120000,
        subtotal: 120000
      }
    ],
    subtotal: 570000,
    iva: 119700,
    total: 689700,
    estado: 'aprobado',
    fechaEmision: new Date('2024-12-05'),
    fechaValidez: new Date('2025-01-05'),
    notas: 'Precio sujeto a modificaciones según estado de paredes y pisos encontrados en obra.',
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-08')
  },
  {
    id: 'pres-3',
    clienteId: 'cliente-2',
    solicitudId: 'sol-2',
    items: [
      {
        id: 'item-9',
        descripcion: 'Reparación pérdida cañería PVC',
        cantidad: 1,
        precioUnitario: 2500,
        subtotal: 2500
      },
      {
        id: 'item-10',
        descripcion: 'Reemplazo sifón cromado',
        cantidad: 1,
        precioUnitario: 1800,
        subtotal: 1800
      },
      {
        id: 'item-11',
        descripcion: 'Mano de obra',
        cantidad: 1.5,
        precioUnitario: 2000,
        subtotal: 3000
      }
    ],
    subtotal: 7300,
    iva: 1533,
    total: 8833,
    estado: 'pendiente',
    fechaEmision: new Date('2024-12-19'),
    fechaValidez: new Date('2025-01-19'),
    createdAt: new Date('2024-12-19'),
    updatedAt: new Date('2024-12-19')
  }
];

// ===== PAGOS MOCK =====
export const mockPagos: Pago[] = [
  {
    id: 'pago-1',
    clienteId: 'cliente-1',
    membresiaId: 'memb-1',
    monto: 9900,
    metodo: 'tarjeta',
    estado: 'completado',
    referencia: 'MP-123456789',
    fechaPago: new Date('2024-12-10'),
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-10')
  },
  {
    id: 'pago-2',
    clienteId: 'cliente-1',
    presupuestoId: 'pres-1',
    monto: 565333.60,
    metodo: 'transferencia',
    estado: 'completado',
    referencia: 'TXN-987654321',
    fechaPago: new Date('2024-11-18'),
    createdAt: new Date('2024-11-18'),
    updatedAt: new Date('2024-11-18')
  },
  {
    id: 'pago-3',
    clienteId: 'cliente-2',
    membresiaId: 'memb-2',
    monto: 9900,
    metodo: 'mercadopago',
    estado: 'completado',
    referencia: 'MP-456789123',
    fechaPago: new Date('2024-12-05'),
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-05')
  },
  {
    id: 'pago-4',
    clienteId: 'cliente-3',
    presupuestoId: 'pres-2',
    monto: 344850,
    metodo: 'transferencia',
    estado: 'completado',
    referencia: 'TXN-111222333',
    fechaPago: new Date('2024-12-10'),
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-10')
  },
  {
    id: 'pago-5',
    clienteId: 'cliente-3',
    presupuestoId: 'pres-2',
    monto: 344850,
    metodo: 'transferencia',
    estado: 'pendiente',
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-10')
  }
];

// ===== LEADS MOCK =====
export const mockLeads: Lead[] = [
  {
    id: 'lead-1',
    nombre: 'Patricia Molina',
    telefono: '+54 9 11 1111-2222',
    email: 'patricia.molina@email.com',
    zona: 'Palermo, CABA',
    necesidad: 'Necesito renovar el baño completo, incluyendo cambio de sanitarios y grifería.',
    conversacion: [
      {
        id: 'msg-1',
        rol: 'bot',
        contenido: '¡Hola! Soy el asistente virtual de Chiacchio. ¿En qué puedo ayudarte?',
        timestamp: new Date('2024-12-20T10:00:00')
      },
      {
        id: 'msg-2',
        rol: 'usuario',
        contenido: 'Quiero renovar mi baño',
        timestamp: new Date('2024-12-20T10:01:00')
      },
      {
        id: 'msg-3',
        rol: 'bot',
        contenido: '¡Excelente! Las renovaciones de baño son nuestra especialidad. ¿Podrías contarme más detalles sobre qué te gustaría hacer?',
        timestamp: new Date('2024-12-20T10:01:00')
      },
      {
        id: 'msg-4',
        rol: 'usuario',
        contenido: 'Necesito cambiar el inodoro, la bacha y los azulejos. También quiero instalar una mampara.',
        timestamp: new Date('2024-12-20T10:02:00')
      }
    ],
    estado: 'nuevo',
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-20')
  },
  {
    id: 'lead-2',
    nombre: 'Fernando Ruiz',
    telefono: '+54 9 11 3333-4444',
    zona: 'Caballito, CABA',
    necesidad: 'Instalación de calefacción central por losa radiante.',
    conversacion: [
      {
        id: 'msg-5',
        rol: 'bot',
        contenido: '¡Hola! Soy el asistente virtual de Chiacchio. ¿En qué puedo ayudarte?',
        timestamp: new Date('2024-12-19T15:30:00')
      },
      {
        id: 'msg-6',
        rol: 'usuario',
        contenido: 'Quiero instalar calefacción por losa radiante en mi casa',
        timestamp: new Date('2024-12-19T15:31:00')
      },
      {
        id: 'msg-7',
        rol: 'bot',
        contenido: 'La calefacción por losa radiante es una excelente opción para el confort del hogar. ¿Cuántos metros cuadrados tiene la vivienda?',
        timestamp: new Date('2024-12-19T15:31:00')
      },
      {
        id: 'msg-8',
        rol: 'usuario',
        contenido: 'Son 120 metros cuadrados en total',
        timestamp: new Date('2024-12-19T15:32:00')
      }
    ],
    estado: 'contactado',
    createdAt: new Date('2024-12-19'),
    updatedAt: new Date('2024-12-20')
  },
  {
    id: 'lead-3',
    nombre: 'Carolina Díaz',
    telefono: '+54 9 11 5555-6666',
    email: 'caro.diaz@email.com',
    zona: 'Villa Urquiza, CABA',
    necesidad: 'Pintura completa de apartamento de 3 ambientes.',
    conversacion: [
      {
        id: 'msg-9',
        rol: 'bot',
        contenido: '¡Hola! Soy el asistente virtual de Chiacchio. ¿En qué puedo ayudarte?',
        timestamp: new Date('2024-12-18T09:00:00')
      },
      {
        id: 'msg-10',
        rol: 'usuario',
        contenido: 'Necesito pintar mi departamento',
        timestamp: new Date('2024-12-18T09:01:00')
      }
    ],
    estado: 'calificado',
    createdAt: new Date('2024-12-18'),
    updatedAt: new Date('2024-12-19')
  }
];

// ===== ESTADÍSTICAS DASHBOARD =====
export const mockEstadisticas: EstadisticasDashboard = {
  totalClientes: 5,
  clientesNuevosMes: 2,
  membresiasActivas: 3,
  solicitudesPendientes: 2,
  ingresosMes: 425833.60,
  leadsNuevos: 1
};

// ===== PLANES DE MEMBRESÍA (ACTUALIZADO) =====
export const planesMembresia = [
  {
    id: 'membresia',
    nombre: 'Membresía',
    precio: 9900,
    serviciosIncluidos: 5,
    descripcion: 'Acceso a servicios de mantenimiento para tu hogar.',
    beneficios: [
      '5 servicios de mantenimiento por mes',
      'Atención prioritaria',
      'Soporte por WhatsApp',
      'Precios exclusivos en ampliaciones y obras'
    ]
  },
  {
    id: 'ampliacion',
    nombre: 'Ampliación',
    precio: 0,
    precioNota: '20% de descuento',
    serviciosIncluidos: 0,
    descripcion: 'Trabajos de ampliación y reforma de tu hogar.',
    beneficios: [
      'Presupuesto sin cargo',
      '20% de descuento sobre el total del presupuesto',
      'Coordinación integral de la obra',
      'Seguimiento y garantía'
    ]
  },
  {
    id: 'obra',
    nombre: 'Obra',
    precio: 0,
    precioNota: '30% de descuento',
    serviciosIncluidos: 0,
    descripcion: 'Obras grandes con financiación a convenir.',
    beneficios: [
      '30% de descuento sobre el total del presupuesto',
      'Financiación a convenir con el cliente',
      'Dirección técnica incluida',
      'Garantía extendida de 2 años'
    ]
  }
];
