'use client';

export default function TestPage() {
  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Runtime Error Test</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-green-600 font-semibold">✅ Page is rendering correctly</p>
        <p className="text-gray-600 mt-2">If you can see this, the basic React setup is working.</p>
        <div className="mt-4 p-4 bg-blue-50 rounded">
          <p className="text-blue-700">Current time: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
