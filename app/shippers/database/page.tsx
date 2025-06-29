'use client'

import { useState, useMemo } from 'react'
import { useShipper } from '../../contexts/ShipperContext'
import { getCurrentUser } from '../../config/access'
import Logo from '../../components/Logo'
import { 
  TableCellsIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { Shipper } from '../../types/shipper'

type SortField = 'companyName' | 'totalLoads' | 'totalRevenue' | 'creditRating' | 'status' | 'joinDate'
type SortDirection = 'asc' | 'desc'

export default function ShipperDataTablePage() {
  const { shippers } = useShipper()
  const currentUser = getCurrentUser()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('companyName')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [creditFilter, setCreditFilter] = useState<string>('')
  const [selectedShippers, setSelectedShippers] = useState<string[]>([])

  // Filter shippers based on user role
  const filteredShippers = useMemo(() => {
    let filtered = shippers.filter((shipper: Shipper) => {
      // Role-based filtering
      if (currentUser.role === 'broker' && currentUser.brokerId) {
        if (shipper.assignedBrokerId !== currentUser.brokerId) return false
      }

      // Search filter
      const searchMatch = shipper.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipper.contacts.some((contact: any) => 
                           contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contact.email.toLowerCase().includes(searchTerm.toLowerCase())
                         ) ||
                         shipper.locations.some((location: any) =>
                           location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           location.state.toLowerCase().includes(searchTerm.toLowerCase())
                         )

      // Status filter
      const statusMatch = !statusFilter || shipper.status === statusFilter

      // Credit filter
      const creditMatch = !creditFilter || shipper.creditRating === creditFilter

      return searchMatch && statusMatch && creditMatch
    })

    // Sort
    filtered.sort((a: Shipper, b: Shipper) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      if (sortField === 'joinDate') {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [shippers, currentUser, searchTerm, sortField, sortDirection, statusFilter, creditFilter])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleSelectShipper = (shipperId: string) => {
    setSelectedShippers(prev => 
      prev.includes(shipperId) 
        ? prev.filter(id => id !== shipperId)
        : [...prev, shipperId]
    )
  }

  const handleSelectAll = () => {
    if (selectedShippers.length === filteredShippers.length) {
      setSelectedShippers([])
    } else {
      setSelectedShippers(filteredShippers.map((s: Shipper) => s.id))
    }
  }

  const exportToCSV = () => {
    const dataToExport = selectedShippers.length > 0 
      ? filteredShippers.filter((s: Shipper) => selectedShippers.includes(s.id))
      : filteredShippers

    const headers = [
      'Company Name',
      'Primary Contact',
      'Contact Email',
      'Contact Phone',
      'Contact Title',
      'Primary Location',
      'City',
      'State',
      'ZIP',
      'Assigned Broker',
      'Status',
      'Credit Rating',
      'Payment Terms',
      'Credit Limit',
      'Total Loads',
      'Total Revenue',
      'Average Rate',
      'Join Date',
      'Last Activity',
      'Tax ID',
      'MC Number',
      'Primary Commodity',
      'Freight Class',
      'Notes'
    ]

    const csvData = dataToExport.map((shipper: Shipper) => {
      const primaryContact = shipper.contacts.find((c: any) => c.isPrimary) || shipper.contacts[0]
      const primaryLocation = shipper.locations[0]
      const primaryCommodity = shipper.commodities[0]

      return [
        shipper.companyName,
        primaryContact?.name || '',
        primaryContact?.email || '',
        primaryContact?.phone || '',
        primaryContact?.title || '',
        primaryLocation?.name || '',
        primaryLocation?.city || '',
        primaryLocation?.state || '',
        primaryLocation?.zip || '',
        shipper.assignedBrokerName,
        shipper.status,
        shipper.creditRating,
        shipper.paymentTerms,
        shipper.creditLimit,
        shipper.totalLoads,
        shipper.totalRevenue,
        shipper.averageRate,
        new Date(shipper.joinDate).toLocaleDateString(),
        new Date(shipper.lastActivity).toLocaleDateString(),
        shipper.taxId,
        shipper.mcNumber || '',
        primaryCommodity?.name || '',
        primaryCommodity?.freightClass || '',
        shipper.notes || ''
      ]
    })

    const csvContent = [headers, ...csvData]
      .map((row: any[]) => row.map((field: any) => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `shippers_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToExcel = () => {
    // This would integrate with a library like xlsx for proper Excel export
    // For now, we'll use CSV format but with .xlsx extension
    exportToCSV()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' 
      ? <ChevronUpIcon className="h-4 w-4" />
      : <ChevronDownIcon className="h-4 w-4" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Logo />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Shipper Database</h1>
                <p className="text-blue-100">
                  Complete shipper contact information and export capabilities
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={exportToCSV}
                className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-medium rounded-2xl shadow-lg hover:bg-white/30 transition-all duration-200 transform hover:scale-105 border border-white/20"
              >
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                Export CSV
              </button>
              <button
                onClick={exportToExcel}
                className="inline-flex items-center px-6 py-3 bg-green-500/80 backdrop-blur-sm text-white font-medium rounded-2xl shadow-lg hover:bg-green-600/80 transition-all duration-200 transform hover:scale-105 border border-green-400/20"
              >
                <TableCellsIcon className="h-5 w-5 mr-2" />
                Export Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search shippers, contacts, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            {/* Credit Filter */}
            <div>
              <select
                value={creditFilter}
                onChange={(e) => setCreditFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              >
                <option value="">All Credit Ratings</option>
                <option value="A">A - Excellent</option>
                <option value="B">B - Good</option>
                <option value="C">C - Fair</option>
                <option value="D">D - Poor</option>
              </select>
            </div>
          </div>

          {/* Selection Info */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {filteredShippers.length} of {shippers.length} shippers
              {selectedShippers.length > 0 && (
                <span className="ml-2 text-blue-600 font-medium">
                  ({selectedShippers.length} selected)
                </span>
              )}
            </div>
            {selectedShippers.length > 0 && (
              <button
                onClick={() => setSelectedShippers([])}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear selection
              </button>
            )}
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedShippers.length === filteredShippers.length && filteredShippers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('companyName')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Company</span>
                      {getSortIcon('companyName')}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Primary Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Broker
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      {getSortIcon('status')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('creditRating')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Credit</span>
                      {getSortIcon('creditRating')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('totalLoads')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Loads</span>
                      {getSortIcon('totalLoads')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('totalRevenue')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Revenue</span>
                      {getSortIcon('totalRevenue')}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredShippers.map((shipper: Shipper, index: number) => {
                  const primaryContact = shipper.contacts.find((c: any) => c.isPrimary) || shipper.contacts[0]
                  const primaryLocation = shipper.locations[0]
                  
                  return (
                    <tr 
                      key={shipper.id} 
                      className={`hover:bg-gray-50 transition-colors ${
                        selectedShippers.includes(shipper.id) ? 'bg-blue-50' : ''
                      } ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedShippers.includes(shipper.id)}
                          onChange={() => handleSelectShipper(shipper.id)}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg mr-3">
                            <BuildingOfficeIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">{shipper.companyName}</div>
                            <div className="text-xs text-gray-500">Tax ID: {shipper.taxId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {primaryContact ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900">{primaryContact.name}</div>
                            <div className="text-xs text-gray-500">{primaryContact.title}</div>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <EnvelopeIcon className="h-3 w-3 mr-1" />
                              {primaryContact.email}
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <PhoneIcon className="h-3 w-3 mr-1" />
                              {primaryContact.phone}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">No contact</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {primaryLocation ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900">{primaryLocation.name}</div>
                            <div className="flex items-center text-xs text-gray-500">
                              <MapPinIcon className="h-3 w-3 mr-1" />
                              {primaryLocation.city}, {primaryLocation.state} {primaryLocation.zip}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">No location</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{shipper.assignedBrokerName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          shipper.status === 'active' ? 'bg-green-100 text-green-800' :
                          shipper.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {shipper.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          shipper.creditRating === 'A' ? 'bg-green-100 text-green-800' :
                          shipper.creditRating === 'B' ? 'bg-yellow-100 text-yellow-800' :
                          shipper.creditRating === 'C' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {shipper.creditRating}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">{shipper.totalLoads}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">{formatCurrency(shipper.totalRevenue)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          {(currentUser.role === 'admin' || currentUser.role === 'manager' || 
                            (currentUser.role === 'broker' && shipper.assignedBrokerId === currentUser.brokerId)) && (
                            <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                              <PencilIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredShippers.length === 0 && (
            <div className="text-center py-12">
              <TableCellsIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No shippers found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
