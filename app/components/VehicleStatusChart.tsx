'use client'

import { useEffect, useRef } from 'react'

const VehicleStatusChart = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Simple pie chart
    const data = [
      { label: 'Active', value: 134, color: '#10b981' },
      { label: 'Maintenance', value: 22, color: '#f59e0b' },
      { label: 'Inactive', value: 8, color: '#ef4444' }
    ]

    const total = data.reduce((sum, item) => sum + item.value, 0)
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = 80

    let currentAngle = -Math.PI / 2

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw pie slices
    data.forEach((item) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
      ctx.closePath()
      ctx.fillStyle = item.color
      ctx.fill()

      currentAngle += sliceAngle
    })

    // Draw center circle for donut effect
    ctx.beginPath()
    ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI)
    ctx.fillStyle = 'white'
    ctx.fill()

    // Draw total in center
    ctx.fillStyle = '#1e293b'
    ctx.font = 'bold 24px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(total.toString(), centerX, centerY - 5)
    ctx.font = '12px Arial'
    ctx.fillText('Total Vehicles', centerX, centerY + 15)
  }, [])

  return (
    <div className="card">
      <h3 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>
        Vehicle Status Distribution
      </h3>
      
      <div className="flex items-center gap-6">
        <canvas 
          ref={canvasRef} 
          width={200} 
          height={200}
          style={{ maxWidth: '200px', maxHeight: '200px' }}
        />
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div 
              style={{ 
                width: '12px', 
                height: '12px', 
                backgroundColor: '#10b981', 
                borderRadius: '50%' 
              }}
            ></div>
            <span className="text-gray-600">Active (134)</span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              style={{ 
                width: '12px', 
                height: '12px', 
                backgroundColor: '#f59e0b', 
                borderRadius: '50%' 
              }}
            ></div>
            <span className="text-gray-600">Maintenance (22)</span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              style={{ 
                width: '12px', 
                height: '12px', 
                backgroundColor: '#ef4444', 
                borderRadius: '50%' 
              }}
            ></div>
            <span className="text-gray-600">Inactive (8)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VehicleStatusChart
