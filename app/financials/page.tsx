'use client';

import React, { useState } from 'react';
import { checkPermission, ACCESS_MESSAGES } from '../config/access';

// Access Control Component
const AccessRestricted = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
      <div className="text-6xl mb-4">🔒</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{ACCESS_MESSAGES.financials.title}</h1>
      <p className="text-gray-600 mb-4">
        {ACCESS_MESSAGES.financials.message}
      </p>
      <p className="text-sm text-gray-500 mb-6">
        {ACCESS_MESSAGES.financials.requirement}
      </p>
      <button 
        onClick={() => window.history.back()} 
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go Back
      </button>
    </div>
  </div>
);

interface Invoice {
  id: string;
  loadId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  createdDate: string;
  items: {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
}

interface Expense {
  id: string;
  category: 'fuel' | 'maintenance' | 'tolls' | 'permits' | 'other';
  amount: number;
  description: string;
  date: string;
  vehicleId?: string;
  receipt?: string;
}

export default function FinancialsPage() {
  const [selectedTab, setSelectedTab] = useState<'invoices' | 'expenses' | 'reports'>('invoices');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  
  // Check access permission using centralized system
  if (!checkPermission('hasFinancialsAccess')) {
    return <AccessRestricted />;
  }
  
  // Mock data
  const [invoices] = useState<Invoice[]>([
    {
      id: 'INV-2024-001',
      loadId: 'LD-001',
      customerName: 'ABC Manufacturing',
      customerEmail: 'billing@abcmanufacturing.com',
      amount: 2450.00,
      dueDate: '2024-12-30',
      status: 'sent',
      createdDate: '2024-12-15',
      items: [
        { description: 'Freight transport: Atlanta, GA to Miami, FL', quantity: 1, rate: 2450.00, amount: 2450.00 }
      ]
    },
    {
      id: 'INV-2024-002',
      loadId: 'LD-002',
      customerName: 'XYZ Logistics',
      customerEmail: 'accounts@xyzlogistics.com',
      amount: 3200.00,
      dueDate: '2024-12-25',
      status: 'paid',
      createdDate: '2024-12-10',
      items: [
        { description: 'Freight transport: Chicago, IL to Houston, TX', quantity: 1, rate: 3200.00, amount: 3200.00 }
      ]
    },
    {
      id: 'INV-2024-003',
      loadId: 'LD-003',
      customerName: 'Tech Solutions Inc',
      customerEmail: 'billing@techsolutions.com',
      amount: 1850.00,
      dueDate: '2024-12-20',
      status: 'overdue',
      createdDate: '2024-12-05',
      items: [
        { description: 'Freight transport: Los Angeles, CA to Phoenix, AZ', quantity: 1, rate: 1850.00, amount: 1850.00 }
      ]
    }
  ]);

  const [expenses] = useState<Expense[]>([
    {
      id: 'EXP-001',
      category: 'fuel',
      amount: 450.25,
      description: 'Fuel - Shell Station I-75',
      date: '2024-12-19',
      vehicleId: 'TRK-101'
    },
    {
      id: 'EXP-002',
      category: 'maintenance',
      amount: 1200.00,
      description: 'Oil change and tire rotation',
      date: '2024-12-18',
      vehicleId: 'TRK-205'
    },
    {
      id: 'EXP-003',
      category: 'tolls',
      amount: 35.50,
      description: 'Florida Turnpike tolls',
      date: '2024-12-17',
      vehicleId: 'TRK-101'
    },
    {
      id: 'EXP-004',
      category: 'permits',
      amount: 125.00,
      description: 'Oversize permit - Texas',
      date: '2024-12-16',
      vehicleId: 'TRK-150'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fuel':
        return '⛽';
      case 'maintenance':
        return '🔧';
      case 'tolls':
        return '🛣️';
      case 'permits':
        return '📋';
      default:
        return '📄';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fuel':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'tolls':
        return 'bg-blue-100 text-blue-800';
      case 'permits':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const outstandingInvoices = invoices.filter(inv => inv.status !== 'paid').reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">💰 Financial Management</h1>
        <p className="text-gray-600 mt-2">
          Invoicing, expense tracking, and financial reporting
        </p>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">💵</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="text-lg font-medium text-gray-900">${totalRevenue.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">💸</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Expenses</dt>
                  <dd className="text-lg font-medium text-gray-900">${totalExpenses.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">📈</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Net Profit</dt>
                  <dd className={`text-lg font-medium ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${netProfit.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">⏰</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Outstanding</dt>
                  <dd className="text-lg font-medium text-gray-900">${outstandingInvoices.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
        <nav className="-mb-px flex space-x-2 px-4">
          {[
            { id: 'invoices', label: 'Invoices', count: invoices.length, icon: '📄', color: 'blue' },
            { id: 'expenses', label: 'Expenses', count: expenses.length, icon: '💸', color: 'red' },
            { id: 'reports', label: 'Financial Reports', count: 0, icon: '📊', color: 'green' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`py-3 px-4 rounded-t-lg font-medium text-sm transition-all duration-200 border-b-2 ${
                selectedTab === tab.id
                  ? tab.color === 'blue' ? 'bg-blue-500 text-white border-blue-500 shadow-lg' :
                    tab.color === 'red' ? 'bg-red-500 text-white border-red-500 shadow-lg' :
                    'bg-green-500 text-white border-green-500 shadow-lg'
                  : `border-transparent text-gray-600 hover:text-gray-800 ${
                    tab.color === 'blue' ? 'hover:bg-blue-100 hover:border-blue-300' :
                    tab.color === 'red' ? 'hover:bg-red-100 hover:border-red-300' :
                    'hover:bg-green-100 hover:border-green-300'
                  }`
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`py-0.5 px-2 rounded-full text-xs font-semibold ${
                    selectedTab === tab.id
                      ? 'bg-white bg-opacity-30 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Invoices Tab */}
      {selectedTab === 'invoices' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Customer Invoices</h3>
              <button 
                onClick={() => setShowInvoiceModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
              >
                ➕ Create Invoice
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Load ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{invoice.customerName}</div>
                          <div className="text-gray-500">{invoice.customerEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.loadId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-semibold text-green-600">${invoice.amount.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 hover:text-blue-800 px-3 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md border border-blue-300 hover:border-blue-400">
                            👁️ View
                          </button>
                          {invoice.status !== 'paid' && (
                            <button className="bg-green-100 hover:bg-green-200 text-green-700 hover:text-green-800 px-3 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md border border-green-300 hover:border-green-400">
                              📤 Send
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Expenses Tab */}
      {selectedTab === 'expenses' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Business Expenses</h3>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md">
                ➕ Add Expense
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(expense.category)}`}>
                          <span className="mr-1">{getCategoryIcon(expense.category)}</span>
                          {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {expense.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {expense.vehicleId || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-semibold text-red-600">${expense.amount.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 hover:text-blue-800 px-3 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md border border-blue-300 hover:border-blue-400">
                            ✏️ Edit
                          </button>
                          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-800 px-3 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md border border-gray-300 hover:border-gray-400">
                            📎 Receipt
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Financial Reports Tab */}
      {selectedTab === 'reports' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Reports</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Profit & Loss</h4>
                    <p className="text-sm text-gray-600">Monthly P&L statement</p>
                  </div>
                </div>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                  Generate Report
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Cash Flow</h4>
                    <p className="text-sm text-gray-600">Monthly cash flow analysis</p>
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Generate Report
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📋</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Tax Summary</h4>
                    <p className="text-sm text-gray-600">Quarterly tax preparation</p>
                  </div>
                </div>
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
