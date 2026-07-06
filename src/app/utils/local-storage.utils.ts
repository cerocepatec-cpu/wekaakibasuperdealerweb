export function getLocalRoles(): string[] {
  try {
    const roles = localStorage.getItem('roles');
    if (!roles) return [];
    const parsed = JSON.parse(roles);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getLocalPermissions(): string[] {
  try {
    const permissions = localStorage.getItem('permissions');
    if (!permissions) return [];
    const parsed = JSON.parse(permissions);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
