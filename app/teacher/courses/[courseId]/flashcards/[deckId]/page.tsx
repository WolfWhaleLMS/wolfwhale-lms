'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { getCards, addCard, updateCard, deleteCard } from '@/app/actions/flashcards'
import { ArrowLeft, Plus, Trash2, Edit3, Save, X } from 'lucide-react'

interface Card {
  id: string
  front_text: string
  back_text: string
  hint: string | null
  order_index: number
}

export default function DeckCardsPage({
  params,
}: {
  params: Promise<{ courseId: string; deckId: string }>
}) {
  const { courseId, deckId } = use(params)
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [hint, setHint] = useState('')
  const [saving, setSaving] = useState(false)

  const loadCards = async () => {
    try {
      const data = await getCards(deckId)
      setCards(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadCards() }, [deckId])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!front.trim() || !back.trim()) return
    setSaving(true)
    try {
      await addCard(deckId, front, back, hint || undefined)
      setFront('')
      setBack('')
      setHint('')
      setShowAdd(false)
      await loadCards()
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (card: Card) => {
    setEditingId(card.id)
    setFront(card.front_text)
    setBack(card.back_text)
    setHint(card.hint || '')
  }

  const handleSaveEdit = async () => {
    if (!editingId || !front.trim() || !back.trim()) return
    setSaving(true)
    try {
      await updateCard(editingId, { frontText: front, backText: back, hint: hint || undefined })
      setEditingId(null)
      setFront('')
      setBack('')
      setHint('')
      await loadCards()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (cardId: string) => {
    if (!confirm('Delete this card?')) return
    await deleteCard(cardId, deckId)
    await loadCards()
  }

  return (
    <div className="space-y-6">
      <Link
        href={`/teacher/courses/${courseId}/flashcards`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Decks
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Cards</h1>
          <p className="mt-1 text-muted-foreground">{cards.length} cards in this deck</p>
        </div>
        <button
          onClick={() => { setShowAdd(!showAdd); setEditingId(null); setFront(''); setBack(''); setHint('') }}
          className="inline-flex items-center gap-2 rounded-xl bg-[#00BFFF] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#00BFFF]/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Card
        </button>
      </div>

      {/* Add card form */}
      {showAdd && (
        <form onSubmit={handleAdd} className="ocean-card rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold">New Card</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Front (Question)</label>
              <textarea
                value={front}
                onChange={(e) => setFront(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                rows={3}
                required
                placeholder="What is photosynthesis?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Back (Answer)</label>
              <textarea
                value={back}
                onChange={(e) => setBack(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                rows={3}
                required
                placeholder="The process by which plants convert sunlight..."
              />
            </div>
          </div>
          <input
            type="text"
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            placeholder="Hint (optional)"
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#00BFFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#00BFFF]/90 disabled:opacity-50"
            >
              {saving ? 'Adding...' : 'Add Card'}
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="rounded-xl border border-border px-4 py-2 text-sm hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Card list */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          ))}
        </div>
      ) : cards.length === 0 ? (
        <div className="ocean-card rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4 opacity-40">📇</div>
          <p className="text-muted-foreground">No cards yet. Add your first card above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cards.map((card, idx) => (
            <div key={card.id} className="ocean-card rounded-2xl p-5">
              {editingId === card.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <textarea
                      value={front}
                      onChange={(e) => setFront(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                      rows={2}
                    />
                    <textarea
                      value={back}
                      onChange={(e) => setBack(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                      rows={2}
                    />
                  </div>
                  <input
                    value={hint}
                    onChange={(e) => setHint(e.target.value)}
                    placeholder="Hint"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      disabled={saving}
                      className="inline-flex items-center gap-1 rounded-lg bg-[#00BFFF] px-3 py-1.5 text-sm text-white hover:bg-[#00BFFF]/90"
                    >
                      <Save className="h-3 w-3" /> Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted"
                    >
                      <X className="h-3 w-3" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground">#{idx + 1}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Front</p>
                        <p className="text-sm text-foreground">{card.front_text}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Back</p>
                        <p className="text-sm text-foreground">{card.back_text}</p>
                      </div>
                    </div>
                    {card.hint && (
                      <p className="mt-2 text-xs text-[#D97706] italic">Hint: {card.hint}</p>
                    )}
                  </div>
                  <div className="flex gap-1 ml-4">
                    <button
                      onClick={() => handleEdit(card)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
