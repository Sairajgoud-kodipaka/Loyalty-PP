'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Sparkles, Loader2 } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function ActivatePointsButton() {
  const [loading, setLoading] = useState(false)

  const handleActivate = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/activate-points', {
        method: 'POST',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to activate points')
      }

      toast.success(result.message || `Activated ${result.activatedCount || 0} pending points`, {
        duration: 3000,
      })

      // Refresh the page after a short delay to show updated balances
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error: any) {
      toast.error(error.message || 'Failed to activate points', {
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleActivate}
      variant="outline"
      size="sm"
      disabled={loading}
      className="text-xs"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          Activating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-3 w-3" />
          Activate Pending Points
        </>
      )}
    </Button>
  )
}

