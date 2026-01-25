
import React, { useState, useEffect } from 'react';
import { Medicine, AppMode } from '../types';
import { Pill, Plus, Trash2, Check, ShieldAlert } from 'lucide-react';
import { Button } from './Button';
import { MedicineSafety } from './MedicineSafety';

interface Props {
  currentWeek?: number;
  isPostpartum?: boolean;
  mode?: AppMode; // New prop to determine specific list
  comorbidities?: string[];
}

export const MedicineTracker: React.FC<Props> = ({ currentWeek = 1, isPostpartum = false, mode = 'pregnant', comorbidities }) => {
  const [activeTab, setActiveTab] = useState<'my-meds' | 'safety'>('my-meds');
  
  // Initialize with empty array or default, will be overwritten by useEffect load
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  
  const [newMed, setNewMed] = useState({ name: '', time: '' });

  // Persistence Key based on mode
  const STORAGE_KEY = isPostpartum ? 'bloom_pp_medicines' : 'bloom_medicines';
  const DATE_KEY = STORAGE_KEY + '_date';

  // Load from Storage on Mount or Mode Change
  useEffect(() => {
    const loadMedicines = () => {
        const saved = localStorage.getItem(STORAGE_KEY);
        const lastDate = localStorage.getItem(DATE_KEY);
        const today = new Date().toISOString().split('T')[0];

        if (saved) {
            let parsed = JSON.parse(saved);
            
            // Check if it's a new day, if so reset 'taken' status
            if (lastDate !== today) {
                parsed = parsed.map((m: Medicine) => ({ ...m, taken: false }));
                // Update storage immediately with reset values
                localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
                localStorage.setItem(DATE_KEY, today);
            }
            setMedicines(parsed);
        } else {
            // Default Medicines if nothing saved
            const defaults: Medicine[] = isPostpartum ? [
                { id: '1', name: 'Calcium', dosage: '500mg', frequency: 'BD', time: '09:00', taken: false },
                { id: '2', name: 'Iron', dosage: '100mg', frequency: 'OD', time: '20:00', taken: false }
            ] : [
                { id: '1', name: 'Folic Acid', dosage: '5mg', frequency: 'Daily', time: '09:00', taken: false },
                { id: '2', name: 'Iron Supplement', dosage: '100mg', frequency: 'Daily', time: '20:00', taken: false }
            ];
            setMedicines(defaults);
            // Save defaults immediately
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
            localStorage.setItem(DATE_KEY, today);
        }
    };
    loadMedicines();
  }, [isPostpartum]);

  // Save to Storage whenever medicines change
  useEffect(() => {
      // Avoid saving empty array on initial render before load
      if (medicines.length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(medicines));
          // Always update date key to today when saving
          localStorage.setItem(DATE_KEY, new Date().toISOString().split('T')[0]);
      }
  }, [medicines, STORAGE_KEY]);

  const toggleTaken = (id: string) => {
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  const addMed = () => {
    if (newMed.name && newMed.time) {
      setMedicines(prev => [...prev, {
        id: Date.now().toString(),
        name: newMed.name,
        time: newMed.time,
        dosage: 'Check label',
        frequency: 'Daily',
        taken: false
      }]);
      setNewMed({ name: '', time: '' });
    }
  };

  const removeMed = (id: string) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
       <div className="flex gap-2 p-1 bg-gray-100 dark:bg-indigo-950/50 rounded-xl w-fit mx-auto mb-6">
          <button 
             onClick={() => setActiveTab('my-meds')}
             className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'my-meds' ? 'bg-white dark:bg-deep-card shadow text-teal-600 dark:text-teal-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
             My Medicines
          </button>
          <button 
             onClick={() => setActiveTab('safety')}
             className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'safety' ? 'bg-white dark:bg-deep-card shadow text-bloom-DEFAULT' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
             <ShieldAlert size={16} /> {isPostpartum ? 'Lactation Safety' : 'Safety Guide'}
          </button>
       </div>

       {activeTab === 'my-meds' ? (
         <>
          <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-3xl p-8 text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-2">Medicine Cabinet</h2>
              <p className="opacity-90">Keep track of your supplements and prescriptions. Compliance is key for a healthy {isPostpartum ? 'recovery' : 'pregnancy'}.</p>
          </div>

          <div className="bg-white dark:bg-deep-card rounded-3xl shadow-lg border border-gray-100 dark:border-indigo-800 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-indigo-800">
                <h3 className="font-bold text-gray-800 dark:text-white text-lg">Daily Checklist</h3>
              </div>
              
              <div className="divide-y divide-gray-100 dark:divide-indigo-800">
                {medicines.map(med => (
                  <div key={med.id} className={`p-4 flex items-center justify-between transition-colors ${med.taken ? 'bg-green-50/50 dark:bg-green-900/10' : 'hover:bg-gray-50 dark:hover:bg-indigo-900/20'}`}>
                      <div className="flex items-center gap-4">
                        <button 
                            onClick={() => toggleTaken(med.id)}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${med.taken ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 dark:border-gray-600 text-transparent hover:border-green-500'}`}
                        >
                            <Check size={16} />
                        </button>
                        <div>
                            <p className={`font-medium text-lg ${med.taken ? 'text-gray-400 line-through' : 'text-gray-800 dark:text-white'}`}>
                                {med.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {med.time} • {med.dosage}
                            </p>
                        </div>
                      </div>
                      <button onClick={() => removeMed(med.id)} className="text-gray-400 hover:text-red-500 p-2">
                        <Trash2 size={18} />
                      </button>
                  </div>
                ))}
                
                {medicines.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No medicines added yet.</div>
                )}
              </div>

              <div className="p-6 bg-gray-50 dark:bg-indigo-950/30">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Medicine Name</label>
                        <input 
                            type="text" 
                            value={newMed.name}
                            onChange={(e) => setNewMed({...newMed, name: e.target.value})}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-indigo-700 bg-white dark:bg-deep-bg dark:text-white dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                            placeholder="e.g. Calcium"
                        />
                    </div>
                    <div className="w-full md:w-40">
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Time</label>
                        <input 
                            type="time" 
                            value={newMed.time}
                            onChange={(e) => setNewMed({...newMed, time: e.target.value})}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-indigo-700 bg-white dark:bg-deep-bg dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                        />
                    </div>
                    <Button onClick={addMed} className="w-full md:w-auto bg-teal-500 hover:bg-teal-600 hover:shadow-teal-500/30">
                        <Plus size={20} /> Add
                    </Button>
                </div>
              </div>
          </div>
         </>
       ) : (
         <MedicineSafety currentWeek={currentWeek} isPostpartum={isPostpartum} mode={mode} comorbidities={comorbidities} />
       )}
    </div>
  );
};
