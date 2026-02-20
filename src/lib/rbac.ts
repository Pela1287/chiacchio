/* ============================================
   CHIACCHIO - Sistema de Permisos RBAC
   Control de acceso basado en roles
   ============================================ */

import { UserRole } from '@/types';

// Definición de permisos por rol
type Permiso = 
  | 'clientes:ver'
  | 'clientes:crear'
  | 'clientes:editar'
  | 'clientes:eliminar'
  | 'membresias:ver'
  | 'membresias:crear'
  | 'membresias:editar'
  | 'membresias:eliminar'
  | 'servicios:ver'
  | 'servicios:crear'
  | 'servicios:editar'
  | 'servicios:eliminar'
  | 'solicitudes:ver'
  | 'solicitudes:crear'
  | 'solicitudes:editar'
  | 'solicitudes:eliminar'
  | 'presupuestos:ver'
  | 'presupuestos:crear'
  | 'presupuestos:editar'
  | 'presupuestos:eliminar'
  | 'pagos:ver'
  | 'pagos:crear'
  | 'leads:ver'
  | 'leads:editar'
  | 'usuarios:ver'
  | 'usuarios:crear'
  | 'usuarios:editar'
  | 'usuarios:eliminar'
  | 'configuracion:ver'
  | 'configuracion:editar'
  | 'dashboard:ver'
  | 'reportes:ver';

const permisosPorRol: Record<UserRole, Permiso[]> = {
  super: [
    // Permisos completos
    'clientes:ver', 'clientes:crear', 'clientes:editar', 'clientes:eliminar',
    'membresias:ver', 'membresias:crear', 'membresias:editar', 'membresias:eliminar',
    'servicios:ver', 'servicios:crear', 'servicios:editar', 'servicios:eliminar',
    'solicitudes:ver', 'solicitudes:crear', 'solicitudes:editar', 'solicitudes:eliminar',
    'presupuestos:ver', 'presupuestos:crear', 'presupuestos:editar', 'presupuestos:eliminar',
    'pagos:ver', 'pagos:crear',
    'leads:ver', 'leads:editar',
    'usuarios:ver', 'usuarios:crear', 'usuarios:editar', 'usuarios:eliminar',
    'configuracion:ver', 'configuracion:editar',
    'dashboard:ver', 'reportes:ver'
  ],
  admin: [
    // Sin gestión de usuarios ni configuración crítica
    'clientes:ver', 'clientes:crear', 'clientes:editar', 'clientes:eliminar',
    'membresias:ver', 'membresias:crear', 'membresias:editar', 'membresias:eliminar',
    'servicios:ver', 'servicios:crear', 'servicios:editar',
    'solicitudes:ver', 'solicitudes:crear', 'solicitudes:editar', 'solicitudes:eliminar',
    'presupuestos:ver', 'presupuestos:crear', 'presupuestos:editar', 'presupuestos:eliminar',
    'pagos:ver', 'pagos:crear',
    'leads:ver', 'leads:editar',
    'dashboard:ver', 'reportes:ver'
  ],
  cliente: [
    // Solo sus propios datos
    'clientes:ver',
    'membresias:ver',
    'servicios:ver',
    'solicitudes:ver', 'solicitudes:crear',
    'presupuestos:ver',
    'pagos:ver'
  ]
};

/**
 * Verifica si un rol tiene un permiso específico
 */
export function can(rol: UserRole | null, permiso: Permiso): boolean {
  if (!rol) return false;
  return permisosPorRol[rol]?.includes(permiso) ?? false;
}

/**
 * Verifica si un rol tiene todos los permisos listados
 */
export function canAll(rol: UserRole | null, permisos: Permiso[]): boolean {
  if (!rol) return false;
  return permisos.every(p => can(rol, p));
}

/**
 * Verifica si un rol tiene al menos uno de los permisos listados
 */
export function canAny(rol: UserRole | null, permisos: Permiso[]): boolean {
  if (!rol) return false;
  return permisos.some(p => can(rol, p));
}

/**
 * Obtiene todos los permisos de un rol
 */
export function getPermisos(rol: UserRole): Permiso[] {
  return permisosPorRol[rol] ?? [];
}

/**
 * Verifica si el usuario puede acceder a una ruta de panel
 */
export function canAccessPanel(rol: UserRole | null, panel: 'super' | 'admin' | 'cliente'): boolean {
  if (!rol) return false;
  
  switch (panel) {
    case 'super':
      return rol === 'super';
    case 'admin':
      return rol === 'super' || rol === 'admin';
    case 'cliente':
      return true; // Todos los roles autenticados pueden ver el panel cliente
    default:
      return false;
  }
}

/**
 * Obtiene la ruta del panel según el rol
 */
export function getPanelRoute(rol: UserRole): string {
  switch (rol) {
    case 'super':
      return '/panel/super';
    case 'admin':
      return '/panel/admin';
    case 'cliente':
    default:
      return '/panel/cliente';
  }
}

/**
 * Obtiene el nombre legible del rol
 */
export function getRolNombre(rol: UserRole): string {
  switch (rol) {
    case 'super':
      return 'Super Usuario';
    case 'admin':
      return 'Administrador';
    case 'cliente':
      return 'Cliente';
    default:
      return 'Sin rol';
  }
}

/**
 * Obtiene el color del badge según el rol
 */
export function getRolColor(rol: UserRole): string {
  switch (rol) {
    case 'super':
      return 'var(--color-error)';
    case 'admin':
      return 'var(--color-warning)';
    case 'cliente':
    default:
      return 'var(--color-primary)';
  }
}
