'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, Search } from 'lucide-react'
import { TokenDisplay } from '@/components/plaza/TokenDisplay'
import { StoreItemCard, type StoreItem } from '@/components/plaza/StoreItemCard'
import { StorePurchaseDialog } from '@/components/plaza/StorePurchaseDialog'
import { getMyAvatar } from '@/app/actions/plaza'
import { getStoreItems, purchaseItem } from '@/app/actions/plaza-store'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Category tabs
// ---------------------------------------------------------------------------

const CATEGORIES = [
  { id: 'hat', label: 'Hats' },
  { id: 'outfit', label: 'Outfits' },
  { id: 'accessory', label: 'Accessories' },
  { id: 'color_palette', label: 'Colors' },
  { id: 'trail_effect', label: 'Effects' },
  { id: 'emote', label: 'Emotes' },
  { id: 'background', label: 'Backgrounds' },
]

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function StorePage() {
  const [activeCategory, setActiveCategory] = useState('hat')
  const [items, setItems] = useState<StoreItem[]>([])
  const [ownedItemIds, setOwnedItemIds] = useState<Set<string>>(new Set())
  const [equippedItemIds, setEquippedItemIds] = useState<Set<string>>(new Set())
  const [tokenBalance, setTokenBalance] = useState(0)
  const [avatarLevel, setAvatarLevel] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Load store data
  useEffect(() => {
    async function loadStore() {
      try {
        const avatar = await getMyAvatar()
        if (avatar) {
          setTokenBalance(avatar.token_balance ?? 0)
          setAvatarLevel(avatar.avatar_level ?? 1)
        }

        const storeItems = await getStoreItems()
        if (storeItems) {
          const owned = new Set<string>()
          const equipped = new Set<string>()
          for (const item of storeItems) {
            if ((item as any).is_owned) owned.add(item.id)
            if ((item as any).is_equipped) equipped.add(item.id)
          }
          setItems(storeItems as StoreItem[])
          setOwnedItemIds(owned)
          setEquippedItemIds(equipped)
        }
      } catch {
        // ignore
      }
      setIsLoading(false)
    }

    loadStore()
  }, [])

  // Filter items by category and search
  const filteredItems = items.filter((item) => {
    const matchesCategory = item.category === activeCategory
    const matchesSearch = searchQuery
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    return matchesCategory && matchesSearch
  })

  // Handle purchase via server action
  const handlePurchase = async (itemId: string) => {
    const result = await purchaseItem(itemId)
    if (!result.success) {
      throw new Error(result.error ?? 'Purchase failed')
    }

    // Update local state
    setTokenBalance(result.new_balance ?? tokenBalance)
    setOwnedItemIds((prev) => new Set([...prev, itemId]))
    setSelectedItem(null)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading store...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full p-4 md:p-6 lg:p-8">
      {/* Back link */}
      <Link
        href="/plaza"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Plaza
      </Link>

      {/* Header + Token Balance */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <ShoppingBag className="h-7 w-7 text-amber-500" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Avatar Store
            </h1>
          </div>
          <p className="text-muted-foreground">
            Browse cosmetics to customize your plaza avatar
          </p>
        </div>
        <TokenDisplay balance={tokenBalance} variant="full" />
      </div>

      {/* Category tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              'rounded-xl px-4 py-2 text-sm font-semibold transition-all',
              activeCategory === cat.id
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search items..."
          className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:max-w-xs"
        />
      </div>

      {/* Item grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredItems.map((item) => (
            <StoreItemCard
              key={item.id}
              item={item}
              isOwned={ownedItemIds.has(item.id)}
              isEquipped={equippedItemIds.has(item.id)}
              userLevel={avatarLevel}
              onClick={() => setSelectedItem(item)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-muted/30 py-16 text-center">
          <ShoppingBag className="mb-4 h-14 w-14 text-muted-foreground/40" />
          <p className="text-lg font-bold text-foreground">No items found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchQuery
              ? 'Try a different search term.'
              : 'Items for this category will be available soon!'}
          </p>
        </div>
      )}

      {/* Purchase dialog */}
      {selectedItem && !ownedItemIds.has(selectedItem.id) && (
        <StorePurchaseDialog
          item={selectedItem}
          currentBalance={tokenBalance}
          isOpen={true}
          onClose={() => setSelectedItem(null)}
          onConfirm={handlePurchase}
        />
      )}
    </div>
  )
}
