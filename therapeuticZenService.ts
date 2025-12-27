import { GoogleGenAI } from "@google/genai";
import { Client, ZenVideoPrompt } from '../types';

export class TherapeuticZenService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  /**
   * Generates a calming VEO prompt tailored to the patient's specific history/interests.
   */
  async generateCalmingPrompt(client: Client): Promise<ZenVideoPrompt> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    
    const prompt = `
      Act as a Lead Music & Art Therapist specializing in Dementia care.
      Patient: ${client.name}
      Background: ${client.description}
      Current State: ${client.risk?.factors.join(', ') || 'Stable'}
      
      Task: Design a 30-second therapeutic visual experience.
      1. Identify a theme (e.g., 1950s garden, quiet snowfall, calm ocean).
      2. Write a high-fidelity Veo prompt for a cinematic, slow-motion loop.
      3. Identify the target 'Mood' (Calming, Nostalgic, Uplifting).
      
      Return JSON: { "prompt": "", "mood": "", "duration": 30 }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const data = JSON.parse(response.text || '{}');
      return {
        prompt: data.prompt || "A soft, sun-drenched library with dust motes dancing in the light.",
        mood: data.mood || "Calming",
        estimatedDuration: 30
      };
    } catch (e) {
      return { prompt: "A serene forest path with a gentle breeze.", mood: "Peaceful", estimatedDuration: 30 };
    }
  }

  async synthesizeZenMoment(prompt: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    
    if (!(await (window as any).aistudio.hasSelectedApiKey())) {
      await (window as any).aistudio.openSelectKey();
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

export const therapeuticZenService = new TherapeuticZenService();