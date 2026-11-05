import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Server-side Gemini AI Client with required User-Agent
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

app.post('/api/assistant/chat', async (req, res) => {
  try {
    const { message, plantName, species, telemetry, language, languageCode, nativeName } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY not configured on server',
        fallback: true
      });
    }

    const userLanguage = language || 'English';

    const systemInstruction = `You are Flora, the ultra-smart, empathetic, and scientifically rigorous agricultural AI voice and text assistant for the AgroSmart Smart Plant Monitoring & Irrigation System (like Siri and Alexa for plants).
You are speaking with a grower cultivating "${plantName || 'Crop'}" (${species || 'Vegetative crop'}).

CRITICAL LANGUAGE REQUIREMENT:
The user has selected the language: ${userLanguage} (${nativeName || ''}, ISO code: ${languageCode || 'en'}).
You MUST understand user queries in any language (including regional Indian languages and international foreign languages), and you MUST ALWAYS formulate your entire response directly in ${userLanguage} using its native script, natural phrasing, and appropriate terminology.
For instance:
- If Hindi, respond entirely in authentic Devanagari script (हिन्दी).
- If Bengali, respond entirely in Bengali script (বাংলা).
- If Telugu, respond entirely in Telugu script (తెలుగు).
- If Tamil, respond entirely in Tamil script (தமிழ்).
- If Marathi, respond entirely in Marathi (मराठी).
- If Gujarati, respond entirely in Gujarati (ગુજરાતી).
- If Urdu, respond in Urdu (اردو).
- If Spanish, respond in fluent Spanish (Español).
- If French, respond in French (Français).
- If German, respond in German (Deutsch).
- If Japanese, respond in Japanese (日本語).
- If Arabic, respond in Arabic (العربية).
- And likewise for whichever of the 22 Indian regional languages or foreign languages the user selected.

Current Live IoT Telemetry:
- Soil Moisture: ${telemetry?.soilMoisture ?? '43.8'}%
- Substrate/Canopy Temp: ${telemetry?.temperature ?? '24.8'}°C
- Air Humidity: ${telemetry?.humidity ?? '61.4'}% RH
- Soil pH: ${telemetry?.soilPH ?? '6.45'}
- Electrical Conductivity (EC): ${telemetry?.soilEC ?? '1.88'} mS/cm
- NPK Nutrients: N=${telemetry?.nitrogen ?? '48'} mg/kg, P=${telemetry?.phosphorus ?? '32'} mg/kg, K=${telemetry?.potassium ?? '190'} mg/kg
- Pump Status: ${telemetry?.pumpActual ? 'Running (Flowing)' : 'Standby / Idle'}
- Rain Delay: ${telemetry?.rainDelayActive ? 'Active' : 'Inactive'}

Behavior rules:
1. Speak concisely, clearly, and warmly (optimized for speech synthesis text-to-speech in ${userLanguage}). Keep answers between 2 and 4 sentences unless asked for an in-depth explanation.
2. Ground all advice directly in their actual sensor numbers.
3. If the user gives a voice or text command like turning on/off the pump, emergency stop, or rain delay in any language or phrasing, acknowledge it warmly and confirm the execution in ${userLanguage}.
4. Help beginners understand terms like pH, EC, NPK, and VPD in friendly everyday language.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message || 'Hello Flora, what is the status of my plant?',
      config: {
        systemInstruction,
      },
    });

    return res.json({
      reply: response.text || 'Flora is online. How can I assist your crop today?',
      source: 'gemini'
    });
  } catch (error: any) {
    console.error('Flora AI server error:', error);
    return res.status(500).json({
      error: error.message || 'Flora encountered a temporary connection issue.',
      fallback: true
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AgroSmart server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
