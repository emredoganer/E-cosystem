
import React, { useState, useMemo } from 'react';
import { DIRECTORY_DATA } from './constants';
import { Category, DirectoryItem, FilterState, Submission } from './types';
import { DirectoryCard } from './components/DirectoryCard';
import { DetailPage } from './components/DetailPage';
import { SearchIcon, SparklesIcon, BoltIcon, PlusIcon } from './components/Icon';
import { ChatAssistant } from './components/ChatAssistant';
import { NewsletterPromo } from './components/NewsletterPromo';
import { AdminPanel } from './components/AdminPanel';
import { SubmissionForm } from './components/SubmissionForm';

function App() {
  // Global State (In a real app, this would be in Context or Redux/Zustand)
  const [directoryData, setDirectoryData] = useState<DirectoryItem[]>(DIRECTORY_DATA);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  
  // Navigation State
  const [view, setView] = useState<'public' | 'admin' | 'submit'>('public');

  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    searchQuery: '',
    selectedTag: null
  });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DirectoryItem | null>(null);

  // --- CRUD Handlers ---
  const handleUpdateItem = (updatedItem: DirectoryItem) => {
    setDirectoryData(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };
  const handleDeleteItem = (id: string) => {
    setDirectoryData(prev => prev.filter(item => item.id !== id));
  };
  const handleAddItem = (newItem: DirectoryItem) => {
    setDirectoryData(prev => [...prev, newItem]);
  };
  const handleSubmission = (item: DirectoryItem) => {
    const newSubmission: Submission = {
      id: `sub-${Date.now()}`,
      timestamp: Date.now(),
      status: 'pending',
      data: item
    };
    setSubmissions(prev => [newSubmission, ...prev]);
  };
  const handleApproveSubmission = (sub: Submission) => {
    handleAddItem(sub.data);
    setSubmissions(prev => prev.filter(s => s.id !== sub.id));
  };
  const handleRejectSubmission = (id: string) => {
    setSubmissions(prev => prev.filter(s => s.id !== id));
  };

  // Filter Logic
  const categoryItems = useMemo(() => {
    return directoryData.filter(item => {
      const matchesCategory = filters.category === 'All' || item.category === filters.category;
      const matchesSearch = item.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(filters.searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [filters.category, filters.searchQuery, directoryData]);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    categoryItems.forEach(item => {
      item.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [categoryItems]);

  const displayedItems = useMemo(() => {
    if (!filters.selectedTag) return categoryItems;
    return categoryItems.filter(item => item.tags.includes(filters.selectedTag!));
  }, [categoryItems, filters.selectedTag]);

  // Handlers
  const handleCategoryChange = (cat: Category | 'All') => {
    setFilters({ category: cat, searchQuery: '', selectedTag: null });
    setSelectedItem(null);
  };

  const handleTagClick = (tag: string) => {
    setFilters(prev => ({ ...prev, selectedTag: prev.selectedTag === tag ? null : tag }));
  };

  const handleItemClick = (item: DirectoryItem) => {
    setSelectedItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- VIEW RENDERERS ---

  if (view === 'admin') {
    return (
      <AdminPanel 
        data={directoryData} 
        submissions={submissions}
        onUpdate={handleUpdateItem}
        onDelete={handleDeleteItem}
        onAdd={handleAddItem}
        onApproveSubmission={handleApproveSubmission}
        onRejectSubmission={handleRejectSubmission}
        onExit={() => setView('public')}
      />
    );
  }

  if (view === 'submit') {
    return (
      <SubmissionForm 
        onBack={() => setView('public')} 
        onSubmit={handleSubmission}
      />
    );
  }

  // --- RENDER DETAIL VIEW ---
  if (selectedItem) {
    return (
      <div className="font-mono text-blueprint-text bg-grid min-h-screen flex flex-col">
         <div className="flex-1">
            <DetailPage 
              item={selectedItem} 
              onBack={() => setSelectedItem(null)} 
              onItemClick={handleItemClick}
            />
         </div>
         
         {/* Insert Newsletter Promo at bottom of Detail Page too */}
         <NewsletterPromo />
         
         <footer className="border-t border-blueprint-border bg-black text-white font-mono text-xs">
            <div className="max-w-screen-xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="uppercase opacity-50">
                 E-COSYSTEM DATABASE © {new Date().getFullYear()}
              </div>
              <div className="flex items-center gap-2 text-neon">
                 <BoltIcon className="w-3 h-3" />
                 <span className="font-bold tracking-widest">POWERED BY SYSTEM CORE: SADECE TICARET</span>
              </div>
            </div>
         </footer>

         <ChatAssistant isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
         
         <div className="fixed bottom-8 right-8 z-50">
            <button 
               onClick={() => setIsChatOpen(true)}
               className="bg-black text-white p-4 border border-neon hover:bg-neon hover:text-black transition-colors shadow-hard"
            >
              <SparklesIcon className="w-6 h-6" />
            </button>
         </div>
      </div>
    );
  }

  // --- RENDER LISTING VIEW ---
  return (
    <div className="min-h-screen font-mono text-blueprint-text bg-blueprint-bg bg-grid selection:bg-neon selection:text-black flex flex-col">
      
      {/* Technical Header */}
      <nav className="w-full bg-white border-b border-blueprint-border h-16 flex items-center justify-between px-6 md:px-12 sticky top-0 z-50">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => handleCategoryChange('All')}>
            <div className="w-4 h-4 bg-neon border border-black animate-pulse"></div>
            <span className="font-bold text-lg tracking-tighter uppercase">
              e-cosystem<span className="text-gray-400">_v2.1</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
             <button 
               onClick={() => setView('submit')}
               className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase hover:text-neon transition-colors"
             >
               <PlusIcon className="w-3 h-3" /> Submit Request
             </button>
             
             {/* Secret-ish Admin Button for Demo */}
             <button 
               onClick={() => setView('admin')}
               className="text-[10px] text-gray-400 hover:text-black uppercase font-bold"
             >
               SYS.ADMIN
             </button>

             <div className="w-px h-4 bg-gray-300 mx-2"></div>

             <button 
               onClick={() => setIsChatOpen(true)}
               className="flex items-center gap-2 bg-black text-white px-4 py-1.5 hover:bg-neon hover:text-black transition-colors text-xs font-bold uppercase tracking-wider"
             >
               <SparklesIcon className="w-3 h-3" />
               <span>Terminal</span>
            </button>
          </div>
      </nav>

      {/* Hero "Spec Sheet" */}
      <header className="px-6 md:px-12 py-16 max-w-screen-2xl mx-auto w-full border-b border-dashed border-gray-400">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
           <div>
             <div className="inline-block border border-blueprint-border bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-widest mb-4">
               Directory_Protocol
             </div>
             <h1 className="text-5xl md:text-7xl font-bold leading-none tracking-tighter mb-6 uppercase">
                Turkish<br/>
                E-commerce<br/>
                Infrastructure
             </h1>
           </div>
           <div className="text-sm font-mono text-gray-600 leading-relaxed border-l-2 border-neon pl-6">
             A technical index of the operational components powering the regional digital economy. <br/><br/>
             // INDEX INCLUDES:<br/>
             [01] Consumer Brands<br/>
             [02] SaaS Modules (Tools)<br/>
             [03] Service Partners (Agencies)
           </div>
        </div>
      </header>

      {/* Control Panel (Toolbar) */}
      <div className="sticky top-16 z-40 bg-blueprint-bg/95 border-b border-blueprint-border py-4 backdrop-blur-sm">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Mode Selectors */}
          <div className="flex border border-blueprint-border bg-white">
            {[
              { id: 'All', label: 'ALL_MODULES' },
              { id: Category.BRAND, label: 'BRANDS' },
              { id: Category.TOOL, label: 'TOOLS' },
              { id: Category.AGENCY, label: 'AGENCIES' }
            ].map((nav) => (
              <button
                key={nav.id}
                onClick={() => handleCategoryChange(nav.id as any)}
                className={`px-4 py-2 text-xs font-bold uppercase border-r border-blueprint-border last:border-r-0 transition-colors ${
                  filters.category === nav.id 
                  ? 'bg-black text-white' 
                  : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                {nav.label}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex-1 w-full lg:w-auto flex flex-col sm:flex-row gap-4 lg:justify-end items-center">
            <div className="flex-1 w-full sm:w-auto overflow-x-auto scrollbar-hide flex items-center gap-2">
               {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`text-[10px] px-2 py-1 border border-blueprint-border uppercase transition-colors font-medium ${
                    filters.selectedTag === tag
                    ? 'bg-neon text-black'
                    : 'bg-white text-gray-500 hover:text-black'
                  }`}
                >
                  [{tag}]
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64 border-b border-blueprint-border">
              <SearchIcon className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="SEARCH_DATABASE..."
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full pl-6 pr-2 py-2 bg-transparent focus:outline-none font-mono text-sm placeholder-gray-400 uppercase"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <main className="flex-1 max-w-screen-2xl mx-auto px-6 md:px-12 py-12 w-full">
        <div className="mb-8 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
           <span className="w-2 h-2 bg-neon rounded-full animate-pulse"></span>
           {filters.category === 'All' ? 'ROOT' : filters.category} // LISTING // {displayedItems.length} ITEMS
        </div>

        {displayedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedItems.map(item => (
              <DirectoryCard 
                key={item.id} 
                item={item} 
                onClick={handleItemClick}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-300">
            <div className="font-mono text-lg text-gray-400 uppercase mb-4">No Data Found</div>
            <button 
              onClick={() => setFilters({ category: 'All', searchQuery: '', selectedTag: null })}
              className="text-xs bg-black text-white px-4 py-2 hover:bg-neon hover:text-black transition-colors"
            >
              RESET_FILTERS
            </button>
          </div>
        )}
      </main>

      {/* Newsletter Promo Section */}
      <NewsletterPromo />

      {/* Footer */}
      <footer className="border-t border-blueprint-border bg-black text-white font-mono text-xs">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="uppercase opacity-50">
             E-COSYSTEM DATABASE © {new Date().getFullYear()}
          </div>
          <div className="flex items-center gap-2 text-neon group cursor-pointer hover:opacity-80 transition-opacity">
             <div className="p-1 border border-neon rounded-full">
                <BoltIcon className="w-3 h-3" />
             </div>
             <span className="font-bold tracking-widest">POWERED BY SYSTEM CORE: SADECE TICARET</span>
          </div>
        </div>
      </footer>

      <ChatAssistant isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}

export default App;
