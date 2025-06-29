'use client'

import AIAutomationDashboard from '../components/AIAutomationDashboard'

export default function AIPage() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #2196F3 0%, #1565C0 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <div className="container mx-auto px-4 py-6">
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '20px',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          marginBottom: '20px'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            margin: '0 0 10px 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>🤖 AI Dashboard</h1>
          <p style={{
            fontSize: '1.1rem',
            margin: 0,
            opacity: 0.9
          }}>Smart insights and automation for your fleet</p>
        </div>
        <AIAutomationDashboard />
      </div>
    </div>
  )
}
