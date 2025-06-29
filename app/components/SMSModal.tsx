'use client';

import React, { useState } from 'react';

interface SMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (phone: string, message: string) => void;
  title: string;
  defaultMessage?: string;
}

export default function SMSModal({ isOpen, onClose, onSend, title, defaultMessage = '' }: SMSModalProps) {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(defaultMessage);
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!phone || !message) {
      alert('Please enter both phone number and message');
      return;
    }

    setIsSending(true);
    try {
      await onSend(phone, message);
      setPhone('');
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Error sending SMS:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <span className="mr-2">📱</span>
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1234567890"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              maxLength={160}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="Enter your message..."
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {message.length}/160 characters
            </div>
          </div>

          {/* Quick Templates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Templates
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setMessage('Your load has been assigned. Please check the FleetFlow app for details.')}
                className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg transition-colors"
              >
                Load Assigned
              </button>
              <button
                onClick={() => setMessage('Load status updated. Please check FleetFlow for current information.')}
                className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg transition-colors"
              >
                Status Update
              </button>
              <button
                onClick={() => setMessage('URGENT: Please contact dispatch immediately regarding your current load.')}
                className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg transition-colors"
              >
                Emergency
              </button>
              <button
                onClick={() => setMessage('Your documents are ready for pickup. Please visit FleetFlow portal.')}
                className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-2 rounded-lg transition-colors"
              >
                Documents Ready
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={isSending || !phone || !message}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>📱</span>
                  <span>Send SMS</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
