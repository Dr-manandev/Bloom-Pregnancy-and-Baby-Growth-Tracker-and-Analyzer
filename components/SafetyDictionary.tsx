
import React, { useState } from 'react';
import { SAFETY_ITEMS } from '../safetyDatabase';
import { Search, CheckCircle2, AlertTriangle, XCircle, Filter, Check, X, AlertOctagon } from 'lucide-react';
import { SafetyItem } from '../types';

export const SafetyDictionary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Food' | 'Beauty' | 'Activity' | 'Household'>('All');
  const [activeStatus, setActiveStatus] = useState<'All' | 'Safe' | 'Caution' | 'Avoid'>('All');

  const filteredItems = SAFETY_ITEMS.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesStatus = activeStatus === 'All' || item.status === activeStatus;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: SafetyItem['status']) => {
    switch(status) {
      case 'Safe': return 'border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-900/30';
      case 'Caution': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-900/30';
      case 'Avoid': return 'border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30';
    }
  };

  const getStatusIcon = (status: SafetyItem['status']) => {
    switch(status) {
      case 'Safe': return <CheckCircle2 className="text-green-600 dark:text-green-400" size={20} />;
      case 'Caution': return <AlertTriangle className="text-yellow-600 dark:text-yellow-400" size={20} />;
      case 'Avoid': return <XCircle className="text-red-600 dark:text-red-400" size={20} />;
    }
  };

  const categories = ['All', 'Food', 'Beauty', 'Activity', 'Household'];
  const statuses = ['All', 'Safe', 'Caution', 'Avoid'];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Search */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-3xl p-8 text-white shadow-lg">
         <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <CheckCircle2 /> Is It Safe?
         </h2>
         <p className="opacity-90 mb-6">Instantly check safety of 500+ foods, products, and activities.</p>
         
         <div className="relative">
            <input 
              type="text" 
              placeholder="Search e.g. 'Sushi', 'Retinol', 'Yoga'..." 
              className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 dark:text-white bg-white/95 dark:bg-black/40 backdrop-blur-sm border-none shadow-lg focus:ring-2 focus:ring-white/50 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
         </div>
      </div>

      <div className="flex flex-col gap-4">
          {/* Categories Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
             {categories.map(cat => (
                <button
                   key={cat}
                   onClick={() => setActiveCategory(cat as any)}
                   className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                      activeCategory === cat 
                        ? 'bg-teal-600 text-white shadow-md' 
                        : 'bg-white dark:bg-deep-card text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-indigo-900/30 border border-gray-200 dark:border-indigo-800'
                   }`}
                >
                   {cat}
                </button>
             ))}
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
             {statuses.map(status => {
                 let activeClass = 'bg-gray-800 text-white';
                 let inactiveClass = 'bg-white dark:bg-deep-card text-gray-600 border-gray-200 dark:border-indigo-800';
                 let icon = null;

                 if (status === 'Safe') {
                     activeClass = 'bg-green-600 text-white shadow-md';
                     icon = <Check size={14} className="mr-1" />;
                 } else if (status === 'Caution') {
                     activeClass = 'bg-yellow-500 text-white shadow-md';
                     icon = <AlertTriangle size={14} className="mr-1" />;
                 } else if (status === 'Avoid') {
                     activeClass = 'bg-red-600 text-white shadow-md';
                     icon = <AlertOctagon size={14} className="mr-1" />;
                 } else {
                     // All
                     activeClass = 'bg-indigo-600 text-white shadow-md';
                     icon = <Filter size={14} className="mr-1" />;
                 }

                 return (
                    <button
                       key={status}
                       onClick={() => setActiveStatus(status as any)}
                       className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center border ${
                          activeStatus === status ? activeClass : inactiveClass
                       }`}
                    >
                       {icon} {status}
                    </button>
                 );
             })}
          </div>
      </div>

      {/* Grid Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.length > 0 ? (
             filteredItems.map(item => (
                <div key={item.id} className={`p-4 rounded-2xl border transition-all hover:shadow-md ${getStatusColor(item.status)}`}>
                    <div className="flex items-start justify-between mb-2">
                       <h3 className="font-bold text-gray-900 dark:text-white">{item.name}</h3>
                       {getStatusIcon(item.status)}
                    </div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2 ${
                        item.status === 'Safe' ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200' :
                        item.status === 'Caution' ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200' :
                        'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
                    }`}>
                        {item.status}
                    </span>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
                       {item.reason}
                    </p>
                </div>
             ))
          ) : (
             <div className="col-span-full text-center py-12 text-gray-400">
                 <p>No items found matching "{searchTerm}" with current filters.</p>
                 <p className="text-sm mt-2">Try clearing filters or ask the AI assistant in Dashboard.</p>
             </div>
          )}
      </div>
    </div>
  );
};
