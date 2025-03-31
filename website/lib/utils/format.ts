export function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
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

