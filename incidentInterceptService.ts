import { GoogleGenAI } from "@google/genai";
import { Client, StaffMember } from '../types';

export interface InterceptVector {
  responderId: string;
  responderName: string;
  etaMinutes: number;
  distanceKm: number;
  priorityDirective: string;
}

export class IncidentInterceptService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  /**
   * Calculates the optimal rescue vector using grounded traffic and fleet proximity.
   */
  async calculateIntercept(client: Client, availableResponders: StaffMember[]): Promise<InterceptVector> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    
    const context = {
      location: client.address,
      urgency: "CRITICAL_FALL",
      responders: availableResponders.map(s => ({ id: s.id, name: s.name, role: s.role }))
    };

    const prompt = `
      Act as a Tactical Emergency Dispatch AI. 
      Scenario: ${JSON.stringify(context)}
      
      Task: 
      1. Use Search Grounding to check live traffic/transit delays near ${client.address}, Ontario.
      2. Select the absolute best responder from the list.
      3. Calculate ETA in minutes.
      4. Provide a 1-sentence "Golden Hour" directive.
      
      Return JSON: { "id": "string", "name": "string", "eta": number, "dist": number, "directive": "string" }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json" 
        }
      });

      const data = JSON.parse(response.text || '{}');
      return {
        responderId: data.id || availableResponders[0]?.id,
        responderName: data.name || availableResponders[0]?.name,
        etaMinutes: data.eta || 15,
        distanceKm: data.dist || 4.2,
        priorityDirective: data.directive || "Immediate stabilization required."
      };
    } catch (e) {
      return {
        responderId: availableResponders[0]?.id,
        responderName: availableResponders[0]?.name,
        etaMinutes: 20,
        distanceKm: 5.0,
        priorityDirective: "Dispatcher manual override requested."
      };
    }
  }
}

export const incidentInterceptService = new IncidentInterceptService();