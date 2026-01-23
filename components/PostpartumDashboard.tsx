
import React, { useState, useEffect } from 'react';
import { UserSettings } from '../types';
import { Button } from './Button';
import { Baby, Clock, Heart, Shield, Activity, TrendingUp, Play, Square, RotateCcw, CheckSquare, Square as SquareIcon, Star, Lightbulb, BookOpen } from 'lucide-react';
import { BABY_MILESTONES, TIP_LIBRARY, DID_YOU_KNOW_DATA } from '../constants';

interface Props {
  settings: UserSettings;
}

export const PostpartumDashboard: React.FC<Props> = ({ settings }) => {
  const [babyAge, setBabyAge] = useState<{weeks: number, days: number}>({ weeks: 0, days: 0 });
  
  // Breastfeeding Timer State
  const [timer, setTimer] = useState(0); // in seconds
  const [isActive, setIsActive] = useState(false);
  const [activeSide, setActiveSide] = useState<'Left' | 'Right' | null>(null);

  // Milestones State
  const [completedMilestones, setCompletedMilestones] = useState<string[]>([]);

  // Daily Tip & Fact Logic
  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const dailyTip = TIP_LIBRARY.postpartum[dayOfYear % TIP_LIBRARY.postpartum.length];
  const didYouKnow = DID_YOU_KNOW_DATA.postpartum[dayOfYear % DID_YOU_KNOW_DATA.postpartum.length];

  useEffect(() => {
    if (settings.birthDate) {
      const birth = new Date(settings.birthDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - birth.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setBabyAge({
        weeks: Math.floor(diffDays / 7),
        days: diffDays % 7
      });
    }

    const savedMilestones = localStorage.getItem('bloom_milestones');
    if (savedMilestones) {
        setCompletedMilestones(JSON.parse(savedMilestones));
    }
  }, [settings.birthDate]);

  useEffect(() => {
    let interval: number | undefined;
    if (isActive) {
      interval = window.setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else if (!isActive && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleStart = (side: 'Left' | 'Right') => {
    if (activeSide !== side) {
      setTimer(0); // Reset if switching sides
    }
    setActiveSide(side);
    setIsActive(true);
  };

  const handleStop = () => {
    setIsActive(false);
    // Ideally save this log to storage here
  };

  const toggleMilestone = (id: string) => {
      let updated;
      if (completedMilestones.includes(id)) {
          updated = completedMilestones.filter(m => m !== id);
      } else {
          updated = [...completedMilestones, id];
      }
      setCompletedMilestones(updated);
      localStorage.setItem('bloom_milestones', JSON.stringify(updated));
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Hero: Baby Age */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                <Baby size={48} />
            </div>
            <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold">Welcome, {settings.babyName || "Little One"}!</h2>
                <div className="mt-2 text-xl font-medium opacity-90">
                    {babyAge.weeks} Weeks, {babyAge.days} Days Old
                </div>
                <p className="text-sm opacity-75 mt-1">Focus: Recovery & Bonding (The 4th Trimester)</p>
            </div>
         </div>
      </div>

      {/* Daily Tips & Facts (Postpartum Specific) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30">
               <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                   <Lightbulb size={20} /> Daily Recovery Tip
               </h4>
               <p className="text-sm text-blue-700 dark:text-blue-400 leading-relaxed">
                   {dailyTip}
               </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-3xl border border-purple-100 dark:border-purple-900/30">
               <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-2 flex items-center gap-2">
                   <BookOpen size={20} /> Did You Know?
               </h4>
               <p className="text-sm font-bold text-purple-700 dark:text-purple-400 mb-1">
                   {didYouKnow.title}
               </p>
               <p className="text-xs text-purple-600 dark:text-purple-500 leading-relaxed">
                   {didYouKnow.text}
               </p>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         
         {/* Breastfeeding Timer */}
         <div className="bg-white dark:bg-deep-card p-6 rounded-3xl shadow-lg border border-pink-100 dark:border-indigo-800">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                <Clock className="text-pink-500" /> Nursing Timer
            </h3>
            
            <div className="flex flex-col items-center justify-center py-4">
                <div className="text-5xl font-mono font-bold text-gray-700 dark:text-gray-200 mb-6 tracking-wider">
                    {formatTime(timer)}
                </div>
                
                <div className="flex gap-4 w-full">
                    <button 
                        onClick={() => handleStart('Left')}
                        disabled={isActive && activeSide === 'Right'}
                        className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${isActive && activeSide === 'Left' ? 'bg-pink-600 text-white shadow-lg ring-4 ring-pink-200' : 'bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 hover:bg-pink-100'}`}
                    >
                        Left
                    </button>
                    <button 
                        onClick={() => handleStart('Right')}
                        disabled={isActive && activeSide === 'Left'}
                        className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${isActive && activeSide === 'Right' ? 'bg-pink-600 text-white shadow-lg ring-4 ring-pink-200' : 'bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 hover:bg-pink-100'}`}
                    >
                        Right
                    </button>
                </div>

                <div className="flex gap-4 mt-4 w-full">
                    {isActive ? (
                        <Button variant="danger" onClick={handleStop} className="w-full">
                            <Square size={20} fill="currentColor" /> Stop
                        </Button>
                    ) : (
                       <Button variant="secondary" onClick={() => {setTimer(0); setActiveSide(null);}} disabled={timer === 0} className="w-full">
                            <RotateCcw size={20} /> Reset
                       </Button>
                    )}
                </div>
            </div>
         </div>

         {/* Recovery & Tips */}
         <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/10 p-6 rounded-3xl border border-green-100 dark:border-green-900/30">
                <h3 className="font-bold text-green-800 dark:text-green-300 flex items-center gap-2 mb-2">
                    <Activity size={20} /> Mom's Vitals Check
                </h3>
                <ul className="space-y-2 text-sm text-green-700 dark:text-green-400">
                    <li>• <strong>Hydration:</strong> Critical for milk supply. Drink 3-4L water.</li>
                    <li>• <strong>Rest:</strong> Sleep when the baby sleeps (easier said than done!).</li>
                    <li>• <strong>Iron/Calcium:</strong> Continue supplements for 3-6 months.</li>
                    <li>• <strong>Lochia:</strong> Bleeding may last 4-6 weeks. Watch for clots.</li>
                </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30">
                 <h3 className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2 mb-2">
                    <TrendingUp size={20} /> Growth Monitoring
                 </h3>
                 <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">
                    Ensure you are tracking your baby's weight, length, and head circumference on the standard <strong>WHO/IAP Growth Charts</strong> (available in your Mamta Card).
                 </p>
                 <div className="text-xs font-bold text-blue-600 uppercase">Next Checkup: {babyAge.weeks + 2} Weeks</div>
            </div>
         </div>
      </div>

      {/* Milestone Tracker Section */}
      <div className="bg-white dark:bg-deep-card rounded-3xl shadow-lg border border-gray-100 dark:border-indigo-800 overflow-hidden">
         <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white">
             <h3 className="text-xl font-bold flex items-center gap-2">
                 <Star size={24} fill="currentColor" /> Developmental Milestones
             </h3>
             <p className="text-sm opacity-90 mt-1">Based on Indian Academy of Pediatrics (IAP) Guidelines</p>
         </div>
         
         <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
             {BABY_MILESTONES.map((category, index) => (
                 <div key={index} className="space-y-3">
                     <h4 className="font-bold text-gray-800 dark:text-white border-b border-gray-100 dark:border-indigo-800 pb-2">
                         {category.ageRange}
                     </h4>
                     <ul className="space-y-2">
                         {category.items.map((milestone) => {
                             const isChecked = completedMilestones.includes(milestone.id);
                             return (
                                 <li key={milestone.id} className="flex items-start gap-3">
                                     <button 
                                         onClick={() => toggleMilestone(milestone.id)}
                                         className={`mt-0.5 shrink-0 transition-colors ${isChecked ? 'text-green-500' : 'text-gray-300 hover:text-green-400'}`}
                                     >
                                         {isChecked ? <CheckSquare size={20} /> : <SquareIcon size={20} />}
                                     </button>
                                     <div>
                                         <p className={`text-sm font-medium ${isChecked ? 'text-gray-500 line-through' : 'text-gray-700 dark:text-gray-200'}`}>
                                             {milestone.label}
                                         </p>
                                         <p className="text-xs text-gray-500 dark:text-gray-400">Target: {milestone.age}</p>
                                     </div>
                                 </li>
                             );
                         })}
                     </ul>
                 </div>
             ))}
         </div>
         <div className="px-6 pb-6 text-xs text-gray-400 italic">
             Note: Every baby is unique. These are general ranges. Consult your pediatrician if you notice significant delays.
         </div>
      </div>
    </div>
  );
};
