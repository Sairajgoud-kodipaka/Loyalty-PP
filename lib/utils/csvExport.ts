/**
 * Converts an array of objects to CSV format and triggers download
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers?: Record<keyof T, string>
): void {
  if (!data || data.length === 0) {
    alert('No data to export')
    return
  }

  // Get all unique keys from the data
  const keys = Object.keys(data[0]) as Array<keyof T>
  
  // Create header row
  const headerRow = keys.map(key => {
    const header = headers?.[key] || String(key)
    return escapeCSVValue(header)
  }).join(',')
  
  // Create data rows
  const dataRows = data.map(row => {
    return keys.map(key => {
      const value = row[key]
      return escapeCSVValue(formatCSVValue(value))
    }).join(',')
  })
  
  // Combine header and data
  const csvContent = [headerRow, ...dataRows].join('\n')
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

/**
 * Escapes CSV values that contain commas, quotes, or newlines
 */
function escapeCSVValue(value: string): string {
  if (value === null || value === undefined) {
    return ''
  }
  
  const stringValue = String(value)
  
  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  
  return stringValue
}

/**
 * Formats a value for CSV export
 */
function formatCSVValue(value: any): string {
  if (value === null || value === undefined) {
    return ''
  }
  
  if (typeof value === 'object') {
    // Handle nested objects (e.g., customers.name)
    if (value.name !== undefined) {
      return String(value.name)
    }
    return JSON.stringify(value)
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }
  
  if (value instanceof Date) {
    return value.toISOString()
  }
  
  return String(value)
}

