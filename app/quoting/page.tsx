'use client';

import React, { useState, useEffect } from 'react';

interface QuoteData {
  type: 'LTL' | 'FTL' | 'Specialized';
  origin: string;
  destination: string;
  details: any;
  quote: {
    base: string;
    fuel: string;
    accessorials: string;
    total: string;
  };
  timestamp?: Date;
}

export default function QuotingPage() {
  const [activeTab, setActiveTab] = useState<'ltl' | 'ftl' | 'specialized'>('ltl');
  const [quoteResult, setQuoteResult] = useState<QuoteData | null>(null);
  const [quoteHistory, setQuoteHistory] = useState<QuoteData[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quoteStatus, setQuoteStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingQuote, setPendingQuote] = useState<QuoteData | null>(null);

  // LTL Form State
  const [ltlForm, setLtlForm] = useState({
    origin: '',
    destination: '',
    weight: '',
    pallets: '',
    freightClass: '',
    liftgate: false,
    residential: false
  });

  // FTL Form State
  const [ftlForm, setFtlForm] = useState({
    origin: '',
    destination: '',
    equipment: ''
  });

  // Specialized Form State
  const [specializedForm, setSpecializedForm] = useState({
    origin: '',
    destination: '',
    services: [] as string[]
  });

  useEffect(() => {
    // Load quote history from localStorage
    const savedHistory = localStorage.getItem('fleetflow-quote-history');
    if (savedHistory) {
      setQuoteHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveQuoteToHistory = (quote: QuoteData) => {
    const newHistory = [{ ...quote, timestamp: new Date() }, ...quoteHistory.slice(0, 19)]; // Keep last 20 quotes
    setQuoteHistory(newHistory);
    localStorage.setItem('fleetflow-quote-history', JSON.stringify(newHistory));
  };

  const calculateLTLQuote = (): QuoteData | null => {
    if (!ltlForm.origin || !ltlForm.destination || !ltlForm.weight || !ltlForm.pallets || !ltlForm.freightClass) {
      alert('Please fill out all required fields.');
      return null;
    }

    const weight = parseFloat(ltlForm.weight);
    const freightClass = parseFloat(ltlForm.freightClass);
    const pallets = parseInt(ltlForm.pallets);

    const baseRate = 250 + (Math.random() * 500);
    const weightMultiplier = Math.max(1, weight / 500);
    const classMultiplier = 1 + ((freightClass - 50) / 100);
    
    let accessorialsCost = 0;
    const accessorialsList = [];
    if (ltlForm.liftgate) {
      accessorialsCost += 75;
      accessorialsList.push("Liftgate");
    }
    if (ltlForm.residential) {
      accessorialsCost += 120;
      accessorialsList.push("Residential");
    }

    const subtotal = baseRate * weightMultiplier * classMultiplier;
    const fuelSurcharge = subtotal * 0.18;
    const total = subtotal + fuelSurcharge + accessorialsCost;

    return {
      type: 'LTL',
      origin: ltlForm.origin,
      destination: ltlForm.destination,
      details: { 
        weight: `${weight} lbs`, 
        class: `Class ${freightClass}`, 
        pallets: `${pallets} pallets`, 
        accessorials: accessorialsList.join(', ') || 'None' 
      },
      quote: {
        base: subtotal.toFixed(2),
        fuel: fuelSurcharge.toFixed(2),
        accessorials: accessorialsCost.toFixed(2),
        total: total.toFixed(2)
      }
    };
  };

  const calculateFTLQuote = (): QuoteData | null => {
    if (!ftlForm.origin || !ftlForm.destination || !ftlForm.equipment) {
      alert('Please fill out all required fields.');
      return null;
    }

    let baseRate = 1800 + (Math.random() * 2000);
    
    // Rate multipliers based on equipment type
    switch(ftlForm.equipment) {
      case 'Reefer':
        baseRate *= 1.25;
        break;
      case 'Flatbed':
        baseRate *= 1.15;
        break;
      case 'Power Only':
        baseRate *= 0.9;
        break;
      case 'Step Deck':
        baseRate *= 1.20;
        break;
      case 'Lowboy':
        baseRate *= 1.80;
        break;
      case 'Hotshot':
        baseRate *= 0.85;
        break;
      case 'Conestoga':
        baseRate *= 1.35;
        break;
      case 'Box Truck':
        baseRate *= 0.95;
        break;
      case 'Sprinter Van':
        baseRate *= 0.75;
        break;
    }

    const fuelSurcharge = baseRate * 0.22;
    const total = baseRate + fuelSurcharge;

    return {
      type: 'FTL',
      origin: ftlForm.origin,
      destination: ftlForm.destination,
      details: { equipment: ftlForm.equipment },
      quote: {
        base: baseRate.toFixed(2),
        fuel: fuelSurcharge.toFixed(2),
        accessorials: "0.00",
        total: total.toFixed(2)
      }
    };
  };

  const calculateSpecializedQuote = (): QuoteData | null => {
    if (!specializedForm.origin || !specializedForm.destination || specializedForm.services.length === 0) {
      alert('Please fill out all required fields and select at least one specialized service.');
      return null;
    }

    let baseRate = 2500 + (Math.random() * 3000);
    let accessorialsCost = 0;

    specializedForm.services.forEach(service => {
      if (service === 'Hazmat') accessorialsCost += 300;
      if (service === 'Refrigerated') accessorialsCost += 450;
      if (service === 'Oversized') accessorialsCost += 1500;
      if (service === 'Team Drivers') accessorialsCost += 1200;
      if (service === 'Flatbed') accessorialsCost += 200;
    });
    
    const fuelSurcharge = (baseRate + accessorialsCost) * 0.25;
    const total = baseRate + accessorialsCost + fuelSurcharge;

    return {
      type: 'Specialized',
      origin: specializedForm.origin,
      destination: specializedForm.destination,
      details: { services: specializedForm.services.join(', ') },
      quote: {
        base: baseRate.toFixed(2),
        fuel: fuelSurcharge.toFixed(2),
        accessorials: accessorialsCost.toFixed(2),
        total: total.toFixed(2)
      }
    };
  };

  const handleGetQuote = async () => {
    setIsLoading(true);
    setQuoteStatus('idle');
    
    // Simulate API call delay for realistic experience
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    let quoteData: QuoteData | null = null;

    try {
      switch (activeTab) {
        case 'ltl':
          quoteData = calculateLTLQuote();
          break;
        case 'ftl':
          quoteData = calculateFTLQuote();
          break;
        case 'specialized':
          quoteData = calculateSpecializedQuote();
          break;
      }

      if (quoteData) {
        const quoteTotal = parseFloat(quoteData.quote.total);
        
        // Show confirmation for high-value quotes
        if (quoteTotal > 5000) {
          setPendingQuote(quoteData);
          setShowConfirmation(true);
          setIsLoading(false);
          return;
        }
        
        // Process quote immediately for smaller amounts
        processQuote(quoteData);
      } else {
        setQuoteStatus('error');
      }
    } catch (error) {
      setQuoteStatus('error');
      console.error('Quote calculation error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const processQuote = (quoteData: QuoteData) => {
    setQuoteResult(quoteData);
    setShowResult(true);
    setQuoteStatus('success');
    saveQuoteToHistory(quoteData);
    
    // Reset status after animation
    setTimeout(() => setQuoteStatus('idle'), 3000);
  };
  
  const confirmHighValueQuote = () => {
    if (pendingQuote) {
      processQuote(pendingQuote);
      setPendingQuote(null);
      setShowConfirmation(false);
    }
  };
  
  const cancelHighValueQuote = () => {
    setPendingQuote(null);
    setShowConfirmation(false);
  };

  const handleSpecializedServiceChange = (service: string, checked: boolean) => {
    setSpecializedForm(prev => ({
      ...prev,
      services: checked 
        ? [...prev.services, service]
        : prev.services.filter(s => s !== service)
    }));
  };

  const getTabButtonClass = (tab: string) => {
    return `py-3 px-4 sm:px-6 border-b-2 font-medium text-sm sm:text-base rounded-t-lg transition-all duration-200 ${
      activeTab === tab
        ? 'bg-blue-600 text-white border-blue-600'
        : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-blue-500'
    }`;
  };

  const getQuoteTypeColor = (type: string) => {
    switch (type) {
      case 'LTL':
        return 'bg-blue-500/30 text-blue-300';
      case 'FTL':
        return 'bg-green-500/30 text-green-300';
      case 'Specialized':
        return 'bg-purple-500/30 text-purple-300';
      default:
        return 'bg-gray-500/30 text-gray-300';
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #9C27B0 0%, #673AB7 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <header style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '30px',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            margin: '0 0 10px 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>💰 Freight Quoting Engine</h1>
          <p style={{
            fontSize: '1.1rem',
            margin: 0,
            opacity: 0.9
          }}>Generate instant quotes for LTL, FTL, and Specialized shipments.</p>
        </header>

        {/* Quick Quote Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '15px',
          padding: '25px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          marginBottom: '30px'
        }}>
          <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <span>⚡</span>
            <span>Quick Quote - Popular Routes</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { route: 'LA ↔ Chicago', desc: 'West Coast to Midwest', price: '$2,450' },
              { route: 'NYC ↔ Miami', desc: 'East Coast Corridor', price: '$1,850' },
              { route: 'Dallas ↔ Atlanta', desc: 'Southern Route', price: '$1,650' }
            ].map((quick, index) => (
              <button
                key={index}
                onClick={() => {
                  const [origin, destination] = quick.route.split(' ↔ ');
                  setLtlForm(prev => ({ ...prev, origin, destination, weight: '1000', pallets: '2', freightClass: '70' }));
                  setActiveTab('ltl');
                }}
                className="bg-gray-800/70 hover:bg-gray-700/70 p-4 rounded-lg border border-gray-600 hover:border-blue-500 transition-all group"
              >
                <div className="text-left">
                  <div className="font-bold text-blue-400 group-hover:text-blue-300">{quick.route}</div>
                  <div className="text-sm text-gray-400 mt-1">{quick.desc}</div>
                  <div className="text-lg font-bold text-green-400 mt-2">Est. {quick.price}</div>
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            💡 Click any route to auto-fill the form with sample data
          </p>
        </div>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quoting Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              {/* Tabs */}
              <nav className="flex border-b border-gray-700 mb-6">
                <button
                  onClick={() => setActiveTab('ltl')}
                  className={getTabButtonClass('ltl')}
                >
                  LTL
                </button>
                <button
                  onClick={() => setActiveTab('ftl')}
                  className={getTabButtonClass('ftl')}
                >
                  FTL
                </button>
                <button
                  onClick={() => setActiveTab('specialized')}
                  className={getTabButtonClass('specialized')}
                >
                  Specialized
                </button>
              </nav>

              {/* Form Panels */}
              <div className="space-y-4">
                {/* LTL Form */}
                {activeTab === 'ltl' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Origin ZIP"
                        value={ltlForm.origin}
                        onChange={(e) => setLtlForm({...ltlForm, origin: e.target.value})}
                        className="bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Destination ZIP"
                        value={ltlForm.destination}
                        onChange={(e) => setLtlForm({...ltlForm, destination: e.target.value})}
                        className="bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="number"
                        placeholder="Total Weight (lbs)"
                        value={ltlForm.weight}
                        onChange={(e) => setLtlForm({...ltlForm, weight: e.target.value})}
                        className="bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        placeholder="# of Pallets"
                        value={ltlForm.pallets}
                        onChange={(e) => setLtlForm({...ltlForm, pallets: e.target.value})}
                        className="bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <select
                        value={ltlForm.freightClass}
                        onChange={(e) => setLtlForm({...ltlForm, freightClass: e.target.value})}
                        className="bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Freight Class</option>
                        {[50, 55, 60, 65, 70, 77.5, 85, 92.5, 100, 110, 125, 150, 175, 200, 250, 300, 400, 500].map(cls => (
                          <option key={cls} value={cls}>{cls}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center space-x-4 pt-2">
                      <label className="flex items-center space-x-2 text-gray-300">
                        <input
                          type="checkbox"
                          checked={ltlForm.liftgate}
                          onChange={(e) => setLtlForm({...ltlForm, liftgate: e.target.checked})}
                          className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-blue-500 focus:ring-blue-500"
                        />
                        <span>Liftgate</span>
                      </label>
                      <label className="flex items-center space-x-2 text-gray-300">
                        <input
                          type="checkbox"
                          checked={ltlForm.residential}
                          onChange={(e) => setLtlForm({...ltlForm, residential: e.target.checked})}
                          className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-blue-500 focus:ring-blue-500"
                        />
                        <span>Residential Delivery</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* FTL Form */}
                {activeTab === 'ftl' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Origin City, State"
                        value={ftlForm.origin}
                        onChange={(e) => setFtlForm({...ftlForm, origin: e.target.value})}
                        className="bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Destination City, State"
                        value={ftlForm.destination}
                        onChange={(e) => setFtlForm({...ftlForm, destination: e.target.value})}
                        className="bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={ftlForm.equipment}
                      onChange={(e) => setFtlForm({...ftlForm, equipment: e.target.value})}
                      className="bg-gray-700 border border-gray-600 rounded-md p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Equipment Type</option>
                      <option value="Dry Van">53' Dry Van</option>
                      <option value="Reefer">53' Reefer</option>
                      <option value="Flatbed">48' Flatbed</option>
                      <option value="Power Only">Power Only</option>
                      <option value="Step Deck">Step Deck</option>
                      <option value="Lowboy">Lowboy</option>
                      <option value="Hotshot">Hotshot</option>
                      <option value="Conestoga">Conestoga</option>
                      <option value="Box Truck">26' Straight Box Truck</option>
                      <option value="Sprinter Van">Sprinter/Cargo Van</option>
                    </select>
                  </div>
                )}

                {/* Specialized Form */}
                {activeTab === 'specialized' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Origin City, State"
                        value={specializedForm.origin}
                        onChange={(e) => setSpecializedForm({...specializedForm, origin: e.target.value})}
                        className="bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Destination City, State"
                        value={specializedForm.destination}
                        onChange={(e) => setSpecializedForm({...specializedForm, destination: e.target.value})}
                        className="bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="pt-2">
                      <h3 className="text-lg font-medium text-gray-300 mb-2">Specialized Services</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {['Hazmat', 'Refrigerated', 'Oversized', 'Flatbed', 'Team Drivers'].map((service) => (
                          <label key={service} className="flex items-center space-x-2 p-3 bg-gray-700 rounded-md">
                            <input
                              type="checkbox"
                              checked={specializedForm.services.includes(service)}
                              onChange={(e) => handleSpecializedServiceChange(service, e.target.checked)}
                              className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-blue-500 focus:ring-blue-500"
                            />
                            <span>{service}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <button
                  onClick={handleGetQuote}
                  disabled={isLoading}
                  className={`w-full relative overflow-hidden font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg transform hover:scale-[1.02] hover:shadow-xl ${
                    isLoading 
                      ? 'bg-gray-500 cursor-not-allowed shimmer-background'
                      : quoteStatus === 'success'
                      ? 'bg-green-600 hover:bg-green-700 animate-success-pulse'
                      : quoteStatus === 'error'
                      ? 'bg-red-600 hover:bg-red-700 animate-error-shake'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 quote-button-shine'
                  } text-white`}
                >
                  {/* Animated background overlay for loading */}
                  {isLoading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 animate-pulse"></div>
                  )}
                  
                  {/* Shine effect for normal state */}
                  {!isLoading && quoteStatus === 'idle' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-30 transform -skew-x-12 transition-opacity duration-500"></div>
                  )}
                  
                  {/* Button content */}
                  <div className="relative flex items-center justify-center space-x-2">
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Calculating Quote...</span>
                        <div className="animate-bounce text-xl">💫</div>
                      </>
                    ) : quoteStatus === 'success' ? (
                      <>
                        <span className="text-xl animate-bounce">✅</span>
                        <span>Quote Generated!</span>
                        <span className="text-xl animate-bounce">🎉</span>
                      </>
                    ) : quoteStatus === 'error' ? (
                      <>
                        <span className="text-xl">❌</span>
                        <span>Try Again</span>
                        <span className="text-xl">🔄</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xl animate-pulse">💰</span>
                        <span>Get Instant Quote</span>
                        <span className="text-xl animate-pulse">⚡</span>
                      </>
                    )}
                  </div>
                  
                  {/* Success pulse animation ring */}
                  {quoteStatus === 'success' && (
                    <div className="absolute inset-0 rounded-lg border-2 border-green-300 animate-ping opacity-75"></div>
                  )}
                </button>
                
                {/* Quote processing tips with dynamic content */}
                <div className="mt-3 text-center">
                  <p className="text-xs text-gray-400 transition-all duration-300">
                    {isLoading ? (
                      <span className="animate-pulse">🔄 Analyzing routes and calculating optimal pricing...</span>
                    ) : quoteStatus === 'success' ? (
                      <span className="text-green-400">✨ Quote ready! Save to history or generate documents.</span>
                    ) : quoteStatus === 'error' ? (
                      <span className="text-red-400">⚠️ Please check all required fields and try again.</span>
                    ) : (
                      <span>💡 Get instant freight quotes with real-time market pricing</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Quote Result Display */}
              {showResult && quoteResult && (
                <div className="mt-6 animate-fadeIn">
                  <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-white">{quoteResult.type} Quote Result</h3>
                        <p className="text-sm text-gray-400">{quoteResult.origin} to {quoteResult.destination}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-extrabold text-green-400">${quoteResult.quote.total}</p>
                        <p className="text-xs text-gray-400">Total Estimated Cost</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-600 space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-400">Base Rate:</span> <span className="font-medium">${quoteResult.quote.base}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Fuel Surcharge:</span> <span className="font-medium">${quoteResult.quote.fuel}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Accessorials/Services:</span> <span className="font-medium">${quoteResult.quote.accessorials}</span></div>
                    </div>
                    {/* Reference Links Section */}
                    <div className="mt-4 pt-4 border-t border-gray-600">
                      <h4 className="text-sm font-medium text-gray-300 text-center mb-3">Compare with live market rates:</h4>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <a 
                          href="https://www.freightquote.com/" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex-1 text-center bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                        >
                          Check on Freightquote.com
                        </a>
                        <a 
                          href="https://www.freightos.com/freight-resources/freight-rate-free-calculator/" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex-1 text-center bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                        >
                          Check on Freightos.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quote History Section */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 h-full">
              <h2 className="text-2xl font-bold mb-4">Quote History</h2>
              <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
                {quoteHistory.length === 0 ? (
                  <p className="text-gray-400">No past quotes found.</p>
                ) : (
                  quoteHistory.map((quote, index) => (
                    <div key={index} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getQuoteTypeColor(quote.type)}`}>
                            {quote.type}
                          </span>
                          <p className="font-semibold mt-1">{quote.origin} to {quote.destination}</p>
                        </div>
                        <p className="font-bold text-lg text-green-400">${quote.quote.total}</p>
                      </div>
                      <div className="mt-2">
                        {quote.type === 'LTL' && (
                          <p className="text-xs text-gray-400">{quote.details.weight}, {quote.details.class}, {quote.details.pallets}</p>
                        )}
                        {quote.type === 'FTL' && (
                          <p className="text-xs text-gray-400">{quote.details.equipment}</p>
                        )}
                        {quote.type === 'Specialized' && (
                          <p className="text-xs text-gray-400 truncate">{quote.details.services}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* High Value Quote Confirmation Modal */}
      {showConfirmation && pendingQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl max-w-md w-full border border-yellow-500">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-4xl">⚠️</div>
                <div>
                  <h3 className="text-xl font-bold text-yellow-400">High Value Quote</h3>
                  <p className="text-sm text-gray-400">Confirmation Required</p>
                </div>
              </div>
              
              {/* Quote Details */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Quote Total:</span>
                  <span className="text-2xl font-bold text-yellow-400">${pendingQuote.quote.total}</span>
                </div>
                <div className="text-sm text-gray-400">
                  <p>{pendingQuote.type} • {pendingQuote.origin} → {pendingQuote.destination}</p>
                </div>
              </div>
              
              {/* Warning Message */}
              <div className="bg-yellow-900 bg-opacity-50 border border-yellow-700 rounded-lg p-4 mb-6">
                <p className="text-yellow-200 text-sm">
                  <strong>Notice:</strong> This quote exceeds $5,000. Please review the details carefully 
                  and ensure all shipment requirements are accurate before proceeding.
                </p>
              </div>
              
              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={cancelHighValueQuote}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmHighValueQuote}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Confirm Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
