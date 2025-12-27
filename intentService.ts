import { GoogleGenAI, Type } from "@google/genai";
import { AppTab } from "../types";

export interface CommandIntent {
  type: 'NAVIGATE' | 'SEARCH' | 'ACTION' | 'QUERY';
  targetTab?: AppTab;
  query?: string;
  rationale: string;
}

export class IntentService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  async classifyIntent(input: string): Promise<CommandIntent> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    const tabs = Object.values(AppTab).join(', ');

    const prompt = `
      Act as the Neural Command Interface for a Healthcare ERP.
      User Input: "${input}"
      Available Tabs: ${tabs}
      
      Task: Determine if the user wants to navigate to a tab, search for someone, perform an action (like clocking out), or ask a general query.
      Return JSON: { "type": "NAVIGATE|SEARCH|ACTION|QUERY", "targetTab": "string?", "query": "string?", "rationale": "string" }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              targetTab: { type: Type.STRING },
              query: { type: Type.STRING },
              rationale: { type: Type.STRING }
            }
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      return data as CommandIntent;
    } catch (e) {
      return { type: 'QUERY', query: input, rationale: "Defaulting to query mode." };
    }
  }
}

export const intentService = new IntentService();