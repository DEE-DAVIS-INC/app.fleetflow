'use client';

import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { checkPermission, ACCESS_MESSAGES } from '../config/access';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Access Control Component
const AccessRestricted = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
      <div className="text-6xl mb-4">🔒</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{ACCESS_MESSAGES.analytics.title}</h1>
      <p className="text-gray-600 mb-4">
        {ACCESS_MESSAGES.analytics.message}
      </p>
      <p className="text-sm text-gray-500 mb-6">
        {ACCESS_MESSAGES.analytics.requirement}
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

interface AnalyticsData {
  revenue: number[];
  loads: number[];
  fuelCosts: number[];
  driverPerformance: { name: string; score: number; loads: number; onTime: number }[];
  vehicleUtilization: { vehicle: string; utilization: number; revenue: number }[];
  routeEfficiency: { route: string; profit: number; frequency: number }[];
  invoiceMetrics: {
    totalInvoiced: number;
    totalPaid: number;
    totalOutstanding: number;
    averagePaymentDays: number;
    overdueAmount: number;
    monthlyInvoicing: number[];
    paymentTrends: number[];
  };
  dispatchFeeSummary: {
    totalFees: number;
    averageFeePercentage: number;
    monthlyFees: number[];
    topCarriers: { name: string; totalFees: number; invoiceCount: number }[];
  };
}

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  
  // Check access permission using centralized system
  if (!checkPermission('hasAnalyticsAccess')) {
    return <AccessRestricted />;
  }
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'loads' | 'efficiency' | 'costs'>('revenue');

  // Mock analytics data
  const analyticsData: AnalyticsData = {
    revenue: [45000, 52000, 48000, 61000, 58000, 65000, 72000, 68000, 75000, 82000, 78000, 85000],
    loads: [45, 52, 48, 61, 58, 65, 72, 68, 75, 82, 78, 85],
    fuelCosts: [8500, 9200, 8800, 10500, 9800, 11200, 12000, 11500, 12800, 13200, 12900, 13500],
    driverPerformance: [
      { name: 'John Smith', score: 95, loads: 28, onTime: 96 },
      { name: 'Sarah Johnson', score: 92, loads: 25, onTime: 94 },
      { name: 'Mike Wilson', score: 88, loads: 22, onTime: 89 },
      { name: 'Lisa Brown', score: 91, loads: 26, onTime: 92 },
      { name: 'David Garcia', score: 87, loads: 20, onTime: 88 }
    ],
    vehicleUtilization: [
      { vehicle: 'TRK-101', utilization: 85, revenue: 15200 },
      { vehicle: 'TRK-205', utilization: 78, revenue: 12800 },
      { vehicle: 'TRK-150', utilization: 92, revenue: 18500 },
      { vehicle: 'TRK-087', utilization: 71, revenue: 11200 },
      { vehicle: 'TRK-234', utilization: 88, revenue: 16800 }
    ],
    routeEfficiency: [
      { route: 'Atlanta → Miami', profit: 2450, frequency: 12 },
      { route: 'Chicago → Houston', profit: 3200, frequency: 8 },
      { route: 'LA → Phoenix', profit: 1850, frequency: 15 },
      { route: 'Dallas → Denver', profit: 2800, frequency: 10 },
      { route: 'Seattle → Portland', profit: 1650, frequency: 18 }
    ],
    invoiceMetrics: {
      totalInvoiced: 125800,
      totalPaid: 98450,
      totalOutstanding: 27350,
      averagePaymentDays: 18.5,
      overdueAmount: 8200,
      monthlyInvoicing: [8200, 9500, 8800, 11200, 10800, 12500, 13200, 12800, 14500, 15200, 14800, 16200],
      paymentTrends: [7800, 9200, 8400, 10800, 10200, 11800, 12600, 12200, 13800, 14600, 14200, 15400]
    },
    dispatchFeeSummary: {
      totalFees: 125800,
      averageFeePercentage: 9.8,
      monthlyFees: [8200, 9500, 8800, 11200, 10800, 12500, 13200, 12800, 14500, 15200, 14800, 16200],
      topCarriers: [
        { name: 'Smith Trucking LLC', totalFees: 12450, invoiceCount: 15 },
        { name: 'Johnson Logistics', totalFees: 9800, invoiceCount: 12 },
        { name: 'Wilson Transport', totalFees: 8350, invoiceCount: 18 },
        { name: 'Brown Freight', totalFees: 7200, invoiceCount: 9 },
        { name: 'Garcia Express', totalFees: 6850, invoiceCount: 11 }
      ]
    }
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Revenue Chart Data
  const revenueChartData = {
    labels: months,
    datasets: [
      {
        label: 'Revenue ($)',
        data: analyticsData.revenue,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Fuel Costs ($)',
        data: analyticsData.fuelCosts,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      }
    ],
  };

  // Loads Chart Data
  const loadsChartData = {
    labels: months,
    datasets: [
      {
        label: 'Completed Loads',
        data: analyticsData.loads,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      }
    ],
  };

  // Vehicle Utilization Chart
  const utilizationChartData = {
    labels: analyticsData.vehicleUtilization.map(v => v.vehicle),
    datasets: [
      {
        data: analyticsData.vehicleUtilization.map(v => v.utilization),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
        ],
      }
    ],
  };

  // Invoice Analytics Charts
  const invoiceRevenueChartData = {
    labels: months,
    datasets: [
      {
        label: 'Invoiced Amount ($)',
        data: analyticsData.invoiceMetrics.monthlyInvoicing,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Payments Received ($)',
        data: analyticsData.invoiceMetrics.paymentTrends,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      }
    ],
  };

  const dispatchFeeChartData = {
    labels: months,
    datasets: [
      {
        label: 'Monthly Dispatch Fees ($)',
        data: analyticsData.dispatchFeeSummary.monthlyFees,
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 1,
      }
    ],
  };

  const paymentStatusChartData = {
    labels: ['Paid', 'Outstanding', 'Overdue'],
    datasets: [
      {
        data: [
          analyticsData.invoiceMetrics.totalPaid,
          analyticsData.invoiceMetrics.totalOutstanding - analyticsData.invoiceMetrics.overdueAmount,
          analyticsData.invoiceMetrics.overdueAmount
        ],
        backgroundColor: [
          '#10B981',  // Green for paid
          '#F59E0B',  // Yellow for outstanding
          '#EF4444',  // Red for overdue
        ],
      }
    ],
  };

  const calculateKPIs = () => {
    const totalRevenue = analyticsData.revenue.reduce((sum, val) => sum + val, 0);
    const totalFuelCosts = analyticsData.fuelCosts.reduce((sum, val) => sum + val, 0);
    const totalLoads = analyticsData.loads.reduce((sum, val) => sum + val, 0);
    const avgRevenuePerLoad = totalRevenue / totalLoads;
    const profitMargin = ((totalRevenue - totalFuelCosts) / totalRevenue) * 100;
    
    // Invoice KPIs
    const collectionRate = (analyticsData.invoiceMetrics.totalPaid / analyticsData.invoiceMetrics.totalInvoiced) * 100;
    const overduePercentage = (analyticsData.invoiceMetrics.overdueAmount / analyticsData.invoiceMetrics.totalOutstanding) * 100;

    return {
      totalRevenue,
      totalLoads,
      avgRevenuePerLoad,
      profitMargin,
      avgUtilization: analyticsData.vehicleUtilization.reduce((sum, v) => sum + v.utilization, 0) / analyticsData.vehicleUtilization.length,
      collectionRate,
      overduePercentage,
      totalDispatchFees: analyticsData.dispatchFeeSummary.totalFees,
      avgPaymentDays: analyticsData.invoiceMetrics.averagePaymentDays
    };
  };

  const kpis = calculateKPIs();

  return (
    <div style={{
      background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <div className="container mx-auto px-3 py-4">
      <div className="space-y-4">
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '20px',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📊</span>
            <div>
              <h1 style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                margin: 0,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}>Fleet Analytics Dashboard</h1>
              <p style={{
                fontSize: '0.9rem',
                margin: 0,
                opacity: 0.9
              }}>
                Comprehensive performance insights and business intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex space-x-2 mb-4">
          {(['week', 'month', 'quarter', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: selectedPeriod === period ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              className={`transition-all ${
                selectedPeriod === period
                  ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg transform scale-105'
                  : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md'
              }`}
            >
              📅 {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">💰</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="text-lg font-medium text-gray-900">${kpis.totalRevenue.toLocaleString()}</dd>
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
                  <span className="text-white text-sm">📦</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Loads</dt>
                  <dd className="text-lg font-medium text-gray-900">{kpis.totalLoads}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">📈</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg Revenue/Load</dt>
                  <dd className="text-lg font-medium text-gray-900">${kpis.avgRevenuePerLoad.toFixed(0)}</dd>
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
                  <span className="text-white text-sm">💵</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Profit Margin</dt>
                  <dd className="text-lg font-medium text-gray-900">{kpis.profitMargin.toFixed(1)}%</dd>
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
                  <span className="text-white text-sm">🚛</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Fleet Utilization</dt>
                  <dd className="text-lg font-medium text-gray-900">{kpis.avgUtilization.toFixed(1)}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Analytics KPI Cards */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="text-2xl mr-3">📄</span>
            Invoice & Payment Analytics
          </h3>
          <p className="text-sm text-gray-600 mt-1">Dispatch fee invoicing and payment collection metrics</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">💸</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Dispatch Fees</dt>
                    <dd className="text-lg font-medium text-gray-900">${kpis.totalDispatchFees.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">✅</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Collection Rate</dt>
                    <dd className="text-lg font-medium text-gray-900">{kpis.collectionRate.toFixed(1)}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">⏰</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg Payment Days</dt>
                    <dd className="text-lg font-medium text-gray-900">{kpis.avgPaymentDays.toFixed(1)} days</dd>
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
                    <span className="text-white text-sm">⚠️</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Overdue Amount</dt>
                    <dd className="text-lg font-medium text-gray-900">${analyticsData.invoiceMetrics.overdueAmount.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Costs Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue vs Fuel Costs</h3>
          <div className="h-64">
            <Line 
              data={revenueChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return '$' + value.toLocaleString();
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Loads Completed Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Loads Completed</h3>
          <div className="h-64">
            <Bar 
              data={loadsChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Vehicle Utilization */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Utilization</h3>
          <div className="h-64">
            <Doughnut 
              data={utilizationChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Driver Performance */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Driver Performance</h3>
          <div className="space-y-3">
            {analyticsData.driverPerformance.map((driver, index) => (
              <div key={driver.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{driver.name}</div>
                    <div className="text-sm text-gray-500">{driver.loads} loads • {driver.onTime}% on-time</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">{driver.score}/100</div>
                  <div className="text-xs text-gray-500">Performance Score</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invoice Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Revenue Trends */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Revenue vs Payments</h3>
          <div className="h-64">
            <Line 
              data={invoiceRevenueChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return '$' + value.toLocaleString();
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Payment Status Distribution */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Status Distribution</h3>
          <div className="h-64">
            <Doughnut 
              data={paymentStatusChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed;
                        return `${label}: $${value.toLocaleString()}`;
                      }
                    }
                  }
                },
              }}
            />
          </div>
        </div>

        {/* Monthly Dispatch Fees */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Dispatch Fees</h3>
          <div className="h-64">
            <Bar 
              data={dispatchFeeChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return '$' + value.toLocaleString();
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Top Carriers by Dispatch Fees */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Top Carriers by Dispatch Fees</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Carrier Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Dispatch Fees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Fee per Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee Contribution
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsData.dispatchFeeSummary.topCarriers.map((carrier) => (
                <tr key={carrier.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {carrier.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-semibold text-green-600">${carrier.totalFees.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {carrier.invoiceCount} invoices
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-medium">${(carrier.totalFees / carrier.invoiceCount).toFixed(0)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${(carrier.totalFees / analyticsData.dispatchFeeSummary.totalFees) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {((carrier.totalFees / analyticsData.dispatchFeeSummary.totalFees) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Route Efficiency Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Most Profitable Routes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Profit per Load
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frequency (Monthly)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Monthly Profit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Efficiency Rating
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsData.routeEfficiency.map((route) => (
                <tr key={route.route} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {route.route}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-semibold text-green-600">${route.profit.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {route.frequency} loads
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-semibold">${(route.profit * route.frequency).toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${Math.min((route.profit / 3500) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {Math.min(Math.round((route.profit / 3500) * 100), 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
    </div>
  );
}
