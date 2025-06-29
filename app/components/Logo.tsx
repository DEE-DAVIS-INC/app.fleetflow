import React, { useState } from 'react'
import Image from 'next/image'

interface LogoProps {
  size?: 'small' | 'medium' | 'large'
  variant?: 'light' | 'dark' | 'gradient'
  showText?: boolean
  useCustomLogo?: boolean
}

export default function FleetFlowLogo({ 
  size = 'medium', 
  variant = 'gradient', 
  showText = true,
  useCustomLogo = true 
}: LogoProps) {
  const [imageError, setImageError] = useState(false);
  
  // Debug logging
  console.log('FleetFlowLogo render:', { useCustomLogo, imageError, size });
  const sizes = {
    small: { width: 32, height: 32, text: 'text-lg' },
    medium: { width: 40, height: 40, text: 'text-xl' },
    large: { width: 56, height: 56, text: 'text-2xl' }
  }

  const currentSize = sizes[size]

  const logoColors = {
    light: 'text-white',
    dark: 'text-gray-900', 
    gradient: 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent'
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Custom Logo Image or Icon */}
      {useCustomLogo && !imageError ? (
        <div className={`relative ${size === 'large' ? 'w-14 h-14' : size === 'medium' ? 'w-10 h-10' : 'w-8 h-8'}`}>
          <Image
            src="/images/new fleetflow logo.png"
            alt="FleetFlow Logo"
            width={currentSize.width}
            height={currentSize.height}
            className="object-contain"
            onError={() => setImageError(true)}
            priority
          />
        </div>
      ) : (
        /* Fallback Logo Icon */
        <div className={`relative ${size === 'large' ? 'w-14 h-14' : size === 'medium' ? 'w-10 h-10' : 'w-8 h-8'}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 rounded-xl shadow-lg transform rotate-3"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-700 to-blue-800 rounded-xl flex items-center justify-center">
            <svg 
              width={currentSize.width * 0.6} 
              height={currentSize.height * 0.6} 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              {/* Truck Icon */}
              <path 
                d="M20 8h-3V4a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v11a3 3 0 0 0 6 0h6a3 3 0 0 0 6 0h1a1 1 0 0 0 1-1v-3a3 3 0 0 0-3-3zM6 18a1 1 0 1 1 1-1 1 1 0 0 1-1 1zm12 0a1 1 0 1 1 1-1 1 1 0 0 1-1 1z" 
                fill="currentColor"
              />
              {/* Speed lines for "Flow" */}
              <path 
                d="M1 6h4m-3 2h3m-2 2h2" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round"
                opacity="0.8"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold leading-tight ${currentSize.text} ${logoColors[variant]}`}>
            FleetFlow
          </span>
        </div>
      )}
    </div>
  )
}
