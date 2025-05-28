'use client';

import { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  text: string;
  children?: React.ReactNode; // Optional: if you want to wrap other elements
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({
  text,
  children,
  position = 'top',
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  // Optional: Close tooltip if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [tooltipRef, triggerRef]);

  let positionClasses = '';
  switch (position) {
    case 'top':
      positionClasses = 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      break;
    case 'bottom':
      positionClasses = 'top-full left-1/2 -translate-x-1/2 mt-2';
      break;
    case 'left':
      positionClasses = 'right-full top-1/2 -translate-y-1/2 mr-2';
      break;
    case 'right':
      positionClasses = 'left-full top-1/2 -translate-y-1/2 ml-2';
      break;
  }

  return (
    <span className="relative inline-flex items-center" ref={triggerRef}>
      {children || (
        <span
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
          onClick={() => setIsVisible(!isVisible)} // Toggle on click for touch devices
          className="cursor-pointer ml-1 text-blue-300 hover:text-blue-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
        </span>
      )}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-10 w-64 p-3 text-sm font-normal text-white bg-gray-800 rounded-lg shadow-lg ${positionClasses} border border-gray-700`}
        >
          {text}
          {/* Arrow (optional, makes it look nicer) */}
          {position === 'top' && <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-800"></div>}
          {position === 'bottom' && <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-gray-800"></div>}
        </div>
      )}
    </span>
  );
}
