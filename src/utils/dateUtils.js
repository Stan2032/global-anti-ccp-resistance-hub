/**
 * Date utilities for age calculation and date formatting.
 * Used by profile pages and ProfilesIndex to keep ages current.
 */

/**
 * Calculate age from a birth date string.
 * Handles formats: "December 8, 1947", "1964" (year only), "April 25, 1989"
 * If a death date is provided, calculates age at death instead.
 *
 * @param {string} birthDate - Birth date string
 * @param {string} [deathDate] - Optional death date string
 * @returns {number} Calculated age
 */
export function calculateAge(birthDate, deathDate) {
  const endDate = deathDate ? new Date(deathDate) : new Date();
  const birth = new Date(birthDate);

  // If only a year was provided (e.g. "1964"), Date parses it as Jan 1
  // In that case, just do year subtraction
  if (/^\d{4}$/.test(birthDate.trim())) {
    return endDate.getFullYear() - parseInt(birthDate, 10);
  }

  let age = endDate.getFullYear() - birth.getFullYear();
  const monthDiff = endDate.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && endDate.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}
