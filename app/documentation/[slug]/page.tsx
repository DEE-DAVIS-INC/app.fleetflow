'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCurrentUser, checkPermission } from '../../config/access'

interface DocumentViewerProps {
  params: {
    slug: string
  }
}

export default function DocumentViewer({ params }: DocumentViewerProps) {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  
  // Check access permissions
  const { role } = getCurrentUser()
  const hasManagementAccess = checkPermission('hasManagementAccess')

  useEffect(() => {
    // Redirect if no management access
    if (typeof window !== 'undefined' && !hasManagementAccess) {
      window.location.href = '/?error=access_denied'
      return
    }

    loadDocument()
  }, [params.slug, hasManagementAccess])

  const loadDocument = async () => {
    try {
      setLoading(true)
      
      // Map document slugs to actual files
      const documentMap: Record<string, string> = {
        'user-guide': 'USER_GUIDE.md',
        'executive-summary': 'EXECUTIVE_SUMMARY.md',
        'quick-reference': 'QUICK_REFERENCE_CARDS.md',
        'ai-guide': 'AI_IMPLEMENTATION_GUIDE.md',
        'business-plan': 'BUSINESS_PLAN.md',
        'training-checklists': 'TRAINING_CHECKLISTS.md'
      }

      const filename = documentMap[params.slug]
      if (!filename) {
        setError('Document not found')
        return
      }

      // In a real app, you'd fetch from an API
      // For now, we'll show a preview message
      setContent(`# 📄 ${filename}

This is a preview of the ${filename} document.

In a production environment, this would load the actual markdown content from your documentation files.

## Available Content:
- Complete documentation formatted for easy reading
- Professional styling matching FleetFlow theme
- Print-friendly format
- Export capabilities

## Actions Available:
- 📄 Export as PDF
- 📧 Email document
- 🖨️ Print version
- 📱 Mobile view

---

*This viewer supports full markdown rendering with syntax highlighting, tables, and embedded media.*`)

    } catch (err) {
      setError('Failed to load document')
    } finally {
      setLoading(false)
    }
  }

  const getDocumentTitle = (slug: string) => {
    const titles: Record<string, string> = {
      'user-guide': '📖 User Guide',
      'executive-summary': '📊 Executive Summary',
      'quick-reference': '📋 Quick Reference Cards',
      'ai-guide': '🤖 AI Implementation Guide',
      'business-plan': '💼 Business Plan',
      'training-checklists': '✅ Training Checklists'
    }
    return titles[slug] || 'Document'
  }

  if (!hasManagementAccess) {
    return null // Will redirect in useEffect
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        padding: '20px',
        color: 'white'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Back Navigation */}
          <div style={{ marginBottom: '20px' }}>
            <Link href="/documentation" style={{
              color: 'rgba(255, 255, 255, 0.9)',
              textDecoration: 'none',
              fontSize: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}>
              ← Back to Documentation
            </Link>
          </div>

          {/* Main Container */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '30px',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
            border: '1px solid rgba(255, 255, 255, 0.18)'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px'
            }}>
              <div>
                <h1 style={{
                  fontSize: '2.5rem',
                  margin: '0 0 10px 0',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}>
                  {getDocumentTitle(params.slug)}
                </h1>
                <p style={{
                  fontSize: '1rem',
                  margin: 0,
                  opacity: 0.9
                }}>
                  Management Access Only | Role: {role.toUpperCase()}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{
                  background: 'rgba(244, 67, 54, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}>
                  📄 Export PDF
                </button>
                <button style={{
                  background: 'rgba(33, 150, 243, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}>
                  🖨️ Print
                </button>
              </div>
            </div>

            {/* Document Content */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '30px',
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              minHeight: '500px'
            }}>
              {loading && (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '20px' }}>📄</div>
                  <p>Loading document...</p>
                </div>
              )}

              {error && (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '20px' }}>❌</div>
                  <p style={{ color: '#ff6b6b' }}>{error}</p>
                </div>
              )}

              {!loading && !error && (
                <div style={{
                  lineHeight: '1.8',
                  fontSize: '1.1rem'
                }}>
                  {/* This would render the actual markdown content in production */}
                  <pre style={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'inherit',
                    margin: 0
                  }}>
                    {content}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
