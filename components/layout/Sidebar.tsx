'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Users, 
  ShoppingBag, 
  BarChart3, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils/cn';

interface SidebarProps {
  userEmail?: string;
  userRole?: string;
}

const navigationItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/customers/search', icon: Users, label: 'Customers' },
  { href: '/transactions/history', icon: ShoppingBag, label: 'Transactions' },
  { href: '/reports/balance', icon: BarChart3, label: 'Reports' },
];

export default function Sidebar({ userEmail, userRole }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card rounded-md shadow-md border border-border hover:bg-accent transition-colors"
        aria-label="Toggle sidebar"
        aria-expanded={isMobileOpen}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-40',
          'transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo/Brand */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative h-10 w-auto flex-shrink-0">
              <Image
                src="/pearl-logo.png"
                alt="Mangatrai Pearls & Jewellers"
                width={120}
                height={50}
                priority
                className="h-auto w-auto max-h-10 object-contain"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-primary truncate">MGP Loyalty</h1>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Mangatrai Pearls & Jewellers
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg',
                  'transition-colors duration-200',
                  'focus-ring',
                  active 
                    ? 'bg-primary text-primary-foreground font-medium' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={20} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Sign Out */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card">
          {userEmail && (
            <div className="mb-3 px-4">
              <p className="text-sm font-medium text-foreground truncate">
                {userEmail}
              </p>
              {userRole && (
                <p className="text-xs text-muted-foreground capitalize">
                  {userRole}
                </p>
              )}
            </div>
          )}
          <button
            onClick={handleSignOut}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3',
              'text-destructive hover:bg-destructive/10',
              'rounded-lg transition-colors duration-200',
              'focus-ring'
            )}
            aria-label="Sign out"
          >
            <LogOut size={20} aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

