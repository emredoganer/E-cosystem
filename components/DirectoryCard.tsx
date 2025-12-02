import React from 'react';
import { DirectoryItem, Category } from '../types';
import { ArrowRightIcon } from './Icon';

interface DirectoryCardProps {
  item: DirectoryItem;
  onClick: (item: DirectoryItem) => void;
}

export const DirectoryCard: React.FC<DirectoryCardProps> = ({ item, onClick }) => {
  return (
    <div 
      onClick={() => onClick(item)}
      className="group relative flex flex-col h-full bg-white border border-blueprint-border cursor-pointer hover:shadow-hard transition-all duration-200"
    >
      {/* CAD Corner Markers */}
      <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-blueprint-border z-10"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-blueprint-border z-10"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-blueprint-border z-10"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-blueprint-border z-10"></div>

      {/* Header / ID Strip */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-blueprint-border bg-gray-50">
        <span className="font-mono text-[10px] text-gray-500 uppercase">ID: {item.id.toUpperCase()}</span>
        <div className={`w-2 h-2 rounded-full ${item.category === Category.BRAND ? 'bg-black' : item.category === Category.TOOL ? 'bg-blue-600' : 'bg-orange-500'}`}></div>
      </div>

      {/* Image / Logo Section */}
      <div className="relative h-40 bg-white flex items-center justify-center p-6 border-b border-blueprint-border overflow-hidden">
         {/* Grid overlay for the image area */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:10px_10px]"></div>
         
         <img 
           src={item.logoUrl} 
           alt={item.name} 
           className="relative z-10 w-20 h-20 object-contain grayscale group-hover:grayscale-0 transition-all duration-300" 
         />
      </div>

      {/* Content Section */}
      <div className="flex-1 p-5 flex flex-col">
        
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-mono font-bold text-blueprint-text group-hover:text-neon-dark transition-colors uppercase tracking-tight">
            {item.name}
          </h3>
        </div>
        
        <p className="text-xs font-mono text-gray-600 leading-relaxed mb-6 line-clamp-3">
          {item.description}
        </p>

        {/* Tech Stack / Services Preview */}
        <div className="mt-auto space-y-4">
          
          {(item.techStack || item.services) && (
             <div className="border-t border-dashed border-gray-300 pt-3">
                <span className="block text-[9px] font-mono text-gray-400 uppercase mb-2">
                   {item.techStack ? 'Linked Modules:' : 'Capabilities:'}
                </span>
                <div className="flex flex-wrap gap-1">
                  {(item.techStack || item.services || []).slice(0, 3).map((subItem, i) => (
                    <span key={i} className="text-[10px] font-mono bg-gray-100 border border-gray-300 text-black px-1.5 py-0.5">
                      {typeof subItem === 'string' ? subItem : subItem.name}
                    </span>
                  ))}
                  {(item.techStack || item.services || []).length > 3 && (
                    <span className="text-[10px] font-mono bg-black text-neon px-1.5 py-0.5">
                       +{(item.techStack || item.services || []).length - 3}
                    </span>
                  )}
                </div>
             </div>
          )}
          
          {/* Tags Footer */}
          <div className="pt-3 flex flex-wrap gap-2">
            {item.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[9px] font-mono font-bold text-gray-400 uppercase">
                [{tag}]
              </span>
            ))}
          </div>

        </div>
      </div>
      
      {/* Action Strip */}
      <div className="p-2 border-t border-blueprint-border flex justify-end bg-blueprint-text group-hover:bg-neon transition-colors duration-200">
         <ArrowRightIcon className="w-4 h-4 text-white group-hover:text-black" />
      </div>
    </div>
  );
};