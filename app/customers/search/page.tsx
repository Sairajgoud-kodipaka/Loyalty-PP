import { requireAuth } from '@/lib/auth'
import SearchBar from '@/components/customers/SearchBar'
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Search, Users, UserPlus, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export default async function SearchCustomersPage() {
  await requireAuth()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Search Customers</h1>
          <p className="text-muted-foreground">
            Find customers by phone number, MGP ID, name, or Aadhar number
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="space-y-4">
          <SearchBar />
        </div>
        
        {/* Help Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card hover>
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Search className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <h3 className="font-semibold mb-1">Quick Search</h3>
              <p className="text-sm text-muted-foreground">
                Type at least 2 characters to start searching
              </p>
            </CardContent>
          </Card>
          
          <Card hover>
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-success" aria-hidden="true" />
              </div>
              <h3 className="font-semibold mb-1">View Profile</h3>
              <p className="text-sm text-muted-foreground">
                Click on any result to view full customer details
              </p>
            </CardContent>
          </Card>
          
          <Card hover>
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-3">
                <UserPlus className="h-6 w-6 text-warning" aria-hidden="true" />
              </div>
              <h3 className="font-semibold mb-1">New Customer</h3>
              <p className="text-sm text-muted-foreground">
                Can't find a customer? Register them now
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for customer management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Link href="/customers/register">
                <Button variant="default">
                  <UserPlus className="w-4 h-4 mr-2" aria-hidden="true" />
                  Register New Customer
                </Button>
              </Link>
              <Link href="/transactions/purchase">
                <Button variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" aria-hidden="true" />
                  Record Purchase
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
