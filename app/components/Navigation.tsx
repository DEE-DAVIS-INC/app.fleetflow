'use client'

import Link from 'next/link'
import { useState } from 'react'
import { getCurrentUser, checkPermission } from '../config/access'
import NotificationBell from './NotificationBell'

const Navigation = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isFleetDropdownOpen, setIsFleetDropdownOpen] = useState(false)
  const [isManagementDropdownOpen, setIsManagementDropdownOpen] = useState(false)
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false)
  const [isReportsDropdownOpen, setIsReportsDropdownOpen] = useState(false)
  
  const { role } = getCurrentUser()
  const hasManagementAccess = checkPermission('hasManagementAccess')
  // For demo, use role as userId (replace with real userId in production)
  const userId = role

  const navItems = [
    { id: 'dashboard', label: '🏠 Dashboard', href: '/' },
    { id: 'dispatch', label: 'Dispatch Central', href: '/dispatch' },
    { id: 'dispatch-board', label: 'Load Board', href: '/dispatch-board' },
    { id: 'broker', label: 'Broker Box', href: '/broker' },
    { id: 'quoting', label: 'Freight Quoting', href: '/quoting' },
  ]

  const fleetItems = [
    { id: 'vehicles', label: 'Vehicles', href: '/vehicles', icon: '🚛' },
    { id: 'drivers', label: 'Drivers', href: '/drivers', icon: '👥' },
    { id: 'shippers', label: 'Shippers', href: '/shippers', icon: '🏢' },
    { id: 'routes', label: 'Routes', href: '/routes', icon: '🗺️' },
    { id: 'maintenance', label: 'Maintenance', href: '/maintenance', icon: '🔧' },
  ]

  const managementItems = [
    { id: 'financials', label: 'Financials', href: '/financials', icon: '💰' },
    { id: 'ai', label: 'AI Dashboard', href: '/ai', icon: '🤖' },
    { id: 'settings', label: 'Settings', href: '/settings', icon: '⚙️' },
    { id: 'training', label: 'Training', href: '/training', icon: '🎓' },
    { id: 'documentation', label: 'Documentation Hub', href: '/documentation', icon: '📚' },
  ]

  const resourceItems = [
    { id: 'documents', label: 'Document Generation', href: '/documents', icon: '📄' },
    { id: 'resources', label: 'Resource Library', href: '/resources', icon: '📚' },
    { id: 'safety', label: 'Safety Resources', href: '/safety', icon: '🦺' },
    { id: 'compliance', label: 'Compliance Tools', href: '/compliance', icon: '✅' },
  ]

  const reportsItems = [
    { id: 'reports', label: 'Fleet Reports', href: '/reports', icon: '📊' },
    { id: 'analytics', label: 'Analytics Dashboard', href: '/analytics', icon: '📈' },
    { id: 'performance', label: 'Performance Metrics', href: '/performance', icon: '🎯' },
    { id: 'insights', label: 'Business Insights', href: '/insights', icon: '💡' },
  ]

  return (
    <nav className="nav-2d" style={{ position: 'relative', zIndex: 100000 }}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTab('dashboard')}>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-xl">🚛</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:via-blue-600 group-hover:to-indigo-700 transition-all duration-300">
                FleetFlow
              </h1>
            </Link>
          </div>
          
          {/* Notification Bell */}
          <div className="flex gap-3 items-center">
            <NotificationBell userId={userId} />
            {navItems.map((item) => (
              <Link 
                key={item.id}
                href={item.href}
                className={`nav-item-2d ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Fleet Management Dropdown */}
            <div className="relative">
              <button
                className={`nav-item-2d flex items-center gap-2 ${
                  ['vehicles', 'drivers', 'shippers', 'routes', 'maintenance'].includes(activeTab) ? 'active' : ''
                }`}
                onClick={() => {
                  setIsFleetDropdownOpen(!isFleetDropdownOpen)
                  // Close other dropdowns
                  setIsResourcesDropdownOpen(false)
                  setIsReportsDropdownOpen(false)
                  setIsManagementDropdownOpen(false)
                }}
                onBlur={(e) => {
                  // Only close if focus is not moving to a child element
                  setTimeout(() => {
                    if (!e.currentTarget.parentElement?.contains(document.activeElement)) {
                      setIsFleetDropdownOpen(false)
                    }
                  }, 150)
                }}
              >
                Fleet Management
                <svg 
                  className={`w-4 h-4 transition-transform duration-300 ${isFleetDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isFleetDropdownOpen && (
                <div 
                  className="modal-2d absolute top-full left-0 mt-2 min-w-56"
                  style={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    zIndex: 999999,
                    position: 'absolute'
                  }}
                >
                  {fleetItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="flex items-center gap-3 px-6 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 first:rounded-t-xl last:rounded-b-xl transition-all duration-300"
                      onClick={() => {
                        setActiveTab(item.id)
                        setIsFleetDropdownOpen(false)
                      }}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                className={`nav-item-2d flex items-center gap-2 ${
                  ['documents', 'resources', 'safety', 'compliance'].includes(activeTab) ? 'active' : ''
                }`}
                onClick={() => {
                  setIsResourcesDropdownOpen(!isResourcesDropdownOpen)
                  // Close other dropdowns
                  setIsFleetDropdownOpen(false)
                  setIsReportsDropdownOpen(false)
                  setIsManagementDropdownOpen(false)
                }}
                onBlur={(e) => {
                  setTimeout(() => {
                    if (!e.currentTarget.parentElement?.contains(document.activeElement)) {
                      setIsResourcesDropdownOpen(false)
                    }
                  }, 150)
                }}
              >
                Resources
                <svg 
                  className={`w-4 h-4 transition-transform duration-300 ${isResourcesDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isResourcesDropdownOpen && (
                <div 
                  className="modal-2d absolute top-full left-0 mt-2 min-w-56"
                  style={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    zIndex: 999999
                  }}
                >
                  {resourceItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="flex items-center gap-3 px-6 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 first:rounded-t-xl last:rounded-b-xl transition-all duration-300"
                      onClick={() => {
                        setActiveTab(item.id)
                        setIsResourcesDropdownOpen(false)
                      }}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Reports & Analytics Dropdown */}
            <div className="relative">
              <button
                className={`nav-item-2d flex items-center gap-2 ${
                  ['reports', 'analytics', 'performance', 'insights'].includes(activeTab) ? 'active' : ''
                }`}
                onClick={() => {
                  setIsReportsDropdownOpen(!isReportsDropdownOpen)
                  // Close other dropdowns
                  setIsFleetDropdownOpen(false)
                  setIsResourcesDropdownOpen(false)
                  setIsManagementDropdownOpen(false)
                }}
                onBlur={(e) => {
                  setTimeout(() => {
                    if (!e.currentTarget.parentElement?.contains(document.activeElement)) {
                      setIsReportsDropdownOpen(false)
                    }
                  }, 150)
                }}
              >
                Reports & Analytics
                <svg 
                  className={`w-4 h-4 transition-transform duration-300 ${isReportsDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isReportsDropdownOpen && (
                <div 
                  className="modal-2d absolute top-full left-0 mt-2 min-w-56"
                  style={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    zIndex: 999999
                  }}
                >
                  {reportsItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="flex items-center gap-3 px-6 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 first:rounded-t-xl last:rounded-b-xl transition-all duration-300"
                      onClick={() => {
                        setActiveTab(item.id)
                        setIsReportsDropdownOpen(false)
                      }}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Management Dashboard Dropdown - Restricted Access */}
            {hasManagementAccess && (
              <div className="relative">
                <button
                  className={`nav-item-2d flex items-center gap-2 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 text-red-700 hover:from-red-100 hover:to-orange-100 ${
                    ['financials', 'ai', 'settings'].includes(activeTab) ? 'active' : ''
                  }`}
                  onClick={() => setIsManagementDropdownOpen(!isManagementDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsManagementDropdownOpen(false), 150)}
                  title="Management Dashboard - Restricted Access"
                >
                  🔒 Management
                  <svg 
                    className={`w-4 h-4 transition-transform duration-300 ${isManagementDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isManagementDropdownOpen && (
                  <div 
                    className="modal-2d absolute top-full left-0 mt-2 min-w-64 animate-fadeInUp border-red-200"
                    style={{ 
                      backgroundColor: 'white',
                      border: '1px solid #fca5a5',
                      boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                      zIndex: 999999
                    }}
                  >
                    <div className="px-6 py-3 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-200 rounded-t-xl">
                      <span className="text-sm text-red-700 font-semibold flex items-center gap-2">
                        🔒 RESTRICTED ACCESS
                      </span>
                    </div>
                    {managementItems.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 last:rounded-b-lg transition-colors"
                        onClick={() => {
                          setActiveTab(item.id)
                          setIsManagementDropdownOpen(false)
                        }}
                      >
                        <span className="text-lg">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {role.charAt(0).toUpperCase() + role.slice(1)}</span>
            {!hasManagementAccess && (
              <Link 
                href="/settings"
                className="btn btn-secondary"
                onClick={() => setActiveTab('settings')}
              >
                Settings
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
