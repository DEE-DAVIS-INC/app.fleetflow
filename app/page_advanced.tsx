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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        {/* Animated Moving Elements */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
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
              value: `${animatedMetrics.utilization}%`, 
              change: '+5%', 
              gradient: 'from-purple-500 to-pink-500',
              icon: '📊',
              subtitle: 'capacity used'
            }
          ].map((metric, index) => (
            <div key={index} className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-r ${metric.gradient} rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-300`}></div>
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
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

        {/* Critical Alerts Command Panel */}
        {activeAlerts.length > 0 && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-orange-600/20 to-yellow-600/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/5 backdrop-blur-xl border border-red-500/20 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-500 rounded-xl blur-lg opacity-50 animate-pulse"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center text-2xl">
                      🚨
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Critical Alerts</h2>
                    <p className="text-gray-300">Immediate attention required</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-red-500/20 text-red-300 text-xs font-medium px-3 py-1 rounded-full border border-red-500/30">
                    {activeAlerts.filter(a => a.priority === 'high').length} High Priority
                  </span>
                  <span className="bg-yellow-500/20 text-yellow-300 text-xs font-medium px-3 py-1 rounded-full border border-yellow-500/30">
                    {activeAlerts.filter(a => a.priority === 'medium').length} Medium
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                {activeAlerts.map((alert) => (
                  <div key={alert.id} className={`relative overflow-hidden bg-gradient-to-r ${getAlertGradient(alert.type)}/10 border border-white/10 rounded-2xl p-4 hover:bg-white/5 transition-all duration-300`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 bg-gradient-to-r ${getAlertGradient(alert.type)} rounded-xl flex items-center justify-center text-xl shadow-lg`}>
                          {getAlertIcon(alert.type, alert.category)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{alert.message}</p>
                          <div className="flex items-center space-x-3 mt-1 text-sm text-gray-400">
                            <span>🕒 {new Date(alert.timestamp).toLocaleTimeString()}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              alert.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                              alert.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                              'bg-blue-500/20 text-blue-300'
                            }`}>
                              {alert.priority} priority
                            </span>
                            <span className="text-gray-500">• {alert.category}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
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
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-2xl">
                ⚡
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
                <p className="text-gray-300">Fleet command operations</p>
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
                  className="group relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${action.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                  <div className="relative">
                    <div className={`w-12 h-12 bg-gradient-to-r ${action.gradient} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {action.icon}
                    </div>
                    <div className="text-white font-semibold text-lg">{action.title}</div>
                    <div className="text-gray-400 text-sm mt-1">{action.subtitle}</div>
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
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-xl">
                  📊
                </div>
                <h3 className="text-xl font-semibold text-white">Today's Performance</h3>
              </div>
              <MetricsGrid metrics={fleetMetrics} />
            </div>
          </div>

          {/* Fleet Status */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-teal-600/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center text-xl">
                  🚛
                </div>
                <h3 className="text-xl font-semibold text-white">Fleet Status</h3>
              </div>
              <VehicleStatusChart />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-xl">
                  🕐
                </div>
                <h3 className="text-xl font-semibold text-white">Live Activity</h3>
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
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-xl">
                    🗺️
                  </div>
                  <h3 className="text-xl font-semibold text-white">Real-time Fleet Tracking</h3>
                </div>
                <span className="bg-green-500/20 text-green-300 text-sm font-medium px-3 py-1 rounded-full border border-green-500/30">
                  {fleetMetrics.activeVehicles} Active Vehicles
                </span>
              </div>
              <FleetMap />
            </div>
          </div>

          {/* Sticky Notes */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-xl">
                  📝
                </div>
                <h3 className="text-xl font-semibold text-white">Command Notes</h3>
              </div>
              <StickyNote section="dashboard" entityId="fleet-overview" entityName="Fleet Dashboard" />
            </div>
          </div>
        </div>

        {/* Performance Analytics */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl">
                🏆
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">Performance Analytics</h2>
                <p className="text-gray-300">Key operational metrics</p>
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
                  <div className="font-semibold text-white text-lg">{metric.title}</div>
                  <div className="text-sm text-green-400 mt-2 font-medium">{metric.change} from last week</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
