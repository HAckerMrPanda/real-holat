'use client';

import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';

export default function DemoModeToggle() {
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('demo_mode') === 'true';
    setIsDemo(stored);
  }, []);

  const toggle = () => {
    const newValue = !isDemo;
    setIsDemo(newValue);
    localStorage.setItem('demo_mode', String(newValue));
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggle}
        className={`flex items-center space-x-2 px-4 py-2 rounded-full shadow-lg font-bold text-xs transition-colors ${
          isDemo ? 'bg-orange-500 text-white' : 'bg-white text-gray-400 border border-gray-200'
        }`}
      >
        <Settings size={14} className={isDemo ? 'animate-spin-slow' : ''} />
        <span>{isDemo ? 'DEMO MODE ON' : 'DEMO MODE OFF'}</span>
      </button>
    </div>
  );
}
