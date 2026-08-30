export const PROFESSIONAL_ROLES = ["doctor", "nurse", "teacher", "pharmacist"];
export const ORGANIZATION_ROLES = ["hospital", "pharmacy", "school"];

export function dashboardPathForRole(role) {
    if (PROFESSIONAL_ROLES.includes(role)) return "/professional";
    if (ORGANIZATION_ROLES.includes(role)) return "/organization";
    return "/";
}
