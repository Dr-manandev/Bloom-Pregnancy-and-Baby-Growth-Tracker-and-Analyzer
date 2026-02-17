
import React, { useState, useEffect } from 'react';
import { UserSettings, DietType, AppMode, ProfileMeta } from '../types';
import { Button } from './Button';
import { RefreshCw, User, Calendar, Activity, Utensils, Baby, Ruler, Weight, ArrowRightLeft, HeartPulse, Droplet, AlertTriangle, CheckCircle2, FlaskConical, Stethoscope, Info, X, Users, Plus, ChevronRight, FileText, Clock, Sparkles, Key, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { COMORBIDITY_GUIDELINES, BLOOD_GROUPS } from '../constants';

interface Props {
  settings: UserSettings;
  profiles?: ProfileMeta[]; // New prop for listing profiles
  onUpdate: (settings: UserSettings) => void;
  onReset: () => void;
  onAddProfile?: () => void;
  onSwitchProfile?: (id: string) => void;
}

export const Profile: React.FC<Props> = ({ settings, profiles = [], onUpdate, onReset, onAddProfile, onSwitchProfile }) => {
  const [formData, setFormData] = useState<UserSettings>(settings);
  const [saved, setSaved] = useState(false);
  
  // Modals
  const [showBabyModal, setShowBabyModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  // API Key State
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [keySaved, setKeySaved] = useState(false);
  
  const [babyForm, setBabyForm] = useState<{name: string, date: string, gender: 'boy' | 'girl'}>({ name: '', date: '', gender: 'boy' });

  useEffect(() => {
    // Ensure new fields are initialized
    setFormData({
      ...settings,
      comorbidities: settings.comorbidities || [],
      dietaryPreference: settings.dietaryPreference || 'vegetarian',
      lactoseIntolerant: settings.lactoseIntolerant || false,
      vaccinationsDone: settings.vaccinationsDone || [],
      maternalBloodGroup: settings.maternalBloodGroup || '',
      paternalBloodGroup: settings.paternalBloodGroup || '',
      age: settings.age || undefined,
      paternalHeightCm: settings.paternalHeightCm || undefined,
      status: settings.status || (settings.isPostpartum ? 'postpartum' : 'pregnant'),
      periodLog: settings.periodLog || [],
      pregnancyLmp: settings.pregnancyLmp || null,
      obstetricHistory: settings.obstetricHistory || {
          gravida: 1,
          para: 0,
          abortions: 0,
          abortionsT1: 0,
          abortionsT2: 0,
          living: 0,
          lastBabyCongenitalDefect: false,
          lastBabyDefectDetails: ''
      }
    });

    // Load API Key
    const storedKey = localStorage.getItem('bloom_user_api_key');
    if (storedKey) setApiKey(storedKey);
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Logic to save specific LMPs based on current mode
    let updatedSettings = { ...formData };
    
    if (formData.status === 'pregnant') {
        updatedSettings.pregnancyLmp = formData.lmp;
    } else if (formData.status === 'planning') {
        // If LMP changed, ensure it's in the log
        if (formData.lmp && !updatedSettings.periodLog.includes(formData.lmp)) {
            updatedSettings.periodLog = [...updatedSettings.periodLog, formData.lmp].sort().reverse();
        }
    }

    onUpdate(updatedSettings);
    
    // Save API Key independently to localStorage (security best practice: don't store in global state context if possible)
    if (apiKey) {
        localStorage.setItem('bloom_user_api_key', apiKey);
    } else {
        localStorage.removeItem('bloom_user_api_key');
    }

    setSaved(true);
    setKeySaved(true);
    setTimeout(() => {
        setSaved(false);
        setKeySaved(false);
    }, 2000);
  };

  const toggleComorbidity = (id: string) => {
    const current = formData.comorbidities || [];
    if (current.includes(id)) {
      setFormData({ ...formData, comorbidities: current.filter(c => c !== id) });
    } else {
      setFormData({ ...formData, comorbidities: [...current, id] });
    }
  };

  // Switch to Postpartum (Baby Born)
  const enablePostpartumMode = () => {
    if(babyForm.name && babyForm.date) {
        onUpdate({
            ...formData,
            status: 'postpartum',
            isPostpartum: true, // legacy sync
            babyName: babyForm.name,
            babyGender: babyForm.gender,
            birthDate: babyForm.date
        });
        setShowBabyModal(false);
    }
  };

  const handleModeChange = (newMode: AppMode) => {
      if (newMode === 'postpartum') {
          setShowBabyModal(true);
          return;
      }

      let newLmp = formData.lmp;

      if (newMode === 'pregnant') {
          // If switching TO pregnant, prefer the saved pregnancy LMP, 
          // otherwise assume the last logged period was the conception period.
          if (formData.pregnancyLmp) {
              newLmp = formData.pregnancyLmp;
          } else if (formData.periodLog && formData.periodLog.length > 0) {
              // Sort descending to get latest
              const sorted = [...formData.periodLog].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
              newLmp = sorted[0];
          }
      } else if (newMode === 'planning') {
          // If switching TO planning, show the latest period log
          if (formData.periodLog && formData.periodLog.length > 0) {
              const sorted = [...formData.periodLog].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
              newLmp = sorted[0];
          }
      }

      onUpdate({
          ...formData,
          status: newMode,
          isPostpartum: false,
          lmp: newLmp
      });
  };

  // --- Blood Group Logic ---
  const calculateBloodGroupData = () => {
      const mom = formData.maternalBloodGroup;
      const dad = formData.paternalBloodGroup;
      if (!mom || !dad) return null;

      const momType = mom.slice(0, -1);
      const momRh = mom.slice(-1);
      const dadType = dad.slice(0, -1);
      const dadRh = dad.slice(-1);

      // 1. Prediction Logic (Simplified)
      let possibleABO: string[] = [];
      const getAlleles = (type: string) => {
          if (type === 'A') return ['A', 'O']; 
          if (type === 'B') return ['B', 'O'];
          if (type === 'AB') return ['A', 'B'];
          return ['O', 'O'];
      };

      const momAlleles = getAlleles(momType);
      const dadAlleles = getAlleles(dadType);

      const combinations = new Set<string>();
      momAlleles.forEach(m => {
          dadAlleles.forEach(d => {
              let geno = [m, d].sort().join('');
              if (geno === 'AA' || geno === 'AO') combinations.add('A');
              else if (geno === 'BB' || geno === 'BO') combinations.add('B');
              else if (geno === 'AB') combinations.add('AB');
              else if (geno === 'OO') combinations.add('O');
          });
      });
      possibleABO = Array.from(combinations).sort();

      let possibleRh = [];
      if (momRh === '-' && dadRh === '-') {
          possibleRh = ['-'];
      } else {
          possibleRh = ['+', '-'];
      }

      const possibleGroups: string[] = [];
      possibleABO.forEach(abo => {
          possibleRh.forEach(rh => {
              possibleGroups.push(abo + rh);
          });
      });

      // 2. Compatibility Logic
      const isMomRhNeg = momRh === '-';
      const isDadRhPos = dadRh === '+';
      const isAboRisk = momType === 'O' && (dadType === 'A' || dadType === 'B' || dadType === 'AB');

      let risk = { type: 'safe', severity: 'low', title: 'Compatible', message: 'No major incompatibility risks detected.' };

      if (isMomRhNeg && isDadRhPos) {
          risk = {
              type: 'rh_risk',
              severity: 'high',
              title: 'Rh Incompatibility Risk',
              message: "Mom is Rh(-) and Dad is Rh(+). If baby is Rh(+), Anti-D injection (RhoGAM) may be needed."
          };
      } else if (isAboRisk) {
          risk = {
              type: 'abo_risk',
              severity: 'medium',
              title: 'ABO Incompatibility Risk',
              message: "Mom is Type O and Dad is non-O. Baby may have mild jaundice after birth."
          };
      }

      return { possibilities: possibleGroups, risk };
  };

  const bloodData = calculateBloodGroupData();

  // --- Baby Height Prediction ---
  const predictHeight = () => {
      if (formData.heightCm && formData.paternalHeightCm) {
          const m = formData.heightCm;
          const f = formData.paternalHeightCm;
          const boyTarget = (m + f + 13) / 2;
          const girlTarget = (m + f - 13) / 2;
          return { boy: boyTarget.toFixed(1), girl: girlTarget.toFixed(1) };
      }
      return null;
  };
  const predictedHeight = predictHeight();

  const getThemeColor = () => {
      if (settings.status === 'planning') return 'from-teal-500 to-emerald-600';
      if (settings.status === 'postpartum') {
          return settings.babyGender === 'boy' ? 'from-blue-600 to-cyan-600' : 'from-rose-400 to-pink-500';
      }
      return 'from-pink-600 to-purple-600'; 
  };

  const calculateAge = (birthDateString: string) => {
      const birth = new Date(birthDateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - birth.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 30) return `${diffDays} days old`;
      const months = Math.floor(diffDays / 30.4);
      if (months < 12) return `${months} months old`;
      const years = Math.floor(months / 12);
      const remMonths = months % 12;
      return `${years}y ${remMonths}m old`;
  };

  const updateObstetric = (field: string, value: any) => {
      setFormData({
          ...formData,
          obstetricHistory: {
              ...formData.obstetricHistory,
              [field]: value
          }
      });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-10">
      
      {/* Mode Switcher Block */}
      <div className={`rounded-3xl p-6 text-white shadow-lg bg-gradient-to-r ${getThemeColor()}`}>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div>
                  <h3 className="text-lg font-bold flex items-center gap-2 opacity-90 text-sm uppercase tracking-wider mb-2">
                       Current Stage
                  </h3>
                  <p className="text-2xl font-bold leading-tight">
                    {settings.status === 'planning' ? 'Planning Pregnancy' : settings.status === 'postpartum' ? 'Postpartum' : 'Pregnant'}
                  </p>
              </div>
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  <button 
                    onClick={() => handleModeChange('planning')}
                    className={`flex-1 md:flex-none px-4 py-2 rounded-full text-sm font-bold transition-all border whitespace-nowrap ${settings.status === 'planning' ? 'bg-white text-teal-700 border-white shadow-md' : 'bg-black/10 text-white border-white/20 hover:bg-white/10'}`}
                  >
                      Planning
                  </button>
                  <button 
                    onClick={() => handleModeChange('pregnant')}
                    className={`flex-1 md:flex-none px-4 py-2 rounded-full text-sm font-bold transition-all border whitespace-nowrap ${settings.status === 'pregnant' ? 'bg-white text-pink-700 border-white shadow-md' : 'bg-black/10 text-white border-white/20 hover:bg-white/10'}`}
                  >
                      Pregnant
                  </button>
                  <button 
                    onClick={() => handleModeChange('postpartum')}
                    className={`flex-1 md:flex-none px-4 py-2 rounded-full text-sm font-bold transition-all border whitespace-nowrap ${settings.status === 'postpartum' ? 'bg-white text-blue-700 border-white shadow-md' : 'bg-black/10 text-white border-white/20 hover:bg-white/10'}`}
                  >
                      Baby Born
                  </button>
              </div>
          </div>
      </div>

      {/* FAMILY HUB / MULTIPARITY SUPPORT */}
      <div className="bg-white dark:bg-deep-card p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-indigo-800">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-indigo-800 pb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <Users size={20} className="text-indigo-600 dark:text-indigo-400" /> My Family Hub
              </h3>
              {onAddProfile && (
                  <Button onClick={onAddProfile} variant="secondary" className="text-xs">
                      <Plus size={16} /> Add Baby
                  </Button>
              )}
          </div>
          
          <div className="grid gap-3">
              {profiles.map(p => {
                  const isActive = p.id === settings.id;
                  let statusColor = 'bg-gray-500';
                  let icon = <Baby size={20} />;
                  
                  if (p.status === 'planning') {
                      statusColor = 'bg-teal-500';
                      icon = <Calendar size={18} />;
                  } else if (p.status === 'postpartum') {
                      if (p.babyGender === 'boy') {
                          statusColor = 'bg-blue-500';
                      } else {
                          statusColor = 'bg-pink-500';
                      }
                  } else {
                      statusColor = 'bg-purple-500';
                  }

                  return (
                      <div 
                        key={p.id}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                            isActive 
                                ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700 shadow-sm' 
                                : 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-indigo-900/30 hover:bg-gray-100 dark:hover:bg-indigo-900/20'
                        }`}
                      >
                          <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${statusColor}`}>
                                  {p.babyName ? p.babyName[0].toUpperCase() : icon}
                              </div>
                              <div>
                                  <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                      {p.babyName || (p.status === 'planning' ? 'Future Baby' : 'Baby Profile')}
                                      {p.status === 'postpartum' && (
                                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${p.babyGender === 'boy' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                                              {p.babyGender}
                                          </span>
                                      )}
                                  </p>
                                  <div className="flex gap-2 text-xs text-gray-500 dark:text-gray-400 items-center">
                                      <span className="capitalize">{p.status}</span>
                                      {p.birthDate && (
                                          <>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                            <span className="flex items-center gap-1"><Clock size={10} /> {calculateAge(p.birthDate)}</span>
                                          </>
                                      )}
                                      {isActive && <span className="ml-1 px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold">ACTIVE</span>}
                                  </div>
                              </div>
                          </div>
                          
                          {!isActive && onSwitchProfile && (
                              <button 
                                onClick={() => onSwitchProfile(p.id)}
                                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
                              >
                                  Switch <ChevronRight size={16} />
                              </button>
                          )}
                      </div>
                  );
              })}
          </div>
      </div>

      <div className="bg-white dark:bg-deep-card p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-indigo-800">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* AI CONFIGURATION SECTION */}
          <div className="space-y-6">
             <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-indigo-800 pb-3 mb-4">
                <Sparkles size={20} className="text-purple-500" /> AI Configuration
             </h3>
             <div className="bg-purple-50 dark:bg-purple-900/10 p-5 rounded-2xl border border-purple-100 dark:border-purple-900/30">
                 <div className="flex items-start gap-3 mb-4">
                     <div className="p-2 bg-purple-100 dark:bg-purple-800/50 rounded-full text-purple-600 dark:text-purple-300 shrink-0">
                         <Key size={20} />
                     </div>
                     <div>
                         <h4 className="font-bold text-gray-900 dark:text-white text-sm">Google Gemini API Key</h4>
                         <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                             Bloom uses advanced AI for medical analysis. To use these features, you need your own free Gemini API Key from Google.
                         </p>
                         <a 
                            href="https://aistudio.google.com/app/apikey" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 hover:underline"
                         >
                             Get your free key here <ExternalLink size={12} />
                         </a>
                     </div>
                 </div>
                 
                 <div className="relative">
                     <input 
                        type={showApiKey ? "text" : "password"}
                        placeholder="Paste your API Key here (starts with AIza...)"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 dark:border-indigo-700 bg-white dark:bg-indigo-950/50 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                     />
                     <button 
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                     >
                         {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                     </button>
                 </div>
                 {keySaved && <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1"><CheckCircle2 size={12}/> Key Saved Securely</p>}
             </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-indigo-800 pb-3 mb-4">
                <User size={20} className="text-pink-500" /> Personal Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-indigo-700 bg-white dark:bg-indigo-950/50 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Maternal Age (Required)</label>
                    <input
                        type="number"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-indigo-700 bg-white dark:bg-indigo-950/50 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                        value={formData.age || ''}
                        onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                        placeholder="e.g. 28"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Age is vital for calculating pregnancy risks (FOGSI Guidelines).</p>
                </div>
            </div>

            {/* OBSTETRIC HISTORY */}
            <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-indigo-800 pb-3 pt-4 mb-4">
                <FileText size={20} className="text-teal-500" /> Obstetric History
            </h3>
            <div className="p-5 bg-teal-50 dark:bg-teal-900/10 rounded-2xl space-y-5 border border-teal-100 dark:border-teal-900/30">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Total Pregnancies (Gravida)</label>
                        <input
                            type="number"
                            min="1"
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-indigo-700 bg-white dark:bg-deep-bg text-gray-900 dark:text-white"
                            value={formData.obstetricHistory.gravida}
                            onChange={(e) => updateObstetric('gravida', parseInt(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Live Births (Para)</label>
                        <input
                            type="number"
                            min="0"
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-indigo-700 bg-white dark:bg-deep-bg text-gray-900 dark:text-white"
                            value={formData.obstetricHistory.para}
                            onChange={(e) => updateObstetric('para', parseInt(e.target.value))}
                        />
                    </div>
                </div>

                {/* Abortion History Section - Always Visible */}
                <div className="space-y-3">
                    <p className="text-sm font-bold text-red-600 dark:text-red-400">Abortion / Miscarriage History (Required for Risk Calc)</p>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">1st Trimester (&lt;12 wks)</label>
                            <input
                                type="number"
                                min="0"
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-indigo-700 bg-white dark:bg-deep-bg text-gray-900 dark:text-white"
                                value={formData.obstetricHistory.abortionsT1}
                                onChange={(e) => updateObstetric('abortionsT1', parseInt(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">2nd Trimester (12-24 wks)</label>
                            <input
                                type="number"
                                min="0"
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-indigo-700 bg-white dark:bg-deep-bg text-gray-900 dark:text-white"
                                value={formData.obstetricHistory.abortionsT2}
                                onChange={(e) => updateObstetric('abortionsT2', parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                </div>

                <div className="border-t border-teal-100 dark:border-teal-900/50 pt-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="mt-1 w-5 h-5 text-teal-600 rounded"
                            checked={formData.obstetricHistory.lastBabyCongenitalDefect}
                            onChange={(e) => updateObstetric('lastBabyCongenitalDefect', e.target.checked)}
                        />
                        <div className="flex-1">
                            <span className="font-bold text-gray-800 dark:text-white text-sm">Previous baby had Congenital / Genetic Defects?</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">e.g., Neural Tube Defect, Down Syndrome, Heart Defect. (Important for Folic Acid dosage).</p>
                        </div>
                    </label>
                </div>
            </div>

            {/* Medical Identity & Genetics */}
            <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-indigo-800 pb-3 pt-4 mb-4">
                <Stethoscope size={20} className="text-blue-500" /> Genetics & Predictions
            </h3>
            
            <div className="p-5 bg-gray-50 dark:bg-indigo-900/10 rounded-2xl space-y-5 border border-gray-100 dark:border-indigo-900/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Mom's Height (cm)</label>
                        <input
                            type="number"
                            placeholder="e.g. 160"
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-indigo-700 bg-white dark:bg-deep-bg text-gray-900 dark:text-white"
                            value={formData.heightCm || ''}
                            onChange={(e) => setFormData({...formData, heightCm: parseInt(e.target.value)})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Dad's Height (cm)</label>
                        <input
                            type="number"
                            placeholder="e.g. 175"
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-indigo-700 bg-white dark:bg-deep-bg text-gray-900 dark:text-white"
                            value={formData.paternalHeightCm || ''}
                            onChange={(e) => setFormData({...formData, paternalHeightCm: parseInt(e.target.value)})}
                        />
                    </div>
                </div>

                {/* Height Prediction Result */}
                {predictedHeight && (
                    <div className="bg-white dark:bg-deep-card p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600">
                                <Ruler size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Predicted Adult Height</p>
                                <div className="flex gap-4 mt-1 text-sm">
                                    <span className="text-blue-600 dark:text-blue-400 font-bold">Boy: {predictedHeight.boy} cm</span>
                                    <span className="text-pink-600 dark:text-pink-400 font-bold">Girl: {predictedHeight.girl} cm</span>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1">
                                    Formula: Tanner's Mid-Parental. Accuracy: ± 6.5 cm (95% range).
                                    <br/><span className="text-red-500 dark:text-red-400 italic">Disclaimer: Real height can vary significantly due to nutrition, environment, and health. Keep tracking growth and consult a doctor if not in the normal range.</span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Mom's Blood Group</label>
                        <select 
                            value={formData.maternalBloodGroup}
                            onChange={(e) => setFormData({...formData, maternalBloodGroup: e.target.value})}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-indigo-700 bg-white dark:bg-deep-bg text-gray-900 dark:text-white"
                        >
                            <option value="">Select</option>
                            {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Dad's Blood Group</label>
                        <select 
                            value={formData.paternalBloodGroup}
                            onChange={(e) => setFormData({...formData, paternalBloodGroup: e.target.value})}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-indigo-700 bg-white dark:bg-deep-bg text-gray-900 dark:text-white"
                        >
                            <option value="">Select</option>
                            {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                </div>

                {/* Blood Group Prediction Result */}
                {bloodData && (
                    <div className="space-y-3">
                        <div className="bg-white dark:bg-deep-card p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                            <div className="flex items-start gap-4 mb-3">
                                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-600">
                                    <Droplet size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Possible Baby Blood Groups</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {bloodData.possibilities.map(g => (
                                            <span key={g} className="px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-xs font-bold rounded-md border border-red-100 dark:border-red-900/50">
                                                {g}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-2 italic">
                                        Disclaimer: These are genetically predicted possibilities. Actual blood group must be confirmed via laboratory testing.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Compatibility Alert */}
                        <div className={`p-3 rounded-lg border text-sm flex gap-2 ${
                            bloodData.risk.severity === 'high' ? 'bg-red-50 text-red-800 border-red-200' : 
                            bloodData.risk.severity === 'medium' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' :
                            'bg-green-50 text-green-800 border-green-200'
                        }`}>
                            {bloodData.risk.severity === 'low' ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> : <AlertTriangle size={16} className="shrink-0 mt-0.5" />}
                            <div>
                                <span className="font-bold">{bloodData.risk.title}:</span> {bloodData.risk.message}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Weight (kg)</label>
                    <input
                        type="number"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-indigo-700 bg-white dark:bg-indigo-950/50 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                        value={formData.prePregnancyWeight || ''}
                        onChange={(e) => setFormData({...formData, prePregnancyWeight: parseInt(e.target.value)})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {formData.status === 'pregnant' ? 'Pregnancy Start (LMP)' : 'Last Period Start'}
                    </label>
                    <input
                        type="date"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-indigo-700 bg-white dark:bg-indigo-950/50 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                        value={formData.lmp || ''}
                        max={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setFormData({...formData, lmp: e.target.value})}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cycle Length: {formData.cycleLength} Days</label>
                <input
                    type="range"
                    min="21"
                    max="45"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
                    value={formData.cycleLength}
                    onChange={(e) => setFormData({...formData, cycleLength: parseInt(e.target.value)})}
                />
            </div>

          </div>

          <div className="border-t border-gray-100 dark:border-indigo-900 pt-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Utensils className="text-pink-600" size={20} /> 
              Diet & Health
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Diet</label>
                  <select 
                    value={formData.dietaryPreference || 'vegetarian'}
                    onChange={(e) => setFormData({...formData, dietaryPreference: e.target.value as DietType})}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-indigo-700 bg-white dark:bg-indigo-950/50 text-gray-900 dark:text-white outline-none"
                  >
                    <option value="vegetarian">Vegetarian</option>
                    <option value="eggetarian">Eggetarian</option>
                    <option value="non-vegetarian">Non-Vegetarian</option>
                  </select>
               </div>
               <div className="flex items-end">
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-indigo-700 w-full cursor-pointer hover:bg-gray-50 dark:hover:bg-indigo-900/20">
                    <input 
                      type="checkbox"
                      checked={formData.lactoseIntolerant || false}
                      onChange={(e) => setFormData({...formData, lactoseIntolerant: e.target.checked})}
                      className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500 border-gray-300"
                    />
                    <span className="text-gray-800 dark:text-white font-medium">Lactose Intolerant?</span>
                  </label>
               </div>
            </div>

            <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Known Conditions (Comorbidities)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(COMORBIDITY_GUIDELINES).map((condition) => (
                <label 
                  key={condition.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    (formData.comorbidities || []).includes(condition.id)
                      ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                      : 'border-gray-200 dark:border-indigo-800 hover:border-pink-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={(formData.comorbidities || []).includes(condition.id)}
                    onChange={() => toggleComorbidity(condition.id)}
                    className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500 border-gray-300"
                  />
                  <span className="font-medium text-gray-800 dark:text-white">{condition.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <Button type="submit" className="flex-1 py-3 !text-white bg-pink-600 hover:bg-pink-700" disabled={saved}>
              {saved ? 'Saved Successfully!' : 'Update Profile & Save Key'}
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-3xl border border-red-100 dark:border-red-900/30">
        <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-2">Danger Zone</h3>
        <p className="text-sm text-red-600 dark:text-red-300 mb-4">
            This action will permanently delete all your profiles, logs (weight, period, medical history), and app settings from this device. This cannot be undone.
        </p>
        {/* Changed from window.confirm to state trigger */}
        <Button variant="danger" onClick={() => setShowResetConfirm(true)}>
          Reset All Data (All Profiles)
        </Button>
      </div>

      {/* Custom Reset Confirmation Modal */}
      {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
              <div className="bg-white dark:bg-deep-card p-6 rounded-3xl shadow-2xl max-w-sm w-full border border-red-200 dark:border-red-900 transform transition-all scale-100">
                  <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400">
                          <AlertTriangle size={32} />
                      </div>
                      <button onClick={() => setShowResetConfirm(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                          <X size={24} />
                      </button>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Reset App Data?</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                      Are you sure you want to delete <strong>everything</strong>? This includes all baby profiles, tracked periods, pregnancy logs, and weight history.
                      <br/><br/>
                      <span className="font-bold text-red-500">This action cannot be undone.</span>
                  </p>
                  
                  <div className="flex flex-col gap-3">
                      <Button onClick={onReset} variant="danger" className="w-full py-3 justify-center text-lg">
                          Yes, Delete Everything
                      </Button>
                      <Button onClick={() => setShowResetConfirm(false)} variant="secondary" className="w-full py-3 justify-center">
                          Cancel
                      </Button>
                  </div>
              </div>
          </div>
      )}

      {/* Baby Info Modal */}
      {showBabyModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-deep-card p-6 rounded-3xl shadow-2xl max-w-sm w-full border border-gray-200 dark:border-indigo-800">
                  <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Enter Baby Details</h3>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Baby Name</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-2 border border-gray-300 dark:border-indigo-600 rounded-xl bg-white dark:bg-indigo-950/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none"
                            value={babyForm.name}
                            onChange={(e) => setBabyForm({...babyForm, name: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Birth Date</label>
                          <input 
                            type="date" 
                            className="w-full px-4 py-2 border border-gray-300 dark:border-indigo-600 rounded-xl bg-white dark:bg-indigo-950/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none"
                            value={babyForm.date}
                            max={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setBabyForm({...babyForm, date: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Gender</label>
                          <div className="flex gap-4">
                            <label className={`flex-1 flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${babyForm.gender === 'boy' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-indigo-900/20'}`}>
                                <input type="radio" name="gender" className="hidden" onClick={() => setBabyForm({...babyForm, gender: 'boy'})} />
                                Boy
                            </label>
                            <label className={`flex-1 flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${babyForm.gender === 'girl' ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-600' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-indigo-900/20'}`}>
                                <input type="radio" name="gender" className="hidden" onClick={() => setBabyForm({...babyForm, gender: 'girl'})} />
                                Girl
                            </label>
                          </div>
                      </div>
                  </div>
                  <div className="flex gap-4 mt-6">
                      <Button variant="secondary" onClick={() => setShowBabyModal(false)} className="flex-1">Cancel</Button>
                      <Button onClick={enablePostpartumMode} disabled={!babyForm.name || !babyForm.date} className="flex-1">Confirm</Button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
