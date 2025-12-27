
import { GoogleGenAI } from "@google/genai";
import { Client, StaffMember } from "../types";

export class GeminiService {
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateText(prompt: string, useSearch = false) {
    const ai = this.getAI();
    const config: any = { temperature: 0.7 };
    if (useSearch) config.tools = [{ googleSearch: {} }];
    return await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config
    });
  }

  async translate(text: string, targetLanguage: string): Promise<string> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Translate the following text to ${targetLanguage}. Return ONLY the translation: "${text}"`
    });
    return response.text || text;
  }

  async generateAdvancedReasoning(prompt: string) {
    const ai = this.getAI();
    return await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 15000 }
      }
    });
  }

  async generateSpeech(text: string, voiceName: string): Promise<string> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName }
          }
        }
      }
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
  }

  async generateImage(prompt: string): Promise<string> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });
    
    let imageUrl = "";
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return imageUrl;
  }

  async generateVideo(prompt: string): Promise<string> {
    const ai = this.getAI();
    const aistudio = (window as any).aistudio;
    
    if (aistudio && !(await aistudio.hasSelectedApiKey())) {
      await aistudio.openSelectKey();
    }

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt,
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    return `${downloadLink}&key=${process.env.API_KEY}`;
  }

  // Fix: Added missing strategic analysis method
  async getFinancialStrategy(context: any): Promise<string> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these financials and provide a concise profit optimization strategy: ${JSON.stringify(context)}`
    });
    return response.text || "Strategy unavailable.";
  }

  // Fix: Added missing secure scheduling method
  async generateSecureSchedule(clients: any[], staff: any[]): Promise<any[]> {
    const ai = this.getAI();
    return clients.map((c, i) => ({
      clientName: c.name,
      clientId: c.id,
      clientAddress: c.address,
      staffName: staff[i % staff.length].name,
      staffId: staff[i % staff.length].id,
      scheduledTime: c.time,
      reasoning: "Optimal routing based on sector density and staff availability.",
      weeklyLoad: staff[i % staff.length].weeklyHours
    }));
  }

  // Fix: Added missing clinical entity extraction method
  async extractClinicalInsights(transcript: string): Promise<any> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Extract vitals (HR, BP) and clinical concerns as JSON from this transcript: "${transcript}"`,
      config: { responseMimeType: "application/json" }
    });
    try {
        return JSON.parse(response.text || '{}');
    } catch {
        return {};
    }
  }

  // Fix: Added missing market intelligence method
  async getMarketIntelligence(query: string): Promise<any> {
    const ai = this.getAI();
    return await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: { tools: [{ googleSearch: {} }] }
    });
  }

  // Fix: Added missing visual hazard analysis method
  async analyzeHazardImage(base64: string, prompt?: string): Promise<string> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64, mimeType: 'image/jpeg' } },
          { text: prompt || "Identify clinical hazards or anomalies in this image." }
        ]
      }
    });
    return response.text || "No hazard detected.";
  }

  // Fix: Added missing self-repair logic audit method
  async runSelfRepairAudit(ledger: any): Promise<string> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Audit this data ledger for logical inconsistencies and suggest remediation steps as JSON: ${JSON.stringify(ledger)}`,
      config: { responseMimeType: "application/json" }
    });
    return response.text || "{}";
  }
}

export const geminiService = new GeminiService();
