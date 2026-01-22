import React, { useState } from 'react';
import { Vaccine, UserSettings } from '../types';
import { MATERNAL_VACCINES, BABY_VACCINES } from '../constants';
import { CheckCircle2, Circle, Syringe, Info, AlertTriangle } from 'lucide-react';

interface Props {
  settings: UserSettings;
  currentWeek: number; // Gestational week for mom, or Baby age in weeks
  onUpdate: (vaccineId: string) => void;
}

export const VaccinationTracker: React.FC<Props> = ({ settings, currentWeek, onUpdate }) => {
  const isPostpartum = settings.isPostpartum;
  
  // Select which vaccine list to show
  const vaccines = isPostpartum ? BABY_VACCINES : MATERNAL_VACCINES;
  
  // For baby, currentWeek is actually Age in Weeks.
  // For mom, currentWeek is Pregnancy Week.
  
  const completed = settings.vaccinationsDone || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
      
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-3xl p-8 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
            <Syringe size={28} /> 
            {isPostpartum ? "Baby's Immunization Tracker" : "Maternal Vaccination Schedule"}
        </h2>
        <p className="opacity-90">
            {isPostpartum 
              ? "Follows the Indian Academy of Pediatrics (IAP) & WHO schedule." 
              : "Standard Obs & Gynae guidelines for a safe pregnancy."}
        </p>
      </div>

      <div className="space-y-4">
         {vaccines.map((vax) => {
            const isCompleted = completed.includes(vax.id);
            const isDue = !isCompleted && currentWeek >= vax.dueWeekStart && currentWeek <= vax.dueWeekEnd;
            const isOverdue = !isCompleted && currentWeek > vax.dueWeekEnd;
            const isUpcoming = !isCompleted && currentWeek < vax.dueWeekStart;

            return (
               <div 
                 key={vax.id} 
                 className={`relative p-6 rounded-2xl border transition-all ${
                    isCompleted 
                      ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30' 
                      : isDue 
                      ? 'bg-white dark:bg-deep-card border-bloom-DEFAULT shadow-md ring-1 ring-bloom-DEFAULT' 
                      : isOverdue 
                      ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30'
                      : 'bg-white dark:bg-deep-card border-gray-200 dark:border-indigo-800 opacity-70'
                 }`}
               >
                  <div className="flex items-start gap-4">
                     <button 
                        onClick={() => onUpdate(vax.id)}
                        className={`mt-1 shrink-0 transition-colors ${isCompleted ? 'text-green-600' : 'text-gray-300 hover:text-green-500'}`}
                     >
                        {isCompleted ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                     </button>
                     
                     <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                            <h3 className={`font-bold text-lg ${isCompleted ? 'text-green-800 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                                {vax.name}
                            </h3>
                            <div className="flex items-center gap-2">
                                {isDue && <span className="px-3 py-1 bg-bloom-DEFAULT text-white text-xs font-bold rounded-full animate-pulse">Due Now</span>}
                                {isOverdue && <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">Overdue</span>}
                                {vax.mandatory && <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-bold rounded uppercase">Mandatory</span>}
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{vax.description}</p>
                        
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                           <Info size={14} />
                           <span>Recommended: {isPostpartum ? `Age ${vax.dueWeekStart} - ${vax.dueWeekEnd} weeks` : `Week ${vax.dueWeekStart} - ${vax.dueWeekEnd} of pregnancy`}</span>
                        </div>
                     </div>
                  </div>
               </div>
            );
         })}
      </div>
      
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm text-blue-800 dark:text-blue-200 border border-blue-100 dark:border-blue-900/30 flex items-start gap-3">
          <AlertTriangle className="shrink-0 mt-0.5" size={18} />
          <p>
            <strong>Note:</strong> Vaccination schedules may vary slightly based on your doctor's recommendation and local availability. Always carry your vaccination card (Mamta Card) to appointments.
          </p>
      </div>
    </div>
  );
};