
import React, { useState } from 'react';
import { KickCounter } from './KickCounter';
import { ContractionTimer } from './ContractionTimer';
import { SafetyDictionary } from './SafetyDictionary';
import { Footprints, Clock, ShieldCheck } from 'lucide-react';

export const ToolsHub: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'kick' | 'contraction' | 'safety'>('kick');

  return (
    <div className="max-w-4xl mx-auto pb-10">
       <div className="mb-6 flex flex-col gap-4">
           <div>
               <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Pregnancy Tools</h2>
               <p className="text-sm text-gray-500 dark:text-gray-400">Essential utilities & guides for your journey.</p>
           </div>
           
           <div className="flex bg-white dark:bg-deep-card p-1 rounded-2xl border border-gray-200 dark:border-indigo-800 shadow-sm overflow-x-auto">
                <button
                    onClick={() => setActiveTool('kick')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTool === 'kick' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 shadow-sm' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-indigo-900/20'}`}
                >
                    <Footprints size={18} /> Kick Counter
                </button>
                <div className="w-px bg-gray-200 dark:bg-indigo-800 mx-1 shrink-0"></div>
                <button
                    onClick={() => setActiveTool('contraction')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTool === 'contraction' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 shadow-sm' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-indigo-900/20'}`}
                >
                    <Clock size={18} /> Contraction Timer
                </button>
                <div className="w-px bg-gray-200 dark:bg-indigo-800 mx-1 shrink-0"></div>
                <button
                    onClick={() => setActiveTool('safety')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTool === 'safety' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 shadow-sm' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-indigo-900/20'}`}
                >
                    <ShieldCheck size={18} /> Is It Safe?
                </button>
           </div>
       </div>

       {activeTool === 'kick' && <KickCounter />}
       {activeTool === 'contraction' && <ContractionTimer />}
       {activeTool === 'safety' && <SafetyDictionary />}
    </div>
  );
};
