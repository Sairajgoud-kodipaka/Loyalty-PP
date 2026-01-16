'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

export default function ServiceWorkerUpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || 'serviceWorker' in navigator === false) {
      return
    }

    const checkForUpdate = () => {
      const registration = (window as any).__swRegistration as ServiceWorkerRegistration | undefined
      
      if (!registration) {
        return
      }

      // Check if there's a waiting service worker
      if (registration.waiting) {
        setShowPrompt(true)
        return
      }

      // Listen for update found
      const handleUpdateFound = () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is waiting
              setShowPrompt(true)
            }
          })
        }
      }

      registration.addEventListener('updatefound', handleUpdateFound)

      return () => {
        registration.removeEventListener('updatefound', handleUpdateFound)
      }
    }

    // Check immediately
    checkForUpdate()

    // Check periodically
    const interval = setInterval(checkForUpdate, 60000) // Every minute

    return () => {
      clearInterval(interval)
    }
  }, [])

  const handleUpdate = async () => {
    if (typeof window === 'undefined' || 'serviceWorker' in navigator === false) {
      return
    }

    setIsUpdating(true)

    try {
      const registration = (window as any).__swRegistration as ServiceWorkerRegistration | undefined
      
      if (registration?.waiting) {
        // Tell the waiting service worker to skip waiting
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        
        // Wait a moment for the service worker to activate
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Reload the page
        window.location.reload()
      } else {
        // Force update check
        await registration?.update()
        setIsUpdating(false)
        setShowPrompt(false)
      }
    } catch (error) {
      console.error('[SW Update] Failed to update:', error)
      setIsUpdating(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Don't show again for this session
    sessionStorage.setItem('sw-update-dismissed', 'true')
  }

  // Don't show if dismissed this session
  useEffect(() => {
    if (sessionStorage.getItem('sw-update-dismissed') === 'true') {
      setShowPrompt(false)
    }
  }, [])

  if (!showPrompt) {
    return null
  }

  return (
    <div
      className={cn(
        'fixed bottom-24 lg:bottom-4 left-4 right-4 lg:right-4 z-50',
        'max-w-sm lg:max-w-md mx-auto lg:mx-0',
        'bg-card border border-border rounded-lg shadow-xl',
        'p-4 animate-in slide-in-from-bottom-4',
        'backdrop-blur-sm'
      )}
      style={{
        bottom: 'max(6rem, calc(4rem + env(safe-area-inset-bottom, 0px)))',
      }}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <RefreshCw 
              className={cn(
                'h-5 w-5 text-primary',
                isUpdating && 'animate-spin'
              )} 
              aria-hidden="true" 
            />
            <h3 className="font-semibold text-sm">Update Available</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            A new version of the app is available. Update now to get the latest features and improvements.
          </p>
          <div className="flex gap-2">
            <Button
              onClick={handleUpdate}
              size="sm"
              className="flex-1 min-h-9"
              disabled={isUpdating}
            >
              <RefreshCw 
                className={cn(
                  'h-4 w-4 mr-1.5',
                  isUpdating && 'animate-spin'
                )} 
                aria-hidden="true" 
              />
              {isUpdating ? 'Updating...' : 'Update Now'}
            </Button>
            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="sm"
              className="min-h-9 min-w-9 px-2"
              aria-label="Dismiss"
              disabled={isUpdating}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
