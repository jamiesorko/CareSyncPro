import { geminiService } from './geminiService'

export class MedicalTerminologyService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Uses Gemini to explain medical terms in plain English.
   */
  async simplifyTerminology(jargonText: string): Promise<string> {
    console.log(`[BRIDGE_ENGINE]: Simplification requested for clinical vector.`);
    
    const prompt = `
      Task: Act as a warm and helpful patient educator. 
      Translate the following medical jargon into simple language for a family member (5th grade reading level):
      "${jargonText}"
    `;

    try {
      const res = await geminiService.generateText(prompt, false);
      return res.text || jargonText;
    } catch (e) {
      return jargonText;
    }
  }
}

export const medicalTerminologyService = new MedicalTerminologyService();