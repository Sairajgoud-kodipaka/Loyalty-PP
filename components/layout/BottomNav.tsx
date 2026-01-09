'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, ShoppingBag, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const navigationItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/customers', icon: Users, label: 'Customers' },
  { href: '/transactions/history', icon: ShoppingBag, label: 'Transactions' },
  { href: '/reports/balance', icon: BarChart3, label: 'Reports' },
]

export default function BottomNav() {
  const pathname = usePathname()

  // Don't show on auth pages
  if (pathname?.startsWith('/login') || pathname?.startsWith('/register') || pathname?.startsWith('/(auth)')) {
    return null
  }

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/')
  }

  return (
    <nav
      className={cn(
        'lg:hidden fixed bottom-0 left-0 right-0 z-40',
        'bg-card/95 backdrop-blur-sm border-t border-border shadow-lg',
        'safe-area-inset-bottom' // For devices with home indicators
      )}
      style={{
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0.5rem))',
      }}
    >
      <div className="grid grid-cols-4 h-16">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1',
                'min-h-16 h-16',
                'transition-colors duration-200',
                'touch-manipulation',
                'focus-ring',
                active
                  ? 'text-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 active:bg-accent'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon 
                size={22} 
                className={cn(
                  'shrink-0',
                  active && 'text-primary'
                )}
                aria-hidden="true"
              />
              <span className={cn(
                'text-xs font-medium leading-tight',
                active && 'text-primary'
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

