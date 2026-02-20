/* ============================================
   CHIACCHIO - Funciones de Utilidad
   ============================================ */

/**
 * Formatea una fecha a formato legible en español
 */
export function formatearFecha(fecha: Date | string, opciones?: Intl.DateTimeFormatOptions): string {
  const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
  return fechaObj.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...opciones
  });
}

/**
 * Formatea una fecha con hora
 */
export function formatearFechaHora(fecha: Date | string): string {
  const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
  return fechaObj.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Formatea un número como moneda (pesos argentinos)
 */
export function formatearMoneda(monto: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  }).format(monto);
}

/**
 * Formatea un número con separador de miles
 */
export function formatearNumero(numero: number): string {
  return new Intl.NumberFormat('es-AR').format(numero);
}

/**
 * Genera un ID único
 */
export function generarId(prefijo: string = ''): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return prefijo ? `${prefijo}-${timestamp}-${random}` : `${timestamp}-${random}`;
}

/**
 * Trunca un texto a una longitud máxima
 */
export function truncarTexto(texto: string, maxLength: number): string {
  if (texto.length <= maxLength) return texto;
  return texto.substring(0, maxLength - 3) + '...';
}

/**
 * Capitaliza la primera letra de cada palabra
 */
export function capitalizar(texto: string): string {
  return texto
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Formatea un número de teléfono
 */
export function formatearTelefono(telefono: string): string {
  // Eliminar todo lo que no sea número
  const numeros = telefono.replace(/\D/g, '');
  
  // Si tiene formato argentino con código de país
  if (numeros.startsWith('54') && numeros.length >= 12) {
    const codigo = numeros.slice(0, 4);
    const parte1 = numeros.slice(4, 7);
    const parte2 = numeros.slice(7, 11);
    return `+${codigo} ${parte1}-${parte2}`;
  }
  
  // Si tiene formato local argentino
  if (numeros.length === 10) {
    return `${numeros.slice(0, 4)}-${numeros.slice(4)}`;
  }
  
  return telefono;
}

/**
 * Valida un email
 */
export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida un teléfono argentino
 */
export function validarTelefono(telefono: string): boolean {
  const numeros = telefono.replace(/\D/g, '');
  return numeros.length >= 10 && numeros.length <= 13;
}

/**
 * Calcula la diferencia de días entre dos fechas
 */
export function diasDiferencia(fecha1: Date, fecha2: Date): number {
  const unDia = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((fecha1.getTime() - fecha2.getTime()) / unDia));
}

/**
 * Obtiene el nombre del mes en español
 */
export function nombreMes(mes: number): string {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return meses[mes] || '';
}

/**
 * Debounce para funciones
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Clona un objeto profundamente
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Obtiene las iniciales de un nombre
 */
export function getIniciales(nombre: string, apellido: string): string {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
}

/**
 * Calcula el tiempo transcurrido en formato relativo
 */
export function tiempoTranscurrido(fecha: Date | string): string {
  const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
  const ahora = new Date();
  const diferencia = ahora.getTime() - fechaObj.getTime();
  
  const segundos = Math.floor(diferencia / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  
  if (dias > 30) {
    return formatearFecha(fechaObj);
  } else if (dias > 0) {
    return `hace ${dias} día${dias > 1 ? 's' : ''}`;
  } else if (horas > 0) {
    return `hace ${horas} hora${horas > 1 ? 's' : ''}`;
  } else if (minutos > 0) {
    return `hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
  } else {
    return 'hace un momento';
  }
}
