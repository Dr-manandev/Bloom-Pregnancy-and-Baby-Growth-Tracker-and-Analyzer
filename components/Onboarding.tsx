import React, { useState } from 'react';
import { UserSettings, DietType, AppMode } from '../types';
import { Button } from './Button';
import { DEFAULT_CYCLE } from '../constants';
import { Calendar, Baby, Heart } from 'lucide-react';

interface Props {
  onComplete: (settings: UserSettings) => void;
}

export const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<AppMode>('pregnant'); // Default
  const [name, setName] = useState('');
  const [lmp, setLmp] = useState('');
  const [cycleLength, setCycleLength] = useState(DEFAULT_CYCLE);
  
  // Postpartum specific
  const [babyName, setBabyName] = useState('');
  const [babyDob, setBabyDob] = useState('');
  const [babyGender, setBabyGender] = useState<'boy' | 'girl'>('boy');

  const [diet, setDiet] = useState<DietType>('vegetarian');
  const [lactoseIntolerant, setLactoseIntolerant] = useState(false);

  const handleNext = () => {
    if (step === 1 && name) {
      setStep(2);
    } else if (step === 2) {
        if (status === 'postpartum' && (!babyName || !babyDob)) return;
        if ((status === 'pregnant' || status === 'planning') && !lmp) return;
        setStep(3);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ 
      id: `user_${Date.now()}`,
      name,
      status, 
      lmp: status !== 'postpartum' ? lmp : null, 
      cycleLength, 
      comorbidities: [],
      dietaryPreference: diet,
      lactoseIntolerant: lactoseIntolerant,
      isPostpartum: status === 'postpartum',
      babyName: status === 'postpartum' ? babyName : undefined,
      babyGender: status === 'postpartum' ? babyGender : undefined,
      birthDate: status === 'postpartum' ? babyDob : undefined,
      vaccinationsDone: [],
      periodLog: status !== 'postpartum' && lmp ? [lmp] : [],
      obstetricHistory: {
        gravida: 1,
        para: 0,
        abortions: 0,
        abortionsT1: 0,
        abortionsT2: 0,
        living: 0,
        lastBabyCongenitalDefect: false
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white dark:bg-deep-card p-8 rounded-3xl shadow-2xl max-w-md w-full border border-pink-100 dark:border-indigo-800 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600 mb-2">
            Welcome to Bloom
          </h1>
          <p className="text-gray-500 dark:text-gray-300">
            Your medically approved intelligent companion.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  What should we call you?
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-indigo-700 bg-white dark:bg-indigo-950/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all shadow-sm"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                   Which stage describes you best?
                 </label>
                 <div className="space-y-3">
                     <button
                        type="button"
                        onClick={() => setStatus('planning')}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${status === 'planning' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 ring-1 ring-teal-500' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-indigo-900/20'}`}
                     >
                         <div className={`p-2 rounded-full ${status === 'planning' ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-500'}`}>
                             <Calendar size={20} />
                         </div>
                         <div>
                             <h3 className="font-bold text-gray-800 dark:text-white">Planning Pregnancy</h3>
                             <p className="text-xs text-gray-500">Tracking cycles & fertility.</p>
                         </div>
                     </button>

                     <button
                        type="button"
                        onClick={() => setStatus('pregnant')}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${status === 'pregnant' ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 ring-1 ring-pink-500' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-indigo-900/20'}`}
                     >
                         <div className={`p-2 rounded-full ${status === 'pregnant' ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-500'}`}>
                             <Heart size={20} />
                         </div>
                         <div>
                             <h3 className="font-bold text-gray-800 dark:text-white">Pregnant</h3>
                             <p className="text-xs text-gray-500">Tracking weeks & baby growth.</p>
                         </div>
                     </button>

                     <button
                        type="button"
                        onClick={() => setStatus('postpartum')}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${status === 'postpartum' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-indigo-900/20'}`}
                     >
                         <div className={`p-2 rounded-full ${status === 'postpartum' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                             <Baby size={20} />
                         </div>
                         <div>
                             <h3 className="font-bold text-gray-800 dark:text-white">Baby is Born</h3>
                             <p className="text-xs text-gray-500">Tracking vaccines & milestones.</p>
                         </div>
                     </button>
                 </div>
              </div>

              <Button type="button" onClick={handleNext} disabled={!name} className="w-full py-4 text-lg">
                Next Step
              </Button>
            </>
          )}

          {step === 2 && (
             <>
                {status === 'postpartum' ? (
                   <div className="space-y-4 animate-fade-in">
                       <div>
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Baby Name</label>
                           <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-indigo-700 bg-white dark:bg-indigo-950/50 text-gray-900 dark:text-white outline-none" value={babyName} onChange={e => setBabyName(e.target.value)} />
                       </div>
                       <div>
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                           <input type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-indigo-700 bg-white dark:bg-indigo-950/50 text-gray-900 dark:text-white outline-none" value={babyDob} max={new Date().toISOString().split('T')[0]} onChange={e => setBabyDob(e.target.value)} />
                       </div>
                       <div>
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                           <div className="flex gap-4">
                               <label className={`flex-1 p-3 border rounded-xl flex justify-center cursor-pointer ${babyGender === 'boy' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200'}`}>
                                   <input type="radio" className="hidden" onClick={() => setBabyGender('boy')} /> Boy
                               </label>
                               <label className={`flex-1 p-3 border rounded-xl flex justify-center cursor-pointer ${babyGender === 'girl' ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-gray-200'}`}>
                                   <input type="radio" className="hidden" onClick={() => setBabyGender('girl')} /> Girl
                               </label>
                           </div>
                       </div>
                   </div>
                ) : (
                   <div className="space-y-4 animate-fade-in">
                       <div>
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                               First day of Last Period (LMP)
                           </label>
                           <input
                            type="date"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-indigo-700 bg-white dark:bg-indigo-950/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none"
                            value={lmp}
                            max={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setLmp(e.target.value)}
                           />
                       </div>
                       <div>
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                               Cycle Length (Days)
                           </label>
                           <div className="flex items-center gap-4">
                               <input
                                   type="range"
                                   min="21"
                                   max="40"
                                   value={cycleLength}
                                   onChange={(e) => setCycleLength(parseInt(e.target.value))}
                                   className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
                               />
                               <span className="text-lg font-bold text-pink-600 w-12 text-center">{cycleLength}</span>
                           </div>
                       </div>
                   </div>
                )}
                
                <div className="flex gap-4">
                   <Button type="button" variant="secondary" onClick={() => setStep(1)} className="flex-1">Back</Button>
                   <Button type="button" onClick={handleNext} className="flex-1">Next</Button>
                </div>
             </>
          )}

          {step === 3 && (
             <>
                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                     Dietary Preference
                   </label>
                   <div className="space-y-3">
                      {['vegetarian', 'eggetarian', 'non-vegetarian'].map((type) => (
                         <label key={type} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${diet === type ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20' : 'border-gray-200 dark:border-indigo-700'}`}>
                            <input 
                               type="radio" 
                               name="diet" 
                               value={type}
                               checked={diet === type}
                               onChange={(e) => setDiet(e.target.value as DietType)}
                               className="w-5 h-5 text-pink-600 focus:ring-pink-500"
                            />
                            <span className="capitalize text-gray-800 dark:text-white">{type}</span>
                         </label>
                      ))}
                   </div>
                </div>

                <div>
                   <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-indigo-700 w-full cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={lactoseIntolerant}
                        onChange={(e) => setLactoseIntolerant(e.target.checked)}
                        className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500 border-gray-300"
                      />
                      <span className="text-gray-800 dark:text-white font-medium">Lactose Intolerant?</span>
                   </label>
                </div>

                <div className="flex gap-4">
                   <Button type="button" variant="secondary" onClick={() => setStep(2)} className="flex-1">Back</Button>
                   <Button type="submit" className="flex-1 py-4 text-lg shadow-xl shadow-pink-500/20 !text-white bg-pink-600 hover:bg-pink-700">
                      Start Journey
                   </Button>
                </div>
             </>
          )}
        </form>
      </div>
    </div>
  );
};