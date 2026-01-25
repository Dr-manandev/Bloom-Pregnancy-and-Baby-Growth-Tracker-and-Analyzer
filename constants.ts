
import { ScanSchedule, WeeklyInfo, MedicineEntry, ComorbidityGuide, TrimesterDiet, DietType, Vaccine, PreConceptionTask, LabTest, DietMeal } from './types';

export const DEFAULT_CYCLE = 28;

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// --- RISK FACTOR GUIDELINES (FOGSI / WHO) ---
export const MATERNAL_AGE_RISKS = {
    teenage: {
        label: "Young Maternal Age (<18)",
        riskLevel: "Moderate-High",
        concerns: ["Anemia", "Pre-eclampsia", "Preterm Labor", "Low Birth Weight"],
        action: "Focus on Iron/Calcium supplementation and fetal growth monitoring."
    },
    advanced: {
        label: "Advanced Maternal Age (>35)",
        riskLevel: "High",
        concerns: ["Chromosomal Abnormalities (Down Syndrome)", "Gestational Diabetes (GDM)", "Hypertension", "Placenta Previa"],
        action: "Mandatory NT Scan, Dual/Quad Marker, or NIPT. Early GTT recommended."
    }
};

export const OBSTETRIC_HISTORY_RISKS = {
    recurrent_t1: {
        label: "Recurrent T1 Loss",
        riskLevel: "High",
        action: "Requires genetic counseling (Karyotyping) and Thrombophilia profile (APLA). Progesterone support may be needed."
    },
    t2_loss: {
        label: "History of T2 Loss",
        riskLevel: "High",
        action: "Rule out Cervical Incompetence. Discuss Cervical Cerclage (Stitch) at 12-14 weeks with your doctor."
    },
    prev_anomaly: {
        label: "Previous Congenital Anomaly",
        riskLevel: "High",
        action: "High Dose Folic Acid (5mg) is MANDATORY starting 3 months pre-conception. Detailed Level 2 Scan essential."
    }
};

export const PRE_CONCEPTION_CHECKLIST: PreConceptionTask[] = [
    {
        id: "pc_rubella",
        label: "Rubella (German Measles) Immunity",
        category: "medical",
        description: "Check IgG levels. If non-immune, take MMR vaccine and wait 1 month before conceiving to prevent congenital defects.",
        priority: "high"
    },
    {
        id: "pc_thalassemia",
        label: "Thalassemia Screening",
        category: "medical",
        description: "Hb Electrophoresis test. Vital in India. If both parents are Minor carriers, baby has 25% risk of Major.",
        priority: "high"
    },
    {
        id: "pc_thyroid",
        label: "Thyroid Profile (TSH)",
        category: "medical",
        description: "High TSH can cause infertility and miscarriage. Target TSH < 2.5 mIU/L.",
        priority: "high"
    },
    {
        id: "pc_folic",
        label: "Start Folic Acid",
        category: "nutrition",
        description: "Start 3 months before conception. 400mcg for low risk, 5mg if history of Neural Tube Defects.",
        priority: "high"
    },
    {
        id: "pc_dentist",
        label: "Dental Checkup",
        category: "medical",
        description: "Treat gum disease now. Poor dental health is linked to preterm labor.",
        priority: "medium"
    },
    {
        id: "pc_vitd",
        label: "Vitamin D & B12 Levels",
        category: "nutrition",
        description: "Deficiencies are common in India and affect egg quality.",
        priority: "medium"
    },
    {
        id: "pc_hba1c",
        label: "HbA1c (Sugar Test)",
        category: "medical",
        description: "Rule out pre-diabetes or undiagnosed diabetes before pregnancy.",
        priority: "high"
    }
];

// --- SPECIFIC PRE-CONCEPTION COMORBIDITY GUIDELINES (FOGSI/WHO) ---
export const PRE_CONCEPTION_COMORBIDITY_GUIDELINES: Record<string, { title: string; target: string; tests: string[]; action: string; risk: string }> = {
    thyroid: {
        title: "Hypothyroidism Planning",
        target: "TSH < 2.5 mIU/L",
        tests: ["TSH", "Free T4", "Anti-TPO Antibodies"],
        action: "Adjust Thyroxine dosage 4-6 weeks BEFORE conception. A TSH > 2.5 increases risk of miscarriage and lower IQ in the baby.",
        risk: "Untreated thyroid issues cause ovulation problems and fetal brain development issues."
    },
    diabetes: {
        title: "Diabetes / Pre-Diabetes Planning",
        target: "HbA1c < 6.0% (Ideal) or < 6.5%",
        tests: ["HbA1c", "Fasting Glucose", "Retina Check", "Kidney Function"],
        action: "Strict sugar control 3 months prior is non-negotiable. High sugar during the first 8 weeks causes heart/spine defects.",
        risk: "Congenital anomalies (birth defects) occur in the first trimester if sugar is high."
    },
    hypertension: {
        title: "Hypertension (BP) Planning",
        target: "BP < 140/90 mmHg on Safe Meds",
        tests: ["ECG", "Kidney Function Test"],
        action: "Review meds with Cardiologist. STOP ACE Inhibitors/ARBs (Telmisartan/Enalapril) immediately as they damage fetal kidneys. Switch to Labetalol/Methyldopa.",
        risk: "Preeclampsia risk and Fetal Growth Restriction."
    },
    anemia: {
        title: "Anemia Correction",
        target: "Hemoglobin > 12 g/dL & Ferritin > 30",
        tests: ["CBC", "Serum Ferritin", "Peripheral Smear"],
        action: "Start therapeutic Iron (100mg elemental iron) + Folic Acid. Deworming (Albendazole) may be needed.",
        risk: "Low birth weight, preterm delivery, and maternal fatigue/cardiac load."
    },
    pcos: {
        title: "PCOS Management",
        target: "Regular Ovulation",
        tests: ["Fasting Insulin", "LH/FSH Ratio", "Testosterone"],
        action: "Weight loss of 5-10% can restore spontaneous ovulation. Metformin or Inositol supplements may be prescribed.",
        risk: "Difficulty conceiving and higher risk of GDM during pregnancy."
    }
};

// --- DAILY TIPS & DID YOU KNOW LIBRARY (INDIAN CONTEXT) ---
export const TIP_LIBRARY = {
    planning: [
        "Folic Acid isn't just for moms. Men should take Zinc and Vitamin C to improve sperm quality.",
        "A TSH level above 2.5 mIU/L can make it harder to conceive. Get a thyroid profile done if you have irregular periods.",
        "Egg white cervical mucus (slippery, stretchy) indicates peak fertility. It helps sperm swim to the egg.",
        "Avoid using lubricants not labeled 'fertility-friendly' as they can inhibit sperm movement.",
        "If you are overweight (BMI > 25), losing just 5% of body weight can restart ovulation in PCOS cases.",
        "Dental health matters! Gum disease (Gingivitis) is linked to higher risk of preterm birth later.",
        "Rubella immunity is vital. If your IgG is negative, get the MMR vaccine and wait 1 month before trying.",
        "Caffeine limit: 200mg/day (approx 2 small cups of chai/coffee). Excess caffeine can delay conception.",
        "Stop Retinol/Vitamin A creams now. They are teratogenic (cause birth defects). Switch to Glycolic Acid.",
        "Thalassemia screening is a must for Indian couples. If both are minors, the baby has a 25% risk of major.",
        "Stress raises cortisol, which can disrupt the pituitary gland and delay ovulation. Try Yoga Nidra.",
        "Avoid hot baths or saunas during the fertile window. High scrotal temp reduces sperm count.",
        "Having sex every day isn't necessary. Every alternate day during the fertile window is optimal for sperm count.",
        "Vitamin D deficiency is rampant in India. Low levels are linked to lower IVF success and fertility.",
        "Start a prenatal multivitamin now, not after the positive test. The neural tube closes by week 6.",
        "Track your Basal Body Temperature (BBT). A spike of 0.5°F confirms ovulation has occurred.",
        "Avoid painkillers like Ibuprofen/Combiflam during the Two Week Wait; they can interfere with implantation.",
        "Eating a heavy breakfast helps regulate hormones in PCOS patients.",
        "Men should avoid keeping laptops on their laps to prevent heat damage to sperm.",
        "Hydration improves cervical mucus quality. Drink 3L water daily.",
        "Check for Vitamin B12 deficiency if you are strictly vegetarian/vegan.",
        "Normal Hb for conception should ideally be > 12 g/dL to prevent anemia during pregnancy.",
        "Inositol supplements (Myo-Inositol) are proven to help egg quality in PCOS.",
        "Avoid raw papaya and pineapple in the Two Week Wait (traditional precaution against uterine contractions).",
        "Keep your phone away from the bedside while sleeping to improve sleep quality (melatonin helps eggs).",
        "Smoking (even passive) damages egg DNA and speeds up ovarian aging.",
        "Protein intake is key. Indian vegetarian diets are often low in protein. Add Paneer, Dal, Soya, or Greek Yogurt.",
        "Lying down for 15 mins after intercourse may help sperm retention (though not medically strictly proven, it helps).",
        "Check for Vitamin B12 deficiency if you are strictly vegetarian/vegan.",
        "If you have irregular cycles (<21 or >35 days), don't rely on apps alone. Use ovulation kits (LH strips)."
    ],
    pregnancy: [
        "Left lateral sleeping improves blood flow to the placenta and baby. Use a pillow between legs.",
        "Iron and Calcium supplements should be taken at different times. Calcium blocks Iron absorption.",
        "Take Iron pills with Lemon water (Vitamin C) for 3x better absorption.",
        "Tea/Coffee/Milk contain tannins/calcium that block Iron. Gap of 2 hours required.",
        "Fetal movements: You should feel at least 10 movements in 2 hours after a meal (after 28 weeks).",
        "Swelling in feet is normal, but swelling in face/hands with headache is a sign of Preeclampsia.",
        "Bleeding gums are common due to hormonal changes. Use a soft brush and warm saline gargles.",
        "Avoid lying flat on your back after 20 weeks to prevent Vena Cava compression (dizziness).",
        "Itching on palms and soles? Could be Cholestasis (Liver issue). Tell your doctor immediately.",
        "Heartburn? Eat small, frequent meals and avoid lying down immediately after eating.",
        "Leg cramps at night? You might need Magnesium or Calcium. Stretch your toes upwards.",
        "Coconut water is great for amniotic fluid levels and electrolytes.",
        "Avoid heavy lifting or high-impact cardio. Walking 30 mins daily is the best exercise.",
        "GTT (Glucose Tolerance Test) at 24-28 weeks is mandatory in India due to high Asian risk of diabetes.",
        "Tetanus (TT/Td) and Flu shots are safe and necessary. Tdap is given at 27-36 weeks.",
        "Constipation is common due to Progesterone. Eat heavy fiber (Oats, Daliya) and drink water.",
        "Braxton Hicks contractions are painless tightening. Real labor pains get stronger and regular.",
        "If your water breaks, it may not be a gush. It can be a slow trickle. Go to the hospital.",
        "Do not eat for 2 people. You only need ~300 extra calories (1 roti + 1 bowl dal) in T2/T3.",
        "Travel is usually safe until 36 weeks. Wear seatbelt below the belly, not across it.",
        "Hair dyes? Wait until the second trimester and use ammonia-free options.",
        "Skin pigmentation (Linea Nigra/Melasma) is normal and usually fades after delivery.",
        "Avoid hot tubs or very hot showers. Raising core body temp >102°F is dangerous for the baby.",
        "Keep your 'Mamta Card' or medical file handy at all times.",
        "Pelvic floor exercises (Kegels) now will help in easier delivery and faster recovery.",
        "Avoid raw sprouts and unpasteurized juices to prevent food-borne infections.",
        "Shortness of breath is normal as uterus pushes diaphragm. Stand straight and raise arms to breathe.",
        "Vaginal discharge increases in pregnancy. If it smells bad or causes itching, check for infection.",
        "Stem Cell Banking decision should be made by the 7th month.",
        "Pack your hospital bag by Week 36. Don't forget newborn clothes and sanitary pads."
    ],
    postpartum: [
        "Breastfeeding burns ~500 calories/day. Eat nutrient-dense foods, not just 'Ghee' laden foods.",
        "Lochia (bleeding) can last 4-6 weeks. It changes from Red -> Pink -> White.",
        "Exclusive breastfeeding for 6 months means NO water, honey, or ghutti for the baby.",
        "Baby's stomach is size of a cherry at birth. They need frequent, small feeds.",
        "Postpartum Blues (crying, mood swings) are normal for 2 weeks. If it lasts longer, it's PPD.",
        "Massage for mom is great, but avoid abdominal massage if you had a C-Section until healed.",
        "Wait 6 weeks (and doctor's clearance) before resuming vigorous exercise.",
        "Calcium and Iron supplements should continue for at least 3-6 months postpartum.",
        "Ajwain water and Jeera water are excellent traditional galactogogues (milk boosters).",
        "Don't ignore back pain. Your core is weak. Lift the baby by bending knees, not waist.",
        "Hair loss 3-4 months postpartum is normal (Telogen Effluvium). It will grow back.",
        "Contraception is needed even if breastfeeding. You can get pregnant before your first period returns.",
        "Vaccinations: The 6-week immunization is painful. Fever is normal. Give paracetamol as prescribed.",
        "Tummy time is essential for baby's neck strength. Start with 1-2 mins daily.",
        "Avoid using 'Kajal' in baby's eyes. It can cause lead poisoning or blocked tear ducts.",
        "Mustard oil massage is traditional but ensure it's not adulterated. Coconut oil is safer for sensitive skin.",
        "Baby Acne is normal due to maternal hormones. Do not scrub. It goes away.",
        "Cluster feeding (baby wanting to eat constantly) is normal during growth spurts (3w, 6w, 3m).",
        "Drink water every time you sit to nurse. Hydration keeps supply up.",
        "C-Section scar care: Keep it dry. Report any oozing, redness, or fever immediately.",
        "Formula fed babies need sterilized bottles. Discard leftover milk after 1 hour.",
        "Gripe water is generally not recommended by pediatricians today. Try burping and cycling legs.",
        "Baby's poop color changes. Mustard yellow (BF) is normal. White, Red, or Black needs a doctor.",
        "Don't shake the baby. Neck muscles are weak and it can cause brain injury.",
        "Sunlight exposure for baby (indirect, early morning) helps reduce mild jaundice.",
        "Umbilical cord stump falls off in 1-2 weeks. Keep it clean and dry. No oil/powder on it.",
        "Swaddling helps baby sleep but stop once they show signs of rolling over.",
        "Use saline drops for baby's blocked nose. Do not use Vicks/rub on infants < 2 years.",
        "Trust your instinct. If baby seems lethargic or refuses feed, seek help."
    ]
};

export const DID_YOU_KNOW_DATA = {
    planning: [
        { title: "Sperm Lifecycle", text: "Sperm takes about 64-72 days to generate. Lifestyle changes men make today impact sperm 3 months from now." },
        { title: "Egg Quality", text: "Females are born with all their eggs. They age as you age. CoQ10 supplements can help mitochondrial energy in older eggs." },
        { title: "Lubricant Myth", text: "Saliva and standard lube can kill sperm. Use oil (Canola/Baby oil) or specialized fertility lubricants." },
        { title: "The 20% Rule", text: "Even perfectly healthy young couples only have a ~20% chance of conceiving each month. Patience is key." },
        { title: "Cervical Position", text: "During ovulation, your cervix moves higher, becomes softer (like lips), and opens slightly." }
    ],
    pregnancy: [
        { title: "Amniotic Fluid", text: "By the second half of pregnancy, most amniotic fluid is actually the baby's sterile urine!" },
        { title: "Blood Volume", text: "Your blood volume increases by 50% during pregnancy to supply the placenta. This causes the 'glow' (and bleeding gums)." },
        { title: "Fingerprints", text: "Your baby develops unique fingerprints by week 13-17." },
        { title: "Hearing", text: "Babies can hear outside sounds by week 24. They will recognize Mom's and Dad's voices at birth." },
        { title: "Relaxin Hormone", text: "Your body produces 'Relaxin' to loosen joints for birth. This also makes you clumsy and prone to sprains." }
    ],
    postpartum: [
        { title: "Newborn Stomach", text: "On Day 1, baby's stomach is the size of a marble (5-7ml). That's why they need Colostrum, not volume." },
        { title: "Vision", text: "Newborns can only see 8-12 inches away—perfect distance to your face while feeding." },
        { title: "Recognition", text: "Babies recognize their mother by scent within days of birth, before they can clearly see her." },
        { title: "Sleep Cycles", text: "Newborn sleep cycles are only 45-50 mins (adults are 90 mins). This is why they wake up so often." },
        { title: "Growth Spurts", text: "Babies often 'cluster feed' (eat constantly) before a growth spurt to increase mom's milk supply." }
    ]
};

// --- VACCINATION SCHEDULES ---
export const MATERNAL_VACCINES: Vaccine[] = [
  { id: "mat_tt1", name: "TT-1 / Td-1 (Tetanus)", description: "First dose. Administer as soon as pregnancy is confirmed.", dueWeekStart: 4, dueWeekEnd: 12, mandatory: true, type: 'maternal' },
  { id: "mat_tt2", name: "TT-2 / Td-2", description: "4 weeks after TT-1. Protection against Tetanus.", dueWeekStart: 12, dueWeekEnd: 16, mandatory: true, type: 'maternal' },
  { id: "mat_flu", name: "Influenza (Flu Shot)", description: "Recommended if pregnancy overlaps with flu season (Oct-Jan). Safe in any trimester.", dueWeekStart: 4, dueWeekEnd: 40, mandatory: false, type: 'maternal' },
  { id: "mat_tdap", name: "Tdap (Tetanus, Diphtheria, Pertussis)", description: "CRITICAL: Provides Whooping Cough immunity to the newborn. Replaces one TT dose.", dueWeekStart: 27, dueWeekEnd: 36, mandatory: true, type: 'maternal' }
];

export const BABY_VACCINES: Vaccine[] = [
  { id: "baby_birth_bcg", name: "BCG (Tuberculosis)", description: "At Birth. Left Upper Arm.", dueWeekStart: 0, dueWeekEnd: 1, mandatory: true, type: 'baby' },
  { id: "baby_birth_opv0", name: "OPV-0 (Polio)", description: "At Birth. Oral Drops.", dueWeekStart: 0, dueWeekEnd: 1, mandatory: true, type: 'baby' },
  { id: "baby_birth_hepb0", name: "Hep-B 0 (Hepatitis B)", description: "At Birth (within 24 hrs). Thigh.", dueWeekStart: 0, dueWeekEnd: 1, mandatory: true, type: 'baby' },
  { id: "baby_6w_combo", name: "6 Weeks Immunization", description: "DTwP-1, IPV-1, Hep-B-1, Hib-1, Rotavirus-1, PCV-1.", dueWeekStart: 6, dueWeekEnd: 7, mandatory: true, type: 'baby' },
  { id: "baby_10w_combo", name: "10 Weeks Immunization", description: "DTwP-2, IPV-2, Hib-2, Rotavirus-2, PCV-2.", dueWeekStart: 10, dueWeekEnd: 11, mandatory: true, type: 'baby' },
  { id: "baby_14w_combo", name: "14 Weeks Immunization", description: "DTwP-3, IPV-3, Hep-B-2, Hib-3, Rotavirus-3, PCV-3.", dueWeekStart: 14, dueWeekEnd: 15, mandatory: true, type: 'baby' },
  { id: "baby_6m_flu", name: "Influenza Dose 1", description: "6 Months completed.", dueWeekStart: 26, dueWeekEnd: 28, mandatory: false, type: 'baby' }
];

export const SCAN_SCHEDULE: ScanSchedule[] = [
  { weekStart: 6, weekEnd: 9, name: "Viability / Dating Scan", description: "Confirms pregnancy, number of embryos, and heartbeat.", mandatory: true },
  { weekStart: 11, weekEnd: 13, name: "NT Scan (Nuchal Translucency)", description: "Screens for chromosomal abnormalities (Down syndrome).", mandatory: true },
  { weekStart: 18, weekEnd: 22, name: "Anomaly Scan (Level II)", description: "Detailed scan to check structural development of the baby.", mandatory: true },
  { weekStart: 24, weekEnd: 28, name: "Glucose Tolerance Test (GTT)", description: "Screening for Gestational Diabetes.", mandatory: true },
  { weekStart: 28, weekEnd: 32, name: "Growth Scan / Color Doppler", description: "Checks baby's growth, amniotic fluid, and blood flow.", mandatory: false },
  { weekStart: 36, weekEnd: 40, name: "Term Scan", description: "Checks position of baby and fluid levels before labor.", mandatory: false }
];

export const LAB_SCHEDULE: LabTest[] = [
  { id: "lab_booking_profile", name: "Antenatal Profile (Booking Visit)", category: "Routine", description: "CBC, Blood Group & Rh, TSH, VDRL, HIV, HbsAg, HCV, Urine Routine/Microscopy. Testing for Thalassemia (HPLC) if not done previously.", weekStart: 4, weekEnd: 12, mandatory: true },
  { id: "lab_dual_marker", name: "Dual Marker Test (Double Marker)", category: "Screening", description: "Maternal serum biochemistry test for chromosomal abnormalities (Down Syndrome). Usually done with NT Scan.", weekStart: 11, weekEnd: 13, mandatory: true },
  { id: "lab_quad_marker", name: "Quadruple Marker", category: "Screening", description: "Screening for Down Syndrome if Dual Marker was missed or indicated high risk.", weekStart: 15, weekEnd: 20, mandatory: false },
  { id: "lab_gtt", name: "Glucose Tolerance Test (75g)", category: "Routine", description: "DIPSI Guidelines: 75g oral glucose load, non-fasting. Single value test after 2 hours. Mandatory for all Indian women due to high ethnicity risk.", weekStart: 24, weekEnd: 28, mandatory: true },
  { id: "lab_cbc_urine_t2", name: "CBC & Urine Routine", category: "Routine", description: "Re-check Hemoglobin for anemia (dilutional) and asymptomatic bacteriuria (UTI prevention).", weekStart: 24, weekEnd: 28, mandatory: true },
  { id: "lab_cbc_urine_t3", name: "Pre-Delivery Profile", category: "Routine", description: "CBC, Urine Routine, Coagulation Profile (PT/INR), Viral Markers repeat (if needed).", weekStart: 36, weekEnd: 38, mandatory: true },
  { id: "lab_tsh_monthly", name: "Thyroid Profile (TSH)", category: "Special", description: "Monitor TSH levels every 4-6 weeks to adjust Thyroxine dosage. Vital for fetal brain development.", weekStart: 4, weekEnd: 40, mandatory: true, condition: "thyroid" },
  { id: "lab_ict", name: "Indirect Coombs Test (ICT)", category: "Special", description: "For Rh Negative mothers (e.g. A-ve, O-ve). Checks for antibody formation against Rh+ baby.", weekStart: 28, weekEnd: 28, mandatory: true, condition: "rh_negative" },
  { id: "lab_anemia_hb", name: "Hemoglobin Check (Monthly)", category: "Special", description: "Frequent monitoring for Anemic mothers. Target Hb > 11 g/dL.", weekStart: 12, weekEnd: 36, mandatory: true, condition: "anemia" }
];

export const BABY_MILESTONES = [
  { ageRange: "0-3 Months", items: [{ id: "m_smile", label: "Social Smile (Smiles at people)", age: "6-8 Weeks" }, { id: "m_neck", label: "Neck Holding (Holds head steady)", age: "3 Months" }, { id: "m_eye", label: "Follows objects with eyes", age: "2 Months" }, { id: "m_coo", label: "Coos and gurgles", age: "2-3 Months" }] },
  { ageRange: "4-6 Months", items: [{ id: "m_roll", label: "Rolls over (Tummy to back)", age: "4-6 Months" }, { id: "m_laugh", label: "Laughs out loud", age: "4 Months" }, { id: "m_reach", label: "Reaches for objects (Grasp)", age: "5 Months" }, { id: "m_sit_sup", label: "Sits with support", age: "6 Months" }] },
  { ageRange: "7-9 Months", items: [{ id: "m_sit_no_sup", label: "Sits without support", age: "8 Months" }, { id: "m_crawl", label: "Crawling (Creeping)", age: "9 Months" }, { id: "m_pincer", label: "Pincer Grasp (Thumb-Index finger)", age: "9 Months" }, { id: "m_babble", label: "Babbles (Ma-ma, Da-da nonspecific)", age: "8-9 Months" }] },
  { ageRange: "10-12 Months", items: [{ id: "m_stand_sup", label: "Stands with support", age: "10 Months" }, { id: "m_wave", label: "Waves Bye-Bye", age: "10-12 Months" }, { id: "m_cruise", label: "Cruising (Walks holding furniture)", age: "11 Months" }, { id: "m_talk", label: "Says Mama/Dada specifically", age: "12 Months" }, { id: "m_stand", label: "Stands alone momentarily", age: "12 Months" }] }
];

export const COMORBIDITY_GUIDELINES: Record<string, ComorbidityGuide> = {
  anemia: { id: 'anemia', name: 'Anemia (Low Hemoglobin)', tests: ['Complete Blood Count (CBC)', 'Serum Ferritin', 'Iron Studies'], frequency: 'Monthly (Target Hb > 11 g/dL)', monitoring: ['Take Iron supplements with Vitamin C.', 'Avoid Iron with Calcium/Milk.'], alertSigns: ['Extreme fatigue', 'Palpitations', 'Shortness of breath', 'Dizziness'] },
  hypertension: { id: 'hypertension', name: 'Hypertension / High BP', tests: ['Urine Albumin/Protein', 'Kidney Function Test (KFT)', 'Liver Function Test (LFT)'], frequency: 'Home BP Monitoring: Daily | Lab Tests: Monthly', monitoring: ['Maintain BP < 140/90 mmHg.', 'Rest on your left side.', 'Low salt diet (< 5g/day).'], alertSigns: ['Severe headache', 'Blurred vision/Spots before eyes', 'Sudden swelling', 'Upper abdominal pain'] },
  thyroid: { id: 'thyroid', name: 'Hypothyroidism', tests: ['TSH', 'Free T4'], frequency: 'Every 4-6 Weeks', monitoring: ['Take Thyroxine empty stomach early morning.', 'Wait 45-60 mins before eating.', 'Target TSH: 1st Trim < 2.5, 2nd/3rd Trim < 3.0.'], alertSigns: ['Excessive weight gain', 'Extreme lethargy', 'Cold intolerance', 'Constipation'] },
  diabetes: { id: 'diabetes', name: 'Diabetes / GDM', tests: ['Fasting Blood Sugar', 'PP Blood Sugar (2hr)', 'HbA1c', 'Fetal Growth Scans'], frequency: 'Sugar Logs: Daily (Fasting & PP) | HbA1c: Trimesterly', monitoring: ['Targets: Fasting < 95, 1hr PP < 140, 2hr PP < 120.', 'Strict diet control.', 'Post-meal walks.'], alertSigns: ['Reduced fetal movement', 'Excessive thirst/urination', 'Dizziness (Hypoglycemia)', 'Large baby size'] }
};

export const WEIGHT_GAIN_GUIDELINES = { underweight: { min: 13, max: 18, label: "Underweight (BMI < 18.5)" }, normal: { min: 11, max: 16, label: "Normal (BMI 18.5 - 24.9)" }, overweight: { min: 7, max: 11, label: "Overweight (BMI 25 - 29.9)" }, obese: { min: 5, max: 9, label: "Obese (BMI > 30)" } };
export const BP_THRESHOLDS = { normal: { sys: 120, dia: 80, label: "Normal", color: "text-green-600" }, elevated: { sys: 130, dia: 85, label: "Elevated", color: "text-yellow-600" }, high: { sys: 140, dia: 90, label: "Hypertension (Consult Doctor)", color: "text-red-600" } };
export const GLUCOSE_THRESHOLDS = { fasting: { max: 95, label: "Normal Fasting < 95 mg/dL" }, post_prandial: { max: 120, label: "Normal 2hr PP < 120 mg/dL" }, random: { max: 140, label: "Normal Random < 140 mg/dL" } };
export const LAB_THRESHOLDS = { tsh: { pregnant_t1: { min: 0.1, max: 2.5, label: "Trimester 1 Target: 0.1 - 2.5 mIU/L" }, pregnant_t2_t3: { min: 0.2, max: 3.0, label: "Trimester 2/3 Target: 0.2 - 3.0 mIU/L" }, general: { min: 0.4, max: 4.0, label: "Normal Range: 0.4 - 4.0 mIU/L" } }, hemoglobin: { pregnant: { min: 11, label: "Target > 11 g/dL (Anemia if < 11)" }, postpartum: { min: 10, label: "Target > 10 g/dL" }, general: { min: 12, label: "Target > 12 g/dL" }, severe: 7 }, hba1c: { pregnant: { max: 6.0, label: "Target < 6.0% (Strict Control)" }, general: { max: 5.7, label: "Normal < 5.7% (Pre-diabetes 5.7-6.4)" } } };

export const FALLBACK_WEEKLY_INFO: WeeklyInfo = { week: 0, babySize: "Unknown", babyWeight: "-", babyLength: "-", description: "Information for this week is loading or unavailable.", symptoms: [], toDo: [], notToDo: [] };
export const WEEKLY_DATA: Record<number, WeeklyInfo> = {
  1: { week: 1, babySize: "Poppy Seed", babyWeight: "< 1g", babyLength: "< 1mm", description: "You are not actually pregnant yet! This week is your period.", symptoms: ["Cramps", "Fatigue", "Mood Swings"], toDo: ["Start taking Folic Acid (400mcg)", "Avoid Alcohol and Smoking"], notToDo: ["X-Rays without protection", "Self-medication"] },
  2: { week: 2, babySize: "Poppy Seed", babyWeight: "< 1g", babyLength: "< 1mm", description: "Ovulation happens around the end of this week. This is your fertile window.", symptoms: ["Increased Libido", "Cervical Mucus Changes"], toDo: ["Time intercourse", "Maintain healthy diet"], notToDo: ["Stress", "High Caffeine"] },
  40: { week: 40, babySize: "Watermelon", babyWeight: "3.5 kg", babyLength: "51 cm", description: "Your baby is fully grown and ready to meet you!", symptoms: ["Contractions", "Back pain", "Water breaking"], toDo: ["Pack hospital bag", "Track movements"], notToDo: ["Heavy lifting", "Travel far from hospital"] }
};
export const DAILY_TIPS: Record<string, string> = { "default": "Stay hydrated and rest well.", "1": "Start taking prenatal vitamins now.", "2": "Track your ovulation signs.", "40": "Relax and practice breathing exercises." };

// --- COMPREHENSIVE MEDICINE DATABASE (FOGSI / IAP / FDA STANDARDS) ---
// Key 0: Planning, 1-3: Trimesters, 4: Postpartum/Lactation
export const MEDICINE_DATABASE: Record<number, MedicineEntry[]> = {
  0: [ // Planning / Pre-Conception
      { category: "Vitamins & Supplements", safe: ["Folic Acid 5mg/400mcg (Folvite)", "Vitamin D3 (Uprise-D3/Calcirol)", "Vitamin B12 (Methylcobalamin)", "Zinc", "CoQ10 (Ubiquinol)", "Omega-3 (Fish Oil)", "Vitamin E (Evion)", "Calcium Citrate", "Inositol (Myo-Inositol - PCOS)"], caution: ["Vitamin C > 1000mg"], avoid: ["Vitamin A (Retinol > 10,000 IU)", "Unverified Herbal Supplements"], note: "Folic Acid is mandatory 3 months prior to conception." },
      { category: "Diabetes / Blood Sugar", safe: ["Insulin (Human/Analog)", "Metformin (Glycomet/Gluconorm) - Safe for PCOS"], caution: ["Glibenclamide", "Glimepiride"], avoid: ["SGLT2 Inhibitors (Dapagliflozin)", "GLP-1 Agonists (Semaglutide)", "Pioglitazone"], note: "Switch to Insulin or Metformin before conceiving." },
      { category: "Hypertension / BP", safe: ["Labetalol (Labebet)", "Methyldopa (Aldomet)", "Nifedipine (Nicardia)"], caution: ["Amlodipine"], avoid: ["ACE Inhibitors (Enalapril/Ramipril)", "ARBs (Telmisartan/Losartan)", "Diuretics (Lasix) - Avoid if possible"], note: "ACE Inhibitors cause fetal kidney damage. Switch immediately." },
      { category: "Thyroid Management", safe: ["Levothyroxine (Thyronorm/Eltroxin)"], caution: ["Propylthiouracil (PTU) - Used for Hyperthyroid"], avoid: ["Radioactive Iodine"], note: "TSH Target < 2.5 mIU/L for conception." },
      { category: "Pain & Fever", safe: ["Paracetamol (Dolo/Calpol/Crocin)"], caution: ["Ibuprofen (Advil/Brufen) - May delay ovulation", "Diclofenac", "Aspirin (Low Dose 75mg is safe if prescribed)"], avoid: ["Tramadol", "Strong Opioids", "Cox-2 Inhibitors (Etoricoxib)"], note: "Avoid NSAIDs during fertile window." },
      { category: "Acidity & GI", safe: ["Antacids (Digene/Gelusil)", "Pantoprazole (Pan-D)", "Omeprazole", "Ranitidine (Rantac)", "Psyllium Husk (Isabgol)"], caution: ["Loperamide (Imodium)"], avoid: ["Castor Oil"], note: "Treat H.Pylori if present." },
      { category: "Allergy & Cold", safe: ["Cetirizine (Cetzine)", "Loratadine", "Saline Nasal Drops (Nasivion S)", "Steam Inhalation", "Montelukast"], caution: ["Diphenhydramine (Benadryl)"], avoid: ["Pseudoephedrine (Sudafed)", "Phenylephrine (oral)"], note: "Control allergies to reduce inflammation." },
      { category: "Infections / Antibiotics", safe: ["Amoxicillin (Mox)", "Azithromycin (Azithral)", "Cephalexin", "Nitrofurantoin (UTI)"], caution: ["Ciprofloxacin"], avoid: ["Tetracycline (Doxycycline)", "Fluoroquinolones (Ofloxacin)"], note: "Finish full course if prescribed." },
      { category: "Skin & Beauty", safe: ["Glycolic Acid", "Vitamin C Serum", "Benzoyl Peroxide (Low %)", "Azelaic Acid"], caution: ["Salicylic Acid (>2%)"], avoid: ["Isotretinoin (Accutane)", "Retinoids (Retin-A/Tretinoin)", "Hydroquinone"], note: "STOP Retinoids/Accutane 1-3 months before trying." },
      { category: "Psychiatry / Mood", safe: ["Sertraline", "Fluoxetine (Prozac)"], caution: ["Benzodiazepines (Alprazolam)"], avoid: ["Lithium", "Valproate (Epival/Valparin)"], note: "Consult psychiatrist for safe alternatives." }
  ],
  1: [ // First Trimester (0-13 Weeks) - CRITICAL ORGANOGENESIS
      { category: "Nausea & Vomiting", safe: ["Doxylamine + B6 (Doxinate/Pregidoxin)", "Ginger", "Ondansetron (Ondem/Vomitest) - after 10w"], caution: ["Metoclopramide (Perinorm)"], avoid: ["Domperidone"], note: "Doxinate is the gold standard for morning sickness (NVP)." },
      { category: "Pain & Fever", safe: ["Paracetamol (Dolo/Crocin)"], caution: [], avoid: ["Ibuprofen", "Aspirin (High Dose)", "Diclofenac", "Combiflam", "Mefenamic Acid (Meftal)"], note: "Strictly avoid NSAIDs in T1 (Miscarriage risk)." },
      { category: "Diabetes (GDM)", safe: ["Insulin (Actrapid/Lantus)", "Metformin (Glycomet) - if benefit > risk"], caution: [], avoid: ["Oral Hypoglycemics (Glimepiride/Gliclazide)"], note: "Insulin does not cross the placenta. It is the safest." },
      { category: "Hypertension", safe: ["Labetalol", "Methyldopa"], caution: [], avoid: ["Telmisartan", "Enalapril", "Losartan", "Atenolol (IUGR risk)"], note: "Uncontrolled BP is dangerous." },
      { category: "Thyroid", safe: ["Levothyroxine (Thyronorm)"], caution: [], avoid: [], note: "Increase dose by 25-50% usually required in T1." },
      { category: "Acidity & Gas", safe: ["Antacids (Digene/Gelusil)", "Sucralfate", "Omeprazole (Omez)"], caution: ["Pantoprazole (Pan-40) - Use only if needed", "Ranitidine"], avoid: ["Sodium Bicarbonate (Soda/Eno - high salt)"], note: "Lifestyle changes first." },
      { category: "Allergy & Cold", safe: ["Saline Drops (Nasivion S)", "Steam", "Chlorpheniramine (CPM)"], caution: ["Cetirizine (Cetzine)", "Cough Syrups with Alcohol"], avoid: ["Phenylephrine", "Pseudoephedrine (Decongestants)", "Codeine Syrups"], note: "Avoid decongestants in T1." },
      { category: "Antibiotics", safe: ["Amoxicillin (Mox)", "Cephalexin (Phexin)", "Erythromycin", "Azithromycin"], caution: ["Metronidazole (Flagyl) - Avoid high dose in T1"], avoid: ["Tetracycline", "Doxycycline", "Ciprofloxacin", "Norfloxacin"], note: "Treat UTIs immediately (Nitrofurantoin/Cephalexin)." },
      { category: "Hormonal Support", safe: ["Progesterone (Susten/Duphaston/Microgest)", "HCG Injections"], caution: [], avoid: ["Estrogen containing pills"], note: "Only take hormonal support if prescribed for threatened abortion." },
      { category: "Vitamins", safe: ["Folic Acid (Folvite)", "Vitamin B6", "Vitamin D3"], caution: ["Iron (Can worsen nausea in T1)"], avoid: ["Vitamin A (Retinol)", "Cod Liver Oil"], note: "Start Iron only after 12 weeks usually." }
  ],
  2: [ // Second Trimester (14-27 Weeks)
      { category: "Vitamins & Minerals", safe: ["Iron (Ferrous Ascorbate/Fumarate)", "Calcium (Shellcal/Cipcal)", "Vitamin D3", "Omega-3 (DHA)", "Protein Powder (Protinex Mama)"], caution: [], avoid: [], note: "Calcium and Iron must be taken at different times (min 2hr gap)." },
      { category: "Pain & Fever", safe: ["Paracetamol"], caution: ["Ibuprofen (Single dose if prescribed - only in T2)"], avoid: ["Aspirin (High dose)", "Tramadol"], note: "Safest period for necessary dental work." },
      { category: "Diabetes (GDM)", safe: ["Insulin"], caution: ["Metformin"], avoid: ["Sulfonylureas"], note: "GTT test is done at 24-28 weeks." },
      { category: "Hypertension", safe: ["Labetalol", "Methyldopa", "Nifedipine Retard"], caution: [], avoid: ["ACE Inhibitors", "ARBs"], note: "Monitor BP for Preeclampsia signs." },
      { category: "Acidity & Gas", safe: ["Omeprazole", "Pantoprazole", "Digene", "Eno (Occasional)"], caution: [], avoid: [], note: "Heartburn peaks as uterus rises." },
      { category: "Antibiotics", safe: ["Amoxicillin", "Azithromycin", "Cephalosporins", "Clindamycin"], caution: ["Metronidazole"], avoid: ["Tetracyclines (Stains baby teeth)", "Aminoglycosides (Gentamicin)"], note: "Treat vaginal infections." },
      { category: "Constipation", safe: ["Psyllium Husk (Isabgol)", "Lactulose (Duphalac)", "PEG (Pegmove)"], caution: ["Liquid Paraffin"], avoid: ["Castor Oil", "Strong Purgatives (Dulcolax - cramps)"], note: "Increase water intake." },
      { category: "Deworming", safe: ["Albendazole (400mg single dose) - WHO recommends in T2/T3 for endemic areas"], caution: [], avoid: ["In T1"], note: "Treats hookworm anemia." },
      { category: "Cough & Cold", safe: ["Cetirizine", "Guaifenesin (Expectorant)", "Vicks VapoRub (Topical)"], caution: ["Dextromethorphan"], avoid: [], note: "Steam inhalation is best." }
  ],
  3: [ // Third Trimester (28-40 Weeks)
      { category: "Pain & Fever", safe: ["Paracetamol"], caution: [], avoid: ["Ibuprofen", "Diclofenac", "Aspirin", "Naproxen", "Indomethacin"], note: "CRITICAL: NSAIDs in T3 cause premature closure of Ductus Arteriosus (Heart defect) and low amniotic fluid." },
      { category: "Diabetes (GDM)", safe: ["Insulin"], caution: [], avoid: ["Oral agents"], note: "Strict sugar control to prevent macrosomia (large baby)." },
      { category: "Hypertension", safe: ["Labetalol", "Nifedipine"], caution: [], avoid: ["Diuretics (can reduce amniotic fluid)"], note: "Watch for swelling/headache." },
      { category: "Acidity & Gas", safe: ["Ranitidine", "Pantoprazole", "Gelusil"], caution: [], avoid: [], note: "Uterus pressure increases acidity." },
      { category: "Infection/Cough", safe: ["Azithromycin", "Amoxicillin"], caution: [], avoid: ["Sulfa drugs (Cotrimoxazole) - Avoid near term (Jaundice risk)", "Tetracyclines"], note: "Treat GBS if positive." },
      { category: "Labor & Induction", safe: ["Evening Primrose Oil (Oral - only if advised)"], caution: ["Castor Oil (Can cause distress/meconium)"], avoid: ["Herbal concoctions for labor"], note: "Do not self-induce without doctor supervision." },
      { category: "Supplements", safe: ["Iron", "Calcium", "Vitamin D", "Magnesium (for cramps)"], caution: [], avoid: [], note: "Continue supplements to build reserves for birth." },
      { category: "Itching/Cholestasis", safe: ["Ursodeoxycholic Acid (Udiliv)", "Calamine Lotion", "Emollients"], caution: ["Antihistamines"], avoid: [], note: "Report itching of palms/soles immediately (Obstetric Cholestasis)." },
      { category: "Sleep", safe: ["Warm Milk", "Magnesium"], caution: ["Diphenhydramine"], avoid: ["Benzodiazepines (Alprazolam) - Floppy Baby Syndrome"], note: "Avoid sleeping pills near term." }
  ],
  4: [ // Postpartum / Lactation (Breastfeeding)
      { category: "Pain & Recovery", safe: ["Paracetamol", "Ibuprofen (Safe for BF)", "Diclofenac (Voveran)", "Aceclofenac"], caution: ["Tramadol (Monitor baby for sedation)", "Codeine"], avoid: ["Aspirin (Reye's Syndrome risk for baby)"], note: "Pain relief is vital for let-down reflex." },
      { category: "Antibiotics", safe: ["Amoxicillin", "Augmentin", "Cephalexin", "Erythromycin"], caution: ["Ciprofloxacin (Safe in short courses)", "Metronidazole (Pump & dump if high dose)"], avoid: ["Chloramphenicol"], note: "Most antibiotics pass in small amounts but are safe." },
      { category: "Lactation Aid", safe: ["Fenugreek", "Shatavari (Kalpa)", "Domperidone (Prescription only)", "Metoclopramide"], caution: [], avoid: ["Bromocriptine (Stops milk)"], note: "Hydration is the best galactogogue." },
      { category: "Postpartum Depression", safe: ["Sertraline (Preferred)", "Paroxetine"], caution: ["Fluoxetine (Long half-life)"], avoid: ["Doxepin"], note: "Treating PPD is safer for baby than untreated depression." },
      { category: "Diabetes", safe: ["Insulin", "Metformin", "Glibenclamide"], caution: [], avoid: [], note: "Monitor sugars as requirements drop rapidly after birth." },
      { category: "Hypertension", safe: ["Enalapril (Safe in lactation)", "Captopril", "Nifedipine", "Labetalol"], caution: ["Atenolol", "Diuretics (Can reduce milk)"], avoid: [], note: "Switch from Methyldopa (Depression risk)." },
      { category: "Cold & Allergy", safe: ["Loratadine", "Cetirizine", "Saline sprays"], caution: ["Diphenhydramine (Can reduce milk supply)"], avoid: ["Pseudoephedrine (Dries up milk)", "Phenylephrine"], note: "Avoid decongestants if supply is low." },
      { category: "Contraception", safe: ["Progestin-only Pill (Mini-pill / Cerazette)", "Copper IUD (Multiload)", "Condoms", "Depo-Provera", "Lactational Amenorrhea"], caution: [], avoid: ["Combined Oral Pills (Estrogen reduces milk supply)"], note: "Safe to start Mini-pill 6 weeks postpartum." },
      { category: "Vitamins", safe: ["Calcium", "Iron", "Postnatal Multivitamins"], caution: [], avoid: [], note: "Continue for 3-6 months to replenish stores." },
      { category: "Gut Health", safe: ["Lactulose", "Stool Softeners"], caution: ["Senna"], avoid: [], note: "Important for perineal healing." }
  ]
};

export const ALWAYS_CONTRAINDICATED = [
  { name: "Thalidomide", reason: "Causes severe birth defects (Phocomelia)." },
  { name: "Isotretinoin (Accutane)", reason: "Severe brain and heart defects. Stop 1 month before conceiving." },
  { name: "Warfarin", reason: "Blood thinner that causes skeletal defects. Switch to Heparin." },
  { name: "Valproic Acid", reason: "Neural tube defects (Spina Bifida)." },
  { name: "Methotrexate", reason: "Causes miscarriage and severe anomalies." },
  { name: "ACE Inhibitors (Enalapril/Ramipril)", reason: "Causes fetal kidney failure and death (2nd/3rd Trim)." },
  { name: "Tetracyclines", reason: "Discolors baby's teeth and affects bone growth." },
  { name: "Misoprostol", reason: "Induces abortion/labor." },
  { name: "Lithium", reason: "Cardiac defects (Ebstein's anomaly)." },
  { name: "Phenytoin", reason: "Cleft palate and heart defects." },
  { name: "Radioactive Iodine", reason: "Destroys fetal thyroid." },
  { name: "Danazol", reason: "Virilization of female fetus." }
];

const DEFAULT_DIET: TrimesterDiet = {
    focus: "Balanced Diet",
    nutrients: ["Protein", "Calcium", "Iron"],
    meals: [
        { time: "Breakfast", title: "Oatmeal with Fruits", items: ["Oats", "Milk", "Banana", "Almonds"] },
        { time: "Lunch", title: "Roti, Dal & Sabzi", items: ["2 Roti", "Dal", "Green Veg", "Curd"] },
        { time: "Dinner", title: "Light Soup & Salad", items: ["Tomato Soup", "Grilled Paneer/Tofu Salad"] }
    ],
    remedies: ["Ginger tea for nausea"],
    avoid: ["Raw Papaya", "Pineapple (Excess)"]
};

export const DIET_DATABASE: Record<number, Record<DietType, TrimesterDiet>> = {
    1: { vegetarian: DEFAULT_DIET, eggetarian: DEFAULT_DIET, 'non-vegetarian': DEFAULT_DIET },
    2: { vegetarian: DEFAULT_DIET, eggetarian: DEFAULT_DIET, 'non-vegetarian': DEFAULT_DIET },
    3: { vegetarian: DEFAULT_DIET, eggetarian: DEFAULT_DIET, 'non-vegetarian': DEFAULT_DIET },
    4: { vegetarian: DEFAULT_DIET, eggetarian: DEFAULT_DIET, 'non-vegetarian': DEFAULT_DIET }
};

export const WHO_GROWTH_DATA = {
    boys: {
        weight: Array.from({length: 53}, (_, i) => ({ week: i, median: 3.3 + (i*0.15), sd2neg: 2.5 + (i*0.1), sd2pos: 4.2 + (i*0.2) })),
        length: Array.from({length: 53}, (_, i) => ({ week: i, median: 50 + (i*0.5), sd2neg: 46 + (i*0.4), sd2pos: 54 + (i*0.6) }))
    },
    girls: {
        weight: Array.from({length: 53}, (_, i) => ({ week: i, median: 3.2 + (i*0.14), sd2neg: 2.4 + (i*0.1), sd2pos: 4.1 + (i*0.19) })),
        length: Array.from({length: 53}, (_, i) => ({ week: i, median: 49 + (i*0.5), sd2neg: 45 + (i*0.4), sd2pos: 53 + (i*0.6) }))
    }
};

export const IAP_GROWTH_GUIDELINES = {
    weight: [
        "0-3 Months: Gain 20-30g per day",
        "3-6 Months: Gain 15-20g per day",
        "6-12 Months: Gain 10-15g per day",
        "Birth weight doubles by 5 months, triples by 1 year."
    ],
    length: [
        "0-3 Months: 3.5cm per month",
        "3-6 Months: 2cm per month",
        "Length increases by 50% at 1 year."
    ]
};
