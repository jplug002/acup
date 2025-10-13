export function generateMembershipNumber(
  userId: number,
  firstName: string,
  country: string,
  dateOfBirth: string | null,
  gender: string | null,
  registrationDate: string,
): string {
  // Get country code (first 2 letters, uppercase)
  const countryCode = (country || "XX").substring(0, 2).toUpperCase()

  // Get first 3 characters of first name (uppercase)
  const nameChars = (firstName || "XXX").substring(0, 3).toUpperCase()

  // Get month from registration date (2 digits)
  const regDate = new Date(registrationDate)
  const month = String(regDate.getMonth() + 1).padStart(2, "0")

  // Get year from registration date (4 digits)
  const year = regDate.getFullYear()

  // Get birth year (last 2 digits)
  let birthYear = "00"
  if (dateOfBirth) {
    const birthDate = new Date(dateOfBirth)
    birthYear = String(birthDate.getFullYear()).slice(-2)
  }

  // Get gender (M/F)
  const genderChar = gender?.toUpperCase().charAt(0) || "X"

  // Format: COUNTRYCODE + FIRST3CHARS + MONTH + YEAR + BIRTHYEAR + GENDER + USERID
  return `${countryCode}${nameChars}${month}${year}${birthYear}${genderChar}${userId}`
}
