export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validarTelefonoArgentino(telefono: string): boolean {
  const cleaned = telefono.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 13 && /^(54)?9?\d{10}$/.test(cleaned);
}

export function normalizarTelefono(telefono: string): string {
  const cleaned = telefono.replace(/\D/g, '');
  if (cleaned.startsWith('549')) return `+${cleaned}`;
  if (cleaned.startsWith('54')) return `+${cleaned}`;
  if (cleaned.startsWith('9')) return `+549${cleaned.slice(1)}`;
  return `+549${cleaned}`;
}

export function validarPrecio(precio: number): boolean {
  return precio > 0 && precio < 100000000;
}

export function validarDescripcion(descripcion: string, minLength = 10, maxLength = 1000): boolean {
  return descripcion.length >= minLength && descripcion.length <= maxLength;
}

export function validarFechaFutura(fecha: string): boolean {
  const fechaObj = new Date(fecha);
  return fechaObj > new Date();
}

export function sanitizeString(str: string): string {
  return str.trim().replace(/[<>]/g, '');
}

export function validarCBU(cbu: string): boolean {
  const cleaned = cbu.replace(/\D/g, '');
  return cleaned.length === 22;
}

export function validarEstadoSolicitud(estado: string): boolean {
  return ['PENDIENTE', 'CONFIRMADA', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA'].includes(estado);
}

export function validarEstadoMembresia(estado: string): boolean {
  return ['ACTIVA', 'SUSPENDIDA', 'CANCELADA', 'VENCIDA'].includes(estado);
}

export function validarPrioridad(prioridad: string): boolean {
  return ['BAJA', 'MEDIA', 'ALTA', 'URGENTE'].includes(prioridad);
}

export function validarRol(rol: string): boolean {
  const normalized = rol.toUpperCase();
  return ['SUPER', 'ADMIN', 'CLIENTE'].includes(normalized);
}
