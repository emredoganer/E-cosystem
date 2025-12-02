
import React, { useState } from 'react';
import { DirectoryItem, Category, Submission } from '../types';
import { inspectUrlWithGemini } from '../services/geminiService';
import { EditIcon, TrashIcon, ScanIcon, CheckCircleIcon, XIcon, PlusIcon, BoltIcon } from './Icon';

interface AdminPanelProps {
  data: DirectoryItem[];
  submissions: Submission[];
  onUpdate: (item: DirectoryItem) => void;
  onDelete: (id: string) => void;
  onAdd: (item: DirectoryItem) => void;
  onApproveSubmission: (submission: Submission) => void;
  onRejectSubmission: (id: string) => void;
  onExit: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  data, 
  submissions, 
  onUpdate, 
  onDelete, 
  onAdd,
  onApproveSubmission,
  onRejectSubmission,
  onExit
}) => {
  const [activeTab, setActiveTab] = useState<Category | 'Submissions'>('Submissions');
  const [inspectorUrl, setInspectorUrl] = useState('');
  const [isInspecting, setIsInspecting] = useState(false);
  const [editItem, setEditItem] = useState<Partial<DirectoryItem> | null>(null);

  const filteredData = data.filter(item => activeTab === 'Submissions' ? false : item.category === activeTab);

  const handleInspect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectorUrl) return;

    setIsInspecting(true);
    try {
      const result = await inspectUrlWithGemini(inspectorUrl, activeTab === 'Submissions' ? undefined : activeTab);
      // Generate a temporary ID
      const newItem: DirectoryItem = {
        id: `gen-${Date.now()}`,
        name: result.name || 'Unknown',
        category: result.category || Category.BRAND,
        description: result.description || '',
        logoUrl: result.logoUrl || 'https://picsum.photos/100/100',
        tags: result.tags || [],
        websiteUrl: result.websiteUrl || inspectorUrl,
        ...result
      };
      setEditItem(newItem);
    } catch (error) {
      alert("Inspection Failed. Try manual entry.");
    } finally {
      setIsInspecting(false);
      setInspectorUrl('');
    }
  };

  const handleSave = () => {
    if (editItem && editItem.name) {
      if (data.some(d => d.id === editItem.id)) {
        onUpdate(editItem as DirectoryItem);
      } else {
        onAdd(editItem as DirectoryItem);
      }
      setEditItem(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 font-mono flex flex-col">
      {/* Admin Header */}
      <div className="bg-black border-b border-gray-700 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <h1 className="text-white font-bold uppercase tracking-widest">Sys_Admin_Control</h1>
        </div>
        <button onClick={onExit} className="text-xs uppercase hover:text-white">Exit_Console</button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-black border-r border-gray-800 p-4 flex flex-col gap-2">
           <button 
             onClick={() => setActiveTab('Submissions')}
             className={`p-3 text-left text-xs font-bold uppercase border border-transparent ${activeTab === 'Submissions' ? 'bg-neon text-black' : 'hover:bg-gray-800'}`}
           >
             Inbox ({submissions.length})
           </button>
           <div className="h-px bg-gray-800 my-2"></div>
           {Object.values(Category).map(cat => (
             <button
               key={cat}
               onClick={() => setActiveTab(cat)}
               className={`p-3 text-left text-xs font-bold uppercase border border-transparent ${activeTab === cat ? 'bg-gray-800 text-white border-gray-600' : 'hover:bg-gray-800'}`}
             >
               {cat}
             </button>
           ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-grid">
           
           {/* Inspector Tool */}
           <div className="mb-8 p-6 bg-black border border-gray-700 shadow-hard">
             <div className="flex items-center gap-2 mb-4 text-neon">
               <ScanIcon className="w-5 h-5" />
               <h3 className="font-bold uppercase tracking-widest">Inspector_Tool // Auto-Import</h3>
             </div>
             <form onSubmit={handleInspect} className="flex gap-4">
               <input 
                 type="url" 
                 placeholder="https://example.com" 
                 value={inspectorUrl}
                 onChange={e => setInspectorUrl(e.target.value)}
                 className="flex-1 bg-gray-900 border border-gray-700 p-3 text-sm text-white focus:border-neon focus:outline-none placeholder-gray-600"
               />
               <button disabled={isInspecting} className="bg-white text-black px-6 font-bold uppercase text-xs hover:bg-neon transition-colors disabled:opacity-50">
                 {isInspecting ? 'SCANNING...' : 'SCAN_TARGET'}
               </button>
             </form>
           </div>

           {/* Content Area */}
           {activeTab === 'Submissions' ? (
             <div className="space-y-4">
               <h2 className="text-xl font-bold text-white uppercase mb-6">Pending Requests</h2>
               {submissions.length === 0 && <div className="text-gray-500 italic">No pending submissions.</div>}
               {submissions.map(sub => (
                 <div key={sub.id} className="bg-black border border-gray-700 p-4 flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-neon font-bold">{sub.data.name}</span>
                        <span className="text-[10px] bg-gray-800 px-2 py-0.5">{sub.data.category}</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-2">{sub.data.description}</p>
                      <a href={sub.data.websiteUrl} target="_blank" className="text-xs text-blue-400 hover:underline">{sub.data.websiteUrl}</a>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => onRejectSubmission(sub.id)} className="p-2 border border-red-900 text-red-500 hover:bg-red-900 hover:text-white"><XIcon className="w-4 h-4"/></button>
                      <button onClick={() => onApproveSubmission(sub)} className="p-2 border border-neon text-neon hover:bg-neon hover:text-black"><CheckCircleIcon className="w-4 h-4"/></button>
                    </div>
                 </div>
               ))}
             </div>
           ) : (
             <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white uppercase">{activeTab} Database</h2>
                  <button onClick={() => setEditItem({ category: activeTab, tags: [] } as any)} className="flex items-center gap-2 bg-neon text-black px-4 py-2 text-xs font-bold uppercase">
                    <PlusIcon className="w-4 h-4" /> Add New
                  </button>
                </div>

                <div className="overflow-x-auto border border-gray-700">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-800 text-gray-400 uppercase">
                      <tr>
                        <th className="p-3">Name</th>
                        <th className="p-3">Tags</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-black">
                      {filteredData.map(item => (
                        <tr key={item.id} className="hover:bg-gray-900">
                          <td className="p-3 font-bold text-white">{item.name}</td>
                          <td className="p-3 text-gray-500">{item.tags.join(', ')}</td>
                          <td className="p-3 text-right flex justify-end gap-2">
                            <button onClick={() => setEditItem(item)} className="text-gray-400 hover:text-neon"><EditIcon className="w-4 h-4"/></button>
                            <button onClick={() => onDelete(item.id)} className="text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4"/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>
           )}
        </div>
      </div>

      {/* Edit/Add Modal */}
      {editItem && (
        <div className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center p-4">
           <div className="bg-gray-900 border border-neon w-full max-w-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
              <h3 className="text-neon font-bold uppercase text-lg mb-4">Edit_Entity_Data</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                 <div className="col-span-2">
                   <label className="block text-xs uppercase text-gray-500 mb-1">Name</label>
                   <input className="w-full bg-black border border-gray-700 p-2 text-white" value={editItem.name || ''} onChange={e => setEditItem({...editItem, name: e.target.value})} />
                 </div>
                 <div className="col-span-2">
                   <label className="block text-xs uppercase text-gray-500 mb-1">Description</label>
                   <textarea className="w-full bg-black border border-gray-700 p-2 text-white h-20" value={editItem.description || ''} onChange={e => setEditItem({...editItem, description: e.target.value})} />
                 </div>
                 <div>
                   <label className="block text-xs uppercase text-gray-500 mb-1">Website URL</label>
                   <input className="w-full bg-black border border-gray-700 p-2 text-white" value={editItem.websiteUrl || ''} onChange={e => setEditItem({...editItem, websiteUrl: e.target.value})} />
                 </div>
                 <div>
                   <label className="block text-xs uppercase text-gray-500 mb-1">Category</label>
                   <select className="w-full bg-black border border-gray-700 p-2 text-white" value={editItem.category} onChange={e => setEditItem({...editItem, category: e.target.value as Category})}>
                     {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                 </div>
                 <div className="col-span-2">
                   <label className="block text-xs uppercase text-gray-500 mb-1">Tags (Comma separated)</label>
                   <input className="w-full bg-black border border-gray-700 p-2 text-white" value={editItem.tags?.join(', ') || ''} onChange={e => setEditItem({...editItem, tags: e.target.value.split(',').map(t => t.trim())})} />
                 </div>
              </div>
              <div className="flex justify-end gap-4">
                <button onClick={() => setEditItem(null)} className="px-4 py-2 border border-gray-600 text-gray-400 uppercase text-xs hover:text-white">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 bg-neon text-black font-bold uppercase text-xs hover:bg-white">Save_Changes</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
