export const PROFESSIONAL_ROLE_SET = ["doctor", "nurse", "teacher", "pharmacist"];
export const ORGANIZATION_ROLE_SET = ["hospital", "pharmacy", "school"];

export const BOOKING_STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELED"];

export function countBy(items, keyFn) {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}
