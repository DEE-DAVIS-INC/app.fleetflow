'use client'

import { useState, useMemo } from 'react'
import { useShipper } from '../contexts/ShipperContext'
import Link from 'next/link'
import { Shipper } from '../types/shipper'

export default function ShippersPage() {
  const { shippers, setSelectedShipper } = useShipper()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<keyof Shipper | ''>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedShippers, setSelectedShippers] = useState<string[]>([])

  // Filter and sort shippers
  const filteredAndSortedShippers = useMemo(() => {
    let filtered = shippers.filter(shipper => 
      shipper.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipper.contacts.some(contact => 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )

    if (sortBy) {
      filtered.sort((a, b) => {
        let aValue = a[sortBy]
        let bValue = b[sortBy]
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase()
          bValue = bValue.toLowerCase()
        }
        
        if (sortDirection === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
        }
      })
    }

    return filtered
  }, [shippers, searchTerm, sortBy, sortDirection])

  // CSV Export function
  const exportToCSV = () => {
    const headers = [
      'Company Name',
      'Primary Contact',
      'Email',
      'Phone',
      'Address',
      'City',
      'State',
      'ZIP',
      'Credit Rating',
      'Payment Terms',
      'Total Loads',
      'Revenue YTD'
    ]

    const csvData = filteredAndSortedShippers.map(shipper => [
      shipper.companyName,
      shipper.contacts[0]?.name || '',
      shipper.contacts[0]?.email || '',
      shipper.contacts[0]?.phone || '',
      shipper.address?.street || '',
      shipper.address?.city || '',
      shipper.address?.state || '',
      shipper.address?.zipCode || '',
      shipper.creditRating || '',
      shipper.paymentTerms || '',
      shipper.totalLoads || 0,
      shipper.revenueYTD || 0
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `shippers_export_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  // Handle sorting
  const handleSort = (field: keyof Shipper) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortDirection('asc')
    }
  }

  // Handle shipper selection for documents
  const handleSelectShipper = (shipper: Shipper) => {
    setSelectedShipper(shipper)
    // Set for document generation and redirect
    window.location.href = '/documents'
  }

  // Toggle checkbox selection
  const toggleShipperSelection = (shipperId: string) => {
    setSelectedShippers(prev => 
      prev.includes(shipperId) 
        ? prev.filter(id => id !== shipperId)
        : [...prev, shipperId]
    )
  }

  // Select all/none
  const toggleSelectAll = () => {
    if (selectedShippers.length === filteredAndSortedShippers.length) {
      setSelectedShippers([])
    } else {
      setSelectedShippers(filteredAndSortedShippers.map(s => s.id))
    }
  }

  const SortIcon = ({ field }: { field: keyof Shipper }) => {
    if (sortBy !== field) return <span style={{ color: '#888' }}>↕️</span>
    return sortDirection === 'asc' ? <span style={{ color: '#2196F3' }}>↑</span> : <span style={{ color: '#2196F3' }}>↓</span>
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
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
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 20px 20px' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '30px',
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
          }}>🏢 Shipper Database</h1>
          <p style={{
            margin: 0,
            opacity: 0.9,
            fontSize: '1.1rem'
          }}>Streamlined Excel-like interface for shipper management</p>
        </div>

        {/* Controls */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px',
          color: '#333',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <input
              type="text"
              placeholder="🔍 Search shippers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '10px 15px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                width: '300px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2196F3'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
            <span style={{ fontSize: '14px', color: '#666' }}>
              {filteredAndSortedShippers.length} of {shippers.length} shippers
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={exportToCSV}
              style={{
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#45a049'}
              onMouseOut={(e) => e.currentTarget.style.background = '#4CAF50'}
            >
              📄 Export CSV
            </button>
            
            {selectedShippers.length > 0 && (
              <Link href="/documents" style={{ textDecoration: 'none' }}>
                <button
                  onClick={() => {
                    // Set selected shippers for document generation
                    const selectedShipperObjects = shippers.filter(s => selectedShippers.includes(s.id))
                    if (selectedShipperObjects.length > 0) {
                      setSelectedShipper(selectedShipperObjects[0])
                    }
                  }}
                  style={{
                    background: '#FF9800',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#F57C00'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#FF9800'}
                >
                  📄 Create Documents ({selectedShippers.length})
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Excel-like Table */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.98)',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '40px 200px 150px 140px 120px 150px 100px 80px 120px 120px',
            background: '#f5f5f5',
            borderBottom: '2px solid #e0e0e0',
            fontSize: '14px',
            fontWeight: '600',
            color: '#333'
          }}>
            <div style={{ padding: '15px 10px', borderRight: '1px solid #e0e0e0', textAlign: 'center' }}>
              <input
                type="checkbox"
                checked={selectedShippers.length === filteredAndSortedShippers.length && filteredAndSortedShippers.length > 0}
                onChange={toggleSelectAll}
                style={{ cursor: 'pointer' }}
              />
            </div>
            <div style={{ padding: '15px', borderRight: '1px solid #e0e0e0', cursor: 'pointer' }} onClick={() => handleSort('companyName')}>
              Company <SortIcon field="companyName" />
            </div>
            <div style={{ padding: '15px', borderRight: '1px solid #e0e0e0' }}>
              Primary Contact
            </div>
            <div style={{ padding: '15px', borderRight: '1px solid #e0e0e0' }}>
              Email
            </div>
            <div style={{ padding: '15px', borderRight: '1px solid #e0e0e0' }}>
              Phone
            </div>
            <div style={{ padding: '15px', borderRight: '1px solid #e0e0e0' }}>
              Location
            </div>
            <div style={{ padding: '15px', borderRight: '1px solid #e0e0e0', cursor: 'pointer' }} onClick={() => handleSort('creditRating')}>
              Credit <SortIcon field="creditRating" />
            </div>
            <div style={{ padding: '15px', borderRight: '1px solid #e0e0e0', cursor: 'pointer' }} onClick={() => handleSort('totalLoads')}>
              Loads <SortIcon field="totalLoads" />
            </div>
            <div style={{ padding: '15px', borderRight: '1px solid #e0e0e0', cursor: 'pointer' }} onClick={() => handleSort('revenueYTD')}>
              Revenue <SortIcon field="revenueYTD" />
            </div>
            <div style={{ padding: '15px', textAlign: 'center' }}>
              Actions
            </div>
          </div>

          {/* Table Body */}
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {filteredAndSortedShippers.map((shipper, index) => (
              <div
                key={shipper.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 200px 150px 140px 120px 150px 100px 80px 120px 120px',
                  borderBottom: '1px solid #e0e0e0',
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9',
                  fontSize: '13px',
                  color: '#333',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e3f2fd'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f9f9f9'}
              >
                <div style={{ padding: '12px 10px', borderRight: '1px solid #e0e0e0', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selectedShippers.includes(shipper.id)}
                    onChange={() => toggleShipperSelection(shipper.id)}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                <div style={{ padding: '12px 15px', borderRight: '1px solid #e0e0e0', fontWeight: '600' }}>
                  {shipper.companyName}
                </div>
                <div style={{ padding: '12px 15px', borderRight: '1px solid #e0e0e0' }}>
                  {shipper.contacts[0]?.name || '-'}
                </div>
                <div style={{ padding: '12px 15px', borderRight: '1px solid #e0e0e0' }}>
                  {shipper.contacts[0]?.email || '-'}
                </div>
                <div style={{ padding: '12px 15px', borderRight: '1px solid #e0e0e0' }}>
                  {shipper.contacts[0]?.phone || '-'}
                </div>
                <div style={{ padding: '12px 15px', borderRight: '1px solid #e0e0e0' }}>
                  {shipper.address?.city}, {shipper.address?.state}
                </div>
                <div style={{ padding: '12px 15px', borderRight: '1px solid #e0e0e0' }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600',
                    backgroundColor: shipper.creditRating === 'A' ? '#d4edda' : 
                                    shipper.creditRating === 'B' ? '#fff3cd' : '#f8d7da',
                    color: shipper.creditRating === 'A' ? '#155724' : 
                           shipper.creditRating === 'B' ? '#856404' : '#721c24'
                  }}>
                    {shipper.creditRating || 'N/A'}
                  </span>
                </div>
                <div style={{ padding: '12px 15px', borderRight: '1px solid #e0e0e0', textAlign: 'center' }}>
                  {shipper.totalLoads || 0}
                </div>
                <div style={{ padding: '12px 15px', borderRight: '1px solid #e0e0e0', textAlign: 'right' }}>
                  ${((shipper.revenueYTD || 0) / 1000).toFixed(0)}K
                </div>
                <div style={{ padding: '12px', textAlign: 'center' }}>
                  <button
                    onClick={() => handleSelectShipper(shipper)}
                    style={{
                      background: '#2196F3',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#1976D2'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#2196F3'}
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredAndSortedShippers.length === 0 && (
            <div style={{ 
              padding: '60px 20px', 
              textAlign: 'center', 
              color: '#666',
              fontSize: '16px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>📋</div>
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>No shippers found</h3>
              <p style={{ margin: 0 }}>
                {searchTerm ? `No shippers match "${searchTerm}"` : 'No shippers in database'}
              </p>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '14px',
          opacity: 0.9
        }}>
          <div>
            Displaying {filteredAndSortedShippers.length} of {shippers.length} shippers
          </div>
          <div>
            {selectedShippers.length > 0 && `${selectedShippers.length} selected`}
          </div>
        </div>
      </div>
    </div>
  )
}
