'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, Search } from 'lucide-react'
import { TokenDisplay } from '@/components/plaza/TokenDisplay'
import { StoreItemCard, type StoreItem } from '@/components/plaza/StoreItemCard'
import { StorePurchaseDialog } from '@/components/plaza/StorePurchaseDialog'
import { createClient } from '@/lib/supabase/client'
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
  const router = useRouter()
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
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      // Fetch avatar data for token balance and level
      const { data: avatar } = await supabase
        .from('plaza_avatars')
        .select('token_balance, avatar_level')
        .eq('user_id', user.id)
        .single()

      if (avatar) {
        setTokenBalance(avatar.token_balance ?? 0)
        setAvatarLevel(avatar.avatar_level ?? 1)
      }

      // Fetch store items
      const { data: storeItems } = await supabase
        .from('plaza_avatar_items')
        .select('id, name, description, category, slot, rarity, sprite_key, preview_url, color_hex, price_tokens, is_free, min_avatar_level')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (storeItems) {
        setItems(storeItems as StoreItem[])
      }

      // Fetch user inventory
      const { data: inventory } = await supabase
        .from('plaza_avatar_inventory')
        .select('item_id, is_equipped')
        .eq('user_id', user.id)

      if (inventory) {
        setOwnedItemIds(new Set(inventory.map((i) => i.item_id)))
        setEquippedItemIds(
          new Set(inventory.filter((i) => i.is_equipped).map((i) => i.item_id))
        )
      }

      setIsLoading(false)
    }

    loadStore()
  }, [router])

  // Filter items by category and search
  const filteredItems = items.filter((item) => {
    const matchesCategory = item.category === activeCategory
    const matchesSearch = searchQuery
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    return matchesCategory && matchesSearch
  })

  // Handle purchase
  const handlePurchase = async (itemId: string) => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const item = items.find((i) => i.id === itemId)
    if (!item) return

    // Insert into inventory
    const { error: invError } = await supabase
      .from('plaza_avatar_inventory')
      .insert({
        user_id: user.id,
        item_id: itemId,
        price_paid: item.price_tokens,
      })

    if (invError) throw invError

    // Deduct tokens from avatar balance
    const { error: balError } = await supabase
      .from('plaza_avatars')
      .update({
        token_balance: tokenBalance - item.price_tokens,
        tokens_spent_total: tokenBalance, // This is approximate; server action should handle atomically
      })
      .eq('user_id', user.id)

    if (balError) throw balError

    // Update local state
    setTokenBalance((prev) => prev - item.price_tokens)
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
