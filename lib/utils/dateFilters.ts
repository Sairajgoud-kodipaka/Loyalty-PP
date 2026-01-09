export type DateFilterType = 'today' | 'yesterday' | 'week' | 'month'

export interface DateRange {
  start: Date
  end: Date
}

export function getDateRange(filter: DateFilterType): DateRange {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const end = new Date(today)
  end.setHours(23, 59, 59, 999)
  
  let start: Date
  
  switch (filter) {
    case 'today':
      start = new Date(today)
      break
      
    case 'yesterday':
      start = new Date(today)
      start.setDate(start.getDate() - 1)
      end.setDate(end.getDate() - 1)
      end.setHours(23, 59, 59, 999)
      break
      
    case 'week':
      start = new Date(today)
      start.setDate(start.getDate() - start.getDay()) // Start of week (Sunday)
      break
      
    case 'month':
      start = new Date(today.getFullYear(), today.getMonth(), 1)
      break
      
    default:
      start = new Date(today)
  }
  
  start.setHours(0, 0, 0, 0)
  
  return { start, end }
}

export function formatDateRange(filter: DateFilterType): string {
  const { start, end } = getDateRange(filter)
  const formatOptions: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  }
  
  if (filter === 'today' || filter === 'yesterday') {
    return start.toLocaleDateString('en-US', formatOptions)
  }
  
  return `${start.toLocaleDateString('en-US', formatOptions)} - ${end.toLocaleDateString('en-US', formatOptions)}`
}


