
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { 
  Heart, Baby, Calendar, Brain, ShieldCheck, Activity, ArrowRight, Sparkles, 
  CheckCircle2, Star, TrendingUp, Shield, Stethoscope, ChevronDown, 
  MessageCircle, Clock, Ruler, Lock, Users, Zap, FileText, Pill, 
  Thermometer, Microscope, ShieldAlert, Utensils, Mail, Key, UserPlus, Lightbulb
} from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  onLogin: () => void;
}

export const Login: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Auth Modes
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    if (!auth) {
      setError("Firebase configuration is missing.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await signInWithPopup(auth, googleProvider);
      onLogin();
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === 'auth/invalid-api-key') {
        setError("Invalid Firebase API Key. Please check your Firebase Project Settings and ensure the API key is correct.");
      } else if (err.code === 'auth/unauthorized-domain') {
        setError("This domain is not authorized for OAuth operations. Please add it to the authorized domains in Firebase Console.");
      } else {
        setError(err.message || "Failed to sign in with Google.");
      }
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!auth) {
          setError("Firebase configuration is missing.");
          return;
      }

      if (!email || !password) {
          setError("Please enter both email and password.");
          return;
      }

      setIsLoading(true);
      setError(null);
      setSuccessMsg(null);

      try {
          if (authMode === 'signup') {
              await createUserWithEmailAndPassword(auth, email, password);
          } else {
              await signInWithEmailAndPassword(auth, email, password);
          }
          onLogin();
      } catch (err: any) {
          console.error("Email auth error:", err);
          if (err.code === 'auth/email-already-in-use') {
              setError("An account with this email already exists. Please log in.");
          } else if (err.code === 'auth/weak-password') {
              setError("Password should be at least 6 characters.");
          } else if (err.code === 'auth/invalid-credential') {
              setError("Invalid email or password.");
          } else {
              setError(err.message || "Authentication failed.");
          }
          setIsLoading(false);
      }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!auth) {
          setError("Firebase configuration is missing.");
          return;
      }

      if (!email) {
          setError("Please enter your email address to reset your password.");
          return;
      }

      setIsLoading(true);
      setError(null);
      setSuccessMsg(null);

      try {
          await sendPasswordResetEmail(auth, email);
          setSuccessMsg("Password reset email sent! Please check your inbox.");
          setAuthMode('login');
      } catch (err: any) {
          console.error("Forgot password error:", err);
          if (err.code === 'auth/user-not-found') {
               // For security, it's often better to not reveal if an email exists, 
               // but for UX, we might want to tell them. Let's stick to a generic message.
               setError("If an account with that email exists, a reset link has been sent.");
          } else {
              setError(err.message || "Failed to send reset email.");
          }
      } finally {
          setIsLoading(false);
      }
  };

  const scrollToLogin = () => {
    document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' });
  };

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
              <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex-1 space-y-8 text-center lg:text-left relative z-10"
              >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest border border-gray-200 dark:border-white/20 shadow-sm animate-fade-in">
                      <ShieldCheck size={14} className="text-green-500" /> Medically Approved (FOGSI/WHO)
                  </div>
                  
                  <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">
                      The Medical Standard for <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600">
                          Modern Motherhood.
                      </span>
                  </h1>
                  
                  <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                      More than just a tracker. Bloom provides clinical-grade monitoring, AI report analysis, and personalized risk assessments from conception to postpartum.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={scrollToLogin} className="px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-2xl font-bold text-lg hover:shadow-pink-500/25 hover:shadow-2xl transition-all flex items-center justify-center gap-3">
                          Start Free Profile <ArrowRight size={20} />
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => document.getElementById('features')?.scrollIntoView({behavior:'smooth'})} className="px-8 py-4 bg-white dark:bg-white/5 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-2xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                          <Activity size={20} className="text-gray-500" /> View Features
                      </motion.button>
                  </div>

                  <div className="pt-8 border-t border-gray-100 dark:border-gray-800/50">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Trusted Protocols From</p>
                      <div className="flex flex-wrap gap-4 justify-center lg:justify-start opacity-70 grayscale hover:grayscale-0 transition-all">
                          <span className="text-lg font-bold flex items-center gap-1"><Stethoscope size={16}/> FOGSI (India)</span>
                          <span className="text-lg font-bold flex items-center gap-1"><Shield size={16}/> WHO</span>
                          <span className="text-lg font-bold flex items-center gap-1"><Baby size={16}/> IAP (Pediatrics)</span>
                      </div>
                  </div>
              </motion.div>

              {/* Interactive App Preview */}
              <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex-1 relative w-full flex justify-center lg:justify-end mt-12 lg:mt-0"
              >
                  <div className="relative w-full max-w-[340px] h-[680px] bg-gray-900 rounded-[3.5rem] shadow-2xl border-8 border-gray-900 ring-1 ring-gray-800/50 overflow-hidden transform lg:rotate-[-3deg] hover:rotate-0 transition-transform duration-700 z-20">
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
              </motion.div>
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

              <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[minmax(350px,auto)]"
              >
                  
                  {/* Card 1: AI Reports */}
                  <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="md:col-span-2 bg-white dark:bg-deep-card rounded-[2.5rem] p-10 border border-gray-100 dark:border-indigo-900/50 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
                  >
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
                  </motion.div>

                  {/* Card 2: Risk Engine */}
                  <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="bg-white dark:bg-deep-card rounded-[2.5rem] p-10 border border-gray-100 dark:border-indigo-900/50 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
                  >
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
                  </motion.div>

                  {/* Card 3: Safety Database */}
                  <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-[2.5rem] p-10 text-white shadow-lg relative overflow-hidden group"
                  >
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
                  </motion.div>

                  {/* Card 4: Medical Timeline */}
                  <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="md:col-span-2 bg-gray-900 dark:bg-black rounded-[2.5rem] p-10 text-white shadow-lg relative overflow-hidden"
                  >
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
                  </motion.div>

                  {/* Card 5: Diet & Nutrition */}
                  <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="bg-white dark:bg-deep-card rounded-[2.5rem] p-10 border border-gray-100 dark:border-indigo-900/50 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
                  >
                      <div className="absolute top-0 right-0 w-64 h-64 bg-green-100 dark:bg-green-900/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-700"></div>
                      <div className="relative z-10 h-full flex flex-col justify-between">
                          <div>
                              <div className="w-14 h-14 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300 rounded-2xl flex items-center justify-center mb-6">
                                  <Utensils size={28} />
                              </div>
                              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Trimester-Specific Diet</h3>
                              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                                  Get personalized meal plans tailored to Indian diets. Ensure you're getting the right nutrients like Folic Acid, Iron, and Calcium at the right time.
                              </p>
                          </div>
                          <div className="mt-6">
                              <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                                  <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-sm">
                                      <span className="text-lg">🥬</span>
                                  </div>
                                  <div>
                                      <p className="text-sm font-bold text-gray-900 dark:text-white">Iron-Rich Foods</p>
                                      <p className="text-xs text-gray-500">Crucial for 2nd Trimester</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </motion.div>

                  {/* Card 6: Smart Health Tools */}
                  <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="md:col-span-2 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/10 dark:to-rose-900/10 rounded-[2.5rem] p-10 border border-pink-100 dark:border-pink-900/30 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
                  >
                      <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 h-full">
                          <div className="flex-1">
                              <div className="w-14 h-14 bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300 rounded-2xl flex items-center justify-center mb-6">
                                  <Activity size={28} />
                              </div>
                              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Smart Health Tools</h3>
                              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                                  Everything you need in one place. Monitor fetal movements with the Kick Counter, time labor with the Contraction Timer, and log daily vitals like weight, blood pressure, and blood sugar.
                              </p>
                          </div>
                          <div className="w-full md:w-1/2 flex justify-center gap-4 flex-wrap">
                              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3 w-full max-w-[200px]">
                                  <div className="w-10 h-10 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center"><Baby size={20} /></div>
                                  <span className="font-bold dark:text-white">Kick Counter</span>
                              </div>
                              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3 w-full max-w-[200px]">
                                  <div className="w-10 h-10 bg-purple-100 text-purple-500 rounded-full flex items-center justify-center"><Clock size={20} /></div>
                                  <span className="font-bold dark:text-white">Contractions</span>
                              </div>
                          </div>
                      </div>
                  </motion.div>
              </motion.div>
          </div>
      </section>

      {/* Modes Deep Dive */}
      <section id="modes" className="py-24">
          <div className="max-w-7xl mx-auto px-6 space-y-32">
              
              {/* Planning */}
              <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7 }}
                  className="flex flex-col lg:flex-row items-center gap-16"
              >
                  <div className="flex-1 lg:order-2">
                      <div className="inline-block mb-6">
                          <span className="text-teal-600 font-extrabold tracking-widest uppercase text-sm">Stage 1</span>
                          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2">Conceive with Science.</h2>
                      </div>
                      <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                          Bloom analyzes your menstrual health to predict your most fertile window accurately. We also provide a complete "Body Ready" audit to ensure you are physically prepared for pregnancy, tracking essential vitamins and identifying potential risks early.
                      </p>
                      <div className="grid sm:grid-cols-2 gap-6">
                          {[
                              { title: "Ovulation Tracker", desc: "Predicts peak fertility days using advanced algorithms." },
                              { title: "Cycle Analysis", desc: "Detects irregular patterns and hormonal imbalances." },
                              { title: "Pre-conception Audit", desc: "Rubella, Thalassemia, and essential vitamin checks." },
                              { title: "Two-Week Wait", desc: "Implantation care guide and early symptom tracking." }
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
              </motion.div>

              {/* Pregnancy */}
              <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7 }}
                  className="flex flex-col lg:flex-row items-center gap-16"
              >
                  <div className="flex-1">
                      <div className="inline-block mb-6">
                          <span className="text-pink-600 font-extrabold tracking-widest uppercase text-sm">Stage 2</span>
                          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2">Track Growth, Ensure Safety.</h2>
                      </div>
                      <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                          Your comprehensive guide through 40 weeks. We combine 3D fetus updates with strict medical tracking for Hypertension, GDM, and growth restriction, ensuring you and your baby are healthy every step of the way.
                      </p>
                      <div className="space-y-4">
                          <div className="flex gap-4 items-start p-4 rounded-2xl bg-pink-50 dark:bg-pink-900/10 border border-pink-100 dark:border-pink-900/30">
                              <TrendingUp className="text-pink-600 mt-1 shrink-0" />
                              <div>
                                  <h4 className="font-bold text-gray-900 dark:text-white">Weight Gain Analysis</h4>
                                  <p className="text-sm text-gray-500">Personalized target range based on your pre-pregnancy BMI, helping you avoid complications.</p>
                              </div>
                          </div>
                          <div className="flex gap-4 items-start p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                              <Utensils className="text-blue-600 mt-1 shrink-0" />
                              <div>
                                  <h4 className="font-bold text-gray-900 dark:text-white">Trimester Diet Plans</h4>
                                  <p className="text-sm text-gray-500">Vegetarian & Non-Veg options focusing on Iron, Calcium, and Folate, tailored to your specific trimester needs.</p>
                              </div>
                          </div>
                          <div className="flex gap-4 items-start p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30">
                              <Clock className="text-purple-600 mt-1 shrink-0" />
                              <div>
                                  <h4 className="font-bold text-gray-900 dark:text-white">Labor Tools</h4>
                                  <p className="text-sm text-gray-500">Contraction Timer (5-1-1 Rule), Kick Counter, and Hospital Bag Checklist to prepare you for the big day.</p>
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
              </motion.div>

              {/* Postpartum */}
              <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7 }}
                  className="flex flex-col lg:flex-row items-center gap-16"
              >
                  <div className="flex-1 lg:order-2">
                      <div className="inline-block mb-6">
                          <span className="text-blue-600 font-extrabold tracking-widest uppercase text-sm">Stage 3</span>
                          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2">The Fourth Trimester.</h2>
                      </div>
                      <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                          Comprehensive care for both mom and baby. Track vaccinations, monitor WHO growth standards, and get support for lactation, postpartum depression, and physical recovery.
                      </p>
                      <ul className="space-y-4">
                          <li className="flex items-center gap-4 text-gray-700 dark:text-gray-200">
                              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600"><Ruler size={20}/></div>
                              <span><strong>WHO Growth Charts:</strong> Track Height, Weight, and Head Circumference percentile to ensure healthy development.</span>
                          </li>
                          <li className="flex items-center gap-4 text-gray-700 dark:text-gray-200">
                              <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30 text-teal-600"><Thermometer size={20}/></div>
                              <span><strong>Vaccination Tracker:</strong> Complete IAP immunization schedule with timely reminders so you never miss a dose.</span>
                          </li>
                          <li className="flex items-center gap-4 text-gray-700 dark:text-gray-200">
                              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600"><Baby size={20}/></div>
                              <span><strong>Milestones:</strong> Developmental checklist for motor, cognitive, and social skills (0-12 months).</span>
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
              </motion.div>
          </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gray-50 dark:bg-black/50 border-y border-gray-100 dark:border-white/5">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">How Bloom Works</h2>
                  <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                      A simple, seamless experience designed to give you peace of mind at every step. We guide you from planning to postpartum with clinical precision.
                  </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                  {[
                      { step: "01", title: "Create Your Unique Profile", desc: "Start by telling us your current stage—whether you are planning to conceive, currently pregnant, or in the postpartum phase. We use this information to customize your entire dashboard. By inputting your Last Menstrual Period (LMP), medical history, and specific health goals, Bloom creates a highly personalized experience tailored just for you.", icon: <UserPlus size={24} /> },
                      { step: "02", title: "Log Daily Vitals & Symptoms", desc: "Easily input your daily symptoms, weight, and blood pressure. Our advanced Clinical Risk Engine continuously tracks these metrics against established medical baselines. This proactive monitoring helps detect early signs of conditions like Preeclampsia, Gestational Diabetes, and Anemia, ensuring you and your baby stay safe.", icon: <Activity size={24} /> },
                      { step: "03", title: "AI-Powered Report Analysis", desc: "Simply snap a photo of your medical reports, such as ultrasound (USG) results or blood tests. Our AI, powered by Google Gemini, instantly extracts the text, breaks down complex medical jargon into simple terms, highlights key metrics, and compares them against Indian clinical standards for easy understanding.", icon: <FileText size={24} /> },
                      { step: "04", title: "Follow the FOGSI Timeline", desc: "Never miss an important milestone. Bloom provides a clear timeline based on your LMP, telling you exactly when to schedule crucial tests like the NT Scan, Anomaly Scan, and Glucose Tolerance Test. Our timeline strictly adheres to Indian medical guidelines (FOGSI) for accurate and relevant care.", icon: <Calendar size={24} /> },
                      { step: "05", title: "Check the Safety Database", desc: "Have a question about what's safe? Before taking any medication, using cosmetics, or eating certain foods, quickly scan our comprehensive safety database. Get instant safety ratings and detailed information to ensure every choice you make is safe for both you and your developing baby.", icon: <ShieldCheck size={24} /> },
                      { step: "06", title: "Use Smart Health Tools", desc: "Access essential built-in tools right when you need them. Monitor your baby's movements with the Kick Counter, accurately time your labor with the Contraction Timer, and keep all your vital pregnancy data organized in one secure, easy-to-use application.", icon: <Activity size={24} /> },
                      { step: "07", title: "Generate Health Reports", desc: "Easily compile all your logged vitals, symptoms, and medical history into a comprehensive, beautifully formatted PDF report. This feature allows you to generate a professional summary of your health data, perfect for sharing with your doctor or keeping for your personal records.", icon: <FileText size={24} /> },
                      { step: "08", title: "Postpartum & Beyond", desc: "Our care doesn't stop at birth. In the postpartum phase, we shift our focus to your recovery. Track your baby's feeding and lactation, monitor your mental health, and access resources designed to ensure you heal properly and thrive in your new role as a mother.", icon: <Baby size={24} /> }
                  ].map((item, i) => (
                      <motion.div 
                          key={i} 
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          whileHover={{ y: -8 }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                          className="relative z-10 flex flex-col items-center text-center bg-white dark:bg-deep-card p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-indigo-900/50 transition-shadow hover:shadow-2xl duration-300"
                      >
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-pink-500/30">
                              {item.icon}
                          </div>
                          <span className="text-sm font-black text-gray-300 dark:text-gray-700 mb-2">{item.step}</span>
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h4>
                          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                      </motion.div>
                  ))}
              </div>
          </div>
      </section>

      {/* Comprehensive Tracking Section */}
      <section id="tracking" className="py-20 bg-gray-900 text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12"
          >
              <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 rounded-full text-xs font-bold uppercase mb-6">
                      <Activity size={16} /> All-In-One Dashboard
                  </div>
                  <h2 className="text-4xl font-bold mb-4">Track Every Vital Sign.</h2>
                  <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                      Say goodbye to juggling multiple apps. Bloom integrates everything you need into a single, seamless dashboard. Monitor your baby's activity with the Kick Counter, time your labor accurately with the Contraction Timer, and keep a close eye on your own health with the Weight Tracker, Blood Pressure Log, and Blood Sugar Monitor. Plus, easily generate a comprehensive PDF report of all your health data to share with your doctor.
                  </p>
                  <div className="flex flex-wrap gap-4">
                      <div className="bg-gray-800 px-5 py-3 rounded-xl border border-gray-700">
                          <p className="font-bold text-white mb-1">Kick Counter</p>
                          <p className="text-xs text-gray-400">Track fetal movement patterns and get alerts for any irregularities.</p>
                      </div>
                      <div className="bg-gray-800 px-5 py-3 rounded-xl border border-gray-700">
                          <p className="font-bold text-white mb-1">Contraction Timer</p>
                          <p className="text-xs text-gray-400">Know exactly when to go to the hospital with the 5-1-1 rule.</p>
                      </div>
                      <div className="bg-gray-800 px-5 py-3 rounded-xl border border-gray-700">
                          <p className="font-bold text-white mb-1">PDF Reports</p>
                          <p className="text-xs text-gray-400">Generate and share beautiful health summaries with your doctor.</p>
                      </div>
                  </div>
              </div>
              <div className="flex-1 flex justify-center">
                  <div className="w-64 h-64 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(236,72,153,0.3)]">
                      <Activity size={80} className="text-white" />
                  </div>
              </div>
          </motion.div>
      </section>

      {/* Why Bloom Grid */}
      <section id="science" className="py-24 bg-white dark:bg-deep-bg">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Choose Bloom?</h2>
                  <p className="text-gray-500 dark:text-gray-400">Comparing us to standard period trackers.</p>
              </div>

              <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, staggerChildren: 0.1 }}
                  className="grid md:grid-cols-3 gap-8"
              >
                  <motion.div whileHover={{ y: -5 }} className="p-8 rounded-3xl bg-gray-50 dark:bg-deep-card border border-gray-100 dark:border-indigo-900/30 transition-shadow hover:shadow-xl">
                      <Lock size={32} className="text-gray-900 dark:text-white mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Private & Secure</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                          Your health data belongs to you. We store data locally on your device or use enterprise-grade encryption. No selling data to advertisers.
                      </p>
                  </motion.div>
                  <motion.div whileHover={{ y: -5 }} className="p-8 rounded-3xl bg-pink-50 dark:bg-pink-900/10 border border-pink-100 dark:border-pink-900/30 transition-shadow hover:shadow-xl">
                      <Stethoscope size={32} className="text-pink-600 mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Medical Accuracy</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                          Generic apps guess. We use clinical algorithms for ovulation and risk assessment based on FOGSI & WHO protocols.
                      </p>
                  </motion.div>
                  <motion.div whileHover={{ y: -5 }} className="p-8 rounded-3xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 transition-shadow hover:shadow-xl">
                      <Brain size={32} className="text-purple-600 mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI-Powered</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                          Integrated with Google Gemini to analyze reports, answer complex medical queries, and provide personalized advice instantly.
                      </p>
                  </motion.div>
              </motion.div>
          </div>
      </section>

      {/* Login / Sign Up Anchor */}
      <section id="login-section" className="py-24 bg-gray-50 dark:bg-black/20 flex flex-col items-center justify-center border-t border-gray-200 dark:border-indigo-900">
          
          <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-md w-full px-6 pt-8 bg-white dark:bg-deep-card p-10 rounded-3xl shadow-2xl border border-gray-100 dark:border-indigo-800"
          >
              <div className="text-center mb-10">
                  <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-pink-600">
                      <Heart size={32} fill="currentColor" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Start Your Journey</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Enter your details to access the dashboard.</p>
              </div>

              <div className="space-y-5">
                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400 text-center font-medium">
                      {error}
                    </div>
                  )}
                  {successMsg && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-600 dark:text-green-400 text-center font-medium">
                      {successMsg}
                    </div>
                  )}

                  {authMode === 'forgot' ? (
                      <form onSubmit={handleForgotPassword} className="space-y-4">
                          <div>
                              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                              <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                  <input 
                                      type="email" 
                                      value={email}
                                      onChange={(e) => setEmail(e.target.value)}
                                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all dark:text-white"
                                      placeholder="you@example.com"
                                      required
                                  />
                              </div>
                          </div>
                          <Button 
                              type="submit" 
                              isLoading={isLoading} 
                              className="w-full py-3 text-lg font-bold rounded-xl"
                          >
                              Send Reset Link
                          </Button>
                          <button 
                              type="button" 
                              onClick={() => setAuthMode('login')}
                              className="w-full text-sm text-gray-500 hover:text-pink-600 font-medium"
                          >
                              Back to Login
                          </button>
                      </form>
                  ) : (
                      <form onSubmit={handleEmailAuth} className="space-y-4">
                          <div>
                              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                              <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                  <input 
                                      type="email" 
                                      value={email}
                                      onChange={(e) => setEmail(e.target.value)}
                                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all dark:text-white"
                                      placeholder="you@example.com"
                                      required
                                  />
                              </div>
                          </div>
                          <div>
                              <div className="flex justify-between items-center mb-1">
                                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Password</label>
                                  {authMode === 'login' && (
                                      <button 
                                          type="button" 
                                          onClick={() => setAuthMode('forgot')}
                                          className="text-xs text-pink-600 hover:underline font-medium"
                                      >
                                          Forgot Password?
                                      </button>
                                  )}
                              </div>
                              <div className="relative">
                                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                  <input 
                                      type="password" 
                                      value={password}
                                      onChange={(e) => setPassword(e.target.value)}
                                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all dark:text-white"
                                      placeholder="••••••••"
                                      required
                                      minLength={6}
                                  />
                              </div>
                          </div>
                          <Button 
                              type="submit" 
                              isLoading={isLoading} 
                              className="w-full py-3 text-lg font-bold rounded-xl"
                          >
                              {authMode === 'login' ? 'Sign In' : 'Create Account'}
                          </Button>
                      </form>
                  )}

                  {authMode !== 'forgot' && (
                      <>
                          <div className="relative flex items-center py-2">
                              <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">OR</span>
                              <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                          </div>

                          <Button 
                            onClick={handleGoogleLogin} 
                            isLoading={isLoading} 
                            variant="secondary"
                            className="w-full py-3 text-base font-bold rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-3"
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                          </Button>

                          <div className="text-center mt-4">
                              <button 
                                  onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                                  className="text-sm text-gray-600 dark:text-gray-400 font-medium hover:text-pink-600 dark:hover:text-pink-400"
                              >
                                  {authMode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
                              </button>
                          </div>
                      </>
                  )}
                  
                  <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-800">
                      <p className="text-xs text-gray-400">
                        Secure login powered by Firebase Authentication.
                      </p>
                  </div>
              </div>
          </motion.div>
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
