import { GoogleGenerativeAI, Schema, Type } from '@google/generative-ai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64 } = req.body;
    
    if (!imageBase64) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GOOGLE_GEMINI_API_KEY is not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Define the schema for the output
    const medicineSchema: Schema = {
      type: Type.ARRAY,
      description: "List of medicines detected in the prescription",
      items: {
        type: Type.OBJECT,
        properties: {
          medicine: { type: Type.STRING, description: "Main medicine name" },
          brand: { type: Type.STRING, description: "Brand name if available", nullable: true },
          generic: { type: Type.STRING, description: "Generic name if available", nullable: true },
          dosage: { type: Type.STRING, description: "Dosage (e.g. 500mg)" },
          frequency: { type: Type.STRING, description: "Frequency (e.g. Twice a day)" },
          timing: { type: Type.STRING, description: "Timing (e.g. Morning & Night)" },
          duration: { type: Type.STRING, description: "Duration (e.g. 30 Days)" },
          instruction: { type: Type.STRING, description: "Specific instructions (e.g. Take one tablet after breakfast)" },
          foodRelation: { type: Type.STRING, description: "Before Food / After Food / With Food", nullable: true },
          notes: { type: Type.STRING, description: "Any extra notes", nullable: true },
          confidenceScore: { type: Type.NUMBER, description: "Confidence score 0-100" }
        },
        required: ["medicine", "dosage", "frequency", "timing", "duration", "instruction", "confidenceScore"]
      }
    };

    // Note: User's API key might only have access to gemini-2.5-flash based on earlier logs in the prompt.
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: medicineSchema,
      }
    });

    const prompt = `Analyze this prescription carefully. Detect ALL medicines written. Extract the details accurately according to the schema. If it's a blurry image, try your best. If no medicines are found, return an empty array.`;
    
    // The imageBase64 from frontend will likely include the data URI prefix (e.g. data:image/jpeg;base64,...).
    // We need to strip it for Gemini, or pass it correctly.
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const mimeType = imageBase64.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg';

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    };

    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();
    
    // The response is guaranteed to be a JSON string matching the schema.
    const medicines = JSON.parse(responseText);

    return res.status(200).json({ medicines });

  } catch (error: any) {
    console.error('Error analyzing prescription:', error);
    return res.status(500).json({ error: error.message || 'Failed to analyze prescription' });
  }
}
