
export type DietType = 'vegetarian' | 'eggetarian' | 'non-vegetarian';
export type AppMode = 'planning' | 'pregnant' | 'postpartum';

export interface ObstetricHistory {
  gravida: number; // Total number of times pregnant
  para: number; // Total number of viable births (>24 weeks)
  abortions: number; // Total miscarriages/abortions
  abortionsT1: number; // 1st Trimester losses (<12 weeks)
  abortionsT2: number; // 2nd Trimester losses (12-24 weeks)
  living: number; // Living children
  lastBabyCongenitalDefect: boolean; // History of congenital anomalies
  lastBabyDefectDetails?: string; // e.g., "Neural Tube Defect", "Down Syndrome"
}

export interface UserSettings {
  id: string; // Unique Profile ID
  
  // Core
  name: string;
  status: AppMode; // New field replacing boolean flags conceptually
  
  // Cycle & Fertility (Shared by Planning/Pregnant)
  lmp: string | null; // Acts as the "Active" LMP for current calculations
  pregnancyLmp?: string | null; // Stored specifically for pregnancy mode
  periodLog: string[]; // History of period start dates (ISO strings) for planning mode
  intercourseLog?: string[]; // Dates where intercourse occurred
  
  cycleLength: number; // Default 28
  
  // Physical Stats
  age?: number; // Maternal Age (CRITICAL for Risk Assessment)
  heightCm?: number; // Maternal Height
  prePregnancyWeight?: number; // Weight
  maternalBloodGroup?: string; // e.g. A+, O-
  
  // Partner Stats
  paternalBloodGroup?: string; // e.g. B+, AB-
  paternalHeightCm?: number; // New: For baby height prediction

  // Medical History & Risk Factors
  obstetricHistory: ObstetricHistory; // New: Parity details
  comorbidities: string[]; // List of selected condition IDs
  dietaryPreference: DietType;
  lactoseIntolerant: boolean;
  
  // Postpartum Specifics
  isPostpartum: boolean; // Deprecated in favor of status, kept for legacy compatibility check
  babyName?: string;
  babyGender?: 'boy' | 'girl'; 
  birthDate?: string; 
  vaccinationsDone: string[]; 
  
  // Pre-Pregnancy Specifics
  preConceptionChecklist?: string[]; // IDs of completed tests
  folicAcidStreak?: number;
}

export interface ProfileMeta {
  id: string;
  name: string; // Mom's name or Baby's name identifier
  status: AppMode;
  babyName?: string;
  babyGender?: 'boy' | 'girl';
  birthDate?: string;
  lastActive: string; // ISO Date
}

export interface Vaccine {
  id: string;
  name: string;
  description: string;
  dueWeekStart: number; 
  dueWeekEnd: number;
  mandatory: boolean;
  type: 'maternal' | 'baby';
}

export interface PregnancyCalculations {
  edd: Date;
  currentWeek: number;
  currentDay: number; 
  totalDays: number;
  trimester: 1 | 2 | 3;
  month: number;
  progressPercent: number;
}

export interface FetalBiometry {
  crl?: string; // Crown Rump Length
  gs?: string;  // Gestational Sac
  bpd?: string; // Biparietal Diameter
  fl?: string;  // Femur Length
  ac?: string;  // Abdominal Circumference
  hc?: string;  // Head Circumference
  efw?: string; // Estimated Fetal Weight
  hr?: string;  // Heart Rate
}

export interface WeeklyInfo {
  week: number;
  babySize: string;
  babyWeight: string;
  babyLength: string;
  description: string;
  symptoms: string[];
  toDo: string[];
  notToDo: string[];
  dailyTips: string[]; // Array of 7 tips for the week
  biometry?: FetalBiometry;
}

export interface ScanSchedule {
  weekStart: number;
  weekEnd: number;
  name: string;
  description: string;
  mandatory: boolean;
  completed?: boolean;
}

export interface LabTest {
  id: string;
  name: string;
  description: string;
  weekStart: number;
  weekEnd: number;
  mandatory: boolean;
  condition?: string; // If specific to a comorbidity or blood group (e.g., 'thyroid', 'rh_negative')
  category: 'Routine' | 'Special' | 'Screening';
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string; 
  taken: boolean;
}

export interface MedicineEntry {
  category: string;
  safe: string[];
  caution: string[];
  avoid: string[];
  note: string;
}

export interface SafetyItem {
  id: string;
  name: string;
  category: 'Food' | 'Activity' | 'Beauty' | 'Household';
  status: 'Safe' | 'Caution' | 'Avoid';
  reason: string;
}

export interface ComorbidityGuide {
  id: string;
  name: string;
  tests: string[];
  frequency: string;
  monitoring: string[];
  alertSigns: string[];
}

export interface ReportAnalysis {
  id: string;
  date: string;
  type: 'USG' | 'Blood' | 'Lab';
  summary: string;
  warnings: string[];
  recommendations: string[];
  rawText: string;
}

export interface MedicineSafetyResult {
  status: 'Safe' | 'Caution' | 'Unsafe' | 'Unknown';
  description: string;
  alternatives?: string[];
}

export interface DietMeal {
  time: string;
  title: string;
  items: string[];
}

export interface TrimesterDiet {
  focus: string;
  nutrients: string[];
  meals: DietMeal[];
  remedies: string[];
  avoid: string[];
}

export interface KickSession {
  id: string;
  date: string; 
  startTime: string; 
  endTime: string | null; 
  count: number;
  durationSeconds: number;
}

export interface Contraction {
  id: string;
  startTime: string; 
  endTime: string | null; 
  durationSeconds: number;
  frequencySeconds: number | null; 
  intensity?: 'mild' | 'moderate' | 'strong';
}

// --- HEALTH TRACKER TYPES ---

export interface WeightLog {
  id: string;
  date: string;
  week: number;
  weight: number;
}

export interface BabyGrowthLog {
  id: string;
  date: string;
  weekAge: number;
  weight: number; 
  height: number; 
  headCirc: number; 
  waistCirc?: number; 
}

export interface BPLog {
  id: string;
  date: string;
  systolic: number;
  diastolic: number;
}

export interface GlucoseLog {
  id: string;
  date: string;
  type: 'fasting' | 'post_prandial' | 'random';
  value: number; 
}

export interface LabLog {
    id: string;
    date: string;
    value: number;
    unit: string;
    note?: string;
}

export enum TabView {
  DASHBOARD = 'dashboard',
  TIMELINE = 'timeline',
  REPORTS = 'reports',
  MEDICINES = 'medicines',
  DIET = 'diet',
  PROFILE = 'profile',
  VACCINATIONS = 'vaccinations',
  TOOLS = 'tools',
  HEALTH = 'health',
  PARTNER = 'partner'
}

// --- PLANNING MODE TYPES ---
export interface PreConceptionTask {
    id: string;
    label: string;
    category: 'medical' | 'lifestyle' | 'nutrition';
    description: string;
    priority: 'high' | 'medium';
}
