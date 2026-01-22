
import React, { useState } from 'react';
import { Upload, FileText, X, AlertTriangle, CheckCircle, Key } from 'lucide-react';
import { Button } from './Button';
import { analyzeMedicalReport } from '../services/geminiService';
import { ReportAnalysis } from '../types';

export const ReportAnalyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<ReportAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [missingKey, setMissingKey] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selected);
      setReport(null);
      setError(null);
      setMissingKey(false);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !preview) return;

    setAnalyzing(true);
    setError(null);
    setMissingKey(false);

    try {
      const base64Data = preview.split(',')[1];
      const mimeType = file.type;
      
      const result = await analyzeMedicalReport(base64Data, mimeType, "Patient is currently in 2nd Trimester.");
      setReport(result);
    } catch (err: any) {
      if (err.message === 'MISSING_API_KEY') {
          setMissingKey(true);
      } else {
          setError("Failed to analyze the document. Ensure it is a clear image.");
      }
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* Upload Section */}
      <div className="flex flex-col gap-6">
        <div className="bg-white dark:bg-deep-card p-8 rounded-3xl shadow-lg border-2 border-dashed border-gray-300 dark:border-indigo-700 hover:border-bloom-DEFAULT dark:hover:border-bloom-DEFAULT transition-colors text-center relative">
          
          {!preview ? (
            <>
              <div className="w-16 h-16 bg-gray-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500 dark:text-indigo-300">
                <Upload size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Upload Report</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Support for USG images, Blood test photos (JPG/PNG)</p>
              
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button className="mx-auto pointer-events-none">Select File</Button>
            </>
          ) : (
            <div className="relative h-full flex flex-col items-center">
              <img src={preview} alt="Preview" className="max-h-64 rounded-xl shadow-md mb-4" />
              <div className="flex gap-4">
                  <Button onClick={handleAnalyze} isLoading={analyzing}>Analyze with AI</Button>
                  <Button variant="ghost" onClick={() => { setFile(null); setPreview(null); setReport(null); }}>
                    <X size={20} /> Remove
                  </Button>
              </div>
            </div>
          )}
        </div>

        {missingKey && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl flex items-center gap-3 border border-red-200 dark:border-red-800">
                <Key size={24} className="shrink-0" />
                <div>
                    <strong>AI Key Missing:</strong> You need a Gemini API Key to use this feature. Please add it in your Profile.
                </div>
            </div>
        )}

        {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-xl flex items-center gap-2">
                <AlertTriangle size={20} /> {error}
            </div>
        )}
      </div>

      {/* Result Section */}
      <div className="bg-white dark:bg-deep-card rounded-3xl shadow-lg border border-bloom-100 dark:border-indigo-800 p-6 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-indigo-800 pb-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
                <FileText className="text-bloom-DEFAULT" /> Analysis Results
            </h3>
            {report && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">{report.type}</span>}
        </div>

        {analyzing ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
                <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                        </div>
                    </div>
                </div>
                <p>Analyzing document...</p>
            </div>
        ) : report ? (
            <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar h-[500px]">
                <div>
                    <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Summary</h4>
                    <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-indigo-950/30 p-4 rounded-xl">
                        {report.summary}
                    </p>
                </div>

                {report.warnings.length > 0 && (
                    <div>
                        <h4 className="font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                            <AlertTriangle size={16} /> Alerts
                        </h4>
                        <ul className="space-y-2">
                            {report.warnings.map((w, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                                    <span>•</span> {w}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {report.recommendations.length > 0 && (
                    <div>
                        <h4 className="font-bold text-green-600 dark:text-green-400 mb-2 flex items-center gap-2">
                            <CheckCircle size={16} /> Recommendations
                        </h4>
                        <ul className="space-y-2">
                            {report.recommendations.map((r, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-900/30">
                                    <span>•</span> {r}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-gray-400">
                        Disclaimer: This analysis is generated by AI and should not replace professional medical advice. Always consult your doctor.
                    </p>
                </div>
            </div>
        ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-center p-8">
                <p>Upload a document to see the detailed breakdown here.</p>
            </div>
        )}
      </div>
    </div>
  );
};
