
import React, { useState } from 'react';
import { MALE_FERTILITY_DATA } from '../constants';
import { ShieldCheck, AlertTriangle, XCircle, Info, Apple, Activity, Heart, Pill, CheckCircle2 } from 'lucide-react';

export const MalePartnerHealth: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'meds' | 'lifestyle' | 'nutrition'>('lifestyle');

  const { meds, lifestyle, nutrition } = MALE_FERTILITY_DATA;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
            <Activity size={28} /> Male Fertility & Health Guide
        </h2>
        <p className="opacity-90">
            Sperm quality is 50% of the equation. Optimize male health for better conception chances.
            <br/><span className="text-xs opacity-75 mt-1 block">Based on WHO, FOGSI (India) & Urology Standards.</span>
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-white dark:bg-deep-card p-1 rounded-2xl border border-gray-200 dark:border-indigo-800 shadow-sm overflow-x-auto">
          <button
              onClick={() => setActiveSection('lifestyle')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeSection === 'lifestyle' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 shadow-sm' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-indigo-900/20'}`}
          >
              <Heart size={18} /> Lifestyle & Habits
          </button>
          <button
              onClick={() => setActiveSection('meds')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeSection === 'meds' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 shadow-sm' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-indigo-900/20'}`}
          >
              <Pill size={18} /> Meds to Avoid
          </button>
          <button
              onClick={() => setActiveSection('nutrition')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeSection === 'nutrition' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 shadow-sm' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-indigo-900/20'}`}
          >
              <Apple size={18} /> Superfoods
          </button>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
          
          {/* LIFESTYLE SECTION */}
          {activeSection === 'lifestyle' && (
              <div className="grid md:grid-cols-2 gap-6">
                  {/* Necessary Actions */}
                  <div className="bg-white dark:bg-deep-card p-6 rounded-3xl shadow-lg border border-red-100 dark:border-indigo-800">
                      <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
                          <XCircle /> Necessary to Stop
                      </h3>
                      <ul className="space-y-4">
                          {lifestyle.necessary.map((item, i) => (
                              <li key={i} className="flex items-start gap-3">
                                  <span className="mt-1 w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
                                  <div>
                                      <p className="font-bold text-gray-800 dark:text-white text-sm">{item.title}</p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.detail}</p>
                                  </div>
                              </li>
                          ))}
                      </ul>
                  </div>

                  {/* Good to Do */}
                  <div className="bg-white dark:bg-deep-card p-6 rounded-3xl shadow-lg border border-green-100 dark:border-indigo-800">
                      <h3 className="text-lg font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
                          <CheckCircle2 /> Good to Do
                      </h3>
                      <ul className="space-y-4">
                          {lifestyle.good_to_do.map((item, i) => (
                              <li key={i} className="flex items-start gap-3">
                                  <span className="mt-1 w-2 h-2 rounded-full bg-green-500 shrink-0"></span>
                                  <div>
                                      <p className="font-bold text-gray-800 dark:text-white text-sm">{item.title}</p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.detail}</p>
                                  </div>
                              </li>
                          ))}
                      </ul>
                  </div>

                  {/* Things to Avoid */}
                  <div className="md:col-span-2 bg-orange-50 dark:bg-orange-900/10 p-6 rounded-3xl border border-orange-100 dark:border-orange-900/30">
                      <h3 className="text-lg font-bold text-orange-700 dark:text-orange-400 mb-4 flex items-center gap-2">
                          <AlertTriangle /> Things to Avoid (Toxicants)
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                          {lifestyle.avoid.map((item, i) => (
                              <div key={i} className="bg-white dark:bg-black/20 p-3 rounded-xl border border-orange-200 dark:border-orange-900/30">
                                  <p className="font-bold text-gray-800 dark:text-white text-sm">{item.title}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.detail}</p>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}

          {/* MEDICINES SECTION */}
          {activeSection === 'meds' && (
              <div className="space-y-6">
                  <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-3xl border border-red-100 dark:border-red-900/30">
                      <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2">
                          <XCircle /> Strictly Avoid / Consult Doctor
                      </h3>
                      <p className="text-sm text-red-600 dark:text-red-300 mb-4">
                          These medications can significantly impair sperm production (spermatogenesis) or function. If the male partner is on these, consult a doctor for safer alternatives before trying to conceive.
                      </p>
                      <div className="grid md:grid-cols-2 gap-3">
                          {meds.avoid.map((m, i) => (
                              <div key={i} className="bg-white dark:bg-black/20 p-4 rounded-xl border border-red-200 dark:border-red-900/50">
                                  <p className="font-bold text-gray-900 dark:text-white">{m.name}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">{m.reason}</p>
                              </div>
                          ))}
                      </div>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/10 p-6 rounded-3xl border border-yellow-100 dark:border-yellow-900/30">
                      <h3 className="text-lg font-bold text-yellow-700 dark:text-yellow-400 mb-4 flex items-center gap-2">
                          <AlertTriangle /> Use with Caution
                      </h3>
                      <div className="grid md:grid-cols-2 gap-3">
                          {meds.caution.map((m, i) => (
                              <div key={i} className="bg-white dark:bg-black/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-900/50">
                                  <p className="font-bold text-gray-900 dark:text-white">{m.name}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">{m.reason}</p>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}

          {/* NUTRITION SECTION */}
          {activeSection === 'nutrition' && (
              <div className="bg-white dark:bg-deep-card p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-indigo-800">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                      <Apple className="text-green-600" /> Fertility Superfoods
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                      {nutrition.map((item, i) => (
                          <div key={i} className="p-4 bg-gray-50 dark:bg-indigo-900/10 rounded-2xl border border-gray-100 dark:border-indigo-900/30 flex gap-4 items-start">
                              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0 font-bold text-sm">
                                  {item.nutrient.substring(0,2)}
                              </div>
                              <div>
                                  <h4 className="font-bold text-gray-900 dark:text-white">{item.nutrient}</h4>
                                  <p className="text-sm text-green-700 dark:text-green-400 font-medium mb-1">{item.source}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.benefit}</p>
                              </div>
                          </div>
                      ))}
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm text-blue-800 dark:text-blue-200 border border-blue-100 dark:border-blue-900/30 flex items-start gap-3">
                      <Info className="shrink-0 mt-0.5" size={18} />
                      <p>
                          <strong>Supplement Tip:</strong> A standard multivitamin containing Zinc and Selenium is often sufficient. High-dose individual supplements should only be taken if prescribed.
                      </p>
                  </div>
              </div>
          )}

      </div>
    </div>
  );
};
