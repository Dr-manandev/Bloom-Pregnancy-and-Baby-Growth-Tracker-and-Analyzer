
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Contraction } from '../types';
import { Play, Square, RotateCcw, AlertCircle, Clock, Activity } from 'lucide-react';

export const ContractionTimer: React.FC = () => {
  const [contractions, setContractions] = useState<Contraction[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);

  // Load history
  useEffect(() => {
    const saved = localStorage.getItem('bloom_contractions');
    if (saved) {
      setContractions(JSON.parse(saved));
    }
  }, []);

  // Timer
  useEffect(() => {
    let interval: number;
    if (activeId) {
      interval = window.setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeId]);

  const toggleTimer = () => {
    if (activeId) {
      // STOP
      const updated = contractions.map(c => {
        if (c.id === activeId) {
          return {
            ...c,
            endTime: new Date().toISOString(),
            durationSeconds: timer
          };
        }
        return c;
      });
      setContractions(updated);
      localStorage.setItem('bloom_contractions', JSON.stringify(updated));
      setActiveId(null);
      setTimer(0);
    } else {
      // START
      const now = new Date();
      const lastContraction = contractions.length > 0 ? contractions[0] : null;
      
      let frequency = null;
      if (lastContraction) {
        const lastStart = new Date(lastContraction.startTime).getTime();
        const currentStart = now.getTime();
        frequency = Math.floor((currentStart - lastStart) / 1000);
      }

      const newContraction: Contraction = {
        id: Date.now().toString(),
        startTime: now.toISOString(),
        endTime: null,
        durationSeconds: 0,
        frequencySeconds: frequency
      };
      
      // Add to TOP of list
      const updated = [newContraction, ...contractions];
      setContractions(updated);
      setActiveId(newContraction.id);
      setTimer(0);
    }
  };

  const resetAll = () => {
    if (confirm("Delete all contraction history?")) {
      setContractions([]);
      localStorage.removeItem('bloom_contractions');
      setActiveId(null);
      setTimer(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatDuration = (seconds: number) => {
     if (seconds < 60) return `${seconds}s`;
     return `${Math.floor(seconds/60)}m ${seconds%60}s`;
  };

  const formatFreq = (seconds: number | null) => {
     if (!seconds) return '-';
     const mins = Math.floor(seconds / 60);
     return `${mins} min`;
  };

  // 5-1-1 Rule Analysis
  // Contractions 5 mins apart, lasting 1 minute, for 1 hour.
  const analyzeLabor = () => {
      if (contractions.length < 3) return null;
      
      const recent = contractions.slice(0, 5); // check last 5
      const avgFreq = recent.reduce((acc, c) => acc + (c.frequencySeconds || 0), 0) / (recent.length - 1); // exclude first
      const avgDur = recent.reduce((acc, c) => acc + c.durationSeconds, 0) / recent.length;

      // 5 mins = 300s, 1 min = 60s
      if (avgFreq > 0 && avgFreq <= 360 && avgDur >= 45) {
          return {
              status: 'hospital',
              message: "Hospital Alert! Contractions are consistent (~5 min apart). Call your doctor."
          };
      }
      if (avgFreq > 0 && avgFreq <= 600) {
          return {
              status: 'prepare',
              message: "Labor may be progressing. Pack your bags."
          };
      }
      return {
          status: 'early',
          message: "Early labor or Braxton Hicks. Keep monitoring."
      };
  };

  const alert = analyzeLabor();

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Timer Section */}
      <div className={`rounded-3xl p-8 text-white shadow-xl transition-colors duration-500 relative overflow-hidden ${activeId ? 'bg-green-600' : 'bg-gradient-to-br from-blue-600 to-indigo-600'}`}>
         {/* Background pulse animation when active */}
         {activeId && (
            <div className="absolute inset-0 bg-green-500 animate-pulse opacity-50"></div>
         )}
         
         <div className="relative z-10 flex flex-col items-center justify-center text-center">
             <h2 className="text-xl font-bold uppercase tracking-widest opacity-80 mb-2">
                 {activeId ? "Contraction Active" : "Ready to Timer"}
             </h2>
             
             <div className="text-7xl font-mono font-bold mb-8 tabular-nums">
                 {formatTime(timer)}
             </div>

             <button
                onClick={toggleTimer}
                className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 ${activeId ? 'bg-white text-green-600 hover:bg-gray-100' : 'bg-white text-indigo-600 hover:bg-gray-100'}`}
             >
                {activeId ? <Square size={32} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-1" />}
             </button>
             
             <p className="mt-6 font-medium opacity-90">
                 {activeId ? "Breathe... Relax your shoulders." : "Press Play when pain starts"}
             </p>
         </div>
      </div>

      {/* Alert Section */}
      {alert && contractions.length >= 3 && (
          <div className={`p-4 rounded-xl border flex gap-3 items-start ${
              alert.status === 'hospital' ? 'bg-red-100 border-red-300 text-red-800' : 
              alert.status === 'prepare' ? 'bg-orange-100 border-orange-300 text-orange-800' : 
              'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
              <AlertCircle className="shrink-0 mt-0.5" />
              <div>
                  <h4 className="font-bold">Analysis</h4>
                  <p className="text-sm">{alert.message}</p>
              </div>
          </div>
      )}

      {/* History List */}
      <div className="bg-white dark:bg-deep-card rounded-3xl shadow-lg border border-gray-100 dark:border-indigo-800 overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-indigo-800 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <Activity size={20} /> History
              </h3>
              {contractions.length > 0 && <button onClick={resetAll} className="text-xs text-red-500">Reset</button>}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-indigo-900/30 text-gray-500 dark:text-gray-400">
                    <tr>
                        <th className="p-4 font-bold">Start Time</th>
                        <th className="p-4 font-bold">Duration</th>
                        <th className="p-4 font-bold">Frequency</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-indigo-800">
                    {contractions.length === 0 ? (
                        <tr><td colSpan={3} className="p-8 text-center text-gray-400">No contractions recorded.</td></tr>
                    ) : (
                        contractions.map((c, i) => (
                            <tr key={c.id} className={i === 0 && activeId ? "bg-green-50 dark:bg-green-900/10 animate-pulse" : ""}>
                                <td className="p-4 text-gray-800 dark:text-white">
                                    {new Date(c.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                </td>
                                <td className="p-4 font-bold text-gray-800 dark:text-white">
                                    {c.endTime || activeId === c.id ? formatDuration(c.durationSeconds) : '...'}
                                </td>
                                <td className="p-4 text-gray-600 dark:text-gray-300">
                                    {formatFreq(c.frequencySeconds)}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-indigo-950/30 text-xs text-gray-500 dark:text-gray-400">
              <p><strong>Frequency:</strong> Time from start of one contraction to the start of the next.</p>
              <p><strong>5-1-1 Rule:</strong> Contractions 5 mins apart, lasting 1 min, for 1 hour = Call Doctor.</p>
          </div>
      </div>

    </div>
  );
};
