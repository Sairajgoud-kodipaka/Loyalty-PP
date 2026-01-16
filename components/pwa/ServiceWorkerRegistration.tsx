'use client'

import { useEffect, useState } from 'react'

interface ServiceWorkerRegistrationProps {
  onUpdateAvailable?: () => void
}

export default function ServiceWorkerRegistration({ 
  onUpdateAvailable 
}: ServiceWorkerRegistrationProps) {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || 'serviceWorker' in navigator === false) {
      return
    }

    // Register service worker
    const registerSW = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        })

        console.log('[SW Registration] Service Worker registered:', reg.scope)
        setRegistration(reg)

        // Listen for service worker messages
        if (reg.installing) {
          reg.installing.addEventListener('statechange', () => {
            if (reg.installing?.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[SW Registration] New service worker installed')
              onUpdateAvailable?.()
            }
          })
        }

        // Check for updates periodically (every hour)
        setInterval(() => {
          reg.update().catch(err => {
            console.warn('[SW Registration] Update check failed:', err)
          })
        }, 60 * 60 * 1000)

        // Check for updates on page visibility change
        document.addEventListener('visibilitychange', () => {
          if (!document.hidden) {
            reg.update().catch(err => {
              console.warn('[SW Registration] Update check failed:', err)
            })
          }
        })

        // Listen for update found
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (newWorker) {
            console.log('[SW Registration] New service worker found')
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New service worker available, waiting to activate
                  console.log('[SW Registration] New service worker installed, waiting to activate')
                  onUpdateAvailable?.()
                } else {
                  // First time installation
                  console.log('[SW Registration] Service worker installed for the first time')
                }
              }
            })
          }
        })

        // Listen for controller change (service worker activated)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('[SW Registration] Service worker controller changed - reloading page')
          window.location.reload()
        })

        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data?.type === 'SW_ACTIVATED') {
            console.log('[SW Registration] Service worker activated:', event.data.version)
          }
        })
      } catch (error) {
        console.error('[SW Registration] Service Worker registration failed:', error)
      }
    }

    // Wait for page load
    if (document.readyState === 'complete') {
      registerSW()
    } else {
      window.addEventListener('load', registerSW)
    }

    // Cleanup
    return () => {
      window.removeEventListener('load', registerSW)
    }
  }, [onUpdateAvailable])

  // Expose registration for update component
  useEffect(() => {
    if (registration && typeof window !== 'undefined') {
      ;(window as any).__swRegistration = registration
    }
  }, [registration])

  return null
}

