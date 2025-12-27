import { geminiService } from './geminiService'

export interface SentimentPulse {
  score: number; // -1 to 1
  dominantEmotion: string;
  isBurnoutRisk: boolean;
  isDistressDetected: boolean;
}

export class SentimentService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Analyzes text for underlying sentiment and staff risk factors.
   */
  async analyzePulse(text: string): Promise<SentimentPulse> {
    const prompt = `
      Context: Healthcare Professional Wellbeing.
      Input Text: "${text}"
      Task: Detect emotional state, burnout markers, or professional distress.
      Return JSON: { "score": number, "emotion": "string", "burnout": boolean, "distress": boolean }
    `;

    try {
      const response = await geminiService.generateText(prompt, false);
      const data = JSON.parse(response.text || '{}');
      return {
        score: data.score || 0,
        dominantEmotion: data.emotion || 'Neutral',
        isBurnoutRisk: !!data.burnout,
        isDistressDetected: !!data.distress
      };
    } catch (e) {
      return { score: 0, dominantEmotion: 'Unknown', isBurnoutRisk: false, isDistressDetected: false };
    }
  }
}

export const sentimentService = new SentimentService();