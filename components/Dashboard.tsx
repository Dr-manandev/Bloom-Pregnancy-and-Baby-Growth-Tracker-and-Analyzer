import React, { useState, useEffect, useRef } from 'react';
import { PregnancyCalculations, WeeklyInfo, UserSettings, Medicine } from '../types';
import { WEEKLY_DATA, FALLBACK_WEEKLY_INFO, SCAN_SCHEDULE, LAB_SCHEDULE, MATERNAL_VACCINES, MATERNAL_AGE_RISKS, OBSTETRIC_HISTORY_RISKS, TIP_LIBRARY } from '../constants';
import { getPregnancyAdvice } from '../services/geminiService';
import { Button } from './Button';
import { Info, Baby, AlertCircle, Bell, RotateCcw, Syringe, Sparkles, FlaskConical, ShieldAlert, Key, CheckCircle2, Lightbulb, Pill, Ruler, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  calculations: PregnancyCalculations;
  settings: UserSettings;
}

export const Dashboard: React.FC<Props> = ({ calculations, settings }) => {
  // Use local state for navigation, initialize with actual current week
  const [selectedWeek, setSelectedWeek] = useState(calculations.currentWeek);
  const [todaysMedicines, setTodaysMedicines] = useState<Medicine[]>([]);
  
  // Reset selected week if calculations change (e.g. profile update)
  useEffect(() => {
    setSelectedWeek(calculations.currentWeek);
  }, [calculations.currentWeek]);

  // Load Medicines for Dashboard Alert
  useEffect(() => {
      const isPostpartum = settings.status === 'postpartum';
      const key = isPostpartum ? 'bloom_pp_medicines' : 'bloom_medicines';
      const stored = localStorage.getItem(key);
      if (stored) {
          const parsed: Medicine[] = JSON.parse(stored);
          // Filter for medicines not taken
          setTodaysMedicines(parsed.filter(m => !m.taken));
      } else {
          setTodaysMedicines([]);
      }
  }, [settings.status]); // Re-run when status changes or component mounts

  // Derived calculations for the SELECTED week (for display purposes)
  const displayTrimester = selectedWeek <= 13 ? 1 : selectedWeek <= 27 ? 2 : 3;
  const displayMonth = Math.ceil(selectedWeek / 4.3);
  const displayProgress = Math.min((selectedWeek / 40) * 100, 100);
  
  const availableWeeks = Object.keys(WEEKLY_DATA).map(Number).sort((a, b) => a - b);
  const closestWeek = availableWeeks.reduce((prev, curr) => 
    Math.abs(curr - selectedWeek) < Math.abs(prev - selectedWeek) ? curr : prev
  );
  
  const weekInfo: WeeklyInfo = WEEKLY_DATA[selectedWeek] || WEEKLY_DATA[closestWeek] || FALLBACK_WEEKLY_INFO;

  // Filter scans relevant to the selected week range
  const relevantScans = SCAN_SCHEDULE.filter(scan => {
    return (selectedWeek >= scan.weekStart - 1 && selectedWeek <= scan.weekEnd);
  });

  // Filter Lab Tests relevant to current week
  const relevantLabs = LAB_SCHEDULE.filter(lab => {
      // Basic week check
      const isTime = selectedWeek >= lab.weekStart - 1 && selectedWeek <= lab.weekEnd;
      if (!isTime) return false;

      // Condition check
      if (lab.condition) {
          if (lab.condition === 'thyroid' && !settings.comorbidities.includes('thyroid')) return false;
          if (lab.condition === 'anemia' && !settings.comorbidities.includes('anemia')) return false;
          if (lab.condition === 'rh_negative' && (!settings.maternalBloodGroup || !settings.maternalBloodGroup.includes('-'))) return false;
      }
      return true;
  });

  // Filter VACCINES relevant to current week (Maternal)
  const vaccinationsDone = settings.vaccinationsDone || [];
  const upcomingVaccines = MATERNAL_VACCINES.filter(vax => {
    const isDone = vaccinationsDone.includes(vax.id);
    // Show if due within next 4 weeks or overdue
    return !isDone && (selectedWeek >= vax.dueWeekStart - 2 && selectedWeek <= vax.dueWeekEnd + 4);
  });

  const selectedComorbidities = settings.comorbidities || [];

  const [question, setQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [missingKey, setMissingKey] = useState(false);

  const askAi = async () => {
    if (!question.trim()) return;
    setLoadingAi(true);
    setMissingKey(false);
    
    // Pass selectedWeek so AI answers for the context the user is viewing
    const answer = await getPregnancyAdvice(question, selectedWeek);
    
    if (answer === "MISSING_KEY") {
        setMissingKey(true);
        setAiAnswer(null);
    } else {
        setAiAnswer(answer);
    }
    
    setLoadingAi(false);
  };

  // Navigation Handlers
  const handlePrevWeek = () => {
    if (selectedWeek > 1) setSelectedWeek(p => p - 1);
  };

  const handleNextWeek = () => {
    if (selectedWeek < 42) setSelectedWeek(p => p + 1);
  };

  const handleResetToCurrent = () => {
    setSelectedWeek(calculations.currentWeek);
  };

  // Swipe Logic
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) handleNextWeek();
    if (isRightSwipe) handlePrevWeek();
  };

  // --- RISK STRATIFICATION ENGINE (FOGSI / WHO) ---
  const calculateRiskProfile = () => {
      const risks: string[] = [];
      const actions: string[] = [];
      let level: 'Low' | 'Moderate' | 'High' = 'Low';

      // 1. Age
      const age = settings.age;
      if (age) {
          if (age < 18) {
              level = 'Moderate';
              risks.push(MATERNAL_AGE_RISKS.teenage.label);
              actions.push(MATERNAL_AGE_RISKS.teenage.action);
          } else if (age > 35) {
              level = 'High';
              risks.push(MATERNAL_AGE_RISKS.advanced.label);
              actions.push(MATERNAL_AGE_RISKS.advanced.action);
          }
      }

      // 2. BMI
      if (settings.heightCm && settings.prePregnancyWeight) {
          const bmi = settings.prePregnancyWeight / ((settings.heightCm / 100) ** 2);
          if (bmi > 30) {
              level = 'High';
              risks.push("Obesity (BMI > 30)");
              actions.push("High risk of GDM/HTN. Early GTT required. Monitor fetal growth.");
          } else if (bmi < 18.5) {
              level = level === 'High' ? 'High' : 'Moderate';
              risks.push("Underweight (BMI < 18.5)");
              actions.push("Risk of IUGR (Small Baby). Increase caloric intake.");
          }
      }

      // 3. Short Stature (FOGSI Risk Factor)
      if (settings.heightCm && settings.heightCm < 145) {
          level = level === 'High' ? 'High' : 'Moderate';
          risks.push("Short Stature (<145cm)");
          actions.push("Risk of Cephalo-Pelvic Disproportion (CPD). Hospital delivery mandatory.");
      }

      // 4. Comorbidities
      if (selectedComorbidities.length > 0) {
          level = 'High';
          // Actions handled by existing comorbidity logic in UI
      }

      // 5. Obstetric History
      const obs = settings.obstetricHistory;
      if (obs) {
          if (obs.abortionsT1 >= 2) {
              level = 'High';
              risks.push(OBSTETRIC_HISTORY_RISKS.recurrent_t1.label);
              actions.push(OBSTETRIC_HISTORY_RISKS.recurrent_t1.action);
          }
          if (obs.abortionsT2 >= 1) {
              level = 'High';
              risks.push(OBSTETRIC_HISTORY_RISKS.t2_loss.label);
              actions.push(OBSTETRIC_HISTORY_RISKS.t2_loss.action);
          }
          if (obs.lastBabyCongenitalDefect) {
              level = 'High';
              risks.push(OBSTETRIC_HISTORY_RISKS.prev_anomaly.label);
              actions.push(OBSTETRIC_HISTORY_RISKS.prev_anomaly.action);
          }
          // Grand Multipara (FOGSI)
          if (obs.para >= 4) {
              level = 'High';
              risks.push("Grand Multipara (Para ≥ 4)");
              actions.push("High risk of PPH and Anemia. Active management of labor required.");
          }
      }

      return { level, risks, actions };
  };

  const riskProfile = calculateRiskProfile();

  const isFuture = selectedWeek > calculations.currentWeek;
  const isPast = selectedWeek < calculations.currentWeek;

  // NEW: Dynamic Daily Tip Logic (Day Specific to Week)
  // If user is in week X, calculate day of week (0-6).
  // Use day of week index to pick tip from weekly info.
  // Fallback to day of year if weekly tips missing.
  let currentTip = "";
  if (weekInfo.dailyTips && weekInfo.dailyTips.length > 0) {
      // If we are viewing current week, show tip for current day of week (0-6)
      // If viewing past/future, just show tip 1 or loop through
      const dayIndex = selectedWeek === calculations.currentWeek 
          ? (calculations.currentDay % 7) 
          : 0; 
      currentTip = weekInfo.dailyTips[dayIndex] || weekInfo.dailyTips[0];
  } else {
      currentTip = "Stay hydrated and rest well. Listen to your body.";
  }

  // Determine Biometry Availability
  const hasBiometry = weekInfo.biometry && (Object.keys(weekInfo.biometry).length > 0);

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Navigation Header if not on current week */}
      {(isFuture || isPast) && (
        <div className="flex justify-center -mb-4 z-10 relative">
          <button 
            onClick={handleResetToCurrent}
            className="flex items-center gap-2 px-4 py-2 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-sm font-bold hover:bg-pink-200 transition-colors shadow-sm"
          >
            <RotateCcw size={14} /> Back to Current Week ({calculations.currentWeek})
          </button>
        </div>
      )}

      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Swipeable Progress Card */}
        <div 
            className="col-span-1 md:col-span-2 bg-gradient-to-br from-pink-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl shadow-pink-500/20 relative overflow-hidden select-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none"></div>
            
            {/* Desktop Arrows */}
            <button 
                onClick={handlePrevWeek}
                disabled={selectedWeek <= 1}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-all disabled:opacity-0 hidden md:block z-20"
            >
                <ChevronLeft size={24} />
            </button>
            <button 
                onClick={handleNextWeek}
                disabled={selectedWeek >= 42}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-all disabled:opacity-0 hidden md:block z-20"
            >
                <ChevronRight size={24} />
            </button>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-center md:justify-start">
                <div className="relative w-40 h-40 flex-shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle className="text-white/20 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"></circle>
                        <circle 
                            className="text-white stroke-current transition-all duration-500 ease-out" 
                            strokeWidth="8" 
                            strokeLinecap="round" 
                            cx="50" 
                            cy="50" 
                            r="40" 
                            fill="transparent" 
                            strokeDasharray="251.2" 
                            strokeDashoffset={251.2 - (251.2 * displayProgress) / 100}
                        ></circle>
                    </svg>
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center">
                        <span className="text-4xl font-bold">{selectedWeek}</span>
                        <span className="text-sm font-medium opacity-80">
                           {selectedWeek === calculations.currentWeek ? `+ ${calculations.currentDay}d` : 'Weeks'}
                        </span>
                    </div>
                </div>

                <div className="text-center md:text-left space-y-2">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                        {/* Mobile Arrows Inline */}
                        <button onClick={handlePrevWeek} className="md:hidden p-1 text-white/70 active:text-white"><ChevronLeft size={24} /></button>
                        <h2 className="text-2xl font-bold text-white">
                           {isFuture 
                               ? 'Future View' 
                               : isPast 
                                    ? 'Past View' 
                                    : `Week ${selectedWeek}, Day ${calculations.currentDay}`
                           }
                        </h2>
                        <button onClick={handleNextWeek} className="md:hidden p-1 text-white/70 active:text-white"><ChevronRight size={24} /></button>
                    </div>
                    
                    <p className="text-lg text-white font-medium">Trimester {displayTrimester}</p>
                    <p className="opacity-90 text-white text-sm">
                        {isFuture 
                            ? `Previewing your journey for Week ${selectedWeek}` 
                            : `Estimated Due Date: ${calculations.edd.toDateString()}`
                        }
                    </p>
                    
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-4">
                        <span className="px-3 py-1 bg-white/20 rounded-full text-xs backdrop-blur-md text-white">
                             Month {displayMonth}
                        </span>
                        {/* Risk Label */}
                        <span className={`px-3 py-1 rounded-full text-xs backdrop-blur-md text-white font-bold border border-white/20 ${riskProfile.level === 'High' ? 'bg-red-500/50' : riskProfile.level === 'Moderate' ? 'bg-yellow-500/50' : 'bg-green-500/30'}`}>
                            {riskProfile.level} Risk Profile
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="md:hidden text-center mt-4 text-white/40 text-xs">
                Swipe left/right to navigate
            </div>
        </div>

        {/* Baby Size Card - Dynamic */}
        <div className="bg-white dark:bg-deep-card p-6 rounded-3xl shadow-lg border border-pink-100 dark:border-indigo-800 flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-300">
             <div className="absolute inset-0 bg-gradient-to-tr from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 opacity-50"></div>
             <div className="relative z-10 w-full animate-fade-in" key={selectedWeek}> 
                {/* Key forces re-render animation on week change */}
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white shadow-lg">
                    <Baby size={40} />
                </div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider mb-1">
                    Week {selectedWeek} Size
                </h3>
                <p className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{weekInfo.babySize}</p>
                <div className="flex justify-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                    <div>
                        <span className="block font-bold">{weekInfo.babyWeight}</span>
                        <span className="text-xs">Avg Weight</span>
                    </div>
                    <div className="w-px bg-gray-300 dark:bg-gray-600"></div>
                    <div>
                        <span className="block font-bold">{weekInfo.babyLength}</span>
                        <span className="text-xs">Avg Length</span>
                    </div>
                </div>
             </div>
        </div>
      </div>

      {/* --- MEDICINE ALERT WIDGET --- */}
      {todaysMedicines.length > 0 && selectedWeek === calculations.currentWeek && (
          <div className="bg-teal-50 dark:bg-teal-900/10 p-4 rounded-3xl border border-teal-100 dark:border-teal-900/30 flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="bg-teal-100 dark:bg-teal-800/30 p-3 rounded-full text-teal-600 dark:text-teal-400 shrink-0">
                  <Pill className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex-1">
                  <h3 className="font-bold text-teal-800 dark:text-teal-200 text-sm uppercase">Medicine Due Today</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                      {todaysMedicines.map((med) => (
                          <div key={med.id} className="bg-white dark:bg-black/20 px-3 py-1 rounded-lg text-xs font-bold text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                              {med.name} <span className="opacity-70">({med.time})</span>
                          </div>
                      ))}
                  </div>
              </div>
              <button 
                onClick={() => document.getElementById('tab-medicines')?.click()}
                className="text-xs font-bold bg-teal-600 text-white px-4 py-2 rounded-xl shadow-md hover:bg-teal-700 transition-colors whitespace-nowrap"
              >
                  Go to Meds
              </button>
          </div>
      )}

      {/* --- CLINICAL RISK PROFILE CARD (FOGSI) --- */}
      {(riskProfile.level !== 'Low' || riskProfile.actions.length > 0) && selectedWeek === calculations.currentWeek && (
          <div className={`rounded-3xl shadow-lg border p-6 ${riskProfile.level === 'High' ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30' : 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/30'}`}>
              <div className="flex items-center gap-3 mb-3">
                  <ShieldAlert className={riskProfile.level === 'High' ? "text-red-600" : "text-yellow-600"} />
                  <h3 className={`text-lg font-bold ${riskProfile.level === 'High' ? "text-red-800 dark:text-red-200" : "text-yellow-800 dark:text-yellow-200"}`}>
                      Clinical Risk Assessment: {riskProfile.level} Risk
                  </h3>
              </div>
              
              <div className="space-y-4">
                  <div>
                      <p className="text-xs font-bold uppercase opacity-70 mb-1 text-gray-700 dark:text-gray-300">Detected Factors:</p>
                      <div className="flex flex-wrap gap-2">
                          {riskProfile.risks.length > 0 ? riskProfile.risks.map((r, i) => (
                              <span key={i} className="px-2 py-1 bg-white/50 dark:bg-black/20 rounded text-sm font-medium border border-black/5 dark:border-white/10 text-gray-800 dark:text-gray-200">
                                  {r}
                              </span>
                          )) : <span className="text-sm text-gray-500">Based on Comorbidities/History</span>}
                      </div>
                  </div>
                  
                  {riskProfile.actions.length > 0 && (
                      <div className="bg-white/60 dark:bg-black/20 p-4 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 size={16} className="text-green-600 dark:text-green-400" />
                              <p className="text-xs font-bold uppercase opacity-70 text-gray-800 dark:text-white">Medical Recommendations (India/FOGSI):</p>
                          </div>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-800 dark:text-gray-200 font-medium">
                              {riskProfile.actions.map((action, i) => (
                                  <li key={i}>{action}</li>
                              ))}
                          </ul>
                      </div>
                  )}
                  
                  <p className="text-xs italic opacity-80 mt-2 text-gray-600 dark:text-gray-400 border-t border-gray-300 dark:border-gray-700 pt-2">
                      Disclaimer: This assessment is based on FOGSI (India) & WHO standard guidelines. Please discuss this risk profile with your gynecologist for a personalized care plan.
                  </p>
              </div>
          </div>
      )}

      {/* --- FETAL BIOMETRY REFERENCE (NEW) --- */}
      {hasBiometry && (
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-800 shadow-sm animate-fade-in">
              <h3 className="font-bold text-indigo-800 dark:text-indigo-200 flex items-center gap-2 mb-4">
                  <Ruler size={20} /> Fetal Biometry Reference (Week {weekInfo.week})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {weekInfo.biometry?.bpd && (
                      <div className="bg-white dark:bg-indigo-950/50 p-3 rounded-xl border border-indigo-50 dark:border-indigo-900">
                          <p className="text-xs text-indigo-500 dark:text-indigo-400 uppercase font-bold">BPD (Head Width)</p>
                          <p className="text-lg font-bold text-gray-800 dark:text-white">{weekInfo.biometry.bpd}</p>
                      </div>
                  )}
                  {weekInfo.biometry?.fl && (
                      <div className="bg-white dark:bg-indigo-950/50 p-3 rounded-xl border border-indigo-50 dark:border-indigo-900">
                          <p className="text-xs text-indigo-500 dark:text-indigo-400 uppercase font-bold">FL (Femur Length)</p>
                          <p className="text-lg font-bold text-gray-800 dark:text-white">{weekInfo.biometry.fl}</p>
                      </div>
                  )}
                  {weekInfo.biometry?.ac && (
                      <div className="bg-white dark:bg-indigo-900/50 p-3 rounded-xl border border-indigo-50 dark:border-indigo-900">
                          <p className="text-xs text-indigo-500 dark:text-indigo-400 uppercase font-bold">AC (Abdomen)</p>
                          <p className="text-lg font-bold text-gray-800 dark:text-white">{weekInfo.biometry.ac}</p>
                      </div>
                  )}
                  {weekInfo.biometry?.efw && (
                      <div className="bg-white dark:bg-indigo-900/50 p-3 rounded-xl border border-indigo-50 dark:border-indigo-900">
                          <p className="text-xs text-indigo-500 dark:text-indigo-400 uppercase font-bold">Est. Weight</p>
                          <p className="text-lg font-bold text-gray-800 dark:text-white">{weekInfo.biometry.efw}</p>
                      </div>
                  )}
                  {weekInfo.biometry?.crl && (
                      <div className="bg-white dark:bg-indigo-900/50 p-3 rounded-xl border border-indigo-50 dark:border-indigo-900">
                          <p className="text-xs text-indigo-500 dark:text-indigo-400 uppercase font-bold">CRL (Length)</p>
                          <p className="text-lg font-bold text-gray-800 dark:text-white">{weekInfo.biometry.crl}</p>
                      </div>
                  )}
                  {weekInfo.biometry?.gs && (
                      <div className="bg-white dark:bg-indigo-900/50 p-3 rounded-xl border border-indigo-50 dark:border-indigo-900">
                          <p className="text-xs text-indigo-500 dark:text-indigo-400 uppercase font-bold">Gestational Sac</p>
                          <p className="text-lg font-bold text-gray-800 dark:text-white">{weekInfo.biometry.gs}</p>
                      </div>
                  )}
              </div>
              <p className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-3 text-center">
                  *Reference ranges based on Hadlock/WHO standards. Actual measurements may vary.
              </p>
          </div>
      )}

      {/* Alerts Section - Scans, Vaccines, Labs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {relevantScans.length > 0 && (
             <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-3xl border border-orange-100 dark:border-orange-900/30 flex gap-4 items-center">
                <div className="bg-orange-100 dark:bg-orange-800/30 p-3 rounded-full text-orange-600 dark:text-orange-400 shrink-0">
                   <Bell className="w-6 h-6" />
                </div>
                <div className="flex-1">
                   <h3 className="font-bold text-orange-800 dark:text-orange-200 text-sm uppercase">Scan Due</h3>
                   <p className="text-orange-700 dark:text-orange-300 text-sm font-bold">
                      {relevantScans[0].name}
                   </p>
                   <p className="text-xs text-orange-600 dark:text-orange-400">Weeks {relevantScans[0].weekStart}-{relevantScans[0].weekEnd}</p>
                </div>
             </div>
          )}

          {relevantLabs.length > 0 && (
             <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-3xl border border-purple-100 dark:border-purple-900/30 flex gap-4 items-center">
                <div className="bg-purple-100 dark:bg-purple-800/30 p-3 rounded-full text-purple-600 dark:text-purple-400 shrink-0">
                   <FlaskConical className="w-6 h-6" />
                </div>
                <div className="flex-1">
                   <h3 className="font-bold text-purple-800 dark:text-purple-200 text-sm uppercase">Lab Test Recommended</h3>
                   <p className="text-purple-700 dark:text-purple-300 text-sm font-bold">
                      {relevantLabs[0].name}
                   </p>
                   {relevantLabs[0].condition && (
                       <span className="text-[10px] bg-purple-200 text-purple-800 px-1.5 py-0.5 rounded font-bold uppercase mt-1 inline-block">
                           {relevantLabs[0].condition.replace('_', ' ')}
                       </span>
                   )}
                </div>
             </div>
          )}
          
          {upcomingVaccines.length > 0 && (
             <div className="bg-teal-50 dark:bg-teal-900/10 p-4 rounded-3xl border border-teal-100 dark:border-teal-900/30 flex gap-4 items-center">
                <div className="bg-teal-100 dark:bg-teal-800/30 p-3 rounded-full text-teal-600 dark:text-teal-400 shrink-0">
                   <Syringe className="w-6 h-6" />
                </div>
                <div className="flex-1">
                   <h3 className="font-bold text-teal-800 dark:text-teal-200 text-sm uppercase">Vaccine Due</h3>
                   <p className="text-teal-700 dark:text-teal-300 text-sm font-bold">
                      {upcomingVaccines[0].name}
                   </p>
                   <p className="text-xs text-teal-600 dark:text-teal-400">Due: Week {upcomingVaccines[0].dueWeekStart}-{upcomingVaccines[0].dueWeekEnd}</p>
                </div>
             </div>
          )}
      </div>

      {/* Info Grid - Content updates based on selectedWeek */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Development */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-deep-card p-6 rounded-3xl shadow-lg border border-pink-100 dark:border-indigo-800" key={selectedWeek}>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                    <Info className="text-pink-600" /> 
                    Week {selectedWeek} Highlights
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    {weekInfo.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl border border-green-100 dark:border-green-800">
                        <h4 className="font-bold text-green-700 dark:text-green-400 mb-2">Do's</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                            {weekInfo.toDo.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl border border-red-100 dark:border-red-800">
                        <h4 className="font-bold text-red-700 dark:text-red-400 mb-2">Don'ts</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                            {weekInfo.notToDo.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                </div>
            </div>

            {/* AI Advisor - Context Aware */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 shadow-lg text-white">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                    <Sparkles size={20} /> Dr. Bloom (Indian Medical AI)
                </h3>
                <p className="text-sm opacity-80 mb-4">
                    Trained on FOGSI, WHO & IAP Standards. Ask about diet, symptoms, or scans.
                </p>
                
                <div className="flex gap-2 mb-4">
                    <input 
                        type="text" 
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="e.g. Is back pain normal this week?"
                        className="flex-1 px-4 py-2 rounded-xl text-gray-900 focus:outline-none"
                    />
                    <Button onClick={askAi} isLoading={loadingAi} className="bg-white text-indigo-700 hover:bg-gray-100">
                        Ask
                    </Button>
                </div>
                
                {missingKey && (
                    <div className="p-4 bg-red-100 dark:bg-red-900/50 rounded-xl text-sm border border-red-200 dark:border-red-800 flex items-center gap-3 animate-fade-in text-red-900 dark:text-white">
                        <Key size={20} />
                        <div>
                            <strong>AI Key Missing:</strong> Please go to your 
                            <span className="underline cursor-pointer font-bold ml-1" onClick={() => document.getElementById('tab-profile')?.click()}>Profile</span> 
                            to add your free Google Gemini API Key.
                        </div>
                    </div>
                )}

                {aiAnswer && (
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl text-sm leading-relaxed border border-white/20 animate-fade-in">
                        {aiAnswer}
                    </div>
                )}
            </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30">
                <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                    <Lightbulb size={18} /> Daily Tip ({selectedWeek === calculations.currentWeek ? `Day ${calculations.currentDay + 1}` : 'Week View'})
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-400 leading-relaxed">
                    {currentTip}
                </p>
                <div className="mt-2 flex gap-1">
                    {/* Visual Day Tracker */}
                    {[0,1,2,3,4,5,6].map(d => (
                        <div key={d} className={`h-1 flex-1 rounded-full ${d <= calculations.currentDay ? 'bg-blue-500' : 'bg-blue-200 dark:bg-blue-800'}`}></div>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-deep-card p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-indigo-800">
                <h4 className="font-bold text-gray-800 dark:text-white mb-4">Common Symptoms</h4>
                <div className="flex flex-wrap gap-2">
                    {weekInfo.symptoms.map((sym, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-xs font-bold">
                            {sym}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};