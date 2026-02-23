import prisma from '@/lib/prisma';
import { NotFoundError, ConflictError, ValidationError } from '@/lib/errors';

export interface MembresiaInfo {
  id: string;
  estado: string;
  activa: boolean;
  vencida: boolean;
  diasRestantes: number | null;
  fechaInicio: Date;
  fechaProximoPago: Date;
}

export async function validarMembresiaActiva(clienteId: string): Promise<MembresiaInfo> {
  const membresia = await prisma.membresia.findFirst({
    where: {
      clienteId,
      estado: { in: ['ACTIVA', 'PAUSADA'] }
    },
    orderBy: { fechaInicio: 'desc' }
  });

  if (!membresia) {
    throw new NotFoundError('No se encontró membresía activa para este cliente');
  }

  const ahora = new Date();
  const vencida = membresia.fechaProximoPago < ahora;

  let diasRestantes: number | null = null;
  const diff = membresia.fechaProximoPago.getTime() - ahora.getTime();
  diasRestantes = Math.ceil(diff / (1000 * 60 * 60 * 24));

  return {
    id: membresia.id,
    estado: membresia.estado,
    activa: membresia.estado === 'ACTIVA' && !vencida,
    vencida,
    diasRestantes,
    fechaInicio: membresia.fechaInicio,
    fechaProximoPago: membresia.fechaProximoPago
  };
}

export async function crearMembresia(
  clienteId: string,
  precio: number,
  pagoId?: string
): Promise<any> {
  const membresiaExistente = await prisma.membresia.findFirst({
    where: {
      clienteId,
      estado: { in: ['ACTIVA', 'PAUSADA'] }
    }
  });

  if (membresiaExistente) {
    throw new ConflictError('El cliente ya tiene una membresía activa');
  }

  const ahora = new Date();
  const fechaProximoPago = new Date(ahora);
  fechaProximoPago.setMonth(fechaProximoPago.getMonth() + 1);

  return await prisma.membresia.create({
    data: {
      clienteId,
      plan: 'ESTANDAR',
      precio,
      fechaInicio: ahora,
      fechaProximoPago,
      estado: 'ACTIVA',
      serviciosDisponibles: 999,
      serviciosUsados: 0
    }
  });
}

export async function renovarMembresia(
  membresiaId: string,
  pagoId: string
): Promise<any> {
  const membresia = await prisma.membresia.findUnique({
    where: { id: membresiaId }
  });

  if (!membresia) {
    throw new NotFoundError('Membresía no encontrada');
  }

  const ahora = new Date();
  const nuevaFechaProximoPago = new Date(
    membresia.fechaProximoPago && membresia.fechaProximoPago > ahora
      ? membresia.fechaProximoPago
      : ahora
  );
  nuevaFechaProximoPago.setMonth(nuevaFechaProximoPago.getMonth() + 1);

  return await prisma.membresia.update({
    where: { id: membresiaId },
    data: {
      fechaProximoPago: nuevaFechaProximoPago,
      estado: 'ACTIVA'
    }
  });
}

export async function suspenderMembresia(membresiaId: string): Promise<any> {
  return await prisma.membresia.update({
    where: { id: membresiaId },
    data: { estado: 'PAUSADA' }
  });
}

export async function cancelarMembresia(membresiaId: string): Promise<any> {
  return await prisma.membresia.update({
    where: { id: membresiaId },
    data: { 
      estado: 'CANCELADA',
      fechaProximoPago: new Date()
    }
  });
}

export async function verificarMembresiasVencidas(): Promise<number> {
  const ahora = new Date();
  
  const result = await prisma.membresia.updateMany({
    where: {
      estado: 'ACTIVA',
      fechaProximoPago: { lt: ahora }
    },
    data: { estado: 'VENCIDA' }
  });

  return result.count;
}

export async function calcularPrecioConDescuento(
  precioBase: number,
  tipoServicio: string,
  tieneMembresiaActiva: boolean
): Promise<number> {
  if (tipoServicio === 'MANTENIMIENTO' && tieneMembresiaActiva) {
    return 0;
  }

  if (tipoServicio === 'AMPLIACION') {
    const config = await prisma.configuracion.findUnique({
      where: { clave: 'ampliacion_descuento' }
    });
    const descuento = config ? parseFloat(config.valor) : 20;
    return precioBase * (1 - descuento / 100);
  }

  if (tipoServicio === 'OBRA') {
    const config = await prisma.configuracion.findUnique({
      where: { clave: 'obra_descuento' }
    });
    const descuento = config ? parseFloat(config.valor) : 30;
    return precioBase * (1 - descuento / 100);
  }

  return precioBase;
}
