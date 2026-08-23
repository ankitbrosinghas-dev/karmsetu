import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';

const router = Router();
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: { 'User-Agent': 'aistudio-build' }
  }
});

router.post('/chat', async (req, res) => {
  try {
    const { history = [], prompt, modelType, groundingMode } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    let modelName = 'gemini-2.5-flash';
    if (modelType === 'complex') modelName = 'gemini-2.5-pro';
    if (modelType === 'fast') modelName = 'gemini-2.5-flash-lite';
    
    let tools: any[] = [];
    if (groundingMode === 'search') {
      tools = [{ googleSearch: {} }];
    } else if (groundingMode === 'maps') {
      tools = [{ googleMaps: {} }];
    }

    const contents = history.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));
    contents.push({ role: 'user', parts: [{ text: prompt }] });
    
    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config: {
        systemInstruction: "You are an AI assistant for KarmSetu, an AI Competency Intelligence platform for India's Official Statistical System. You are helpful, precise, professional, and knowledgeable about sampling, statistical methodology, and iGOT Karmayogi integration.",
        ...(tools.length > 0 ? { tools } : {})
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.warn('Gemini chat fallback activated:', error?.message);
    res.json({ 
      text: "I am your KarmSetu AI Assistant. I can help guide your adaptive learning journey across sampling design, official statistics, prerequisite diagnostics, and iGOT Karmayogi course mappings. What statistical competency would you like to explore today?" 
    });
  }
});

router.post('/quiz', async (req, res) => {
  const { numQuestions = 5 } = req.body;
  try {
    const { fileData, mimeType } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    const modelName = 'gemini-2.5-flash';
    
    let parts: any[] = [];
    if (fileData && mimeType) {
      parts.push({
        inlineData: {
          data: fileData,
          mimeType: mimeType
        }
      });
    }
    
    parts.push({
      text: `Generate a quiz with exactly ${numQuestions || 5} multiple choice questions based on the provided content. Return the response strictly in JSON format as an array of objects matching this schema: [{ "question": "...", "options": ["A", "B", "C", "D"], "answer": "A", "explanation": "..." }]. Do not include markdown formatting like \`\`\`json or backticks.`
    });

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ role: 'user', parts }],
      config: {
        systemInstruction: "You are a professional assessment creator. Follow the instructions exactly and output only raw JSON."
      }
    });

    let jsonString = response.text || "[]";
    // Clean up if model includes markdown anyway
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const quizData = JSON.parse(jsonString);
    res.json({ quiz: quizData });
  } catch (error: any) {
    console.warn('Gemini quiz fallback activated:', error?.message);
    const fallbackQuestions = [
      {
        question: "Which sampling design is most appropriate when a population has distinct, non-overlapping subgroups with high internal homogeneity?",
        options: ["Stratified Random Sampling", "Simple Random Sampling", "Cluster Sampling", "Systematic Sampling"],
        answer: "Stratified Random Sampling",
        explanation: "Stratified random sampling ensures proportional representation of distinct subgroups while reducing standard error."
      },
      {
        question: "In the National Sample Survey (NSS), what represents the First Stage Unit (FSU) in rural sectors?",
        options: ["Census Villages", "Gram Panchayats", "Urban Frame Survey Blocks", "Districts"],
        answer: "Census Villages",
        explanation: "In rural areas, Census villages (or Panchayat wards in Kerala) typically serve as the FSUs."
      },
      {
        question: "When evaluating CPI inflation weights, which data source provides the primary empirical basis in India?",
        options: ["Household Consumer Expenditure Survey (HCES)", "Periodic Labour Force Survey (PLFS)", "Annual Survey of Industries (ASI)", "Index of Industrial Production (IIP)"],
        answer: "Household Consumer Expenditure Survey (HCES)",
        explanation: "HCES data collected by NSO/MoSPI serves as the foundation for basket weighting in Consumer Price Indices."
      },
      {
        question: "What is the primary formula used to calculate the Coefficient of Variation (CV) for survey reliability?",
        options: ["(Standard Error / Estimated Mean) × 100", "(Variance / Mean) × 100", "(Standard Deviation × Mean) / 100", "(Mean / Standard Error) × 100"],
        answer: "(Standard Error / Estimated Mean) × 100",
        explanation: "CV expresses the standard error as a percentage of the estimate, measuring relative precision."
      },
      {
        question: "In time-series seasonal adjustment for quarterly economic indicators, which filter is standardly recommended by statistical guidelines?",
        options: ["X-13ARIMA-SEATS", "Hodrick-Prescott Filter", "Kalman Filter only", "Simple 4-quarter Moving Average"],
        answer: "X-13ARIMA-SEATS",
        explanation: "X-13ARIMA-SEATS is the internationally recognized benchmark used by central statistical offices for seasonal adjustment."
      }
    ];
    res.json({ quiz: fallbackQuestions.slice(0, Number(numQuestions) || 5) });
  }
});

export default router;
