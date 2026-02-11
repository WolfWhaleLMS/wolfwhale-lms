'use client'

import { useState } from 'react'
import { X, Coins, AlertTriangle, ShoppingCart } from 'lucide-react'
import type { StoreItem } from './StoreItemCard'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface StorePurchaseDialogProps {
  item: StoreItem
  currentBalance: number
  isOpen: boolean
  onClose: () => void
  onConfirm: (itemId: string) => Promise<void>
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function StorePurchaseDialog({
  item,
  currentBalance,
  isOpen,
  onClose,
  onConfirm,
}: StorePurchaseDialogProps) {
  const [isPurchasing, setIsPurchasing] = useState(false)
  const balanceAfter = currentBalance - item.price_tokens
  const canAfford = balanceAfter >= 0

  const handlePurchase = async () => {
    if (!canAfford || isPurchasing) return
    setIsPurchasing(true)
    try {
      await onConfirm(item.id)
      onClose()
    } catch {
      // Error handling done by parent
    } finally {
      setIsPurchasing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground">Confirm Purchase</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Are you sure you want to buy this item?
          </p>
        </div>

        {/* Item preview */}
        <div className="mb-6 rounded-xl bg-muted/50 p-4">
          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${item.color_hex ?? '#6366f1'}20` }}
            >
              <div
                className="h-10 w-10 rounded-lg"
                style={{ backgroundColor: item.color_hex ?? '#6366f1', opacity: 0.6 }}
              />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{item.name}</h3>
              {item.description && (
                <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Price breakdown */}
        <div className="mb-6 space-y-3 rounded-xl border border-border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Item Price</span>
            <span className="inline-flex items-center gap-1 font-semibold text-foreground">
              <Coins className="h-4 w-4 text-amber-500" />
              {item.price_tokens}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Balance</span>
            <span className="font-semibold text-foreground">
              {currentBalance.toLocaleString()}
            </span>
          </div>
          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Balance After Purchase
              </span>
              <span
                className={cn(
                  'font-bold',
                  canAfford
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-500'
                )}
              >
                {balanceAfter.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Insufficient funds warning */}
        {!canAfford && (
          <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-500/10 p-4 text-red-600 dark:text-red-400">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Insufficient Tokens</p>
              <p className="mt-0.5 text-xs">
                You need {Math.abs(balanceAfter)} more tokens to purchase this item.
                Earn tokens by playing mini games, completing assignments, and daily logins!
              </p>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={handlePurchase}
            disabled={!canAfford || isPurchasing}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all',
              canAfford
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            )}
          >
            <ShoppingCart className="h-4 w-4" />
            {isPurchasing ? 'Purchasing...' : `Buy for ${item.price_tokens} tokens`}
          </button>
        </div>
      </div>
    </div>
  )
}
