import { geminiService } from './geminiService';

export interface AudioAnalysisResult {
  stressLevel: number; // 0-1
  fatigueDetected: boolean;
  urgencyScore: number; // 0-10
  sentiment: string;
  clinicalKeywords: string[];
}

export class AudioAnalysisService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Uses Gemini to perform a deep analysis of a clinical voice transcript.
   * In a production environment, this would ingest the raw audio buffer.
   */
  async analyzeVocalLog(transcript: string): Promise<AudioAnalysisResult> {
    console.log(`[NEURAL_AUDIO]: Analyzing vocal vectors for semantic and emotional drift.`);
    
    const prompt = `Analyze this caregiver clinical log transcript: "${transcript}".
    Assess for stress markers, fatigue, and clinical urgency.
    Return JSON: { "stress": number, "fatigue": boolean, "urgency": number, "sentiment": string, "keywords": string[] }`;

    try {
      const response = await geminiService.generateText(prompt, false);
      const data = JSON.parse(response.text || '{}');
      return {
        stressLevel: data.stress || 0.1,
        fatigueDetected: !!data.fatigue,
        urgencyScore: data.urgency || 1,
        sentiment: data.sentiment || "Neutral",
        clinicalKeywords: data.keywords || []
      };
    } catch (e) {
      return { stressLevel: 0, fatigueDetected: false, urgencyScore: 0, sentiment: "Unknown", clinicalKeywords: [] };
    }
  }
}

export const audioAnalysisService = new AudioAnalysisService();