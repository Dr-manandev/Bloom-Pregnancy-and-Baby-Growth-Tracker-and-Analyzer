
import React, { useState, useEffect, useMemo } from 'react';
import { UserSettings, PregnancyCalculations, TabView, ProfileMeta, Medicine } from './types';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { PostpartumDashboard } from './components/PostpartumDashboard';
import { PrePregnancyDashboard } from './components/PrePregnancyDashboard';
import { Timeline } from './components/Timeline';
import { ReportAnalyzer } from './components/ReportAnalyzer';
import { MedicineTracker } from './components/MedicineTracker';
import { Profile } from './components/Profile';
import { DietPlan } from './components/DietPlan';
import { VaccinationTracker } from './components/VaccinationTracker';
import { ToolsHub } from './components/ToolsHub';
import { HealthTracker } from './components/HealthTracker';
import { MalePartnerHealth } from './components/MalePartnerHealth';
import { Login } from './components/Login';
import { LayoutDashboard, Calendar, FileText, Pill, Moon, Sun, Settings, User, Utensils, Syringe, Baby, Wrench, HeartPulse, LogOut, Users, PlusCircle } from 'lucide-react';

// Keys that store profile-specific data which need to be swapped on profile switch
const PROFILE_SPECIFIC_KEYS = [
  'bloom_kicks',
  'bloom_contractions',
  'bloom_milestones',
  'bloom_weight_logs',
  'bloom_pp_weight_logs',
  'bloom_bp_logs',
  'bloom_pp_bp_logs',
  'bloom_glucose_logs',
  'bloom_pp_glucose_logs',
  'bloom_baby_growth',
  'bloom_tsh_logs', 'bloom_pp_tsh_logs',
  'bloom_hb_logs', 'bloom_pp_hb_logs',
  'bloom_hba1c_logs', 'bloom_pp_hba1c_logs',
  'bloom_medicines', 'bloom_pp_medicines' // Added Medicine Keys
];

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [activeTab, setActiveTab] = useState<TabView>(TabView.DASHBOARD);
  
  // Profile Management State
  const [profiles, setProfiles] = useState<ProfileMeta[]>([]);
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);

  // Load auth & settings & profile meta
  useEffect(() => {
    const auth = localStorage.getItem('bloom_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }

    const savedSettings = localStorage.getItem('bloom_settings');
    const savedProfiles = localStorage.getItem('bloom_all_profiles');

    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      
      // Legacy Migration: If no ID, assign one and create profile meta
      if (!parsed.id) {
          parsed.id = 'default_profile_' + Date.now();
          localStorage.setItem('bloom_settings', JSON.stringify(parsed));
      }

      // Default field migrations for older data
      if (!parsed.status) parsed.status = parsed.isPostpartum ? 'postpartum' : 'pregnant';
      if (!parsed.comorbidities) parsed.comorbidities = [];
      if (!parsed.dietaryPreference) parsed.dietaryPreference = 'vegetarian';
      if (parsed.lactoseIntolerant === undefined) parsed.lactoseIntolerant = false;
      if (!parsed.vaccinationsDone) parsed.vaccinationsDone = [];
      if (!parsed.preConceptionChecklist) parsed.preConceptionChecklist = [];
      if (!parsed.periodLog) parsed.periodLog = [];
      if (parsed.pregnancyLmp === undefined) parsed.pregnancyLmp = null;
      if (!parsed.maternalBloodGroup) parsed.maternalBloodGroup = '';
      
      // Migration for new Risk Features (Obstetric History & Age)
      if (!parsed.obstetricHistory) {
          parsed.obstetricHistory = {
              gravida: 1,
              para: 0,
              abortions: 0,
              abortionsT1: 0,
              abortionsT2: 0,
              living: 0,
              lastBabyCongenitalDefect: false
          };
      }
      if (parsed.age === undefined) parsed.age = 0; 
      
      setSettings(parsed);

      // Initialize Profiles List
      if (savedProfiles) {
          setProfiles(JSON.parse(savedProfiles));
      } else {
          // Create initial profile list from current settings
          const initialProfile: ProfileMeta = {
              id: parsed.id,
              name: parsed.name,
              status: parsed.status,
              babyName: parsed.babyName,
              babyGender: parsed.babyGender,
              birthDate: parsed.birthDate,
              lastActive: new Date().toISOString()
          };
          setProfiles([initialProfile]);
          localStorage.setItem('bloom_all_profiles', JSON.stringify([initialProfile]));
      }
    }
  }, []);

  // Request Notification Permission on Mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  // Global Medicine Notification Checker
  useEffect(() => {
    if (!settings) return;

    const checkMedicines = () => {
      if ('Notification' in window && Notification.permission === 'granted') {
        const isPostpartum = settings.status === 'postpartum';
        const key = isPostpartum ? 'bloom_pp_medicines' : 'bloom_medicines';
        const stored = localStorage.getItem(key);
        
        if (stored) {
          const medicines: Medicine[] = JSON.parse(stored);
          const now = new Date();
          const currentHours = now.getHours();
          const currentMinutes = now.getMinutes();

          medicines.forEach(med => {
            if (!med.taken && med.time) {
              const [medHours, medMinutes] = med.time.split(':').map(Number);
              // Trigger if times match exactly
              if (medHours === currentHours && medMinutes === currentMinutes) {
                new Notification('Bloom: Medicine Reminder', {
                  body: `It's time to take your ${med.name} (${med.dosage})`,
                  icon: '/icon-192x192.png' // Assumes standard PWA icon path or fallback
                });
              }
            }
          });
        }
      }
    };

    // Check every minute
    const interval = setInterval(checkMedicines, 60000);
    return () => clearInterval(interval);
  }, [settings]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // --- Profile Switching Logic ---

  const handleSwitchProfile = (targetProfileId: string) => {
      if (!settings || settings.id === targetProfileId) return;

      // 1. Snapshot Current Profile Data
      // Save current active logs into namespaced keys (e.g. bloom_kicks_profile_1)
      PROFILE_SPECIFIC_KEYS.forEach(key => {
          const data = localStorage.getItem(key);
          if (data) {
              localStorage.setItem(`${key}_${settings.id}`, data);
          } else {
              localStorage.removeItem(`${key}_${settings.id}`);
          }
      });
      // Save current settings to namespaced key
      localStorage.setItem(`bloom_settings_${settings.id}`, JSON.stringify(settings));

      // 2. Hydrate Target Profile Data
      // Load target profile logs into active keys
      PROFILE_SPECIFIC_KEYS.forEach(key => {
          const savedData = localStorage.getItem(`${key}_${targetProfileId}`);
          if (savedData) {
              localStorage.setItem(key, savedData);
          } else {
              localStorage.removeItem(key); // Clear if no data for target
          }
      });

      // 3. Load Target Settings
      const targetSettingsRaw = localStorage.getItem(`bloom_settings_${targetProfileId}`);
      if (targetSettingsRaw) {
          const targetSettings = JSON.parse(targetSettingsRaw);
          setSettings(targetSettings);
          localStorage.setItem('bloom_settings', targetSettingsRaw); // Set as active settings
          
          // Update Meta Last Active
          const updatedProfiles = profiles.map(p => 
              p.id === targetProfileId ? { ...p, lastActive: new Date().toISOString() } : p
          );
          setProfiles(updatedProfiles);
          localStorage.setItem('bloom_all_profiles', JSON.stringify(updatedProfiles));
          
          // Refresh to ensure all sub-components read new localStorage values
          window.location.reload(); 
      }
  };

  const handleAddProfile = () => {
      if (!settings) return;

      // 1. Snapshot Current Data (Same as switch)
      PROFILE_SPECIFIC_KEYS.forEach(key => {
          const data = localStorage.getItem(key);
          if (data) localStorage.setItem(`${key}_${settings.id}`, data);
          else localStorage.removeItem(`${key}_${settings.id}`);
      });
      localStorage.setItem(`bloom_settings_${settings.id}`, JSON.stringify(settings));

      // 2. Create New Settings (Inherit Shared Data)
      const newId = `profile_${Date.now()}`;
      const newSettings: UserSettings = {
          id: newId,
          name: settings.name, // Mom's name is shared
          status: 'planning', // Default to planning for new journey
          lmp: null,
          cycleLength: settings.cycleLength,
          
          // Shared Stats (Don't make mom re-enter)
          heightCm: settings.heightCm,
          prePregnancyWeight: settings.prePregnancyWeight, // Might change, but good default
          maternalBloodGroup: settings.maternalBloodGroup,
          paternalBloodGroup: settings.paternalBloodGroup,
          paternalHeightCm: settings.paternalHeightCm,
          obstetricHistory: settings.obstetricHistory, // Copy history
          comorbidities: settings.comorbidities, // Usually persistent
          dietaryPreference: settings.dietaryPreference,
          lactoseIntolerant: settings.lactoseIntolerant,
          age: settings.age,

          // Reset Logs for new baby
          periodLog: [],
          vaccinationsDone: [],
          isPostpartum: false,
          preConceptionChecklist: []
      };

      // 3. Clear Active Keys for fresh start
      PROFILE_SPECIFIC_KEYS.forEach(key => localStorage.removeItem(key));

      // 4. Update State & Storage
      setSettings(newSettings);
      localStorage.setItem('bloom_settings', JSON.stringify(newSettings));
      
      const newProfileMeta: ProfileMeta = {
          id: newId,
          name: newSettings.name,
          status: 'planning',
          babyName: undefined,
          lastActive: new Date().toISOString()
      };
      
      const updatedProfiles = [...profiles, newProfileMeta];
      setProfiles(updatedProfiles);
      localStorage.setItem('bloom_all_profiles', JSON.stringify(updatedProfiles));
      
      // Force reload to apply clean state
      window.location.reload();
  };

  const calculations: PregnancyCalculations | null = useMemo(() => {
    if (!settings || !settings.lmp) return null;

    const lmpDate = new Date(settings.lmp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lmpDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Logic: Naegele's rule adjusted
    const cycleAdjustment = settings.cycleLength - 28;
    const edd = new Date(lmpDate);
    edd.setDate(edd.getDate() + 280 + cycleAdjustment);
    
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;
    
    let trimester: 1 | 2 | 3 = 1;
    if (weeks > 13) trimester = 2;
    if (weeks > 27) trimester = 3;

    return {
      edd,
      currentWeek: weeks === 0 ? 1 : weeks, // Minimum week 1
      currentDay: days,
      totalDays: diffDays,
      trimester,
      month: Math.ceil(weeks / 4.3),
      progressPercent: Math.min((diffDays / 280) * 100, 100)
    };
  }, [settings]);

  // Determine App Mode based on Settings Status
  const isPostpartum = settings?.status === 'postpartum';
  const isPlanning = settings?.status === 'planning';
  const isPregnant = settings?.status === 'pregnant';

  // Dynamic Theme Logic (Strict Gender Colors for Postpartum)
  let themeColor = 'text-pink-600';
  let activeBg = 'bg-pink-600 text-white shadow-pink-500/30';
  let bgGradient = 'bg-gradient-to-r from-pink-600 to-purple-600';
  let badgeColor = 'bg-pink-100 text-pink-600';

  if (isPlanning) {
      themeColor = 'text-teal-600';
      activeBg = 'bg-teal-600 text-white shadow-teal-500/30';
      bgGradient = 'bg-gradient-to-r from-teal-500 to-emerald-600';
      badgeColor = 'bg-teal-100 text-teal-600';
  } else if (isPostpartum) {
      if (settings?.babyGender === 'boy') {
          themeColor = 'text-blue-600';
          activeBg = 'bg-blue-600 text-white shadow-blue-500/30';
          bgGradient = 'bg-gradient-to-r from-blue-600 to-cyan-600';
          badgeColor = 'bg-blue-100 text-blue-600';
      } else {
          // Explicit Pink for Girl (Postpartum) to differ from Pregnancy Purple/Pink mix
          themeColor = 'text-rose-500';
          activeBg = 'bg-rose-500 text-white shadow-rose-500/30';
          bgGradient = 'bg-gradient-to-r from-rose-400 to-pink-500';
          badgeColor = 'bg-rose-100 text-rose-600';
      }
  }

  const getBabyAgeInWeeks = () => {
    if (!settings?.birthDate) return 0;
    const birth = new Date(settings.birthDate);
    const now = new Date();
    const diff = Math.abs(now.getTime() - birth.getTime());
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('bloom_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('bloom_auth');
    setActiveTab(TabView.DASHBOARD);
  };

  const handleOnboardingComplete = (data: UserSettings) => {
    // Inject ID if missing from Onboarding
    if (!data.id) data.id = 'profile_' + Date.now();
    
    // Initial sync of log if date provided
    if (data.lmp) {
        data.periodLog = [data.lmp];
        data.pregnancyLmp = data.status === 'pregnant' ? data.lmp : null;
    }
    
    // Ensure new fields are initialized
    if (!data.obstetricHistory) {
        data.obstetricHistory = {
            gravida: 1,
            para: 0,
            abortions: 0,
            abortionsT1: 0,
            abortionsT2: 0,
            living: 0,
            lastBabyCongenitalDefect: false
        };
    }
    if (data.age === undefined) data.age = 0;

    setSettings(data);
    localStorage.setItem('bloom_settings', JSON.stringify(data));
    
    // Initialize Profiles List for new user
    const meta: ProfileMeta = {
        id: data.id,
        name: data.name,
        status: data.status,
        babyName: data.babyName,
        babyGender: data.babyGender,
        birthDate: data.birthDate,
        lastActive: new Date().toISOString()
    };
    setProfiles([meta]);
    localStorage.setItem('bloom_all_profiles', JSON.stringify([meta]));
  };

  const handleUpdateProfile = (data: UserSettings) => {
    setSettings(data);
    localStorage.setItem('bloom_settings', JSON.stringify(data));
    
    // Update Meta in Profile List
    const updatedProfiles = profiles.map(p => 
        p.id === data.id ? { 
            ...p, 
            name: data.name, 
            status: data.status, 
            babyName: data.babyName,
            babyGender: data.babyGender,
            birthDate: data.birthDate
        } : p
    );
    setProfiles(updatedProfiles);
    localStorage.setItem('bloom_all_profiles', JSON.stringify(updatedProfiles));
  };

  const handleVaccineUpdate = (vaxId: string) => {
    if (!settings) return;
    const currentDone = settings.vaccinationsDone || [];
    let newDone;
    if (currentDone.includes(vaxId)) {
        newDone = currentDone.filter(id => id !== vaxId);
    } else {
        newDone = [...currentDone, vaxId];
    }
    const newSettings = { ...settings, vaccinationsDone: newDone };
    setSettings(newSettings);
    localStorage.setItem('bloom_settings', JSON.stringify(newSettings));
  };

  const handleReset = () => {
    localStorage.clear();
    setTimeout(() => {
        window.location.reload();
    }, 50);
  };

  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  if (!settings) {
    return (
      <>
        <div className="fixed top-4 right-4 z-50">
           <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-full bg-white dark:bg-deep-card shadow-lg text-bloom-DEFAULT dark:text-yellow-400">
             {darkMode ? <Sun size={20} /> : <Moon size={20} />}
           </button>
        </div>
        <Onboarding onComplete={handleOnboardingComplete} />
      </>
    );
  }

  // Determine Nav Items
  let navItems = [];
  
  if (isPlanning) {
      navItems = [
          { id: TabView.DASHBOARD, icon: Calendar, label: 'Cycle & Plan' },
          { id: TabView.HEALTH, icon: HeartPulse, label: 'Body Ready' },
          { id: TabView.PARTNER, icon: Users, label: 'Partner' }, 
          { id: TabView.DIET, icon: Utensils, label: 'Fertility Diet' }, // ADDED DIET TAB
          { id: TabView.MEDICINES, icon: Pill, label: 'Meds' },
          { id: TabView.TOOLS, icon: Wrench, label: 'Tools' }
      ];
  } else if (isPostpartum) {
      navItems = [
          { id: TabView.DASHBOARD, icon: Baby, label: 'Baby Care' },
          { id: TabView.HEALTH, icon: HeartPulse, label: 'Growth & Vitals' },
          { id: TabView.MEDICINES, icon: Pill, label: 'Meds' },
          { id: TabView.VACCINATIONS, icon: Syringe, label: 'Vaccines' }, 
          { id: TabView.DIET, icon: Utensils, label: 'Mom Diet' }
      ];
  } else {
      // Pregnant
      navItems = [
          { id: TabView.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
          { id: TabView.HEALTH, icon: HeartPulse, label: 'Vitals' },
          { id: TabView.TOOLS, icon: Wrench, label: 'Tools' },
          { id: TabView.TIMELINE, icon: Calendar, label: 'Timeline' },
          { id: TabView.MEDICINES, icon: Pill, label: 'Meds' },
          { id: TabView.DIET, icon: Utensils, label: 'Diet Plan' },
          { id: TabView.VACCINATIONS, icon: Syringe, label: 'Vaccines' },
          { id: TabView.REPORTS, icon: FileText, label: 'Reports' },
      ];
  }

  const renderContent = () => {
    const calcSafe = calculations || { 
        currentWeek: 0, edd: new Date(), currentDay: 0, totalDays: 0, trimester: 1, month: 1, progressPercent: 0 
    } as PregnancyCalculations;

    // Use a key based on profile ID to force re-mount components when switching profiles
    const profileKey = settings.id;

    switch(activeTab) {
      case TabView.DASHBOARD: 
        if (isPlanning) return <PrePregnancyDashboard key={`plan_${profileKey}`} settings={settings} onUpdateSettings={handleUpdateProfile} />;
        if (isPostpartum) return <PostpartumDashboard key={`pp_${profileKey}`} settings={settings} />;
        return <Dashboard key={`preg_${profileKey}`} calculations={calcSafe} settings={settings} />;
      
      case TabView.TIMELINE: return <Timeline key={`time_${profileKey}`} calculations={calcSafe} settings={settings} />;
      case TabView.REPORTS: return <ReportAnalyzer key={`rep_${profileKey}`} />;
      case TabView.MEDICINES: 
        // Pass Mode Explicitly
        return <MedicineTracker 
            key={`med_${profileKey}`} 
            currentWeek={calcSafe.currentWeek} 
            isPostpartum={isPostpartum} 
            mode={settings.status}
            comorbidities={settings.comorbidities}
        />;
      case TabView.DIET: return <DietPlan key={`diet_${profileKey}`} settings={settings} calculations={calcSafe} />;
      case TabView.VACCINATIONS: 
        return <VaccinationTracker 
            key={`vax_${profileKey}`}
            settings={settings} 
            currentWeek={isPostpartum ? getBabyAgeInWeeks() : calcSafe.currentWeek} 
            onUpdate={handleVaccineUpdate} 
        />;
      case TabView.HEALTH: return <HealthTracker key={`health_${profileKey}`} settings={settings} calculations={calcSafe} />;
      case TabView.TOOLS: return <ToolsHub key={`tools_${profileKey}`} />;
      case TabView.PARTNER: return <MalePartnerHealth key={`partner_${profileKey}`} />;
      case TabView.PROFILE: 
        return <Profile 
            key={`prof_${profileKey}`}
            settings={settings} 
            profiles={profiles} // Pass list for management
            onUpdate={handleUpdateProfile} 
            onReset={handleReset} 
            onAddProfile={handleAddProfile}
            onSwitchProfile={handleSwitchProfile}
        />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bloom-light dark:bg-deep-bg transition-colors duration-300">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-deep-card border-r border-gray-200 dark:border-deep-border shrink-0 h-full">
         <div className="p-6">
             <h1 className={`text-2xl font-bold bg-clip-text text-transparent ${bgGradient}`}>
                {isPlanning ? "Bloom Plan" : isPostpartum ? (settings.babyGender === 'boy' ? "Bloom Baby" : "Bloom Baby") : "Bloom Bump"}
             </h1>
             {/* Mini Profile Switcher */}
             {profiles.length > 1 && (
                 <div className="mt-2 flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab(TabView.PROFILE)}>
                     <div className="flex -space-x-2">
                         {profiles.slice(0, 3).map(p => (
                             <div key={p.id} className="w-6 h-6 rounded-full border border-white bg-gray-200 flex items-center justify-center text-[10px] overflow-hidden">
                                 {p.babyName ? p.babyName[0] : p.name[0]}
                             </div>
                         ))}
                     </div>
                     <span className="text-xs text-gray-500 underline">Switch Profile</span>
                 </div>
             )}
         </div>
         
         <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
            {navItems.map(item => (
               <button
                 key={item.id}
                 onClick={() => setActiveTab(item.id)}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === item.id ? `${activeBg} shadow-lg` : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
               >
                  <item.icon size={20} />
                  {item.label}
               </button>
            ))}
         </nav>

         <div className="p-4 border-t border-gray-200 dark:border-deep-border mt-auto">
            <div 
              onClick={() => setActiveTab(TabView.PROFILE)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100 dark:bg-slate-800/50 mb-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            >
                <div className={`w-8 h-8 rounded-full ${badgeColor} flex items-center justify-center font-bold`}>
                    {settings.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold truncate text-gray-800 dark:text-white">{settings.babyName || settings.name}</p>
                    <p className="text-xs text-gray-500 truncate capitalize">
                        {settings.status === 'postpartum' && settings.babyName ? 'Baby Profile' : settings.status}
                    </p>
                </div>
                <Settings size={16} className="text-gray-400" />
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut size={16} /> Sign Out
            </button>
         </div>
      </aside>

      {/* Mobile Nav - Fixed Bottom */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-deep-card border-t border-gray-200 dark:border-deep-border z-50 flex flex-col safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
         <div className="flex items-center gap-1 overflow-x-auto px-2 py-2 w-full no-scrollbar">
            {[
              ...navItems,
              { id: TabView.PROFILE, icon: User, label: 'Profile' },
            ].map(item => (
               <button
                 key={item.id}
                 onClick={() => setActiveTab(item.id)}
                 className={`flex-shrink-0 flex flex-col items-center gap-1 p-2 rounded-xl transition-all min-w-[64px] ${activeTab === item.id ? themeColor : 'text-gray-400'}`}
               >
                  <item.icon size={22} />
                  <span className="text-[10px] font-medium whitespace-nowrap">{item.label}</span>
               </button>
            ))}
         </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
         <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-gray-200 dark:border-deep-border bg-white/50 dark:bg-deep-card/50 backdrop-blur-md sticky top-0 z-40 shrink-0">
            <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white capitalize truncate">
                    {activeTab === TabView.VACCINATIONS ? 'Vaccinations' : activeTab.replace('-', ' ')}
                </h2>
                {profiles.length > 1 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-slate-700 hidden md:inline-block">
                        Active: {settings.babyName || "Profile 1"}
                    </span>
                )}
            </div>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-yellow-400 transition-colors shadow-sm"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
         </header>

         <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 pb-28 md:pb-8 custom-scrollbar scroll-smooth w-full">
            <div className="max-w-7xl mx-auto w-full">
              {renderContent()}
            </div>
         </div>
      </main>
    </div>
  );
}
