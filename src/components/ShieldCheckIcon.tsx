// src/components/ShieldCheckIcon.tsx
import React from 'react';

const ShieldCheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622A11.99 11.99 0 0018.402 6a11.959 11.959 0 01-1.046-3.036m-4.036-1.405A12.002 12.002 0 0012 2.75c-1.136 0-2.23.146-3.274.418m6.548 1.405a11.932 11.932 0 01-3.274 0M12 18.75v-2.25m0-10.5V3.75M3.274 6A12.036 12.036 0 001.5 9.75c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623a12.036 12.036 0 00-1.774-3.75m-14.452 0a11.965 11.965 0 003.274 0M3 9.75L3.274 6M20.726 6L21 9.75M12 2.75v13.5M12 2.75c-2.118 0-4.132.624-5.854 1.702M12 2.75c2.118 0 4.132.624 5.854 1.702"
    />
  </svg>
);

export default ShieldCheckIcon;
