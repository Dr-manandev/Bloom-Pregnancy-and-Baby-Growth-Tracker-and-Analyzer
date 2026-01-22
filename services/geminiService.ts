
import { GoogleGenAI } from "@google/genai";
import { ReportAnalysis, MedicineSafetyResult } from '../types';

const getAi = () => {
  const key = localStorage.getItem('bloom_user_api_key');
  if (!key) {
    throw new Error("MISSING_API_KEY");
  }
  return new GoogleGenAI({ apiKey: key });
};

// System instruction for strict Indian Medical Context
const SYSTEM_INSTRUCTION = `
You are Dr. Bloom, a senior Consultant Obstetrician & Gynecologist and Pediatrician practicing in India.
1. STRICT ADHERENCE: You must strictly follow guidelines from FOGSI (Federation of Obstetric and Gynaecological Societies of India), IAP (Indian Academy of Pediatrics), and WHO.
2. CONTEXT: Consider Indian demographics, diet (vegetarianism), and common conditions (Anemia, Thalassemia, GDM).
3. TONE: Professional, reassuring, yet direct and clinically accurate.
4. SPEED: Be concise. Do not fluff. Get straight to the medical facts.
5. DISCLAIMER: Always imply that you are an AI assistant and they must consult their physical doctor.
`;

export const analyzeMedicalReport = async (
  base64Image: string,
  mimeType: string,
  userContext: string
): Promise<ReportAnalysis> => {
  try {
    const ai = getAi();
    // gemini-3-flash-preview is the fastest multimodal model
    const model = 'gemini-3-flash-preview';

    const prompt = `
      Analyze this medical image (USG, Blood Test, or Lab Report) for a pregnant patient or newborn.
      Context: ${userContext}
      
      OUTPUT FORMAT: JSON ONLY. No markdown.
      Structure:
      {
        "type": "USG" | "Blood" | "Lab",
        "summary": "Concise clinical summary (max 3 sentences).",
        "warnings": ["List of abnormal values based on INDIAN STANDARDS (e.g. Hb < 11 is anemia)."],
        "recommendations": ["Actionable medical advice (FOGSI/IAP guidelines)."],
        "rawText": "Technical extraction of key values."
      }
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        systemInstruction: SYSTEM_INSTRUCTION
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...JSON.parse(text)
    };
  } catch (error: any) {
    if (error.message === 'MISSING_API_KEY') throw error;
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze report. Ensure image is clear.");
  }
};

export const getPregnancyAdvice = async (query: string, week: number): Promise<string> => {
  try {
    const ai = getAi();
    const model = 'gemini-3-flash-preview';

    const response = await ai.models.generateContent({
      model: model,
      contents: `User is ${week} weeks pregnant. Question: "${query}".
      Provide a fast, 100% medically accurate answer based on FOGSI/WHO guidelines. 
      Keep it under 100 words unless complex. Focus on safety.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION
      }
    });
    return response.text || "Could not retrieve advice.";
  } catch (error: any) {
    if (error.message === 'MISSING_API_KEY') return "MISSING_KEY";
    console.error("Gemini Advice Error:", error);
    return "Sorry, I am having trouble connecting to the knowledge base.";
  }
};

export const checkMedicineSafety = async (medicineName: string, week: number, context: 'pregnancy' | 'lactation' = 'pregnancy'): Promise<MedicineSafetyResult> => {
  try {
    const ai = getAi();
    const model = 'gemini-3-flash-preview';

    const contextStr = context === 'lactation' 
      ? "breastfeeding mother (Lactation)" 
      : `pregnant woman at ${week} weeks`;

    const prompt = `
      Analyze safety of: "${medicineName}" for ${contextStr}.
      Reference: DCGI (India), FDA, and FOGSI formularies.
      
      OUTPUT JSON ONLY:
      {
        "status": "Safe" | "Caution" | "Unsafe",
        "description": "Clinical reasoning (e.g. 'Passes into breastmilk', 'Teratogenic risk'). Max 2 sentences.",
        "alternatives": ["Generic names of safer alternatives if Unsafe/Caution"]
      }
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        systemInstruction: SYSTEM_INSTRUCTION
      }
    });
    
    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text);
  } catch (error: any) {
    if (error.message === 'MISSING_API_KEY') throw error;
    console.error("Medicine Check Error:", error);
    return {
      status: 'Unknown',
      description: "Could not verify safety. Please check your network or API Key.",
      alternatives: []
    };
  }
};
