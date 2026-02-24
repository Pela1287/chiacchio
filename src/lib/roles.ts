export const roleHierarchy = {
  CLIENTE: 1,
  ADMIN: 2,
  SUPER: 3,
};

export function hasAccess(userRole: string, requiredRole: string) {
  if (!userRole) return false;

  return roleHierarchy[userRole as keyof typeof roleHierarchy] >=
         roleHierarchy[requiredRole as keyof typeof roleHierarchy];
}