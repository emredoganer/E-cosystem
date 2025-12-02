
import React, { useState } from 'react';
import { Category, Submission, DirectoryItem } from '../types';
import { ArrowLeftIcon, CheckCircleIcon } from './Icon';

interface SubmissionFormProps {
  onBack: () => void;
  onSubmit: (data: DirectoryItem) => void;
}

export const SubmissionForm: React.FC<SubmissionFormProps> = ({ onBack, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<DirectoryItem>>({
    category: Category.BRAND,
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: DirectoryItem = {
      id: `req-${Date.now()}`,
      name: formData.name || '',
      description: formData.description || '',
      category: formData.category || Category.BRAND,
      websiteUrl: formData.websiteUrl || '',
      logoUrl: 'https://picsum.photos/100/100', // Default
      tags: formData.tags || [],
    };
    onSubmit(newItem);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-blueprint-bg flex items-center justify-center p-6">
        <div className="bg-white border-2 border-neon p-8 shadow-hard text-center max-w-md w-full">
           <div className="w-16 h-16 bg-neon rounded-full flex items-center justify-center mx-auto mb-6">
             <CheckCircleIcon className="w-8 h-8 text-black" />
           </div>
           <h2 className="text-2xl font-bold uppercase mb-2">Protocol Initiated</h2>
           <p className="text-sm text-gray-600 mb-8 font-mono">
             Your submission has been queued for administrator review. Thank you for contributing to the ecosystem.
           </p>
           <button onClick={onBack} className="bg-black text-white px-6 py-3 uppercase text-xs font-bold hover:bg-neon hover:text-black">
             Return to Base
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blueprint-bg bg-grid font-mono">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold uppercase mb-8 hover:text-neon transition-colors">
          <ArrowLeftIcon className="w-4 h-4" /> Return
        </button>
        
        <div className="bg-white border border-blueprint-border p-8 shadow-hard">
           <h1 className="text-3xl font-bold uppercase mb-2">Submit Entity</h1>
           <p className="text-sm text-gray-500 mb-8 border-l-2 border-neon pl-4">
             Enter details for a Brand, Tool, or Agency to be indexed in the directory. All submissions are manually verified.
           </p>

           <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase mb-2">Entity Type</label>
                <div className="flex gap-4">
                   {Object.values(Category).map(cat => (
                     <label key={cat} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="category" 
                          className="accent-neon"
                          checked={formData.category === cat}
                          onChange={() => setFormData({...formData, category: cat})}
                        />
                        <span className="text-sm uppercase">{cat}</span>
                     </label>
                   ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-2">Entity Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full border border-gray-300 p-3 text-sm focus:border-neon focus:outline-none"
                  placeholder="e.g. Acme Corp"
                  value={formData.name || ''}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-2">Website URL</label>
                <input 
                  required
                  type="url" 
                  className="w-full border border-gray-300 p-3 text-sm focus:border-neon focus:outline-none"
                  placeholder="https://"
                  value={formData.websiteUrl || ''}
                  onChange={e => setFormData({...formData, websiteUrl: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-2">Description</label>
                <textarea 
                  required
                  className="w-full border border-gray-300 p-3 text-sm focus:border-neon focus:outline-none h-32"
                  placeholder="Brief operational summary..."
                  value={formData.description || ''}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input 
                    type="text" 
                    className="flex-1 border border-gray-300 p-2 text-sm focus:border-neon focus:outline-none"
                    placeholder="Add tag and press Enter"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (tagInput.trim()) {
                          setFormData(prev => ({...prev, tags: [...(prev.tags || []), tagInput.trim()]}));
                          setTagInput('');
                        }
                      }
                    }}
                  />
                  <button type="button" onClick={() => {
                     if (tagInput.trim()) {
                      setFormData(prev => ({...prev, tags: [...(prev.tags || []), tagInput.trim()]}));
                      setTagInput('');
                     }
                  }} className="bg-black text-white px-4 text-xs font-bold uppercase">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags?.map((tag, i) => (
                    <span key={i} className="bg-gray-100 text-xs px-2 py-1 flex items-center gap-2">
                      {tag}
                      <button type="button" onClick={() => setFormData(prev => ({...prev, tags: prev.tags?.filter((_, idx) => idx !== i)}))}>
                        <span className="hover:text-red-500">×</span>
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button type="submit" className="w-full bg-black text-white py-4 font-bold uppercase hover:bg-neon hover:text-black transition-colors shadow-hard">
                  Submit for Review
                </button>
              </div>
           </form>
        </div>
      </div>
    </div>
  );
};
