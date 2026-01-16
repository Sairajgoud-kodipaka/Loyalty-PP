import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MGP Loyalty Program System',
    short_name: 'MGP Loyalty',
    description: 'Customer rewards management platform for Mangatrai Pearls & Jewellers',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    orientation: 'portrait-primary',
    scope: '/',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['business', 'productivity'],
    shortcuts: [
      {
        name: 'Dashboard',
        short_name: 'Dashboard',
        description: 'View dashboard',
        url: '/dashboard',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Customers',
        short_name: 'Customers',
        description: 'View customers',
        url: '/customers',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Transactions',
        short_name: 'Transactions',
        description: 'View transactions',
        url: '/transactions/history',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
    ],
  }
}

