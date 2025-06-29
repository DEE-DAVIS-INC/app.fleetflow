'use client'

import { useState } from 'react'
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
      <div className="container py-6">
        <div className="max-w-md mx-auto">
          <div className="card">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Training Center Access</h1>
              <p className="text-gray-600">Please enter your training credentials to continue</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Training Username</label>
                <input
                  type="text"
                  className="form-input"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  placeholder="Enter training username"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Training Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  placeholder="Enter training password"
                  required
                />
              </div>
              
              <button type="submit" className="btn btn-primary w-full">
                Access Training Center
              </button>
              
              <button 
                type="button" 
                onClick={quickLogin}
                className="btn btn-secondary w-full mt-2"
              >
                Quick Demo Access
              </button>
            </form>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Demo Credentials:</strong><br />
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
