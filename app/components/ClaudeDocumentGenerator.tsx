'use client'

import { useState } from 'react'

export default function ClaudeDocumentGenerator() {
  const [documentType, setDocumentType] = useState<'rate_confirmation' | 'bill_of_lading' | 'route_plan' | 'safety_report'>('rate_confirmation')
  const [documentData, setDocumentData] = useState('')
  const [generatedDocument, setGeneratedDocument] = useState('')
  const [shareableLink, setShareableLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [customInstructions, setCustomInstructions] = useState('')

  const generateDocument = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate_document',
          data: {
            type: documentType,
            data: JSON.parse(documentData || '{}'),
            customInstructions,
            shareableLink: true
          }
        }),
      })

      const result = await response.json()
      if (result.success) {
        setGeneratedDocument(result.data.document)
        setShareableLink(result.data.shareableLink || '')
      } else {
        alert('Error: ' + result.error)
      }
    } catch (error) {
      console.error('Document generation error:', error)
      alert('Failed to generate document')
    } finally {
      setLoading(false)
    }
  }

  const sampleData = {
    rate_confirmation: {
      shipmentId: 'FL-2024-0892',
      shipper: {
        name: 'ABC Manufacturing',
        address: '123 Industrial Blvd, Atlanta, GA 30309',
        contact: 'John Smith',
        phone: '(404) 555-0123'
      },
      consignee: {
        name: 'XYZ Distribution',
        address: '456 Warehouse Dr, Miami, FL 33101',
        contact: 'Jane Doe',
        phone: '(305) 555-0456'
      },
      commodity: 'Auto Parts',
      weight: '26,000 lbs',
      pieces: '15 pallets',
      equipment: '53\' Dry Van',
      rate: '$2,850.00',
      pickupDate: '2024-07-01',
      deliveryDate: '2024-07-02',
      specialInstructions: 'Temperature controlled, handle with care'
    },
    bill_of_lading: {
      bolNumber: 'BOL-2024-0892',
      shipperInfo: 'ABC Manufacturing, 123 Industrial Blvd, Atlanta, GA',
      consigneeInfo: 'XYZ Distribution, 456 Warehouse Dr, Miami, FL',
      carrier: 'Premium Transport LLC',
      trailerNumber: 'TRL-5678',
      sealNumber: 'SEAL-9012',
      commodities: [
        { description: 'Auto Parts - Brake Systems', weight: '15,000 lbs', pieces: '10 pallets' },
        { description: 'Auto Parts - Engine Components', weight: '11,000 lbs', pieces: '5 pallets' }
      ]
    },
    route_plan: {
      routeId: 'RT-2024-0892',
      origin: 'Atlanta, GA 30309',
      destination: 'Miami, FL 33101',
      vehicle: 'Truck-045',
      driver: 'Mike Johnson',
      estimatedDistance: '663 miles',
      estimatedTime: '11 hours',
      fuelStops: ['Macon, GA', 'Gainesville, FL'],
      restAreas: ['Tifton, GA (30 min)', 'Lake City, FL (45 min)'],
      specialNotes: 'Avoid downtown Miami during rush hour'
    }
  }

  const handleSampleData = () => {
    setDocumentData(JSON.stringify(sampleData[documentType], null, 2))
  }

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      padding: '25px',
      borderRadius: '15px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      marginBottom: '20px'
    }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#fff' }}>
        🤖 Claude AI Document Generator
      </h3>

      <div style={{ display: 'grid', gap: '20px' }}>
        {/* Document Type Selection */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
            Document Type:
          </label>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value as any)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '16px'
            }}
          >
            <option value="rate_confirmation">Rate Confirmation</option>
            <option value="bill_of_lading">Bill of Lading</option>
            <option value="route_plan">Route Plan</option>
            <option value="safety_report">Safety Report</option>
          </select>
        </div>

        {/* Data Input */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ color: '#fff' }}>
              Shipment Data (JSON):
            </label>
            <button
              onClick={handleSampleData}
              style={{
                padding: '6px 12px',
                background: 'rgba(33, 150, 243, 0.8)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Load Sample Data
            </button>
          </div>
          <textarea
            value={documentData}
            onChange={(e) => setDocumentData(e.target.value)}
            placeholder="Enter shipment data as JSON..."
            style={{
              width: '100%',
              height: '200px',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontFamily: 'monospace',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Custom Instructions */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
            Custom Instructions (Optional):
          </label>
          <textarea
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder="Add any special formatting or content requirements..."
            style={{
              width: '100%',
              height: '80px',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={generateDocument}
          disabled={loading || !documentData}
          style={{
            padding: '15px',
            background: loading ? '#666' : 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {loading ? '🤖 Generating with Claude AI...' : '📄 Generate Document'}
        </button>

        {/* Generated Document */}
        {generatedDocument && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ margin: 0, color: '#fff' }}>Generated Document:</h4>
              {shareableLink && (
                <a
                  href={shareableLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(33, 150, 243, 0.8)',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  🔗 Share Link
                </a>
              )}
            </div>
            <div
              style={{
                background: 'white',
                color: 'black',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                maxHeight: '500px',
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                fontFamily: 'Arial, sans-serif',
                lineHeight: '1.6'
              }}
            >
              {generatedDocument}
            </div>
          </div>
        )}

        {/* Benefits Info */}
        <div style={{
          background: 'rgba(76, 175, 80, 0.1)',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid rgba(76, 175, 80, 0.3)'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#4CAF50' }}>
            ✨ Claude AI Benefits:
          </h4>
          <ul style={{ margin: 0, color: '#fff', fontSize: '14px' }}>
            <li>Professional document formatting with industry standards</li>
            <li>Intelligent content generation based on shipment data</li>
            <li>Shareable links for easy client distribution</li>
            <li>Compliance with DOT and freight regulations</li>
            <li>Customizable instructions for specific requirements</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
