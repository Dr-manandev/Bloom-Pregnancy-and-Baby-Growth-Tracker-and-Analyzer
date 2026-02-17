
import React, { useState, useEffect } from 'react';
import { UserSettings } from '../types';
import { Button } from './Button';
import { Baby, Clock, Activity, TrendingUp, Square, RotateCcw, CheckSquare, Square as SquareIcon, Star, Lightbulb, BookOpen, Trash2, History, AlertTriangle, ShieldAlert, Info, Filter, X } from 'lucide-react';
import { DETAILED_MILESTONES, TIP_LIBRARY, DID_YOU_KNOW_DATA, DEVELOPMENTAL_RED_FLAGS } from '../constants';

interface Props {
  settings: UserSettings;
}

interface NursingLog {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  side: 'Left' | 'Right';
}

export const PostpartumDashboard: React.FC<Props> = ({ settings }) => {
  const [babyAge, setBabyAge] = useState<{weeks: number, days: number, totalMonths: number}>({ weeks: 0, days: 0, totalMonths: 0 });
  
  // Breastfeeding Timer State
  const [timer, setTimer] = useState(0); // in seconds
  const [isActive, setIsActive] = useState(false);
  const [activeSide, setActiveSide] = useState<'Left' | 'Right' | null>(null);
  const [nursingLogs, setNursingLogs] = useState<NursingLog[]>([]);

  // Milestones State
  const [completedMilestones, setCompletedMilestones] = useState<string[]>([]);
  
  // Milestone Filter State
  const [viewAge, setViewAge] = useState<{year: number | 'all', month: number}>({ year: 'all', month: 0 });

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
      
      // Calculate months roughly for Red Flag logic
      const diffMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
      const adjustedMonths = now.getDate() < birth.getDate() ? diffMonths - 1 : diffMonths;

      setBabyAge({
        weeks: Math.floor(diffDays / 7),
        days: diffDays % 7,
        totalMonths: Math.max(0, adjustedMonths)
      });
    }

    const savedMilestones = localStorage.getItem('bloom_milestones');
    if (savedMilestones) {
        setCompletedMilestones(JSON.parse(savedMilestones));
    }

    const savedLogs = localStorage.getItem('bloom_nursing_logs');
    if (savedLogs) {
        setNursingLogs(JSON.parse(savedLogs));
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
    if (activeSide && timer > 0) {
        const now = new Date();
        const start = new Date(now.getTime() - timer * 1000);
        
        const newLog: NursingLog = {
            id: Date.now().toString(),
            startTime: start.toISOString(),
            endTime: now.toISOString(),
            duration: timer,
            side: activeSide
        };
        
        const updatedLogs = [newLog, ...nursingLogs];
        setNursingLogs(updatedLogs);
        localStorage.setItem('bloom_nursing_logs', JSON.stringify(updatedLogs));
        
        // Reset after save
        setTimer(0);
        setActiveSide(null);
    }
  };

  const deleteNursingLog = (id: string) => {
      if(confirm("Delete this log?")) {
          const updated = nursingLogs.filter(l => l.id !== id);
          setNursingLogs(updated);
          localStorage.setItem('bloom_nursing_logs', JSON.stringify(updated));
      }
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

  // --- RED FLAG CHECKER ---
  const activeRedFlags = DEVELOPMENTAL_RED_FLAGS.filter(flag => {
      // If baby is older than the limit for the flag
      if (babyAge.totalMonths >= flag.limitMonth) {
          // And the milestone is NOT completed
          return !completedMilestones.includes(flag.linkedMilestoneId);
      }
      return false;
  });

  // --- MILESTONE FILTER LOGIC ---
  const parseAgeToMonths = (ageStr: string) => {
      if (ageStr.toLowerCase().includes('neonatal')) return 0;
      // Handle ranges like "5–6 months" (en-dash) or "2-4 months"
      const normalized = ageStr.replace('–', '-');
      const matches = normalized.match(/(\d+(\.\d+)?)/g);
      
      if (!matches) return 999; // Should not happen with valid data
      
      // Use the upper bound for "attained by" logic
      // e.g. "2-4 months" -> 4 months. If baby is 4 months, they should attain it.
      let value = parseFloat(matches[matches.length - 1]);
      
      if (ageStr.toLowerCase().includes('year')) {
          value = Math.round(value * 12);
      }
      
      return value;
  };

  const visibleMilestones = React.useMemo(() => {
      if (viewAge.year === 'all') return DETAILED_MILESTONES;
      
      const targetMonths = (viewAge.year * 12) + viewAge.month;
      
      return DETAILED_MILESTONES.map(domain => ({
          ...domain,
          items: domain.items.filter(item => parseAgeToMonths(item.age) <= targetMonths)
      })).filter(domain => domain.items.length > 0);
  }, [viewAge]);

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
                    {babyAge.weeks} Weeks, {babyAge.days} Days Old ({babyAge.totalMonths} months)
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
         <div className="bg-white dark:bg-deep-card p-6 rounded-3xl shadow-lg border border-pink-100 dark:border-indigo-800 flex flex-col h-full">
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
                            <Square size={20} fill="currentColor" /> Stop & Log
                        </Button>
                    ) : (
                       <Button variant="secondary" onClick={() => {setTimer(0); setActiveSide(null);}} disabled={timer === 0} className="w-full">
                            <RotateCcw size={20} /> Reset
                       </Button>
                    )}
                </div>
            </div>

            {/* Logs Section */}
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-indigo-800 flex-1">
                <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2 text-sm uppercase">
                    <History size={16} /> Recent Logs
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {nursingLogs.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-4">No sessions logged yet.</p>
                    ) : (
                        nursingLogs.map(log => (
                            <div key={log.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-indigo-900/10 rounded-xl border border-gray-100 dark:border-indigo-900/30">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${log.side === 'Left' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {log.side}
                                        </span>
                                        <span className="text-sm font-bold text-gray-800 dark:text-white">{formatTime(log.duration)}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-1">
                                        {new Date(log.startTime).toLocaleString([], {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
                                    </p>
                                </div>
                                <button onClick={() => deleteNursingLog(log.id)} className="text-gray-400 hover:text-red-500">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
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

      {/* --- DEVELOPMENTAL ALERTS (RED FLAGS) --- */}
      {activeRedFlags.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-3xl animate-pulse-slow">
              <h3 className="text-xl font-bold text-red-700 dark:text-red-400 flex items-center gap-2 mb-3">
                  <ShieldAlert size={24} /> Developmental Red Flags
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 bg-white/50 dark:bg-black/20 p-3 rounded-xl">
                  Based on your baby's age ({babyAge.totalMonths} months), the following milestones should typically be achieved. Please consult a pediatrician if these persist.
              </p>
              <div className="space-y-3">
                  {activeRedFlags.map((flag, idx) => (
                      <div key={idx} className="bg-white dark:bg-deep-card p-4 rounded-xl border border-red-100 dark:border-red-900/50 shadow-sm">
                          <p className="font-bold text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                              <AlertTriangle size={16}/> {flag.condition}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                              <strong>Suggests possible:</strong> {flag.suggests}
                          </p>
                          <p className="text-xs text-gray-400 italic mt-1">Expected by {flag.limitMonth} months</p>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* Milestone Tracker Section */}
      <div className="bg-white dark:bg-deep-card rounded-3xl shadow-lg border border-gray-100 dark:border-indigo-800 overflow-hidden">
         <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white">
             <h3 className="text-xl font-bold flex items-center gap-2">
                 <Star size={24} fill="currentColor" /> Developmental Milestones
             </h3>
             <p className="text-sm opacity-90 mt-1">Checklist based on Indian Academy of Pediatrics (IAP) Guidelines</p>
         </div>
         
         {/* Age Filter UI */}
         <div className="p-4 bg-gray-50 dark:bg-indigo-950/30 border-b border-gray-100 dark:border-indigo-800 flex flex-col md:flex-row items-start md:items-center gap-4">
             <div className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300">
                 <Filter size={16} /> Filter by Age:
             </div>
             
             <div className="flex flex-wrap gap-2">
                 <select 
                    value={viewAge.year} 
                    onChange={(e) => setViewAge({ ...viewAge, year: e.target.value === 'all' ? 'all' : parseInt(e.target.value) })}
                    className="px-3 py-2 rounded-lg border border-gray-200 dark:border-indigo-700 bg-white dark:bg-deep-card text-gray-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-yellow-500"
                 >
                     <option value="all">All Years</option>
                     {[0,1,2,3,4,5].map(y => <option key={y} value={y}>{y} Year{y !== 1 ? 's' : ''}</option>)}
                 </select>

                 <select 
                    value={viewAge.month} 
                    onChange={(e) => setViewAge({ ...viewAge, month: parseInt(e.target.value) })}
                    disabled={viewAge.year === 'all'}
                    className={`px-3 py-2 rounded-lg border border-gray-200 dark:border-indigo-700 bg-white dark:bg-deep-card text-gray-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-yellow-500 ${viewAge.year === 'all' ? 'opacity-50 cursor-not-allowed' : ''}`}
                 >
                     {[0,1,2,3,4,5,6,7,8,9,10,11].map(m => <option key={m} value={m}>{m} Month{m !== 1 ? 's' : ''}</option>)}
                 </select>

                 {viewAge.year !== 'all' && (
                     <button 
                        onClick={() => setViewAge({ year: 'all', month: 0 })}
                        className="px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 text-sm font-bold flex items-center gap-1"
                     >
                         <X size={14} /> Clear
                     </button>
                 )}
             </div>
             
             {viewAge.year !== 'all' && (
                 <div className="text-xs text-gray-500 dark:text-gray-400 font-medium ml-auto">
                     Showing milestones typically attained by <strong>{viewAge.year * 12 + viewAge.month} months</strong>.
                 </div>
             )}
         </div>

         <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
             {visibleMilestones.length > 0 ? visibleMilestones.map((domain, index) => (
                 <div key={index} className="space-y-3">
                     <h4 className="font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-indigo-700 pb-2 mb-3 text-lg flex items-center gap-2">
                         <span className="w-2 h-6 bg-yellow-500 rounded-full inline-block"></span>
                         {domain.category}
                     </h4>
                     <ul className="space-y-2">
                         {domain.items.map((milestone) => {
                             const isChecked = completedMilestones.includes(milestone.id);
                             return (
                                 <li key={milestone.id} className={`flex items-start gap-3 p-2 rounded-lg transition-colors ${isChecked ? 'bg-green-50 dark:bg-green-900/10' : 'hover:bg-gray-50 dark:hover:bg-indigo-900/20'}`}>
                                     <button 
                                         onClick={() => toggleMilestone(milestone.id)}
                                         className={`mt-0.5 shrink-0 transition-colors ${isChecked ? 'text-green-500' : 'text-gray-300 hover:text-green-400'}`}
                                     >
                                         {isChecked ? <CheckSquare size={20} /> : <SquareIcon size={20} />}
                                     </button>
                                     <div className="flex-1">
                                         <p className={`text-sm font-medium ${isChecked ? 'text-gray-500 line-through' : 'text-gray-800 dark:text-gray-200'}`}>
                                             {milestone.milestone}
                                         </p>
                                         <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5 bg-gray-100 dark:bg-indigo-900/50 inline-block px-2 py-0.5 rounded">
                                             Target: {milestone.age}
                                         </p>
                                     </div>
                                 </li>
                             );
                         })}
                     </ul>
                 </div>
             )) : (
                 <div className="col-span-full text-center py-10 text-gray-400">
                     <p>No milestones found for this specific age criteria.</p>
                     <button onClick={() => setViewAge({ year: 'all', month: 0 })} className="text-yellow-600 underline mt-2 text-sm">View All Milestones</button>
                 </div>
             )}
         </div>
         <div className="px-6 pb-6 text-xs text-gray-500 dark:text-gray-400 italic border-t border-gray-100 dark:border-indigo-800 pt-4 mt-2">
             <p className="font-bold flex items-center gap-1 mb-1"><Info size={14}/> Medical Disclaimer:</p>
             Milestone ages are approximate. Every child develops at their own pace. Minor delays can be normal. If delays are significant, involve multiple areas, or there is loss of previously attained skills, consult a pediatrician early.
         </div>
      </div>
    </div>
  );
};
