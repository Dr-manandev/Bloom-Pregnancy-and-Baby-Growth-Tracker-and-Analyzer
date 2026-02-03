
import { ScanSchedule, WeeklyInfo, MedicineEntry, ComorbidityGuide, TrimesterDiet, DietType, Vaccine, PreConceptionTask, LabTest, DietMeal } from './types';

export const DEFAULT_CYCLE = 28;

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// --- MALE PARTNER HEALTH DATA (FOGSI / WHO) ---
export const MALE_FERTILITY_DATA = {
    meds: {
        avoid: [
            { name: "Testosterone / Anabolic Steroids", reason: "Strictly Avoid. Causes Azoospermia (Zero sperm count) by stopping natural production." },
            { name: "Finasteride (Propecia)", reason: "Used for hair loss. Can reduce semen volume and sperm count." },
            { name: "Sulfasalazine", reason: "Used for colitis. Known to cause reversible male infertility." },
            { name: "Nitrofurantoin", reason: "Antibiotic used for UTI. Immobilizes sperm." },
            { name: "Calcium Channel Blockers", reason: "BP meds (Nifedipine, Amlodipine) can interfere with sperm's ability to fertilize egg." },
            { name: "Ketoconazole (Oral)", reason: "Antifungal. Lowers testosterone production." },
            { name: "Methotrexate", reason: "Used for arthritis/psoriasis. Severe DNA damage to sperm." }
        ],
        caution: [
            { name: "SSRIs (Antidepressants)", reason: "May increase sperm DNA fragmentation. Consult psychiatrist." },
            { name: "Antihistamines (Long term)", reason: "Chronic use may affect sperm quality." },
            { name: "Opioids / Tramadol", reason: "Lowers testosterone and LH levels." }
        ]
    },
    lifestyle: {
        necessary: [
            { title: "Quit Smoking & Vaping", detail: "Tobacco damages sperm DNA integrity. Passive smoking harms the female partner too." },
            { title: "Avoid Scrotal Heat", detail: "Stop keeping laptops on lap. Avoid hot baths, saunas, and tight underwear (wear Boxers)." },
            { title: "Limit Alcohol", detail: "Heavy drinking lowers testosterone and causes erectile dysfunction." },
            { title: "Treat Infections", detail: "STIs, Urinary Tract Infections, or Prostatitis must be treated with antibiotics." }
        ],
        good_to_do: [
            { title: "Regular Ejaculation", detail: "Every 2-3 days helps keep sperm DNA fresh and reduces oxidative stress." },
            { title: "Sleep 7-8 Hours", detail: "Melatonin is crucial for sperm protection against oxidative damage." },
            { title: "Reduce Stress", detail: "High cortisol levels directly lower testosterone." },
            { title: "Limit Cycling", detail: "More than 5 hours/week on a bicycle saddle can affect blood flow and temperature." }
        ],
        avoid: [
            { title: "Plastic Containers (BPA)", detail: "BPA mimics estrogen. Use glass/steel for food and water." },
            { title: "Lubricants", detail: "Saliva and standard lubes kill sperm. Use 'Fertility Friendly' lubes or Pre-Seed." },
            { title: "Soy in Excess", detail: "Contains phytoestrogens. Occasional is fine, but avoid daily high intake." },
            { title: "Processed Meats", detail: "Linked to lower sperm count." }
        ]
    },
    nutrition: [
        { nutrient: "Zinc", source: "Pumpkin Seeds, Chickpeas (Chana), Cashews, Eggs", benefit: "Critical for sperm count and motility." },
        { nutrient: "Folic Acid", source: "Lentils (Dal), Spinach (Palak), Avocado", benefit: "Essential for DNA synthesis (yes, men need it too)." },
        { nutrient: "CoQ10", source: "Fish, Organ meats, or Supplements (Ubiquinol)", benefit: "Provides energy for sperm motility." },
        { nutrient: "Vitamin C", source: "Amla, Guava, Oranges, Lemon", benefit: "Antioxidant. Prevents sperm agglutination (clumping)." },
        { nutrient: "Lycopene", source: "Cooked Tomatoes, Watermelon", benefit: "Improves sperm morphology (shape)." },
        { nutrient: "Selenium", source: "Brazil Nuts, Chicken, Fish", benefit: "Protects against oxidative damage." }
    ]
};

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

export const MATERNAL_VACCINES: Vaccine[] = [
  { id: "mat_tt1", name: "TT-1 / Td-1 (Tetanus)", description: "First dose. Administer as soon as pregnancy is confirmed.", dueWeekStart: 4, dueWeekEnd: 12, mandatory: true, type: 'maternal' },
  { id: "mat_tt2", name: "TT-2 / Td-2", description: "4 weeks after TT-1. Protection against Tetanus.", dueWeekStart: 12, dueWeekEnd: 16, mandatory: true, type: 'maternal' },
  { id: "mat_flu", name: "Influenza (Flu Shot)", description: "Recommended if pregnancy overlaps with flu season (Oct-Jan). Safe in any trimester.", dueWeekStart: 4, dueWeekEnd: 40, mandatory: false, type: 'maternal' },
  { id: "mat_tdap", name: "Tdap (Tetanus, Diphtheria, Pertussis)", description: "CRITICAL: Provides Whooping Cough immunity to the newborn. Replaces one TT dose.", dueWeekStart: 27, dueWeekEnd: 36, mandatory: true, type: 'maternal' }
];

export const BABY_VACCINES: Vaccine[] = [
  { id: "uip_birth", name: "At Birth", description: "BCG, OPV-0, Hepatitis B (Birth dose)", dueWeekStart: 0, dueWeekEnd: 2, mandatory: true, type: 'baby' },
  { id: "uip_6w", name: "6 Weeks", description: "Pentavalent-1, Rotavirus-1, fIPV-1 (Fractional IPV), OPV-1, PCV-1", dueWeekStart: 6, dueWeekEnd: 8, mandatory: true, type: 'baby' },
  { id: "uip_10w", name: "10 Weeks", description: "Pentavalent-2, Rotavirus-2, OPV-2", dueWeekStart: 10, dueWeekEnd: 12, mandatory: true, type: 'baby' },
  { id: "uip_14w", name: "14 Weeks", description: "Pentavalent-3, Rotavirus-3, fIPV-2 (Fractional IPV), OPV-3, PCV-2", dueWeekStart: 14, dueWeekEnd: 16, mandatory: true, type: 'baby' },
  { id: "uip_9_12m", name: "9-12 Months", description: "Measles-Rubella (MR-1), PCV Booster, Vitamin A (1st dose), fIPV-3, JE-1 (in endemic areas only)", dueWeekStart: 39, dueWeekEnd: 52, mandatory: true, type: 'baby' },
  { id: "uip_16_24m", name: "16-24 Months", description: "DPT Booster-1, OPV Booster, Measles-Rubella (MR-2), JE-2 (in endemic areas only), Vitamin A (2nd dose followed by every 6 months)", dueWeekStart: 69, dueWeekEnd: 104, mandatory: true, type: 'baby' },
  { id: "uip_5_6y", name: "5-6 Years", description: "DPT Booster-2", dueWeekStart: 260, dueWeekEnd: 312, mandatory: true, type: 'baby' },
  { id: "uip_10y", name: "10 Years", description: "Td (Tetanus & Diphtheria)", dueWeekStart: 520, dueWeekEnd: 524, mandatory: true, type: 'baby' },
  { id: "uip_16y", name: "16 Years", description: "Td (Tetanus & Diphtheria)", dueWeekStart: 832, dueWeekEnd: 836, mandatory: true, type: 'baby' }
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

export const DETAILED_MILESTONES = [
  {
    category: "Gross Motor",
    items: [
      { id: "gm_1", milestone: "Head and neck control", age: "2-4 months" },
      { id: "gm_2", milestone: "Feet to mouth in supine position", age: "5 months" },
      { id: "gm_3", milestone: "Sitting with own support (Tripod position)", age: "5–6 months" },
      { id: "gm_4", milestone: "Roll over (back to side)", age: "6 months" },
      { id: "gm_5", milestone: "Roll over (prone to supine)", age: "6 months" },
      { id: "gm_6", milestone: "Roll over (supine to prone)", age: "7 months" },
      { id: "gm_7", milestone: "Sitting without support", age: "7 months" },
      { id: "gm_8", milestone: "Crawling (abdomen touches ground)", age: "8 months" },
      { id: "gm_9", milestone: "Creeping (abdomen off the ground)", age: "10 months" },
      { id: "gm_10", milestone: "Standing with support", age: "10 months" },
      { id: "gm_11", milestone: "True pivoting (rotation in axis)", age: "10–11 months" },
      { id: "gm_12", milestone: "Cruising (holding furniture)", age: "11 months" },
      { id: "gm_13", milestone: "Walking with support (bear walking)", age: "12 months" },
      { id: "gm_14", milestone: "Crawls or creeps upstairs", age: "15 months" },
      { id: "gm_15", milestone: "Running", age: "18 months" },
      { id: "gm_16", milestone: "Walking upstairs/downstairs with support", age: "18 months" },
      { id: "gm_17", milestone: "Walks upstairs and downstairs alone (two feet per step)", age: "2 years" },
      { id: "gm_18", milestone: "Walks upstairs with alternate steps", age: "3 years" },
      { id: "gm_19", milestone: "Rides a tricycle", age: "3 years" },
      { id: "gm_20", milestone: "Walks downstairs with alternate steps", age: "4 years" },
      { id: "gm_21", milestone: "Hops on one foot", age: "4 years" },
      { id: "gm_22", milestone: "Skips rope", age: "5 years" }
    ]
  },
  {
    category: "Fine Motor and Adaptive",
    items: [
      { id: "fm_1", milestone: "Mouthing of objects", age: "4 months" },
      { id: "fm_2", milestone: "Bidextrous grasp (reach with both hands)", age: "4 months" },
      { id: "fm_3", milestone: "Unidextrous grasp (reach with one hand)", age: "6 months" },
      { id: "fm_4", milestone: "Transfers objects from hand to hand", age: "6 months" },
      { id: "fm_5", milestone: "Palmar grasp (ulnar to radial progression)", age: "7 months" },
      { id: "fm_6", milestone: "Immature pincer grasp", age: "9 months" },
      { id: "fm_7", milestone: "Mature pincer grasp", age: "12 months" },
      { id: "fm_8", milestone: "Tower of 2 cubes", age: "15 months" },
      { id: "fm_9", milestone: "Drinks from cup", age: "15 months" },
      { id: "fm_10", milestone: "Feeds self with spoon (spills most)", age: "15 months" },
      { id: "fm_11", milestone: "Feeds self with spoon (spills less)", age: "18 months" },
      { id: "fm_12", milestone: "Tower of 3 cubes", age: "18 months" },
      { id: "fm_13", milestone: "Tower of 6–7 cubes", age: "2 years" },
      { id: "fm_14", milestone: "Train without chimney", age: "2 years" },
      { id: "fm_15", milestone: "Train with chimney", age: "2.5 years" },
      { id: "fm_16", milestone: "Handedness established", age: "3 years" },
      { id: "fm_17", milestone: "Tower of 9–10 cubes", age: "3 years" },
      { id: "fm_18", milestone: "Bridge of 3 cubes", age: "4 years" },
      { id: "fm_19", milestone: "Gate of 5 cubes", age: "5 years" }
    ]
  },
  {
    category: "Language",
    items: [
      { id: "lg_1", milestone: "Vocalizing", age: "2 months" },
      { id: "lg_2", milestone: "Cooing", age: "3 months" },
      { id: "lg_3", milestone: "Laughs loudly", age: "4 months" },
      { id: "lg_4", milestone: "Monosyllables / Babbling", age: "6 months" },
      { id: "lg_5", milestone: "Bisyllables", age: "8–9 months" },
      { id: "lg_6", milestone: "First real word (2–3 words with meaning)", age: "1 year" },
      { id: "lg_7", milestone: "Jargon speech (4–6 words)", age: "15 months" },
      { id: "lg_8", milestone: "Uses 8–10 words", age: "18 months" },
      { id: "lg_9", milestone: "Uses 50–100 words, says I/Me/You", age: "2 years" },
      { id: "lg_10", milestone: "Uses ~250 words, counts 3 numbers", age: "3 years" },
      { id: "lg_11", milestone: "Tells story / song / poem (past tense)", age: "4 years" },
      { id: "lg_12", milestone: "Uses future tense", age: "5 years" }
    ]
  },
  {
    category: "Cognitive and Social-Personal",
    items: [
      { id: "sp_1", milestone: "Spontaneous smile (smiling without stimulus)", age: "Neonatal period" },
      { id: "sp_2", milestone: "Social smile (stimulus dependent)", age: "2 months" },
      { id: "sp_3", milestone: "Recognizes mother / primary caretaker", age: "3 months" },
      { id: "sp_4", milestone: "Hand regard", age: "3-5 months" },
      { id: "sp_5", milestone: "Mirror play", age: "6 months" },
      { id: "sp_6", milestone: "Stranger anxiety and inhibits to 'No' command", age: "7 months" },
      { id: "sp_7", milestone: "Object permanence / constancy", age: "8 months" },
      { id: "sp_8", milestone: "Waves bye-bye", age: "9 months" },
      { id: "sp_9", milestone: "Plays peek-a-boo", age: "10 months" },
      { id: "sp_10", milestone: "Domestic mimicry, kisses parents when happy", age: "18 months" },
      { id: "sp_11", milestone: "Separation anxiety / rapprochement", age: "18 months" },
      { id: "sp_12", milestone: "Dry by day", age: "18 months" },
      { id: "sp_13", milestone: "Undressing with support", age: "2 years" },
      { id: "sp_14", milestone: "Dressing with support", age: "3 years" },
      { id: "sp_15", milestone: "Knows full name, age, gender; shares toys", age: "3 years" },
      { id: "sp_16", milestone: "Dry by night", age: "3 years" },
      { id: "sp_17", milestone: "Plays cooperatively in a group", age: "4 years" },
      { id: "sp_18", milestone: "Dressing and undressing independently (ties shoelaces)", age: "5 years" }
    ]
  },
  {
    category: "Cognitive / Visuospatial (Copying Images)",
    items: [
      { id: "vs_1", milestone: "Imitates vertical line", age: "18 months" },
      { id: "vs_2", milestone: "Imitates horizontal line", age: "2 years" },
      { id: "vs_3", milestone: "Copies circle", age: "3 years" },
      { id: "vs_4", milestone: "Copies cross (+)", age: "4 years" },
      { id: "vs_5", milestone: "Copies square", age: "4 years" },
      { id: "vs_6", milestone: "Copies tilted cross (X)", age: "5 years" },
      { id: "vs_7", milestone: "Copies triangle", age: "5 years" },
      { id: "vs_8", milestone: "Copies complex human figure (6–7 body parts)", age: "5 years" }
    ]
  }
];

export const BABY_MILESTONES = DETAILED_MILESTONES; // Backward compatibility alias if needed

export const DEVELOPMENTAL_RED_FLAGS = [
    // GROSS MOTOR
    { condition: "No head control", limitMonth: 4, suggests: "Cerebral palsy, Hypotonia", linkedMilestoneId: "gm_1" },
    { condition: "Not sitting without support", limitMonth: 9, suggests: "Motor delay, Cerebral palsy", linkedMilestoneId: "gm_7" },
    { condition: "Not standing with support", limitMonth: 12, suggests: "Motor delay", linkedMilestoneId: "gm_10" },
    { condition: "Not walking independently", limitMonth: 18, suggests: "Global developmental delay, Neuromuscular disorder", linkedMilestoneId: "gm_13" }, // Linked to 'Walking with support' as proxy for checking if they walk at all, logic in UI will handle age check
    
    // FINE MOTOR
    { condition: "No transfer of objects hand-to-hand", limitMonth: 7, suggests: "Fine motor delay", linkedMilestoneId: "fm_4" },
    { condition: "No pincer grasp", limitMonth: 12, suggests: "Fine motor delay, Cognitive delay", linkedMilestoneId: "fm_7" },
    { condition: "Cannot build tower of 2 cubes", limitMonth: 18, suggests: "Cognitive / fine motor delay", linkedMilestoneId: "fm_8" },

    // LANGUAGE
    { condition: "No cooing", limitMonth: 3, suggests: "Hearing impairment", linkedMilestoneId: "lg_2" },
    { condition: "No babbling", limitMonth: 6, suggests: "Hearing loss", linkedMilestoneId: "lg_4" },
    { condition: "No bisyllables", limitMonth: 10, suggests: "Language delay", linkedMilestoneId: "lg_5" },
    { condition: "No meaningful words", limitMonth: 18, suggests: "Speech delay, Autism spectrum disorder", linkedMilestoneId: "lg_8" },
    { condition: "Vocabulary <50 words", limitMonth: 24, suggests: "Language delay", linkedMilestoneId: "lg_9" },

    // COGNITIVE / SOCIAL
    { condition: "No social smile", limitMonth: 3, suggests: "Visual impairment, Autism", linkedMilestoneId: "sp_2" },
    { condition: "Does not recognize mother/caregiver", limitMonth: 4, suggests: "Cognitive delay", linkedMilestoneId: "sp_3" },
    { condition: "No stranger anxiety", limitMonth: 9, suggests: "Autism spectrum disorder", linkedMilestoneId: "sp_6" },
    { condition: "No object permanence", limitMonth: 12, suggests: "Cognitive delay", linkedMilestoneId: "sp_7" },
    { condition: "No pretend play / domestic mimicry", limitMonth: 24, suggests: "Autism spectrum disorder", linkedMilestoneId: "sp_10" },
    { condition: "Not toilet trained by day", limitMonth: 36, suggests: "Developmental delay", linkedMilestoneId: "sp_12" },

    // COPYING
    { condition: "Cannot copy a circle", limitMonth: 48, suggests: "Cognitive delay", linkedMilestoneId: "vs_3" },
    { condition: "Cannot copy a cross (+)", limitMonth: 60, suggests: "Visuospatial delay", linkedMilestoneId: "vs_4" },
    { condition: "Cannot copy square or triangle", limitMonth: 72, suggests: "Intellectual disability", linkedMilestoneId: "vs_5" }
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

export const FALLBACK_WEEKLY_INFO: WeeklyInfo = { week: 0, babySize: "Unknown", babyWeight: "-", babyLength: "-", description: "Information for this week is loading or unavailable.", symptoms: [], toDo: [], notToDo: [], dailyTips: [] };

// --- FULL PREGNANCY DATABASE (INDIAN / WHO STANDARDS) ---
export const WEEKLY_DATA: Record<number, WeeklyInfo> = {
  1: {
    week: 1, babySize: "Not Conceived", babyWeight: "-", babyLength: "-",
    description: "You are not actually pregnant yet! This week is your period. Your body is shedding the uterine lining.",
    symptoms: ["Cramps", "Fatigue", "Mood Swings"],
    toDo: ["Start Folic Acid (400mcg) immediately.", "Avoid Alcohol/Smoking.", "Eat Iron-rich foods (Spinach, Jaggery)."],
    notToDo: ["X-Rays without protection", "Self-medication (Avoid NSAIDs)", "Stress"],
    dailyTips: ["Day 1: Start your Folic Acid today.", "Day 2: Hydrate well to manage cramps.", "Day 3: Rest and use a hot water bag for pain.", "Day 4: Avoid caffeine to reduce anxiety.", "Day 5: Eat light, warm meals.", "Day 6: Period ending? Resume normal activity.", "Day 7: Prepare mentally for the fertile window."]
  },
  2: {
    week: 2, babySize: "Egg", babyWeight: "-", babyLength: "-",
    description: "Ovulation happens around the end of this week. This is your fertile window. Sperm meets egg in the fallopian tube.",
    symptoms: ["Increased Libido", "Egg-white Cervical Mucus", "Mild Mittelschmerz (Ovulation Pain)"],
    toDo: ["Time intercourse (every alternate day).", "Maintain healthy diet.", "Stay hydrated."],
    notToDo: ["High stress (delays ovulation)", "Lubricants that kill sperm", "Smoking"],
    dailyTips: ["Day 1: Eat antioxidant-rich berries.", "Day 2: Check for cervical mucus changes.", "Day 3: Fertile window begins.", "Day 4: Sperm can live for 5 days inside you.", "Day 5: Peak fertility approaching.", "Day 6: Ovulation day likely (Cycle day 14).", "Day 7: The egg lives for only 12-24 hours."]
  },
  3: {
    week: 3, babySize: "Vanilla Seed", babyWeight: "< 1g", babyLength: "0.1mm",
    description: "Fertilization has occurred! The blastocyst is traveling down the fallopian tube to the uterus.",
    symptoms: ["Mild Spotting (Implantation)", "Bloating"],
    toDo: ["Continue Prenatals.", "Avoid strenuous workouts.", "Eat protein-rich foods."],
    notToDo: ["Hot baths/Saunas", "Alcohol (Critical time)", "Heavy lifting"],
    dailyTips: ["Day 1: Fertilization complete.", "Day 2: Cell division starts rapidly.", "Day 3: Traveling to the uterus.", "Day 4: Blastocyst forms.", "Day 5: Avoid papaya and pineapple.", "Day 6: Implantation might begin.", "Day 7: Early pregnancy factor (EPF) produced."]
  },
  4: {
    week: 4, babySize: "Poppy Seed", babyWeight: "< 1g", babyLength: "1mm",
    biometry: { gs: "2-3 mm" },
    description: "Implantation is complete. You might miss your period this week. Home pregnancy test may be positive.",
    symptoms: ["Missed Period", "Breast Tenderness", "Metallic Taste"],
    toDo: ["Take a Home Pregnancy Test.", "Schedule first Obs/Gynae appointment.", "Stop all unverified meds."],
    notToDo: ["Smoking/Alcohol", "Raw meat/eggs", "Cat litter handling (Toxoplasmosis)"],
    dailyTips: ["Day 1: Missed period?", "Day 2: Test with first morning urine.", "Day 3: Positive? Celebrate!", "Day 4: Negative? Wait 48hrs and retest.", "Day 5: Call your doctor.", "Day 6: Fatigue is normal.", "Day 7: The embryo is forming layers."]
  },
  5: {
    week: 5, babySize: "Sesame Seed", babyWeight: "< 1g", babyLength: "2mm",
    biometry: { gs: "5-6 mm", crl: "1-2 mm" },
    description: "The neural tube (brain/spine) is forming. The heart begins to beat irregularly.",
    symptoms: ["Nausea (Morning Sickness)", "Frequent Urination", "Fatigue"],
    toDo: ["Avoid heat/fevers.", "Eat small frequent meals.", "Drink Ginger tea for nausea."],
    notToDo: ["Cleaning chemicals", "Retinol creams", "Skipping meals"],
    dailyTips: ["Day 1: Heart tube forms.", "Day 2: Baby's circulatory system starts.", "Day 3: Morning sickness kicks in?", "Day 4: Eat a cracker before getting up.", "Day 5: Avoid strong smells.", "Day 6: Stay hydrated.", "Day 7: Neural tube closing."]
  },
  6: {
    week: 6, babySize: "Lentil (Masoor Dal)", babyWeight: "< 1g", babyLength: "4-5mm",
    biometry: { gs: "10-12 mm", crl: "4-6 mm", hr: "90-110 bpm" },
    description: "Heartbeat is detectable on USG (approx 100-115 bpm). Facial features start forming.",
    symptoms: ["Strong Nausea", "Food Aversions", "Mood Swings"],
    toDo: ["Dating Scan (Viability Scan).", "Check Thyroid (TSH).", "Start Vitamin B6 for nausea if prescribed."],
    notToDo: ["Self-medicating for nausea", "Painting (fumes)", "Fasting"],
    dailyTips: ["Day 1: Heartbeat usually detectable.", "Day 2: Nose/ears/mouth shaping.", "Day 3: Rest when tired.", "Day 4: Avoid spicy foods.", "Day 5: Lemon water helps nausea.", "Day 6: Partner support is vital.", "Day 7: Mood swings are hormonal."]
  },
  7: {
    week: 7, babySize: "Blueberry", babyWeight: "< 1g", babyLength: "8-10mm",
    biometry: { gs: "18-20 mm", crl: "10 mm", hr: "120-140 bpm" },
    description: "Brain is developing rapidly (100 cells/minute). Arm and leg buds appear.",
    symptoms: ["Acne", "Excess Saliva", "Constipation"],
    toDo: ["Drink 3L water.", "Eat fiber (Oats/Daliya).", "Avoid standing for too long."],
    notToDo: ["Laxatives without advice", "Hair dye", "High heels"],
    dailyTips: ["Day 1: Brain waves detectable.", "Day 2: Arm buds appear.", "Day 3: Kidneys forming.", "Day 4: Constipation common.", "Day 5: Eat fiber-rich fruits.", "Day 6: Avoid raw sprouts.", "Day 7: Baby doubles in size."]
  },
  8: {
    week: 8, babySize: "Raspberry", babyWeight: "1g", babyLength: "16mm",
    biometry: { gs: "25 mm", crl: "15-18 mm", hr: "140-160 bpm" },
    description: "Baby is now moving (though you can't feel it). Fingers and toes are webbed.",
    symptoms: ["Vivid Dreams", "Bloating", "Leucorrhea (White discharge)"],
    toDo: ["Wear comfortable bra.", "Check Rubella immunity.", "Discuss genetic screening."],
    notToDo: ["Tight clothes", "Excess caffeine", "Sleeping on stomach (starts to get uncomfy)"],
    dailyTips: ["Day 1: Webbed fingers forming.", "Day 2: Taste buds developing.", "Day 3: Eyelids cover eyes.", "Day 4: Uterus expanding.", "Day 5: White discharge is normal.", "Day 6: Don't douche.", "Day 7: Baby moves spontaneously."]
  },
  9: {
    week: 9, babySize: "Grape", babyWeight: "2g", babyLength: "23mm",
    biometry: { crl: "22-25 mm", hr: "155-170 bpm" },
    description: "Human features are distinct. Heart is fully divided into 4 chambers.",
    symptoms: ["Fatigue peaks", "Dizziness", "Gas"],
    toDo: ["Switch to loose clothes.", "Eat iron-rich foods.", "Avoid sudden movements (dizziness)."],
    notToDo: ["Standing up too fast", "Hot showers", "Skipping breakfast"],
    dailyTips: ["Day 1: Heart fully 4-chambered.", "Day 2: Tail bone disappears.", "Day 3: Placenta taking over.", "Day 4: Fatigue is high.", "Day 5: Take short naps.", "Day 6: Eat small meals.", "Day 7: Baby is now a 'Fetus'."]
  },
  10: {
    week: 10, babySize: "Prune", babyWeight: "4g", babyLength: "31mm",
    biometry: { crl: "30-35 mm", hr: "160-170 bpm" },
    description: "Critical development period ends. Risk of congenital defects decreases significantly.",
    symptoms: ["Visible Veins", "Round Ligament Pain", "Headaches"],
    toDo: ["NIPT (Non-Invasive Prenatal Test) if opted.", "Dental hygiene check.", "Increase Calcium."],
    notToDo: ["X-Rays", "Bleaching teeth", "Ignoring headaches (BP check)"],
    dailyTips: ["Day 1: Critical period ending.", "Day 2: Vital organs formed.", "Day 3: Tooth buds forming.", "Day 4: Bones hardening.", "Day 5: Round ligament pain?", "Day 6: Move slowly.", "Day 7: Risk of defects drops."]
  },
  11: {
    week: 11, babySize: "Lime", babyWeight: "7g", babyLength: "41mm",
    biometry: { crl: "40-45 mm", hr: "150-160 bpm" },
    description: "Fingers and toes separate. NT Scan window opens.",
    symptoms: ["Nausea might improve", "Hair growth changes", "Leg cramps"],
    toDo: ["Book NT Scan.", "Book Double Marker Test.", "Start sleeping on side."],
    notToDo: ["Sleeping flat on back (start practicing side)", "Skipping calcium", "High salt"],
    dailyTips: ["Day 1: NT Scan window opens.", "Day 2: Fingers separate.", "Day 3: Ovaries/Testes form.", "Day 4: Skin is transparent.", "Day 5: Nausea improving?", "Day 6: Appetite might return.", "Day 7: Eat protein."]
  },
  12: {
    week: 12, babySize: "Plum", babyWeight: "14g", babyLength: "54mm",
    biometry: { crl: "55-60 mm", bpd: "18-20 mm", hr: "150 bpm" },
    description: "End of First Trimester! Baby has reflexes. Kidneys produce urine.",
    symptoms: ["Bloating", "Dizziness", "Showing slightly?"],
    toDo: ["Announce pregnancy (if comfortable).", "Kegel exercises.", "Review meds with doctor."],
    notToDo: ["Heavy lifting", "Contact sports", "Ignoring UTI symptoms"],
    dailyTips: ["Day 1: 1st Trimester ending!", "Day 2: Baby makes urine.", "Day 3: Reflexes developing.", "Day 4: Vocal cords form.", "Day 5: Miscarriage risk drops.", "Day 6: Plan pregnancy announcement.", "Day 7: Celebrate milestone."]
  },
  13: {
    week: 13, babySize: "Lemon", babyWeight: "23g", babyLength: "74mm",
    biometry: { bpd: "21-24 mm", fl: "9-11 mm", ac: "60-65 mm" },
    description: "Fingerprints have formed. Placenta fully functional.",
    symptoms: ["Energy returning", "Libido changes", "Leaky breasts (Colostrum)"],
    toDo: ["Start 2nd Trimester diet.", "Moisturize belly (stretch marks).", "Join prenatal yoga."],
    notToDo: ["Retinol", "Scuba diving", "Excess sugar"],
    dailyTips: ["Day 1: Welcome to Trimester 2!", "Day 2: Fingerprints set.", "Day 3: Placenta fully works.", "Day 4: Energy boost?", "Day 5: Sex drive returns?", "Day 6: Moisturize belly.", "Day 7: Connect with baby."]
  },
  14: {
    week: 14, babySize: "Orange", babyWeight: "43g", babyLength: "87mm",
    biometry: { bpd: "25-28 mm", fl: "13-15 mm", ac: "75-80 mm", efw: "40-50 g" },
    description: "Baby can grimace and squint. Lanugo (fine hair) covers body.",
    symptoms: ["Less nausea", "Round ligament pain", "Bleeding gums"],
    toDo: ["Dental checkup safe now.", "Eat Vitamin C (gums).", "Iron supplements (start/continue)."],
    notToDo: ["Whitening strips", "Skipping dental hygiene", "Ignoring fever"],
    dailyTips: ["Day 1: Baby makes faces.", "Day 2: Lanugo hair grows.", "Day 3: Thyroid active.", "Day 4: Bleeding gums?", "Day 5: Use soft toothbrush.", "Day 6: Iron absorption key.", "Day 7: Eat oranges/guava."]
  },
  15: {
    week: 15, babySize: "Apple", babyWeight: "70g", babyLength: "10.1cm",
    biometry: { bpd: "30-32 mm", fl: "17-19 mm", ac: "90-95 mm", efw: "70-80 g" },
    description: "Baby senses light. Legs grow longer than arms.",
    symptoms: ["Stuffy nose (Rhinitis)", "Indigestion", "Weight gain starts"],
    toDo: ["Saline spray for nose.", "Eat small dinners.", "Quad Marker (if missed NT)."],
    notToDo: ["Decongestants without advice", "Lying down after eating", "Tight waistbands"],
    dailyTips: ["Day 1: Senses light.", "Day 2: Legs growing.", "Day 3: Ears moving to side.", "Day 4: Nose stuffy?", "Day 5: Pregnancy rhinitis common.", "Day 6: Use humidifier.", "Day 7: Don't stress weight."]
  },
  16: {
    week: 16, babySize: "Avocado", babyWeight: "100g", babyLength: "11.6cm",
    biometry: { bpd: "34-36 mm", fl: "20-22 mm", ac: "100-105 mm", efw: "100-110 g" },
    description: "Quickening (Flutters) might be felt by some. Heart pumps 25L blood/day.",
    symptoms: ["Backache", "Glowing skin", "Constipation"],
    toDo: ["Sleeping on LEFT side is crucial.", "Tetanus (TT) Shot 1.", "Pelvic tilts."],
    notToDo: ["Sleeping on back", "Heavy lifting", "High heels"],
    dailyTips: ["Day 1: First flutter (Quickening)?", "Day 2: Heart pumping fast.", "Day 3: Scalp pattern starts.", "Day 4: Sleep on left side.", "Day 5: Avoid back sleeping.", "Day 6: Backache relief yoga.", "Day 7: Drink water."]
  },
  17: {
    week: 17, babySize: "Pomegranate", babyWeight: "140g", babyLength: "13cm",
    biometry: { bpd: "38-40 mm", fl: "23-25 mm", ac: "115-120 mm", efw: "140-150 g" },
    description: "Skeleton hardening from cartilage to bone. Fat stores accumulating.",
    symptoms: ["Crazy dreams", "Itchy belly", "Sweating"],
    toDo: ["Calcium intake is vital.", "Wear cotton clothes.", "Moisturize."],
    notToDo: ["Scratching belly (worsens marks)", "Hot baths", "Synthetic fabrics"],
    dailyTips: ["Day 1: Bones hardening.", "Day 2: Fat accumulating.", "Day 3: Umbilical cord thickens.", "Day 4: Itchy skin?", "Day 5: Oil massage.", "Day 6: Weird dreams normal.", "Day 7: Check Calcium intake."]
  },
  18: {
    week: 18, babySize: "Bell Pepper", babyWeight: "190g", babyLength: "14.2cm",
    biometry: { bpd: "41-43 mm", fl: "26-28 mm", ac: "125-130 mm", efw: "200-220 g" },
    description: "Anomaly Scan (Level 2) window opens. Baby can hear sounds.",
    symptoms: ["Dizziness", "Swollen feet", "Appetite increase"],
    toDo: ["Book Anomaly Scan.", "Talk/Sing to baby.", "Watch BP."],
    notToDo: ["Standing long hours", "Salt excess", "Ignoring swelling (face/hands)"],
    dailyTips: ["Day 1: Anomaly Scan window.", "Day 2: Ears functional.", "Day 3: Sing to baby.", "Day 4: Myelin forming.", "Day 5: Watch blood pressure.", "Day 6: Feet swelling?", "Day 7: Elevate legs."]
  },
  19: {
    week: 19, babySize: "Mango", babyWeight: "240g", babyLength: "15.3cm",
    biometry: { bpd: "44-46 mm", fl: "29-31 mm", ac: "140-145 mm", efw: "260-280 g" },
    description: "Vernix (cheese-like coating) covers skin. Sensory development peaks.",
    symptoms: ["Hip pain", "Leg cramps", "Blurry vision (dry eyes)"],
    toDo: ["Magnesium for cramps.", "Eye drops if dry.", "Pillow between legs."],
    notToDo: ["High heels", "Rubbing eyes hard", "Dehydration"],
    dailyTips: ["Day 1: Vernix coating forms.", "Day 2: Protects skin.", "Day 3: Senses developing.", "Day 4: Hip pain common.", "Day 5: Use pregnancy pillow.", "Day 6: Leg cramps?", "Day 7: Eat bananas/magnesium."]
  },
  20: {
    week: 20, babySize: "Banana", babyWeight: "300g", babyLength: "16.4cm",
    biometry: { bpd: "47-49 mm", fl: "32-34 mm", ac: "150-155 mm", efw: "320-350 g" },
    description: "Halfway point! Baby swallows amniotic fluid (practice digestion).",
    symptoms: ["Heartburn", "Navel popping", "Increased discharge"],
    toDo: ["Detailed Anomaly Scan (Best time).", "Start iron supplements properly.", "Walk 20 mins."],
    notToDo: ["Skipping scan", "Lying flat", "Junk food"],
    dailyTips: ["Day 1: Halfway there!", "Day 2: Practice swallowing.", "Day 3: Meconium forming.", "Day 4: Scan completed?", "Day 5: Check fetal heart.", "Day 6: Belly button pops?", "Day 7: Celebrate 50%."]
  },
  21: {
    week: 21, babySize: "Carrot", babyWeight: "360g", babyLength: "26.7cm",
    biometry: { bpd: "50-52 mm", fl: "35-37 mm", ac: "160-165 mm", efw: "380-400 g" },
    description: "Baby's movements become coordinated kicks. Taste buds functional.",
    symptoms: ["Stretch marks", "Varicose veins", "Anxiety"],
    toDo: ["Wear compression socks.", "Oil massage.", "Read birth books."],
    notToDo: ["Crossing legs", "Standing still", "Stress"],
    dailyTips: ["Day 1: Coordinated kicks.", "Day 2: Taste buds working.", "Day 3: Amniotic fluid taste.", "Day 4: Varicose veins?", "Day 5: Don't cross legs.", "Day 6: Walk to circulate.", "Day 7: Bonding time."]
  },
  22: {
    week: 22, babySize: "Coconut", babyWeight: "430g", babyLength: "27.8cm",
    biometry: { bpd: "53-55 mm", fl: "38-40 mm", ac: "170-175 mm", efw: "450-480 g" },
    description: "Eyes formed but iris lacks pigment. Baby sleeps in cycles.",
    symptoms: ["Braxton Hicks (Mild)", "Protruding belly button", "Hair growth"],
    toDo: ["Track movements (general awareness).", "Hydrate.", "Discuss Tetanus 2."],
    notToDo: ["Ignoring contractions", "Touching belly too hard", "Heavy housework"],
    dailyTips: ["Day 1: Sleep cycles set.", "Day 2: Iris lacks color.", "Day 3: Grip is strong.", "Day 4: Braxton Hicks?", "Day 5: Painless tightening.", "Day 6: Drink water.", "Day 7: TT-2 injection due?"]
  },
  23: {
    week: 23, babySize: "Grapefruit", babyWeight: "500g", babyLength: "28.9cm",
    biometry: { bpd: "56-58 mm", fl: "41-43 mm", ac: "180-185 mm", efw: "520-550 g" },
    description: "Lungs developing surfactant (vital for breathing). Viability milestone approaching.",
    symptoms: ["Swollen ankles", "Back pain", "Red palms"],
    toDo: ["Elevate feet.", "Watch salt intake.", "Check BP."],
    notToDo: ["High sodium", "Long travel without breaks", "Ignoring headache"],
    dailyTips: ["Day 1: Lungs preparing.", "Day 2: Surfactant starts.", "Day 3: Hear loud noises.", "Day 4: Ankle swelling?", "Day 5: Low salt diet.", "Day 6: Check BP.", "Day 7: Red palms normal."]
  },
  24: {
    week: 24, babySize: "Cantaloupe", babyWeight: "600g", babyLength: "30cm",
    biometry: { bpd: "59-61 mm", fl: "43-45 mm", ac: "190-195 mm", efw: "630-670 g" },
    description: "Age of Viability (in modern NICU). Glucose Tolerance Test (GTT) time.",
    symptoms: ["Itchy skin", "Dry eyes", "Constipation"],
    toDo: ["GTT Test (Mandatory).", "CBC/Urine test.", "Moisturize."],
    notToDo: ["Skipping sugar test", "Scratching", "Straining"],
    dailyTips: ["Day 1: Viability milestone.", "Day 2: Rapid weight gain.", "Day 3: GTT Test week.", "Day 4: Fasting sugar check.", "Day 5: Inner ear mature.", "Day 6: Balance improves.", "Day 7: Legal abortion limit (India)."]
  },
  25: {
    week: 25, babySize: "Cauliflower", babyWeight: "660g", babyLength: "34.6cm",
    biometry: { bpd: "62-64 mm", fl: "46-48 mm", ac: "200-210 mm", efw: "720-780 g" },
    description: "Capillaries form under skin (pink color). Nostrils open.",
    symptoms: ["Hemorrhoids", "Gas/Bloating", "Snoring"],
    toDo: ["Fiber diet.", "Pelvic floor exercises.", "Sleeping on side."],
    notToDo: ["Straining on toilet", "Spicy food", "Sleeping on back"],
    dailyTips: ["Day 1: Skin turning pink.", "Day 2: Capillaries filling.", "Day 3: Nostrils open.", "Day 4: Breathing practice.", "Day 5: Hemorrhoids?", "Day 6: Eat fiber/Isabgol.", "Day 7: Snoring? Use pillow."]
  },
  26: {
    week: 26, babySize: "Lettuce", babyWeight: "760g", babyLength: "35.6cm",
    biometry: { bpd: "65-67 mm", fl: "48-50 mm", ac: "215-220 mm", efw: "850-920 g" },
    description: "Eyes open! Baby can blink. Brain wave activity increases.",
    symptoms: ["Rib pain", "Insomnia", "Braxton Hicks"],
    toDo: ["Stretch arms (rib relief).", "Warm milk before bed.", "Count kicks casually."],
    notToDo: ["Slouching", "Caffeine late day", "Panic over kicks"],
    dailyTips: ["Day 1: Eyes open!", "Day 2: Blinking starts.", "Day 3: Blue eyes (for now).", "Day 4: Rib pain?", "Day 5: Stretch upwards.", "Day 6: Insomnia?", "Day 7: Relaxation routine."]
  },
  27: {
    week: 27, babySize: "Cauliflower", babyWeight: "875g", babyLength: "36.6cm",
    biometry: { bpd: "68-70 mm", fl: "51-53 mm", ac: "225-230 mm", efw: "1000-1100 g" },
    description: "End of 2nd Trimester. Baby recognizes voices clearly.",
    symptoms: ["Shortness of breath", "Backache", "Leg cramps"],
    toDo: ["Tdap Vaccine (Week 27-36).", "Check Hb levels.", "Start Kick Counting."],
    notToDo: ["Shallow breathing", "Poor posture", "Ignoring low movement"],
    dailyTips: ["Day 1: 2nd Trimester ends.", "Day 2: Voice recognition.", "Day 3: Dad should talk.", "Day 4: Short breath?", "Day 5: Uterus pushes up.", "Day 6: Tdap vaccine plan.", "Day 7: Check Hemoglobin."]
  },
  28: {
    week: 28, babySize: "Eggplant", babyWeight: "1kg", babyLength: "37.6cm",
    biometry: { bpd: "71-73 mm", fl: "53-55 mm", ac: "235-245 mm", efw: "1150-1250 g" },
    description: "Welcome to 3rd Trimester! Baby can dream (REM sleep).",
    symptoms: ["Sciatica", "Fatigue returns", "Frequent urination"],
    toDo: ["Kick Counting (Strictly).", "Rh Antibody shot (if Rh-).", "Iron rich diet."],
    notToDo: ["Ignoring <10 kicks", "Heavy lifting", "Traveling far"],
    dailyTips: ["Day 1: 3rd Trimester!", "Day 2: REM sleep / Dreams.", "Day 3: Fat layering.", "Day 4: Sciatica pain?", "Day 5: Stretch gently.", "Day 6: Rhogam shot needed?", "Day 7: Count 10 kicks/2hr."]
  },
  29: {
    week: 29, babySize: "Butternut Squash", babyWeight: "1.15kg", babyLength: "38.6cm",
    biometry: { bpd: "74-76 mm", fl: "55-57 mm", ac: "245-255 mm", efw: "1300-1400 g" },
    description: "Bones fully developed but soft. Head growing for brain.",
    symptoms: ["Varicose veins", "Itchy belly", "Heartburn"],
    toDo: ["Calcium is critical.", "Eat small meals.", "Hospital bag planning."],
    notToDo: ["Scratching", "Large meals", "Standing too long"],
    dailyTips: ["Day 1: Brain controlling heat.", "Day 2: Bones distinct.", "Day 3: Head getting big.", "Day 4: Need Calcium.", "Day 5: Heartburn relief.", "Day 6: Cold milk helps.", "Day 7: Plan hospital bag."]
  },
  30: {
    week: 30, babySize: "Cabbage", babyWeight: "1.3kg", babyLength: "39.9cm",
    biometry: { bpd: "77-79 mm", fl: "57-59 mm", ac: "255-265 mm", efw: "1500-1600 g" },
    description: "Amniotic fluid peaks. Baby skin smoothing out.",
    symptoms: ["Breathlessness", "Swelling", "Mood swings"],
    toDo: ["Check BP (Preeclampsia risk).", "Sleep on side.", "Growth Scan (if advised)."],
    notToDo: ["Salty food", "Ignoring headache/vision blur", "Stress"],
    dailyTips: ["Day 1: Fluid volume peak.", "Day 2: Skin smoothing.", "Day 3: Lanugo shedding.", "Day 4: Breathless?", "Day 5: Diaphragm pushed.", "Day 6: Check BP/Swelling.", "Day 7: Preeclampsia watch."]
  },
  31: {
    week: 31, babySize: "Coconut", babyWeight: "1.5kg", babyLength: "41.1cm",
    biometry: { bpd: "79-81 mm", fl: "59-61 mm", ac: "265-275 mm", efw: "1700-1800 g" },
    description: "Brain connections firing rapidly. Baby processes information.",
    symptoms: ["Frequent urination", "Leaky breasts", "Back pain"],
    toDo: ["Kegels.", "Breast pads.", "Discuss labor signs."],
    notToDo: ["Holding urine", "Slouching", "Ignoring contractions"],
    dailyTips: ["Day 1: Brain specificities.", "Day 2: All 5 senses work.", "Day 3: Baby gains fat.", "Day 4: Bladder pressure.", "Day 5: Don't hold pee.", "Day 6: Colostrum leaking?", "Day 7: Discuss labor signs."]
  },
  32: {
    week: 32, babySize: "Kale / Jicama", babyWeight: "1.7kg", babyLength: "42.4cm",
    biometry: { bpd: "81-83 mm", fl: "61-63 mm", ac: "275-285 mm", efw: "1900-2000 g" },
    description: "Growth Scan / Color Doppler usually done now. Baby practicing breathing.",
    symptoms: ["Braxton Hicks increase", "Darker nipples", "Short breath"],
    toDo: ["Growth Scan.", "Check fluid (AFI).", "Pack bag."],
    notToDo: ["Missing scan", "Traveling (most airlines stop)", "Overexertion"],
    dailyTips: ["Day 1: Growth Scan week.", "Day 2: Check placenta.", "Day 3: Check fluid (AFI).", "Day 4: Practice breathing.", "Day 5: Fingernails visible.", "Day 6: Pack hospital bag.", "Day 7: No air travel."]
  },
  33: {
    week: 33, babySize: "Pineapple", babyWeight: "1.9kg", babyLength: "43.7cm",
    biometry: { bpd: "84-86 mm", fl: "63-65 mm", ac: "285-295 mm", efw: "2100-2200 g" },
    description: "Immune system developing. Antibodies passing from mom.",
    symptoms: ["Overheating", "Headaches", "Insomnia"],
    toDo: ["Stay cool.", "Eat immunity boosters.", "Install car seat (if applicable)."],
    notToDo: ["Hot environments", "Dehydration", "Sleeping pills"],
    dailyTips: ["Day 1: Immune system boost.", "Day 2: Antibodies passing.", "Day 3: Bones hardening.", "Day 4: Skull stays soft.", "Day 5: Feeling hot?", "Day 6: Drink fluids.", "Day 7: Rest is key."]
  },
  34: {
    week: 34, babySize: "Cantaloupe", babyWeight: "2.1kg", babyLength: "45cm",
    biometry: { bpd: "86-88 mm", fl: "65-67 mm", ac: "295-305 mm", efw: "2300-2400 g" },
    description: "Testicles descend (boys). Central nervous system maturing.",
    symptoms: [" blurry vision?", "Swelling", "Fatigue"],
    toDo: ["Watch for Preeclampsia signs.", "Perineal massage.", "Finalize birth plan."],
    notToDo: ["Ignoring vision changes", "Salt", "Heavy lifting"],
    dailyTips: ["Day 1: Testicles descend.", "Day 2: CNS mature.", "Day 3: Lungs nearly ready.", "Day 4: Vision blur?", "Day 5: Check BP immediately.", "Day 6: Perineal massage.", "Day 7: Prevents tearing."]
  },
  35: {
    week: 35, babySize: "Honeydew", babyWeight: "2.4kg", babyLength: "46.2cm",
    biometry: { bpd: "88-90 mm", fl: "67-69 mm", ac: "305-315 mm", efw: "2500-2600 g" },
    description: "Kidneys fully developed. Liver processing waste. Space is tight.",
    symptoms: ["Frequent urination", "Pelvic pressure", "Insomnia"],
    toDo: ["GBS Test (Group B Strep).", "Confirm hospital route.", "Wash baby clothes."],
    notToDo: ["Ignoring reduced movement", "Stress", "Dirty baby clothes"],
    dailyTips: ["Day 1: Kidneys/Liver ready.", "Day 2: Baby dropping?", "Day 3: Pelvic pressure.", "Day 4: Frequent pee.", "Day 5: GBS Swab?", "Day 6: Wash baby clothes.", "Day 7: Hospital route check."]
  },
  36: {
    week: 36, babySize: "Papaya", babyWeight: "2.6kg", babyLength: "47.4cm",
    biometry: { bpd: "90-92 mm", fl: "69-71 mm", ac: "315-325 mm", efw: "2700-2800 g" },
    description: "Late Pre-term. Lungs are generally ready. Baby drops (Lightening).",
    symptoms: ["Easier breathing", "Pelvic pain", "Vaginal pressure"],
    toDo: ["Weekly checkups start.", "Check position (Head down?).", "Pre-delivery labs."],
    notToDo: ["Travel", "Work stress", "Ignoring fluid leak"],
    dailyTips: ["Day 1: Late Pre-term.", "Day 2: Lightening (Drop).", "Day 3: Breathing easier.", "Day 4: Pelvic pain.", "Day 5: Weekly checkups.", "Day 6: Head down?", "Day 7: Cervix check."]
  },
  37: {
    week: 37, babySize: "Winter Melon", babyWeight: "2.9kg", babyLength: "48.6cm",
    biometry: { bpd: "91-93 mm", fl: "70-72 mm", ac: "325-335 mm", efw: "2900-3000 g" },
    description: "Early Term! Baby is ready. Lanugo mostly gone.",
    symptoms: ["Mucus Plug loss?", "Contractions", "Nesting instinct"],
    toDo: ["Watch for labor signs.", "Mucus plug check.", "Rest."],
    notToDo: ["Inducing labor (self)", "Panic", "Unsafe foods"],
    dailyTips: ["Day 1: Early Term!", "Day 2: Baby ready.", "Day 3: Lanugo gone.", "Day 4: Mucus plug?", "Day 5: Bloody show?", "Day 6: Nesting instinct.", "Day 7: Don't overwork."]
  },
  38: {
    week: 38, babySize: "Pumpkin", babyWeight: "3.1kg", babyLength: "49.8cm",
    biometry: { bpd: "93-95 mm", fl: "72-74 mm", ac: "335-345 mm", efw: "3100-3200 g" },
    description: "Full Term. Organs fully functional. Grip is firm.",
    symptoms: ["Lightning crotch", "Back pain", "Diarrhea (Labor prep)"],
    toDo: ["Count kicks.", "Relax.", "Review hospital bag."],
    notToDo: ["Being alone", "Heavy meals", "Stress"],
    dailyTips: ["Day 1: Full Term.", "Day 2: Organs ready.", "Day 3: Grip strong.", "Day 4: Diarrhea?", "Day 5: Body clearing out.", "Day 6: Lightning crotch.", "Day 7: Stay calm."]
  },
  39: {
    week: 39, babySize: "Watermelon", babyWeight: "3.3kg", babyLength: "50.7cm",
    biometry: { bpd: "94-96 mm", fl: "73-75 mm", ac: "340-355 mm", efw: "3200-3400 g" },
    description: "Full Term. Baby is waiting. Skin is white/pink.",
    symptoms: ["Contractions", "Water break?", "Impatience"],
    toDo: ["Time contractions.", "Squats (if comfortable).", "Hydrate."],
    notToDo: ["Castor oil (unless advised)", "Spicy food excess", "Panic"],
    dailyTips: ["Day 1: Waiting game.", "Day 2: Skin pigment.", "Day 3: Brain growth.", "Day 4: Water break?", "Day 5: Color/Odor check.", "Day 6: Time pains.", "Day 7: 5-1-1 Rule."]
  },
  40: {
    week: 40, babySize: "Jackfruit", babyWeight: "3.5kg", babyLength: "51.2cm",
    biometry: { bpd: "95-98 mm", fl: "74-76 mm", ac: "350-365 mm", efw: "3400-3600 g" },
    description: "Due Date! Only 5% arrive on date. Placenta still working.",
    symptoms: ["Labor!", "Anxiety", "Pressure"],
    toDo: ["Go to hospital if labor starts.", "Monitor movements.", "Discuss induction."],
    notToDo: ["Waiting too long", "Eating heavy", "Stress"],
    dailyTips: ["Day 1: Due Date!", "Day 2: Don't panic.", "Day 3: Only 5% on time.", "Day 4: Placenta check.", "Day 5: Monitor kicks.", "Day 6: Discuss induction?", "Day 7: Baby coming soon!"]
  }
};

export const DAILY_TIPS: Record<string, string> = { "default": "Stay hydrated and rest well.", "1": "Start taking prenatal vitamins now.", "2": "Track your ovulation signs.", "40": "Relax and practice breathing exercises." };

// --- COMPREHENSIVE MEDICINE DATABASE (FOGSI / IAP / FDA STANDARDS) ---
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
  1: [ // First Trimester
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
  2: [ // Second Trimester
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
  3: [ // Third Trimester
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
  4: [ // Postpartum / Lactation
      { category: "Pain & Recovery", safe: ["Paracetamol", "Ibuprofen (Safe for BF)", "Diclofenac (Voveran)", "Aceclofenac"], caution: ["Tramadol (Monitor baby for sedation)", "Codeine"], avoid: ["Aspirin (Reye's Syndrome risk for baby)"], note: "Pain relief is vital for let-down reflex." },
      { category: "Antibiotics", safe: ["Amoxicillin", "Augmentin", "Cephalexin", "Erythromycin"], caution: ["Ciprofloxacin (Safe in short courses)", "Metronidazole (Pump & dump if high dose)"], avoid: ["Chloramphenicol"], note: "Most antibiotics pass in small amounts but are safe." },
      { category: "Lactation Aid", safe: ["Fenugreek", "Shatavari (Kalpa)", "Domperidone (Prescription only)", "Metoclopramide"], caution: [], avoid: ["Bromocriptine (Stops milk)"], note: "Hydration is the best galactogogue." },
      { category: "Postpartum Depression", safe: ["Sertraline (Preferred)", "Paroxetine"], caution: ["Fluoxetine (Long half-life)"], avoid: ["Doxepin"], note: "Treating PPD is safer for baby than untreated depression." },
      { category: "Diabetes", safe: ["Insulin", "Metformin", "Glibenclamide"], caution: [], avoid: ["Sulfa drugs (Cotrimoxazole) - Avoid near term (Jaundice risk)", "Tetracyclines"], note: "Treat GBS if positive." },
      { category: "Hypertension", safe: ["Enalapril (Safe in lactation)", "Captopril", "Nifedipine", "Labetalol"], caution: ["Atenolol", "Diuretics (Can reduce milk)"], avoid: ["Switch from Methyldopa (Depression risk)"], note: "Enalapril/Captopril are safe." },
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
