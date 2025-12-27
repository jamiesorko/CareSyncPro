import { GoogleGenAI } from "@google/genai";
import { Client, PatientDailySynthesis, ZenVideoPrompt } from '../types';

export class PatientWellnessService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  /**
   * Translates clinical logs into a warm, positive daily summary for the patient.
   */
  async synthesizeDailySuccess(client: Client, logs: string[]): Promise<PatientDailySynthesis> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    
    const prompt = `
      Act as a warm, reassuring Bedside Companion.
      Patient: ${client.name}
      Daily Care Logs: "${logs.join(' | ')}"
      
      Task: Synthesize a "Daily Success" briefing for the patient's tablet.
      1. Write a happy headline.
      2. List 3 simple accomplishments (e.g., "You took a lovely walk", "You finished your healthy breakfast").
      3. Identify who visited today.
      4. Give a small preview of tomorrow.
      5. Add a soothing closing note.
      
      Return JSON: { 
        "headline": "", 
        "accomplishments": [], 
        "visitorToday": "", 
        "tomorrowPreview": "", 
        "soothingNote": "" 
      }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      return JSON.parse(response.text || '{}');
    } catch (e) {
      return {
        headline: "You've Had a Wonderful Day!",
        accomplishments: ["You rested comfortably.", "You received excellent care."],
        visitorToday: "Our dedicated team.",
        tomorrowPreview: "A new day of recovery.",
        soothingNote: "We are here for you always."
      };
    }
  }

  /**
   * Generates a therapeutic calming video prompt for Veo based on patient history.
   */
  async forgeZenPrompt(client: Client): Promise<ZenVideoPrompt> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    
    const prompt = `
      Patient: ${client.name}
      Background: ${client.description}
      Task: Create a 30-second therapeutic Veo video prompt for a calming 'Zen' experience. 
      Focus on nature, soft music, and nostalgia if relevant.
      Return JSON: { "prompt": "string", "mood": "string", "duration": 30 }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text || '{}');
      return {
        prompt: data.prompt || "A peaceful autumn forest with falling leaves and soft sunlight.",
        mood: data.mood || "Calming",
        estimatedDuration: 30
      };
    } catch (e) {
      return { prompt: "A serene ocean sunset.", mood: "Peaceful", estimatedDuration: 30 };
    }
  }

  async generateZenVideo(prompt: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    
    // Check key selection for Veo
    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) await window.aistudio.openSelectKey();
    }

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 8000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    return `${downloadLink}&key=${this.getApiKey()}`;
  }
}

export const patientWellnessService = new PatientWellnessService();
