import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { GoogleGenerativeAI, Schema, Type } from '@google/generative-ai'
import dotenv from 'dotenv'

// Load .env file for local development
dotenv.config()

const geminiMiddleware = () => ({
  name: 'gemini-middleware',
  configureServer(server: any) {
    server.middlewares.use('/api/analyze-prescription', async (req: any, res: any) => {
      if (req.method !== 'POST') {
        res.statusCode = 405;
        res.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
      }

      let body = '';
      req.on('data', (chunk: Buffer) => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        try {
          const { imageBase64 } = JSON.parse(body);
          if (!imageBase64) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'No image provided' }));
            return;
          }

          const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
          if (!apiKey) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'API key not configured' }));
            return;
          }

          const genAI = new GoogleGenerativeAI(apiKey);
          const medicineSchema: Schema = {
            type: Type.ARRAY,
            description: "List of medicines",
            items: {
              type: Type.OBJECT,
              properties: {
                medicine: { type: Type.STRING },
                brand: { type: Type.STRING, nullable: true },
                generic: { type: Type.STRING, nullable: true },
                dosage: { type: Type.STRING },
                frequency: { type: Type.STRING },
                timing: { type: Type.STRING },
                duration: { type: Type.STRING },
                instruction: { type: Type.STRING },
                foodRelation: { type: Type.STRING, nullable: true },
                notes: { type: Type.STRING, nullable: true },
                confidenceScore: { type: Type.NUMBER }
              },
              required: ["medicine", "dosage", "frequency", "timing", "duration", "instruction", "confidenceScore"]
            }
          };

          const model = genAI.getGenerativeModel({ 
            model: 'gemini-2.5-flash',
            generationConfig: { responseMimeType: "application/json", responseSchema: medicineSchema }
          });

          const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
          const mimeType = imageBase64.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg';

          const result = await model.generateContent([
            "Analyze this prescription. Extract ALL medicines. If blurry, try your best. If none, return [].", 
            { inlineData: { data: base64Data, mimeType } }
          ]);
          
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ medicines: JSON.parse(result.response.text()) }));

        } catch (error: any) {
          console.error(error);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: error.message }));
        }
      });
    });
  }
});

export default defineConfig({
  plugins: [react(), geminiMiddleware()],
})
