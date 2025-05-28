// src/components/TableCellsIcon.tsx
import React from 'react';

const TableCellsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125V6.375m19.5 0V18.375a1.125 1.125 0 01-1.125 1.125m-17.25 0h.008v.008H3.375v-.008zm0-13.125h17.25m-17.25 0A1.125 1.125 0 012.25 5.25V3.375m19.5 0V5.25A1.125 1.125 0 0119.5 6.375m-17.25 0h17.25M3.375 10.875h17.25M3.375 15.125h17.25M3.375 6.375V3.375m0 3h.008v.008H3.375V6.375zm0 4.5h.008v.008H3.375v-.008zm0 4.25h.008v.008H3.375v-.008zm17.25-13.125V3.375m0 3h-.008v.008H20.625V6.375zm0 4.5h-.008v.008H20.625v-.008zm0 4.25h-.008v.008H20.625v-.008z" 
    />
  </svg>
);

export default TableCellsIcon;
