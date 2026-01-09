'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import DateFilter from '@/components/reports/DateFilter'
import ExportButton from '@/components/reports/ExportButton'
import { DateFilterType } from '@/lib/utils/dateFilters'
import { getDateRange, formatDateRange } from '@/lib/utils/dateFilters'
import { exportToCSV } from '@/lib/utils/csvExport'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Link from 'next/link'
import { Users } from 'lucide-react'
import Badge from '@/components/ui/Badge'

export default function CustomersDatabaseClient() {
  const [filter, setFilter] = useState<DateFilterType>('month')
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)
  
  const supabase = createClient()
  
  useEffect(() => {
    loadCustomers()
  }, [filter, showAll])
  
  async function loadCustomers() {
    setLoading(true)
    setError(null)
    
    try {
      let query = supabase
        .from('customers')
        .select('id, mgp_id, name, phone, email, aadhar_number, available_points, total_points_earned, total_points_redeemed, status, created_at, updated_at')
        .eq('status', 'active')
      
      if (!showAll) {
        const { start, end } = getDateRange(filter)
        query = query
          .gte('created_at', start.toISOString())
          .lte('created_at', end.toISOString())
      }
      
      query = query.order('created_at', { ascending: false })
      
      const { data, error: fetchError } = await query
      
      if (fetchError) {
        setError(fetchError.message)
      } else {
        setCustomers(data || [])
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load customers')
    } finally {
      setLoading(false)
    }
  }
  
  function handleExport() {
    const exportData = customers.map(c => ({
      'MGP ID': c.mgp_id,
      'Name': c.name,
      'Phone': c.phone || '',
      'Email': c.email || '',
      'Aadhar Number': c.aadhar_number || '',
      'Available Points': c.available_points || 0,
      'Total Points Earned': c.total_points_earned || 0,
      'Total Points Redeemed': c.total_points_redeemed || 0,
      'Status': c.status || 'active',
      'Registration Date': c.created_at ? new Date(c.created_at).toLocaleString() : '',
      'Last Updated': c.updated_at ? new Date(c.updated_at).toLocaleString() : '',
    }))
    
    const filename = showAll 
      ? `customers_all_${new Date().toISOString().split('T')[0]}`
      : `customers_${filter}_${new Date().toISOString().split('T')[0]}`
    exportToCSV(exportData, filename)
  }
  
  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">Customers</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
            Complete customer database with filtering and export capabilities
            {!showAll && (
              <span className="hidden sm:inline"> • {formatDateRange(filter)}</span>
            )}
          </p>
          {!showAll && (
            <p className="text-xs sm:hidden text-muted-foreground mt-1">
              {formatDateRange(filter)}
            </p>
          )}
        </div>
        
        <Card>
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl lg:text-2xl">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" aria-hidden="true" />
                    <span className="truncate">All Customers</span>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-1">
                    {showAll 
                      ? `Showing all active customers (${customers.length} total)`
                      : `Customers registered in the selected period (${customers.length} customers)`
                    }
                  </CardDescription>
                </div>
              </div>
              
              {/* Mobile: Stack filters and buttons vertically */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-border">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {!showAll && (
                    <div className="w-full sm:w-auto">
                      <DateFilter value={filter} onChange={setFilter} />
                    </div>
                  )}
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="px-3 py-2 text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors min-h-9 touch-manipulation"
                  >
                    {showAll ? 'Filter by Date' : 'Show All'}
                  </button>
                </div>
                <div className="flex-shrink-0">
                  <ExportButton 
                    onClick={handleExport} 
                    disabled={loading || customers.length === 0}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 md:p-4 lg:p-6">
            {loading ? (
              <div className="p-8 sm:p-12 text-center">
                <LoadingSpinner text="Loading customers..." />
              </div>
            ) : error ? (
              <div className="p-4 sm:p-6 text-center text-destructive">
                <p className="text-sm sm:text-base">Failed to load customers: {error}</p>
              </div>
            ) : customers && customers.length > 0 ? (
              <>
                {/* Mobile Card View */}
                <div className="md:hidden space-y-2.5 px-3 sm:px-4 pb-3 sm:pb-4">
                  {customers.map((customer) => (
                    <Link
                      key={customer.id}
                      href={`/customers/${customer.id}`}
                      className="block p-3 sm:p-4 rounded-lg border border-border bg-card hover:bg-accent/50 active:bg-accent transition-colors touch-manipulation"
                    >
                      {/* Header: Name, MGP ID, and Points */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 mb-2">
                            <span className="text-base sm:text-lg font-semibold text-foreground truncate">
                              {customer.name}
                            </span>
                            <Badge variant="outline" className="text-xs font-mono shrink-0 w-fit">
                              {customer.mgp_id}
                            </Badge>
                          </div>
                          
                          {/* Contact Info - Stack vertically on very small screens */}
                          <div className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                            {customer.phone && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-muted-foreground/70">Phone:</span>
                                <span className="font-medium text-foreground">{customer.phone}</span>
                              </div>
                            )}
                            {customer.email && (
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="text-muted-foreground/70 shrink-0">Email:</span>
                                <span className="font-medium text-foreground truncate">{customer.email}</span>
                              </div>
                            )}
                            {!customer.phone && !customer.email && (
                              <div className="text-muted-foreground/70">No contact info</div>
                            )}
                          </div>
                        </div>
                        
                        {/* Points - Prominent display */}
                        <div className="text-right shrink-0 ml-2">
                          <div className="text-xl sm:text-2xl font-bold text-success">
                            {customer.available_points || 0}
                          </div>
                          <div className="text-xs text-muted-foreground">points</div>
                        </div>
                      </div>
                      
                      {/* Stats Grid */}
                      <div className="pt-3 border-t border-border">
                        <div className="grid grid-cols-2 gap-3 mb-2">
                          <div className="space-y-0.5">
                            <div className="text-xs text-muted-foreground">Earned</div>
                            <div className="text-sm font-semibold text-foreground">
                              {customer.total_points_earned || 0}
                            </div>
                          </div>
                          <div className="space-y-0.5">
                            <div className="text-xs text-muted-foreground">Redeemed</div>
                            <div className="text-sm font-semibold text-foreground">
                              {customer.total_points_redeemed || 0}
                            </div>
                          </div>
                        </div>
                        
                        {customer.created_at && (
                          <div className="text-xs text-muted-foreground pt-2 border-t border-border/50">
                            Registered: {new Date(customer.created_at).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          MGP ID
                        </th>
                        <th className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Available Points
                        </th>
                        <th className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Total Earned
                        </th>
                        <th className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Total Redeemed
                        </th>
                        <th className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Registered
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {customers.map((customer) => (
                        <tr key={customer.id} className="hover:bg-accent/50 transition-colors">
                          <td className="px-4 py-3 sm:px-6 whitespace-nowrap">
                            <Link
                              href={`/customers/${customer.id}`}
                              className="text-sm font-mono font-semibold text-primary hover:underline"
                            >
                              {customer.mgp_id}
                            </Link>
                          </td>
                          <td className="px-4 py-3 sm:px-6 whitespace-nowrap">
                            <Link
                              href={`/customers/${customer.id}`}
                              className="text-sm font-medium text-foreground hover:underline"
                            >
                              {customer.name}
                            </Link>
                          </td>
                          <td className="px-4 py-3 sm:px-6 whitespace-nowrap text-sm text-muted-foreground">
                            {customer.phone || '-'}
                          </td>
                          <td className="px-4 py-3 sm:px-6 whitespace-nowrap text-sm text-muted-foreground">
                            {customer.email || '-'}
                          </td>
                          <td className="px-4 py-3 sm:px-6 whitespace-nowrap">
                            <span className="text-sm font-semibold text-success">
                              {customer.available_points || 0}
                            </span>
                          </td>
                          <td className="px-4 py-3 sm:px-6 whitespace-nowrap text-sm text-foreground">
                            {customer.total_points_earned || 0}
                          </td>
                          <td className="px-4 py-3 sm:px-6 whitespace-nowrap text-sm text-foreground">
                            {customer.total_points_redeemed || 0}
                          </td>
                          <td className="px-4 py-3 sm:px-6 whitespace-nowrap text-sm text-muted-foreground">
                            {customer.created_at 
                              ? new Date(customer.created_at).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })
                              : '-'
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="p-8 sm:p-12 text-center text-muted-foreground">
                <p className="font-medium mb-1 text-sm sm:text-base">No customers found</p>
                <p className="text-xs sm:text-sm">
                  {showAll 
                    ? 'No active customers in the database'
                    : 'No customers registered in the selected period'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


