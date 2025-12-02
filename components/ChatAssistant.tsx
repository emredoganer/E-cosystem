import React, { useState, useRef, useEffect } from 'react';
import { SparklesIcon, XIcon, ArrowRightIcon } from './Icon';
import { askEcosystemAssistant } from '../services/geminiService';
import { ChatMessage } from '../types';

interface ChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '> SYSTEM READY.\n> I am the e-cosystem assistant. Query the database now...' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userText = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: `> ${userText}` }]);
    setIsLoading(true);

    const responseText = await askEcosystemAssistant(userText);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-black w-full sm:max-w-lg h-[600px] shadow-2xl flex flex-col border-2 border-white animate-in zoom-in-95 duration-200 font-mono">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between p-2 border-b-2 border-white bg-white">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-black"></div>
            <h3 className="font-bold text-black text-xs uppercase tracking-widest">Terminal_v1.0</h3>
          </div>
          <button onClick={onClose} className="hover:bg-black hover:text-white p-1 transition-colors">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Terminal Screen */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm" ref={scrollRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div 
                className={`max-w-[95%] p-2
                  ${msg.role === 'user' 
                    ? 'text-neon' 
                    : 'text-white'
                  }`}
              >
                 {msg.role === 'model' && <span className="text-gray-500 mr-2 block text-[10px] mb-1">:: SYSTEM_RESPONSE ::</span>}
                 {/* Markdown-ish render */}
                 <div className="whitespace-pre-wrap leading-relaxed">
                   {msg.text}
                 </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="text-neon animate-pulse text-xs mt-4">
              > PROCESSING REQUEST...
            </div>
          )}
        </div>

        {/* Input Line */}
        <form onSubmit={handleSubmit} className="p-2 border-t border-gray-800 bg-black">
          <div className="flex items-center gap-2">
            <span className="text-neon font-bold">{'>'}</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter command..."
              className="flex-1 bg-transparent text-white focus:outline-none font-mono text-sm placeholder-gray-600"
              autoFocus
            />
          </div>
        </form>
      </div>
    </div>
  );
};