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
    const { history, prompt, modelType, groundingMode } = req.body;
    let modelName = 'gemini-3.5-flash';
    if (modelType === 'complex') modelName = 'gemini-3.1-pro-preview';
    if (modelType === 'fast') modelName = 'gemini-3.1-flash-lite';
    
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
        systemInstruction: "You are an AI assistant in a professional Learning Management System (LMS). You are helpful, professional, and concise. You can assist with learning topics, answer questions using up-to-date information, and guide the user.",
        ...(tools.length > 0 ? { tools } : {})
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/quiz', async (req, res) => {
  try {
    const { fileData, mimeType, numQuestions } = req.body;
    const modelName = 'gemini-3.5-flash';
    
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
    console.error('Gemini error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
