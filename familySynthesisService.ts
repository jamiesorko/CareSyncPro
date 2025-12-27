import { geminiService } from './geminiService';

export class FamilySynthesisService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  /**
   * Synthesizes a clinical log into a warm, transparent family update.
   */
  async synthesizeUpdate(patientName: string, clinicalData: string): Promise<string> {
    console.log(`[FAMILY_SYNTH]: Generating empathetic summary for ${patientName}`);
    
    const prompt = `
      Role: Empathetic Patient Liaison.
      Patient: ${patientName}
      Clinical Input: "${clinicalData}"
      
      Task: Translate this into 2 warm, reassuring sentences for a family member. 
      Avoid medical jargon. Focus on wellbeing and comfort.
    `;

    try {
      const res = await geminiService.generateText(prompt, false);
      return res.text || "Everything is going well with the care plan today.";
    } catch (e) {
      return "The care team is currently on-site and providing support.";
    }
  }
}

export const familySynthesisService = new FamilySynthesisService();