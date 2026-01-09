'use client'

import { User } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface ProfileButtonProps {
  onClick: () => void
  isOpen: boolean
  userEmail?: string
}

export default function ProfileButton({ onClick, isOpen, userEmail }: ProfileButtonProps) {
  // Don't show on desktop - sidebar is always visible
  return (
    <button
      onClick={onClick}
      className={cn(
        'lg:hidden fixed z-50',
        'min-h-11 min-w-11 h-11 w-11',
        'top-4 right-4',
        'bg-card rounded-full shadow-lg border border-border',
        'hover:bg-accent active:bg-accent/80',
        'transition-all duration-200',
        'flex items-center justify-center',
        'touch-manipulation',
        'focus-ring',
        isOpen && 'ring-2 ring-primary ring-offset-2'
      )}
      style={{
        // Safe area insets for devices with notches
        top: 'max(1rem, env(safe-area-inset-top, 1rem))',
        right: 'max(1rem, env(safe-area-inset-right, 1rem))',
      }}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      {userEmail ? (
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-xs font-semibold text-primary">
            {userEmail.charAt(0).toUpperCase()}
          </span>
        </div>
      ) : (
        <User size={20} className="text-foreground" aria-hidden="true" />
      )}
    </button>
  )
}

