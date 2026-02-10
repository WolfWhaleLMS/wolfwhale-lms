'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Filter, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { usePet } from '@/hooks/gamification/usePet';
import { useSound } from '@/hooks/gamification/useSound';
import type { PetCosmetic, RarityTier } from '@/types/gamification.types';

interface PetShopProps {
  coins: number;
  unlockedCosmetics: string[];
  equippedItems: string[];
  onPurchase?: (item: PetCosmetic) => void;
  onEquip?: (itemId: string) => void;
}

const MOCK_COSMETICS: PetCosmetic[] = [
  {
    id: 'crown',
    name: 'Golden Crown',
    category: 'hats',
    rarity: 'legendary',
    cost: 500,
    iconUrl: '👑',
    description: 'A majestic crown fit for royalty',
  },
  {
    id: 'wizard_hat',
    name: 'Wizard Hat',
    category: 'hats',
    rarity: 'epic',
    cost: 300,
    iconUrl: '🧙',
    description: 'Magical and mysterious',
  },
  {
    id: 'bow',
    name: 'Pink Bow',
    category: 'hats',
    rarity: 'common',
    cost: 50,
    iconUrl: '🎀',
    description: 'A cute little bow',
  },
  {
    id: 'scarf',
    name: 'Silk Scarf',
    category: 'body',
    rarity: 'uncommon',
    cost: 100,
    iconUrl: '🧣',
    description: 'Elegant and flowing',
  },
  {
    id: 'jacket',
    name: 'Leather Jacket',
    category: 'body',
    rarity: 'rare',
    cost: 250,
    iconUrl: '🧥',
    description: 'Cool and edgy',
  },
  {
    id: 'wings',
    name: 'Rainbow Wings',
    category: 'back',
    rarity: 'epic',
    cost: 400,
    iconUrl: '🌈',
    description: 'Spread your wings and fly',
  },
  {
    id: 'sparkle_aura',
    name: 'Sparkle Aura',
    category: 'auras',
    rarity: 'legendary',
    cost: 600,
    iconUrl: '✨',
    description: 'Shimmering magical aura',
  },
  {
    id: 'fire_aura',
    name: 'Fire Aura',
    category: 'auras',
    rarity: 'epic',
    cost: 350,
    iconUrl: '🔥',
    description: 'Burning with power',
  },
];

const RARITY_COLORS: Record<RarityTier, string> = {
  common: 'border-gray-400 bg-gray-500/10',
  uncommon: 'border-green-400 bg-green-500/10',
  rare: 'border-blue-400 bg-blue-500/10',
  epic: 'border-purple-400 bg-purple-500/10',
  legendary: 'border-yellow-400 bg-yellow-500/10',
};

const RARITY_TEXT: Record<RarityTier, string> = {
  common: 'text-gray-300',
  uncommon: 'text-green-300',
  rare: 'text-blue-300',
  epic: 'text-purple-300',
  legendary: 'text-yellow-300',
};

type CategoryFilter = 'all' | 'hats' | 'body' | 'back' | 'paws_fins' | 'auras';
type StatusFilter = 'all' | 'owned' | 'affordable';

export const PetShop: React.FC<PetShopProps> = ({
  coins,
  unlockedCosmetics,
  equippedItems,
  onPurchase,
  onEquip,
}) => {
  const { equipItem } = usePet();
  const { play } = useSound();
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<
    { id: number; message: string; type: 'success' | 'error' }[]
  >([]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const filteredCosmetics = MOCK_COSMETICS.filter((item) => {
    // Category filter
    if (categoryFilter !== 'all' && item.category !== categoryFilter) {
      return false;
    }

    // Status filter
    if (statusFilter === 'owned' && !unlockedCosmetics.includes(item.id)) {
      return false;
    }
    if (statusFilter === 'affordable' && coins < item.cost) {
      return false;
    }

    return true;
  });

  const handlePurchase = async (item: PetCosmetic) => {
    if (coins < item.cost) {
      showNotification('Not enough coins!', 'error');
      play('error');
      return;
    }

    if (unlockedCosmetics.includes(item.id)) {
      showNotification('Already owned!', 'error');
      return;
    }

    setPurchasing(item.id);

    try {
      // Simulate purchase API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      play('coinEarn');
      showNotification(`Purchased ${item.name}!`, 'success');
      onPurchase?.(item);
    } catch (error) {
      showNotification('Purchase failed', 'error');
      play('error');
    } finally {
      setPurchasing(null);
    }
  };

  const handleEquip = async (itemId: string) => {
    try {
      const result = await equipItem(itemId);
      if (result) {
        showNotification('Item equipped!', 'success');
        onEquip?.(itemId);
      }
    } catch (error) {
      showNotification('Failed to equip item', 'error');
    }
  };

  const owned = unlockedCosmetics.length;
  const total = MOCK_COSMETICS.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6" />
            Pet Shop
          </h2>
          <p className="text-sm text-white/60 mt-1">
            {owned} / {total} items owned
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/60">Coins</p>
          <p className="text-3xl font-bold text-yellow-400">🪙 {coins}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Category Tabs */}
        <div>
          <p className="text-xs font-semibold text-white/60 uppercase mb-2">Category</p>
          <div className="flex flex-wrap gap-2">
            {['all', 'hats', 'body', 'back', 'auras'].map((cat) => (
              <Button
                key={cat}
                variant={categoryFilter === cat ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setCategoryFilter(cat as CategoryFilter)}
                className="capitalize"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <p className="text-xs font-semibold text-white/60 uppercase mb-2">Status</p>
          <div className="flex gap-2">
            {['all', 'owned', 'affordable'].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setStatusFilter(status as StatusFilter)}
                className="capitalize"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <AnimatePresence mode="popLayout">
          {filteredCosmetics.map((item) => {
            const isOwned = unlockedCosmetics.includes(item.id);
            const isEquipped = equippedItems.includes(item.id);
            const canAfford = coins >= item.cost;

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`rounded-lg border-2 p-3 transition-all cursor-pointer hover:scale-105 ${
                  RARITY_COLORS[item.rarity]
                }`}
              >
                {/* Item Icon */}
                <div className="text-4xl text-center mb-2">{item.iconUrl}</div>

                {/* Item Info */}
                <h3 className="font-semibold text-white text-sm text-center line-clamp-2">
                  {item.name}
                </h3>

                {/* Rarity Badge */}
                <div className="mt-2 text-center">
                  <span className={`text-xs font-bold uppercase ${RARITY_TEXT[item.rarity]}`}>
                    {item.rarity}
                  </span>
                </div>

                {/* Cost or Status */}
                {!isOwned ? (
                  <div className="mt-2">
                    <p className="text-xs text-white/60 text-center mb-2">🪙 {item.cost}</p>
                    <Button
                      onClick={() => handlePurchase(item)}
                      disabled={!canAfford || purchasing === item.id}
                      size="sm"
                      className="w-full text-xs"
                      variant={canAfford ? 'default' : 'secondary'}
                    >
                      {purchasing === item.id ? 'Buying...' : 'Buy'}
                    </Button>
                  </div>
                ) : (
                  <div className="mt-2 space-y-2">
                    {isEquipped ? (
                      <div className="bg-green-500/20 border border-green-500/50 rounded px-2 py-1 text-center">
                        <p className="text-xs font-semibold text-green-300 flex items-center justify-center gap-1">
                          <Check className="w-3 h-3" />
                          Equipped
                        </p>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleEquip(item.id)}
                        size="sm"
                        className="w-full text-xs"
                        variant="secondary"
                      >
                        Equip
                      </Button>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredCosmetics.length === 0 && (
        <div className="text-center py-8">
          <p className="text-white/60">No items match your filters</p>
        </div>
      )}

      {/* Notifications */}
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed bottom-4 left-4 right-4 md:right-auto md:left-1/2 md:-translate-x-1/2 p-3 rounded-lg text-sm font-medium text-center ${
              notif.type === 'success'
                ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                : 'bg-red-500/20 border border-red-500/50 text-red-300'
            }`}
          >
            {notif.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
