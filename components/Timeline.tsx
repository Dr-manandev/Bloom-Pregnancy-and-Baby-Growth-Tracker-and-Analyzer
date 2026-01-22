
import React from 'react';
import { SCAN_SCHEDULE, LAB_SCHEDULE } from '../constants';
import { PregnancyCalculations, UserSettings } from '../types';
import { CheckCircle2, Clock, CalendarDays, CalendarPlus, FlaskConical, Stethoscope } from 'lucide-react';

interface Props {
  calculations: PregnancyCalculations;
  settings?: UserSettings; // Made optional for backward compat but passed in App
}

export const Timeline: React.FC<Props> = ({ calculations, settings }) => {
  const { currentWeek, edd } = calculations;

  // Calculate LMP from EDD (Roughly EDD - 280 days)
  const lmp = new Date(edd);
  lmp.setDate(lmp.getDate() - 280);

  const getCalendarUrl = (scanName: string, description: string, weekStart: number, weekEnd: number) => {
    // Calculate start date
    const start = new Date(lmp);
    start.setDate(start.getDate() + (weekStart * 7));
    // Calculate end date (end of weekEnd)
    const end = new Date(lmp);
    end.setDate(end.getDate() + (weekEnd * 7));

    const formatDate = (date: Date) => {
        return date.toISOString().replace(/-|:|\.\d\d\d/g, "").slice(0, 8);
    };

    const title = encodeURIComponent(`Bloom Health: ${scanName}`);
    const details = encodeURIComponent(description);
    const dates = `${formatDate(start)}/${formatDate(end)}`;

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dates}`;
  };

  // Merge Scans and Lab Tests
  // 1. Filter Labs based on conditions
  const relevantLabs = LAB_SCHEDULE.filter(lab => {
      if (!lab.condition) return true; // Show routine tests
      
      // Check for Thyroid
      if (lab.condition === 'thyroid' && settings?.comorbidities.includes('thyroid')) return true;
      
      // Check for Anemia
      if (lab.condition === 'anemia' && settings?.comorbidities.includes('anemia')) return true;

      // Check for Rh Negative
      if (lab.condition === 'rh_negative') {
          return settings?.maternalBloodGroup && settings.maternalBloodGroup.includes('-');
      }

      return false;
  });

  // 2. Combine and Sort
  const combinedTimeline = [
      ...SCAN_SCHEDULE.map(s => ({ ...s, type: 'scan' })),
      ...relevantLabs.map(l => ({ ...l, type: 'lab' }))
  ].sort((a, b) => a.weekStart - b.weekStart);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Medical Timeline</h2>
      <p className="text-sm text-gray-500 mb-6">Complete schedule of Scans & Mandatory Lab Tests (Indian FOGSI Standards).</p>
      
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent dark:before:via-gray-700">
        
        {combinedTimeline.map((item, index) => {
          const isCompleted = currentWeek > item.weekEnd;
          const isCurrent = currentWeek >= item.weekStart && currentWeek <= item.weekEnd;
          const isUpcoming = currentWeek < item.weekStart;

          // @ts-ignore
          const isScan = item.type === 'scan';

          return (
            <div key={index} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group ${isUpcoming ? 'opacity-70' : ''}`}>
              
              {/* Dot on timeline */}
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow z-10 
                ${isCompleted ? 'bg-green-500 border-green-100 dark:border-green-900' : 
                  isCurrent ? 'bg-pink-600 border-pink-200 animate-pulse' : 'bg-gray-200 dark:bg-gray-700 border-gray-100 dark:border-gray-800'}`}>
                {isCompleted ? <CheckCircle2 className="w-5 h-5 text-white" /> : 
                 isCurrent ? <Clock className="w-5 h-5 text-white" /> :
                 <CalendarDays className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
              </div>

              {/* Content Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-deep-card p-6 rounded-2xl shadow-md border border-gray-200 dark:border-indigo-900/50 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${isScan ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                          {isScan ? <Stethoscope size={16} /> : <FlaskConical size={16} />}
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">{item.name}</h3>
                  </div>
                  {item.mandatory && (
                    <span className="shrink-0 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
                      Mandatory
                    </span>
                  )}
                </div>
                <p className="text-sm text-pink-600 dark:text-pink-400 font-medium mb-2">
                  Weeks {item.weekStart} - {item.weekEnd}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {item.description}
                </p>
                
                {isCurrent && (
                   <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900/30 font-medium">
                      <strong>Action Required:</strong> Schedule this {isScan ? 'scan' : 'test'} now.
                   </div>
                )}

                {/* Add to Calendar Button (Visible for Upcoming/Current) */}
                {!isCompleted && (
                    <a 
                        href={getCalendarUrl(item.name, item.description, item.weekStart, item.weekEnd)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-gray-100 dark:bg-indigo-900/50 hover:bg-gray-200 dark:hover:bg-indigo-900 text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors"
                    >
                        <CalendarPlus size={16} /> Add Reminder
                    </a>
                )}
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
};
