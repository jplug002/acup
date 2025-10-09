export function generateMembershipNumber(userId: number): string {
  // Fixed prefix for all ACUP members: GHMUB09202503M
  // GH = Ghana, MUB = first 3 chars, 09 = September, 2025 = year, 03 = birth year, M = Male
  const fixedPrefix = "GHMUB09202503M"

  // Format: FIXED_PREFIX + USERID
  return `${fixedPrefix}${userId}`
}
