
import React, { useState } from 'react';
import { Button } from './Button';
import { Search, ShieldCheck, AlertTriangle, XCircle, Info, ChevronDown, ChevronUp, Octagon, Key, Star } from 'lucide-react';
import { checkMedicineSafety } from '../services/geminiService';
import { MedicineSafetyResult, AppMode } from '../types';
import { MEDICINE_DATABASE, ALWAYS_CONTRAINDICATED } from '../constants';

interface Props {
  currentWeek: number;
  isPostpartum: boolean;
  mode?: AppMode;
  comorbidities?: string[];
}

export const MedicineSafety: React.FC<Props> = ({ currentWeek, isPostpartum, mode = 'pregnant', comorbidities = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MedicineSafetyResult | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(0);
  const [showContraindicated, setShowContraindicated] = useState(false);
  const [missingKey, setMissingKey] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setLoading(true);
    setMissingKey(false);
    
    try {
        // Determine context for AI
        const context = isPostpartum ? 'lactation' : 'pregnancy';
        const res = await checkMedicineSafety(searchTerm, currentWeek, context);
        setResult(res);
    } catch (err: any) {
        if (err.message === 'MISSING_API_KEY') {
            setMissingKey(true);
            setResult(null);
        }
    } finally {
        setLoading(false);
    }
  };

  // Logic for picking database based on profile mode
  let guideData;
  let trimesterTitle;
  
  if (mode === 'planning') {
      guideData = [...(MEDICINE_DATABASE[0] || [])];
      trimesterTitle = "Pre-Conception / Planning";
  } else if (mode === 'postpartum') {
      guideData = [...(MEDICINE_DATABASE[4] || [])];
      trimesterTitle = "Lactation / Postpartum";
  } else {
      // Pregnant
      const trimester = currentWeek <= 13 ? 1 : currentWeek <= 27 ? 2 : 3;
      guideData = [...(MEDICINE_DATABASE[trimester] || MEDICINE_DATABASE[1])];
      trimesterTitle = `Trimester ${trimester} (Week ${currentWeek})`;
  }

  // --- SORTING LOGIC FOR COMORBIDITIES ---
  // If user has comorbidities, move relevant categories to the top
  if (comorbidities.length > 0 && guideData) {
      guideData.sort((a, b) => {
          const aRelevant = comorbidities.some(c => a.category.toLowerCase().includes(c) || (c === 'hypertension' && a.category.toLowerCase().includes('bp')) || (c === 'diabetes' && a.category.toLowerCase().includes('sugar')));
          const bRelevant = comorbidities.some(c => b.category.toLowerCase().includes(c) || (c === 'hypertension' && b.category.toLowerCase().includes('bp')) || (c === 'diabetes' && b.category.toLowerCase().includes('sugar')));
          if (aRelevant && !bRelevant) return -1;
          if (!aRelevant && bRelevant) return 1;
          return 0;
      });
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Safe': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      case 'Caution': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
      case 'Unsafe': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Safe': return <ShieldCheck size={24} />;
      case 'Caution': return <AlertTriangle size={24} />;
      case 'Unsafe': return <XCircle size={24} />;
      default: return <Info size={24} />;
    }
  };

  const toggleCategory = (idx: number) => {
    setExpandedCategory(expandedCategory === idx ? null : idx);
  };

  const isRelevantToComorbidity = (category: string) => {
      return comorbidities.some(c => 
          category.toLowerCase().includes(c) || 
          (c === 'hypertension' && category.toLowerCase().includes('bp')) || 
          (c === 'diabetes' && category.toLowerCase().includes('sugar'))
      );
  };

  return (
    <div className="space-y-8">
      {/* Search Section */}
      <div className="bg-white dark:bg-deep-card p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-indigo-800">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
            AI Safety Check
            {isPostpartum && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Lactation Focus</span>}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Verify any specific medicine for {trimesterTitle}.
        </p>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input 
            type="text" 
            placeholder="Enter medicine name (e.g. Ibuprofen)" 
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-indigo-700 bg-gray-50 dark:bg-indigo-950/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-bloom-DEFAULT"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" isLoading={loading}>
            <Search size={20} />
          </Button>
        </form>

        {missingKey && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl flex items-center gap-3 border border-red-200 dark:border-red-800">
                <Key size={24} className="shrink-0" />
                <div>
                    <strong>AI Key Missing:</strong> To use AI safety checks, please add your Google Gemini API Key in your Profile.
                </div>
            </div>
        )}

        {result && (
          <div className={`mt-6 p-6 rounded-2xl border ${getStatusColor(result.status)} animate-fade-in`}>
             <div className="flex items-start gap-4">
                <div className="mt-1">{getStatusIcon(result.status)}</div>
                <div>
                   <h4 className="font-bold text-lg mb-1">{result.status}</h4>
                   <p className="mb-3 leading-relaxed">{result.description}</p>
                   {result.alternatives && result.alternatives.length > 0 && (
                     <div className="text-sm opacity-90">
                       <strong>Alternatives:</strong> {result.alternatives.join(', ')}
                     </div>
                   )}
                </div>
             </div>
          </div>
        )}
      </div>

       {/* Contraindicated List (Collapsible) */}
       <div className="bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-900/50 rounded-2xl overflow-hidden">
          <button 
             onClick={() => setShowContraindicated(!showContraindicated)}
             className="w-full flex items-center justify-between p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 font-bold"
          >
             <div className="flex items-center gap-2">
                <Octagon size={20} /> Strictly Contraindicated Drugs (Always Unsafe)
             </div>
             {showContraindicated ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {showContraindicated && (
             <div className="p-4 grid gap-3 md:grid-cols-2 animate-fade-in">
                {ALWAYS_CONTRAINDICATED.map((drug, i) => (
                   <div key={i} className="bg-white dark:bg-deep-card p-3 rounded-xl border border-red-100 dark:border-red-900/30">
                      <p className="font-bold text-red-700 dark:text-red-400">{drug.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{drug.reason}</p>
                   </div>
                ))}
             </div>
          )}
       </div>

      {/* Guide Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2 px-2">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
             {trimesterTitle} Medicines Guide
          </h3>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-indigo-900/50 px-3 py-1 rounded-full">
            {isPostpartum ? 'Safe for Baby' : (mode === 'planning' ? 'Conception Safe' : `Week ${currentWeek}`)}
          </span>
        </div>

        {guideData?.map((category, idx) => {
            const isPriority = isRelevantToComorbidity(category.category);
            return (
              <div key={idx} className={`rounded-2xl shadow-sm border overflow-hidden ${isPriority ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700' : 'bg-white dark:bg-deep-card border-gray-100 dark:border-indigo-800'}`}>
                <button 
                  onClick={() => toggleCategory(idx)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <h4 className={`font-bold text-lg flex items-center gap-2 ${isPriority ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-800 dark:text-white'}`}>
                    {category.category}
                    {isPriority && <Star size={16} className="fill-indigo-500 text-indigo-500" />}
                  </h4>
                  {expandedCategory === idx ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </button>
                
                {expandedCategory === idx && (
                  <div className="p-5 pt-0 border-t border-gray-100 dark:border-indigo-800/50 animate-fade-in">
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      {/* Safe Column */}
                      <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/30">
                         <h5 className="flex items-center gap-2 font-bold text-green-700 dark:text-green-400 mb-2 text-sm uppercase tracking-wide">
                            <ShieldCheck size={16} /> Safe
                         </h5>
                         <ul className="space-y-1">
                            {category.safe.map((m, i) => (
                               <li key={i} className="text-sm text-gray-700 dark:text-gray-300">• {m}</li>
                            ))}
                         </ul>
                      </div>

                      {/* Avoid Column */}
                      <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                         <h5 className="flex items-center gap-2 font-bold text-red-700 dark:text-red-400 mb-2 text-sm uppercase tracking-wide">
                            <XCircle size={16} /> Avoid
                         </h5>
                         <ul className="space-y-1">
                            {category.avoid.map((m, i) => (
                               <li key={i} className="text-sm text-gray-700 dark:text-gray-300">• {m}</li>
                            ))}
                         </ul>
                      </div>
                    </div>

                    {/* Caution */}
                    {category.caution.length > 0 && (
                      <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                         <h5 className="flex items-center gap-2 font-bold text-yellow-700 dark:text-yellow-400 mb-2 text-sm uppercase tracking-wide">
                            <AlertTriangle size={16} /> Use with Caution
                         </h5>
                         <p className="text-sm text-gray-700 dark:text-gray-300">
                            {category.caution.join(', ')}
                         </p>
                      </div>
                    )}

                    {/* Note */}
                    {category.note && (
                       <div className="mt-4 text-sm italic text-gray-500 dark:text-gray-400 border-l-4 border-bloom-DEFAULT pl-3">
                          Note: {category.note}
                       </div>
                    )}
                  </div>
                )}
              </div>
            );
        })}

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm text-blue-800 dark:text-blue-200 border border-blue-100 dark:border-blue-900/30 flex items-start gap-3">
             <Info className="shrink-0 mt-0.5" size={18} />
             <p>This list assumes a low-risk {isPostpartum ? 'recovery' : 'pregnancy'}. If you have underlying conditions (Diabetes, Hypertension, etc.), always consult your doctor before taking "Safe" medications. Data based on FOGSI & Indian Formulary.</p>
        </div>
      </div>
    </div>
  );
};
