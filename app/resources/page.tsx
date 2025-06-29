'use client'

import { useState } from 'react'

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<'drivers' | 'dispatch' | 'broker' | 'heavyhaul'>('drivers')

  // Driver Resources Data
  const truckerHotels = [
    {
      name: 'TA Travel Centers',
      description: 'Nationwide truck stops with hotels, parking, and amenities',
      website: 'https://ta-petro.com',
      features: ['Truck Parking', 'Shower Facilities', 'Restaurants', 'Fuel', 'Maintenance']
    },
    {
      name: 'Pilot Flying J',
      description: 'Premier truck stop chain with comprehensive services',
      website: 'https://pilotflyingj.com',
      features: ['myRewards Program', 'Reserve Parking', 'Showers', 'Laundry', 'CAT Scales']
    },
    {
      name: 'Loves Travel Stops',
      description: 'Family-owned travel stops with trucker amenities',
      website: 'https://loves.com',
      features: ['Truck Parking', 'Fresh Food', 'Showers', 'Dog Parks', 'WiFi']
    },
    {
      name: 'Motel 6',
      description: 'Budget-friendly motels with truck parking',
      website: 'https://motel6.com',
      features: ['Truck Parking', 'Pet Friendly', 'WiFi', 'Easy Access']
    },
    {
      name: 'Red Roof Inn',
      description: 'Extended truck parking and driver discounts',
      website: 'https://redroof.com',
      features: ['Truck Parking', 'Driver Rates', 'Pet Friendly', 'Continental Breakfast']
    }
  ]

  const restStops = [
    {
      name: 'Trucker Path App',
      description: 'Find truck stops, parking, and amenities nationwide',
      website: 'https://truckerpath.com',
      type: 'Mobile App'
    },
    {
      name: 'Rest Area Finder',
      description: 'Locate official rest areas and facilities',
      website: 'https://restareafinderr.com',
      type: 'Web Tool'
    },
    {
      name: 'BigRigTravels',
      description: 'Comprehensive truck stop directory',
      website: 'https://bigrigtravels.com',
      type: 'Directory'
    }
  ]

  const driverServices = [
    {
      name: 'Truck Driver Institute',
      description: 'Professional development and safety training',
      website: 'https://truckdriverinstitute.com',
      category: 'Training'
    },
    {
      name: 'OOIDA (Owner-Operator Independent Drivers Association)',
      description: 'Advocacy and resources for independent drivers',
      website: 'https://ooida.com',
      category: 'Association'
    },
    {
      name: 'DOT Physical Locator',
      description: 'Find certified medical examiners nationwide',
      website: 'https://nationalregistry.fmcsa.dot.gov',
      category: 'Medical'
    },
    {
      name: 'Overdrive Magazine',
      description: 'Industry news and business advice for truckers',
      website: 'https://overdriveonline.com',
      category: 'News'
    }
  ]

  // Dispatch Resources Data
  const dispatchTools = [
    {
      name: 'DAT Load Board',
      description: 'Premier load matching and freight marketplace',
      website: 'https://dat.com',
      category: 'Load Boards'
    },
    {
      name: 'Truckstop.com',
      description: 'Comprehensive logistics and load board platform',
      website: 'https://truckstop.com',
      category: 'Load Boards'
    },
    {
      name: 'Internet Truckstop (ITS)',
      description: 'Load board and transportation management',
      website: 'https://internettruckstop.com',
      category: 'Load Boards'
    },
    {
      name: 'HOS247',
      description: 'Hours of Service compliance and tracking',
      website: 'https://hos247.com',
      category: 'Compliance'
    },
    {
      name: 'Trucking Office',
      description: 'Dispatch and fleet management software',
      website: 'https://truckingoffice.com',
      category: 'Software'
    }
  ]

  const routingTools = [
    {
      name: 'PC Miler',
      description: 'Professional truck routing and mileage',
      website: 'https://pcmiler.com',
      features: ['Truck Routing', 'HazMat Routes', 'Toll Costs', 'Fuel Optimization']
    },
    {
      name: 'Rand McNally TruckGPS',
      description: 'Professional truck navigation and routing',
      website: 'https://randmcnally.com',
      features: ['Truck Specific Routes', 'Bridge Heights', 'Weight Restrictions', 'Construction Updates']
    },
    {
      name: 'CoPilot Truck',
      description: 'Commercial vehicle navigation and fleet tracking',
      website: 'https://copilotgps.com',
      features: ['Commercial Routing', 'Fleet Tracking', 'ELD Integration', 'Real-time Traffic']
    }
  ]

  // Broker Resources Data
  const brokerageTools = [
    {
      name: 'TIA (Transportation Intermediaries Association)',
      description: 'Industry association for freight brokers and forwarders',
      website: 'https://tianet.org',
      category: 'Association'
    },
    {
      name: 'Freight Broker Boot Camp',
      description: 'Comprehensive broker training and certification',
      website: 'https://freightbrokerbootcamp.com',
      category: 'Training'
    },
    {
      name: 'LoadDelivered',
      description: 'Freight broker training and resources',
      website: 'https://loaddelivered.com',
      category: 'Training'
    },
    {
      name: 'C.H. Robinson',
      description: 'Industry-leading logistics and freight services',
      website: 'https://chrobinson.com',
      category: 'Marketplace'
    }
  ]

  const complianceResources = [
    {
      name: 'FMCSA Regulations',
      description: 'Federal Motor Carrier Safety Administration guidelines',
      website: 'https://fmcsa.dot.gov',
      category: 'Compliance'
    },
    {
      name: 'Broker Authority Application',
      description: 'Apply for freight broker operating authority',
      website: 'https://fmcsa.dot.gov/registration',
      category: 'Licensing'
    },
    {
      name: 'SAFER Web',
      description: 'Verify carrier safety and registration information',
      website: 'https://safer.fmcsa.dot.gov',
      category: 'Verification'
    },
    {
      name: 'BOC-3 Designation',
      description: 'Process agent designation for freight brokers',
      website: 'https://fmcsa.dot.gov/registration/boc3-designation-agents',
      category: 'Compliance'
    }
  ]

  // Heavy Haul Resources Data
  const permitServices = [
    {
      name: 'Overdimensional.com',
      description: 'Complete permit service for oversized loads nationwide',
      website: 'https://overdimensional.com',
      features: ['All State Permits', 'Route Planning', 'Escort Requirements', '24/7 Support'],
      category: 'Permit Service'
    },
    {
      name: 'Heavy Haul and Oversized',
      description: 'Specialized permit and route planning services',
      website: 'https://heavyhaulandoversized.com',
      features: ['Permit Processing', 'Route Analysis', 'Bridge Analysis', 'Pilot Car Requirements'],
      category: 'Permit Service'
    },
    {
      name: 'BridgeMap by Bridges.com',
      description: 'Bridge height and weight restriction database',
      website: 'https://bridges.com',
      features: ['Bridge Database', 'Height/Weight Limits', 'Route Restrictions', 'API Access'],
      category: 'Route Planning'
    },
    {
      name: 'ProMiles',
      description: 'Professional routing with heavy haul capabilities',
      website: 'https://promiles.com',
      features: ['Heavy Haul Routing', 'Bridge Analysis', 'Permit Integration', 'Toll Calculations'],
      category: 'Route Planning'
    }
  ]

  const pilotCarServices = [
    {
      name: 'PilotCars.com',
      description: 'National network of certified pilot car operators',
      website: 'https://pilotcars.com',
      services: ['Escort Services', 'Certified Operators', 'Insurance Coverage', 'Real-time Coordination'],
      coverage: 'Nationwide'
    },
    {
      name: 'Oversize.io',
      description: 'Digital platform connecting shippers with pilot cars',
      website: 'https://oversize.io',
      services: ['Instant Booking', 'Route Optimization', 'Live Tracking', 'Automated Dispatch'],
      coverage: 'US & Canada'
    },
    {
      name: 'Heavy Haul Pilot Cars',
      description: 'Specialized escort services for heavy equipment',
      website: 'https://heavyhaulpilotcars.com',
      services: ['Height Poles', 'Wide Load Signs', 'Two-way Radios', 'Emergency Equipment'],
      coverage: 'Regional'
    },
    {
      name: 'Escort Flagging',
      description: 'Professional flagging and escort services',
      website: 'https://escortflagging.com',
      services: ['Certified Flaggers', 'Traffic Control', 'Safety Equipment', 'Liability Insurance'],
      coverage: 'Multi-state'
    }
  ]

  const routeOptimization = [
    {
      name: 'PC Miler Heavy Haul',
      description: 'Advanced routing for oversized and heavy loads',
      website: 'https://pcmiler.com/heavy-haul',
      features: ['Bridge Analysis', 'Weight Restrictions', 'Height Clearances', 'Permit Requirements', 'Toll Costs'],
      specialization: 'Heavy Haul'
    },
    {
      name: 'Bestpass Toll Management',
      description: 'Comprehensive toll management and optimization',
      website: 'https://bestpass.com',
      features: ['Toll Optimization', 'Account Management', 'Violation Processing', 'Reporting & Analytics'],
      specialization: 'Toll Management'
    },
    {
      name: 'PrePass Plus',
      description: 'Weigh station bypass and toll management',
      website: 'https://prepass.com',
      features: ['Weigh Station Bypass', 'Toll Payments', 'Safety Compliance', 'Fleet Analytics'],
      specialization: 'Compliance & Tolls'
    },
    {
      name: 'TollGuru',
      description: 'Real-time toll calculation and route optimization',
      website: 'https://tollguru.com',
      features: ['Real-time Toll Rates', 'Route Comparison', 'Cost Analysis', 'API Integration'],
      specialization: 'Toll Optimization'
    }
  ]

  const heavyHaulCompliance = [
    {
      name: 'OOIDA (Owner-Operator Independent Drivers Association)',
      description: 'Resources and advocacy for independent truckers',
      website: 'https://ooida.com',
      category: 'Association'
    },
    {
      name: 'Specialized Carriers & Rigging Association',
      description: 'Industry association for heavy haul and specialized transport',
      website: 'https://scranet.org',
      category: 'Association'
    },
    {
      name: 'Heavy Haul Regulations Guide',
      description: 'Comprehensive guide to heavy haul regulations by state',
      website: 'https://www.fhwa.dot.gov/reports/tswstudy/Vol3-Appendix-B.pdf',
      category: 'Regulations'
    },
    {
      name: 'DOT Size and Weight Regulations',
      description: 'Federal size and weight regulations for commercial vehicles',
      website: 'https://ops.fhwa.dot.gov/freight/sw/overview/index.htm',
      category: 'Compliance'
    }
  ]

  return (
    <div className="container py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
          Resources Center
        </h1>
        <p className="text-gray-600">
          Essential tools, services, and information for drivers, dispatchers, and brokers
        </p>
      </div>

      {/* Category Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setSelectedCategory('drivers')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedCategory === 'drivers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🚛 Driver Resources
            </button>
            <button
              onClick={() => setSelectedCategory('dispatch')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedCategory === 'dispatch'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📋 Dispatch Resources
            </button>
            <button
              onClick={() => setSelectedCategory('broker')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedCategory === 'broker'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🏢 Broker Resources
            </button>
            <button
              onClick={() => setSelectedCategory('heavyhaul')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedCategory === 'heavyhaul'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🏗️ Heavy Haul
            </button>
          </nav>
        </div>
      </div>

      {/* Driver Resources */}
      {selectedCategory === 'drivers' && (
        <div className="space-y-8">
          {/* Trucker-Friendly Hotels & Motels */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              🏨 Trucker-Friendly Hotels & Motels
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {truckerHotels.map((hotel, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{hotel.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{hotel.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {hotel.features.map((feature, idx) => (
                      <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <a href={hotel.website} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Visit Website
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Rest Stops & Truck Stops */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              ⛽ Rest Stops & Truck Stop Finders
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {restStops.map((stop, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{stop.name}</h4>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {stop.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{stop.description}</p>
                  <a href={stop.website} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Access Tool
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Driver Services */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              🛠️ Driver Services & Support
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {driverServices.map((service, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{service.name}</h4>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {service.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                  <a href={service.website} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Learn More
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dispatch Resources */}
      {selectedCategory === 'dispatch' && (
        <div className="space-y-8">
          {/* Load Boards & Dispatch Tools */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              📋 Load Boards & Dispatch Tools
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dispatchTools.map((tool, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{tool.name}</h4>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      {tool.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                  <a href={tool.website} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Access Platform
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Routing & Navigation Tools */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              🗺️ Routing & Navigation Tools
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {routingTools.map((tool, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{tool.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {tool.features.map((feature, idx) => (
                      <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <a href={tool.website} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Learn More
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Broker Resources */}
      {selectedCategory === 'broker' && (
        <div className="space-y-8">
          {/* Brokerage Tools & Training */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              🏢 Brokerage Tools & Training
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {brokerageTools.map((tool, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{tool.name}</h4>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {tool.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                  <a href={tool.website} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Access Resource
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance & Licensing */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              📜 Compliance & Licensing Resources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {complianceResources.map((resource, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{resource.name}</h4>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {resource.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                  <a href={resource.website} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Visit Official Site
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Heavy Haul Resources */}
      {selectedCategory === 'heavyhaul' && (
        <div className="space-y-8">
          {/* Permit Services */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              📋 Permit Services & Route Planning
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {permitServices.map((service, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{service.name}</h4>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {service.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                  
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {service.features.map((feature, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white text-blue-700 border border-blue-200">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <a href={service.website} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Get Permits & Route Planning →
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Pilot Car Services */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              🚗 Pilot Car & Escort Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pilotCarServices.map((service, index) => (
                <div key={index} className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{service.name}</h4>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {service.coverage}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                  
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {service.services.map((svc, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white text-yellow-700 border border-yellow-200">
                          {svc}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <a href={service.website} target="_blank" rel="noopener noreferrer" 
                     className="text-yellow-600 hover:text-yellow-800 text-sm font-medium">
                    Book Pilot Car Services →
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Route Optimization & Toll Management */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              🗺️ Route Optimization & Toll Management
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {routeOptimization.map((tool, index) => (
                <div key={index} className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{tool.name}</h4>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {tool.specialization}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                  
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {tool.features.map((feature, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white text-green-700 border border-green-200">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <a href={tool.website} target="_blank" rel="noopener noreferrer" 
                     className="text-green-600 hover:text-green-800 text-sm font-medium">
                    Access Route Planning →
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Heavy Haul Compliance & Associations */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              📜 Heavy Haul Compliance & Industry Resources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {heavyHaulCompliance.map((resource, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{resource.name}</h4>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {resource.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                  <a href={resource.website} target="_blank" rel="noopener noreferrer" 
                     className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                    Visit Resource →
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Access Banner */}
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">🚨 Heavy Haul Emergency Services</h3>
                <p className="text-orange-100">
                  Need immediate permit processing or pilot car services? Access our emergency contact directory for 24/7 heavy haul support.
                </p>
              </div>
              <div className="ml-6">
                <button className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
                  Emergency Contacts
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
