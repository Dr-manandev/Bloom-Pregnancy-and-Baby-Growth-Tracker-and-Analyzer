import React, { useState } from 'react';
import { UserSettings, PregnancyCalculations, DietType } from '../types';
import { DIET_DATABASE } from '../constants';
import { Coffee, Utensils, Moon, Sun, Apple, Info, AlertTriangle, Droplet } from 'lucide-react';

interface Props {
  settings: UserSettings;
  calculations: PregnancyCalculations;
}

export const DietPlan: React.FC<Props> = ({ settings, calculations }) => {
  const { trimester, currentWeek } = calculations;
  const isPostpartum = settings.isPostpartum;
  
  // If Postpartum, default to 4 (Lactation), otherwise use pregnancy trimester
  const [selectedTrimester, setSelectedTrimester] = useState<1 | 2 | 3 | 4>(isPostpartum ? 4 : trimester);
  
  // Fallback to trimester 1 if data missing, though 4 is guaranteed in new constants
  const dietData = DIET_DATABASE[selectedTrimester]?.[settings.dietaryPreference] || DIET_DATABASE[1][settings.dietaryPreference];

  // Helper to replace dairy if lactose intolerant
  const processItem = (item: string) => {
    if (settings.lactoseIntolerant) {
      if (item.toLowerCase().includes('milk') && !item.toLowerCase().includes('almond') && !item.toLowerCase().includes('soy')) {
        return item.replace(/milk/gi, "Lactose-Free Milk / Almond Milk");
      }
      if (item.toLowerCase().includes('curd') || item.toLowerCase().includes('yogurt')) {
        return item + " (Lactose-Free/Soy)";
      }
      if (item.toLowerCase().includes('paneer')) {
        return item.replace(/paneer/gi, "Tofu");
      }
    }
    return item;
  };

  const getIcon = (time: string) => {
    if (time.includes("Early")) return <Sun size={20} className="text-orange-400" />;
    if (time.includes("Breakfast")) return <Coffee size={20} className="text-amber-700" />;
    if (time.includes("Lunch")) return <Utensils size={20} className="text-green-600" />;
    if (time.includes("Dinner")) return <Moon size={20} className="text-indigo-600" />;
    return <Apple size={20} className="text-red-500" />;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
      
      {/* Header with Trimester Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-deep-card p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-indigo-800">
        <div>
           <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
             {isPostpartum ? "Postpartum & Lactation Diet" : "Pregnancy Diet Plan"}
           </h2>
           <p className="text-sm text-gray-500 dark:text-gray-400">
             {settings.dietaryPreference.charAt(0).toUpperCase() + settings.dietaryPreference.slice(1)} • {settings.lactoseIntolerant ? 'Lactose Free' : 'Standard'}
           </p>
        </div>
        
        {!isPostpartum && (
            <div className="flex bg-gray-100 dark:bg-indigo-950/50 p-1 rounded-xl">
            {[1, 2, 3].map((t) => (
                <button
                key={t}
                onClick={() => setSelectedTrimester(t as 1 | 2 | 3)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${selectedTrimester === t 
                    ? 'bg-white dark:bg-deep-card shadow text-bloom-DEFAULT' 
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                Trim {t}
                </button>
            ))}
            </div>
        )}
        
        {isPostpartum && (
             <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl text-sm font-bold">
                Focus: Recovery & Milk Supply
             </span>
        )}
      </div>

      {/* Focus & Highlights */}
      <div className="grid md:grid-cols-2 gap-6">
         <div className={`rounded-3xl p-6 text-white shadow-lg ${isPostpartum ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-green-500 to-emerald-600'}`}>
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
               <Apple /> {isPostpartum ? "Lactation Focus" : `Trimester ${selectedTrimester} Focus`}
            </h3>
            <p className="opacity-90 font-medium text-lg mb-4">{dietData.focus}</p>
            
            <div className="space-y-2">
               <p className="text-xs uppercase font-bold opacity-75">Key Nutrients</p>
               <div className="flex flex-wrap gap-2">
                  {dietData.nutrients.map((n, i) => (
                    <span key={i} className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                      {n}
                    </span>
                  ))}
               </div>
            </div>
         </div>

         <div className="bg-white dark:bg-deep-card p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-indigo-800 space-y-4">
             <div>
                <h4 className="font-bold text-orange-600 dark:text-orange-400 flex items-center gap-2 mb-2">
                   <Droplet size={18} /> Home Remedies
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                   {dietData.remedies.map((r, i) => <li key={i}>• {processItem(r)}</li>)}
                </ul>
             </div>
             
             <div className="pt-4 border-t border-gray-100 dark:border-indigo-800">
                <h4 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2 mb-2">
                   <AlertTriangle size={18} /> Foods to Avoid
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                   {dietData.avoid.map((a, i) => <li key={i}>• {a}</li>)}
                </ul>
             </div>
         </div>
      </div>

      {/* Daily Schedule */}
      <div className="bg-white dark:bg-deep-card rounded-3xl shadow-lg border border-gray-100 dark:border-indigo-800 overflow-hidden">
         <div className="p-6 border-b border-gray-100 dark:border-indigo-800">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Daily Meal Plan</h3>
         </div>
         <div className="divide-y divide-gray-100 dark:divide-indigo-800">
            {dietData.meals.map((meal, idx) => (
               <div key={idx} className="p-6 flex gap-4 transition-colors hover:bg-gray-50 dark:hover:bg-indigo-900/10">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-gray-100 dark:bg-indigo-900/30 flex items-center justify-center">
                     {getIcon(meal.time)}
                  </div>
                  <div>
                     <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3 mb-1">
                        <span className="font-bold text-gray-900 dark:text-white text-lg">{meal.title}</span>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide bg-gray-100 dark:bg-indigo-900/50 px-2 py-0.5 rounded">
                           {meal.time}
                        </span>
                     </div>
                     <ul className="space-y-1">
                        {meal.items.map((item, i) => (
                           <li key={i} className="text-gray-600 dark:text-gray-300 text-sm flex items-start gap-2">
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-bloom-DEFAULT shrink-0"></span>
                              {processItem(item)}
                           </li>
                        ))}
                     </ul>
                  </div>
               </div>
            ))}
         </div>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm text-blue-800 dark:text-blue-200 border border-blue-100 dark:border-blue-900/30 flex items-start gap-3">
          <Info className="shrink-0 mt-0.5" size={18} />
          <p>
            <strong>Note:</strong> This plan follows general medical guidelines for Indian women {isPostpartum ? "(post-delivery)" : "(during pregnancy)"}. 
            {isPostpartum 
              ? " It emphasizes foods that aid healing and breast milk production (Galactogogues)." 
              : " If you have Gestational Diabetes (GDM) or Hypertension, please follow your specific doctor's chart."}
          </p>
      </div>

    </div>
  );
};