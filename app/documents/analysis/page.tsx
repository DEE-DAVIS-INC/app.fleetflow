'use client'

import { useState } from 'react'
import { useShipper } from '../../contexts/ShipperContext'
import Logo from '../../components/Logo'
import { 
  CloudArrowUpIcon,
  DocumentTextIcon,
  PhotoIcon,
  TableCellsIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  DocumentArrowUpIcon
} from '@heroicons/react/24/outline'

interface UploadedDocument {
  id: string
  name: string
  type: string
  size: number
  uploadDate: string
  status: 'processing' | 'completed' | 'error'
  extractedData?: {
    [key: string]: any
  }
}

export default function DocumentAnalysisPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedDocument[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<UploadedDocument | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const newDoc: UploadedDocument = {
        id: `doc-${Date.now()}-${Math.random()}`,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString(),
        status: 'processing'
      }
      
      setUploadedFiles(prev => [...prev, newDoc])
      
      // Simulate processing
      setTimeout(() => {
        setUploadedFiles(prev => prev.map(doc => 
          doc.id === newDoc.id 
            ? {
                ...doc, 
                status: 'completed',
                extractedData: simulateExtractedData(file.name)
              }
            : doc
        ))
      }, 2000)
    })
  }

  const simulateExtractedData = (fileName: string) => {
    // This would be replaced with actual AI/OCR extraction logic
    if (fileName.toLowerCase().includes('invoice')) {
      return {
        documentType: 'Invoice',
        invoiceNumber: 'INV-2024-001',
        total: '$2,450.00',
        dueDate: '2025-01-30',
        vendor: 'ABC Trucking LLC',
        items: ['Transportation Services', 'Fuel Surcharge'],
        extractedText: 'Invoice #INV-2024-001\nTotal: $2,450.00\nDue Date: January 30, 2025'
      }
    } else if (fileName.toLowerCase().includes('bol') || fileName.toLowerCase().includes('bill')) {
      return {
        documentType: 'Bill of Lading',
        bolNumber: 'BOL-2024-556789',
        shipper: 'Global Manufacturing Corp',
        consignee: 'Southern Distribution Center',
        weight: '15,240 lbs',
        pieces: '5 pallets',
        commodity: 'Steel Components',
        extractedText: 'Bill of Lading #BOL-2024-556789\nShipper: Global Manufacturing Corp\nWeight: 15,240 lbs'
      }
    } else if (fileName.toLowerCase().includes('rate')) {
      return {
        documentType: 'Rate Confirmation',
        rateConfNumber: 'RC-2024-789',
        rate: '$1,850.00',
        lane: 'Chicago, IL - Atlanta, GA',
        miles: '716 miles',
        equipment: 'Dry Van 53\'',
        extractedText: 'Rate Confirmation #RC-2024-789\nRate: $1,850.00\nLane: Chicago, IL - Atlanta, GA'
      }
    } else {
      return {
        documentType: 'Unknown',
        extractedText: 'Document processed successfully. Content extracted.',
        fields: ['Multiple fields detected', 'Text content available']
      }
    }
  }

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <DocumentTextIcon className="h-8 w-8 text-red-500" />
    if (type.includes('image')) return <PhotoIcon className="h-8 w-8 text-blue-500" />
    if (type.includes('spreadsheet') || type.includes('excel')) return <TableCellsIcon className="h-8 w-8 text-green-500" />
    return <DocumentTextIcon className="h-8 w-8 text-gray-500" />
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
      case 'completed': return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'error': return <XCircleIcon className="h-5 w-5 text-red-500" />
      default: return null
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB'
    return Math.round(bytes / (1024 * 1024)) + ' MB'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Logo />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Document Analysis</h1>
                <p className="text-emerald-100">
                  Upload and extract data from shipping documents, invoices, and contracts
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Upload Documents</h2>
              
              {/* Modern Drop Zone */}
              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
                  dragActive 
                    ? 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-50' 
                    : 'border-gray-300 hover:border-gray-400 bg-gradient-to-br from-gray-50 to-gray-100'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  onChange={handleChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.tiff"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center">
                  <div className="p-4 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl inline-block mb-4">
                    <CloudArrowUpIcon className="h-12 w-12 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      <span className="text-emerald-600 hover:text-emerald-700 cursor-pointer">
                        Click to upload
                      </span>{' '}
                      or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF, DOC, XLS, JPG, PNG up to 10MB each
                    </p>
                  </div>
                </div>
              </div>

              {/* Modern Document Types Grid */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center border border-blue-200 transform hover:scale-105 transition-all duration-200">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl inline-block mb-3">
                    <DocumentTextIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-900 mb-2">Bills of Lading</h3>
                  <p className="text-sm text-blue-700">Extract shipper, consignee, weight, commodity</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center border border-green-200 transform hover:scale-105 transition-all duration-200">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl inline-block mb-3">
                    <DocumentArrowUpIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-green-900 mb-2">Invoices</h3>
                  <p className="text-sm text-green-700">Extract amounts, dates, vendor information</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center border border-purple-200 transform hover:scale-105 transition-all duration-200">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl inline-block mb-3">
                    <TableCellsIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-purple-900 mb-2">Rate Sheets</h3>
                  <p className="text-sm text-purple-700">Extract rates, lanes, equipment requirements</p>
                </div>
              </div>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Uploaded Documents</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="px-6 py-4 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedDocument(file)}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file.type)}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)} • {new Date(file.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(file.status)}
                          <span className={`text-xs font-medium ${
                            file.status === 'completed' ? 'text-green-600' :
                            file.status === 'processing' ? 'text-blue-600' :
                            'text-red-600'
                          }`}>
                            {file.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Document Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Document Details</h3>
              
              {selectedDocument ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Document Name</h4>
                    <p className="text-sm text-gray-900">{selectedDocument.name}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Status</h4>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedDocument.status)}
                      <span className="text-sm text-gray-900 capitalize">{selectedDocument.status}</span>
                    </div>
                  </div>

                  {selectedDocument.extractedData && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Extracted Data</h4>
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        {Object.entries(selectedDocument.extractedData).map(([key, value]) => (
                          <div key={key} className="text-xs">
                            <span className="font-medium text-gray-600">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                            <span className="text-gray-900 ml-1">
                              {Array.isArray(value) ? value.join(', ') : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <button className="mt-3 w-full inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                        View Full Analysis
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Select a document to view details and extracted data
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
