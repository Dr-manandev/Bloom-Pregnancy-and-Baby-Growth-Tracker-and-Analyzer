
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { 
  Heart, Baby, Calendar, Brain, ShieldCheck, Activity, ArrowRight, Sparkles, 
  CheckCircle2, Star, TrendingUp, Shield, Stethoscope, ChevronDown, 
  MessageCircle, Clock, Ruler, Lock, Users, Zap, FileText, Pill, 
  Thermometer, Microscope, ShieldAlert, Utensils
} from 'lucide-react';

interface Props {
  onLogin: () => void;
}

export const Login: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1000);
  };

  const scrollToLogin = () => {
    document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const FeaturePill = ({ icon: Icon, text }: { icon: any, text: string }) => (
    <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-full border border-gray-200/50 dark:border-white/10 shadow-sm text-sm font-bold text-gray-700 dark:text-gray-200 transition-transform hover:scale-105 cursor-default">
      <Icon size={16} className="text-pink-600" /> {text}
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-deep-bg text-gray-900 dark:text-gray-100 overflow-x-hidden font-sans selection:bg-pink-200 dark:selection:bg-pink-900">
      
      {/* Sticky Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-white/90 dark:bg-deep-bg/90 backdrop-blur-lg border-gray-200 dark:border-gray-800 py-3' : 'bg-transparent border-transparent py-5'}`}>
         <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
                    <Heart fill="currentColor" size={20} />
                </div>
                <span className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Bloom</span>
            </div>
            <nav className="hidden lg:flex gap-8 text-sm font-bold text-gray-600 dark:text-gray-300">
                <a href="#features" className="hover:text-pink-600 transition-colors">Features</a>
                <a href="#modes" className="hover:text-pink-600 transition-colors">Your Journey</a>
                <a href="#science" className="hover:text-pink-600 transition-colors">Medical Science</a>
                <a href="#partner" className="hover:text-pink-600 transition-colors">For Partners</a>
            </nav>
            <div className="flex gap-4">
                <button onClick={scrollToLogin} className="hidden md:block font-bold text-gray-600 hover:text-pink-600 dark:text-gray-300 transition-colors">Log In</button>
                <button 
                    onClick={scrollToLogin} 
                    className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 active:translate-y-0"
                >
                    Get Started
                </button>
            </div>
         </div>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto relative">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-gradient-to-br from-pink-200/40 to-purple-200/40 dark:from-pink-900/20 dark:to-purple-900/20 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-teal-200/40 dark:bg-teal-900/20 rounded-full blur-3xl -z-10 animate-pulse-slow delay-700"></div>

          <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 space-y-8 text-center lg:text-left relative z-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest border border-gray-200 dark:border-white/20 shadow-sm animate-fade-in">
                      <ShieldCheck size={14} className="text-green-500" /> Medically Approved (FOGSI/WHO)
                  </div>
                  
                  <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-gray-900 dark:text-white">
                      The Medical Standard for <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600">
                          Modern Motherhood.
                      </span>
                  </h1>
                  
                  <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                      More than just a tracker. Bloom provides clinical-grade monitoring, AI report analysis, and personalized risk assessments from conception to postpartum.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                      <button onClick={scrollToLogin} className="px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-2xl font-bold text-lg hover:shadow-pink-500/25 hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3">
                          Start Free Profile <ArrowRight size={20} />
                      </button>
                      <button onClick={() => document.getElementById('features')?.scrollIntoView({behavior:'smooth'})} className="px-8 py-4 bg-white dark:bg-white/5 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-2xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                          <Activity size={20} className="text-gray-500" /> View Features
                      </button>
                  </div>

                  <div className="pt-8 border-t border-gray-100 dark:border-gray-800/50">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Trusted Protocols From</p>
                      <div className="flex flex-wrap gap-4 justify-center lg:justify-start opacity-70 grayscale hover:grayscale-0 transition-all">
                          <span className="text-lg font-bold flex items-center gap-1"><Stethoscope size={16}/> FOGSI (India)</span>
                          <span className="text-lg font-bold flex items-center gap-1"><Shield size={16}/> WHO</span>
                          <span className="text-lg font-bold flex items-center gap-1"><Baby size={16}/> IAP (Pediatrics)</span>
                      </div>
                  </div>
              </div>

              {/* Interactive App Preview */}
              <div className="flex-1 relative w-full flex justify-center lg:justify-end">
                  <div className="relative w-[340px] h-[680px] bg-gray-900 rounded-[3.5rem] shadow-2xl border-8 border-gray-900 ring-1 ring-gray-800/50 overflow-hidden transform rotate-[-3deg] hover:rotate-0 transition-transform duration-700 z-20">
                      {/* Fake Screen UI */}
                      <div className="absolute top-0 left-0 w-full h-full bg-white dark:bg-deep-card flex flex-col">
                          {/* Header */}
                          <div className="h-44 bg-gradient-to-br from-pink-500 to-rose-600 rounded-b-[2.5rem] p-6 pt-14 text-white relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl"></div>
                              <div className="flex justify-between items-center mb-4 relative z-10">
                                  <div className="flex gap-1">
                                      <div className="w-2 h-2 bg-white rounded-full"></div>
                                      <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                                  </div>
                                  <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">Week 24</div>
                              </div>
                              <div className="relative z-10">
                                  <div className="text-4xl font-bold mb-1">Week 24</div>
                                  <div className="text-sm opacity-90">Baby is the size of a Cantaloupe</div>
                                  <div className="mt-4 flex gap-3">
                                      <span className="bg-white/20 px-3 py-1 rounded-lg text-xs backdrop-blur-md">600g</span>
                                      <span className="bg-white/20 px-3 py-1 rounded-lg text-xs backdrop-blur-md">30cm</span>
                                  </div>
                              </div>
                          </div>
                          
                          {/* Body */}
                          <div className="flex-1 p-6 space-y-4 overflow-hidden relative">
                              {/* Clinical Alert */}
                              <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-red-100 dark:border-red-900/30 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-transform">
                                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                                  <div className="flex justify-between items-start mb-1">
                                      <div className="flex items-center gap-2">
                                          <ShieldAlert size={16} className="text-red-500" />
                                          <span className="font-bold text-sm text-gray-900 dark:text-white">Clinical Risk Alert</span>
                                      </div>
                                      <span className="text-[10px] text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded font-bold">HIGH</span>
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-gray-300">Hb level 10.2 g/dL indicates mild anemia. Start Iron supplements.</p>
                              </div>

                              {/* AI Doctor */}
                              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform">
                                  <div className="flex items-center gap-3 mb-2">
                                      <Sparkles size={20} />
                                      <span className="font-bold">Dr. Bloom AI</span>
                                  </div>
                                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl text-xs leading-relaxed">
                                      "Your latest USG shows normal placental position. No Placenta Previa detected."
                                  </div>
                              </div>

                              {/* Tools Grid */}
                              <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-2xl border border-orange-100 dark:border-orange-900/30">
                                      <Activity size={20} className="text-orange-500 mb-2" />
                                      <div className="font-bold text-gray-800 dark:text-white text-sm">Kicks</div>
                                      <div className="text-xs text-gray-500">10 / 2h</div>
                                  </div>
                                  <div className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded-2xl border border-teal-100 dark:border-teal-900/30">
                                      <Pill size={20} className="text-teal-500 mb-2" />
                                      <div className="font-bold text-gray-800 dark:text-white text-sm">Meds</div>
                                      <div className="text-xs text-gray-500">2 Pending</div>
                                  </div>
                              </div>
                          </div>
                          
                          {/* Bottom Nav Fake */}
                          <div className="h-16 border-t border-gray-100 dark:border-gray-800 flex items-center justify-around text-gray-400">
                              <Heart size={24} className="text-pink-600" />
                              <Calendar size={24} />
                              <FileText size={24} />
                              <Users size={24} />
                          </div>
                      </div>
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute top-20 -right-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 animate-bounce duration-[3000ms] hidden lg:block">
                      <div className="flex items-center gap-3">
                          <div className="bg-green-100 text-green-600 p-2 rounded-full"><CheckCircle2 size={20}/></div>
                          <div>
                              <p className="text-sm font-bold text-gray-900 dark:text-white">Safety Check</p>
                              <p className="text-xs text-gray-500">Sushi: <span className="text-red-500 font-bold">AVOID</span></p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Feature Grid (Detailed) */}
      <section id="features" className="py-24 bg-gray-50 dark:bg-black/20">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Medical-Grade Intelligence</h2>
                  <p className="text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                      Most trackers just count days. Bloom uses your vitals, history, and medical reports to provide clinical-grade insights and risk assessments.
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[350px]">
                  
                  {/* Card 1: AI Reports */}
                  <div className="md:col-span-2 bg-white dark:bg-deep-card rounded-[2.5rem] p-10 border border-gray-100 dark:border-indigo-900/50 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-700"></div>
                      <div className="relative z-10 h-full flex flex-col justify-between">
                          <div>
                              <div className="w-14 h-14 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300 rounded-2xl flex items-center justify-center mb-6">
                                  <Brain size={28} />
                              </div>
                              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">AI Report Analysis</h3>
                              <p className="text-lg text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed">
                                  Understand your medical reports instantly. Upload a photo of your USG, Blood Test, or Discharge Summary. Our AI explains medical jargon, highlights abnormal values based on Indian standards, and suggests questions for your doctor.
                              </p>
                          </div>
                          <div className="flex flex-wrap gap-3 mt-4">
                              <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Fetal Biometry</span>
                              <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Hemoglobin Trends</span>
                              <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Thyroid Monitor</span>
                          </div>
                      </div>
                  </div>

                  {/* Card 2: Risk Engine */}
                  <div className="bg-white dark:bg-deep-card rounded-[2.5rem] p-10 border border-gray-100 dark:border-indigo-900/50 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
                      <div className="relative z-10 h-full flex flex-col justify-between">
                          <div>
                              <div className="w-14 h-14 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300 rounded-2xl flex items-center justify-center mb-6">
                                  <ShieldAlert size={28} />
                              </div>
                              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Clinical Risk Engine</h3>
                              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                                  We continuously monitor your data for signs of Preeclampsia, Gestational Diabetes, and Anemia.
                              </p>
                          </div>
                          <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                              <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs font-bold text-red-600 dark:text-red-300 uppercase">Alert</span>
                                  <Activity size={14} className="text-red-500" />
                              </div>
                              <p className="text-sm font-bold text-gray-800 dark:text-white">BP 145/95 mmHg</p>
                              <p className="text-xs text-gray-500 mt-1">High Risk. Consult Doctor.</p>
                          </div>
                      </div>
                  </div>

                  {/* Card 3: Safety Database */}
                  <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-[2.5rem] p-10 text-white shadow-lg relative overflow-hidden group">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                      <div className="relative z-10 h-full flex flex-col justify-between">
                          <div>
                              <ShieldCheck size={48} className="opacity-80 mb-6" />
                              <h3 className="text-3xl font-bold mb-3">Is It Safe?</h3>
                              <p className="opacity-90 text-lg leading-relaxed">
                                  Instant safety ratings for 500+ items: Foods, Medicines, Beauty Products, and Activities.
                              </p>
                          </div>
                          <div className="space-y-3">
                              <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl flex items-center justify-between text-sm">
                                  <span>Retinol Serum</span>
                                  <span className="bg-red-500 px-2 py-0.5 rounded text-[10px] font-bold shadow">AVOID</span>
                              </div>
                              <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl flex items-center justify-between text-sm">
                                  <span>Paracetamol</span>
                                  <span className="bg-green-500 px-2 py-0.5 rounded text-[10px] font-bold shadow">SAFE</span>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Card 4: Medical Timeline */}
                  <div className="md:col-span-2 bg-gray-900 dark:bg-black rounded-[2.5rem] p-10 text-white shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 to-transparent pointer-events-none"></div>
                      <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 h-full">
                          <div className="flex-1">
                              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/10">
                                  <Calendar size={28} />
                              </div>
                              <h3 className="text-3xl font-bold mb-3">FOGSI Compliant Timeline</h3>
                              <p className="opacity-70 text-lg leading-relaxed">
                                  We strictly follow Indian medical standards. Know exactly when to schedule your NT Scan, Anomaly Scan, and Glucose Tolerance Test based on your LMP.
                              </p>
                          </div>
                          <div className="w-full md:w-1/2 space-y-4">
                              <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/15 transition-colors">
                                  <div className="text-center w-14 border-r border-white/10 pr-4">
                                      <div className="text-xs opacity-50 uppercase font-bold">Week</div>
                                      <div className="font-bold text-2xl">12</div>
                                  </div>
                                  <div>
                                      <div className="font-bold text-base">NT Scan & Double Marker</div>
                                      <div className="text-xs text-red-300 font-bold uppercase mt-1">Mandatory</div>
                                  </div>
                              </div>
                              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 opacity-60">
                                  <div className="text-center w-14 border-r border-white/10 pr-4">
                                      <div className="text-xs opacity-50 uppercase font-bold">Week</div>
                                      <div className="font-bold text-2xl">24</div>
                                  </div>
                                  <div>
                                      <div className="font-bold text-base">Glucose Tolerance Test (GTT)</div>
                                      <div className="text-xs text-gray-400 font-bold uppercase mt-1">Screening</div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Modes Deep Dive */}
      <section id="modes" className="py-24">
          <div className="max-w-7xl mx-auto px-6 space-y-32">
              
              {/* Planning */}
              <div className="flex flex-col lg:flex-row items-center gap-16">
                  <div className="flex-1 lg:order-2">
                      <div className="inline-block mb-6">
                          <span className="text-teal-600 font-extrabold tracking-widest uppercase text-sm">Stage 1</span>
                          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2">Conceive with Science.</h2>
                      </div>
                      <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                          Bloom analyzes your menstrual health to predict your most fertile window accurately. We also provide a complete "Body Ready" audit to ensure you are physically prepared for pregnancy.
                      </p>
                      <div className="grid sm:grid-cols-2 gap-6">
                          {[
                              { title: "Ovulation Tracker", desc: "Predicts peak fertility days." },
                              { title: "Cycle Analysis", desc: "Detects irregular patterns." },
                              { title: "Pre-conception Audit", desc: "Rubella, Thalassemia checks." },
                              { title: "Two-Week Wait", desc: "Implantation care guide." }
                          ].map((item, i) => (
                              <div key={i} className="flex gap-4">
                                  <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 shrink-0">
                                      <CheckCircle2 size={20} />
                                  </div>
                                  <div>
                                      <h4 className="font-bold text-gray-900 dark:text-white">{item.title}</h4>
                                      <p className="text-sm text-gray-500">{item.desc}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
                  <div className="flex-1 lg:order-1">
                      <div className="bg-white dark:bg-deep-card rounded-[3rem] shadow-2xl p-8 border border-gray-100 dark:border-indigo-900/50 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                          <div className="flex justify-between items-center mb-8">
                              <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                  <Calendar className="text-teal-500" /> Cycle Calendar
                              </h3>
                          </div>
                          <div className="grid grid-cols-7 gap-3 text-center">
                              {Array.from({length: 28}).map((_, i) => {
                                  let color = "bg-gray-50 dark:bg-gray-800 text-gray-400";
                                  if (i >= 0 && i < 5) color = "bg-rose-500 text-white"; // Period
                                  if (i === 13) color = "bg-purple-600 text-white ring-4 ring-purple-100 dark:ring-purple-900/30 z-10 relative"; // Ovulation
                                  if (i >= 11 && i <= 15 && i !== 13) color = "bg-teal-400 text-white"; // Fertile
                                  return (
                                      <div key={i} className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold ${color}`}>
                                          {i + 1}
                                      </div>
                                  );
                              })}
                          </div>
                          <div className="mt-6 flex justify-between items-center bg-teal-50 dark:bg-teal-900/10 p-4 rounded-2xl">
                              <div>
                                  <p className="text-xs font-bold text-teal-600 uppercase">Chance Today</p>
                                  <p className="text-2xl font-bold text-gray-900 dark:text-white">High (30%)</p>
                              </div>
                              <Heart className="text-teal-500 fill-teal-500 animate-pulse" size={32} />
                          </div>
                      </div>
                  </div>
              </div>

              {/* Pregnancy */}
              <div className="flex flex-col lg:flex-row items-center gap-16">
                  <div className="flex-1">
                      <div className="inline-block mb-6">
                          <span className="text-pink-600 font-extrabold tracking-widest uppercase text-sm">Stage 2</span>
                          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2">Track Growth, Ensure Safety.</h2>
                      </div>
                      <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                          Your comprehensive guide through 40 weeks. We combine 3D fetus updates with strict medical tracking for Hypertension, GDM, and growth restriction.
                      </p>
                      <div className="space-y-4">
                          <div className="flex gap-4 items-start p-4 rounded-2xl bg-pink-50 dark:bg-pink-900/10 border border-pink-100 dark:border-pink-900/30">
                              <TrendingUp className="text-pink-600 mt-1 shrink-0" />
                              <div>
                                  <h4 className="font-bold text-gray-900 dark:text-white">Weight Gain Analysis</h4>
                                  <p className="text-sm text-gray-500">Personalized target range based on your pre-pregnancy BMI.</p>
                              </div>
                          </div>
                          <div className="flex gap-4 items-start p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                              <Utensils className="text-blue-600 mt-1 shrink-0" />
                              <div>
                                  <h4 className="font-bold text-gray-900 dark:text-white">Trimester Diet Plans</h4>
                                  <p className="text-sm text-gray-500">Vegetarian & Non-Veg options focusing on Iron, Calcium, and Folate.</p>
                              </div>
                          </div>
                          <div className="flex gap-4 items-start p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30">
                              <Clock className="text-purple-600 mt-1 shrink-0" />
                              <div>
                                  <h4 className="font-bold text-gray-900 dark:text-white">Labor Tools</h4>
                                  <p className="text-sm text-gray-500">Contraction Timer (5-1-1 Rule), Kick Counter, and Hospital Bag Checklist.</p>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="flex-1">
                      <div className="bg-white dark:bg-deep-card rounded-[3rem] shadow-2xl p-8 border border-gray-100 dark:border-indigo-900/50 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                          <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl p-8 text-white mb-6 shadow-lg shadow-pink-500/20">
                              <h4 className="text-2xl font-bold mb-1">Week 28</h4>
                              <p className="opacity-90 mb-6">3rd Trimester Begins!</p>
                              
                              <div className="flex gap-2 mb-2">
                                  <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">Kick Count: Mandatory</span>
                                  <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">Tdap Vaccine</span>
                              </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl">
                                  <p className="text-xs text-gray-500 uppercase font-bold">Glucose</p>
                                  <p className="text-2xl font-bold text-gray-800 dark:text-white">92</p>
                                  <p className="text-xs text-green-500 font-bold mt-1">Normal</p>
                              </div>
                              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl">
                                  <p className="text-xs text-gray-500 uppercase font-bold">Weight</p>
                                  <p className="text-2xl font-bold text-gray-800 dark:text-white">+8 kg</p>
                                  <p className="text-xs text-green-500 font-bold mt-1">On Track</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Postpartum */}
              <div className="flex flex-col lg:flex-row items-center gap-16">
                  <div className="flex-1 lg:order-2">
                      <div className="inline-block mb-6">
                          <span className="text-blue-600 font-extrabold tracking-widest uppercase text-sm">Stage 3</span>
                          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2">The Fourth Trimester.</h2>
                      </div>
                      <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                          Comprehensive care for both mom and baby. Track vaccinations, monitor WHO growth standards, and get support for lactation and recovery.
                      </p>
                      <ul className="space-y-4">
                          <li className="flex items-center gap-4 text-gray-700 dark:text-gray-200">
                              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600"><Ruler size={20}/></div>
                              <span><strong>WHO Growth Charts:</strong> Track Height, Weight, and Head Circumference percentile.</span>
                          </li>
                          <li className="flex items-center gap-4 text-gray-700 dark:text-gray-200">
                              <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30 text-teal-600"><Thermometer size={20}/></div>
                              <span><strong>Vaccination Tracker:</strong> Complete IAP immunization schedule with reminders.</span>
                          </li>
                          <li className="flex items-center gap-4 text-gray-700 dark:text-gray-200">
                              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600"><Baby size={20}/></div>
                              <span><strong>Milestones:</strong> Developmental checklist for motor and social skills (0-12 months).</span>
                          </li>
                      </ul>
                  </div>
                  <div className="flex-1 lg:order-1">
                      <div className="bg-white dark:bg-deep-card rounded-[3rem] shadow-2xl p-8 border border-gray-100 dark:border-indigo-900/50 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                          <div className="flex items-center gap-6 mb-8">
                              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shadow-inner">
                                  <Baby size={40} />
                              </div>
                              <div>
                                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Aarav</h3>
                                  <p className="text-gray-500 font-medium">4 Weeks Old</p>
                              </div>
                          </div>
                          
                          <div className="space-y-4">
                              <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex justify-between items-center">
                                  <div>
                                      <p className="text-xs font-bold text-blue-600 uppercase mb-1">Upcoming Vaccine</p>
                                      <p className="font-bold text-gray-800 dark:text-white text-lg">6 Weeks Combo</p>
                                      <p className="text-xs text-gray-500">DTwP-1, IPV-1, Hep-B-1</p>
                                  </div>
                                  <div className="bg-white dark:bg-blue-900/50 text-blue-600 p-2 rounded-full shadow-sm"><ChevronDown/></div>
                              </div>
                              
                              <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl">
                                  <div className="flex justify-between items-end mb-2">
                                      <p className="text-xs font-bold text-gray-500 uppercase">Weight Growth</p>
                                      <p className="text-green-500 text-xs font-bold">50th Percentile</p>
                                  </div>
                                  <div className="h-24 flex items-end gap-1.5">
                                      {[30, 40, 45, 50, 60, 65].map((h, i) => (
                                          <div key={i} className={`flex-1 rounded-t-lg ${i===5 ? 'bg-blue-600' : 'bg-blue-200 dark:bg-blue-900'}`} style={{height: `${h}%`}}></div>
                                      ))}
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Partner Section */}
      <section id="partner" className="py-20 bg-gray-900 text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-full text-xs font-bold uppercase mb-6">
                      <Users size={16} /> New Feature
                  </div>
                  <h2 className="text-4xl font-bold mb-4">It Takes Two.</h2>
                  <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                      Male fertility is 50% of the equation. Bloom includes a dedicated module for partners to optimize sperm health, understand lifestyle impacts, and support the pregnancy journey effectively.
                  </p>
                  <div className="flex flex-wrap gap-4">
                      <div className="bg-gray-800 px-5 py-3 rounded-xl border border-gray-700">
                          <p className="font-bold text-white mb-1">Meds to Avoid</p>
                          <p className="text-xs text-gray-400">Database of drugs affecting sperm.</p>
                      </div>
                      <div className="bg-gray-800 px-5 py-3 rounded-xl border border-gray-700">
                          <p className="font-bold text-white mb-1">Lifestyle Audit</p>
                          <p className="text-xs text-gray-400">Habits that boost fertility.</p>
                      </div>
                  </div>
              </div>
              <div className="flex-1 flex justify-center">
                  <div className="w-64 h-64 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.3)]">
                      <Activity size={80} className="text-white" />
                  </div>
              </div>
          </div>
      </section>

      {/* Why Bloom Grid */}
      <section id="science" className="py-24 bg-white dark:bg-deep-bg">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Choose Bloom?</h2>
                  <p className="text-gray-500 dark:text-gray-400">Comparing us to standard period trackers.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                  <div className="p-8 rounded-3xl bg-gray-50 dark:bg-deep-card border border-gray-100 dark:border-indigo-900/30">
                      <Lock size={32} className="text-gray-900 dark:text-white mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Private & Secure</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                          Your health data belongs to you. We store data locally on your device or use enterprise-grade encryption. No selling data to advertisers.
                      </p>
                  </div>
                  <div className="p-8 rounded-3xl bg-pink-50 dark:bg-pink-900/10 border border-pink-100 dark:border-pink-900/30">
                      <Stethoscope size={32} className="text-pink-600 mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Medical Accuracy</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                          Generic apps guess. We use clinical algorithms for ovulation and risk assessment based on FOGSI & WHO protocols.
                      </p>
                  </div>
                  <div className="p-8 rounded-3xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30">
                      <Brain size={32} className="text-purple-600 mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI-Powered</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                          Integrated with Google Gemini to analyze reports, answer complex medical queries, and provide personalized advice instantly.
                      </p>
                  </div>
              </div>
          </div>
      </section>

      {/* Login / Sign Up Anchor */}
      <section id="login-section" className="py-24 bg-gray-50 dark:bg-black/20 flex flex-col items-center justify-center border-t border-gray-200 dark:border-indigo-900">
          
          <div className="max-w-md w-full px-6 pt-8 bg-white dark:bg-deep-card p-10 rounded-3xl shadow-2xl border border-gray-100 dark:border-indigo-800">
              <div className="text-center mb-10">
                  <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-pink-600">
                      <Heart size={32} fill="currentColor" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Start Your Journey</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Enter your details to access the dashboard.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-indigo-700 bg-gray-50 dark:bg-indigo-950/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all font-medium"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-indigo-700 bg-gray-50 dark:bg-indigo-950/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all font-medium"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <Button type="submit" isLoading={isLoading} className="w-full py-4 text-lg font-bold shadow-xl shadow-pink-500/20 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white">
                    Sign In to Dashboard
                  </Button>
                  
                  <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-800">
                      <p className="text-xs text-gray-400">
                        Demo Mode: Use any email to enter.
                      </p>
                  </div>
              </form>
          </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white dark:bg-deep-card border-t border-gray-200 dark:border-indigo-900 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles size={20} className="text-pink-500" />
              <span className="font-bold text-xl text-gray-900 dark:text-white">Bloom</span>
          </div>
          <div className="flex justify-center gap-8 text-sm font-medium text-gray-500 dark:text-gray-400 mb-8">
              <a href="#" className="hover:text-pink-600">Privacy Policy</a>
              <a href="#" className="hover:text-pink-600">Terms of Service</a>
              <a href="#" className="hover:text-pink-600">Medical Disclaimer</a>
              <a href="#" className="hover:text-pink-600">Contact Support</a>
          </div>
          <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed px-6">
              Bloom is an educational tool and does not provide medical advice, diagnosis, or treatment. Always consult with a qualified healthcare professional.
              <br/><br/>
              © 2024 Bloom Health. Built for India.
          </p>
      </footer>
    </div>
  );
};
