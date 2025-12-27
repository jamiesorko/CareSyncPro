import { GoogleGenAI } from "@google/genai";

export interface RFPOpportunity {
  title: string;
  source: string;
  deadline: string;
  valueRange: string;
  strategicPivot: string;
  draftValueProp: string;
}

export class RfpForgeService {
  private getApiKey(): string {
    return process.env.API_KEY || '';
  }

  /**
   * Scans regional procurement signals for high-value home care RFPs.
   */
  async scanProcurementSignals(region: string): Promise<RFPOpportunity[]> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    
    const query = `Active government RFPs for home care, nursing services, and specialized dementia support in ${region}, Ontario as of late 2025. Identification of contract deadlines and eligibility requirements.`;
    
    const prompt = `
      Act as an Institutional Growth Strategist. 
      Analyze: ${query}
      
      Task: Identify 2 specific RFP opportunities.
      For each, forge a 'Neural Advantage' value proposition based on our agency's use of Gemini 3 Pro for real-time safety monitoring.
      
      Return JSON array: [ { "title": "", "source": "", "deadline": "", "value": "", "pivot": "", "prop": "" } ]
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

      const data = JSON.parse(response.text || '[]');
      return data.map((d: any) => ({
        title: d.title,
        source: d.source,
        deadline: d.deadline,
        valueRange: d.value,
        strategicPivot: d.pivot,
        draftValueProp: d.prop
      }));
    } catch (e) {
      return [];
    }
  }
}

export const rfpForgeService = new RfpForgeService();