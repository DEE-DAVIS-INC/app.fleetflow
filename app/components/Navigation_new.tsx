'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import FleetFlowLogo from './Logo'

const Navigation = () => {
  const pathname = usePathname()
  const [isFleetDropdownOpen, setIsFleetDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/', icon: '📊' },
    { id: 'dispatch', label: 'Dispatch', href: '/dispatch', icon: '🎯' },
    { id: 'broker', label: 'Broker', href: '/broker', icon: '🤝' },
    { id: 'quoting', label: 'Quoting', href: '/quoting', icon: '💰' },
    { id: 'reports', label: 'Reports', href: '/reports', icon: '📈' },
    { id: 'resources', label: 'Resources', href: '/resources', icon: '📚' },
    { id: 'training', label: 'Training', href: '/training', icon: '🎓' },
    { id: 'settings', label: 'Settings', href: '/settings', icon: '⚙️' },
  ]

  const fleetItems = [
    { id: 'vehicles', label: 'Vehicles', href: '/vehicles', icon: '🚛', desc: 'Manage fleet vehicles' },
    { id: 'drivers', label: 'Drivers', href: '/drivers', icon: '👥', desc: 'Driver management' },
    { id: 'routes', label: 'Routes', href: '/routes', icon: '🗺️', desc: 'Route planning' },
    { id: 'maintenance', label: 'Maintenance', href: '/maintenance', icon: '🔧', desc: 'Service & repairs' },
  ]

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsFleetDropdownOpen(false)
      setIsMobileMenuOpen(false)
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Main Navigation */}
      <nav className="bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity group">
              <div className="transform group-hover:scale-105 transition-transform">
                <FleetFlowLogo size="medium" variant="gradient" showText={true} useCustomLogo={true} />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 group ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
                  }`}
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}

              {/* Fleet Management Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsFleetDropdownOpen(!isFleetDropdownOpen)
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 group ${
                    fleetItems.some(item => isActive(item.href))
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50'
                  }`}
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">🚚</span>
                  <span>Fleet</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${isFleetDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isFleetDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-gray-200/50 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-900 flex items-center">
                        <span className="text-lg mr-2">🚚</span>
                        Fleet Management
                      </h3>
                    </div>
                    {fleetItems.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={`block px-4 py-3 text-sm transition-colors hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 group ${
                          isActive(item.href) ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-r-2 border-emerald-500' : ''
                        }`}
                        onClick={() => setIsFleetDropdownOpen(false)}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
                          <div>
                            <div className="font-medium text-gray-900">{item.label}</div>
                            <div className="text-xs text-gray-500">{item.desc}</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsMobileMenuOpen(!isMobileMenuOpen)
              }}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200/50">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center space-x-3 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
              
              <div className="border-t border-gray-200 pt-2 mt-4">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fleet Management</div>
                {fleetItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center space-x-3 ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                        : 'text-gray-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

export default Navigation
