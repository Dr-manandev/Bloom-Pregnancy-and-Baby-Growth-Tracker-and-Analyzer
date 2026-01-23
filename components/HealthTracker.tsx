
import React, { useState, useEffect } from 'react';
import { UserSettings, WeightLog, BPLog, GlucoseLog, PregnancyCalculations, BabyGrowthLog, LabLog } from '../types';
import { WEIGHT_GAIN_GUIDELINES, BP_THRESHOLDS, GLUCOSE_THRESHOLDS, WHO_GROWTH_DATA, IAP_GROWTH_GUIDELINES, LAB_THRESHOLDS } from '../constants';
import { Button } from './Button';
import { Scale, Activity, HeartPulse, Droplet, Plus, Trash2, TrendingUp, AlertCircle, Baby, Ruler, Zap, Info, FileDown, X, Eye, ExternalLink, FileText, FlaskConical } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Props {
  settings: UserSettings;
  calculations: PregnancyCalculations;
}

export const HealthTracker: React.FC<Props> = ({ settings, calculations }) => {
  const isPostpartum = settings.isPostpartum;
  
  const [activeTab, setActiveTab] = useState<'weight' | 'vitals'>('weight'); // Re-using 'weight' for Baby Growth in Postpartum
  const [chartType, setChartType] = useState<'weight' | 'length'>('weight'); // Switch for WHO charts
  
  // -- States --
  // Maternal Weight
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [newWeight, setNewWeight] = useState('');
  
  // Baby Growth
  const [growthLogs, setGrowthLogs] = useState<BabyGrowthLog[]>([]);
  const [newGrowth, setNewGrowth] = useState({ weight: '', height: '', head: '', waist: '' });

  // Vitals
  const [bpLogs, setBpLogs] = useState<BPLog[]>([]);
  const [glucoseLogs, setGlucoseLogs] = useState<GlucoseLog[]>([]);
  
  // New Vitals
  const [tshLogs, setTshLogs] = useState<LabLog[]>([]);
  const [hbLogs, setHbLogs] = useState<LabLog[]>([]);
  const [hba1cLogs, setHba1cLogs] = useState<LabLog[]>([]);

  const [newBP, setNewBP] = useState({ sys: '', dia: '' });
  const [newGlucose, setNewGlucose] = useState({ type: 'fasting' as 'fasting' | 'post_prandial' | 'random', value: '' });
  const [newLab, setNewLab] = useState({ tsh: '', hb: '', hba1c: '' });

  // PDF Preview State
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  // Dynamic Storage Keys based on Mode
  const STORAGE_KEYS = {
      weight: isPostpartum ? 'bloom_pp_weight_logs' : 'bloom_weight_logs',
      bp: isPostpartum ? 'bloom_pp_bp_logs' : 'bloom_bp_logs',
      glucose: isPostpartum ? 'bloom_pp_glucose_logs' : 'bloom_glucose_logs',
      tsh: isPostpartum ? 'bloom_pp_tsh_logs' : 'bloom_tsh_logs',
      hb: isPostpartum ? 'bloom_pp_hb_logs' : 'bloom_hb_logs',
      hba1c: isPostpartum ? 'bloom_pp_hba1c_logs' : 'bloom_hba1c_logs',
      babyGrowth: 'bloom_baby_growth'
  };

  // Load Data
  useEffect(() => {
    const load = (key: string, setter: any) => {
        const saved = localStorage.getItem(key);
        if (saved) setter(JSON.parse(saved));
        else setter([]);
    };

    load(STORAGE_KEYS.weight, setWeightLogs);
    load(STORAGE_KEYS.bp, setBpLogs);
    load(STORAGE_KEYS.glucose, setGlucoseLogs);
    load(STORAGE_KEYS.tsh, setTshLogs);
    load(STORAGE_KEYS.hb, setHbLogs);
    load(STORAGE_KEYS.hba1c, setHba1cLogs);
    load(STORAGE_KEYS.babyGrowth, setGrowthLogs);
  }, [isPostpartum]); // Reload when switching modes

  // -- Helper Functions --

  const calculateBMI = (weight: number) => {
    if (settings.heightCm && weight) {
      const heightM = settings.heightCm / 100;
      return (weight / (heightM * heightM)).toFixed(1);
    }
    return "N/A";
  };

  const getLatestWeight = () => {
      if(weightLogs.length > 0) {
          return weightLogs[weightLogs.length - 1].weight;
      }
      return settings.prePregnancyWeight || 0;
  };

  const getWeightGuidelines = () => {
    const startWeight = settings.prePregnancyWeight || 60; // fallback
    const bmiVal = parseFloat(calculateBMI(startWeight));
    
    if (isNaN(bmiVal)) return WEIGHT_GAIN_GUIDELINES.normal;

    if (bmiVal < 18.5) return WEIGHT_GAIN_GUIDELINES.underweight;
    if (bmiVal >= 25 && bmiVal < 30) return WEIGHT_GAIN_GUIDELINES.overweight;
    if (bmiVal >= 30) return WEIGHT_GAIN_GUIDELINES.obese;
    return WEIGHT_GAIN_GUIDELINES.normal;
  };

  const getBabyAgeWeeks = () => {
      if (!settings.birthDate) return 0;
      const birth = new Date(settings.birthDate);
      const now = new Date();
      return Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 7));
  };

  const addWeightLog = () => {
    if (!newWeight) return;
    const log: WeightLog = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      week: calculations.currentWeek, // Or weeks postpartum
      weight: parseFloat(newWeight)
    };
    const updated = [...weightLogs, log].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setWeightLogs(updated);
    localStorage.setItem(STORAGE_KEYS.weight, JSON.stringify(updated));
    setNewWeight('');
  };

  const deleteWeightLog = (id: string) => {
      const updated = weightLogs.filter(w => w.id !== id);
      setWeightLogs(updated);
      localStorage.setItem(STORAGE_KEYS.weight, JSON.stringify(updated));
  };

  const addGrowthLog = () => {
      if(!newGrowth.weight) return;
      const log: BabyGrowthLog = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          weekAge: getBabyAgeWeeks(),
          weight: parseFloat(newGrowth.weight),
          height: parseFloat(newGrowth.height) || 0,
          headCirc: parseFloat(newGrowth.head) || 0,
          waistCirc: parseFloat(newGrowth.waist) || 0
      };
      const updated = [...growthLogs, log].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setGrowthLogs(updated);
      localStorage.setItem(STORAGE_KEYS.babyGrowth, JSON.stringify(updated));
      setNewGrowth({ weight: '', height: '', head: '', waist: '' });
  };

  const deleteGrowthLog = (id: string) => {
      const updated = growthLogs.filter(g => g.id !== id);
      setGrowthLogs(updated);
      localStorage.setItem(STORAGE_KEYS.babyGrowth, JSON.stringify(updated));
  };

  const addBP = () => {
    if (!newBP.sys || !newBP.dia) return;
    const log: BPLog = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      systolic: parseInt(newBP.sys),
      diastolic: parseInt(newBP.dia)
    };
    const updated = [log, ...bpLogs];
    setBpLogs(updated);
    localStorage.setItem(STORAGE_KEYS.bp, JSON.stringify(updated));
    setNewBP({ sys: '', dia: '' });
  };

  const addGlucose = () => {
    if (!newGlucose.value) return;
    const log: GlucoseLog = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: newGlucose.type,
      value: parseInt(newGlucose.value)
    };
    const updated = [log, ...glucoseLogs];
    setGlucoseLogs(updated);
    localStorage.setItem(STORAGE_KEYS.glucose, JSON.stringify(updated));
    setNewGlucose({ ...newGlucose, value: '' });
  };

  const addLabLog = (type: 'tsh' | 'hb' | 'hba1c') => {
      const val = newLab[type];
      if (!val) return;
      
      const log: LabLog = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          value: parseFloat(val),
          unit: type === 'tsh' ? 'mIU/L' : type === 'hb' ? 'g/dL' : '%'
      };

      let updated;
      if (type === 'tsh') { updated = [log, ...tshLogs]; setTshLogs(updated); localStorage.setItem(STORAGE_KEYS.tsh, JSON.stringify(updated)); }
      if (type === 'hb') { updated = [log, ...hbLogs]; setHbLogs(updated); localStorage.setItem(STORAGE_KEYS.hb, JSON.stringify(updated)); }
      if (type === 'hba1c') { updated = [log, ...hba1cLogs]; setHba1cLogs(updated); localStorage.setItem(STORAGE_KEYS.hba1c, JSON.stringify(updated)); }
      
      setNewLab({ ...newLab, [type]: '' });
  };

  const getBPStatus = (sys: number, dia: number) => {
    if (sys >= 140 || dia >= 90) return BP_THRESHOLDS.high;
    if (sys >= 130 || dia >= 80) return BP_THRESHOLDS.elevated;
    return BP_THRESHOLDS.normal;
  };

  const getGlucoseStatus = (type: string, val: number) => {
      if (type === 'fasting' && val > 95) return { label: 'High (>95)', color: 'text-red-600' };
      if (type === 'post_prandial' && val > 120) return { label: 'High (>120)', color: 'text-red-600' };
      if (type === 'random' && val > 140) return { label: 'High (>140)', color: 'text-red-600' };
      return { label: 'Normal', color: 'text-green-600' };
  };

  const getLabStatus = (type: 'tsh' | 'hb' | 'hba1c', val: number) => {
      if (type === 'tsh') {
          // FOGSI Guidelines
          const t1 = LAB_THRESHOLDS.tsh.pregnant_t1;
          const t2t3 = LAB_THRESHOLDS.tsh.pregnant_t2_t3;
          
          if (!settings.isPostpartum) {
              const trimester = calculations.trimester;
              if (trimester === 1) {
                  if (val < t1.min) return { label: 'Low', color: 'text-red-600' };
                  if (val > t1.max) return { label: 'High (>2.5)', color: 'text-red-600' };
              } else {
                  if (val < t2t3.min) return { label: 'Low', color: 'text-red-600' };
                  if (val > t2t3.max) return { label: 'High (>3.0)', color: 'text-red-600' };
              }
          }
          if (val > 4.0) return { label: 'Hypothyroid', color: 'text-red-600' };
      }

      if (type === 'hb') {
          const limit = settings.isPostpartum ? 10 : 11;
          if (val < 7) return { label: 'Severe Anemia', color: 'text-red-600 font-bold' };
          if (val < limit) return { label: 'Anemia', color: 'text-orange-600' };
      }

      if (type === 'hba1c') {
          const limit = settings.isPostpartum ? 5.7 : 6.0;
          if (val > limit) return { label: 'High', color: 'text-red-600' };
      }

      return { label: 'Normal', color: 'text-green-600' };
  };

  // --- PDF Logic ---

  const generatePdfDoc = () => {
    const doc = new jsPDF();
    const title = settings.isPostpartum ? 'Bloom: Postpartum & Baby Health Report' : 'Bloom: Maternal Health Report';
    
    // -- Header --
    doc.setFillColor(219, 39, 119); // Pink
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text(title, 14, 18);
    
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 25);

    // -- Patient Details Table --
    doc.setTextColor(0);
    doc.setFontSize(12);
    
    const latestWeight = getLatestWeight();
    const currentBMI = calculateBMI(latestWeight);
    const preBMI = settings.prePregnancyWeight ? calculateBMI(settings.prePregnancyWeight) : 'N/A';
    const obs = settings.obstetricHistory;

    const patientDetails = [
        ['Name', settings.name, 'Age', settings.age ? settings.age.toString() : 'N/A'],
        ['Height', settings.heightCm ? `${settings.heightCm} cm` : 'N/A', 'Blood Type', settings.maternalBloodGroup || 'N/A'],
        ['Pre-Pregnancy Weight', settings.prePregnancyWeight ? `${settings.prePregnancyWeight} kg` : 'N/A', 'Pre-BMI', preBMI],
        ['Current Weight', `${latestWeight} kg`, 'Current BMI', currentBMI],
        ['Obstetric History', `G${obs?.gravida} P${obs?.para} A${obs?.abortions} L${obs?.living}`, 'Risk Status', settings.age && settings.age > 35 ? 'High Risk (Age)' : 'Standard'],
        ['LMP', settings.lmp ? new Date(settings.lmp).toLocaleDateString() : 'N/A', 'EDD', calculations.edd.toLocaleDateString()],
        ['Current Status', isPostpartum ? 'Postpartum' : `${calculations.currentWeek} Weeks`, 'Trimester', isPostpartum ? 'N/A' : calculations.trimester.toString()]
    ];

    autoTable(doc, {
        startY: 35,
        head: [['Patient Details', '', '', '']],
        body: patientDetails,
        theme: 'grid',
        headStyles: { fillColor: [219, 39, 119], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: { 0: { fontStyle: 'bold', width: 40 }, 2: { fontStyle: 'bold', width: 40 } }
    });

    // @ts-ignore
    let yPos = doc.lastAutoTable.finalY + 15;

    // -- Maternal Weight --
    if (weightLogs.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(219, 39, 119);
      doc.text("Maternal Weight History", 14, yPos);
      yPos += 3;
      autoTable(doc, {
        startY: yPos,
        head: [['Date', isPostpartum ? 'Week' : 'Gest. Week', 'Weight (kg)']],
        body: weightLogs.map(l => [new Date(l.date).toLocaleDateString(), l.week, l.weight]),
        theme: 'striped',
        headStyles: { fillColor: [100, 100, 100] }
      });
      // @ts-ignore
      yPos = doc.lastAutoTable.finalY + 15;
    }

    // -- Baby Growth (If Postpartum) --
    if (isPostpartum && growthLogs.length > 0) {
      if(yPos > 250) { doc.addPage(); yPos = 20; }
      doc.setFontSize(14);
      doc.setTextColor(219, 39, 119);
      doc.text("Baby Growth Log", 14, yPos);
      yPos += 3;
      autoTable(doc, {
        startY: yPos,
        head: [['Date', 'Age (Weeks)', 'Weight (kg)', 'Length (cm)', 'Head Circ (cm)']],
        body: growthLogs.map(l => [
            new Date(l.date).toLocaleDateString(), 
            l.weekAge, 
            l.weight, 
            l.height || '-', 
            l.headCirc || '-'
        ]),
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] } // Blue for baby
      });
      // @ts-ignore
      yPos = doc.lastAutoTable.finalY + 15;
    }

    // -- BP --
    if (bpLogs.length > 0) {
        if(yPos > 250) { doc.addPage(); yPos = 20; }
        doc.setFontSize(14);
        doc.setTextColor(219, 39, 119);
        doc.text("Blood Pressure Readings", 14, yPos);
        yPos += 3;
        autoTable(doc, {
            startY: yPos,
            head: [['Date', 'Sys / Dia', 'Status']],
            body: bpLogs.map(l => {
                const status = getBPStatus(l.systolic, l.diastolic);
                return [new Date(l.date).toLocaleDateString(), `${l.systolic}/${l.diastolic}`, status.label];
            }),
            theme: 'striped',
            headStyles: { fillColor: [100, 100, 100] }
        });
        // @ts-ignore
        yPos = doc.lastAutoTable.finalY + 15;
    }

    // -- Glucose --
    if (glucoseLogs.length > 0) {
        if(yPos > 250) { doc.addPage(); yPos = 20; }
        doc.setFontSize(14);
        doc.setTextColor(219, 39, 119);
        doc.text("Blood Glucose Logs", 14, yPos);
        yPos += 3;
        autoTable(doc, {
            startY: yPos,
            head: [['Date', 'Type', 'Value (mg/dL)', 'Status']],
            body: glucoseLogs.map(l => {
                const status = getGlucoseStatus(l.type, l.value);
                return [new Date(l.date).toLocaleDateString(), l.type.toUpperCase().replace('_', ' '), l.value, status.label];
            }),
            theme: 'striped',
            headStyles: { fillColor: [100, 100, 100] }
        });
        // @ts-ignore
        yPos = doc.lastAutoTable.finalY + 15;
    }

    // -- New Vitals (TSH, Hb, HbA1c) --
    const labTables = [
        { title: "Thyroid (TSH) Logs", data: tshLogs, unit: 'mIU/L', type: 'tsh' },
        { title: "Hemoglobin (Hb) Logs", data: hbLogs, unit: 'g/dL', type: 'hb' },
        { title: "HbA1c Logs", data: hba1cLogs, unit: '%', type: 'hba1c' }
    ];

    labTables.forEach(lab => {
        if (lab.data.length > 0) {
            if(yPos > 250) { doc.addPage(); yPos = 20; }
            doc.setFontSize(14);
            doc.setTextColor(219, 39, 119);
            doc.text(lab.title, 14, yPos);
            yPos += 3;
            autoTable(doc, {
                startY: yPos,
                head: [['Date', `Value (${lab.unit})`, 'Status']],
                body: lab.data.map(l => {
                    const status = getLabStatus(lab.type as any, l.value);
                    return [new Date(l.date).toLocaleDateString(), l.value, status.label];
                }),
                theme: 'striped',
                headStyles: { fillColor: [100, 100, 100] }
            });
            // @ts-ignore
            yPos = doc.lastAutoTable.finalY + 15;
        }
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('Bloom App - Intelligent Pregnancy Tracker', 14, 290);
        doc.text(`Page ${i} of ${pageCount}`, 190, 290);
    }

    return doc;
  };

  const handlePreviewPdf = () => {
      try {
        const doc = generatePdfDoc();
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        setPdfPreviewUrl(url);
      } catch (e) {
        console.error("PDF Gen Error", e);
        alert("Could not generate PDF preview. Please try downloading directly.");
      }
  };

  const handleDownloadPdf = () => {
      const doc = generatePdfDoc();
      doc.save('bloom_health_report.pdf');
      setPdfPreviewUrl(null); // Close modal after download
  };

  // --- Render Charts ---

  const renderPregnancyWeightChart = () => {
    if (!settings.prePregnancyWeight) return <div className="text-center p-10 text-gray-400">Please set Pre-pregnancy weight in Profile to see the graph.</div>;
    
    const guideline = getWeightGuidelines();
    const startWeight = settings.prePregnancyWeight;
    const maxWeight = startWeight + guideline.max + 5; 
    const minWeight = startWeight - 2;
    const width = 100; const height = 60;
    const xScale = (week: number) => (week / 40) * width;
    const yScale = (w: number) => height - ((w - minWeight) / (maxWeight - minWeight)) * height;
    
    const pathMin = `M0,${yScale(startWeight)} L${xScale(12)},${yScale(startWeight + 1)} L${xScale(40)},${yScale(startWeight + guideline.min)}`;
    const pathMax = `M0,${yScale(startWeight)} L${xScale(12)},${yScale(startWeight + 2)} L${xScale(40)},${yScale(startWeight + guideline.max)}`;
    
    const sortedLogs = [...weightLogs].sort((a,b) => a.week - b.week);
    const userPoints = sortedLogs.map(l => `${xScale(l.week)},${yScale(l.weight)}`).join(' ');
    const userPath = userPoints ? `M${xScale(0)},${yScale(startWeight)} ${userPoints.length > 0 ? 'L' + userPoints : ''}` : '';

    return (
        <div className="relative w-full aspect-[16/9] bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
             <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                 <line x1="0" y1={height} x2={width} y2={height} stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />
                 <line x1="0" y1="0" x2="0" y2={height} stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />
                 
                 {/* Guideline Area */}
                 <path d={`${pathMax} L${xScale(40)},${yScale(startWeight + guideline.min)} L${xScale(12)},${yScale(startWeight + 1)} L0,${yScale(startWeight)} Z`} fill="rgba(16, 185, 129, 0.1)" stroke="none" />
                 <path d={pathMin} fill="none" stroke="#10b981" strokeWidth="0.5" strokeDasharray="2" opacity="0.5" />
                 <path d={pathMax} fill="none" stroke="#10b981" strokeWidth="0.5" strokeDasharray="2" opacity="0.5" />
                 
                 {userPath && <path d={userPath} fill="none" stroke="#db2777" strokeWidth="1" strokeLinecap="round" />}
                 {sortedLogs.map((l, i) => (
                     <circle key={i} cx={xScale(l.week)} cy={yScale(l.weight)} r="1" fill="#db2777" />
                 ))}
             </svg>
             <div className="flex justify-between text-xs text-gray-400 mt-2"><span>Week 0</span><span>Week 20</span><span>Week 40</span></div>
             <div className="flex gap-4 mt-2 justify-center text-xs">
                 <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-100 border border-green-500"></div> Recommended ({guideline.label})</div>
                 <div className="flex items-center gap-1"><div className="w-3 h-3 bg-pink-500 rounded-full"></div> You</div>
             </div>
        </div>
    );
  };

  const renderBabyGrowthChart = () => {
      const gender = settings.babyGender === 'boy' ? 'boys' : 'girls';
      const data = WHO_GROWTH_DATA[gender][chartType];
      
      const maxX = 52; // 1 year
      const minY = Math.min(...data.map((d: any) => d.sd2neg));
      const maxY = Math.max(...data.map((d: any) => d.sd2pos));
      
      const width = 100; const height = 60;
      
      const xScale = (week: number) => (week / maxX) * width;
      const yScale = (val: number) => height - ((val - minY) / (maxY - minY)) * height;

      // Create paths for Median and Bands
      let medianPath = "";
      let bandPathTop = "";
      let bandPathBottom = "";

      data.forEach((p: any, i: number) => {
          const x = xScale(p.week);
          medianPath += (i === 0 ? "M" : " L") + `${x},${yScale(p.median)}`;
          bandPathTop += (i === 0 ? "M" : " L") + `${x},${yScale(p.sd2pos)}`;
          bandPathBottom += (i === 0 ? "M" : " L") + `${x},${yScale(p.sd2neg)}`;
      });

      // Close the band shape
      // Reverse bottom path for closed polygon
      const bandShape = `${bandPathTop} L${xScale(data[data.length-1].week)},${yScale(data[data.length-1].sd2neg)} ` + 
                        data.slice().reverse().map((p: any) => `L${xScale(p.week)},${yScale(p.sd2neg)}`).join(' ') + " Z";

      // User Data Points
      const sortedLogs = [...growthLogs].sort((a,b) => a.weekAge - b.weekAge);
      let userPath = "";
      sortedLogs.forEach((l, i) => {
          const val = chartType === 'weight' ? l.weight : l.height;
          if (!val) return;
          const x = xScale(l.weekAge);
          const y = yScale(val);
          userPath += (i === 0 ? `M${x},${y}` : ` L${x},${y}`);
      });

      return (
        <div className="relative w-full aspect-[16/9] bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
             <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                 <line x1="0" y1={height} x2={width} y2={height} stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />
                 <line x1="0" y1="0" x2="0" y2={height} stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />
                 
                 {/* Normal Range Band (-2SD to +2SD) */}
                 <path d={bandShape} fill="rgba(34, 197, 94, 0.1)" stroke="none" />
                 
                 {/* Median Line */}
                 <path d={medianPath} fill="none" stroke="#22c55e" strokeWidth="0.5" strokeDasharray="2" />
                 <text x={width} y={yScale(data[data.length-1].median)} fontSize="2" fill="#22c55e" textAnchor="end" dy="-1">Median</text>
                 
                 {/* User Line */}
                 {userPath && <path d={userPath} fill="none" stroke="#3b82f6" strokeWidth="1" strokeLinecap="round" />}
                 {sortedLogs.map((l, i) => {
                     const val = chartType === 'weight' ? l.weight : l.height;
                     if (!val) return null;
                     return <circle key={i} cx={xScale(l.weekAge)} cy={yScale(val)} r="1" fill="#3b82f6" />;
                 })}
             </svg>
             <div className="flex justify-between text-xs text-gray-400 mt-2"><span>Birth</span><span>6m</span><span>1yr</span></div>
             <div className="mt-2 text-center text-xs text-gray-500">
                 <span className="inline-block w-3 h-3 bg-green-100 mr-1"></span> Normal Range (WHO -2SD to +2SD)
             </div>
        </div>
      );
  };

  const renderLabInput = (
      title: string, 
      field: 'tsh' | 'hb' | 'hba1c', 
      logs: LabLog[], 
      unit: string, 
      guideline: { label: string }
  ) => {
      return (
          <div className="bg-white dark:bg-deep-card p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-indigo-800">
              <h4 className="font-bold text-gray-800 dark:text-white mb-4 flex gap-2 items-center">
                  <FlaskConical size={18} className="text-teal-600" /> {title}
              </h4>
              
              {/* Quick Fill Button */}
              {logs.length > 0 && (
                <button 
                    onClick={() => setNewLab({ ...newLab, [field]: logs[0].value.toString() })}
                    className="mb-4 text-xs flex items-center gap-1 text-teal-600 bg-teal-50 dark:bg-teal-900/20 px-2 py-1 rounded hover:bg-teal-100"
                >
                    <Zap size={12} /> Quick Fill: {logs[0].value}
                </button>
              )}

              <p className="text-xs text-gray-500 mb-2 font-medium bg-gray-50 dark:bg-indigo-900/20 p-2 rounded">
                  Guide: {guideline.label}
              </p>
              
              <div className="flex flex-col gap-2 mb-4">
                  <input 
                      type="number" 
                      placeholder={`Value (${unit})`} 
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-indigo-700 bg-white dark:bg-indigo-950/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={newLab[field]}
                      onChange={(e) => setNewLab({...newLab, [field]: e.target.value})}
                  />
                  <Button onClick={() => addLabLog(field)} className="w-full">Add Log</Button>
              </div>
              
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                  {logs.map(log => {
                      const status = getLabStatus(field, log.value);
                      return (
                          <div key={log.id} className="p-2 bg-gray-50 dark:bg-indigo-900/10 rounded-lg flex justify-between items-center">
                              <div>
                                  <span className="font-bold text-gray-800 dark:text-white">{log.value} <span className="text-xs font-normal text-gray-500">{unit}</span></span>
                                  <div className="text-[10px] text-gray-400">{new Date(log.date).toLocaleDateString()}</div>
                              </div>
                              <span className={`text-xs font-bold ${status.color}`}>{status.label}</span>
                          </div>
                      );
                  })}
              </div>
          </div>
      );
  };

  // --- Main Render ---

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10 animate-fade-in w-full">
        
        {/* PDF Preview Modal */}
        {pdfPreviewUrl && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                <div className="bg-white dark:bg-deep-card w-full max-w-4xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-indigo-800">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <FileDown className="text-pink-600" /> Report Preview
                        </h3>
                        <div className="flex gap-2">
                            {/* Fallback button for external open on mobile */}
                            <button 
                                onClick={() => window.open(pdfPreviewUrl, '_blank')}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-indigo-900/50 rounded-full text-blue-600 transition-colors"
                                title="Open in New Tab"
                            >
                                <ExternalLink size={24} />
                            </button>
                            <button onClick={() => setPdfPreviewUrl(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-indigo-900/50 rounded-full transition-colors text-gray-500">
                                <X size={24} />
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-0 md:p-4 overflow-hidden relative">
                        {/* Use object tag which handles PDF embedding better than iframe in some contexts, and supports fallback content */}
                        <object 
                            data={pdfPreviewUrl} 
                            type="application/pdf" 
                            className="w-full h-full rounded-xl"
                        >
                            {/* Fallback content when PDF cannot be embedded (Mobile browsers) */}
                            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                <FileText size={48} className="text-gray-400 mb-4" />
                                <p className="text-gray-600 dark:text-gray-300 mb-2 font-bold text-lg">
                                    Preview not supported on this screen
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
                                    Your browser doesn't support embedding PDF files directly. You can download the report or open it in a new tab.
                                </p>
                                <div className="flex flex-col gap-3 w-full max-w-xs">
                                    <Button onClick={() => window.open(pdfPreviewUrl, '_blank')} variant="secondary">
                                        Open in New Tab
                                    </Button>
                                    <Button onClick={handleDownloadPdf}>
                                        Download PDF Directly
                                    </Button>
                                </div>
                            </div>
                        </object>
                    </div>
                    <div className="p-4 border-t border-gray-100 dark:border-indigo-800 flex justify-end gap-4 bg-white dark:bg-deep-card">
                        <Button variant="secondary" onClick={() => setPdfPreviewUrl(null)}>Close</Button>
                        <Button onClick={handleDownloadPdf}>
                            <FileDown size={18} /> Download PDF
                        </Button>
                    </div>
                </div>
            </div>
        )}

        {/* Header with Report Button */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
            <div className="flex flex-wrap gap-2 p-1 bg-gray-100 dark:bg-indigo-950/50 rounded-xl w-full md:w-fit justify-center md:justify-start">
                <button 
                    onClick={() => setActiveTab('weight')}
                    className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-lg text-sm font-bold transition-all flex justify-center items-center gap-2 ${activeTab === 'weight' ? 'bg-white dark:bg-deep-card shadow text-pink-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    {isPostpartum ? <Baby size={18} /> : <Scale size={18} />} 
                    <span className="whitespace-nowrap">{isPostpartum ? "Baby Growth" : "Weight"}</span>
                </button>
                <button 
                    onClick={() => setActiveTab('vitals')}
                    className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-lg text-sm font-bold transition-all flex justify-center items-center gap-2 ${activeTab === 'vitals' ? 'bg-white dark:bg-deep-card shadow text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    <Activity size={18} /> 
                    <span className="whitespace-nowrap">{isPostpartum ? "Mom's Health" : "Vitals & Labs"}</span>
                </button>
            </div>
            
            <Button onClick={handlePreviewPdf} variant="secondary" className="w-full md:w-auto text-xs md:text-sm">
                <Eye size={16} /> Preview Report
            </Button>
        </div>

        {/* --- POSTPARTUM VIEW --- */}
        {isPostpartum ? (
            activeTab === 'weight' ? (
                // Baby Growth Tab
                <div className="space-y-6">
                    <div className={`bg-gradient-to-r ${settings.babyGender === 'boy' ? 'from-blue-500 to-cyan-500' : 'from-rose-400 to-pink-500'} rounded-3xl p-6 text-white shadow-lg`}>
                        <h3 className="text-xl font-bold flex items-center gap-2"><Ruler /> Baby Growth Tracker</h3>
                        <p className="opacity-90 text-sm">Monitoring against WHO Standards ({settings.babyGender === 'boy' ? 'Boy' : 'Girl'})</p>
                    </div>

                    {/* Chart Type Toggle */}
                    <div className="flex justify-center mb-2">
                        <div className="flex bg-gray-100 dark:bg-indigo-900/50 p-1 rounded-lg">
                            <button 
                                onClick={() => setChartType('weight')}
                                className={`px-4 py-1 rounded-md text-xs font-bold transition-all ${chartType === 'weight' ? 'bg-white dark:bg-deep-card shadow text-blue-600' : 'text-gray-500'}`}
                            >
                                Weight
                            </button>
                            <button 
                                onClick={() => setChartType('length')}
                                className={`px-4 py-1 rounded-md text-xs font-bold transition-all ${chartType === 'length' ? 'bg-white dark:bg-deep-card shadow text-blue-600' : 'text-gray-500'}`}
                            >
                                Length
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-deep-card p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-indigo-800">
                        {renderBabyGrowthChart()}
                    </div>

                    {/* IAP Guidelines */}
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                        <h4 className="font-bold text-blue-800 dark:text-blue-300 text-sm flex items-center gap-2 mb-2">
                            <Info size={16} /> Indian Academy of Pediatrics (IAP) Guidelines
                        </h4>
                        <ul className="space-y-1 text-xs text-blue-700 dark:text-blue-400">
                            {chartType === 'weight' 
                                ? IAP_GROWTH_GUIDELINES.weight.map((t, i) => <li key={i}>• {t}</li>)
                                : IAP_GROWTH_GUIDELINES.length.map((t, i) => <li key={i}>• {t}</li>)
                            }
                        </ul>
                    </div>

                    <div className="bg-white dark:bg-deep-card p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-indigo-800">
                        <h4 className="font-bold text-gray-800 dark:text-white mb-4">Log Baby Measurements</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Weight (kg)</label>
                                <input type="number" className="w-full px-4 py-2 border border-gray-200 dark:border-indigo-700 rounded-xl bg-white dark:bg-indigo-950/50 text-gray-900 dark:text-white" value={newGrowth.weight} onChange={e => setNewGrowth({...newGrowth, weight: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Length (cm)</label>
                                <input type="number" className="w-full px-4 py-2 border border-gray-200 dark:border-indigo-700 rounded-xl bg-white dark:bg-indigo-950/50 text-gray-900 dark:text-white" value={newGrowth.height} onChange={e => setNewGrowth({...newGrowth, height: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Head Circ. (cm)</label>
                                <input type="number" className="w-full px-4 py-2 border border-gray-200 dark:border-indigo-700 rounded-xl bg-white dark:bg-indigo-950/50 text-gray-900 dark:text-white" value={newGrowth.head} onChange={e => setNewGrowth({...newGrowth, head: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Waist Circ. (cm)</label>
                                <input type="number" className="w-full px-4 py-2 border border-gray-200 dark:border-indigo-700 rounded-xl bg-white dark:bg-indigo-950/50 text-gray-900 dark:text-white" value={newGrowth.waist} onChange={e => setNewGrowth({...newGrowth, waist: e.target.value})} />
                            </div>
                        </div>
                        <Button onClick={addGrowthLog} className="w-full">Save Log</Button>

                        <div className="mt-6 space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {growthLogs.slice().reverse().map((log) => (
                                <div key={log.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-indigo-900/10 rounded-xl">
                                    <div>
                                        <span className="font-bold text-gray-800 dark:text-white">{log.weight} kg</span>
                                        <span className="text-xs text-gray-500 ml-2">
                                            Week {log.weekAge} • {log.height}cm • HC {log.headCirc}cm
                                            {log.waistCirc ? ` • WC ${log.waistCirc}cm` : ''}
                                        </span>
                                    </div>
                                    <button onClick={() => deleteGrowthLog(log.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                // Postpartum Mom Health (Re-using logic but different context)
                <div className="space-y-6">
                     <div className="bg-white dark:bg-deep-card p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-indigo-800">
                        <h4 className="font-bold text-gray-800 dark:text-white mb-4">Maternal Weight Recovery</h4>
                        <p className="text-sm text-gray-500 mb-4">Track your return to pre-pregnancy weight. Safe loss is approx 0.5kg/week.</p>
                        <div className="flex gap-4">
                            <input 
                                type="number" 
                                placeholder="Current Weight (kg)" 
                                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-indigo-700 bg-white dark:bg-indigo-950/50 text-gray-900 dark:text-white"
                                value={newWeight}
                                onChange={(e) => setNewWeight(e.target.value)}
                            />
                            <Button onClick={addWeightLog} disabled={!newWeight}>Log</Button>
                        </div>
                        <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                            {weightLogs.slice().reverse().map((log) => (
                                <div key={log.id} className="flex justify-between p-3 bg-gray-50 dark:bg-indigo-900/10 rounded-xl">
                                    <span className="text-gray-800 dark:text-white font-bold">{log.weight} kg</span>
                                    <span className="text-xs text-gray-500">{new Date(log.date).toLocaleDateString()}</span>
                                </div>
                            ))}
                        </div>
                     </div>
                     
                     <div className="grid md:grid-cols-1 gap-6">
                        {renderLabInput("Thyroid (TSH)", "tsh", tshLogs, "mIU/L", settings.status === 'pregnant' ? LAB_THRESHOLDS.tsh.pregnant_t1 : LAB_THRESHOLDS.tsh.general)}
                        {renderLabInput("Hemoglobin (Hb)", "hb", hbLogs, "g/dL", LAB_THRESHOLDS.hemoglobin.postpartum)}
                        {renderLabInput("HbA1c", "hba1c", hba1cLogs, "%", LAB_THRESHOLDS.hba1c.general)}
                     </div>
                </div>
            )
        ) : (
            // --- PREGNANCY VIEW ---
            activeTab === 'weight' ? (
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl p-6 text-white shadow-lg">
                        <h3 className="text-xl font-bold flex items-center gap-2"><TrendingUp /> Weight Gain Analysis</h3>
                        <p className="opacity-90 text-sm">Target: {getWeightGuidelines().label} ({getWeightGuidelines().min}-{getWeightGuidelines().max} kg)</p>
                        <div className="mt-4 flex gap-4 text-sm font-medium">
                            <div className="bg-white/20 px-3 py-1 rounded-lg">Pre-Pregnancy: {settings.prePregnancyWeight || '?'} kg</div>
                            <div className="bg-white/20 px-3 py-1 rounded-lg">Current Week: {calculations.currentWeek}</div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-deep-card p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-indigo-800">
                        {renderPregnancyWeightChart()}
                    </div>

                    <div className="bg-white dark:bg-deep-card p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-indigo-800">
                        <h4 className="font-bold text-gray-800 dark:text-white mb-4">Log Weight</h4>
                        <div className="flex gap-4">
                            <input 
                                type="number" 
                                placeholder="Current Weight (kg)" 
                                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-indigo-700 bg-white dark:bg-indigo-950/50 text-gray-900 dark:text-white"
                                value={newWeight}
                                onChange={(e) => setNewWeight(e.target.value)}
                            />
                            <Button onClick={addWeightLog} disabled={!newWeight}>Add Log</Button>
                        </div>

                        <div className="mt-6 space-y-2">
                            {weightLogs.slice().reverse().map((log) => (
                                <div key={log.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-indigo-900/10 rounded-xl">
                                    <div>
                                        <span className="font-bold text-gray-800 dark:text-white">{log.weight} kg</span>
                                        <span className="text-xs text-gray-500 ml-2">Week {log.week} • {new Date(log.date).toLocaleDateString()}</span>
                                    </div>
                                    <button onClick={() => deleteWeightLog(log.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Blood Pressure */}
                        <div className="bg-white dark:bg-deep-card p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-indigo-800">
                            <h4 className="font-bold text-blue-700 dark:text-blue-400 mb-4 flex items-center gap-2">
                                <HeartPulse /> Blood Pressure
                            </h4>
                            {bpLogs.length > 0 && (
                                <button 
                                    onClick={() => setNewBP({ sys: bpLogs[0].systolic.toString(), dia: bpLogs[0].diastolic.toString() })}
                                    className="mb-4 text-xs flex items-center gap-1 text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded hover:bg-blue-100"
                                >
                                    <Zap size={12} /> Quick Fill: {bpLogs[0].systolic}/{bpLogs[0].diastolic}
                                </button>
                             )}
                            <div className="flex gap-2 mb-4">
                                <input type="number" placeholder="Sys" className="w-1/3 px-3 py-2 rounded-lg border border-gray-200 dark:border-indigo-700 bg-white dark:bg-indigo-950/50 text-gray-900 dark:text-white" value={newBP.sys} onChange={e => setNewBP({...newBP, sys: e.target.value})} />
                                <span className="self-center text-gray-400">/</span>
                                <input type="number" placeholder="Dia" className="w-1/3 px-3 py-2 rounded-lg border border-gray-200 dark:border-indigo-700 bg-white dark:bg-indigo-950/50 text-gray-900 dark:text-white" value={newBP.dia} onChange={e => setNewBP({...newBP, dia: e.target.value})} />
                                <Button onClick={addBP} className="flex-1"><Plus size={18} /></Button>
                            </div>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                                {bpLogs.map(log => {
                                    const status = getBPStatus(log.systolic, log.diastolic);
                                    return (
                                        <div key={log.id} className="p-3 bg-gray-50 dark:bg-indigo-900/10 rounded-xl border border-gray-100 dark:border-indigo-900/30">
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-lg text-gray-800 dark:text-white">{log.systolic}/{log.diastolic}</span>
                                                <span className={`text-xs font-bold ${status.color}`}>{status.label}</span>
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">{new Date(log.date).toLocaleDateString()}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Glucose */}
                        <div className="bg-white dark:bg-deep-card p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-indigo-800">
                            <h4 className="font-bold text-purple-700 dark:text-purple-400 mb-4 flex items-center gap-2">
                                <Droplet /> Blood Glucose
                            </h4>
                            {glucoseLogs.length > 0 && (
                                <button 
                                    onClick={() => setNewGlucose({ ...newGlucose, value: glucoseLogs[0].value.toString() })}
                                    className="mb-4 text-xs flex items-center gap-1 text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded hover:bg-purple-100"
                                >
                                    <Zap size={12} /> Quick Fill: {glucoseLogs[0].value}
                                </button>
                             )}
                            <div className="flex flex-col gap-2 mb-4">
                                <div className="flex gap-2">
                                    <select 
                                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-indigo-700 bg-white dark:bg-indigo-950/50 text-gray-900 dark:text-white text-sm"
                                        value={newGlucose.type}
                                        onChange={(e) => setNewGlucose({...newGlucose, type: e.target.value as any})}
                                    >
                                        <option value="fasting">Fasting</option>
                                        <option value="post_prandial">PP (2hr)</option>
                                        <option value="random">Random</option>
                                    </select>
                                    <input 
                                        type="number" 
                                        placeholder="mg/dL" 
                                        className="w-1/3 px-3 py-2 rounded-lg border border-gray-200 dark:border-indigo-700 bg-white dark:bg-indigo-950/50 text-gray-900 dark:text-white" 
                                        value={newGlucose.value} 
                                        onChange={e => setNewGlucose({...newGlucose, value: e.target.value})} 
                                    />
                                </div>
                                <Button onClick={addGlucose} className="w-full">Add Log</Button>
                            </div>
                            
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                                {glucoseLogs.map(log => {
                                    const status = getGlucoseStatus(log.type, log.value);
                                    return (
                                        <div key={log.id} className="p-3 bg-gray-50 dark:bg-indigo-900/10 rounded-xl border border-gray-100 dark:border-indigo-900/30">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <span className="font-bold text-lg text-gray-800 dark:text-white">{log.value}</span>
                                                    <span className="text-xs text-gray-500 ml-1">mg/dL</span>
                                                </div>
                                                <span className={`text-xs font-bold ${status.color}`}>{status.label}</span>
                                            </div>
                                            <div className="flex justify-between mt-1 text-xs text-gray-400">
                                                <span className="capitalize">{log.type.replace('_', ' ')}</span>
                                                <span>{new Date(log.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-1 gap-6">
                        {renderLabInput("Thyroid (TSH)", "tsh", tshLogs, "mIU/L", calculations.trimester === 1 ? LAB_THRESHOLDS.tsh.pregnant_t1 : LAB_THRESHOLDS.tsh.pregnant_t2_t3)}
                        {renderLabInput("Hemoglobin (Hb)", "hb", hbLogs, "g/dL", LAB_THRESHOLDS.hemoglobin.pregnant)}
                        {renderLabInput("HbA1c", "hba1c", hba1cLogs, "%", LAB_THRESHOLDS.hba1c.pregnant)}
                    </div>

                    <div className="md:col-span-2 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-100 dark:border-yellow-900/30 flex items-start gap-3">
                        <AlertCircle className="text-yellow-600 shrink-0 mt-0.5" />
                        <div className="text-sm text-yellow-800 dark:text-yellow-300">
                            <strong>Medical Standard Disclaimer:</strong> Thresholds are based on FOGSI (India) guidelines for GDM, Hypertension, Anemia, and Hypothyroidism. 
                            Red indicators require immediate consultation with your gynecologist.
                        </div>
                    </div>
                </div>
            )
        )}
    </div>
  );
};
