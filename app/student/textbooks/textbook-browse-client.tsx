'use client'

import { useState, useMemo } from 'react'
import { Search, BookOpen } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { TextbookCard } from '@/components/textbook/TextbookCard'
import type { Textbook } from '@/lib/types/textbook'

const subjectLabels: Record<string, string> = {
  math: 'Math',
  science: 'Science',
  physics: 'Physics',
  chemistry: 'Chemistry',
  biology: 'Biology',
  ela: 'ELA',
}

interface TextbookBrowseClientProps {
  textbooks: Textbook[]
  subjects: string[]
  assignedTextbookIds: string[]
  progressByTextbook: Record<
    string,
    { chaptersCompleted: number; progressPercentage: number }
  >
}

export function TextbookBrowseClient({
  textbooks,
  subjects,
  assignedTextbookIds,
  progressByTextbook,
}: TextbookBrowseClientProps) {
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTextbooks = useMemo(() => {
    let result = textbooks

    // Filter by subject
    if (selectedSubject !== 'all') {
      result = result.filter((t) => t.subject === selectedSubject)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q)
      )
    }

    return result
  }, [textbooks, selectedSubject, searchQuery])

  return (
    <div className="space-y-6">
      {/* Search + Filter bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Subject tabs */}
        <Tabs value={selectedSubject} onValueChange={setSelectedSubject}>
          <TabsList className="flex-wrap">
            <TabsTrigger value="all">All</TabsTrigger>
            {subjects.map((subject) => (
              <TabsTrigger key={subject} value={subject}>
                {subjectLabels[subject] || subject}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search textbooks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Grid */}
      {filteredTextbooks.length === 0 ? (
        <div className="ocean-card relative overflow-hidden rounded-2xl py-20 text-center">
          <div className="relative z-10 flex flex-col items-center justify-center">
            <BookOpen className="mb-4 h-16 w-16 text-primary/40" />
            <h3 className="text-xl font-bold text-foreground">
              {searchQuery || selectedSubject !== 'all'
                ? 'No textbooks found'
                : 'No textbooks available yet'}
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {searchQuery || selectedSubject !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Check back later for new textbooks from your school.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredTextbooks.map((textbook) => {
            const prog = progressByTextbook[textbook.id]
            return (
              <TextbookCard
                key={textbook.id}
                textbook={textbook}
                progressPercentage={prog?.progressPercentage ?? 0}
                chaptersCompleted={prog?.chaptersCompleted ?? 0}
                isAssigned={assignedTextbookIds.includes(textbook.id)}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
