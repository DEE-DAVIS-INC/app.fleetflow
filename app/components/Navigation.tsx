'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import GlobalNotificationBell from './GlobalNotificationBell';

// Professional Navigation Component with Nested Dropdowns
export default function ProfessionalNavigation() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState<string | null>(
    null
  );
  const navRef = useRef<HTMLDivElement>(null);

  const handleDropdownClick = (dropdownName: string) => {
    console.log(
      'Dropdown clicked:',
      dropdownName,
      'Current active:',
      activeDropdown
    );
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
    setActiveSubDropdown(null); // Close any sub-dropdowns when main dropdown changes
  };

  const handleSubDropdownClick = (subDropdownName: string) => {
    console.log('Sub-dropdown clicked:', subDropdownName);
    setActiveSubDropdown(
      activeSubDropdown === subDropdownName ? null : subDropdownName
    );
  };

  const handleDropdownClose = () => {
    console.log('Closing dropdown');
    setActiveDropdown(null);
    setActiveSubDropdown(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Don't handle click outside if clicking on freight quote buttons
      if (target.closest('.freight-quote-button')) {
        return;
      }

      // Only handle click outside if there's actually an active dropdown
      if (
        (activeDropdown || activeSubDropdown) &&
        navRef.current &&
        !navRef.current.contains(target)
      ) {
        console.log('Clicked outside, closing dropdown');
        setActiveDropdown(null);
        setActiveSubDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown, activeSubDropdown]);

  console.log(
    'Navigation render - activeDropdown:',
    activeDropdown,
    'activeSubDropdown:',
    activeSubDropdown
  );

  return (
    <nav
      ref={navRef}
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        padding: '12px 20px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        <Link
          href='/'
          style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #3b82f6, #06b6d4)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textDecoration: 'none',
          }}
        >
          🚛 FleetFlow™
        </Link>

        <div
          style={{
            display: 'flex',
            gap: '3px',
            alignItems: 'center',
          }}
        >
          {/* OPERATIONS Dropdown - Blue */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              onClick={() => handleDropdownClick('operations')}
              style={{
                background:
                  activeDropdown === 'operations'
                    ? 'linear-gradient(135deg, #1d4ed8, #1e40af)'
                    : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                padding: '8px 14px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              �� OPERATIONS {activeDropdown === 'operations' ? '🔽' : '▼'}
            </button>
            {activeDropdown === 'operations' && (
              <div
                style={{
                  position: 'absolute',
                  background: 'white',
                  minWidth: '200px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                  borderRadius: '12px',
                  padding: '12px 0',
                  top: '100%',
                  left: 0,
                  border: '2px solid #3b82f6',
                  zIndex: 1001,
                }}
              >
                <Link
                  href='/dispatch'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#3b82f6',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                  }}
                >
                  🚛 Dispatch Central
                </Link>
                <Link
                  href='/broker'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#3b82f6',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                  }}
                >
                  🏢 Broker Box
                </Link>
                <Link
                  href='/freightflow-rfx'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#3b82f6',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                  }}
                >
                  📋 FreightFlow RFx℠
                </Link>
              </div>
            )}
          </div>

          {/* DRIVER MANAGEMENT Dropdown - Yellow */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              onClick={() => handleDropdownClick('drivers')}
              style={{
                background: 'linear-gradient(135deg, #f7c52d, #f4a832)',
                color: '#2d3748',
                padding: '8px 14px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              🚛 DRIVER MANAGEMENT ▼
            </button>
            {activeDropdown === 'drivers' && (
              <div
                style={{
                  position: 'absolute',
                  background: 'white',
                  minWidth: '220px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  borderRadius: '12px',
                  padding: '12px 0',
                  top: '100%',
                  left: 0,
                  border: '1px solid rgba(0,0,0,0.1)',
                  zIndex: 1001,
                }}
              >
                <Link
                  href='/drivers'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#f4a832',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                  }}
                >
                  🚛 Driver Management
                </Link>

                <Link
                  href='/onboarding/carrier-onboarding'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#f4a832',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                  }}
                >
                  🚛 Carrier Onboarding
                </Link>
                <Link
                  href='/carriers/enhanced-portal'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#f4a832',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                  }}
                >
                  🏢 Enhanced Carrier Portal
                </Link>
              </div>
            )}
          </div>

          {/* FLEETFLOW Dropdown - Teal */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              onClick={() => handleDropdownClick('fleet')}
              style={{
                background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                color: 'white',
                padding: '8px 14px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              🚛 FLEETFLOW ▼
            </button>
            {activeDropdown === 'fleet' && (
              <div
                style={{
                  position: 'absolute',
                  background: 'white',
                  minWidth: '220px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  borderRadius: '12px',
                  padding: '12px 0',
                  top: '100%',
                  left: 0,
                  border: '1px solid rgba(0,0,0,0.1)',
                  zIndex: 1001,
                }}
              >
                {/* Fleet Management Sub-Dropdown */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => handleSubDropdownClick('fleet-mgmt')}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '10px 20px',
                      color: '#14b8a6',
                      background:
                        activeSubDropdown === 'fleet-mgmt'
                          ? '#f0fdf4'
                          : 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                    }}
                  >
                    🚛 Fleet Management ▶
                  </button>
                  {activeSubDropdown === 'fleet-mgmt' && (
                    <div
                      style={{
                        position: 'absolute',
                        background: 'white',
                        minWidth: '200px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                        borderRadius: '12px',
                        padding: '12px 0',
                        top: 0,
                        left: '100%',
                        border: '1px solid rgba(0,0,0,0.1)',
                        zIndex: 1002,
                      }}
                    >
                      <Link
                        href='/vehicles'
                        onClick={handleDropdownClose}
                        style={{
                          display: 'block',
                          padding: '10px 20px',
                          color: '#14b8a6',
                          textDecoration: 'none',
                          fontSize: '0.85rem',
                          fontWeight: '500',
                        }}
                      >
                        🚛 Vehicles
                      </Link>
                      <Link
                        href='/maintenance'
                        onClick={handleDropdownClose}
                        style={{
                          display: 'block',
                          padding: '10px 20px',
                          color: '#14b8a6',
                          textDecoration: 'none',
                          fontSize: '0.85rem',
                          fontWeight: '500',
                        }}
                      >
                        🔧 Maintenance Management
                      </Link>
                      <Link
                        href='/fleet/analytics'
                        onClick={handleDropdownClose}
                        style={{
                          display: 'block',
                          padding: '10px 20px',
                          color: '#14b8a6',
                          textDecoration: 'none',
                          fontSize: '0.85rem',
                          fontWeight: '500',
                        }}
                      >
                        📊 Fleet Analytics
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  href='/routes'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#14b8a6',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                  }}
                >
                  🗺️ Route Optimization
                </Link>
                <Link
                  href='/quoting'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#14b8a6',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                  }}
                >
                  💰 Freight Quoting
                </Link>
                <Link
                  href='/tracking'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#14b8a6',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  🗺️ Live Load Tracking
                </Link>
              </div>
            )}
          </div>

          {/* ANALYTICS - Single Button */}
          <Link href='/analytics' style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: 'white',
                padding: '8px 14px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              📊 ANALYTICS
            </button>
          </Link>

          {/* COMPLIANCE - Single Button */}
          <Link href='/compliance' style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                color: 'white',
                padding: '8px 14px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              ✅ COMPLIANCE
            </button>
          </Link>

          {/* RESOURCES Dropdown - Orange */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              onClick={() => handleDropdownClick('resources')}
              style={{
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                color: 'white',
                padding: '8px 14px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              📚 RESOURCES ▼
            </button>
            {activeDropdown === 'resources' && (
              <div
                style={{
                  position: 'absolute',
                  background: 'white',
                  minWidth: '220px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  borderRadius: '12px',
                  padding: '12px 0',
                  top: '100%',
                  left: 0,
                  border: '1px solid rgba(0,0,0,0.1)',
                  zIndex: 1001,
                }}
              >
                <Link
                  href='/training'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#f97316',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  🎓 FleetFlow University℠
                </Link>
                <Link
                  href='/documentation'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#f97316',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  📖 Documentation Hub
                </Link>
                <Link
                  href='/resources'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#f97316',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  📚 Resources Library
                </Link>
                <Link
                  href='/documents'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#f97316',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  📄 Documents
                </Link>
                <Link
                  href='/safety'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#f97316',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  🦺 Safety Resources
                </Link>
              </div>
            )}
          </div>

          {/* SETTINGS/ADMIN Dropdown - Purple */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              onClick={() => handleDropdownClick('settings')}
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                color: 'white',
                padding: '10px 18px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              ⚙️ ADMIN ▼
            </button>
            {activeDropdown === 'settings' && (
              <div
                style={{
                  position: 'absolute',
                  background: 'white',
                  minWidth: '240px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  borderRadius: '12px',
                  padding: '12px 0',
                  top: '100%',
                  right: 0,
                  border: '1px solid rgba(0,0,0,0.1)',
                  zIndex: 1001,
                }}
              >
                <Link
                  href='/settings'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#8B5CF6',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  ⚙️ Settings
                </Link>
                {/* User Management Sub-Dropdown */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => handleSubDropdownClick('user-management')}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '10px 20px',
                      color: '#8B5CF6',
                      background:
                        activeSubDropdown === 'user-management'
                          ? '#f3e8ff'
                          : 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                    }}
                  >
                    👥 User Management ▶
                  </button>
                  {activeSubDropdown === 'user-management' && (
                    <div
                      style={{
                        position: 'absolute',
                        background: 'white',
                        minWidth: '200px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                        borderRadius: '12px',
                        padding: '8px 0',
                        top: '0',
                        left: '100%',
                        border: '1px solid rgba(0,0,0,0.1)',
                        zIndex: 1002,
                      }}
                    >
                      <Link
                        href='/user-management'
                        onClick={handleDropdownClose}
                        style={{
                          display: 'block',
                          padding: '8px 16px',
                          color: '#8B5CF6',
                          textDecoration: 'none',
                          fontSize: '0.85rem',
                          fontWeight: '500',
                        }}
                      >
                        👥 User Profiles
                      </Link>
                      <Link
                        href='/unified-portal'
                        onClick={handleDropdownClose}
                        style={{
                          display: 'block',
                          padding: '8px 16px',
                          color: '#8B5CF6',
                          textDecoration: 'none',
                          fontSize: '0.85rem',
                          fontWeight: '500',
                        }}
                      >
                        🚛 Unified Portal
                      </Link>
                    </div>
                  )}
                </div>

                {/* Accounting Sub-Dropdown */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => handleSubDropdownClick('accounting')}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '10px 20px',
                      color: '#8B5CF6',
                      background:
                        activeSubDropdown === 'accounting'
                          ? '#f3e8ff'
                          : 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                    }}
                  >
                    💰 Accounting ▶
                  </button>
                  {activeSubDropdown === 'accounting' && (
                    <div
                      style={{
                        position: 'absolute',
                        background: 'white',
                        minWidth: '180px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                        borderRadius: '12px',
                        padding: '12px 0',
                        top: 0,
                        left: '100%',
                        border: '1px solid rgba(0,0,0,0.1)',
                        zIndex: 1002,
                      }}
                    >
                      <Link
                        href='/financials'
                        onClick={handleDropdownClose}
                        style={{
                          display: 'block',
                          padding: '10px 20px',
                          color: '#8B5CF6',
                          textDecoration: 'none',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                        }}
                      >
                        💰 Financials
                      </Link>
                      <Link
                        href='/billing'
                        onClick={handleDropdownClose}
                        style={{
                          display: 'block',
                          padding: '10px 20px',
                          color: '#8B5CF6',
                          textDecoration: 'none',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                        }}
                      >
                        💳 Billing
                      </Link>
                    </div>
                  )}
                </div>

                {/* Shipper Management Hub - Direct Link */}
                <Link
                  href='/shipper-portal'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#8B5CF6',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  🏢 Shipper Management Hub
                </Link>

                <Link
                  href='/admin/business-intelligence'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#8B5CF6',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  📊 Business Intelligence
                </Link>

                <Link
                  href='/reports'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#8B5CF6',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  📊 Reports
                </Link>
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <GlobalNotificationBell department='admin' />

          {/* User Avatar */}
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #0EA5E9, #2DD4BF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginLeft: '10px',
              boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)',
            }}
          >
            A
          </div>
        </div>
      </div>
    </nav>
  );
}
