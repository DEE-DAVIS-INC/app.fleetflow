'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [selectedLoad, setSelectedLoad] = useState<string>('');
  const [showLoadDetails, setShowLoadDetails] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock loads data
  const loads = [
    {
      id: 'FL-001-ATL-MIA',
      status: 'active',
      origin: 'Atlanta, GA',
      destination: 'Miami, FL',
      driver: 'John Smith',
      truck: 'TRK-045',
      revenue: '$2,850',
      distance: '647 mi',
      eta: '14:30 EST',
      progress: 65,
      commodity: 'Electronics',
      weight: '42,000 lbs',
      priority: 'high',
      broker: {
        company: 'Elite Freight Solutions',
        contact: 'Michael Rodriguez',
        phone: '(555) 234-5678',
        email: 'mrodriguez@elitefreight.com',
        mcNumber: 'MC-789456',
        rating: 4.8,
        paymentTerms: 'Net 30',
        creditRating: 'A+',
      },
    },
    {
      id: 'FL-002-CHI-HOU',
      status: 'pending',
      origin: 'Chicago, IL',
      destination: 'Houston, TX',
      driver: 'Sarah Johnson',
      truck: 'TRK-023',
      revenue: '$3,200',
      distance: '1,082 mi',
      eta: '16:45 CST',
      progress: 0,
      commodity: 'Automotive Parts',
      weight: '45,500 lbs',
      priority: 'medium',
      broker: {
        company: 'Swift Logistics Group',
        contact: 'Jennifer Martinez',
        phone: '(555) 567-8901',
        email: 'jmartinez@swiftlogistics.com',
        mcNumber: 'MC-345789',
        rating: 4.5,
        paymentTerms: 'Net 45',
        creditRating: 'A',
      },
    },
    {
      id: 'FL-003-LAX-SEA',
      status: 'delivered',
      origin: 'Los Angeles, CA',
      destination: 'Seattle, WA',
      driver: 'Mike Davis',
      truck: 'TRK-067',
      revenue: '$2,950',
      distance: '1,135 mi',
      eta: 'Delivered',
      progress: 100,
      commodity: 'Consumer Goods',
      weight: '38,200 lbs',
      priority: 'low',
      broker: {
        company: 'Pacific Coast Freight',
        contact: 'David Thompson',
        phone: '(555) 890-1234',
        email: 'dthompson@pacificfreight.com',
        mcNumber: 'MC-567890',
        rating: 4.9,
        paymentTerms: 'Net 15',
        creditRating: 'A+',
      },
    },
    {
      id: 'FL-004-NYC-BOS',
      status: 'active',
      origin: 'New York, NY',
      destination: 'Boston, MA',
      driver: 'Lisa Chen',
      truck: 'TRK-089',
      revenue: '$1,450',
      distance: '215 mi',
      eta: '11:20 EST',
      progress: 85,
      commodity: 'Food Products',
      weight: '28,500 lbs',
      priority: 'high',
      broker: {
        company: 'Northeast Transport Partners',
        contact: 'Sarah Wilson',
        phone: '(555) 345-6789',
        email: 'swilson@netransport.com',
        mcNumber: 'MC-123456',
        rating: 4.6,
        paymentTerms: 'Net 30',
        creditRating: 'A-',
      },
    },
  ];

  // Real-time alerts state management
  const alerts = [
    {
      id: 1,
      type: 'critical',
      title: 'Load SHP-003 Delayed',
      message: 'Mechanical breakdown on I-95. ETA pushed by 4 hours',
      timestamp: '3:45 PM',
      actionRequired: true,
      loadId: 'SHP-003',
    },
    {
      id: 2,
      type: 'warning',
      title: 'Driver Hours Alert',
      message: 'Driver Mike Wilson approaching HOS limit in 2 hours',
      timestamp: '3:40 PM',
      actionRequired: true,
      driverId: 'DRV-789',
    },
    {
      id: 3,
      type: 'info',
      title: 'Load Delivered',
      message: 'SHP-002 successfully delivered to Atlanta, GA',
      timestamp: '3:35 PM',
      actionRequired: false,
      loadId: 'SHP-002',
    },
  ];

  const quickLinks = [
    {
      href: '/dispatch',
      bg: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      emoji: '🚛',
      title: 'Dispatch',
      color: 'white',
    },
    {
      href: '/drivers',
      bg: 'linear-gradient(135deg, #f7c52d, #f4a832)',
      emoji: '👨‍💼',
      title: 'Drivers',
      color: '#2d3748',
    },
    {
      href: '/drivers/dashboard',
      bg: 'linear-gradient(135deg, #1e40af, #1e3a8a)',
      emoji: '🚗',
      title: 'Driver Management Portal',
      color: 'white',
    },
    {
      href: '/vehicles',
      bg: 'linear-gradient(135deg, #14b8a6, #0d9488)',
      emoji: '🚚',
      title: 'Fleet',
      color: 'white',
    },
    {
      href: '/broker',
      bg: 'linear-gradient(135deg, #f97316, #ea580c)',
      emoji: '🏢',
      title: 'Broker',
      color: 'white',
    },
    {
      href: '/routes',
      bg: 'linear-gradient(135deg, #14b8a6, #0d9488)',
      emoji: '🗺️',
      title: 'Routes',
      color: 'white',
    },
    {
      href: '/analytics',
      bg: 'linear-gradient(135deg, #6366f1, #4f46e5)',
      emoji: '📊',
      title: 'Analytics',
      color: 'white',
    },
    {
      href: '/accounting',
      bg: 'linear-gradient(135deg, #059669, #047857)',
      emoji: '💰',
      title: 'Finance',
      color: 'white',
    },
    {
      href: '/notes',
      bg: 'linear-gradient(135deg, #fef3c7, #fbbf24)',
      emoji: '🔔',
      title: 'Alerts',
      color: '#2d3748',
    },
    {
      href: '/quoting',
      bg: 'linear-gradient(135deg, #10b981, #059669)',
      emoji: '📋',
      title: 'Quotes',
      color: 'white',
    },
    {
      href: '/compliance',
      bg: 'linear-gradient(135deg, #dc2626, #b91c1c)',
      emoji: '✅',
      title: 'Safety',
      color: 'white',
    },
    {
      href: '/shippers',
      bg: 'linear-gradient(135deg, #667eea, #764ba2)',
      emoji: '🏭',
      title: 'Shippers',
      color: 'white',
    },
    {
      href: '/scheduling',
      bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      emoji: '📅',
      title: 'Schedule',
      color: 'white',
    },
    {
      href: '/ai',
      bg: 'linear-gradient(135deg, #ec4899, #db2777)',
      emoji: '🤖',
      title: 'AI Hub',
      color: 'white',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLoadClick = (loadId: string) => {
    setSelectedLoad(loadId);
    setShowLoadDetails(true);
  };

  const handleAcceptLoad = (loadId: string) => {
    alert(`Load ${loadId} accepted! Assigning to next available driver.`);
    setShowLoadDetails(false);
  };

  const handleBidLoad = (loadId: string) => {
    alert(`Bid submitted for load ${loadId}! Waiting for broker response.`);
    setShowLoadDetails(false);
  };

  const selectedLoadData = loads.find((load) => load.id === selectedLoad);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'delivered':
        return '#6366f1';
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <div
      style={{
        padding: '40px',
        paddingTop: '100px',
        background: `
        linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%),
        radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(168, 85, 247, 0.04) 0%, transparent 50%)
      `,
        backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
        backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
        minHeight: '100vh',
        color: '#ffffff',
        position: 'relative',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
      }}
    >
      {/* Professional Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#ffffff',
                margin: '0 0 10px 0',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              FleetFlow Command Center℠
            </h1>
            <p
              style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
              }}
            >
              Real-time Fleet Operations Dashboard •{' '}
              {currentTime.toLocaleString()}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link href='/dispatch' style={{ textDecoration: 'none' }}>
              <button
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.3s ease',
                }}
              >
                📞 Dispatch Central
              </button>
            </Link>
            <Link href='/tracking' style={{ textDecoration: 'none' }}>
              <button
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.3s ease',
                }}
              >
                📍 Live Tracking
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Executive KPIs - Back to original glassmorphism style */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        {/* Active Loads */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '25px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>🚛</div>
          <div
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#3b82f6',
              marginBottom: '5px',
            }}
          >
            247
          </div>
          <div
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '5px',
            }}
          >
            Active Loads
          </div>
          <div
            style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}
          >
            +12% from last week
          </div>
        </div>

        {/* Fleet Utilization */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '25px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>📊</div>
          <div
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#8b5cf6',
              marginBottom: '5px',
            }}
          >
            89%
          </div>
          <div
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '5px',
            }}
          >
            Fleet Utilization
          </div>
          <div
            style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}
          >
            +5% from last month
          </div>
        </div>

        {/* Revenue */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '25px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>💰</div>
          <div
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#10b981',
              marginBottom: '5px',
            }}
          >
            $2.4M
          </div>
          <div
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '5px',
            }}
          >
            MTD Revenue
          </div>
          <div
            style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}
          >
            +8% from last month
          </div>
        </div>

        {/* On-Time Delivery */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '25px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>⏰</div>
          <div
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#f59e0b',
              marginBottom: '5px',
            }}
          >
            96.2%
          </div>
          <div
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '5px',
            }}
          >
            On-Time Performance
          </div>
          <div
            style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}
          >
            +2.1% from last month
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '30px',
        }}
      >
        {quickLinks.map((link, index) => (
          <Link key={index} href={link.href} style={{ textDecoration: 'none' }}>
            <div
              style={{
                background: link.bg,
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow =
                  '0 8px 25px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                {link.emoji}
              </div>
              <div
                style={{
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: link.color,
                }}
              >
                {link.title}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Go With the Flow - Automated Load Matching */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '25px',
          marginBottom: '30px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
          }}
        >
          <h3
            style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: '600',
              margin: 0,
            }}
          >
            ⚡ Go With the Flow - Automated Load Matching
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              🤖 Trigger Auto-Match
            </button>
          </div>
        </div>

        {/* System Status Metrics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '15px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              background: 'rgba(34, 197, 94, 0.2)',
              border: '2px solid rgba(34, 197, 94, 0.5)',
              borderRadius: '12px',
              padding: '18px',
              textAlign: 'center' as const,
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.15)',
            }}
          >
            <div
              style={{ color: '#22c55e', fontSize: '28px', fontWeight: '700' }}
            >
              94%
            </div>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '12px',
                fontWeight: '600',
              }}
            >
              Auto-Match Success Rate
            </div>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '10px',
                marginTop: '4px',
              }}
            >
              847 Total Automated Loads
            </div>
          </div>
          <div
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              border: '2px solid rgba(59, 130, 246, 0.5)',
              borderRadius: '12px',
              padding: '18px',
              textAlign: 'center' as const,
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)',
            }}
          >
            <div
              style={{ color: '#3b82f6', fontSize: '28px', fontWeight: '700' }}
            >
              2.3m
            </div>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '12px',
                fontWeight: '600',
              }}
            >
              Avg Driver Response Time
            </div>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '10px',
                marginTop: '4px',
              }}
            >
              99.8% System Uptime
            </div>
          </div>
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.2)',
              border: '2px solid rgba(245, 158, 11, 0.5)',
              borderRadius: '12px',
              padding: '18px',
              textAlign: 'center' as const,
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)',
            }}
          >
            <div
              style={{ color: '#f59e0b', fontSize: '28px', fontWeight: '700' }}
            >
              12
            </div>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '12px',
                fontWeight: '600',
              }}
            >
              Active BOL Workflows
            </div>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '10px',
                marginTop: '4px',
              }}
            >
              Real-time Processing
            </div>
          </div>
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.2)',
              border: '2px solid rgba(16, 185, 129, 0.5)',
              borderRadius: '12px',
              padding: '18px',
              textAlign: 'center' as const,
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
            }}
          >
            <div
              style={{ color: '#10b981', fontSize: '28px', fontWeight: '700' }}
            >
              4
            </div>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '12px',
                fontWeight: '600',
              }}
            >
              Online Drivers
            </div>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '10px',
                marginTop: '4px',
              }}
            >
              24 Total Active Drivers
            </div>
          </div>
        </div>

        {/* Online Drivers and Urgent Loads */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
          }}
        >
          {/* Available Drivers */}
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.2)',
              border: '2px solid rgba(16, 185, 129, 0.5)',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
            }}
          >
            <h4
              style={{
                color: '#10b981',
                fontSize: '16px',
                fontWeight: '700',
                margin: '0 0 12px 0',
                textShadow: '0 2px 4px rgba(16, 185, 129, 0.8)',
              }}
            >
              🟢 Available Drivers
            </h4>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
            >
              {[
                {
                  name: 'John Rodriguez',
                  location: 'Dallas, TX',
                  distance: '12 mi',
                  equipment: 'Dry Van',
                  status: 'Available',
                },
                {
                  name: 'Maria Santos',
                  location: 'Houston, TX',
                  distance: '45 mi',
                  equipment: 'Refrigerated',
                  status: 'Available',
                },
                {
                  name: 'David Thompson',
                  location: 'Austin, TX',
                  distance: '78 mi',
                  equipment: 'Flatbed',
                  status: 'Available',
                },
                {
                  name: 'Carlos Martinez',
                  location: 'San Antonio, TX',
                  distance: '165 mi',
                  equipment: 'Dry Van',
                  status: 'Available',
                },
              ].map((driver, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '8px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: '#ffffff',
                          fontSize: '13px',
                          fontWeight: '600',
                        }}
                      >
                        {driver.name}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '11px',
                        }}
                      >
                        {driver.location} • {driver.distance}
                      </div>
                    </div>
                    <div
                      style={{
                        background: 'rgba(16, 185, 129, 0.3)',
                        color: '#10b981',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '9px',
                        fontWeight: '600',
                      }}
                    >
                      {driver.status}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '11px',
                      }}
                    >
                      🚚 {driver.equipment}
                    </div>
                    <button
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      ⚡ Instant Match
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Urgent Loads */}
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '2px solid rgba(239, 68, 68, 0.5)',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)',
            }}
          >
            <h4
              style={{
                color: '#ef4444',
                fontSize: '16px',
                fontWeight: '700',
                margin: '0 0 12px 0',
                textShadow: '0 2px 4px rgba(239, 68, 68, 0.8)',
              }}
            >
              🚨 Urgent Loads
            </h4>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
            >
              {[
                {
                  id: 'FL-001-URGENT',
                  route: 'Dallas → Miami',
                  priority: 'CRITICAL',
                  revenue: '$3,850',
                  equipment: 'Dry Van',
                  pickup: 'Today 2:00 PM',
                },
                {
                  id: 'FL-002-HOT',
                  route: 'Houston → Atlanta',
                  priority: 'HIGH',
                  revenue: '$2,750',
                  equipment: 'Refrigerated',
                  pickup: 'Today 4:30 PM',
                },
                {
                  id: 'FL-003-RUSH',
                  route: 'Austin → Denver',
                  priority: 'HIGH',
                  revenue: '$2,950',
                  equipment: 'Flatbed',
                  pickup: 'Tomorrow 6:00 AM',
                },
              ].map((load, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '8px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: '#ffffff',
                          fontSize: '13px',
                          fontWeight: '600',
                        }}
                      >
                        {load.id}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '11px',
                        }}
                      >
                        {load.route}
                      </div>
                    </div>
                    <div
                      style={{
                        background:
                          load.priority === 'CRITICAL'
                            ? 'rgba(239, 68, 68, 0.3)'
                            : 'rgba(245, 158, 11, 0.3)',
                        color:
                          load.priority === 'CRITICAL' ? '#ef4444' : '#f59e0b',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '9px',
                        fontWeight: '600',
                      }}
                    >
                      {load.priority}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '6px',
                    }}
                  >
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '11px',
                      }}
                    >
                      🚚 {load.equipment} • {load.revenue}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '10px',
                      }}
                    >
                      📅 {load.pickup}
                    </div>
                    <button
                      style={{
                        background:
                          load.priority === 'CRITICAL'
                            ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                            : 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      ⚡ Auto Match
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-Time Automated Activity Feed */}
        <div style={{ marginTop: '20px' }}>
          <h4
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '14px',
              fontWeight: '600',
              margin: '0 0 10px 0',
            }}
          >
            📊 Live Automation Activity
          </h4>
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              padding: '15px',
              maxHeight: '120px',
              overflowY: 'auto' as const,
            }}
          >
            {[
              {
                time: '2:47 PM',
                action: '🤖 FL-001-URGENT auto-matched to John Rodriguez',
                status: 'success',
              },
              {
                time: '2:45 PM',
                action: '📋 BOL workflow initiated for FL-002-HOT',
                status: 'info',
              },
              {
                time: '2:42 PM',
                action:
                  '⚡ Maria Santos accepted FL-004-EXPRESS (2.1m response)',
                status: 'success',
              },
              {
                time: '2:38 PM',
                action: '🔄 Auto-match triggered for 3 new urgent loads',
                status: 'info',
              },
              {
                time: '2:35 PM',
                action: '📞 Driver notification sent to Carlos Martinez',
                status: 'warning',
              },
            ].map((activity, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '6px 0',
                  borderBottom:
                    index < 4 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '10px',
                      fontWeight: '600',
                      minWidth: '45px',
                    }}
                  >
                    {activity.time}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '11px',
                    }}
                  >
                    {activity.action}
                  </div>
                </div>
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background:
                      activity.status === 'success'
                        ? '#10b981'
                        : activity.status === 'warning'
                          ? '#f59e0b'
                          : '#3b82f6',
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-Time Monitoring & Alerts */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '25px',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#ffffff',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            🚨 Real-time Alerts & Monitoring
          </h2>
          <Link href='/notes' style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                color: '#2d3748',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)',
              }}
            >
              View All Alerts
            </button>
          </Link>
        </div>

        {/* Alert Summary Counters */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '15px',
            marginBottom: '25px',
          }}
        >
          {/* Critical Alerts */}
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              borderRadius: '12px',
              padding: '15px',
              textAlign: 'center',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            <div
              style={{
                fontSize: '24px',
                color: '#ef4444',
                fontWeight: '700',
                marginBottom: '5px',
              }}
            >
              {alerts.filter((alert) => alert.type === 'critical').length}
            </div>
            <div
              style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Critical
            </div>
          </div>

          {/* Warning Alerts */}
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.2)',
              borderRadius: '12px',
              padding: '15px',
              textAlign: 'center',
              border: '1px solid rgba(245, 158, 11, 0.3)',
            }}
          >
            <div
              style={{
                fontSize: '24px',
                color: '#f59e0b',
                fontWeight: '700',
                marginBottom: '5px',
              }}
            >
              {alerts.filter((alert) => alert.type === 'warning').length}
            </div>
            <div
              style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Warning
            </div>
          </div>

          {/* Info Alerts */}
          <div
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              borderRadius: '12px',
              padding: '15px',
              textAlign: 'center',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}
          >
            <div
              style={{
                fontSize: '24px',
                color: '#3b82f6',
                fontWeight: '700',
                marginBottom: '5px',
              }}
            >
              {alerts.filter((alert) => alert.type === 'info').length}
            </div>
            <div
              style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Info
            </div>
          </div>

          {/* Total Alerts */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '15px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div
              style={{
                fontSize: '24px',
                color: '#ffffff',
                fontWeight: '700',
                marginBottom: '5px',
              }}
            >
              {alerts.length}
            </div>
            <div
              style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Total
            </div>
          </div>

          {/* Notifications Count */}
          <div
            style={{
              background: 'rgba(168, 85, 247, 0.2)',
              borderRadius: '12px',
              padding: '15px',
              textAlign: 'center',
              border: '1px solid rgba(168, 85, 247, 0.3)',
            }}
          >
            <div
              style={{
                fontSize: '24px',
                color: '#a855f7',
                fontWeight: '700',
                marginBottom: '5px',
              }}
            >
              15
            </div>
            <div
              style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Notifications
            </div>
          </div>
        </div>

        {/* Recent Alerts Preview */}
        <div style={{ display: 'grid', gap: '15px' }}>
          {alerts.map((alert, index) => (
            <div
              key={index}
              style={{
                background:
                  alert.type === 'critical'
                    ? 'rgba(239, 68, 68, 0.2)'
                    : alert.type === 'warning'
                      ? 'rgba(245, 158, 11, 0.2)'
                      : 'rgba(59, 130, 246, 0.2)',
                borderRadius: '12px',
                padding: '20px',
                border: `1px solid ${
                  alert.type === 'critical'
                    ? '#ef4444'
                    : alert.type === 'warning'
                      ? '#f59e0b'
                      : '#3b82f6'
                }`,
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                }}
              >
                {alert.type === 'critical'
                  ? '🚨'
                  : alert.type === 'warning'
                    ? '⚠️'
                    : 'ℹ️'}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#ffffff',
                    marginBottom: '5px',
                  }}
                >
                  {alert.title}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '5px',
                  }}
                >
                  {alert.message}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  {alert.timestamp}
                </div>
              </div>
              {alert.actionRequired && (
                <button
                  style={{
                    background:
                      alert.type === 'critical'
                        ? '#ef4444'
                        : alert.type === 'warning'
                          ? '#f59e0b'
                          : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Action Required
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '25px',
            padding: '20px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: '10px',
            }}
          >
            Stay Ahead of Issues
          </h3>
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '15px',
            }}
          >
            Monitor your fleet in real-time and take proactive action on
            critical alerts
          </p>
          <Link href='/notes' style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              }}
            >
              View Alert Center →
            </button>
          </Link>
        </div>
      </div>

      {/* Executive Load Management */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '25px',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#ffffff',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            🚛 Executive Load Management
          </h2>
          <Link href='/tracking' style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              }}
            >
              View Full Tracking
            </button>
          </Link>
        </div>

        {/* Executive Load Management KPIs - Exact match to tracking page status distribution */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '15px',
            marginBottom: '25px',
          }}
        >
          {/* Available Loads */}
          <div
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📋</div>
            <div
              style={{
                fontSize: '24px',
                color: '#3b82f6',
                fontWeight: '700',
                marginBottom: '5px',
              }}
            >
              {loads.filter((load) => load.status === 'pending').length}
            </div>
            <div
              style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Available
            </div>
          </div>

          {/* In Transit */}
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.2)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🚛</div>
            <div
              style={{
                fontSize: '24px',
                color: '#10b981',
                fontWeight: '700',
                marginBottom: '5px',
              }}
            >
              {loads.filter((load) => load.status === 'active').length}
            </div>
            <div
              style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}
            >
              In Transit
            </div>
          </div>

          {/* Loading */}
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.2)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              border: '1px solid rgba(245, 158, 11, 0.3)',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>⏳</div>
            <div
              style={{
                fontSize: '24px',
                color: '#f59e0b',
                fontWeight: '700',
                marginBottom: '5px',
              }}
            >
              0
            </div>
            <div
              style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Loading
            </div>
          </div>

          {/* Delivered */}
          <div
            style={{
              background: 'rgba(99, 102, 241, 0.2)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              border: '1px solid rgba(99, 102, 241, 0.3)',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>✅</div>
            <div
              style={{
                fontSize: '24px',
                color: '#6366f1',
                fontWeight: '700',
                marginBottom: '5px',
              }}
            >
              {loads.filter((load) => load.status === 'delivered').length}
            </div>
            <div
              style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Delivered
            </div>
          </div>
        </div>

        {/* Live Load Board - Enhanced with functionality */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '25px',
            marginTop: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            {/* Load Board Header */}
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#ffffff',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              📊 Live Load Board
            </h3>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}
              >
                Last updated: {currentTime.toLocaleTimeString()}
              </span>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10b981',
                  animation: 'pulse 2s infinite',
                }}
              />
            </div>
          </div>

          {/* Load Board Rows */}
          <div style={{ display: 'grid', gap: '15px' }}>
            {loads.map((load, index) => (
              <div
                key={index}
                onClick={() => handleLoadClick(load.id)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        marginBottom: '10px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#ffffff',
                        }}
                      >
                        {load.id}
                      </span>
                      <span
                        style={{
                          background: getStatusColor(load.status),
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                        }}
                      >
                        {load.status}
                      </span>
                      <span
                        style={{
                          background: getPriorityColor(load.priority),
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                        }}
                      >
                        {load.priority}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '15px',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.6)',
                            marginBottom: '4px',
                          }}
                        >
                          Route
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            color: '#ffffff',
                            fontWeight: '600',
                          }}
                        >
                          {load.origin} → {load.destination}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.6)',
                            marginBottom: '4px',
                          }}
                        >
                          Driver
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            color: '#ffffff',
                            fontWeight: '600',
                          }}
                        >
                          {load.driver}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.6)',
                            marginBottom: '4px',
                          }}
                        >
                          Revenue
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            color: '#10b981',
                            fontWeight: '700',
                          }}
                        >
                          {load.revenue}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.6)',
                            marginBottom: '4px',
                          }}
                        >
                          ETA
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            color: '#ffffff',
                            fontWeight: '600',
                          }}
                        >
                          {load.eta}
                        </div>
                      </div>
                    </div>

                    {load.status === 'active' && (
                      <div style={{ marginTop: '15px' }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '5px',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '12px',
                              color: 'rgba(255, 255, 255, 0.6)',
                            }}
                          >
                            Progress
                          </span>
                          <span
                            style={{
                              fontSize: '12px',
                              color: '#ffffff',
                              fontWeight: '600',
                            }}
                          >
                            {load.progress}%
                          </span>
                        </div>
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '10px',
                            height: '6px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              background:
                                'linear-gradient(90deg, #10b981, #059669)',
                              height: '100%',
                              width: `${load.progress}%`,
                              borderRadius: '10px',
                              transition: 'width 0.3s ease',
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Load Details Modal */}
      {showLoadDetails && selectedLoadData && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1e293b, #334155)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '40px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
              }}
            >
              <h3
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#ffffff',
                  margin: 0,
                }}
              >
                Load Details: {selectedLoadData.id}
              </h3>
              <button
                onClick={() => setShowLoadDetails(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  fontSize: '20px',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '5px',
                    }}
                  >
                    Origin
                  </div>
                  <div
                    style={{
                      fontSize: '18px',
                      color: '#ffffff',
                      fontWeight: '600',
                    }}
                  >
                    {selectedLoadData.origin}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '5px',
                    }}
                  >
                    Destination
                  </div>
                  <div
                    style={{
                      fontSize: '18px',
                      color: '#ffffff',
                      fontWeight: '600',
                    }}
                  >
                    {selectedLoadData.destination}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '5px',
                    }}
                  >
                    Driver
                  </div>
                  <div
                    style={{
                      fontSize: '18px',
                      color: '#ffffff',
                      fontWeight: '600',
                    }}
                  >
                    {selectedLoadData.driver}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '5px',
                    }}
                  >
                    Truck
                  </div>
                  <div
                    style={{
                      fontSize: '18px',
                      color: '#ffffff',
                      fontWeight: '600',
                    }}
                  >
                    {selectedLoadData.truck}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '5px',
                    }}
                  >
                    Revenue
                  </div>
                  <div
                    style={{
                      fontSize: '18px',
                      color: '#10b981',
                      fontWeight: '700',
                    }}
                  >
                    {selectedLoadData.revenue}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '5px',
                    }}
                  >
                    Distance
                  </div>
                  <div
                    style={{
                      fontSize: '18px',
                      color: '#ffffff',
                      fontWeight: '600',
                    }}
                  >
                    {selectedLoadData.distance}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '5px',
                    }}
                  >
                    Commodity
                  </div>
                  <div
                    style={{
                      fontSize: '18px',
                      color: '#ffffff',
                      fontWeight: '600',
                    }}
                  >
                    {selectedLoadData.commodity}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '5px',
                    }}
                  >
                    Weight
                  </div>
                  <div
                    style={{
                      fontSize: '18px',
                      color: '#ffffff',
                      fontWeight: '600',
                    }}
                  >
                    {selectedLoadData.weight}
                  </div>
                </div>
              </div>

              {/* Broker Information Section */}
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '2px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '15px',
                  padding: '20px',
                  marginTop: '20px',
                }}
              >
                <h4
                  style={{
                    color: '#3b82f6',
                    fontSize: '16px',
                    fontWeight: '700',
                    margin: '0 0 15px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  🏢 Broker Information
                </h4>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '15px',
                    marginBottom: '15px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        marginBottom: '5px',
                      }}
                    >
                      Company
                    </div>
                    <div
                      style={{
                        fontSize: '15px',
                        color: '#ffffff',
                        fontWeight: '600',
                      }}
                    >
                      {selectedLoadData.broker?.company}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        marginBottom: '5px',
                      }}
                    >
                      Contact Person
                    </div>
                    <div
                      style={{
                        fontSize: '15px',
                        color: '#ffffff',
                        fontWeight: '600',
                      }}
                    >
                      {selectedLoadData.broker?.contact}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '15px',
                    marginBottom: '15px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        marginBottom: '5px',
                      }}
                    >
                      Phone
                    </div>
                    <div
                      style={{
                        fontSize: '15px',
                        color: '#10b981',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      onClick={() =>
                        window.open(`tel:${selectedLoadData.broker?.phone}`)
                      }
                    >
                      📞 {selectedLoadData.broker?.phone}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        marginBottom: '5px',
                      }}
                    >
                      Email
                    </div>
                    <div
                      style={{
                        fontSize: '15px',
                        color: '#10b981',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      onClick={() =>
                        window.open(
                          `mailto:${selectedLoadData.broker?.email}?subject=Load ${selectedLoadData.id} Inquiry`
                        )
                      }
                    >
                      ✉️ {selectedLoadData.broker?.email}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr',
                    gap: '15px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        marginBottom: '5px',
                      }}
                    >
                      MC Number
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: '#ffffff',
                        fontWeight: '600',
                      }}
                    >
                      {selectedLoadData.broker?.mcNumber}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        marginBottom: '5px',
                      }}
                    >
                      Broker Rating
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: '#f59e0b',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      ⭐ {selectedLoadData.broker?.rating}/5.0
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        marginBottom: '5px',
                      }}
                    >
                      Payment Terms
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: '#ffffff',
                        fontWeight: '600',
                      }}
                    >
                      {selectedLoadData.broker?.paymentTerms}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        marginBottom: '5px',
                      }}
                    >
                      Credit Rating
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: selectedLoadData.broker?.creditRating?.includes(
                          '+'
                        )
                          ? '#10b981'
                          : selectedLoadData.broker?.creditRating?.includes('-')
                            ? '#f59e0b'
                            : '#ffffff',
                        fontWeight: '600',
                      }}
                    >
                      {selectedLoadData.broker?.creditRating}
                    </div>
                  </div>
                </div>

                {/* Quick Contact Actions */}
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    marginTop: '15px',
                    paddingTop: '15px',
                    borderTop: '1px solid rgba(59, 130, 246, 0.2)',
                  }}
                >
                  <button
                    onClick={() =>
                      window.open(`tel:${selectedLoadData.broker?.phone}`)
                    }
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    📞 Call Broker
                  </button>
                  <button
                    onClick={() =>
                      window.open(
                        `mailto:${selectedLoadData.broker?.email}?subject=Load ${selectedLoadData.id} Inquiry&body=Hello ${selectedLoadData.broker?.contact},%0D%0A%0D%0AI am inquiring about load ${selectedLoadData.id} (${selectedLoadData.origin} to ${selectedLoadData.destination}).%0D%0A%0D%0APlease let me know if you need any additional information.%0D%0A%0D%0AThank you!`
                      )
                    }
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    ✉️ Email Broker
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                <button
                  onClick={() => setShowLoadDetails(false)}
                  style={{
                    background: 'linear-gradient(135deg, #64748b, #475569)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    flex: 1,
                  }}
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
