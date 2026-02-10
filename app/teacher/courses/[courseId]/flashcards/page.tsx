'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { getDecks, createDeck, updateDeck, deleteDeck } from '@/app/actions/flashcards'
import { ArrowLeft, Plus, Layers, Trash2, Eye, EyeOff } from 'lucide-react'

interface Deck {
  id: string
  title: string
  description: string | null
  status: string
  card_count: number
  created_at: string
}

export default function TeacherFlashcardsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params)
  const [decks, setDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [creating, setCreating] = useState(false)

  const loadDecks = async () => {
    try {
      const data = await getDecks(courseId)
      setDecks(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadDecks() }, [courseId])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    setCreating(true)
    try {
      await createDeck(courseId, newTitle, newDesc || undefined)
      setNewTitle('')
      setNewDesc('')
      setShowCreate(false)
      await loadDecks()
    } finally {
      setCreating(false)
    }
  }

  const handleTogglePublish = async (deck: Deck) => {
    const newStatus = deck.status === 'published' ? 'draft' : 'published'
    await updateDeck(deck.id, { status: newStatus })
    await loadDecks()
  }

  const handleDelete = async (deckId: string) => {
    if (!confirm('Delete this deck and all its cards?')) return
    await deleteDeck(deckId)
    await loadDecks()
  }

  return (
    <div className="space-y-6">
      <Link
        href={`/teacher/courses/${courseId}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Course
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Flashcard Decks</h1>
          <p className="mt-1 text-muted-foreground">Create and manage flashcard decks for students.</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Deck
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="ocean-card rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold">Create New Deck</h3>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Deck title..."
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
            required
          />
          <textarea
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Description (optional)..."
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={creating}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create Deck'}
            </button>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="rounded-xl border border-border px-4 py-2 text-sm hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          ))}
        </div>
      ) : decks.length === 0 ? (
        <div className="ocean-card rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4 opacity-40">📇</div>
          <p className="text-muted-foreground">No decks yet. Create your first flashcard deck above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {decks.map((deck) => (
            <div key={deck.id} className="ocean-card rounded-2xl p-5 flex items-center justify-between">
              <Link
                href={`/teacher/courses/${courseId}/flashcards/${deck.id}`}
                className="flex-1 min-w-0"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                    <Layers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{deck.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {deck.card_count} cards &middot;{' '}
                      <span className={deck.status === 'published' ? 'text-green-600' : 'text-amber-600'}>
                        {deck.status}
                      </span>
                    </p>
                  </div>
                </div>
              </Link>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleTogglePublish(deck)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors"
                  title={deck.status === 'published' ? 'Unpublish' : 'Publish'}
                >
                  {deck.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => handleDelete(deck.id)}
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
