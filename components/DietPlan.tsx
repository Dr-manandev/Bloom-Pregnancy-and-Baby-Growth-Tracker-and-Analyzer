
import React, { useState, useMemo } from 'react';
import { UserSettings, PregnancyCalculations, DietType } from '../types';
import { FOOD_LIBRARY, DIET_LOGIC, MEAL_PLAN_TEMPLATES } from '../constants';
import { Coffee, Utensils, Moon, Sun, Apple, Info, AlertTriangle, Droplet, Search, Filter, CheckCircle2, ChevronRight, Star, Baby, Heart } from 'lucide-react';

interface Props {
  settings: UserSettings;
  calculations: PregnancyCalculations;
}

export const DietPlan: React.FC<Props> = ({ settings, calculations }) => {
  const [activeTab, setActiveTab] = useState<'plan' | 'library' | 'guide'>('plan');
  const [searchTerm, setSearchTerm] = useState('');
  
  // -- DERIVE CONTEXT --
  const isPostpartum = settings.isPostpartum;
  const trimester = calculations.trimester;
  const dietType = settings.dietaryPreference || 'vegetarian';
  const comorbidities = settings.comorbidities || [];
  
  // BMI Logic
  const getBmiCategory = () => {
      if(!settings.prePregnancyWeight || !settings.heightCm) return 'normal';
      const bmi = settings.prePregnancyWeight / ((settings.heightCm/100)**2);
      if(bmi < 18.5) return 'underweight';
      if(bmi >= 30) return 'obese';
      if(bmi >= 25) return 'overweight';
      return 'normal';
  };
  const bmiCat = getBmiCategory();
  const bmiInfo = DIET_LOGIC.bmi[bmiCat];

  // Stage Logic
  let stageKey = 't1'; // Default
  if (settings.status === 'planning') stageKey = 'planning';
  else if (settings.status === 'postpartum') stageKey = 'postpartum';
  else {
      // Pregnant - derive from trimester
      stageKey = trimester === 1 ? 't1' : trimester === 2 ? 't2' : 't3';
  }
  
  // @ts-ignore
  const stageInfo = DIET_LOGIC.stages[stageKey] || DIET_LOGIC.stages.t1;

  // -- FILTERING LOGIC --
  const filterFood = (item: any) => {
      // 1. Diet Type Check
      if (dietType === 'vegetarian' && item.category === 'NonVeg') return false;
      if (dietType === 'eggetarian' && item.category === 'NonVeg' && !item.name.includes('Egg')) return false;

      // 2. Lactose Intolerance
      if (settings.lactoseIntolerant && item.category === 'Dairy' && !item.name.includes('Curd') && !item.name.includes('Ghee')) return false; // Curd/Ghee often tolerated, but Milk avoid

      // 3. Comorbidities (The Strict Filter)
      for (const condition of comorbidities) {
          const logic = DIET_LOGIC.comorbidities[condition as keyof typeof DIET_LOGIC.comorbidities];
          if (logic && logic.avoid) {
              // If item has a tag that is in the avoid list for this condition
              if (item.tags.some((t: string) => logic.avoid.includes(t))) return false;
          }
      }
      return true;
  };

  const getTagsForFood = (item: any) => {
      let displayTags = [];
      // Positive tags
      if(item.tags.includes('protein')) displayTags.push({text: 'Protein', color: 'bg-blue-100 text-blue-700'});
      if(item.tags.includes('iron')) displayTags.push({text: 'Iron', color: 'bg-red-100 text-red-700'});
      if(item.tags.includes('calcium')) displayTags.push({text: 'Calcium', color: 'bg-gray-100 text-gray-700'});
      if(item.tags.includes('folate')) displayTags.push({text: 'Folate', color: 'bg-green-100 text-green-700'});
      if(item.tags.includes('antioxidant')) displayTags.push({text: 'Antioxidant', color: 'bg-purple-100 text-purple-700'});
      if(item.tags.includes('omega3')) displayTags.push({text: 'Omega-3', color: 'bg-teal-100 text-teal-700'});
      
      // Condition specific badges
      if(comorbidities.includes('diabetes') && item.tags.includes('gdm_safe')) displayTags.push({text: 'GDM Safe', color: 'bg-emerald-100 text-emerald-700 border-emerald-200'});
      if(stageKey === 'postpartum' && item.tags.includes('lactation')) displayTags.push({text: 'Milk Boost', color: 'bg-purple-100 text-purple-700'});
      
      return displayTags;
  };

  // -- GENERATE DAILY PLAN --
  // This selects items from the library based on the Template categories
  const generateMeal = (options: string[]) => {
      // This is a simplified mapper. In a real app, you'd map "Oats" to specific ID c9/c10.
      // Here we return the template strings but filtered by general logic guidelines
      return options.filter(opt => {
          if(dietType === 'vegetarian' && (opt.includes('Egg') || opt.includes('Chicken') || opt.includes('Fish'))) return false;
          if(settings.lactoseIntolerant && (opt.includes('Milk') || opt.includes('Paneer'))) return false;
          if(comorbidities.includes('diabetes') && (opt.includes('Sugar') || opt.includes('Banana') || opt.includes('White Rice'))) return false;
          return true;
      });
  };

  // -- LIBRARY SEARCH --
  const filteredLibrary = useMemo(() => {
      return FOOD_LIBRARY.filter(item => {
          if (!filterFood(item)) return false;
          if (!item.name.toLowerCase().includes(searchTerm.toLowerCase()) && !item.category.toLowerCase().includes(searchTerm.toLowerCase())) return false;
          return true;
      });
  }, [searchTerm, settings, comorbidities]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10">
      
      {/* Header Profile Summary */}
      <div className={`rounded-3xl p-6 text-white shadow-lg bg-gradient-to-r ${settings.status === 'planning' ? 'from-teal-500 to-emerald-600' : isPostpartum ? 'from-purple-600 to-indigo-600' : 'from-pink-600 to-rose-500'}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                      {settings.status === 'planning' ? <Heart /> : isPostpartum ? <Baby /> : <Apple />} 
                      {settings.status === 'planning' ? "Fertility & Conception Diet" : isPostpartum ? "Lactation & Recovery Diet" : `Trimester ${trimester} Diet Plan`}
                  </h2>
                  <div className="flex flex-wrap gap-2 mt-2 text-xs font-bold uppercase tracking-wide opacity-90">
                      <span className="bg-white/20 px-2 py-1 rounded">{dietType}</span>
                      <span className="bg-white/20 px-2 py-1 rounded">{bmiInfo.label} BMI</span>
                      {comorbidities.map(c => (
                          <span key={c} className="bg-red-500/40 px-2 py-1 rounded border border-white/20">{DIET_LOGIC.comorbidities[c as keyof typeof DIET_LOGIC.comorbidities]?.name}</span>
                      ))}
                  </div>
              </div>
              <div className="text-right">
                  <p className="text-sm font-medium opacity-80">Primary Focus</p>
                  <p className="text-lg font-bold">{stageInfo.focus}</p>
              </div>
          </div>
          
          <div className="mt-6 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="flex items-start gap-3">
                  <Info className="shrink-0 mt-1" size={18} />
                  <p className="text-sm leading-relaxed">{bmiInfo.advice} {stageInfo.note}</p>
              </div>
          </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 dark:bg-indigo-900/30 p-1 rounded-xl overflow-x-auto">
          {['plan', 'library', 'guide'].map((tab) => (
              <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white dark:bg-deep-card shadow text-pink-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                  {tab === 'plan' ? 'Daily Menu' : tab === 'library' ? 'Food Library (500+)' : 'Nutrition Guide'}
              </button>
          ))}
      </div>

      {/* --- TAB: MEAL PLAN --- */}
      {activeTab === 'plan' && (
          <div className="space-y-6">
              {Object.entries(MEAL_PLAN_TEMPLATES).map(([key, section]) => {
                  const items = generateMeal(section.options);
                  if(items.length === 0) return null; // Skip empty sections

                  let Icon = Sun;
                  if(key.includes('lunch')) Icon = Utensils;
                  if(key.includes('dinner')) Icon = Moon;
                  if(key.includes('snack')) Icon = Coffee;

                  return (
                      <div key={key} className="bg-white dark:bg-deep-card rounded-2xl shadow-sm border border-gray-100 dark:border-indigo-800 overflow-hidden">
                          <div className="bg-gray-50 dark:bg-indigo-900/30 p-4 flex items-center gap-3 border-b border-gray-100 dark:border-indigo-800">
                              <div className="p-2 bg-white dark:bg-deep-card rounded-full shadow-sm text-pink-500">
                                  <Icon size={18} />
                              </div>
                              <h3 className="font-bold text-gray-800 dark:text-white">{section.title}</h3>
                          </div>
                          <div className="p-4">
                              <ul className="space-y-3">
                                  {items.map((item, i) => (
                                      <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                                          <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                                          <span>{item}</span>
                                      </li>
                                  ))}
                              </ul>
                              {/* Dynamic Suggestion based on Logic */}
                              {key === 'early_morning' && trimester === 1 && settings.status === 'pregnant' && (
                                  <p className="mt-3 text-xs text-orange-500 bg-orange-50 dark:bg-orange-900/10 p-2 rounded flex items-center gap-2">
                                      <AlertTriangle size={12}/> Keep dry crackers/rusk by bedside for morning sickness.
                                  </p>
                              )}
                          </div>
                      </div>
                  );
              })}
          </div>
      )}

      {/* --- TAB: FOOD LIBRARY --- */}
      {activeTab === 'library' && (
          <div className="space-y-4">
              <div className="relative">
                  <input 
                      type="text" 
                      placeholder="Search 500+ Indian foods (e.g. 'Ragi', 'Dal', 'Paneer')..." 
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-indigo-700 bg-white dark:bg-indigo-950/50 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-pink-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>

              <div className="grid gap-3">
                  {filteredLibrary.length > 0 ? (
                      filteredLibrary.slice(0, 50).map((item) => {
                          const tags = getTagsForFood(item);
                          return (
                              <div key={item.id} className="bg-white dark:bg-deep-card p-4 rounded-xl border border-gray-100 dark:border-indigo-800 hover:shadow-md transition-shadow flex justify-between items-start gap-4">
                                  <div>
                                      <div className="flex items-center gap-2">
                                          <h4 className="font-bold text-gray-800 dark:text-white">{item.name}</h4>
                                          <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{item.category}</span>
                                      </div>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
                                      <div className="flex flex-wrap gap-2 mt-2">
                                          {tags.map((t, i) => (
                                              <span key={i} className={`text-[10px] font-bold px-2 py-0.5 rounded-full border border-transparent ${t.color}`}>
                                                  {t.text}
                                              </span>
                                          ))}
                                      </div>
                                  </div>
                                  {(item.category === 'Veg' || item.category === 'Fruit') && <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0" title="Veg"></div>}
                                  {item.category === 'NonVeg' && <div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0" title="Non-Veg"></div>}
                                  {item.category === 'Dairy' && <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2 shrink-0" title="Dairy"></div>}
                              </div>
                          );
                      })
                  ) : (
                      <div className="text-center py-10 text-gray-400">
                          <p>No foods found matching "{searchTerm}" for your diet settings.</p>
                          <p className="text-xs mt-1">Try changing filters or search for generic terms.</p>
                      </div>
                  )}
                  {filteredLibrary.length > 50 && (
                      <p className="text-center text-xs text-gray-400 mt-2">Showing top 50 of {filteredLibrary.length} matches.</p>
                  )}
              </div>
          </div>
      )}

      {/* --- TAB: GUIDE --- */}
      {activeTab === 'guide' && (
          <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30">
                  <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
                      <Star size={20} /> Nutritional Guidelines (ICMR-NIN India)
                  </h3>
                  <div className="space-y-4 text-sm text-blue-900 dark:text-blue-200">
                      <div>
                          <strong className="block mb-1">Calorie Intake:</strong>
                          <p>Pregnancy requires only +350 kcal in T2 and +450 kcal in T3. Lactation requires +600 kcal. Do not "eat for two" in volume, but in quality.</p>
                      </div>
                      <div>
                          <strong className="block mb-1">Protein:</strong>
                          <p>Aim for 60-70g daily. Essential for baby's tissue growth. Include Dal/Paneer/Egg in every meal.</p>
                      </div>
                      <div>
                          <strong className="block mb-1">Iron & Folic Acid:</strong>
                          <p>Crucial to prevent anemia. Pair Iron foods (Dates, Spinach) with Vitamin C (Lemon) for absorption. Avoid Tea/Coffee 1 hour before/after meals.</p>
                      </div>
                      <div>
                          <strong className="block mb-1">Calcium:</strong>
                          <p>1200mg/day. Milk, Curd, Ragi, Sesame seeds. Do not take Iron and Calcium supplements together (they block each other).</p>
                      </div>
                  </div>
              </div>

              {comorbidities.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-3xl border border-red-100 dark:border-red-900/30">
                      <h3 className="font-bold text-red-800 dark:text-red-300 mb-4 flex items-center gap-2">
                          <AlertTriangle size={20} /> Comorbidity Alerts
                      </h3>
                      <ul className="space-y-3">
                          {comorbidities.map(c => {
                              const logic = DIET_LOGIC.comorbidities[c as keyof typeof DIET_LOGIC.comorbidities];
                              if(!logic) return null;
                              return (
                                  <li key={c}>
                                      <strong className="text-red-700 dark:text-red-400 block">{logic.name}</strong>
                                      <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                                          Avoid: {logic.avoid.join(', ').replace(/_/g, ' ')}. <br/>
                                          Prioritize: {logic.prioritize.join(', ').replace(/_/g, ' ')}.
                                      </p>
                                  </li>
                              );
                          })}
                      </ul>
                  </div>
              )}
          </div>
      )}

    </div>
  );
};
