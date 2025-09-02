'use client';

import Link from 'next/link';
import React, { useState } from 'react';

interface EnrollmentForm {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  experience: string;
  goals: string;
  timeline: string;
}

export default function BrokerLaunchPage() {
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [enrollmentForm, setEnrollmentForm] = useState<EnrollmentForm>({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    experience: '',
    goals: '',
    timeline: '',
  });

  // Add CSS animations
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rocketLaunch {
        0% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-10px) rotate(2deg); }
        100% { transform: translateY(0px) rotate(0deg); }
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes glow {
        0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.2); }
        50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.4); }
      }

      .rocket-animation {
        animation: rocketLaunch 2s ease-in-out infinite;
      }

      .fade-in-up {
        animation: fadeInUp 0.8s ease-out;
      }

      .step-card {
        transition: all 0.3s ease;
      }

      .step-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 35px rgba(59, 130, 246, 0.2);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleEnrollmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.info('Broker enrollment submitted:', enrollmentForm);
    alert(
      'Thank you! We will contact you within 24 hours to begin your Broker Launch Program.'
    );
    setShowEnrollmentForm(false);
    setEnrollmentForm({
      name: '',
      email: '',
      phone: '',
      businessName: '',
      experience: '',
      goals: '',
      timeline: '',
    });
  };

  const programSteps = [
    {
      step: 1,
      title: 'Application Preparation',
      description:
        'Complete MC authority and business formation documents with expert guidance',
      icon: '📋',
      details: [
        'Business entity formation (LLC/sole proprietorship)',
        'EIN/Tax ID application assistance',
        'MC authority application preparation',
        'BMC-84 surety bond guidance',
        'UCR registration support',
      ],
    },
    {
      step: 2,
      title: 'FleetFlow University℠ Training',
      description: '40-hour comprehensive broker certification program',
      icon: '🎓',
      details: [
        'Broker fundamentals and market knowledge',
        'Rate negotiation and contract terms',
        'Carrier relationship building',
        'Load matching and optimization',
        'Compliance and regulations',
        'Industry software and tools',
      ],
    },
    {
      step: 3,
      title: '60 Days Expert Coaching',
      description: 'Weekly mentorship calls with experienced freight brokers',
      icon: '🤝',
      details: [
        'Personal coach assignment',
        'Weekly strategy sessions',
        'Load booking assistance',
        'Customer acquisition guidance',
        'Performance optimization',
        'Problem-solving support',
      ],
    },
    {
      step: 4,
      title: 'Platform Launch & Support',
      description:
        '3 months FREE FleetFlow Broker Elite access + ongoing support',
      icon: '🚀',
      details: [
        'Full platform access and training',
        'Load board integration',
        'CRM and customer management',
        'Financial tracking and reporting',
        '24/7 technical support',
        'Monthly business reviews',
      ],
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Effects */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '200px',
          height: '200px',
          background:
            'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'glow 4s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '60%',
          right: '10%',
          width: '150px',
          height: '150px',
          background:
            'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'glow 3s ease-in-out infinite',
        }}
      />

      {/* Header */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'rgba(15, 15, 35, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
          padding: '12px 20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link href='/' style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#3b82f6',
                }}
              >
                ← FleetFlow
              </div>
            </div>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link
              href='/launchpad'
              style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: '500',
              }}
            >
              ← Back to LaunchPad
            </Link>
            <button
              onClick={() => setShowEnrollmentForm(true)}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              🚀 Enroll Now
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ paddingTop: '80px' }}>
        {/* Hero Section */}
        <div
          style={{
            textAlign: 'center',
            padding: '80px 20px',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <div
            className='rocket-animation'
            style={{ fontSize: '4rem', marginBottom: '20px' }}
          >
            🤝
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '900',
              background:
                'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '20px',
              lineHeight: '1.1',
            }}
          >
            Broker Launch Program
          </h1>
          <p
            style={{
              fontSize: '1.4rem',
              color: 'rgba(255,255,255,0.9)',
              marginBottom: '15px',
              fontWeight: '500',
            }}
          >
            Your Complete Path to Freight Broker Success
          </p>
          <p
            style={{
              fontSize: '1.1rem',
              color: 'rgba(255,255,255,0.7)',
              maxWidth: '700px',
              margin: '0 auto 40px',
              lineHeight: '1.6',
            }}
          >
            From licensing to launching - get everything you need to become a
            successful freight broker with our comprehensive 90-day program and
            3 months FREE FleetFlow platform access.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              marginBottom: '60px',
            }}
          >
            <div
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '16px',
                padding: '20px',
                border: '2px solid #3b82f6',
                display: 'inline-block',
              }}
            >
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: '900',
                  color: 'white',
                }}
              >
                $999
              </div>
              <div
                style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}
              >
                One-time fee • Complete program
              </div>
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'inline-block',
              }}
            >
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: '900',
                  color: '#10b981',
                }}
              >
                90 Days
              </div>
              <div
                style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}
              >
                To launch your brokerage
              </div>
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'inline-block',
              }}
            >
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: '900',
                  color: '#f59e0b',
                }}
              >
                3 Months
              </div>
              <div
                style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}
              >
                FREE FleetFlow access ($447 value)
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowEnrollmentForm(true)}
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
              color: 'white',
              border: 'none',
              padding: '18px 36px',
              borderRadius: '12px',
              fontSize: '1.2rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow =
                '0 12px 35px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow =
                '0 8px 25px rgba(59, 130, 246, 0.3)';
            }}
          >
            🚀 Start My Broker Journey
          </button>
        </div>

        {/* Program Steps */}
        <div style={{ padding: '60px 20px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2
              style={{
                textAlign: 'center',
                fontSize: '2.5rem',
                fontWeight: '800',
                color: 'white',
                marginBottom: '20px',
              }}
            >
              Your 90-Day Launch Journey
            </h2>
            <p
              style={{
                textAlign: 'center',
                fontSize: '1.2rem',
                color: 'rgba(255,255,255,0.8)',
                marginBottom: '50px',
                maxWidth: '600px',
                margin: '0 auto 50px',
              }}
            >
              Step-by-step guidance from licensing to your first load booking
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '30px',
              }}
            >
              {programSteps.map((step, index) => (
                <div
                  key={index}
                  className='step-card fade-in-up'
                  style={{
                    background: 'rgba(59, 130, 246, 0.05)',
                    borderRadius: '16px',
                    padding: '30px',
                    border: '2px solid rgba(59, 130, 246, 0.2)',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '-15px',
                      left: '20px',
                      background: '#3b82f6',
                      color: 'white',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    {step.step}
                  </div>

                  <div
                    style={{
                      fontSize: '3rem',
                      marginBottom: '15px',
                      marginTop: '10px',
                    }}
                  >
                    {step.icon}
                  </div>

                  <h3
                    style={{
                      fontSize: '1.4rem',
                      color: '#3b82f6',
                      marginBottom: '15px',
                      fontWeight: '700',
                    }}
                  >
                    {step.title}
                  </h3>

                  <p
                    style={{
                      color: 'rgba(255,255,255,0.8)',
                      lineHeight: '1.6',
                      marginBottom: '20px',
                    }}
                  >
                    {step.description}
                  </p>

                  <ul
                    style={{
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '0.9rem',
                      lineHeight: '1.8',
                      listStyle: 'none',
                      padding: 0,
                    }}
                  >
                    {step.details.map((detail, detailIndex) => (
                      <li
                        key={detailIndex}
                        style={{
                          marginBottom: '5px',
                          display: 'flex',
                          alignItems: 'flex-start',
                        }}
                      >
                        <span style={{ color: '#10b981', marginRight: '8px' }}>
                          •
                        </span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What's Included Detail */}
        <div
          style={{
            padding: '60px 20px',
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2
              style={{
                textAlign: 'center',
                fontSize: '2.5rem',
                fontWeight: '800',
                color: 'white',
                marginBottom: '20px',
              }}
            >
              Everything You Need to Succeed
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '40px',
                marginTop: '40px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '30px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <h4
                  style={{
                    color: '#3b82f6',
                    marginBottom: '15px',
                    fontWeight: '700',
                  }}
                >
                  📋 Licensing & Legal Support
                </h4>
                <ul
                  style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.95rem',
                    lineHeight: '1.8',
                    listStyle: 'none',
                    padding: 0,
                  }}
                >
                  <li>✓ MC Authority application filing</li>
                  <li>✓ BMC-84 Surety bond setup</li>
                  <li>✓ UCR registration assistance</li>
                  <li>✓ Business entity formation</li>
                  <li>✓ EIN/Tax ID guidance</li>
                  <li>✓ Insurance requirements</li>
                </ul>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '30px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <h4
                  style={{
                    color: '#10b981',
                    marginBottom: '15px',
                    fontWeight: '700',
                  }}
                >
                  🎓 Professional Training
                </h4>
                <ul
                  style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.95rem',
                    lineHeight: '1.8',
                    listStyle: 'none',
                    padding: 0,
                  }}
                >
                  <li>✓ 40-hour FleetFlow University℠ program</li>
                  <li>✓ Broker certification</li>
                  <li>✓ Rate negotiation skills</li>
                  <li>✓ Carrier relationship building</li>
                  <li>✓ Load matching strategies</li>
                  <li>✓ Compliance and regulations</li>
                </ul>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '30px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <h4
                  style={{
                    color: '#f59e0b',
                    marginBottom: '15px',
                    fontWeight: '700',
                  }}
                >
                  🤝 Expert Coaching & Support
                </h4>
                <ul
                  style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.95rem',
                    lineHeight: '1.8',
                    listStyle: 'none',
                    padding: 0,
                  }}
                >
                  <li>✓ Weekly 1-on-1 coaching calls</li>
                  <li>✓ Industry expert mentorship</li>
                  <li>✓ Load booking assistance</li>
                  <li>✓ Customer acquisition guidance</li>
                  <li>✓ Performance optimization</li>
                  <li>✓ 24/7 support access</li>
                </ul>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '30px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <h4
                  style={{
                    color: '#8b5cf6',
                    marginBottom: '15px',
                    fontWeight: '700',
                  }}
                >
                  🚀 Technology & Platform Access
                </h4>
                <ul
                  style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.95rem',
                    lineHeight: '1.8',
                    listStyle: 'none',
                    padding: 0,
                  }}
                >
                  <li>✓ 3 months FREE FleetFlow Broker Elite</li>
                  <li>✓ Advanced load board access</li>
                  <li>✓ CRM and customer management</li>
                  <li>✓ Financial tracking tools</li>
                  <li>✓ Analytics and reporting</li>
                  <li>✓ Mobile app access</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Success Metrics */}
        <div style={{ padding: '60px 20px' }}>
          <div
            style={{
              maxWidth: '1000px',
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                color: 'white',
                marginBottom: '20px',
              }}
            >
              Program Success Metrics
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '30px',
                marginTop: '40px',
              }}
            >
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '16px',
                  padding: '30px',
                  border: '2px solid rgba(59, 130, 246, 0.3)',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>⚡</div>
                <div
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: '900',
                    color: '#3b82f6',
                  }}
                >
                  30 Days
                </div>
                <div
                  style={{ color: 'rgba(255,255,255,0.8)', marginTop: '5px' }}
                >
                  Average licensing time
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '16px',
                  padding: '30px',
                  border: '2px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎯</div>
                <div
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: '900',
                    color: '#10b981',
                  }}
                >
                  95%
                </div>
                <div
                  style={{ color: 'rgba(255,255,255,0.8)', marginTop: '5px' }}
                >
                  First load booking success rate
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  borderRadius: '16px',
                  padding: '30px',
                  border: '2px solid rgba(245, 158, 11, 0.3)',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💰</div>
                <div
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: '900',
                    color: '#f59e0b',
                  }}
                >
                  $25K+
                </div>
                <div
                  style={{ color: 'rgba(255,255,255,0.8)', marginTop: '5px' }}
                >
                  Average first quarter revenue
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderRadius: '16px',
                  padding: '30px',
                  border: '2px solid rgba(139, 92, 246, 0.3)',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🚀</div>
                <div
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: '900',
                    color: '#8b5cf6',
                  }}
                >
                  90 Days
                </div>
                <div
                  style={{ color: 'rgba(255,255,255,0.8)', marginTop: '5px' }}
                >
                  Average time to profitable
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div
          style={{
            padding: '60px 20px',
            background:
              'linear-gradient(135deg, #1e40af 0%, #1e3a8a 50%, #1e293b 100%)',
          }}
        >
          <div
            style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}
          >
            <h2
              style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                color: 'white',
                marginBottom: '20px',
              }}
            >
              Ready to Become a Freight Broker?
            </h2>
            <p
              style={{
                fontSize: '1.2rem',
                color: 'rgba(255,255,255,0.9)',
                marginBottom: '30px',
                lineHeight: '1.6',
              }}
            >
              Join hundreds of successful brokers who started their careers with
              FleetFlow LaunchPad℠. Get licensed, trained, and launched in just
              90 days.
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '20px',
              }}
            >
              <button
                onClick={() => setShowEnrollmentForm(true)}
                style={{
                  background:
                    'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '18px 36px',
                  borderRadius: '12px',
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow =
                    '0 12px 35px rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 25px rgba(59, 130, 246, 0.3)';
                }}
              >
                🚀 Start My Broker Journey - $999
              </button>
              <Link href='/launchpad'>
                <button
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '18px 36px',
                    borderRadius: '12px',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  }}
                >
                  ← Compare Programs
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Form Modal */}
      {showEnrollmentForm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(5px)',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '20px',
              padding: '40px',
              maxWidth: '500px',
              width: '90%',
              border: '2px solid rgba(59, 130, 246, 0.3)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }}
          >
            <h3
              style={{
                color: 'white',
                textAlign: 'center',
                marginBottom: '20px',
                fontSize: '1.8rem',
                fontWeight: '800',
              }}
            >
              🚀 Launch Your Broker Career
            </h3>
            <form onSubmit={handleEnrollmentSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type='text'
                  placeholder='Full Name'
                  value={enrollmentForm.name}
                  onChange={(e) =>
                    setEnrollmentForm({
                      ...enrollmentForm,
                      name: e.target.value,
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    fontSize: '16px',
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type='email'
                  placeholder='Email Address'
                  value={enrollmentForm.email}
                  onChange={(e) =>
                    setEnrollmentForm({
                      ...enrollmentForm,
                      email: e.target.value,
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    fontSize: '16px',
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type='tel'
                  placeholder='Phone Number'
                  value={enrollmentForm.phone}
                  onChange={(e) =>
                    setEnrollmentForm({
                      ...enrollmentForm,
                      phone: e.target.value,
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    fontSize: '16px',
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type='text'
                  placeholder='Business Name (if applicable)'
                  value={enrollmentForm.businessName}
                  onChange={(e) =>
                    setEnrollmentForm({
                      ...enrollmentForm,
                      businessName: e.target.value,
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    fontSize: '16px',
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <select
                  value={enrollmentForm.experience}
                  onChange={(e) =>
                    setEnrollmentForm({
                      ...enrollmentForm,
                      experience: e.target.value,
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    fontSize: '16px',
                  }}
                >
                  <option value=''>Select Your Experience Level</option>
                  <option value='beginner'>New to Transportation</option>
                  <option value='some'>Some Industry Experience</option>
                  <option value='experienced'>Experienced Professional</option>
                  <option value='career-change'>Career Changer</option>
                </select>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <textarea
                  placeholder='What are your goals for becoming a freight broker?'
                  value={enrollmentForm.goals}
                  onChange={(e) =>
                    setEnrollmentForm({
                      ...enrollmentForm,
                      goals: e.target.value,
                    })
                  }
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    fontSize: '16px',
                    resize: 'vertical',
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <select
                  value={enrollmentForm.timeline}
                  onChange={(e) =>
                    setEnrollmentForm({
                      ...enrollmentForm,
                      timeline: e.target.value,
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    fontSize: '16px',
                  }}
                >
                  <option value=''>When would you like to start?</option>
                  <option value='immediately'>Immediately</option>
                  <option value='within-month'>Within a month</option>
                  <option value='within-quarter'>Within 3 months</option>
                  <option value='exploring'>Just exploring options</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type='submit'
                  style={{
                    flex: 1,
                    background:
                      'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  🚀 Start My Journey
                </button>
                <button
                  type='button'
                  onClick={() => setShowEnrollmentForm(false)}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
