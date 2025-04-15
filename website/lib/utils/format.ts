export function formatDate(dateString: string | null | undefined) {
  // If the input is null or undefined, return a placeholder
  if (dateString === null || dateString === undefined) {
    return "N/A"
  }

  try {
    // Try to create a Date object
    const date = new Date(dateString)

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date string: ${dateString}`)
      return "Invalid date"
    }

    // Format the date
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  } catch (error) {
    console.error(`Error formatting date: ${dateString}`, error)
    return "Error formatting date"
  }
}

export function parsePercentage(value: string | null | undefined): number {
  if (!value) return 0

  // Remove % sign if present
  const cleanValue = value.replace("%", "")

  // Parse to number
  const numValue = Number.parseFloat(cleanValue)

  // Return 0 if NaN
  return isNaN(numValue) ? 0 : numValue
}
