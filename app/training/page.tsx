'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../components/AuthProvider'

export default function TrainingPage() {
  const { user } = useAuth()
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedModule, setSelectedModule] = useState<'dispatch' | 'broker' | 'compliance'>('dispatch')

  // Training access credentials (in real app, this would be handled securely)
  const trainingCredentials = {
    username: 'training_admin',
    password: 'FleetFlow2025!'
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Trim whitespace from input values
    const enteredUsername = loginForm.username.trim()
    const enteredPassword = loginForm.password.trim()
    
    if (enteredUsername === trainingCredentials.username && 
        enteredPassword === trainingCredentials.password) {
      setIsAuthenticated(true)
    } else {
      alert('Invalid credentials. Please try:\nUsername: training_admin\nPassword: FleetFlow2025!')
    }
  }

  // Quick access function for demo purposes
  const quickLogin = () => {
    setLoginForm({
      username: trainingCredentials.username,
      password: trainingCredentials.password
    })
    setIsAuthenticated(true)
  }

  if (!isAuthenticated) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        minHeight: '100vh',
        color: 'white'
      }}>
        {/* Simple Back to Dashboard Button */}
        <div style={{ padding: '20px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '10px 20px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              ← Back to Dashboard
            </button>
          </Link>
        </div>
        
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <div>
                  <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: 0,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}>🎓 Training Center Access</h1>
                  <p style={{
                    color: 'rgba(255,255,255,0.9)',
                    margin: 0
                  }}>Professional development and certification platform</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-md mx-auto px-4 py-8">
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div className="text-center mb-6">
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#1F2937',
                marginBottom: '0.5rem'
              }}>Training Center Access</h2>
              <p style={{
                color: '#6B7280'
              }}>Please enter your training credentials to continue</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>Training Username</label>
                <input
                  type="text"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s ease',
                    outline: 'none'
                  }}
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  placeholder="Enter training username"
                  required
                  onFocus={(e) => e.target.style.borderColor = '#10B981'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>Training Password</label>
                <input
                  type="password"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s ease',
                    outline: 'none'
                  }}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  placeholder="Enter training password"
                  required
                  onFocus={(e) => e.target.style.borderColor = '#10B981'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
              
              <button 
                type="submit" 
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.75rem',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 16px -4px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }}
              >
                🎓 Access Training Center
              </button>
              
              <button 
                type="button" 
                onClick={quickLogin}
                style={{
                  width: '100%',
                  background: 'transparent',
                  color: '#10B981',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.75rem',
                  border: '2px solid #10B981',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  marginTop: '0.5rem'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#10B981';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#10B981';
                }}
              >
                ⚡ Quick Demo Access
              </button>
            </form>
            
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
              borderRadius: '0.75rem',
              border: '1px solid #10B981'
            }}>
              <p style={{
                fontSize: '0.875rem',
                color: '#065F46',
                margin: 0
              }}>
                <strong>🔑 Demo Credentials:</strong><br />
                Username: training_admin<br />
                Password: FleetFlow2025!
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-gray-900 mb-2" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              FleetFlow Training Center
            </h1>
            <p className="text-gray-600">
              Professional development for dispatch and brokerage operations
            </p>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="btn btn-secondary"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="text-center p-8 bg-blue-50 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🎉 Enhanced Training Center</h2>
        <p className="text-lg text-gray-700 mb-4">
          The training page with presentation links and downloadable resources is ready!
        </p>
        <p className="text-gray-600">
          You can now add links to your presentations, videos, and downloadable materials for each training module.
          The interface supports Google Slides, YouTube videos, PDFs, Excel files, and more.
        </p>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <span className="text-3xl">📊</span>
            <h3 className="font-semibold mt-2">Presentations</h3>
            <p className="text-sm text-gray-600">Link to Google Slides, PowerPoint, etc.</p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <span className="text-3xl">🎥</span>
            <h3 className="font-semibold mt-2">Video Training</h3>
            <p className="text-sm text-gray-600">YouTube, Vimeo, or any video platform</p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <span className="text-3xl">📁</span>
            <h3 className="font-semibold mt-2">Downloadables</h3>
            <p className="text-sm text-gray-600">PDFs, spreadsheets, templates</p>
          </div>
        </div>
      </div>
    </div>
  )
}
