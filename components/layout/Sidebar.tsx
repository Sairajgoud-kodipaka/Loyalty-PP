'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Users, 
  ShoppingBag, 
  BarChart3, 
  LogOut,
  X
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils/cn';
import ProfileButton from './ProfileButton';
import { useSidebar } from './SidebarContext';

interface SidebarProps {
  userEmail?: string;
  userRole?: string;
}

const navigationItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/customers/', icon: Users, label: 'Customers' },
  { href: '/transactions/history', icon: ShoppingBag, label: 'Transactions' },
  { href: '/reports/balance', icon: BarChart3, label: 'Reports' },
];

export default function Sidebar({ userEmail, userRole }: SidebarProps) {
  const { isMobileOpen, setIsMobileOpen } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  // Swipe gesture to open sidebar from left edge
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleTouchStart = (e: TouchEvent) => {
      // Only detect swipe from left edge (first 20px)
      if (e.touches[0].clientX < 20 && !isMobileOpen) {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;

      const deltaX = e.touches[0].clientX - touchStartX.current;
      const deltaY = Math.abs(e.touches[0].clientY - touchStartY.current);

      // Only trigger if horizontal swipe is greater than vertical (more horizontal than vertical)
      if (deltaX > 50 && deltaX > deltaY) {
        setIsMobileOpen(true);
        touchStartX.current = null;
        touchStartY.current = null;
      }
    };

    const handleTouchEnd = () => {
      touchStartX.current = null;
      touchStartY.current = null;
    };

    // Only enable swipe on mobile
    if (window.innerWidth < 1024) {
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchmove', handleTouchMove, { passive: true });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobileOpen]);

  return (
    <>
      {/* Profile Button - Top Right (Mobile Only) */}
      <ProfileButton 
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        isOpen={isMobileOpen}
        userEmail={userEmail}
      />

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full bg-card border-r border-border z-40',
          'w-[85vw] max-w-64 sm:w-64', // Responsive width: 85% viewport on very small screens, max 256px
          'transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        style={{
          // Safe area insets for devices with notches
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {/* Logo/Brand */}
        <div className="p-6 border-b border-border relative">
          {/* Close Button - Top Right (Mobile Only) */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className={cn(
              'lg:hidden absolute z-10',
              'min-h-10 min-w-10 h-10 w-10',
              'top-4 right-4',
              'bg-card rounded-lg shadow-md border border-border',
              'hover:bg-accent active:bg-accent/80',
              'transition-all duration-200',
              'flex items-center justify-center',
              'touch-manipulation',
              'focus-ring'
            )}
            aria-label="Close sidebar"
          >
            <X size={20} className="text-foreground" aria-hidden="true" />
          </button>
          
          <div className="flex items-center gap-3 mb-2 pr-12 lg:pr-0">
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
           
          </div>
          <p className="text-xs text-muted-foreground">
            Mangatrai Pearls & Jewellers
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1 sm:space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 rounded-lg',
                  'min-h-11 h-11', // Minimum 44px touch target
                  'transition-colors duration-200',
                  'focus-ring touch-manipulation',
                  active 
                    ? 'bg-primary text-primary-foreground font-medium' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent active:bg-accent/80'
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={20} aria-hidden="true" />
                <span className="text-sm sm:text-base">{item.label}</span>
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

