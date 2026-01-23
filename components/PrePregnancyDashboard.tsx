
import React, { useState, useEffect } from 'react';
import { UserSettings } from '../types';
import { PRE_CONCEPTION_CHECKLIST, PRE_CONCEPTION_COMORBIDITY_GUIDELINES, OBSTETRIC_HISTORY_RISKS, TIP_LIBRARY, DID_YOU_KNOW_DATA } from '../constants';
import { Button } from './Button';
import { Calendar, Droplet, Heart, CheckCircle2, Circle, AlertCircle, TrendingUp, Info, Plus, RotateCcw, X, Trash2, ChevronLeft, ChevronRight, Edit2, ShieldAlert, Check, Save, Star, Shield, Thermometer, TestTube2, Baby, ArrowRight, Gift, FileText, Activity, Sparkles, Lightbulb, BookOpen } from 'lucide-react';

interface Props {
  settings: UserSettings;
  onUpdateSettings: (s: UserSettings) => void;
}

export const PrePregnancyDashboard: React.FC<Props> = ({ settings, onUpdateSettings }) => {
  const [completedTasks, setCompletedTasks] = useState<string[]>(settings.preConceptionChecklist || []);
  const [cycleDay, setCycleDay] = useState(1);
  const [daysUntilPeriod, setDaysUntilPeriod] = useState(0);
  const [conceptionChance, setConceptionChance] = useState<string>('');
  
  // Modals
  const [showLogModal, setShowLogModal] = useState(false); // For "Add Past Date"
  const [showHistoryModal, setShowHistoryModal] = useState(false); // For "Manage History"
  const [showConfirmStart, setShowConfirmStart] = useState(false); // For "Log Period Start" (Today)
  const [showPregnancyModal, setShowPregnancyModal] = useState(false); // For Switching Mode
  
  const [newPastDate, setNewPastDate] = useState('');

  // Editing State
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  
  // Calendar State
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Daily Tip & Fact Logic
  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const dailyTip = TIP_LIBRARY.planning[dayOfYear % TIP_LIBRARY.planning.length];
  const didYouKnow = DID_YOU_KNOW_DATA.planning[dayOfYear % DID_YOU_KNOW_DATA.planning.length];

  // Helper: Parse YYYY-MM-DD to local midnight Date object
  const parseLocalYMD = (dateString: string) => {
      if (!dateString) return new Date();
      const [y, m, d] = dateString.split('-').map(Number);
      return new Date(y, m - 1, d);
  };

  // Helper: Format Date to YYYY-MM-DD local
  const formatLocalYMD = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
  };

  // Helper: Get Fertility Probability & Phase Info
  const getCyclePhaseInfo = (currentDay: number, cycleLen: number, isLog: boolean) => {
      const ovulationDay = cycleLen - 14;
      const fertileStart = ovulationDay - 5;
      const fertileEnd = ovulationDay + 2;
      const diff = ovulationDay - currentDay;

      // 1. Period Phase (Actual Log)
      if (isLog) {
          return {
              phase: 'Period_Log',
              label: 'Menstruation',
              subLabel: 'Cycle Restart',
              gradient: 'from-rose-600 to-red-700',
              shadow: 'shadow-rose-600/30',
              colorClass: 'bg-rose-600',
              textClass: 'text-white',
              icon: Droplet,
              chance: '<1%'
          };
      }

      // 2. Period Phase (Expected)
      if (currentDay >= 1 && currentDay <= 5) {
          return {
              phase: 'Period_Exp',
              label: 'Expected Period',
              subLabel: 'Predicted',
              gradient: 'from-rose-400 to-rose-500',
              shadow: 'shadow-rose-400/30',
              colorClass: 'bg-rose-300 dark:bg-rose-900/60', // Lighter/Distinct
              textClass: 'text-rose-900 dark:text-rose-100',
              icon: Droplet,
              chance: '<1%'
          };
      }

      // 3. Ovulation (Peak)
      if (currentDay === ovulationDay) {
          return {
              phase: 'Ovulation',
              label: 'Ovulation Day',
              subLabel: 'Egg Release',
              gradient: 'from-purple-600 to-fuchsia-600',
              shadow: 'shadow-purple-500/30',
              colorClass: 'bg-purple-600',
              textClass: 'text-white',
              icon: Star,
              chance: '33%'
          };
      }

      // 4. Fertile Window
      if (currentDay >= fertileStart && currentDay <= fertileEnd) {
          // High Fertility (1-2 days before O)
          if (diff === 1 || diff === 2) {
              return {
                  phase: 'High',
                  label: 'High Fertility',
                  subLabel: 'Best Time to Try',
                  gradient: 'from-emerald-500 to-green-600',
                  shadow: 'shadow-emerald-500/30',
                  colorClass: 'bg-emerald-500',
                  textClass: 'text-white',
                  icon: Heart,
                  chance: diff === 1 ? '31%' : '27%'
              };
          }
          // Medium/Start of Window
          return {
              phase: 'Fertile',
              label: 'Fertile Window',
              subLabel: 'Good Chance',
              gradient: 'from-teal-400 to-teal-600',
              shadow: 'shadow-teal-500/30',
              colorClass: 'bg-teal-500',
              textClass: 'text-white',
              icon: TrendingUp,
              chance: diff > 2 ? '15-17%' : '10%'
          };
      }

      // 5. Safe / Luteal
      return {
          phase: 'Safe',
          label: 'Luteal Phase',
          subLabel: 'Low Fertility',
          gradient: 'from-blue-500 to-indigo-600',
          shadow: 'shadow-blue-500/30',
          colorClass: 'bg-blue-100 dark:bg-blue-900/50',
          textClass: 'text-blue-900 dark:text-blue-100', 
          icon: Shield,
          chance: '<1%'
      };
  };

  // --- Cycle Calculations (Medical Standard: WHO / FOGSI) ---
  useEffect(() => {
    if (settings.lmp) {
      const lmpDate = parseLocalYMD(settings.lmp);
      const today = new Date();
      today.setHours(0,0,0,0);
      
      const diffTime = today.getTime() - lmpDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      // Let's use linear day for display and logic
      const linearCycleDay = diffDays + 1;
      setCycleDay(linearCycleDay);
      
      // Determine chance for today
      const todayLog = (settings.periodLog || []).includes(formatLocalYMD(today));
      // For phase coloring we wrap around cycle length
      const wrappedCycleDay = ((diffDays % settings.cycleLength) + settings.cycleLength) % settings.cycleLength + 1;
      
      const phase = getCyclePhaseInfo(wrappedCycleDay, settings.cycleLength, todayLog);
      setConceptionChance(phase.chance);
      
      setDaysUntilPeriod(settings.cycleLength - linearCycleDay + 1);
    }
  }, [settings.lmp, settings.cycleLength, settings.periodLog]);

  // --- CLINICAL CYCLE ANALYSIS ALGORITHM (FOGSI/FIGO Standards) ---
  const analyzeCycleHealth = () => {
      const logs = settings.periodLog || [];
      if (logs.length < 2) {
          return { status: 'Insufficient Data', color: 'gray', advice: 'Log at least 3 periods for an accurate clinical assessment.', causes: [] };
      }

      // 1. Calculate lengths between consecutive periods
      const sortedDates = [...logs].map(d => parseLocalYMD(d)).sort((a, b) => a.getTime() - b.getTime());
      const lengths = [];
      for (let i = 0; i < sortedDates.length - 1; i++) {
          const diff = Math.ceil((sortedDates[i+1].getTime() - sortedDates[i].getTime()) / (1000 * 60 * 60 * 24));
          lengths.push(diff);
      }

      // If only 1 length available, we can only judge length, not regularity
      const avgLength = Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);
      const minLength = Math.min(...lengths);
      const maxLength = Math.max(...lengths);
      const variation = maxLength - minLength;

      // --- CRITERIA 1: LENGTH (Normal 21-35 Days) ---
      if (avgLength < 21) {
          return {
              status: 'Polymenorrhea (Frequent Cycles)',
              color: 'red',
              advice: 'Your average cycle is shorter than 21 days. This may affect egg quality.',
              causes: ['Luteal Phase Defect', 'Anovulation', 'Stress', 'Perimenopause (if age > 35)']
          };
      }
      if (avgLength > 35) {
          return {
              status: 'Oligomenorrhea (Long Cycles)',
              color: 'red',
              advice: 'Your average cycle is longer than 35 days. This strongly suggests delayed ovulation.',
              causes: ['PCOS (Polycystic Ovarian Syndrome)', 'Thyroid Disorders', 'Hyperprolactinemia']
          };
      }

      // --- CRITERIA 2: REGULARITY (Variation < 7-9 days) ---
      // We need at least 3 logs (2 intervals) to judge regularity properly
      if (lengths.length >= 2) {
          if (variation >= 9) {
              return {
                  status: 'Irregular Cycles',
                  color: 'orange',
                  advice: `Your cycle varies by ${variation} days. This makes predicting ovulation difficult.`,
                  causes: ['Hormonal Imbalance', 'PCOS', 'Stress/Lifestyle', 'Thyroid issues']
              };
          }
      }

      return {
          status: 'Normal & Regular',
          color: 'green',
          advice: `Your cycle is consistent (${avgLength} days) and within the normal fertility range (21-35 days).`,
          causes: []
      };
  };

  const cycleAnalysis = analyzeCycleHealth();

  const toggleTask = (taskId: string) => {
      let updated;
      if (completedTasks.includes(taskId)) {
          updated = completedTasks.filter(id => id !== taskId);
      } else {
          updated = [...completedTasks, taskId];
      }
      setCompletedTasks(updated);
      onUpdateSettings({ ...settings, preConceptionChecklist: updated });
  };

  const handleLogPeriodToday = () => {
      const todayLocal = formatLocalYMD(new Date());
      const updatedLog = [todayLocal, ...(settings.periodLog || [])];
      const uniqueLog = [...new Set(updatedLog)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      
      onUpdateSettings({ 
          ...settings, 
          lmp: todayLocal, 
          periodLog: uniqueLog
      });
      setShowConfirmStart(false);
  };

  const toggleIntercourse = (dateStr: string) => {
      const currentLog = settings.intercourseLog || [];
      let updatedLog;
      if (currentLog.includes(dateStr)) {
          updatedLog = currentLog.filter(d => d !== dateStr);
      } else {
          updatedLog = [...currentLog, dateStr];
      }
      onUpdateSettings({ ...settings, intercourseLog: updatedLog });
  };

  const handleAddPastPeriod = () => {
      if(!newPastDate) return;
      const updatedLog = [newPastDate, ...(settings.periodLog || [])];
      const uniqueLog = [...new Set(updatedLog)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      
      let newLmp = settings.lmp;
      if (!newLmp || new Date(newPastDate) > new Date(newLmp)) {
          newLmp = newPastDate;
      }

      onUpdateSettings({
          ...settings,
          lmp: newLmp,
          periodLog: uniqueLog
      });
      setShowLogModal(false);
      setNewPastDate('');
  };

  const handleStartEdit = (date: string) => {
      setEditingDate(date);
      setEditValue(date);
  };

  const handleCancelEdit = () => {
      setEditingDate(null);
      setEditValue('');
  };

  const handleSaveEdit = () => {
      if (!editValue || !editingDate) return;
      const currentLog = settings.periodLog || [];
      let newLog = currentLog.filter(d => d !== editingDate && d !== editValue);
      newLog.push(editValue);
      newLog.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      const newLmp = newLog.length > 0 ? newLog[0] : null;
      onUpdateSettings({ ...settings, periodLog: newLog, lmp: newLmp });
      setEditingDate(null);
      setEditValue('');
  };

  const handleDeleteLog = (dateToDelete: string, e?: React.MouseEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      if (!window.confirm("Are you sure you want to delete this period entry?")) return;
      const currentLog = settings.periodLog || [];
      const updatedLog = currentLog.filter(d => d !== dateToDelete);
      let newLmp = settings.lmp;
      if (dateToDelete === settings.lmp || !updatedLog.includes(settings.lmp || '')) {
          const sorted = [...updatedLog].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
          newLmp = sorted.length > 0 ? sorted[0] : null;
      }
      onUpdateSettings({ ...settings, lmp: newLmp, periodLog: updatedLog });
  };

  const handleSwitchToPregnancy = () => {
      setShowPregnancyModal(true);
  };

  const confirmPregnancySwitch = () => {
      onUpdateSettings({
          ...settings,
          status: 'pregnant',
          isPostpartum: false,
          pregnancyLmp: settings.lmp
      });
      setShowPregnancyModal(false);
  };

  const calculatePredictedCycle = () => {
      const logs = settings.periodLog || [];
      if (logs.length < 2) return null;
      const sorted = [...logs].sort((a, b) => new Date(a).getTime() - new Date(b).getTime()); // Older first
      // Use logic above in analyzer, simplified here
      const recentLogs = sorted.slice(-7); 
      let totalDiff = 0;
      let count = 0;
      for(let i = 0; i < recentLogs.length - 1; i++) {
          const d1 = parseLocalYMD(recentLogs[i]);
          const d2 = parseLocalYMD(recentLogs[i+1]);
          const diffTime = Math.abs(d2.getTime() - d1.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if(diffDays > 15 && diffDays < 50) {
              totalDiff += diffDays;
              count++;
          }
      }
      if(count === 0) return null;
      return Math.round(totalDiff / count);
  };

  const predictedCycle = calculatePredictedCycle();

  const applyPredictedCycle = () => {
      if(predictedCycle) {
          onUpdateSettings({ ...settings, cycleLength: predictedCycle });
      }
  };

  const calculateBMI = () => {
      if(settings.prePregnancyWeight && settings.heightCm) {
          const hM = settings.heightCm / 100;
          return (settings.prePregnancyWeight / (hM * hM)).toFixed(1);
      }
      return null;
  };

  const bmi = calculateBMI();
  let bmiStatus = { label: 'Unknown', color: 'text-gray-500', advice: '' };
  if(bmi) {
      const val = parseFloat(bmi);
      if(val < 18.5) bmiStatus = { label: 'Underweight', color: 'text-yellow-600', advice: 'Aim to gain a little weight to support ovulation.' };
      else if(val < 25) bmiStatus = { label: 'Normal Weight', color: 'text-green-600', advice: 'Great! Maintain this for optimal fertility.' };
      else if(val < 30) bmiStatus = { label: 'Overweight', color: 'text-orange-600', advice: 'Losing 5-10% weight can significantly boost fertility (PCOS).' };
      else bmiStatus = { label: 'Obese', color: 'text-red-600', advice: 'Consult a doctor for a safe weight loss plan before conceiving.' };
  }

  // --- Two-Week Wait / Conception Analysis Logic ---
  const analyzeConceptionPotential = () => {
      if (!settings.lmp) return null;
      const lmpDate = parseLocalYMD(settings.lmp);
      const today = new Date();
      today.setHours(0,0,0,0);

      // Current cycle logic
      const diffTime = today.getTime() - lmpDate.getTime();
      const currentCycleDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // 1-based
      
      const ovulationDay = settings.cycleLength - 14;
      const fertileStart = ovulationDay - 5;
      const fertileEnd = ovulationDay + 2;

      // Only relevant if we are PAST ovulation (Luteal Phase)
      // Check 1 week post ovulation onwards
      if (currentCycleDays > ovulationDay + 7) {
          
          // Check if intercourse happened during fertile window of THIS cycle
          const logs = settings.intercourseLog || [];
          let hitFertileWindow = false;

          for (let d = fertileStart; d <= fertileEnd; d++) {
              const checkDate = new Date(lmpDate);
              checkDate.setDate(checkDate.getDate() + (d - 1)); // 0-based add
              const dateStr = formatLocalYMD(checkDate);
              if (logs.includes(dateStr)) {
                  hitFertileWindow = true;
                  break;
              }
          }

          if (hitFertileWindow) {
              const nextPeriodDate = new Date(lmpDate);
              nextPeriodDate.setDate(nextPeriodDate.getDate() + settings.cycleLength);
              const testDate = new Date(nextPeriodDate);
              testDate.setDate(testDate.getDate() + 1); // Test 1 day after missed period

              return {
                  status: 'potential',
                  testDate: testDate,
                  daysPostOvulation: currentCycleDays - ovulationDay
              };
          }
      }
      return null;
  };

  const conceptionStatus = analyzeConceptionPotential();
  const daysLate = cycleDay > settings.cycleLength ? cycleDay - settings.cycleLength : 0;

  // --- Calendar Logic ---
  const renderCalendar = () => {
      const year = calendarDate.getFullYear();
      const month = calendarDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startDayOfWeek = firstDay.getDay(); 

      const calendarDays = [];
      for (let i = 0; i < startDayOfWeek; i++) {
          calendarDays.push(<div key={`empty-${i}`} className="h-10 md:h-14"></div>);
      }

      const lmpDate = settings.lmp ? parseLocalYMD(settings.lmp) : null;
      const cycleLen = settings.cycleLength;

      for (let d = 1; d <= daysInMonth; d++) {
          const currentDayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          const currentDayDate = new Date(year, month, d);
          
          const isActualLog = (settings.periodLog || []).includes(currentDayStr);
          const isIntercourse = (settings.intercourseLog || []).includes(currentDayStr);
          
          let phaseInfo = null;

          if (lmpDate) {
              const diffTime = currentDayDate.getTime() - lmpDate.getTime();
              const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
              // Handle future/past cycles relative to LMP
              const rawCycleDay = ((diffDays % cycleLen) + cycleLen) % cycleLen;
              const cycleDayNum = rawCycleDay + 1;
              
              phaseInfo = getCyclePhaseInfo(cycleDayNum, cycleLen, isActualLog);
          }

          let bgClass = phaseInfo ? phaseInfo.colorClass : "bg-gray-50 dark:bg-white/5";
          let textClass = phaseInfo ? phaseInfo.textClass : "text-gray-700 dark:text-gray-300";
          let borderClass = "border-transparent";
          
          if (phaseInfo) {
              if (phaseInfo.phase === 'Period_Log') {
                  textClass = "text-white font-bold";
              }
          }

          if (isIntercourse) {
              borderClass = "border-pink-400";
          }

          calendarDays.push(
              <button 
                key={d} 
                onClick={() => toggleIntercourse(currentDayStr)}
                className={`h-12 md:h-16 rounded-lg flex flex-col items-center justify-center text-xs md:text-sm relative transition-all border ${borderClass} ${bgClass} ${currentDayStr === formatLocalYMD(new Date()) ? 'ring-2 ring-pink-500 z-10 shadow-lg' : 'hover:opacity-80'}`}
              >
                  <span className={textClass + " font-bold"}>{d}</span>
                  {isActualLog && <div className="w-1.5 h-1.5 bg-white rounded-full mt-1"></div>}
                  
                  {/* Phase Info */}
                  {phaseInfo && phaseInfo.chance !== '<1%' && !isActualLog && (
                      <span className={`text-[8px] md:text-[10px] uppercase font-bold mt-0.5 ${textClass}`}>
                          {phaseInfo.chance}
                      </span>
                  )}
                  
                  {/* Intercourse Marker */}
                  {isIntercourse && (
                      <Heart size={12} className="fill-pink-500 text-pink-500 absolute top-1 right-1 animate-pulse" />
                  )}
                  
                  {/* Ovulation Star */}
                  {phaseInfo?.phase === 'Ovulation' && !isIntercourse && (
                      <Star size={10} className="fill-yellow-400 text-yellow-400 absolute top-1 right-1" />
                  )}
              </button>
          );
      }

      return (
          <div className="space-y-4">
              <div className="flex items-center justify-between">
                  <h4 className="font-bold text-lg text-gray-800 dark:text-white">
                      {calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </h4>
                  <div className="flex gap-2">
                      <button onClick={() => setCalendarDate(new Date(calendarDate.setMonth(calendarDate.getMonth() - 1)))} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"><ChevronLeft size={20} /></button>
                      <button onClick={() => setCalendarDate(new Date())} className="text-xs font-bold text-pink-600 px-2">Today</button>
                      <button onClick={() => setCalendarDate(new Date(calendarDate.setMonth(calendarDate.getMonth() + 1)))} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"><ChevronRight size={20} /></button>
                  </div>
              </div>
              <div className="grid grid-cols-7 gap-1 md:gap-2 text-center">
                  {['S','M','T','W','T','F','S'].map((day, i) => (
                      <div key={i} className="text-xs font-bold text-gray-400 py-1">{day}</div>
                  ))}
                  {calendarDays}
              </div>
              
              {/* Enhanced Legend */}
              <div className="flex flex-wrap gap-3 text-xs justify-center pt-2 bg-gray-50 dark:bg-indigo-900/10 p-3 rounded-xl border border-gray-100 dark:border-indigo-900/30">
                  <div className="flex items-center gap-1"><div className="w-3 h-3 bg-rose-600 rounded"></div> Period (Log)</div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 bg-purple-600 rounded"></div> Ovulation</div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded"></div> High Fertility</div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 bg-teal-500 rounded"></div> Fertile</div>
                  <div className="flex items-center gap-1"><Heart size={10} className="fill-pink-500 text-pink-500"/> Activity</div>
              </div>
          </div>
      );
  };

  const wrappedCycleDay = ((cycleDay - 1) % settings.cycleLength) + 1; // Wrap for color logic
  const currentPhaseInfo = getCyclePhaseInfo(wrappedCycleDay, settings.cycleLength, (settings.periodLog || []).includes(formatLocalYMD(new Date())));
  const isTodayIntercourse = (settings.intercourseLog || []).includes(formatLocalYMD(new Date()));

  // --- High Risk History Check ---
  // Safely check history even if undefined initially
  const obs = settings.obstetricHistory;
  const hasHistoryRisk = (obs?.lastBabyCongenitalDefect || false) || 
                         (obs?.abortionsT1 || 0) >= 2 || 
                         (obs?.abortionsT2 || 0) >= 1;

  return (
    <div className="space-y-8 animate-fade-in pb-28 md:pb-10 w-full">
      
      {/* Modal for Period Start Confirmation */}
      {showConfirmStart && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-deep-card p-6 rounded-3xl shadow-2xl max-w-sm w-full border border-pink-200 dark:border-pink-900">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Log Period Start?</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                      This will mark <strong>Today</strong> as the start of your new cycle. Any conception alerts for the previous cycle will be cleared.
                  </p>
                  <div className="flex flex-col gap-3">
                      <Button onClick={handleLogPeriodToday} className="w-full py-3 justify-center text-lg bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/30">
                          Yes, Period Started
                      </Button>
                      <Button onClick={() => setShowConfirmStart(false)} variant="secondary" className="w-full py-3 justify-center">
                          Cancel
                      </Button>
                  </div>
              </div>
          </div>
      )}

      {/* Modal for Pregnancy Confirmation */}
      {showPregnancyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-deep-card p-6 rounded-3xl shadow-2xl max-w-sm w-full border border-pink-200 dark:border-pink-900">
                  <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2 text-pink-600">
                          <Baby size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Congratulations!</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                          Switching to Pregnancy Mode will unlock weekly baby growth tracking and trimester-specific guides.
                      </p>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                      <Button onClick={confirmPregnancySwitch} className="w-full py-3 justify-center text-lg bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg">
                          Start Pregnancy Journey
                      </Button>
                      <Button onClick={() => setShowPregnancyModal(false)} variant="secondary" className="w-full py-3 justify-center">
                          Not yet
                      </Button>
                  </div>
              </div>
          </div>
      )}

      {/* 2WW / Conception Potential Alert (RENDER FIRST) */}
      {conceptionStatus && (
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl mb-8">
              <div className="flex flex-col md:flex-row items-start gap-4">
                  <div className="p-3 bg-white/20 rounded-full shrink-0">
                      <Sparkles size={32} />
                  </div>
                  <div className="flex-1">
                      <h3 className="text-xl font-bold">Two-Week Wait: Conception Potential Detected</h3>
                      <p className="opacity-90 text-sm mt-1">
                          We detected activity during your fertile window. You are currently in the <strong>Luteal Phase</strong> (DPO {conceptionStatus.daysPostOvulation}).
                      </p>
                      
                      <div className="bg-white/10 rounded-xl p-4 mt-3 text-xs space-y-2 border border-white/20">
                          <p className="font-bold uppercase opacity-80 flex items-center gap-2"><Shield size={12}/> Implantation Care Guidelines (FOGSI India):</p>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 opacity-90">
                              <li className="flex items-start gap-2">
                                  <CheckCircle2 size={14} className="mt-0.5 text-green-300"/> 
                                  <span><strong>Diet:</strong> Eat warm, home-cooked meals. Avoid raw papaya, pineapple, and excessive caffeine.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                  <CheckCircle2 size={14} className="mt-0.5 text-green-300"/> 
                                  <span><strong>Meds:</strong> STOP painkillers like Ibuprofen/Combiflam (affects implantation). Paracetamol is safe.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                  <CheckCircle2 size={14} className="mt-0.5 text-green-300"/> 
                                  <span><strong>Supplements:</strong> Ensure you are taking Folic Acid (5mg/400mcg) daily.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                  <CheckCircle2 size={14} className="mt-0.5 text-green-300"/> 
                                  <span><strong>Lifestyle:</strong> Avoid high-impact cardio or heavy lifting. Walking/Yoga is safe.</span>
                              </li>
                          </ul>
                      </div>

                      {/* NEW: Testing Guidelines Section */}
                      <div className="bg-black/20 rounded-xl p-4 mt-3 text-xs space-y-3 border border-white/10">
                           <p className="font-bold uppercase opacity-90 flex items-center gap-2 text-yellow-300">
                              <TestTube2 size={14}/> Confirmation & Viability Testing (Indian Standards):
                           </p>
                           <div className="grid md:grid-cols-2 gap-3 opacity-90">
                              <div>
                                  <strong className="text-white block mb-1">1. Home UPT (Urine Test):</strong>
                                  Test with <u>First Morning Urine</u> for accuracy. A faint line is considered positive. (e.g. Prega News/i-can).
                              </div>
                              <div>
                                  <strong className="text-white block mb-1">2. Serum Beta hCG (Blood Test):</strong>
                                  The Gold Standard. Can detect pregnancy as early as 8-10 days post ovulation.
                              </div>
                              <div className="md:col-span-2 bg-white/5 p-2 rounded mt-1">
                                  <strong className="text-white">3. Viability Check (Doubling Test):</strong> <br/>
                                  To confirm healthy growth, repeat Beta hCG after 48 hours. In a viable pregnancy, the value should approximately <u>double (increase by &gt;66%)</u>.
                              </div>
                           </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-2 text-sm font-bold bg-white/20 px-4 py-2 rounded-xl">
                              <TestTube2 size={18} />
                              Recommended Test Date: {conceptionStatus.testDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                          </div>
                          <span className="text-xs opacity-75 italic">Wait for missed period to avoid false negatives.</span>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Missed Period Alert & Mode Switcher (RENDER BELOW CONCEPTION) */}
      {daysLate > 0 && (
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl p-6 text-white shadow-xl">
              <div className="flex flex-col md:flex-row items-start gap-4">
                  <div className="p-3 bg-white/20 rounded-full shrink-0">
                      <Baby size={32} />
                  </div>
                  <div className="flex-1">
                      <h3 className="text-xl font-bold">Period Late by {daysLate} Days?</h3>
                      <p className="opacity-90 text-sm mt-1">
                          If your home pregnancy test is positive, congratulations! You can switch modes now to start tracking your baby's journey.
                      </p>
                      
                      <div className="bg-white/10 rounded-xl p-4 mt-3 text-xs space-y-2 border border-white/20">
                          <p className="font-bold uppercase opacity-80 flex items-center gap-2"><Gift size={12}/> Pregnancy Mode Benefits:</p>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 opacity-90">
                              <li className="flex items-center gap-1"><CheckCircle2 size={10}/> Weekly Baby Growth (Size & Weight)</li>
                              <li className="flex items-center gap-1"><CheckCircle2 size={10}/> Trimester-Specific Diet Plans</li>
                              <li className="flex items-center gap-1"><CheckCircle2 size={10}/> Medical Scan & Vaccine Schedule</li>
                              <li className="flex items-center gap-1"><CheckCircle2 size={10}/> Contraction Timer & Kick Counter</li>
                          </ul>
                      </div>

                      <button 
                          onClick={handleSwitchToPregnancy}
                          className="mt-4 w-full py-3 bg-white text-pink-600 font-bold rounded-xl shadow-lg hover:bg-pink-50 transition-colors flex items-center justify-center gap-2"
                      >
                          <CheckCircle2 size={18} /> Yes, I'm Pregnant! Switch Mode
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Hero: Cycle Status */}
      <div className={`rounded-3xl p-8 text-white shadow-xl relative overflow-hidden transition-all duration-500 bg-gradient-to-br ${currentPhaseInfo.gradient} ${currentPhaseInfo.shadow}`}>
         <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2 opacity-90">
                    <Calendar size={20} />
                    <span className="text-sm font-bold uppercase tracking-wider">Cycle Day {cycleDay}</span>
                </div>
                <h2 className="text-4xl font-bold mb-2">
                    {daysLate > 0 ? "Period Missed" : currentPhaseInfo.label}
                </h2>
                <p className="text-lg opacity-90">
                    {daysLate > 0 
                        ? `${daysLate} days past expected date.`
                        : currentPhaseInfo.phase === 'Safe' 
                            ? `Next period in approx ${daysUntilPeriod} days.`
                            : `Conception Chance: ${currentPhaseInfo.chance}`
                    }
                </p>
                
                {currentPhaseInfo.phase !== 'Safe' && !currentPhaseInfo.phase.startsWith('Period') && daysLate <= 0 && (
                    <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                        <currentPhaseInfo.icon size={16} fill="white" className="animate-pulse" />
                        <span className="font-bold text-sm">
                            {currentPhaseInfo.subLabel}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
                <button 
                    onClick={() => toggleIntercourse(formatLocalYMD(new Date()))}
                    className={`group relative px-8 py-3 font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 overflow-hidden ${isTodayIntercourse ? 'bg-pink-100 text-pink-700' : 'bg-white text-gray-800'}`}
                >
                    <Heart size={20} className={isTodayIntercourse ? "fill-pink-600 text-pink-600" : "text-gray-400"} />
                    <span className="relative z-10">{isTodayIntercourse ? 'Activity Logged' : 'Log Activity'}</span>
                </button>
                <button 
                    onClick={() => setShowConfirmStart(true)}
                    className="px-8 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold rounded-2xl border border-white/30 transition-all flex items-center justify-center gap-2"
                >
                    <Droplet size={20} fill="currentColor" /> Period Started
                </button>
            </div>
         </div>
      </div>

      {/* Calendar View - PRIORITIZED */}
      <div className="bg-white dark:bg-deep-card rounded-3xl shadow-lg border border-gray-100 dark:border-indigo-800 p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-pink-600" /> Cycle Calendar
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 -mt-2">Tap a date to log activity/intercourse</p>
          {renderCalendar()}
      </div>

      {/* Period History & Prediction */}
      <div className="bg-white dark:bg-deep-card rounded-3xl shadow-lg border border-gray-100 dark:border-indigo-800 p-6">
          <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <Calendar size={20} /> Period History
              </h3>
              <div className="flex gap-2">
                  <button onClick={() => setShowHistoryModal(true)} className="text-sm text-gray-500 font-bold flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors">
                      <Edit2 size={14} /> Manage
                  </button>
                  <button onClick={() => setShowLogModal(!showLogModal)} className="text-sm text-teal-600 font-bold flex items-center gap-1 hover:bg-teal-50 px-3 py-1.5 rounded-lg transition-colors">
                      <Plus size={16} /> Add Date
                  </button>
              </div>
          </div>

          {/* Add Past Date Logic */}
          {showLogModal && (
              <div className="mb-4 p-4 bg-gray-50 dark:bg-indigo-900/20 rounded-xl flex gap-2 items-center animate-fade-in">
                  <input 
                    type="date" 
                    value={newPastDate} 
                    onChange={(e) => setNewPastDate(e.target.value)} 
                    max={new Date().toISOString().split('T')[0]}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-indigo-700 dark:bg-deep-bg dark:text-white"
                  />
                  <Button onClick={handleAddPastPeriod} disabled={!newPastDate} className="text-sm">Add</Button>
              </div>
          )}

          {/* Manage History Modal with Edit Capability */}
          {showHistoryModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                  <div className="bg-white dark:bg-deep-card rounded-3xl p-6 shadow-2xl max-w-sm w-full border border-gray-200 dark:border-indigo-800 flex flex-col max-h-[80vh]">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Edit History</h3>
                          <button onClick={() => setShowHistoryModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={24} /></button>
                      </div>
                      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 mb-4">
                          {settings.periodLog && settings.periodLog.length > 0 ? (
                              settings.periodLog.map((date, i) => (
                                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-indigo-900/10 rounded-xl border border-gray-100 dark:border-indigo-900/30">
                                      {editingDate === date ? (
                                          <div className="flex items-center gap-2 w-full">
                                              <input 
                                                type="date" 
                                                value={editValue} 
                                                onChange={(e) => setEditValue(e.target.value)}
                                                max={new Date().toISOString().split('T')[0]}
                                                className="flex-1 px-2 py-1 rounded border border-gray-300 dark:border-indigo-600 dark:bg-deep-bg dark:text-white text-sm"
                                              />
                                              <button onClick={handleSaveEdit} className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded">
                                                  <Check size={18} />
                                              </button>
                                              <button onClick={handleCancelEdit} className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-indigo-900/30 rounded">
                                                  <X size={18} />
                                              </button>
                                          </div>
                                      ) : (
                                          <>
                                            <div className="text-gray-800 dark:text-white font-medium">
                                                {parseLocalYMD(date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button 
                                                    onClick={() => handleStartEdit(date)}
                                                    className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                                                    title="Edit Date"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    onClick={(e) => handleDeleteLog(date, e)} 
                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                                    title="Delete Date"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                          </>
                                      )}
                                  </div>
                              ))
                          ) : (
                              <p className="text-center text-gray-400 py-4">No history to edit.</p>
                          )}
                      </div>
                      <Button variant="secondary" onClick={() => setShowHistoryModal(false)}>Close</Button>
                  </div>
              </div>
          )}

          {predictedCycle && predictedCycle !== settings.cycleLength && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 flex items-center justify-between">
                  <div className="text-sm text-blue-800 dark:text-blue-300">
                      <strong>AI Insight:</strong> Based on your last 6 months, your average cycle is {predictedCycle} days.
                  </div>
                  <button onClick={applyPredictedCycle} className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-blue-200 transition-colors">
                      <RotateCcw size={12} /> Apply
                  </button>
              </div>
          )}

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {settings.periodLog && settings.periodLog.length > 0 ? (
                  settings.periodLog.slice(0, 6).map((date, i) => {
                      const d = parseLocalYMD(date);
                      return (
                        <div key={i} className="flex-shrink-0 w-20 p-3 bg-gray-50 dark:bg-indigo-900/10 rounded-xl border border-gray-100 dark:border-indigo-900/30 text-center flex flex-col justify-center">
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">{d.toLocaleString('default', { month: 'short' })}</div>
                            <div className="text-xl font-bold text-gray-800 dark:text-white">{d.getDate()}</div>
                        </div>
                      );
                  })
              ) : (
                  <p className="text-sm text-gray-400 w-full text-center py-4">No history yet. Log your first period!</p>
              )}
          </div>
      </div>

      {/* --- CLINICAL CYCLE ANALYSIS CARD --- */}
      <div className="bg-white dark:bg-deep-card rounded-3xl shadow-lg border border-gray-100 dark:border-indigo-800 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-indigo-800 bg-gray-50 dark:bg-indigo-900/30">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <Activity className="text-purple-600" /> Cycle Health Analysis
              </h3>
              <p className="text-xs font-bold bg-purple-100 text-purple-700 px-3 py-1 rounded-full inline-block mt-2">
                  Verified against Indian (FOGSI) & WHO Guidelines
              </p>
          </div>
          <div className="p-6">
              <div className={`p-4 rounded-xl border flex flex-col md:flex-row gap-4 items-start ${
                  cycleAnalysis.color === 'red' ? 'bg-red-50 border-red-200 text-red-800' :
                  cycleAnalysis.color === 'orange' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                  cycleAnalysis.color === 'green' ? 'bg-green-50 border-green-200 text-green-800' :
                  'bg-gray-50 border-gray-200 text-gray-800'
              }`}>
                  <div className={`p-2 rounded-full shrink-0 ${
                      cycleAnalysis.color === 'red' ? 'bg-red-200' : 
                      cycleAnalysis.color === 'orange' ? 'bg-yellow-200' : 
                      cycleAnalysis.color === 'green' ? 'bg-green-200' : 'bg-gray-200'
                  }`}>
                      <Info size={24} />
                  </div>
                  <div className="flex-1">
                      <h4 className="font-bold text-lg mb-1">{cycleAnalysis.status}</h4>
                      <p className="text-sm leading-relaxed mb-3">{cycleAnalysis.advice}</p>
                      
                      {cycleAnalysis.causes.length > 0 && (
                          <div className="bg-white/50 dark:bg-black/10 rounded-lg p-3">
                              <p className="text-xs font-bold uppercase tracking-wide mb-1 opacity-80">Probable Causes (Consult Doctor):</p>
                              <ul className="text-sm list-disc list-inside">
                                  {cycleAnalysis.causes.map((c, i) => <li key={i}>{c}</li>)}
                              </ul>
                          </div>
                      )}
                      <p className="text-xs font-bold text-red-600 dark:text-red-400 mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                          Disclaimer: This is an algorithmic analysis. If your cycle is consistently irregular, short (&lt;21 days), or long (&gt;35 days), please consult a gynecologist for proper diagnosis.
                      </p>
                  </div>
              </div>
          </div>
      </div>

      {/* --- COMORBIDITY & RISK ALERT SECTION --- */}
      {(settings.comorbidities.length > 0 || hasHistoryRisk) && (
          <div className="bg-white dark:bg-deep-card rounded-3xl shadow-lg border border-red-100 dark:border-red-900/50 overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-pink-600 p-4 text-white">
                  <h3 className="font-bold flex items-center gap-2">
                      <ShieldAlert /> Condition-Specific Action Plan
                  </h3>
                  <p className="text-xs opacity-90 mt-1">Medical Requirements Before Conception (FOGSI)</p>
              </div>
              <div className="p-4 space-y-4">
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
                      <p className="text-xs font-bold text-red-700 dark:text-red-300 flex items-center gap-2">
                          <AlertCircle size={14} /> IMPORTANT DISCLAIMER:
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                          The following are general guidelines based on medical standards. Your specific condition may require a different approach. <span className="underline">Always consult your doctor</span> before making changes to medication or treatment plans.
                      </p>
                  </div>

                  {/* HISTORY BASED RISK ALERTS */}
                  {settings.obstetricHistory?.lastBabyCongenitalDefect && (
                      <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30">
                          <h4 className="font-bold text-orange-700 dark:text-orange-300 text-sm uppercase mb-2">History of Congenital Defect</h4>
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                              <p className="font-bold mb-1">⚡ Critical Action:</p>
                              <p className="leading-snug">{OBSTETRIC_HISTORY_RISKS.prev_anomaly.action}</p>
                          </div>
                      </div>
                  )}

                  {/* COMORBIDITY ALERTS */}
                  {settings.comorbidities.map(cId => {
                      const guide = PRE_CONCEPTION_COMORBIDITY_GUIDELINES[cId];
                      if (!guide) return null;
                      return (
                          <div key={cId} className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                              <h4 className="font-bold text-red-700 dark:text-red-300 text-sm uppercase mb-2">{guide.title}</h4>
                              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                                  <div>
                                      <p className="font-bold text-gray-900 dark:text-white mb-1">🎯 Target Value:</p>
                                      <p className="bg-white dark:bg-black/20 px-2 py-1 rounded inline-block font-mono text-red-600 dark:text-red-400 font-bold">{guide.target}</p>
                                      <p className="font-bold text-gray-900 dark:text-white mt-2 mb-1">🧪 Tests Needed:</p>
                                      <ul className="list-disc list-inside text-xs">
                                          {guide.tests.map(t => <li key={t}>{t}</li>)}
                                      </ul>
                                  </div>
                                  <div>
                                      <p className="font-bold text-gray-900 dark:text-white mb-1">⚡ Action Required:</p>
                                      <p className="leading-snug mb-2">{guide.action}</p>
                                      <p className="text-xs text-red-600 dark:text-red-400 italic">Risk: {guide.risk}</p>
                                  </div>
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>
      )}

      {/* Grid: Health & Prep */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Pre-Conception Checklist */}
          <div className="bg-white dark:bg-deep-card rounded-3xl shadow-lg border border-gray-100 dark:border-indigo-800 overflow-hidden">
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-6 border-b border-indigo-100 dark:border-indigo-800">
                  <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                      <CheckCircle2 /> "Body Ready" Audit
                  </h3>
                  <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
                      Essential steps before conceiving (Indian/WHO Standards).
                  </p>
              </div>
              <div className="p-4 space-y-1">
                  {PRE_CONCEPTION_CHECKLIST.map((task) => {
                      const isDone = completedTasks.includes(task.id);
                      return (
                          <div 
                            key={task.id} 
                            onClick={() => toggleTask(task.id)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${isDone ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30' : 'hover:bg-gray-50 dark:hover:bg-indigo-900/20 border-transparent'}`}
                          >
                              <div className={`mt-1 shrink-0 ${isDone ? 'text-green-600' : 'text-gray-300'}`}>
                                  {isDone ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                              </div>
                              <div>
                                  <h4 className={`font-bold ${isDone ? 'text-green-800 dark:text-green-300' : 'text-gray-800 dark:text-white'}`}>
                                      {task.label}
                                  </h4>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                      {task.description}
                                  </p>
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>

          <div className="space-y-6">
              {/* Daily Tip (Planning) */}
              <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30">
                   <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                       <Lightbulb size={20} /> Daily Insight (Planning)
                   </h4>
                   <p className="text-sm text-blue-700 dark:text-blue-400 leading-relaxed">
                       {dailyTip}
                   </p>
              </div>

              {/* Did You Know */}
              <div className="bg-teal-50 dark:bg-teal-900/10 p-6 rounded-3xl border border-teal-100 dark:border-teal-900/30">
                   <h4 className="font-bold text-teal-800 dark:text-teal-300 mb-2 flex items-center gap-2">
                       <BookOpen size={20} /> Did You Know?
                   </h4>
                   <p className="text-sm font-bold text-teal-700 dark:text-teal-400 mb-1">
                       {didYouKnow.title}
                   </p>
                   <p className="text-xs text-teal-600 dark:text-teal-500 leading-relaxed">
                       {didYouKnow.text}
                   </p>
              </div>

              {/* BMI Card */}
              <div className="bg-white dark:bg-deep-card p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-indigo-800">
                  <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                      <TrendingUp size={20} className="text-pink-600" /> Fertility & BMI
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl font-bold text-gray-800 dark:text-white">
                          {bmi || '--'}
                      </div>
                      <div>
                          <div className={`text-sm font-bold uppercase tracking-wider ${bmiStatus.color}`}>
                              {bmiStatus.label}
                          </div>
                          <div className="text-xs text-gray-400">Current BMI</div>
                      </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-indigo-900/20 p-3 rounded-xl border border-gray-100 dark:border-indigo-800/50">
                      <Info size={14} className="inline mr-1 mb-0.5" />
                      {bmi ? bmiStatus.advice : "Update weight/height in Profile to see analysis."}
                  </p>
              </div>
          </div>
      </div>
    </div>
  );
};
