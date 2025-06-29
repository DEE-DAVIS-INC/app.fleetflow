'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './AuthProvider'

interface StickyNote {
  id: string
  content: string
  section: string
  entityId: string // carrier ID, driver ID, etc.
  createdBy: string
  createdAt: string
  isShared: boolean
  priority: 'low' | 'medium' | 'high'
}

interface StickyNoteProps {
  section: string
  entityId: string
  entityName?: string
}

export default function StickyNote({ section, entityId, entityName }: StickyNoteProps) {
  const { user } = useAuth()
  const [notes, setNotes] = useState<StickyNote[]>([])
  const [newNote, setNewNote] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [isShared, setIsShared] = useState(true)

  // Load notes from localStorage (in production, this would be from your backend)
  useEffect(() => {
    const savedNotes = localStorage.getItem(`fleetflow-notes-${section}-${entityId}`)
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [section, entityId])

  const saveNotes = (updatedNotes: StickyNote[]) => {
    setNotes(updatedNotes)
    localStorage.setItem(`fleetflow-notes-${section}-${entityId}`, JSON.stringify(updatedNotes))
  }

  const addNote = () => {
    if (!newNote.trim() || !user) return

    const note: StickyNote = {
      id: Date.now().toString(),
      content: newNote.trim(),
      section,
      entityId,
      createdBy: user.name,
      createdAt: new Date().toISOString(),
      isShared,
      priority
    }

    const updatedNotes = [note, ...notes]
    saveNotes(updatedNotes)
    setNewNote('')
  }

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId)
    saveNotes(updatedNotes)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800'
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800'
      case 'low': return 'bg-green-100 border-green-300 text-green-800'
      default: return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="sticky-note-container">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <span className="text-yellow-500">📝</span>
          Notes {entityName && `- ${entityName}`}
          {notes.length > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {notes.length}
            </span>
          )}
          <svg 
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isExpanded && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-3">
          {/* Add New Note */}
          <div className="space-y-2">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note about this item..."
              className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
              rows={2}
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="text-xs border border-gray-300 rounded px-2 py-1"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                
                <label className="flex items-center gap-1 text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={isShared}
                    onChange={(e) => setIsShared(e.target.checked)}
                    className="text-xs"
                  />
                  Share with team
                </label>
              </div>
              
              <button
                onClick={addNote}
                disabled={!newNote.trim()}
                className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 disabled:bg-gray-300"
              >
                Add Note
              </button>
            </div>
          </div>

          {/* Display Notes */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {notes.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No notes yet. Add one above!</p>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className={`p-3 rounded border-l-4 ${getPriorityColor(note.priority)}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 mb-1">{note.content}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span>{note.createdBy}</span>
                        <span>•</span>
                        <span>{formatDate(note.createdAt)}</span>
                        <span>•</span>
                        <span className="capitalize">{note.priority}</span>
                        {note.isShared && (
                          <>
                            <span>•</span>
                            <span className="text-blue-600">👥 Shared</span>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                      title="Delete note"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
