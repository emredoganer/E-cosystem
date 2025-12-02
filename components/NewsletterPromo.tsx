import React from 'react';
import { MailIcon, ArrowRightIcon } from './Icon';

export const NewsletterPromo = () => {
  return (
    <section className="w-full bg-black border-y-4 border-neon relative overflow-hidden font-mono group">
      {/* Abstract Background Effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,69,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,69,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-neon blur-[150px] rounded-full opacity-20 animate-pulse"></div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-16 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Visual Brand Area */}
        <div className="flex items-center gap-8">
           <div className="relative">
             <div className="w-24 h-24 bg-neon flex items-center justify-center relative z-10 border-2 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
                <span className="font-bold text-5xl tracking-tighter text-black">e</span>
                <div className="absolute -bottom-2 -right-2 bg-white text-black text-[8px] font-bold px-1 py-0.5">V.24</div>
             </div>
             {/* Glitch Effect Element */}
             <div className="absolute top-0 left-0 w-24 h-24 border border-neon translate-x-1 translate-y-1 z-0"></div>
           </div>
           
           <div className="space-y-2">
              <div className="inline-block bg-neon text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest">
                System Core Intelligence
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tighter uppercase leading-none">
                Sadece<br/>Ticaret
              </h2>
           </div>
        </div>

        {/* Copy Area */}
        <div className="flex-1 max-w-lg text-left lg:border-l lg:border-gray-800 lg:pl-12">
           <p className="text-neon text-sm font-bold uppercase mb-2">
             // Incoming Transmission: Weekly
           </p>
           <p className="text-gray-400 text-sm leading-relaxed mb-6">
             Every Sunday. 0900 Hours. 
             <span className="text-white"> 5-minute decryption time. </span>
             Critical updates on the Turkish E-commerce Ecosystem, trends, and growth protocols.
           </p>
           
           <form className="flex flex-col sm:flex-row gap-0 border border-gray-600 bg-gray-900/50 p-1">
             <div className="flex-1 flex items-center px-4 bg-transparent">
               <MailIcon className="w-4 h-4 text-gray-500 mr-3" />
               <input 
                 type="email" 
                 placeholder="ENTER_SIGNAL_ADDRESS" 
                 className="bg-transparent border-none text-white text-xs font-mono w-full focus:outline-none placeholder-gray-600 uppercase py-3"
               />
             </div>
             <button className="bg-neon text-black px-6 py-3 text-xs font-bold uppercase hover:bg-white transition-colors flex items-center gap-2 group-hover:pl-8 duration-300">
               Initialize Link <ArrowRightIcon className="w-3 h-3" />
             </button>
           </form>
        </div>

      </div>
      
      {/* Running text decor */}
      <div className="absolute bottom-1 right-4 text-[9px] text-gray-700 font-bold uppercase tracking-[0.3em]">
        Data_Stream_Active :: Secure_Connection
      </div>
    </section>
  );
};
