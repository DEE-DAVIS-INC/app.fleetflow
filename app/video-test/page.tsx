'use client';

export default function VideoTest() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Video Test Page</h1>
      
      {/* Test 1: Simple video tag */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Test 1: Simple Video</h2>
        <video 
          controls 
          width="400" 
          height="200"
          className="border-2 border-red-500"
        >
          <source src="/videos/dispatch-hero.mp4" type="video/mp4" />
          Video not supported
        </video>
      </div>

      {/* Test 2: Auto-play video */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Test 2: Auto-play Video</h2>
        <video 
          autoPlay
          muted
          loop
          width="400" 
          height="200"
          className="border-2 border-blue-500"
        >
          <source src="/videos/dispatch-hero.mp4" type="video/mp4" />
          Video not supported
        </video>
      </div>

      {/* Test 3: Direct link */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Test 3: Direct Link</h2>
        <a 
          href="/videos/dispatch-hero.mp4" 
          target="_blank"
          className="text-blue-600 underline"
        >
          Click to open video directly
        </a>
      </div>

      {/* Test 4: Background image to see if element renders */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Test 4: Background Color Test</h2>
        <div 
          className="w-96 h-48 bg-gradient-to-r from-purple-500 to-pink-500 border-4 border-green-500 flex items-center justify-center text-white font-bold"
        >
          THIS SHOULD BE VISIBLE
        </div>
      </div>
    </div>
  );
}
