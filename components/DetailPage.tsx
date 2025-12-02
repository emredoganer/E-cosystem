import React, { useMemo } from 'react';
import { DirectoryItem, Category } from '../types';
import { ArrowLeftIcon, GlobeIcon, ExternalLinkIcon } from './Icon';
import { DIRECTORY_DATA } from '../constants';
import { DirectoryCard } from './DirectoryCard';

interface DetailPageProps {
  item: DirectoryItem;
  onBack: () => void;
  onItemClick: (item: DirectoryItem) => void;
}

export const DetailPage: React.FC<DetailPageProps> = ({ item, onBack, onItemClick }) => {

  const usedByBrands = useMemo(() => {
    if (item.category !== Category.TOOL) return [];
    return DIRECTORY_DATA.filter(d => 
      d.category === Category.BRAND && 
      d.techStack?.some(t => t.name.toLowerCase() === item.name.toLowerCase())
    );
  }, [item]);

  const brandTechStackItems = useMemo(() => {
    if (item.category !== Category.BRAND || !item.techStack) return [];
    
    return item.techStack.map(stackItem => {
      const toolInDirectory = DIRECTORY_DATA.find(d => 
        d.category === Category.TOOL && 
        d.name.toLowerCase() === stackItem.name.toLowerCase()
      );
      return {
        ...stackItem,
        directoryItem: toolInDirectory
      };
    });
  }, [item]);

  // Calculate Similar Items based on shared tags
  const similarItems = useMemo(() => {
    return DIRECTORY_DATA.filter(d => 
      d.id !== item.id && // Exclude self
      d.category === item.category // Same category
    )
    .map(d => ({
      item: d,
      // Calculate relevance score based on number of matching tags
      score: d.tags.filter(tag => item.tags.includes(tag)).length
    }))
    .sort((a, b) => b.score - a.score) // Sort by relevance desc
    .slice(0, 4) // Take top 4
    .map(wrapper => wrapper.item);
  }, [item]);

  return (
    <div className="min-h-screen bg-blueprint-bg bg-grid animate-in fade-in duration-300 font-mono">
      
      {/* Navbar */}
      <div className="bg-white border-b border-blueprint-border sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-black hover:text-neon transition-colors text-xs font-bold uppercase tracking-widest group"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Return to Index</span>
          </button>
          
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
             <span className="w-2 h-2 bg-neon border border-black"></span>
             MODULE: {item.category}
          </div>
        </div>
      </div>

      <main className="max-w-screen-xl mx-auto px-6 py-12">
        
        {/* Specification Header */}
        <div className="bg-white border border-blueprint-border p-8 md:p-12 mb-8 shadow-hard relative overflow-hidden">
           {/* Decorative corner marker */}
           <div className="absolute top-0 right-0 p-2 bg-black text-white text-[10px] font-bold">
             ID: {item.id}
           </div>

           <div className="flex flex-col md:flex-row gap-8 md:items-start">
             <div className="w-32 h-32 bg-gray-50 border border-blueprint-border flex items-center justify-center p-4 flex-shrink-0">
                <img src={item.logoUrl} alt={item.name} className="w-full h-full object-contain grayscale" />
             </div>
             
             <div className="flex-1">
               <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 tracking-tighter uppercase">{item.name}</h1>
               <div className="w-full h-px bg-gray-200 my-4"></div>
               <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-3xl mb-6 font-mono">
                 {item.description}
               </p>
               
               <div className="flex flex-wrap gap-2 mb-8">
                 {item.tags.map(tag => (
                   <span key={tag} className="px-2 py-1 bg-black text-neon border border-black text-[10px] font-bold uppercase">
                     {tag}
                   </span>
                 ))}
               </div>

               <a 
                 href={item.websiteUrl} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 px-6 py-3 border-2 border-black text-black hover:bg-black hover:text-white transition-all font-bold text-xs uppercase tracking-widest"
               >
                 <GlobeIcon className="w-4 h-4" />
                 Initialize Link
                 <ExternalLinkIcon className="w-3 h-3 ml-1" />
               </a>
             </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Sidebar Data */}
           <div className="space-y-6">
              <div className="bg-white border border-blueprint-border p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                 <h3 className="font-bold text-black mb-4 text-xs uppercase tracking-widest border-b border-gray-200 pb-2">
                   System Metadata
                 </h3>
                 <div className="space-y-4 text-xs">
                    {item.pricingModel && (
                      <div>
                        <span className="block text-gray-400 font-bold mb-1">PRICING_MODEL</span>
                        <span className="font-medium">{item.pricingModel}</span>
                      </div>
                    )}
                    
                    <div>
                      <span className="block text-gray-400 font-bold mb-1">CATEGORY_TYPE</span>
                      <span className="font-medium">{item.category}</span>
                    </div>

                    {item.partners && item.partners.length > 0 && (
                       <div>
                         <span className="block text-gray-400 font-bold mb-1">CERTIFICATIONS</span>
                         <ul className="list-square list-inside text-gray-600 space-y-1">
                           {item.partners.map((p, i) => <li key={i}>- {p}</li>)}
                         </ul>
                       </div>
                    )}
                 </div>
              </div>
           </div>

           {/* Content Area */}
           <div className="lg:col-span-2 space-y-8">
              
              {/* BRAND: Tech Stack */}
              {item.category === Category.BRAND && brandTechStackItems.length > 0 && (
                <div className="bg-white border border-blueprint-border p-8">
                   <h2 className="text-xl font-bold text-black mb-6 uppercase border-l-4 border-neon pl-4">Connected Infrastructure</h2>
                   <div className="grid grid-cols-1 gap-0 border border-gray-200">
                      {brandTechStackItems.map((tech, idx) => (
                        <div 
                          key={idx}
                          onClick={() => tech.directoryItem && onItemClick(tech.directoryItem)}
                          className={`p-4 flex items-center justify-between border-b border-gray-200 last:border-b-0 transition-colors
                            ${tech.directoryItem 
                              ? 'hover:bg-gray-50 cursor-pointer group' 
                              : 'bg-gray-50/30 cursor-default'
                            }
                          `}
                        >
                           <div className="flex items-center gap-4">
                             <div className="text-[10px] font-bold text-gray-400 w-6 text-right">0{idx + 1}</div>
                             <div>
                               <div className="font-bold text-sm text-black group-hover:text-neon-dark">{tech.name}</div>
                               <div className="text-[10px] text-gray-500 uppercase">{tech.category}</div>
                             </div>
                           </div>
                           {tech.directoryItem && (
                             <div className="opacity-0 group-hover:opacity-100 text-xs font-bold uppercase flex items-center gap-1 text-black">
                               View Spec <ArrowLeftIcon className="w-3 h-3 rotate-180" />
                             </div>
                           )}
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {/* TOOL: Used By */}
              {item.category === Category.TOOL && usedByBrands.length > 0 && (
                <div className="bg-white border border-blueprint-border p-8">
                   <h2 className="text-xl font-bold text-black mb-6 uppercase border-l-4 border-neon pl-4">Deployed On</h2>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {usedByBrands.map((brand) => (
                        <div 
                          key={brand.id}
                          onClick={() => onItemClick(brand)}
                          className="group p-4 border border-blueprint-border hover:bg-black hover:text-white cursor-pointer transition-all flex flex-col items-center text-center"
                        >
                           <img src={brand.logoUrl} alt={brand.name} className="w-10 h-10 object-contain mb-3 grayscale group-hover:invert transition-all" />
                           <span className="font-bold text-xs uppercase">{brand.name}</span>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {/* AGENCY: Services */}
              {item.category === Category.AGENCY && item.services && (
                <div className="bg-white border border-blueprint-border p-8">
                   <h2 className="text-xl font-bold text-black mb-6 uppercase border-l-4 border-neon pl-4">Operational Capabilities</h2>
                   <div className="flex flex-wrap gap-2">
                      {item.services.map((service, idx) => (
                        <div key={idx} className="px-3 py-2 border border-black text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors cursor-default">
                          [ {service} ]
                        </div>
                      ))}
                   </div>
                   
                   <div className="mt-8 border-t-2 border-dashed border-gray-300 pt-6">
                      <h4 className="font-bold text-black mb-2 text-sm uppercase">Collaboration Request</h4>
                      <p className="text-xs text-gray-600 mb-4">
                        Initiate handshake protocol via official channels.
                      </p>
                      <a 
                        href={item.websiteUrl}
                        target="_blank"
                        className="text-xs font-bold text-white bg-black px-4 py-2 hover:bg-neon hover:text-black uppercase"
                      >
                        Contact Agency
                      </a>
                   </div>
                </div>
              )}

           </div>
        </div>
        
        {/* SIMILAR ITEMS SECTION */}
        {similarItems.length > 0 && (
          <div className="mt-16 border-t border-dashed border-gray-400 pt-12">
            <h3 className="text-2xl font-bold text-black mb-8 uppercase tracking-tighter">
              Related {item.category} Systems
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarItems.map((similar) => (
                <DirectoryCard 
                  key={similar.id} 
                  item={similar} 
                  onClick={onItemClick} 
                />
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};