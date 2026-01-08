'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Home, Users, ShoppingBag, Gift, BarChart3, LogOut, Menu, X } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Customers', href: '/customers/search', icon: Users },
  { name: 'Transactions', href: '/transactions/history', icon: ShoppingBag },
  { name: 'Reports', href: '/reports/balance', icon: BarChart3 },
]

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Don't show navbar on auth pages
  if (pathname?.startsWith('/login') || pathname?.startsWith('/register') || pathname?.startsWith('/(auth)')) {
    return null
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 font-bold text-xl text-primary hover:text-primary/80 transition-colors focus-ring rounded-md"
            aria-label="MGP Loyalty Home"
          >
            <Home className="w-6 h-6" aria-hidden="true" />
            <span className="hidden sm:inline">MGP Loyalty</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors focus-ring',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <item.icon className="w-4 h-4" aria-hidden="true" />
                  {item.name}
                </Link>
              )
            })}
          </div>
          
          {/* Sign Out Button */}
          <div className="flex items-center gap-4">
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="hidden md:flex"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
              Sign Out
            </Button>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 animate-fade-in">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors focus-ring',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <item.icon className="w-5 h-5" aria-hidden="true" />
                    {item.name}
                  </Link>
                )
              })}
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleSignOut()
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus-ring"
              >
                <LogOut className="w-5 h-5" aria-hidden="true" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
