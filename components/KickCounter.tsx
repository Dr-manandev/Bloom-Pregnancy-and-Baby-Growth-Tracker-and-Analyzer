
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { KickSession } from '../types';
import { Play, Square, RotateCcw, History, Footprints } from 'lucide-react';

export const KickCounter: React.FC = () => {
  const [sessions, setSessions] = useState<KickSession[]>([]);
  const [currentSession, setCurrentSession] = useState<KickSession | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Load history from local storage
  useEffect(() => {
    const saved = localStorage.getItem('bloom_kicks');
    if (saved) {
      setSessions(JSON.parse(saved));
    }
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: number;
    if (currentSession && !currentSession.endTime) {
      interval = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentSession]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? `${hrs}h ` : ''}${mins}m ${secs}s`;
  };

  const handleKick = () => {
    if (navigator.vibrate) navigator.vibrate(50); // Haptic feedback

    if (!currentSession) {
      // Start new session
      const newSession: KickSession = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        startTime: new Date().toISOString(),
        endTime: null,
        count: 1,
        durationSeconds: 0
      };
      setCurrentSession(newSession);
      setElapsedTime(0);
    } else {
      // Increment count
      const updated = { ...currentSession, count: currentSession.count + 1 };
      
      // Auto-finish if reached 10 (Cardiff Count-to-10)
      if (updated.count === 10) {
        finishSession(updated);
      } else {
        setCurrentSession(updated);
      }
    }
  };

  const finishSession = (sessionData: KickSession = currentSession!) => {
    const finalSession = {
      ...sessionData,
      endTime: new Date().toISOString(),
      durationSeconds: elapsedTime
    };
    
    const newHistory = [finalSession, ...sessions];
    setSessions(newHistory);
    localStorage.setItem('bloom_kicks', JSON.stringify(newHistory));
    setCurrentSession(null);
    setElapsedTime(0);
  };

  const cancelSession = () => {
    setCurrentSession(null);
    setElapsedTime(0);
  };

  const clearHistory = () => {
    if(confirm("Clear all kick history?")) {
        setSessions([]);
        localStorage.removeItem('bloom_kicks');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 text-center">
            <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                <Footprints fill="currentColor" /> Fetal Movement Tracker
            </h2>
            <p className="opacity-90 mb-6">
                Standard: Reach 10 kicks within 2 hours.
            </p>

            <div className="mb-8">
                <div className="text-7xl font-bold mb-2">
                    {currentSession ? currentSession.count : 0}<span className="text-2xl opacity-60">/10</span>
                </div>
                <div className="text-xl font-mono opacity-80 bg-black/10 inline-block px-4 py-1 rounded-full">
                    {formatTime(elapsedTime)}
                </div>
            </div>

            <button
                onClick={handleKick}
                className="w-full max-w-xs mx-auto aspect-square rounded-full bg-white text-pink-600 shadow-lg flex flex-col items-center justify-center gap-2 transition-transform active:scale-95 hover:shadow-xl hover:bg-pink-50"
            >
                <Footprints size={64} fill="currentColor" />
                <span className="text-xl font-bold uppercase tracking-wider">Tap to Log Kick</span>
            </button>
            
            {currentSession && (
                <div className="flex gap-4 justify-center mt-8">
                    <button onClick={() => finishSession()} className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm font-medium transition-colors">
                        Finish Early
                    </button>
                    <button onClick={cancelSession} className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl backdrop-blur-sm font-medium transition-colors">
                        Cancel
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* History */}
      <div className="bg-white dark:bg-deep-card rounded-3xl shadow-lg border border-gray-100 dark:border-indigo-800 p-6">
          <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <History size={20} /> History
              </h3>
              {sessions.length > 0 && (
                  <button onClick={clearHistory} className="text-xs text-red-500 hover:underline">Clear All</button>
              )}
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {sessions.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">No sessions recorded yet.</div>
              ) : (
                  sessions.map(s => (
                      <div key={s.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-indigo-900/10 rounded-xl border border-gray-100 dark:border-indigo-900/30">
                          <div>
                              <p className="font-bold text-gray-800 dark:text-white">
                                  {new Date(s.startTime).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(s.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </p>
                          </div>
                          <div className="text-right">
                              <p className="font-bold text-pink-600 text-lg">{s.count} Kicks</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">in {formatTime(s.durationSeconds)}</p>
                          </div>
                      </div>
                  ))
              )}
          </div>
      </div>
    </div>
  );
};
