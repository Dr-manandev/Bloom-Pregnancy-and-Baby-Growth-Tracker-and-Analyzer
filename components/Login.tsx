
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Heart, Baby, Calendar, Brain, ShieldCheck, Activity, ArrowRight, Sparkles, CheckCircle2, Star, TrendingUp, Shield, Stethoscope, ChevronDown, MessageCircle, Clock, Ruler, Lock } from 'lucide-react';

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
    <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-full border border-white/20 shadow-sm text-sm font-bold text-gray-700 dark:text-gray-200">
      <Icon size={16} className="text-pink-600" /> {text}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white dark:from-deep-bg dark:to-gray-900 text-gray-800 dark:text-gray-100 overflow-x-hidden font-sans selection:bg-pink-200 dark:selection:bg-pink-900">
      
      {/* Sticky Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-deep-card/90 backdrop-blur-lg shadow-lg py-3' : 'bg-transparent py-5'}`}>
         <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-pink-500/20 transform rotate-3 hover:rotate-0 transition-transform">
                    <Heart fill="currentColor" size={20} />
                </div>
                <span className={`text-2xl font-extrabold tracking-tight ${scrolled ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'}`}>Bloom</span>
            </div>
            <nav className="hidden lg:flex gap-8 text-sm font-bold text-gray-600 dark:text-gray-300">
                <a href="#modes" className="hover:text-pink-600 transition-colors">The Journey</a>
                <a href="#features" className="hover:text-pink-600 transition-colors">Smart Features</a>
                <a href="#science" className="hover:text-pink-600 transition-colors">Medical Science</a>
            </nav>
            <div className="flex gap-4">
                <button onClick={scrollToLogin} className="hidden md:block font-bold text-gray-600 hover:text-pink-600 dark:text-gray-300">Log In</button>
                <button 
                    onClick={scrollToLogin} 
                    className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                >
                    Get Started
                </button>
            </div>
         </div>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto relative">
          {/* Background Blobs */}
          <div className="absolute top-20 left-0 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl -z-10 animate-pulse-slow delay-1000"></div>

          <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 space-y-8 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-xs font-bold uppercase tracking-widest border border-pink-200 dark:border-pink-800 animate-fade-in-up">
                      <Star size={14} fill="currentColor" /> Medically Approved by FOGSI Standards
                  </div>
                  
                  <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-gray-900 dark:text-white">
                      Intelligent Care for <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600">
                          Every Step.
                      </span>
                  </h1>
                  
                  <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                      From conception to your baby's first steps, Bloom provides medical-grade tracking, AI report analysis, and personalized safety guides.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                      <button onClick={scrollToLogin} className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:shadow-pink-500/25 hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3">
                          Start Your Profile <ArrowRight size={20} />
                      </button>
                      <button onClick={() => document.getElementById('features')?.scrollIntoView({behavior:'smooth'})} className="px-8 py-4 bg-white dark:bg-white/5 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-2xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                          See How It Works
                      </button>
                  </div>

                  <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-4">
                      <FeaturePill icon={Brain} text="AI Report Analyzer" />
                      <FeaturePill icon={ShieldCheck} text="Medicine Safety" />
                      <FeaturePill icon={Ruler} text="WHO Growth Charts" />
                  </div>
              </div>

              {/* Interactive Visual */}
              <div className="flex-1 relative w-full flex justify-center lg:justify-end">
                  <div className="relative w-[320px] h-[640px] bg-gray-900 rounded-[3rem] shadow-2xl border-8 border-gray-900 ring-1 ring-gray-800/50 overflow-hidden transform rotate-[-6deg] hover:rotate-0 transition-transform duration-700">
                      {/* Fake Screen UI */}
                      <div className="absolute top-0 left-0 w-full h-full bg-white dark:bg-deep-card flex flex-col">
                          <div className="h-40 bg-gradient-to-br from-pink-500 to-purple-600 rounded-b-[2.5rem] p-6 pt-12 text-white">
                              <div className="flex justify-between items-center mb-4">
                                  <div className="h-2 w-20 bg-white/30 rounded-full"></div>
                                  <div className="h-8 w-8 bg-white/20 rounded-full backdrop-blur-md"></div>
                              </div>
                              <div className="text-3xl font-bold">Week 24</div>
                              <div className="text-sm opacity-80">Baby is the size of a Cantaloupe</div>
                          </div>
                          
                          <div className="flex-1 p-6 space-y-4">
                              <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 flex gap-3 items-center">
                                  <div className="bg-orange-100 p-2 rounded-full text-orange-600"><Activity size={20}/></div>
                                  <div>
                                      <div className="text-sm font-bold text-gray-800 dark:text-white">Kick Counter</div>
                                      <div className="text-xs text-gray-500">Last session: 10 kicks / 20m</div>
                                  </div>
                              </div>
                              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-900/20 border border-teal-100 flex gap-3 items-center">
                                  <div className="bg-teal-100 p-2 rounded-full text-teal-600"><ShieldCheck size={20}/></div>
                                  <div>
                                      <div className="text-sm font-bold text-gray-800 dark:text-white">Safe to Eat?</div>
                                      <div className="text-xs text-gray-500">Sushi: Avoid • Salmon: Safe</div>
                                  </div>
                              </div>
                              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100">
                                  <div className="flex justify-between items-center mb-2">
                                      <div className="text-sm font-bold text-gray-800 dark:text-white">Upcoming Scan</div>
                                      <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">MANDATORY</span>
                                  </div>
                                  <div className="text-xs text-gray-500">Anomaly Scan (Level II)</div>
                                  <div className="text-xs text-gray-400 mt-1">Due: Week 18-22</div>
                              </div>
                          </div>
                          
                          {/* Floating Notification */}
                          <div className="absolute bottom-8 left-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 animate-bounce">
                              <div className="flex gap-3">
                                  <div className="bg-green-100 text-green-600 p-2 rounded-full h-fit"><CheckCircle2 size={16}/></div>
                                  <div>
                                      <p className="text-xs font-bold text-gray-900 dark:text-white">Daily Tip</p>
                                      <p className="text-xs text-gray-500">Drink 3L water today for amniotic fluid.</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-24 bg-gray-50 dark:bg-black/20">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Smart Tools for Modern Moms</h2>
                  <p className="text-xl text-gray-500 max-w-2xl mx-auto">We combine technology with Indian medical guidelines to give you peace of mind.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                  {/* Card 1: AI Reports */}
                  <div className="md:col-span-2 bg-white dark:bg-deep-card rounded-[2.5rem] p-8 border border-gray-100 dark:border-indigo-900/50 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-700"></div>
                      <div className="relative z-10 h-full flex flex-col justify-between">
                          <div>
                              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                                  <Brain size={24} />
                              </div>
                              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI Report Analysis</h3>
                              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                                  Don't wait for your doctor's appointment to understand your reports. Upload a photo of your USG or Blood Test, and our AI will summarize findings, highlight abnormal values, and explain medical jargon instantly.
                              </p>
                          </div>
                          <div className="flex gap-2 mt-4">
                              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300">CBC Analysis</span>
                              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300">USG Summary</span>
                              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300">Thyroid Check</span>
                          </div>
                      </div>
                  </div>

                  {/* Card 2: Safety Check */}
                  <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-[2.5rem] p-8 text-white shadow-lg relative overflow-hidden group">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                      <div className="relative z-10 h-full flex flex-col justify-between">
                          <ShieldCheck size={48} className="opacity-80" />
                          <div>
                              <h3 className="text-2xl font-bold mb-2">Is It Safe?</h3>
                              <p className="opacity-90 text-sm mb-4">
                                  Instant safety ratings for 200+ items: Foods, Medicines, Beauty Products, and Activities.
                              </p>
                              <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl flex items-center justify-between text-sm">
                                  <span>Retinol Cream</span>
                                  <span className="bg-red-500 px-2 py-0.5 rounded text-[10px] font-bold">AVOID</span>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Card 3: Kick Counter */}
                  <div className="bg-white dark:bg-deep-card rounded-[2.5rem] p-8 border border-gray-100 dark:border-indigo-900/50 shadow-sm hover:shadow-xl transition-all group">
                      <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mb-6">
                          <Activity size={24} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Smart Tools</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                          Essential utilities built right in. Log movements or time contractions with a single tap.
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl text-center">
                              <p className="text-xs font-bold text-gray-400 uppercase">Kicks</p>
                              <p className="text-xl font-bold text-pink-600">10/2h</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl text-center">
                              <p className="text-xs font-bold text-gray-400 uppercase">Contractions</p>
                              <p className="text-xl font-bold text-blue-600">5-1-1</p>
                          </div>
                      </div>
                  </div>

                  {/* Card 4: Medical Timeline */}
                  <div className="md:col-span-2 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-indigo-900 dark:to-indigo-950 rounded-[2.5rem] p-8 text-white shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none"></div>
                      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 h-full">
                          <div className="flex-1">
                              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                                  <Calendar size={24} />
                              </div>
                              <h3 className="text-3xl font-bold mb-2">Indian Medical Timeline</h3>
                              <p className="opacity-70">
                                  We strictly follow FOGSI (Federation of Obstetric and Gynaecological Societies of India) standards. Know exactly when to schedule your NT Scan, TifF Anomaly Scan, and Glucose Tolerance Test.
                              </p>
                          </div>
                          <div className="w-full md:w-1/2 space-y-3">
                              <div className="flex items-center gap-4 bg-white/10 p-3 rounded-xl border border-white/10">
                                  <div className="text-center w-12">
                                      <div className="text-xs opacity-50">WEEK</div>
                                      <div className="font-bold text-xl">12</div>
                                  </div>
                                  <div>
                                      <div className="font-bold text-sm">NT Scan & Double Marker</div>
                                      <div className="text-xs text-red-300 font-bold uppercase">Mandatory</div>
                                  </div>
                              </div>
                              <div className="flex items-center gap-4 bg-white/10 p-3 rounded-xl border border-white/10 opacity-60">
                                  <div className="text-center w-12">
                                      <div className="text-xs opacity-50">WEEK</div>
                                      <div className="font-bold text-xl">20</div>
                                  </div>
                                  <div>
                                      <div className="font-bold text-sm">Anomaly Scan (Level II)</div>
                                      <div className="text-xs text-gray-300">Detailed structural check</div>
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
                      <div className="bg-teal-50 dark:bg-teal-900/10 p-2 rounded-[3rem] inline-block mb-6">
                          <div className="px-6 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full font-bold text-sm uppercase tracking-wider">
                              Stage 1: Planning
                          </div>
                      </div>
                      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Conceive with Confidence.</h2>
                      <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                          Bloom helps you understand your body better. We track your cycle phases, predict your most fertile days using advanced algorithms, and provide a "Body Ready" audit to ensure you are physically prepared for pregnancy.
                      </p>
                      <ul className="space-y-4">
                          {[
                              "Ovulation Calculator & Fertile Window",
                              "Period Log with Symptom Tracking",
                              "Pre-conception Health Checklist (Rubella, Thalassemia)",
                              "Two-Week Wait Analysis & Testing Guide"
                          ].map((item, i) => (
                              <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
                                  <CheckCircle2 className="text-teal-500" size={20} /> {item}
                              </li>
                          ))}
                      </ul>
                  </div>
                  <div className="flex-1 lg:order-1 relative">
                      <div className="relative z-10 bg-white dark:bg-deep-card rounded-[3rem] shadow-2xl p-8 border border-gray-100 dark:border-indigo-900/50">
                          <div className="flex justify-between items-center mb-8">
                              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Cycle Calendar</h3>
                              <div className="flex gap-1">
                                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                  <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                              </div>
                          </div>
                          <div className="grid grid-cols-7 gap-2 text-center mb-2">
                              {['S','M','T','W','T','F','S'].map(d => <div key={d} className="text-xs font-bold text-gray-400">{d}</div>)}
                          </div>
                          <div className="grid grid-cols-7 gap-2">
                              {Array.from({length: 31}).map((_, i) => {
                                  let color = "bg-gray-50 dark:bg-gray-800 text-gray-400";
                                  if (i >= 0 && i < 5) color = "bg-rose-500 text-white shadow-lg shadow-rose-500/30"; // Period
                                  if (i === 13) color = "bg-purple-600 text-white shadow-lg shadow-purple-600/30 scale-110 z-10"; // Ovulation
                                  if (i >= 11 && i <= 15 && i !== 13) color = "bg-teal-400 text-white"; // Fertile
                                  return (
                                      <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-sm font-bold ${color}`}>
                                          {i + 1}
                                      </div>
                                  );
                              })}
                          </div>
                      </div>
                      <div className="absolute -bottom-10 -right-10 w-full h-full bg-teal-100/50 dark:bg-teal-900/20 rounded-[3rem] -z-10"></div>
                  </div>
              </div>

              {/* Pregnancy */}
              <div className="flex flex-col lg:flex-row items-center gap-16">
                  <div className="flex-1">
                      <div className="bg-pink-50 dark:bg-pink-900/10 p-2 rounded-[3rem] inline-block mb-6">
                          <div className="px-6 py-2 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full font-bold text-sm uppercase tracking-wider">
                              Stage 2: Pregnancy
                          </div>
                      </div>
                      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Track Growth, Ensure Safety.</h2>
                      <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                          The core of Bloom. We guide you through 40 weeks with precise medical milestones. Log your weight, blood pressure, and sugar levels to detect risks like Preeclampsia or GDM early.
                      </p>
                      <ul className="space-y-4">
                          {[
                              "Weekly Baby Size & Development Updates",
                              "Trimester-wise Diet Plans (Vegetarian/Non-Veg)",
                              "Contraction Timer & Hospital Bag Checklist",
                              "Detailed Scan & Lab Test Schedule"
                          ].map((item, i) => (
                              <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
                                  <CheckCircle2 className="text-pink-500" size={20} /> {item}
                              </li>
                          ))}
                      </ul>
                  </div>
                  <div className="flex-1 relative">
                      <div className="relative z-10 bg-white dark:bg-deep-card rounded-[3rem] shadow-2xl p-8 border border-gray-100 dark:border-indigo-900/50">
                          <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl p-6 text-white mb-6">
                              <h4 className="text-lg font-bold mb-1">Weight Gain Tracker</h4>
                              <p className="text-xs opacity-90 mb-4">Target: Normal BMI (11-16kg)</p>
                              <div className="h-32 flex items-end gap-2">
                                  {[20, 25, 30, 40, 45, 50, 55, 60, 65, 70].map((h, i) => (
                                      <div key={i} className="flex-1 bg-white/30 rounded-t-lg relative group" style={{height: `${h}%`}}>
                                          {i === 9 && <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-pink-600 text-xs font-bold px-2 py-1 rounded shadow">Current</div>}
                                      </div>
                                  ))}
                              </div>
                          </div>
                          <div className="flex gap-4">
                              <div className="flex-1 bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl">
                                  <p className="text-xs text-gray-500 uppercase font-bold">Blood Pressure</p>
                                  <p className="text-xl font-bold text-gray-800 dark:text-white">110/70</p>
                                  <p className="text-[10px] text-green-500 font-bold mt-1">Normal</p>
                              </div>
                              <div className="flex-1 bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl">
                                  <p className="text-xs text-gray-500 uppercase font-bold">Glucose (F)</p>
                                  <p className="text-xl font-bold text-gray-800 dark:text-white">92 mg/dL</p>
                                  <p className="text-[10px] text-green-500 font-bold mt-1">Normal</p>
                              </div>
                          </div>
                      </div>
                      <div className="absolute -top-10 -right-10 w-full h-full bg-pink-100/50 dark:bg-pink-900/20 rounded-[3rem] -z-10"></div>
                  </div>
              </div>

              {/* Postpartum */}
              <div className="flex flex-col lg:flex-row items-center gap-16">
                  <div className="flex-1 lg:order-2">
                      <div className="bg-blue-50 dark:bg-blue-900/10 p-2 rounded-[3rem] inline-block mb-6">
                          <div className="px-6 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-bold text-sm uppercase tracking-wider">
                              Stage 3: Postpartum
                          </div>
                      </div>
                      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">The Fourth Trimester.</h2>
                      <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                          Care doesn't stop at birth. We help you monitor your baby's growth against standard WHO charts, keep track of vaccinations (IAP schedule), and support your recovery with lactation-friendly diets.
                      </p>
                      <ul className="space-y-4">
                          {[
                              "Baby Growth Tracker (Weight, Length, Head)",
                              "Vaccination Scheduler & Reminders",
                              "Developmental Milestones (0-12 Months)",
                              "Breastfeeding Timer & Log"
                          ].map((item, i) => (
                              <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
                                  <CheckCircle2 className="text-blue-500" size={20} /> {item}
                              </li>
                          ))}
                      </ul>
                  </div>
                  <div className="flex-1 lg:order-1 relative">
                      <div className="relative z-10 bg-white dark:bg-deep-card rounded-[3rem] shadow-2xl p-8 border border-gray-100 dark:border-indigo-900/50">
                          <div className="flex items-center gap-4 mb-6">
                              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                  <Baby size={32} />
                              </div>
                              <div>
                                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">Aarav</h3>
                                  <p className="text-sm text-gray-500">Born: 12th Aug • 4 Weeks Old</p>
                              </div>
                          </div>
                          
                          <div className="space-y-4">
                              <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex justify-between items-center">
                                  <div>
                                      <p className="text-xs font-bold text-blue-600 uppercase mb-1">Upcoming Vaccine</p>
                                      <p className="font-bold text-gray-800 dark:text-white">6 Weeks Combo</p>
                                      <p className="text-xs text-gray-500">DTwP-1, IPV-1, Hep-B-1</p>
                                  </div>
                                  <div className="bg-blue-200 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">DUE SOON</div>
                              </div>
                              
                              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl">
                                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">Growth (WHO Standard)</p>
                                  <div className="h-24 flex items-end gap-1 border-b border-gray-300 dark:border-gray-600 pb-1">
                                      <div className="w-1/4 bg-blue-200 h-1/3 rounded-t"></div>
                                      <div className="w-1/4 bg-blue-300 h-1/2 rounded-t"></div>
                                      <div className="w-1/4 bg-blue-400 h-2/3 rounded-t"></div>
                                      <div className="w-1/4 bg-blue-500 h-3/4 rounded-t relative">
                                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-600">4.5kg</div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div className="absolute -bottom-10 -right-10 w-full h-full bg-blue-100/50 dark:bg-blue-900/20 rounded-[3rem] -z-10"></div>
                  </div>
              </div>
          </div>
      </section>

      {/* Trust & FAQ */}
      <section id="science" className="py-24 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto px-6">
              <div className="text-center mb-16">
                  <ShieldCheck size={48} className="text-teal-400 mx-auto mb-6" />
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Science, Not Guesswork.</h2>
                  <p className="text-gray-400 text-lg">Your health is too important for random internet advice. Bloom is built on verified protocols.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-16">
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                      <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                          <Lock size={20} className="text-teal-400" /> Private & Secure
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                          Your health data is stored locally on your device or securely encrypted in the cloud. We do not sell your data to advertisers.
                      </p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                      <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                          <Stethoscope size={20} className="text-teal-400" /> Medical Standards
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                          All timelines, scan schedules, and growth charts are based on FOGSI (India), WHO, and IAP guidelines.
                      </p>
                  </div>
              </div>

              <div className="space-y-4">
                  {[
                      { q: "Is the AI advice a replacement for a doctor?", a: "No. Bloom's AI is an educational tool to help you understand medical terms and general guidelines. Always consult your gynecologist for diagnosis and treatment." },
                      { q: "How accurate is the safety database?", a: "Our database is curated from standard medical formularies (FDA/ACOG). However, individual allergies or conditions may vary." },
                      { q: "Can I use this for multiple pregnancies?", a: "Yes, you can reset your profile or switch modes at any time to start a new journey." }
                  ].map((faq, i) => (
                      <div key={i} className="border-b border-gray-800 pb-4">
                          <button 
                              onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                              className="w-full flex justify-between items-center text-left font-bold text-lg hover:text-teal-400 transition-colors"
                          >
                              {faq.q}
                              <ChevronDown className={`transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                          </button>
                          {activeFaq === i && (
                              <p className="mt-2 text-gray-400 leading-relaxed animate-fade-in">
                                  {faq.a}
                              </p>
                          )}
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Login / Sign Up Anchor */}
      <section id="login-section" className="py-24 bg-white dark:bg-deep-card flex flex-col items-center justify-center relative border-t border-gray-100 dark:border-indigo-900">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white dark:bg-deep-card rounded-full flex items-center justify-center border border-gray-100 dark:border-indigo-900 shadow-sm z-10">
              <ArrowRight className="text-gray-400 rotate-90" />
          </div>
          
          <div className="max-w-md w-full px-6 pt-8 relative z-0">
              <div className="text-center mb-10">
                  <div className="w-20 h-20 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-pink-600 shadow-inner">
                      <Heart size={40} fill="currentColor" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h2>
                  <p className="text-gray-500 dark:text-gray-400">Sign in to access your personalized dashboard.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-indigo-700 bg-gray-50 dark:bg-indigo-950/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-indigo-700 bg-gray-50 dark:bg-indigo-950/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <Button type="submit" isLoading={isLoading} className="w-full py-4 text-lg font-bold shadow-lg shadow-pink-500/20">
                    Sign In to Dashboard
                  </Button>
                  
                  <div className="text-center pt-2">
                      <p className="text-xs text-gray-400">
                        This is a demonstration login. Use any email to enter.
                      </p>
                  </div>
              </form>
          </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-gray-50 dark:bg-black/40 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-indigo-900/50">
          <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles size={16} className="text-pink-500" />
              <span className="font-bold text-gray-700 dark:text-gray-300">Bloom Pregnancy Tracker</span>
          </div>
          <p className="max-w-md mx-auto leading-relaxed opacity-80 px-6 mb-4">
              Designed with love and science. <br/>
              Helping mothers in India and beyond.
          </p>
          <div className="flex justify-center gap-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <a href="#" className="hover:text-pink-500">Privacy</a>
              <a href="#" className="hover:text-pink-500">Terms</a>
              <a href="#" className="hover:text-pink-500">Support</a>
          </div>
          <p className="mt-8 text-xs opacity-50">© 2024 Bloom. All rights reserved.</p>
      </footer>
    </div>
  );
};
