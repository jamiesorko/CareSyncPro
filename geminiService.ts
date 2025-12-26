
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { scrubbingService } from './scrubbingService';
import { Client, StaffMember } from '../types';
import { anonymizationService, HydratedScheduleEntry } from './anonymizationService';

export class GeminiService {
  /**
   * Helper to always initialize a fresh instance with the pre-configured API key.
   */
  private getAIInstance() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateSecureSchedule(clients: Client[], staff: StaffMember[]): Promise<HydratedScheduleEntry[]> {
    const ai = this.getAIInstance();
    const { payload, lookups } = anonymizationService.prepareAnonymizedPayload(clients, staff);

    const prompt = `
      Act as a Neural Fleet Optimization Architect. 
      DATA: ${JSON.stringify(payload)}
      
      HARD CONSTRAINTS (IMMOVABLE):
      1. WEEKLY CEILING: No staff member can exceed 40 total units.
      2. DAILY FLOOR: Every active staff member must have a minimum of 3 units per deployment cycle.
      
      OPTIMIZATION STRATEGY:
      - TEMPORAL CHAINING: Strictly prioritize back-to-back sequencing for the same staff member.
      - ELIMINATE IDLE TIME: Sequence visits with 0 minutes of unpaid downtime between appointments where geographic distance allows.
      - Eliminate "Temporal Friction" (unpaid gap time).
      
      OUTPUT: Return a JSON array of { "clientId": "string", "staffId": "string", "scheduledTime": "string", "reasoning": "string" }.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
          responseMimeType: "application/json",
          temperature: 0.1
        }
      });
      
      const anonymizedOutput = JSON.parse(response.text || "[]");
      return anonymizationService.hydrateSchedule(anonymizedOutput, lookups);
    } catch (e) {
      console.error("Neural Optimization Failed:", e);
      return [];
    }
  }

  async generateText(prompt: string, useSearch: boolean) {
    const ai = this.getAIInstance();
    const safePrompt = scrubbingService.cleanText(prompt);
    const config: any = { temperature: 0.7 };
    if (useSearch) config.tools = [{ googleSearch: {} }];
    return await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: safePrompt, config });
  }

  async translate(text: string, targetLanguage: string): Promise<string> {
    const ai = this.getAIInstance();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Translate to ${targetLanguage}: "${scrubbingService.cleanText(text)}"`
    });
    return response.text || text;
  }

  async generateSpeech(text: string, voice: string): Promise<string> {
    const ai = this.getAIInstance();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say: ${scrubbingService.cleanText(text)}` }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
  }

  /**
   * Added missing generateImage method for ImageLab.tsx
   */
  async generateImage(prompt: string): Promise<string[]> {
    const ai = this.getAIInstance();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: scrubbingService.cleanText(prompt) }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      },
    });
    
    const urls: string[] = [];
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          urls.push(`data:image/png;base64,${part.inlineData.data}`);
        }
      }
    }
    return urls;
  }

  /**
   * Added missing generateVideo method for VideoLab.tsx
   */
  async generateVideo(prompt: string): Promise<string> {
    const ai = this.getAIInstance();
    
    // Mandating API key selection for Veo models per guidelines
    if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
      await window.aistudio.openSelectKey();
    }

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: scrubbingService.cleanText(prompt),
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    return `${downloadLink}&key=${process.env.API_KEY}`;
  }

  /**
   * Added missing getFinancialStrategy method for CEOFinancials.tsx
   */
  async getFinancialStrategy(context: any): Promise<string> {
    const ai = this.getAIInstance();
    const prompt = `
      Act as a Lead Healthcare CEO Strategist.
      Context: ${JSON.stringify(context)}
      Task: Provide a concise, 100-word financial optimization strategy.
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { 
        thinkingConfig: { thinkingBudget: 5000 } 
      }
    });
    return response.text || "Financial outlook stable.";
  }

  /**
   * Added missing extractClinicalInsights method for NeuralScribe.tsx
   */
  async extractClinicalInsights(transcript: string): Promise<any> {
    const ai = this.getAIInstance();
    const prompt = `
      Act as a Lead Medical Informaticist.
      Transcript: "${transcript}"
      Task: Extract vitals and clinical status in JSON format.
      Return JSON: { "vitals": { "heartRate": "", "bp": "" }, "summary": "" }
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{}');
  }

  /**
   * Added missing getMarketIntelligence method for various services
   */
  async getMarketIntelligence(query: string) {
    const ai = this.getAIInstance();
    return await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
  }

  /**
   * Added missing analyzeHazardImage method for VisionDiagnostics.tsx
   */
  async analyzeHazardImage(base64: string, customPrompt?: string): Promise<string> {
    const ai = this.getAIInstance();
    const prompt = customPrompt || "Analyze this clinical environment image for hazards or anomalies. Provide a concise triage assessment.";
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64, mimeType: 'image/jpeg' } },
          { text: prompt }
        ]
      }
    });
    return response.text || "Vision analysis unavailable.";
  }

  /**
   * Added missing generateAdvancedReasoning method for deep interrogations
   */
  async generateAdvancedReasoning(prompt: string) {
    const ai = this.getAIInstance();
    return await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: scrubbingService.cleanText(prompt),
      config: {
        thinkingConfig: { thinkingBudget: 15000 }
      }
    });
  }

  /**
   * Added missing runSelfRepairAudit method for NeuralSelfHealingStation.tsx
   */
  async runSelfRepairAudit(dataset: any): Promise<string> {
    const ai = this.getAIInstance();
    const prompt = `
      Task: Integrity Self-Healing Sweep.
      Dataset: ${JSON.stringify(dataset)}
      Return JSON: { "remediation": "string", "driftDetected": boolean }
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return response.text || '{"driftDetected": false}';
  }
}

export const geminiService = new GeminiService();
