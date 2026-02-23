// ============================================
// CHIACCHIO - Repositorios
// Interfaz y fábrica para cambiar entre mock y DB
// ============================================

import prisma from './prisma';
import type { 
  User, Cliente, Membresia, Servicio, Solicitud, 
  Presupuesto, Pago, Lead, UserRole 
} from '@/types';

// ===== INTERFACES =====

export interface IUsuarioRepo {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}

export interface IClienteRepo {
  findAll(): Promise<Cliente[]>;
  findById(id: string): Promise<Cliente | null>;
  findByUsuarioId(usuarioId: string): Promise<Cliente | null>;
  create(data: Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>): Promise<Cliente>;
  update(id: string, data: Partial<Cliente>): Promise<Cliente>;
  delete(id: string): Promise<void>;
}

export interface IMembresiaRepo {
  findAll(): Promise<Membresia[]>;
  findById(id: string): Promise<Membresia | null>;
  findByClienteId(clienteId: string): Promise<Membresia | null>;
  findActivas(): Promise<Membresia[]>;
  create(data: Omit<Membresia, 'id' | 'createdAt' | 'updatedAt'>): Promise<Membresia>;
  update(id: string, data: Partial<Membresia>): Promise<Membresia>;
  delete(id: string): Promise<void>;
}

export interface IServicioRepo {
  findAll(): Promise<Servicio[]>;
  findById(id: string): Promise<Servicio | null>;
  findActivos(): Promise<Servicio[]>;
  create(data: Omit<Servicio, 'id' | 'createdAt' | 'updatedAt'>): Promise<Servicio>;
  update(id: string, data: Partial<Servicio>): Promise<Servicio>;
  delete(id: string): Promise<void>;
}

export interface ISolicitudRepo {
  findAll(): Promise<Solicitud[]>;
  findById(id: string): Promise<Solicitud | null>;
  findByClienteId(clienteId: string): Promise<Solicitud[]>;
  findPendientes(): Promise<Solicitud[]>;
  create(data: Omit<Solicitud, 'id' | 'createdAt' | 'updatedAt'>): Promise<Solicitud>;
  update(id: string, data: Partial<Solicitud>): Promise<Solicitud>;
  delete(id: string): Promise<void>;
}

export interface IPresupuestoRepo {
  findAll(): Promise<Presupuesto[]>;
  findById(id: string): Promise<Presupuesto | null>;
  findByClienteId(clienteId: string): Promise<Presupuesto[]>;
  findPendientes(): Promise<Presupuesto[]>;
  create(data: Omit<Presupuesto, 'id' | 'createdAt' | 'updatedAt'> & { items: PresupuestoItem[] }): Promise<Presupuesto>;
  update(id: string, data: Partial<Presupuesto>): Promise<Presupuesto>;
  delete(id: string): Promise<void>;
}

export interface ILeadRepo {
  findAll(): Promise<Lead[]>;
  findById(id: string): Promise<Lead | null>;
  findNuevos(): Promise<Lead[]>;
  create(data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead>;
  update(id: string, data: Partial<Lead>): Promise<Lead>;
}

export interface IPagoRepo {
  findAll(): Promise<Pago[]>;
  findById(id: string): Promise<Pago | null>;
  findByClienteId(clienteId: string): Promise<Pago[]>;
  findByMembresiaId(membresiaId: string): Promise<Pago[]>;
  create(data: Omit<Pago, 'id' | 'createdAt'>): Promise<Pago>;
  update(id: string, data: Partial<Pago>): Promise<Pago>;
}


// ===== IMPLEMENTACIONES MySQL =====

// Usuario Repository
export const UsuarioRepo: IUsuarioRepo = {
  async findAll() {
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
    return users.map(u => ({
      ...u,
      rol: u.rol as UserRole,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));
  },

  async findById(id) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return { ...user, rol: user.rol as UserRole };
  },

  async findByEmail(email) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return { ...user, rol: user.rol as UserRole };
  },

  async create(data) {
    const user = await prisma.user.create({
      data: {
        ...data,
        rol: data.rol as any,
      }
    });
    return { ...user, rol: user.rol as UserRole };
  },

  async update(id, data) {
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...data,
        rol: data.rol as any,
      }
    });
    return { ...user, rol: user.rol as UserRole };
  },

  async delete(id) {
    await prisma.user.delete({ where: { id } });
  }
};

// Cliente Repository
export const ClienteRepo: IClienteRepo = {
  async findAll() {
    return prisma.cliente.findMany({ orderBy: { createdAt: 'desc' } });
  },

  async findById(id) {
    return prisma.cliente.findUnique({ where: { id } });
  },

  async findByUsuarioId(usuarioId) {
    return prisma.cliente.findUnique({ where: { usuarioId } });
  },

  async create(data) {
    return prisma.cliente.create({ data });
  },

  async update(id, data) {
    return prisma.cliente.update({ where: { id }, data });
  },

  async delete(id) {
    await prisma.cliente.delete({ where: { id } });
  }
};

// Membresia Repository
export const MembresiaRepo: IMembresiaRepo = {
  async findAll() {
    const membresias = await prisma.membresia.findMany({
      orderBy: { createdAt: 'desc' },
      include: { cliente: true }
    });
    return membresias.map(m => ({
      ...m,
      precio: Number(m.precio),
    }));
  },

  async findById(id) {
    const m = await prisma.membresia.findUnique({ where: { id } });
    if (!m) return null;
    return { ...m, precio: Number(m.precio) };
  },

  async findByClienteId(clienteId) {
    const m = await prisma.membresia.findFirst({ 
      where: { clienteId },
      orderBy: { createdAt: 'desc' }
    });
    if (!m) return null;
    return { ...m, precio: Number(m.precio) };
  },

  async findActivas() {
    const membresias = await prisma.membresia.findMany({
      where: { estado: 'ACTIVA' },
      include: { cliente: true }
    });
    return membresias.map(m => ({ ...m, precio: Number(m.precio) }));
  },

  async create(data) {
    const m = await prisma.membresia.create({
      data: {
        ...data,
        precio: data.precio,
        plan: data.plan as any,
        estado: data.estado as any,
      }
    });
    return { ...m, precio: Number(m.precio) };
  },

  async update(id, data) {
    const m = await prisma.membresia.update({
      where: { id },
      data: {
        ...data,
        precio: data.precio,
        plan: data.plan as any,
        estado: data.estado as any,
      }
    });
    return { ...m, precio: Number(m.precio) };
  },

  async delete(id) {
    await prisma.membresia.delete({ where: { id } });
  }
};

// Servicio Repository
export const ServicioRepo: IServicioRepo = {
  async findAll() {
    const servicios = await prisma.servicio.findMany({ orderBy: { createdAt: 'desc' } });
    return servicios.map(s => ({ ...s, tarifaBase: Number(s.tarifaBase) }));
  },

  async findById(id) {
    const s = await prisma.servicio.findUnique({ where: { id } });
    if (!s) return null;
    return { ...s, tarifaBase: Number(s.tarifaBase) };
  },

  async findActivos() {
    const servicios = await prisma.servicio.findMany({ where: { activo: true } });
    return servicios.map(s => ({ ...s, tarifaBase: Number(s.tarifaBase) }));
  },

  async create(data) {
    const s = await prisma.servicio.create({
      data: {
        ...data,
        tarifaBase: data.tarifaBase,
        categoria: data.categoria as any,
      }
    });
    return { ...s, tarifaBase: Number(s.tarifaBase) };
  },

  async update(id, data) {
    const s = await prisma.servicio.update({
      where: { id },
      data: {
        ...data,
        tarifaBase: data.tarifaBase,
        categoria: data.categoria as any,
      }
    });
    return { ...s, tarifaBase: Number(s.tarifaBase) };
  },

  async delete(id) {
    await prisma.servicio.delete({ where: { id } });
  }
};

// Solicitud Repository
export const SolicitudRepo: ISolicitudRepo = {
  async findAll() {
    return prisma.solicitud.findMany({
      orderBy: { createdAt: 'desc' },
      include: { cliente: true, servicio: true }
    });
  },

  async findById(id) {
    return prisma.solicitud.findUnique({
      where: { id },
      include: { cliente: true, servicio: true }
    });
  },

  async findByClienteId(clienteId) {
    return prisma.solicitud.findMany({
      where: { clienteId },
      orderBy: { createdAt: 'desc' },
      include: { servicio: true }
    });
  },

  async findPendientes() {
    return prisma.solicitud.findMany({
      where: { estado: 'PENDIENTE' },
      orderBy: { createdAt: 'desc' },
      include: { cliente: true, servicio: true }
    });
  },

  async create(data) {
    return prisma.solicitud.create({
      data: {
        ...data,
        estado: data.estado as any,
        prioridad: data.prioridad as any,
      },
      include: { cliente: true, servicio: true }
    });
  },

  async update(id, data) {
    return prisma.solicitud.update({
      where: { id },
      data: {
        ...data,
        estado: data.estado as any,
        prioridad: data.prioridad as any,
      }
    });
  },

  async delete(id) {
    await prisma.solicitud.delete({ where: { id } });
  }
};

// Presupuesto Repository
export const PresupuestoRepo: IPresupuestoRepo = {
  async findAll() {
    const presupuestos = await prisma.presupuesto.findMany({
      orderBy: { createdAt: 'desc' },
      include: { cliente: true, items: true }
    });
    return presupuestos.map(p => ({
      ...p,
      subtotal: Number(p.subtotal),
      iva: Number(p.iva),
      total: Number(p.total),
    }));
  },

  async findById(id) {
    const p = await prisma.presupuesto.findUnique({
      where: { id },
      include: { cliente: true, items: true }
    });
    if (!p) return null;
    return {
      ...p,
      subtotal: Number(p.subtotal),
      iva: Number(p.iva),
      total: Number(p.total),
    };
  },

  async findByClienteId(clienteId) {
    const presupuestos = await prisma.presupuesto.findMany({
      where: { clienteId },
      orderBy: { createdAt: 'desc' },
      include: { items: true }
    });
    return presupuestos.map(p => ({
      ...p,
      subtotal: Number(p.subtotal),
      iva: Number(p.iva),
      total: Number(p.total),
    }));
  },

  async findPendientes() {
    const presupuestos = await prisma.presupuesto.findMany({
      where: { estado: 'PENDIENTE' },
      include: { cliente: true, items: true }
    });
    return presupuestos.map(p => ({
      ...p,
      subtotal: Number(p.subtotal),
      iva: Number(p.iva),
      total: Number(p.total),
    }));
  },

  async create(data) {
    const { items, ...presupuestoData } = data;
    const p = await prisma.presupuesto.create({
      data: {
        ...presupuestoData,
        subtotal: presupuestoData.subtotal,
        iva: presupuestoData.iva,
        total: presupuestoData.total,
        estado: presupuestoData.estado as any,
        items: {
          create: items
        }
      },
      include: { cliente: true, items: true }
    });
    return {
      ...p,
      subtotal: Number(p.subtotal),
      iva: Number(p.iva),
      total: Number(p.total),
    };
  },

  async update(id, data) {
    const p = await prisma.presupuesto.update({
      where: { id },
      data: {
        ...data,
        estado: data.estado as any,
      }
    });
    return {
      ...p,
      subtotal: Number(p.subtotal),
      iva: Number(p.iva),
      total: Number(p.total),
    };
  },

  async delete(id) {
    await prisma.presupuesto.delete({ where: { id } });
  }
};

// Lead Repository
export const LeadRepo: ILeadRepo = {
  async findAll() {
    return prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
  },

  async findById(id) {
    return prisma.lead.findUnique({ where: { id } });
  },

  async findNuevos() {
    return prisma.lead.findMany({ where: { estado: 'NUEVO' } });
  },

  async create(data) {
    return prisma.lead.create({
      data: {
        ...data,
        estado: data.estado as any,
        conversacion: data.conversacion as any,
      }
    });
  },

  async update(id, data) {
    return prisma.lead.update({
      where: { id },
      data: {
        ...data,
        estado: data.estado as any,
        conversacion: data.conversacion as any,
      }
    });
  }
};

export const PagoRepo: IPagoRepo = {
  async findAll() {
    const pagos = await prisma.pago.findMany({
      orderBy: { fechaPago: 'desc' },
      include: { cliente: true, membresia: true }
    });
    return pagos.map(p => ({ ...p, monto: Number(p.monto) }));
  },

  async findById(id) {
    const p = await prisma.pago.findUnique({
      where: { id },
      include: { cliente: true, membresia: true }
    });
    if (!p) return null;
    return { ...p, monto: Number(p.monto) };
  },

  async findByClienteId(clienteId) {
    const pagos = await prisma.pago.findMany({
      where: { clienteId },
      orderBy: { fechaPago: 'desc' },
      include: { membresia: true }
    });
    return pagos.map(p => ({ ...p, monto: Number(p.monto) }));
  },

  async findByMembresiaId(membresiaId) {
    const pagos = await prisma.pago.findMany({
      where: { membresiaId },
      orderBy: { fechaPago: 'desc' }
    });
    return pagos.map(p => ({ ...p, monto: Number(p.monto) }));
  },

  async create(data) {
    const p = await prisma.pago.create({
      data: {
        ...data,
        monto: data.monto,
        metodo: data.metodo as any,
        estado: data.estado as any,
      },
      include: { cliente: true, membresia: true }
    });
    return { ...p, monto: Number(p.monto) };
  },

  async update(id, data) {
    const p = await prisma.pago.update({
      where: { id },
      data: {
        ...data,
        monto: data.monto,
        metodo: data.metodo as any,
        estado: data.estado as any,
      }
    });
    return { ...p, monto: Number(p.monto) };
  }
};

