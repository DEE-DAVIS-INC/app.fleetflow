'use client';

import React, { useState } from 'react';
import { smsService, type SMSResponse } from '../services/sms';

export default function SMSTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SMSResponse | null>(null);
  const [serviceStatus, setServiceStatus] = useState<any>(null);
  const [customPhone, setCustomPhone] = useState('+15551234567');
  const [customMessage, setCustomMessage] = useState('');

  const checkServiceStatus = async () => {
    try {
      const status = await smsService.getServiceStatus();
      setServiceStatus(status);
    } catch (error) {
      console.error('Service status error:', error);
    }
  };

  const sendTestSMS = async () => {
    setIsLoading(true);
    try {
      const result = await smsService.sendTestSMS();
      setResult(result);
    } catch (error) {
      console.error('Test SMS error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendCustomSMS = async () => {
    if (!customPhone || !customMessage) {
      alert('Please enter both phone number and message');
      return;
    }

    setIsLoading(true);
    try {
      const mockLoad = smsService.getMockLoadData();
      const customRecipient = [{
        id: 'custom-test',
        name: 'Test User',
        phone: customPhone,
        type: 'driver' as const
      }];

      const result = await smsService.sendCustomMessage(
        mockLoad,
        customRecipient,
        customMessage,
        'normal'
      );
      setResult(result);
    } catch (error) {
      console.error('Custom SMS error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    checkServiceStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold">SMS Integration Test</h1>
          <p className="text-gray-400 mt-2">Test FleetFlow SMS notifications</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Status */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">📊</span>
              Service Status
            </h2>
            
            {serviceStatus ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`font-bold ${serviceStatus.status === 'online' ? 'text-green-400' : 'text-red-400'}`}>
                    {serviceStatus.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Twilio Configured:</span>
                  <span className={`font-bold ${serviceStatus.twilioConfigured ? 'text-green-400' : 'text-yellow-400'}`}>
                    {serviceStatus.twilioConfigured ? 'Yes' : 'No (Mock Mode)'}
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-gray-400">Available Templates:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {serviceStatus.availableTemplates?.map((template: string) => (
                      <span key={template} className="bg-blue-600 px-2 py-1 rounded text-xs">
                        {template}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                <p className="mt-2">Checking service status...</p>
              </div>
            )}

            <button
              onClick={checkServiceStatus}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded transition-colors"
            >
              Refresh Status
            </button>
          </div>

          {/* Test Controls */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">🧪</span>
              Test SMS
            </h2>

            <div className="space-y-4">
              {/* Quick Test */}
              <div>
                <button
                  onClick={sendTestSMS}
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 py-3 px-4 rounded transition-colors font-bold"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </span>
                  ) : (
                    'Send Test SMS'
                  )}
                </button>
                <p className="text-xs text-gray-400 mt-1">
                  Sends a mock load notification to test numbers
                </p>
              </div>

              {/* Custom SMS */}
              <div className="border-t border-gray-700 pt-4">
                <label className="block text-sm font-medium mb-2">Custom Phone Number:</label>
                <input
                  type="tel"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  placeholder="+15551234567"
                />

                <label className="block text-sm font-medium mb-2 mt-3">Custom Message:</label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white h-24"
                  placeholder="Enter your custom SMS message here..."
                />

                <button
                  onClick={sendCustomSMS}
                  disabled={isLoading || !customPhone || !customMessage}
                  className="w-full mt-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 py-2 px-4 rounded transition-colors"
                >
                  Send Custom SMS
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">📋</span>
              SMS Results
            </h2>

            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-400">{result.summary.total}</div>
                  <div className="text-sm text-gray-400">Total</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">{result.summary.sent}</div>
                  <div className="text-sm text-gray-400">Sent</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400">{result.summary.failed}</div>
                  <div className="text-sm text-gray-400">Failed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">${result.summary.totalCost.toFixed(3)}</div>
                  <div className="text-sm text-gray-400">Cost</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {result.results.map((res, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{res.recipientId}</span>
                      <span className="text-sm text-gray-400 ml-2">(SMS)</span>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-bold ${
                      res.status === 'sent' ? 'bg-green-600' : 
                      res.status === 'failed' ? 'bg-red-600' : 'bg-yellow-600'
                    }`}>
                      {res.status.toUpperCase()}
                    </div>
                  </div>
                  {res.messageId && (
                    <div className="text-xs text-gray-400 mt-1">ID: {res.messageId}</div>
                  )}
                  {res.error && (
                    <div className="text-xs text-red-400 mt-1">Error: {res.error}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
