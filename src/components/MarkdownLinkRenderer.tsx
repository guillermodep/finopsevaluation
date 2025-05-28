// src/components/MarkdownLinkRenderer.tsx
import React from 'react';

interface MarkdownLinkRendererProps {
  textWithLinks: string;
  className?: string;
}

const MarkdownLinkRenderer: React.FC<MarkdownLinkRendererProps> = ({ textWithLinks, className }) => {
  const parts = textWithLinks.split(/(\[.*?\]\(.*?\))/g);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        const match = part.match(/\[(.*?)\]\((.*?)\)/);
        if (match) {
          const linkText = match[1];
          const linkUrl = match[2];
          return (
            <a 
              key={index} 
              href={linkUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
            >
              {linkText}
            </a>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
};

export default MarkdownLinkRenderer;
