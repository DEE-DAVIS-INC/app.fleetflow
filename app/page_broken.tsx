'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MetricsGrid from './components/MetricsGrid';
import VehicleStatusChart from './components/VehicleStatusChart';
import RecentActivity from './components/RecentActivity';
import StickyNote from './components/StickyNote';
import FleetMap from './components/FleetMap';
import FleetFlowLogo from './components/Logo';

export default function Dashboard() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animatedMetrics, setAnimatedMetrics] = useState({
    revenue: 0,
    loads: 0,
    drivers: 0,
    efficiency: 0,
    utilization: 0
  });
  
  const [activeAlerts, setActiveAlerts] = useState([
    {
      id: 1,
      type: 'urgent',
      message: 'Critical: Vehicle TRK-045 engine temperature warning',
      timestamp: new Date().toISOString(),
      priority: 'high',
      category: 'mechanical'
    },
    {
      id: 2,
      type: 'warning',
      message: 'Driver fatigue detected: John Smith approaching HOS limit',
      timestamp: new Date().toISOString(),
      priority: 'medium',
      category: 'compliance'
    },
    {
      id: 3,
      type: 'info',
      message: 'Route optimization saved 15% fuel on I-95 corridor',
      timestamp: new Date().toISOString(),
      priority: 'low',
      category: 'efficiency'
    },
    {
      id: 4,
      type: 'urgent',
      message: 'Weather alert: Severe storm affecting Route 7',
      timestamp: new Date().toISOString(),
      priority: 'high',
      category: 'weather'
    }
  ]);

  const [todaysMetrics] = useState({
    totalRevenue: 487520,
    activeLoads: 23,
    availableDrivers: 8,
    maintenanceAlerts: 3,
    fuelEfficiency: 6.8,
    onTimeDelivery: 94.2,
    profitMargin: 23.8,
    customerSatisfaction: 97.5,
    fleetUtilization: 89
  });

  const [fleetMetrics] = useState({
    totalVehicles: 45,
    activeVehicles: 38,
    maintenanceVehicles: 7,
    totalDrivers: 52,
    activeRoutes: 23,
    fuelEfficiency: 6.8,
    monthlyMileage: 125480,
    maintenanceCosts: 28750
  });

  // Clock and animations
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Animate metrics on load
    const animateMetrics = () => {
      const duration = 2500;
      const steps = 60;
      const stepDuration = duration / steps;
      
      for (let i = 0; i <= steps; i++) {
        setTimeout(() => {
          const progress = i / steps;
          const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
          setAnimatedMetrics({
            revenue: Math.floor(todaysMetrics.totalRevenue * easeProgress),
            loads: Math.floor(todaysMetrics.activeLoads * easeProgress),
            drivers: Math.floor(todaysMetrics.availableDrivers * easeProgress),
            efficiency: Math.floor(todaysMetrics.fuelEfficiency * easeProgress * 10) / 10,
            utilization: Math.floor(todaysMetrics.fleetUtilization * easeProgress)
          });
        }, i * stepDuration);
      }
    };

    animateMetrics();
    return () => clearInterval(timer);
  }, []);

  // Quick Action handlers
  const handleDispatchNewLoad = () => {
    router.push('/dispatch');
  };

  const handleAddDriver = () => {
    router.push('/drivers');
  };

  const handleScheduleMaintenance = () => {
    router.push('/maintenance');
  };

  const handleGenerateReport = () => {
    router.push('/reports');
  };

  // Alert dismissal handler
  const dismissAlert = (alertId: number) => {
    setActiveAlerts(alerts => alerts.filter(a => a.id !== alertId));
  };

  const getAlertIcon = (type: string, category: string) => {
    if (category === 'mechanical') return '🔧';
    if (category === 'compliance') return '⚖️';
    if (category === 'weather') return '🌩️';
    if (category === 'efficiency') return '⚡';
    return type === 'urgent' ? '🚨' : type === 'warning' ? '⚠️' : 'ℹ️';
  };

  const getAlertGradient = (type: string) => {
    switch (type) {
      case 'urgent': return 'from-red-500 via-red-600 to-red-700';
      case 'warning': return 'from-yellow-500 via-orange-500 to-red-500';
      case 'info': return 'from-blue-500 via-cyan-500 to-teal-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="container py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-gray-900 mb-2" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            FleetFlow Command Center
          </h1>
          <p className="text-gray-600">
            Real-time fleet operations dashboard
          </p>
        </div>
        <div className="flex gap-3">
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              ${animatedMetrics.revenue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Today's Revenue</div>
            <div className="text-xs text-green-600 mt-1">↗ +12.5% from yesterday</div>
          </div>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {[
          { 
            title: 'Active Loads', 
            value: animatedMetrics.loads, 
            change: '+3', 
            icon: '🎯',
            subtitle: 'loads in transit'
          },
          { 
            title: 'Available Drivers', 
            value: animatedMetrics.drivers, 
            change: '-2', 
            icon: '👥',
            subtitle: 'ready for dispatch'
          },
          { 
            title: 'Fuel Efficiency', 
            value: animatedMetrics.efficiency, 
            change: '+0.3', 
            icon: '⛽',
            subtitle: 'MPG average'
          },
          { 
            title: 'Fleet Utilization', 
            value: `${animatedMetrics.utilization}%`, 
            change: '+5%', 
            icon: '📊',
            subtitle: 'capacity used'
          }
        ].map((metric, index) => (
          <div key={index} className="metric-card">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '1.5rem' }}>{metric.icon}</span>
                <div className="metric-label">{metric.title}</div>
              </div>
              <span className="metric-change metric-up">
                {metric.change}
              </span>
            </div>
            <div className="metric-value">{metric.value}</div>
            <div className="text-gray-500" style={{ fontSize: '0.875rem' }}>{metric.subtitle}</div>
          </div>
        ))}
      </div>

        {/* Critical Alerts Command Panel */}
        {activeAlerts.length > 0 && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-orange-600/20 to-yellow-600/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/85 backdrop-blur-xl border border-red-200/40 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-500 rounded-xl blur-lg opacity-50 animate-pulse"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center text-2xl">
                      🚨
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Critical Alerts</h2>
                    <p className="text-gray-600">Immediate attention required</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-red-100 text-red-700 text-xs font-medium px-3 py-1 rounded-full border border-red-200">
                    {activeAlerts.filter(a => a.priority === 'high').length} High Priority
                  </span>
                  <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-3 py-1 rounded-full border border-yellow-200">
                    {activeAlerts.filter(a => a.priority === 'medium').length} Medium
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                {activeAlerts.map((alert) => (
                  <div key={alert.id} className={`relative overflow-hidden bg-white/60 border border-gray-200 rounded-2xl p-4 hover:bg-white/80 transition-all duration-300`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 bg-gradient-to-r ${getAlertGradient(alert.type)} rounded-xl flex items-center justify-center text-xl shadow-lg`}>
                          {getAlertIcon(alert.type, alert.category)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{alert.message}</p>
                          <div className="flex items-center space-x-3 mt-1 text-sm text-gray-600">
                            <span>🕒 {new Date(alert.timestamp).toLocaleTimeString()}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              alert.priority === 'high' ? 'bg-red-100 text-red-700' :
                              alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {alert.priority} priority
                            </span>
                            <span className="text-gray-500">• {alert.category}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Advanced Action Command Center */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 via-blue-600/20 to-purple-600/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-white/85 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-2xl">
                ⚡
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Quick Actions</h2>
                <p className="text-gray-600">Fleet command operations</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: 'Dispatch Load',
                  subtitle: 'Assign new delivery',
                  icon: '🎯',
                  gradient: 'from-blue-500 to-cyan-500',
                  action: handleDispatchNewLoad
                },
                {
                  title: 'Add Driver',
                  subtitle: 'Register new driver',
                  icon: '👥',
                  gradient: 'from-green-500 to-emerald-500',
                  action: handleAddDriver
                },
                {
                  title: 'Schedule Service',
                  subtitle: 'Book maintenance',
                  icon: '🔧',
                  gradient: 'from-orange-500 to-red-500',
                  action: handleScheduleMaintenance
                },
                {
                  title: 'Generate Report',
                  subtitle: 'Analytics dashboard',
                  icon: '📈',
                  gradient: 'from-purple-500 to-pink-500',
                  action: handleGenerateReport
                }
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="group relative overflow-hidden bg-white/60 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 hover:bg-white/80 transition-all duration-300 transform hover:scale-105"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <div className="relative">
                    <div className={`w-12 h-12 bg-gradient-to-r ${action.gradient} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {action.icon}
                    </div>
                    <div className="text-gray-800 font-semibold text-lg">{action.title}</div>
                    <div className="text-gray-600 text-sm mt-1">{action.subtitle}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Fleet Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Metrics */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/85 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-xl">
                  📊
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Today's Performance</h3>
              </div>
              <MetricsGrid metrics={fleetMetrics} />
            </div>
          </div>

          {/* Fleet Status */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-teal-600/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/85 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center text-xl">
                  🚛
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Fleet Status</h3>
              </div>
              <VehicleStatusChart />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/85 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-xl">
                  🕐
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Live Activity</h3>
              </div>
              <RecentActivity />
            </div>
          </div>
        </div>

        {/* Fleet Map and Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Fleet Map */}
          <div className="lg:col-span-2 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-green-600/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/85 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-xl">
                    🗺️
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Real-time Fleet Tracking</h3>
                </div>
                <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full border border-green-200">
                  {fleetMetrics.activeVehicles} Active Vehicles
                </span>
              </div>
              <FleetMap />
            </div>
          </div>

          {/* Sticky Notes */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/85 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-xl">
                  📝
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Command Notes</h3>
              </div>
              <StickyNote section="dashboard" entityId="fleet-overview" entityName="Fleet Dashboard" />
            </div>
          </div>
        </div>

        {/* Performance Analytics */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-white/85 backdrop-blur-xl border border-white/30 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl">
                🏆
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">Performance Analytics</h2>
                <p className="text-gray-600">Key operational metrics</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'On-Time Delivery',
                  value: `${todaysMetrics.onTimeDelivery}%`,
                  change: '+2.1%',
                  gradient: 'from-blue-500 to-blue-600',
                  icon: '🎯'
                },
                {
                  title: 'Customer Satisfaction',
                  value: `${todaysMetrics.customerSatisfaction}%`,
                  change: '+1.2%',
                  gradient: 'from-green-500 to-green-600',
                  icon: '😊'
                },
                {
                  title: 'Profit Margin',
                  value: `${todaysMetrics.profitMargin}%`,
                  change: '+3.4%',
                  gradient: 'from-purple-500 to-purple-600',
                  icon: '💰'
                }
              ].map((metric, index) => (
                <div key={index} className="text-center group">
                  <div className={`bg-gradient-to-r ${metric.gradient} w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300`}>
                    <div className="text-center">
                      <div className="text-2xl mb-1">{metric.icon}</div>
                      <div className="text-2xl font-bold text-white">{metric.value}</div>
                    </div>
                  </div>
                  <div className="font-semibold text-gray-800 text-lg">{metric.title}</div>
                  <div className="text-sm text-green-600 mt-2 font-medium">{metric.change} from last week</div>
                </div>
              ))}
            </div>
          </div>
      {/* Critical Alerts */}
      {activeAlerts.length > 0 && (
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <span style={{ fontSize: '1.5rem' }}>🚨</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Critical Alerts</h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-red-100 text-red-700 border border-red-200">
                {activeAlerts.filter(a => a.priority === 'high').length} High Priority
              </span>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
                {activeAlerts.filter(a => a.priority === 'medium').length} Medium
              </span>
            </div>
          </div>
          <div className="space-y-3">
            {activeAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span style={{ fontSize: '1.2rem' }}>{getAlertIcon(alert.type, alert.category)}</span>
                  <div>
                    <p className="font-medium text-gray-800">{alert.message}</p>
                    <div className="flex items-center space-x-3 mt-1 text-sm text-gray-600">
                      <span>🕒 {new Date(alert.timestamp).toLocaleTimeString()}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        alert.priority === 'high' ? 'bg-red-100 text-red-700' :
                        alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {alert.priority} priority
                      </span>
                      <span className="text-gray-500">• {alert.category}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span style={{ fontSize: '1.5rem' }}>⚡</span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Quick Actions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Dispatch Load',
              subtitle: 'Assign new delivery',
              icon: '🎯',
              action: handleDispatchNewLoad
            },
            {
              title: 'Add Driver',
              subtitle: 'Register new driver',
              icon: '👥',
              action: handleAddDriver
            },
            {
              title: 'Schedule Service',
              subtitle: 'Book maintenance',
              icon: '🔧',
              action: handleScheduleMaintenance
            },
            {
              title: 'Generate Report',
              subtitle: 'Analytics dashboard',
              icon: '📈',
              action: handleGenerateReport
            }
          ].map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <span style={{ fontSize: '1.5rem' }}>{action.icon}</span>
                <div style={{ fontWeight: '600' }}>{action.title}</div>
              </div>
              <div className="text-gray-600 text-sm">{action.subtitle}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Fleet Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Today's Performance */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <span style={{ fontSize: '1.2rem' }}>📊</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Today's Performance</h3>
          </div>
          <MetricsGrid metrics={fleetMetrics} />
        </div>

        {/* Fleet Status */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <span style={{ fontSize: '1.2rem' }}>🚛</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Fleet Status</h3>
          </div>
          <VehicleStatusChart />
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <span style={{ fontSize: '1.2rem' }}>🕐</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Live Activity</h3>
          </div>
          <RecentActivity />
        </div>
      </div>

      {/* Fleet Map and Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Fleet Map */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span style={{ fontSize: '1.2rem' }}>🗺️</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Real-time Fleet Tracking</h3>
            </div>
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
              {fleetMetrics.activeVehicles} Active Vehicles
            </span>
          </div>
          <FleetMap />
        </div>

        {/* Command Notes */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <span style={{ fontSize: '1.2rem' }}>📝</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Command Notes</h3>
          </div>
          <StickyNote section="dashboard" entityId="fleet-overview" entityName="Fleet Dashboard" />
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <span style={{ fontSize: '1.5rem' }}>🏆</span>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Performance Analytics</h3>
            <p className="text-gray-600 text-sm">Key operational metrics</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'On-Time Delivery',
              value: `${todaysMetrics.onTimeDelivery}%`,
              change: '+2.1%',
              icon: '🎯'
            },
            {
              title: 'Customer Satisfaction',
              value: `${todaysMetrics.customerSatisfaction}%`,
              change: '+1.2%',
              icon: '😊'
            },
            {
              title: 'Profit Margin',
              value: `${todaysMetrics.profitMargin}%`,
              change: '+3.4%',
              icon: '💰'
            }
          ].map((metric, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-2">{metric.icon}</div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{metric.value}</div>
              <div className="font-semibold text-gray-700 mb-2">{metric.title}</div>
              <div className="text-sm text-green-600 font-medium">{metric.change} from last week</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
