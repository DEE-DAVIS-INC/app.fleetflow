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
    efficiency: 0
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
    customerSatisfaction: 97.5
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
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;
      
      for (let i = 0; i <= steps; i++) {
        setTimeout(() => {
          const progress = i / steps;
          setAnimatedMetrics({
            revenue: Math.floor(todaysMetrics.totalRevenue * progress),
            loads: Math.floor(todaysMetrics.activeLoads * progress),
            drivers: Math.floor(todaysMetrics.availableDrivers * progress),
            efficiency: Math.floor(todaysMetrics.fuelEfficiency * progress * 10) / 10
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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-grid-white/5 bg-grid-16"></div>
      </div>

      <main className="relative z-10 p-8 space-y-8">
        {/* Command Center Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-2xl">
                    <FleetFlowLogo size="large" variant="light" />
                  </div>
                </div>
                <div className="text-white">
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent mb-3">
                    FleetFlow Command Center
                  </h1>
                  <p className="text-xl text-gray-300">Real-time fleet operations dashboard</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                    <span>🕒 {currentTime.toLocaleTimeString()}</span>
                    <span>📅 {currentTime.toLocaleDateString()}</span>
                    <span className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>System Operational</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-6xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                  ${animatedMetrics.revenue.toLocaleString()}
                </div>
                <div className="text-lg text-gray-300">Today's Revenue</div>
                <div className="text-sm text-green-400 mt-1 flex items-center justify-end">
                  <span className="mr-1">↗</span> +12.5% from yesterday
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Metrics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {[
            { 
              title: 'Active Loads', 
              value: animatedMetrics.loads, 
              change: '+3', 
              gradient: 'from-blue-500 to-cyan-500',
              icon: '🎯',
              subtitle: 'loads in transit'
            },
            { 
              title: 'Available Drivers', 
              value: animatedMetrics.drivers, 
              change: '-2', 
              gradient: 'from-green-500 to-emerald-500',
              icon: '👥',
              subtitle: 'ready for dispatch'
            },
            { 
              title: 'Fuel Efficiency', 
              value: animatedMetrics.efficiency, 
              change: '+0.3', 
              gradient: 'from-yellow-500 to-orange-500',
              icon: '⛽',
              subtitle: 'MPG average'
            },
            { 
              title: 'Fleet Utilization', 
              value: '89', 
              change: '+5%', 
              gradient: 'from-purple-500 to-pink-500',
              icon: '📊',
              subtitle: 'capacity used'
            }
          ].map((metric, index) => (
            <div key={index} className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-r ${metric.gradient} rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-300`}></div>
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${metric.gradient} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                    {metric.icon}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${metric.gradient}/20 text-white border border-white/20`}>
                    {metric.change}
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
                <div className="text-sm text-gray-400">{metric.title}</div>
                <div className="text-xs text-gray-500 mt-1">{metric.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
                <div className="text-sm text-green-300 mt-1">↑ 12.5% from yesterday</div>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-purple-400/20 rounded-full blur-lg"></div>
        </div>

        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">⚠️</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Priority Alerts</h2>
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-1 rounded-full">
                {activeAlerts.length} Active
              </span>
            </div>
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className={`flex items-center justify-between p-4 rounded-xl border-l-4 ${
                  alert.type === 'urgent' ? 'bg-red-50 border-red-500' :
                  alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-blue-50 border-blue-500'
                } hover:shadow-md transition-all duration-200`}>
                  <div className="flex items-center space-x-3">
                    <span className={`text-2xl ${
                      alert.type === 'urgent' ? 'text-red-600' :
                      alert.type === 'warning' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`}>
                      {alert.type === 'urgent' ? '🚨' : alert.type === 'warning' ? '⚠️' : 'ℹ️'}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{alert.message}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white/50 rounded-lg"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">⚡</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={handleDispatchNewLoad}
              className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-3xl mb-3">🎯</div>
              <div className="font-semibold">New Dispatch</div>
              <div className="text-blue-100 text-sm mt-1">Assign new loads</div>
            </button>
            <button
              onClick={handleAddDriver}
              className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-3xl mb-3">👥</div>
              <div className="font-semibold">Add Driver</div>
              <div className="text-green-100 text-sm mt-1">Manage drivers</div>
            </button>
            <button
              onClick={handleScheduleMaintenance}
              className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-3xl mb-3">🔧</div>
              <div className="font-semibold">Maintenance</div>
              <div className="text-orange-100 text-sm mt-1">Schedule service</div>
            </button>
            <button
              onClick={handleGenerateReport}
              className="group bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-3xl mb-3">📈</div>
              <div className="font-semibold">Reports</div>
              <div className="text-purple-100 text-sm mt-1">Generate insights</div>
            </button>
          </div>
        </div>

        {/* Fleet Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Metrics */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Today's Metrics</h3>
            </div>
            <MetricsGrid metrics={fleetMetrics} />
          </div>

          {/* Fleet Status */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🚛</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Fleet Status</h3>
            </div>
            <VehicleStatusChart />
          </div>

          {/* Recent Activity */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🕐</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <RecentActivity />
          </div>
        </div>

        {/* Fleet Map and Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Fleet Map */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🗺️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Live Fleet Map</h3>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                {fleetMetrics.activeVehicles} Active
              </span>
            </div>
            <FleetMap />
          </div>

          {/* Sticky Notes */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Quick Notes</h3>
            </div>
            <StickyNote section="dashboard" entityId="fleet-overview" entityName="Fleet Dashboard" />
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🏆</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Performance Summary</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <div className="text-3xl font-bold text-white">{todaysMetrics.onTimeDelivery}%</div>
              </div>
              <div className="font-semibold text-gray-900">On-Time Delivery</div>
              <div className="text-sm text-green-600 mt-2 font-medium">↑ 2.1% from last week</div>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-r from-green-500 to-green-600 w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <div className="text-3xl font-bold text-white">{todaysMetrics.fuelEfficiency}</div>
              </div>
              <div className="font-semibold text-gray-900">MPG Average</div>
              <div className="text-sm text-green-600 mt-2 font-medium">↑ 0.3 from last month</div>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <div className="text-3xl font-bold text-white">{todaysMetrics.activeLoads}</div>
              </div>
              <div className="font-semibold text-gray-900">Active Loads</div>
              <div className="text-sm text-blue-600 mt-2 font-medium">5 pending assignments</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
