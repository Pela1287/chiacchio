/* ============================================
   CHIACCHIO - Tipos TypeScript
   ============================================ */

// ===== ROLES =====
export type UserRole = 'super' | 'admin' | 'cliente';

// ===== USUARIOS =====
export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  rol: UserRole;
  avatar?: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ===== CLIENTES =====
export interface Cliente {
  id: string;
  usuarioId: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  notas?: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ===== MEMBRESÍAS =====
export type MembresiaEstado = 'activa' | 'pausada' | 'cancelada' | 'vencida';
export type MembresiaPlan = 'basico' | 'estandar' | 'premium';

export interface Membresia {
  id: string;
  clienteId: string;
  plan: MembresiaPlan;
  precio: number;
  estado: MembresiaEstado;
  fechaInicio: Date;
  fechaFin?: Date;
  fechaProximoPago: Date;
  serviciosDisponibles: number;
  serviciosUsados: number;
  createdAt: Date;
  updatedAt: Date;
}

// ===== SERVICIOS =====
export type ServicioCategoria = 'mantenimiento' | 'obra' | 'instalacion' | 'reparacion';

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: ServicioCategoria;
  tarifaBase: number;
  duracionEstimada: number; // en minutos
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ===== SOLICITUDES/ÓRDENES =====
export type SolicitudEstado = 'pendiente' | 'confirmada' | 'en_progreso' | 'completada' | 'cancelada';
export type SolicitudPrioridad = 'baja' | 'media' | 'alta' | 'urgente';

export interface Solicitud {
  id: string;
  clienteId: string;
  servicioId: string;
  direccion: string;
  ciudad: string;
  descripcion: string;
  estado: SolicitudEstado;
  prioridad: SolicitudPrioridad;
  fechaSolicitada: Date;
  fechaProgramada?: Date;
  fechaCompletada?: Date;
  notas?: string;
  presupuestoId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ===== PRESUPUESTOS =====
export type PresupuestoEstado = 'pendiente' | 'aprobado' | 'rechazado' | 'vencido';

export interface PresupuestoItem {
  id: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Presupuesto {
  id: string;
  clienteId: string;
  solicitudId?: string;
  items: PresupuestoItem[];
  subtotal: number;
  iva: number;
  total: number;
  estado: PresupuestoEstado;
  fechaEmision: Date;
  fechaValidez: Date;
  notas?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ===== PAGOS =====
export type PagoEstado = 'pendiente' | 'completado' | 'fallido' | 'reembolsado';
export type PagoMetodo = 'efectivo' | 'transferencia' | 'tarjeta' | 'mercadopago';

export interface Pago {
  id: string;
  clienteId: string;
  membresiaId?: string;
  presupuestoId?: string;
  monto: number;
  metodo: PagoMetodo;
  estado: PagoEstado;
  referencia?: string;
  fechaPago?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ===== LEADS (captados por el bot) =====
export type LeadEstado = 'nuevo' | 'contactado' | 'calificado' | 'convertido' | 'perdido';

export interface Lead {
  id: string;
  nombre: string;
  telefono: string;
  email?: string;
  zona: string;
  necesidad: string;
  conversacion: MensajeChat[];
  estado: LeadEstado;
  clienteId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ===== CHAT =====
export interface MensajeChat {
  id: string;
  rol: 'usuario' | 'bot';
  contenido: string;
  timestamp: Date;
}

// ===== NOTIFICACIONES =====
export type NotificacionTipo = 'info' | 'success' | 'warning' | 'error';

export interface Notificacion {
  id: string;
  tipo: NotificacionTipo;
  titulo: string;
  mensaje: string;
  leida: boolean;
  createdAt: Date;
}

// ===== CONFIGURACIÓN =====
export interface Configuracion {
  id: string;
  clave: string;
  valor: string;
  descripcion?: string;
  updatedAt: Date;
}

// ===== PAGINACIÓN =====
export interface PaginacionParams {
  pagina: number;
  porPagina: number;
  busqueda?: string;
  ordenarPor?: string;
  orden?: 'asc' | 'desc';
}

export interface PaginacionRespuesta<T> {
  datos: T[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

// ===== ESTADÍSTICAS DASHBOARD =====
export interface EstadisticasDashboard {
  totalClientes: number;
  clientesNuevosMes: number;
  membresiasActivas: number;
  solicitudesPendientes: number;
  ingresosMes: number;
  leadsNuevos: number;
}
