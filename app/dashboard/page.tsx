import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import Link from 'next/link'
import { UserPlus, ShoppingBag, Gift, Users, Coins, TrendingUp, AlertTriangle, ArrowRight, Search, Sparkles } from 'lucide-react'
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import SearchBar from '@/components/customers/SearchBar'
import { Suspense } from 'react'

async function DashboardStats() {
  const supabase = await createClient()
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Get today's stats
  const { data: todayCustomers, error: customersError } = await supabase
    .from('customers')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', today.toISOString())
  
  const { data: todayTransactions, error: transactionsError } = await supabase
    .from('transactions')
    .select('points_earned, points_redeemed')
    .gte('created_at', today.toISOString())
  
  if (customersError || transactionsError) {
    return (
      <div className="text-center py-8 text-destructive">
        <p>Failed to load dashboard statistics</p>
      </div>
    )
  }
  
  const todayPoints = todayTransactions?.reduce((sum, t) => sum + (Number(t.points_earned) || 0), 0) || 0
  const todayRedemptions = todayTransactions?.filter(t => t.points_redeemed > 0).length || 0
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card hover>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">New Customers</p>
              <p className="text-3xl font-bold">{todayCustomers?.count || 0}</p>
              <p className="text-xs text-muted-foreground">Today</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card hover>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Points Issued</p>
              <p className="text-3xl font-bold">{todayPoints.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Today</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
              <Coins className="h-6 w-6 text-success" aria-hidden="true" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card hover>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Redemptions</p>
              <p className="text-3xl font-bold">{todayRedemptions}</p>
              <p className="text-xs text-muted-foreground">Today</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-warning" aria-hidden="true" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

async function RecentActivity() {
  const supabase = await createClient()
  
  const { data: recentTransactions, error } = await supabase
    .from('transactions')
    .select(`
      *,
      customers!inner(mgp_id, name)
    `)
    .order('created_at', { ascending: false })
    .limit(10)
  
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-destructive">Failed to load recent activity</p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest transactions and point movements</CardDescription>
      </CardHeader>
      <CardContent>
        {recentTransactions && recentTransactions.length > 0 ? (
          <div className="space-y-3">
            {recentTransactions.map((transaction: any) => (
              <Link
                key={transaction.id}
                href={`/customers/${transaction.customer_id}`}
                className="block"
              >
                <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={transaction.transaction_type === 'PURCHASE' ? 'success' : 'warning'}
                      >
                        {transaction.transaction_type === 'PURCHASE' ? 'Purchase' : 'Redemption'}
                      </Badge>
                      <span className="font-semibold text-sm truncate">
                        {transaction.customers.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({transaction.customers.mgp_id})
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(transaction.created_at), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    {transaction.transaction_type === 'PURCHASE' ? (
                      <div className="text-success font-semibold">+{transaction.points_earned} pts</div>
                    ) : (
                      <div className="text-destructive font-semibold">-{transaction.points_redeemed} pts</div>
                    )}
                    {transaction.bill_amount && (
                      <div className="text-xs text-muted-foreground">
                        ₹{Number(transaction.bill_amount).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent activity</p>
            <p className="text-sm mt-1">Transactions will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

async function ExpiringPointsAlert() {
  const supabase = await createClient()
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
  
  const { data: expiringPoints, error } = await supabase
    .from('point_ledger')
    .select(`
      points,
      customers!inner(id, mgp_id, name)
    `)
    .eq('type', 'EARNED')
    .eq('is_active', true)
    .eq('is_expired', false)
    .lte('expiry_date', thirtyDaysFromNow.toISOString())
    .gte('expiry_date', today.toISOString())
  
  if (error || !expiringPoints) {
    return null
  }
  
  const expiringCount = new Set(expiringPoints.map(p => p.customers.id)).size
  
  if (expiringCount === 0) {
    return null
  }
  
  return (
    <Card className="border-warning/50 bg-warning/5">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-warning" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-warning-foreground mb-1">Points Expiring Soon</h3>
            <p className="text-sm text-muted-foreground">
              {expiringCount} customer{expiringCount !== 1 ? 's have' : ' has'} points expiring within 30 days.
              Consider reaching out to encourage redemption.
            </p>
            <Link href="/reports/balance" className="mt-3 inline-flex items-center text-sm font-medium text-warning hover:underline">
              View Details
              <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

async function CustomerCount() {
  const supabase = await createClient()
  const { count } = await supabase
    .from('customers')
    .select('*', { count: 'exact', head: true })
  
  return count || 0
}

export default async function DashboardPage() {
  await requireAuth()
  const totalCustomers = await CustomerCount()
  const isNewUser = totalCustomers === 0
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's what's happening with your loyalty program today.
          </p>
        </div>
        
        {/* Getting Started for New Users */}
        {isNewUser && (
          <Card className="border-primary/50 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground mb-2">Get Started</h2>
                  <p className="text-muted-foreground mb-4">
                    Welcome to MGP Loyalty System! Start by registering your first customer or searching for an existing one.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/customers/register">
                      <Button>
                        <UserPlus className="mr-2 h-4 w-4" aria-hidden="true" />
                        Register First Customer
                      </Button>
                    </Link>
                    <Link href="/customers/search">
                      <Button variant="outline">
                        <Search className="mr-2 h-4 w-4" aria-hidden="true" />
                        Search Customers
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Quick Customer Search - Most Important Action */}
        {!isNewUser && (
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" aria-hidden="true" />
                <CardTitle>Quick Customer Search</CardTitle>
              </div>
              <CardDescription>
                Search for a customer to view their profile, record a purchase, or redeem points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SearchBar />
            </CardContent>
          </Card>
        )}
        
        {/* Stats */}
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <LoadingSpinner text="Loading stats..." />
                </CardContent>
              </Card>
            ))}
          </div>
        }>
          <DashboardStats />
        </Suspense>
        
        {/* Primary Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to get you started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/customers/search" className="block">
                <div className="w-full h-auto p-6 rounded-md border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all cursor-pointer group">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-primary/20 group-hover:bg-primary/30 flex items-center justify-center transition-colors">
                      <Search className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">Search Customer</div>
                      <div className="text-xs text-muted-foreground mt-1">Find existing customers</div>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link href="/customers/register" className="block">
                <div className="w-full h-auto p-6 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <UserPlus className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="font-semibold">Register Customer</div>
                      <div className="text-xs text-muted-foreground mt-1">Add new customer</div>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link href="/customers/search" className="block">
                <div className="w-full h-auto p-6 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-success" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="font-semibold">New Purchase</div>
                      <div className="text-xs text-muted-foreground mt-1">Record purchase</div>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link href="/customers/search" className="block">
                <div className="w-full h-auto p-6 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center">
                      <Gift className="h-6 w-6 text-warning" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="font-semibold">Redeem Points</div>
                      <div className="text-xs text-muted-foreground mt-1">Process redemption</div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Alerts */}
        <Suspense fallback={null}>
          <ExpiringPointsAlert />
        </Suspense>
        
        {/* Recent Activity */}
        <Suspense fallback={
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <LoadingSpinner text="Loading recent activity..." />
            </CardContent>
          </Card>
        }>
          <RecentActivity />
        </Suspense>
      </div>
    </div>
  )
}
