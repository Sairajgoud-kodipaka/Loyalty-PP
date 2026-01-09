'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, UserPlus, Loader2, User } from 'lucide-react'
import { toast } from 'sonner'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { cn } from '@/lib/utils/cn'

interface SearchResult {
  id: string
  mgp_id: string
  name: string
  phone: string
  available_points: number
}

export default function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Keyboard shortcut Ctrl+K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    // Debounce search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (query.length < 2) {
      setResults([])
      setShowResults(false)
      setSelectedIndex(-1)
      return
    }

    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/customers/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        
        if (data.success) {
          setResults(data.data)
          setShowResults(data.data.length > 0)
          setSelectedIndex(-1)
        } else {
          toast.error(data.error || 'Search failed')
          setResults([])
          setShowResults(false)
        }
      } catch (error) {
        toast.error('Failed to search customers')
        setResults([])
        setShowResults(false)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query])

  useEffect(() => {
    // Close results when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectCustomer = useCallback((customerId: string) => {
    setQuery('')
    setShowResults(false)
    setSelectedIndex(-1)
    router.push(`/customers/${customerId}`)
  }, [router])

  useEffect(() => {
    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showResults || results.length === 0) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault()
        handleSelectCustomer(results[selectedIndex].id)
      } else if (e.key === 'Escape') {
        setShowResults(false)
        setSelectedIndex(-1)
      }
    }

    if (showResults) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showResults, results, selectedIndex, handleSelectCustomer])

  return (
    <div ref={searchRef} className="relative w-full max-w-3xl mx-auto">
      <div className="relative">
        <Search 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" 
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.length >= 2 && results.length > 0) {
              setShowResults(true)
            }
          }}
          placeholder="Search by phone, MGP ID, or name..."
          className="w-full pl-12 pr-28 sm:pr-32 py-3 sm:py-4 text-base border border-input rounded-lg bg-background focus-ring min-h-11"
          aria-label="Search customers"
          role="combobox"
          aria-expanded={showResults}
          aria-controls="search-results"
          aria-autocomplete="list"
        />
        {/* Loading indicator - only show when loading and no button overlap */}
        {query.length >= 2 && loading && (
          <div className="absolute right-14 sm:right-20 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" aria-hidden="true" />
          </div>
        )}
        {/* Keyboard shortcut - desktop only, positioned before button */}
        {query.length >= 2 && !loading && (
          <div className="absolute right-14 sm:right-20 top-1/2 transform -translate-y-1/2 hidden sm:flex">
            <kbd className="h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-xs font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        )}
        {/* Register button - mobile: icon only, desktop: full button */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <Button
            onClick={() => router.push('/customers/register')}
            size="sm"
            variant={query.length >= 2 ? "ghost" : "default"}
            className="h-9 sm:h-9 min-w-9 sm:min-w-auto px-2 sm:px-3"
            aria-label="Register new customer"
          >
            <UserPlus className="w-4 h-4 sm:mr-2" aria-hidden="true" />
            <span className="hidden sm:inline">Register</span>
          </Button>
        </div>
      </div>

      {showResults && (
        <Card
          id="search-results"
          className="absolute z-50 w-full mt-2 shadow-lg max-h-96 overflow-hidden border"
          role="listbox"
        >
          {loading ? (
            <div className="p-8">
              <LoadingSpinner text="Searching customers..." />
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-3" aria-hidden="true" />
              <p className="text-sm text-muted-foreground mb-2">
                No customers found
              </p>
              <Button
                onClick={() => router.push('/customers/register')}
                variant="outline"
                size="sm"
              >
                Register New Customer
              </Button>
            </div>
          ) : (
            <div className="py-2 max-h-96 overflow-y-auto">
              {results.map((customer, index) => (
                <button
                  key={customer.id}
                  onClick={() => handleSelectCustomer(customer.id)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    'w-full px-4 py-3 text-left transition-colors focus-ring',
                    'hover:bg-accent',
                    selectedIndex === index && 'bg-accent',
                    index === 0 && 'rounded-t-none',
                    index === results.length - 1 && 'rounded-b-none'
                  )}
                  role="option"
                  aria-selected={selectedIndex === index}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground truncate">
                          {customer.name}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {customer.mgp_id}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {customer.phone}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-semibold text-primary text-lg">
                        {customer.available_points}
                      </div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
